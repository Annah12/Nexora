// src/routes/meta.js
// /api/me, /api/docs (OpenAPI), /api/seed

import express from 'express';
import prisma from '../lib/db.js';
import { v4 as uuidv4 } from 'uuid';
import { reconcileInboundTransfer } from '../services/reconciliation.js';

const router = express.Router();

// GET /api/me
router.get('/me', async (req, res) => {
  try {
    const merchant = await prisma.merchant.findFirst();
    if (!merchant) return res.status(404).json({ error: 'Merchant not configured' });

    res.json({
      id: merchant.id,
      name: merchant.name,
      email: merchant.email,
      apiKey: merchant.apiKey,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch merchant profile' });
  }
});

// GET /api/docs — returns OpenAPI spec for the Developers page
router.get('/docs', (req, res) => {
  const spec = {
    openapi: '3.0.1',
    info: {
      title: 'Nexora API',
      version: '1.0.0',
      description: 'Dedicated Virtual Account & Reconciliation Engine — Powered by Nomba',
    },
    paths: {
      '/api/public/v1/virtual-accounts': {
        post: {
          description: 'Provision a customer-named dedicated virtual account. Returns a permanent NUBAN the customer can use for all transfers.',
        },
        get: {
          description: 'List all virtual accounts under your merchant. Supports ?customerId filter.',
        },
      },
      '/api/public/v1/virtual-accounts/{accountRef}': {
        get: {
          description: 'Fetch a single virtual account with current balance and status.',
        },
        patch: {
          description: 'Rename a virtual account or update its status (ACTIVE, FROZEN, CLOSED). Edge: cannot reactivate a CLOSED account.',
        },
        delete: {
          description: 'Close a virtual account permanently. Blocked if balance > 0 unless ?force=true.',
        },
      },
      '/api/public/v1/statements/{accountRef}': {
        get: {
          description: 'Get the full ledger statement for a virtual account: every credit, debit, and running balance.',
        },
      },
      '/api/public/v1/reconciliation/report': {
        get: {
          description: 'Get reconciliation metrics: efficiency %, matched vs unmatched counts, and total naira volumes.',
        },
      },
      '/api/public/v1/exceptions': {
        get: {
          description: 'List all unmatched, overpaid, or misdirected transactions awaiting manual review.',
        },
      },
      '/api/public/v1/exceptions/{id}/resolve': {
        post: {
          description: 'Manually resolve an exception — marks it matched and updates the transaction record.',
        },
      },
      '/api/public/v1/transfers': {
        post: {
          description: 'Initiate an outbound bank transfer or wallet transfer from your Nexora merchant balance.',
        },
      },
      '/webhooks/nomba': {
        post: {
          description: 'Nomba webhook receiver. Verifies HMAC-SHA256 signature, deduplicates by requestId, and triggers reconciliation.',
        },
      },
    },
  };

  res.json(spec);
});

// POST /api/seed — populate demo data for judges
router.post('/seed', async (req, res) => {
  try {
    // Check if already seeded
    const existing = await prisma.merchant.findFirst();

    if (!existing) {
      // Create merchant
      await prisma.merchant.create({
        data: {
          id: uuidv4(),
          name: 'Nexora Demo Merchant',
          email: 'admin@nexora.dev',
          apiKey: `nxr_live_${uuidv4().replace(/-/g, '').slice(0, 32)}`,
          webhookSecret: 'NombaHackathon2026',
          nombaAccountId: process.env.NOMBA_ACCOUNT_ID || 'demo_account_id',
          merchantBalance: 2_450_000,
        },
      });
    }

    const merchant = await prisma.merchant.findFirst();

    // Create demo customers
    const customerData = [
      { firstName: 'Adaeze', lastName: 'Okafor', email: 'adaeze@acmecorp.ng', phone: '08012345678', bvn: '12345678901', kycTier: 2 },
      { firstName: 'Emeka', lastName: 'Nwosu', email: 'emeka@globex.ng', phone: '08087654321', bvn: null, kycTier: 1 },
      { firstName: 'Fatima', lastName: 'Aliyu', email: 'fatima@initech.ng', phone: '07011223344', bvn: '98765432109', kycTier: 2 },
      { firstName: 'Chidi', lastName: 'Eze', email: 'chidi@umbrella.ng', phone: '09023456789', bvn: null, kycTier: 1 },
    ];

    const customers = [];
    for (const cd of customerData) {
      const c = await prisma.customer.upsert({
        where: { email: cd.email },
        update: {},
        create: { id: uuidv4(), ...cd },
      });
      customers.push(c);
    }

    // Create virtual accounts for each customer
    const accountDefs = [
      { accountName: 'ACME CORP COLLECTIONS', bankName: 'Nombank MFB', accountNumber: '9391076543' },
      { accountName: 'GLOBEX PAYMENTS', bankName: 'Nombank MFB', accountNumber: '9391076544' },
      { accountName: 'INITECH INVOICES', bankName: 'Nombank MFB', accountNumber: '9391076545' },
      { accountName: 'UMBRELLA TRANSFERS', bankName: 'Nombank MFB', accountNumber: '9391076546' },
    ];

    const virtualAccounts = [];
    for (let i = 0; i < customers.length; i++) {
      const shortId = customers[i].id.replace(/-/g, '').slice(0, 8);
      const accountRef = `nexora_${shortId}_seed${i}x01`;

      const va = await prisma.virtualAccount.upsert({
        where: { accountRef },
        update: {},
        create: {
          id: uuidv4(),
          accountName: accountDefs[i].accountName,
          accountRef,
          accountNumber: accountDefs[i].accountNumber,
          bankName: accountDefs[i].bankName,
          status: 'ACTIVE',
          balance: 0,
          customerId: customers[i].id,
        },
      });
      virtualAccounts.push(va);
    }

    // Create invoices
    const invoiceDefs = [
      { customerId: customers[0].id, amount: 120_000, status: 'PENDING', daysFromNow: 7 },
      { customerId: customers[1].id, amount: 52_000, status: 'PENDING', daysFromNow: 3 },
      { customerId: customers[2].id, amount: 24_000, status: 'PENDING', daysFromNow: 14 },
      { customerId: customers[3].id, amount: 40_000, status: 'PENDING', daysFromNow: 5 },
    ];

    const invoices = [];
    for (let idx = 0; idx < invoiceDefs.length; idx++) {
      const id = invoiceDefs[idx];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + id.daysFromNow);

      // Use a deterministic reference keyed by customer index so re-seeding is idempotent
      const seedRef = `INV-SEED-C${idx}-V1`;

      const inv = await prisma.invoice.upsert({
        where: { reference: seedRef },
        update: {},
        create: {
          id: uuidv4(),
          reference: seedRef,
          amount: id.amount,
          dueDate,
          customerId: id.customerId,
          status: 'PENDING',
        },
      });
      invoices.push(inv);
    }

    // Simulate 3 reconciled transactions (fully matched)
    const txAmounts = [120_000, 52_000, 18_000]; // last one is a partial
    for (let i = 0; i < Math.min(3, virtualAccounts.length); i++) {
      const fakeReqId = `seed_txn_${i}_${Date.now()}`;
      const existing = await prisma.transaction.findUnique({ where: { nombaRequestId: fakeReqId } });
      if (!existing) {
        await reconcileInboundTransfer({
          accountRef: virtualAccounts[i].accountRef,
          amount: txAmounts[i],
          senderName: `Demo Sender ${i + 1}`,
          senderAccount: `000000000${i}`,
          narration: 'Seed transaction',
          nombaRequestId: fakeReqId,
          nombaSessionId: `seed_session_${i}`,
        });
      }
    }

    // Create some demo merchant services
    const serviceStatuses = ['SUCCESS', 'SUCCESS', 'FAILED', 'PENDING_APPROVAL'];
    const serviceTypes = ['AIRTIME', 'DATA', 'AIRTIME', 'BANK TRANSFER'];
    for (let i = 0; i < 4; i++) {
      const ref = `SVC-SEED-${i}-${Date.now()}`;
      const existing = await prisma.merchantService.findUnique({ where: { reference: ref } });
      if (!existing) {
        await prisma.merchantService.create({
          data: {
            id: uuidv4(),
            type: serviceTypes[i],
            destination: `0800000000${i}`,
            amount: [5000, 3000, 2000, 850_000][i],
            status: serviceStatuses[i],
            reference: ref,
            merchantId: merchant.id,
          },
        });
      }
    }

    // Create a demo settlement
    const settlementRef = `STLMT-SEED-${Date.now()}`;
    const existingSettlement = await prisma.settlement.findUnique({ where: { reference: settlementRef } });
    if (!existingSettlement) {
      await prisma.settlement.create({
        data: {
          id: uuidv4(),
          amount: 8_200_000,
          status: 'COMPLETED',
          reference: settlementRef,
          merchantId: merchant.id,
        },
      });
    }

    res.json({ success: true, message: 'Demo data seeded successfully' });
  } catch (err) {
    console.error('[seed] error:', err);
    res.status(500).json({ error: 'Seeding failed: ' + err.message });
  }
});

export default router;
