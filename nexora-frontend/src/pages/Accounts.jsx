import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Plus, Copy, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function Accounts() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ accountName: '', customerId: '' });
  const [copiedId, setCopiedId] = useState(null);

  const { data: accounts, isLoading } = useQuery({ queryKey: ['accounts'], queryFn: api.getAccounts });
  const { data: customers } = useQuery({ queryKey: ['customers'], queryFn: api.getCustomers });

  const createMutation = useMutation({
    mutationFn: api.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setIsCreating(false);
      setFormData({ accountName: '', customerId: '' });
      toast.success('Virtual account created');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create account');
    }
  });

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Account number copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Account
        </button>
      </div>

      {isCreating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-panel p-6 rounded-xl border border-border shadow-sm overflow-hidden shrink-0"
        >
          <form onSubmit={handleCreate} className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 space-y-2 min-w-50">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted">
                Account Name
              </label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                className="w-full px-4 py-2.5 bg-matte border border-border text-text rounded-lg focus:border-primary outline-none text-sm transition-colors"
                required
              />
            </div>

            <div className="flex-1 space-y-2 min-w-50">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted">
                Link Customer (Optional)
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-4 py-2.5 bg-matte border border-border text-text rounded-lg focus:border-primary outline-none text-sm transition-colors"
              >
                <option value="">-- None --</option>
                {customers?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 border border-border text-muted hover:text-text hover:border-border/80 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-5 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 text-xs uppercase tracking-wider shadow-sm"
              >
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-panel rounded-xl border border-border p-5 h-55 animate-pulse"
            >
              <div className="h-4 bg-border/50 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-border/50 rounded w-1/4 mb-6"></div>
              <div className="h-10 bg-border/50 rounded w-full mb-4"></div>
              <div className="h-8 bg-border/50 rounded w-1/3"></div>
            </div>
          ))
        ) : accounts?.length === 0 ? (
          <div className="col-span-full p-16 text-center border border-dashed border-border rounded-xl text-muted text-sm bg-panel/30">
            No virtual accounts found. Create one to start receiving payments.
          </div>
        ) : (
          accounts?.map((account, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={account.id}
              className="bg-panel rounded-xl border border-border shadow-sm flex flex-col relative overflow-hidden group hover:border-border/80 transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-border group-hover:bg-border transition-colors"></div>

              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-semibold text-text tracking-tight">
                      {account.accountName}
                    </h3>
                    <p className="text-[10px] text-muted uppercase tracking-widest mt-1">
                      {account.bankName}
                    </p>
                  </div>

                  <span className="text-text border border-border bg-matte px-2 py-1 rounded text-[10px] font-bold shadow-sm uppercase">
                    {account.status}
                  </span>
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">
                      Account Number
                    </p>

                    <div className="flex items-center justify-between bg-matte p-3 rounded-lg border border-border">
                      <p className="font-mono text-xl text-text font-bold tracking-widest">
                        {account.accountNumber}
                      </p>

                      <button
                        onClick={() => handleCopy(account.accountNumber, account.id)}
                        className="text-muted hover:text-text transition-colors p-1"
                      >
                        {copiedId === account.id ? (
                          <CheckCircle2 className="w-5 h-5 text-text" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">
                      Available Balance
                    </p>
                    <p className="font-bold text-text font-mono text-2xl tracking-tight">
                      ₦{(account.balance || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-matte/80 text-[10px] text-muted flex justify-between items-center border-t border-border mt-auto">
                <span className="font-mono uppercase">REF: {account.reference}</span>
                <span className="font-bold uppercase tracking-wider">
                  {account._count?.transactions || 0} TXNS
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}