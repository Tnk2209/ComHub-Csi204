import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Users, Search, ChevronLeft, ChevronRight, UserPlus, X } from 'lucide-react';
import * as adminService from '../../services/adminService';

function AdminAccounts({ onNavigate }) {
  const { t } = useTranslation();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password || !firstName.trim() || !lastName.trim()) {
      Swal.fire({ icon: 'warning', title: t('common.warning', 'Warning'), text: t('admin_accounts.validation_required') });
      return;
    }
    if (password.length < 6) {
      Swal.fire({ icon: 'warning', title: t('common.warning', 'Warning'), text: t('auth.password_min', 'Password must be at least 6 characters') });
      return;
    }
    setSubmitting(true);
    try {
      await adminService.createAdminUser({
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim()
      });
      Swal.fire({ icon: 'success', title: t('common.success', 'Success'), text: t('admin_accounts.create_success') });
      setIsModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to create admin account' });
    } finally {
      setSubmitting(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { limit, offset: (page - 1) * limit };
      if (search.trim()) params.search = search.trim();
      const data = await adminService.listUsers(params);
      setAccounts(data.users || []);
      setTotal(data.total || 0);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleChangeRole = async (user) => {
    const newRole = user.role === 'Admin' ? 'Customer' : 'Admin';
    const result = await Swal.fire({
      title: t('admin_accounts.confirm_role_change', { name: user.email, role: newRole }),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007AFF',
      cancelButtonColor: '#6c757d',
      confirmButtonText: t('common.confirm', 'Confirm'),
      cancelButtonText: t('common.cancel', 'Cancel')
    });
    if (!result.isConfirmed) return;
    try {
      await adminService.changeUserRole(user.id, newRole);
      fetchUsers();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to change role' });
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.is_active;
    const action = newStatus ? 'enable' : 'disable';
    const result = await Swal.fire({
      title: t('admin_accounts.confirm_status_change', { name: user.email, action }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#007AFF',
      cancelButtonColor: '#6c757d',
      confirmButtonText: t('common.confirm', 'Confirm'),
      cancelButtonText: t('common.cancel', 'Cancel')
    });
    if (!result.isConfirmed) return;
    try {
      await adminService.changeUserStatus(user.id, newStatus);
      fetchUsers();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to change status' });
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'Admin') {
      return <span className="inline-flex items-center bg-blue/10 text-blue text-xs font-semibold px-3 py-1 rounded-full">{t('admin_accounts.admin')}</span>;
    }
    return <span className="inline-flex items-center bg-green/10 text-green text-xs font-semibold px-3 py-1 rounded-full">{t('admin_accounts.customer')}</span>;
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return <span className="inline-flex items-center bg-green/10 text-green text-xs font-semibold px-3 py-1 rounded-full">Active</span>;
    }
    return <span className="inline-flex items-center bg-red/10 text-red text-xs font-semibold px-3 py-1 rounded-full">Disabled</span>;
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue" />
            <div>
              <h1 className="text-3xl font-bold text-app-text">{t('admin_accounts.title')}</h1>
              <p className="text-sm text-app-text-muted">{t('admin_accounts.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue hover:bg-blue/90 text-white px-4 py-2.5 rounded-lg font-semibold transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            {t('admin_accounts.add_admin_btn', 'Add Admin')}
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-app-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('admin_accounts.search_placeholder')}
                className="w-full pl-10 pr-4 py-3 bg-app-surface border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-blue hover:bg-blue/90 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              {t('admin_accounts.search_btn')}
            </button>
          </div>
        </form>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <div className="text-sm text-app-text-muted mb-1">{t('admin_accounts.total_accounts')}</div>
            <div className="text-3xl font-bold text-blue">{total}</div>
          </div>
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <div className="text-sm text-app-text-muted mb-1">{t('admin_accounts.customer_count')}</div>
            <div className="text-3xl font-bold text-green">
              {accounts.filter((a) => a.role === 'Customer').length}
            </div>
          </div>
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <div className="text-sm text-app-text-muted mb-1">{t('admin_accounts.admin_count')}</div>
            <div className="text-3xl font-bold text-blue">
              {accounts.filter((a) => a.role === 'Admin').length}
            </div>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-app-text-muted">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary border-b border-app-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">{t('admin_accounts.user')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">{t('admin_accounts.email')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">{t('admin_accounts.role')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-app-text uppercase">{t('admin_accounts.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border">
                  {accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-bg-secondary transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-app-text">
                          {account.first_name} {account.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-app-text">{account.email}</div>
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(account.role)}</td>
                      <td className="px-6 py-4">{getStatusBadge(account.is_active)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleChangeRole(account)}
                            className="text-xs bg-blue/10 text-blue hover:bg-blue/20 px-3 py-1.5 rounded-lg font-medium transition-all"
                          >
                            {account.role === 'Admin' ? 'Set Customer' : 'Set Admin'}
                          </button>
                          <button
                            onClick={() => handleToggleStatus(account)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                              account.is_active
                                ? 'bg-red/10 text-red hover:bg-red/20'
                                : 'bg-green/10 text-green hover:bg-green/20'
                            }`}
                          >
                            {account.is_active ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-app-border">
              <span className="text-sm text-app-text-muted">
                Page {page} of {totalPages} ({total} users)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-app-surface border border-app-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-app-border bg-bg-secondary">
              <h2 className="text-xl font-bold text-app-text flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue" />
                {t('admin_accounts.add_admin_title')}
              </h2>
              <button
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="p-1 rounded-lg hover:bg-app-border text-app-text-muted hover:text-app-text transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-app-text mb-1">{t('admin_accounts.email')} *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2 bg-app-surface border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-app-text mb-1">{t('admin_accounts.password')} *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 bg-app-surface border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-app-text mb-1">{t('auth.first_name', 'First Name')} *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-3 py-2 bg-app-surface border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-app-text mb-1">{t('auth.last_name', 'Last Name')} *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-3 py-2 bg-app-surface border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-app-border mt-6">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 rounded-lg bg-bg-secondary hover:bg-app-border text-app-text font-semibold transition-all cursor-pointer"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue hover:bg-blue/90 disabled:opacity-50 text-white font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  {submitting ? 'Submitting...' : t('common.submit', 'Submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAccounts;
