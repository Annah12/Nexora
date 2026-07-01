import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { DataTable } from '../components/ui/DataTable';
import { toast } from 'sonner';

export default function Customers() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', bvn: '' });

  const { data: customers, isLoading } = useQuery({ queryKey: ['customers'], queryFn: api.getCustomers });

  const createMutation = useMutation({
    mutationFn: api.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsCreating(false);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', bvn: '' });
      toast.success('Customer created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create customer');
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const columns = [
    { 
      header: 'Name', 
      accessorKey: 'firstName',
      cell: (item) => (
        <div>
          <p className="font-semibold text-gray-700">{item.firstName} {item.lastName}</p>
          <p className="text-[10px] text-muted font-mono tracking-wider">{item.id}</p>
        </div>
      ),
      sortable: true,
    },
    { 
      header: 'Contact', 
      accessorKey: 'email', 
      cell: (item) => (
        <div>
          <p className="text-gray-500 text-sm">{item.email}</p>
          <p className="text-xs text-muted">{item.phone}</p>
        </div>
      ),
      sortable: true
    },
    { 
      header: 'KYC Tier', 
      accessorKey: 'kycTier', 
      cell: (item) => (
        <span className="text-gray-700 border border-border bg-matte px-2 py-1 rounded text-[10px] font-bold shadow-sm uppercase tracking-wider">
          TIER {item.kycTier}
        </span>
      ),
      sortable: true
    },
    { 
      header: 'Joined', 
      accessorKey: 'createdAt', 
      cell: (item) => <span className="text-muted text-xs">{new Date(item.createdAt).toLocaleDateString()}</span>,
      sortable: true
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center justify-center gap-2 bg-gold hover:bg-yellow-500 text-matte px-4 py-2 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {isCreating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-panel p-6 rounded-xl border border-border shadow-sm shrink-0"
        >
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2.5 bg-matte border border-border text-gray-600 rounded-lg focus:border-gold outline-none text-sm transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2.5 bg-matte border border-border text-gray-600 rounded-lg focus:border-gold outline-none text-sm transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-matte border border-border text-gray-600 rounded-lg focus:border-gold outline-none text-sm transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-matte border border-border text-gray-600 rounded-lg focus:border-gold outline-none text-sm transition-colors"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted">
                BVN (Optional - upgrades to Tier 2)
              </label>
              <input
                type="text"
                value={formData.bvn}
                onChange={(e) => setFormData({ ...formData, bvn: e.target.value })}
                className="w-full px-4 py-2.5 bg-matte border border-border text-gray-600 rounded-lg focus:border-gold outline-none text-sm transition-colors font-mono tracking-widest"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 border border-border text-muted hover:text-gray-600 hover:border-border/80 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>

              <button
                type="submit"
                onClick={createMutation.isPending}
                className="px-5 py-2.5 bg-gold text-matte rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 text-xs uppercase tracking-wider shadow-sm cursor-pointer"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Customer'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <DataTable
        columns={columns}
        data={customers || []}
        isLoading={isLoading}
        searchKey="email"
        searchPlaceholder="Search by email..."
        emptyMessage="No customers found. Add your first customer."
      />
    </div>
  );
}