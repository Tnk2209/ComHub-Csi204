import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';

function AdminAccounts({ onNavigate }) {
  const { t } = useTranslation();

  const [accounts, setAccounts] = useState([
    {
      id: 1,
      username: 'admin_root',
      fullName: 'Root Admin',
      role: 'Admin',
      email: 'root@comhub.com',
      createdAt: '2024-01-15',
      isActive: true
    },
    {
      id: 2,
      username: 'somchai_x',
      fullName: 'สมชาย ใจดี',
      role: 'Customer',
      email: 'somchai@example.com',
      createdAt: '2024-02-20',
      isActive: true
    },
    {
      id: 3,
      username: 'napha',
      fullName: 'นภา สายฟ้า',
      role: 'Customer',
      email: 'napha@example.com',
      createdAt: '2024-03-10',
      isActive: true
    },
    {
      id: 4,
      username: 'admin_it',
      fullName: 'IT Manager',
      role: 'Admin',
      email: 'it@comhub.com',
      createdAt: '2024-03-05',
      isActive: true
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Customer'
  });

  const handleEdit = (account) => {
    setEditingAccount(account.id);
    setFormData({
      username: account.username,
      fullName: account.fullName,
      email: account.email,
      password: '',
      confirmPassword: '',
      role: account.role
    });
    setIsCreating(true);
  };

  const handleDelete = (id) => {
    const account = accounts.find((a) => a.id === id);
    if (confirm(t('admin_accounts.confirm_delete', { username: account.username }))) {
      setAccounts(accounts.filter((a) => a.id !== id));
      alert(t('admin_accounts.delete_success'));
    }
  };

  const handleSave = () => {
    // Validation
    if (!formData.username || !formData.fullName || !formData.email || !formData.role) {
      alert(t('admin_accounts.validation_required'));
      return;
    }

    if (!editingAccount && !formData.password) {
      alert(t('admin_accounts.validation_password'));
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert(t('admin_accounts.validation_password_mismatch'));
      return;
    }

    const newAccount = {
      id: editingAccount || Date.now(),
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      createdAt: editingAccount
        ? accounts.find((a) => a.id === editingAccount).createdAt
        : new Date().toISOString().split('T')[0],
      isActive: true
    };

    if (editingAccount) {
      setAccounts(accounts.map((a) => (a.id === editingAccount ? newAccount : a)));
      alert(t('admin_accounts.update_success'));
    } else {
      setAccounts([...accounts, newAccount]);
      alert(t('admin_accounts.create_success'));
    }

    handleCancel();
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingAccount(null);
    setShowPassword(false);
    setFormData({
      username: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Customer'
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const getRoleBadge = (role) => {
    if (role === 'Admin') {
      return (
        <span className="inline-flex items-center bg-blue/10 text-blue text-xs font-semibold px-3 py-1 rounded-full">
          {t('admin_accounts.admin')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center bg-green/10 text-green text-xs font-semibold px-3 py-1 rounded-full">
        {t('admin_accounts.customer')}
      </span>
    );
  };

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
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-blue hover:bg-blue/90 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            {t('admin_accounts.create_account')}
          </button>
        </div>

        {/* Stats */}
        {!isCreating && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
              <div className="text-sm text-app-text-muted mb-1">{t('admin_accounts.total_accounts')}</div>
              <div className="text-3xl font-bold text-blue">{accounts.length}</div>
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
        )}

        {/* Create/Edit Form */}
        {isCreating && (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 mb-8">
            <h2 className="text-xl font-bold text-app-text mb-6">
              {editingAccount ? t('admin_accounts.edit_account') : t('admin_accounts.new_account')}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">
                    {t('admin_accounts.username')} *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="somchai_x"
                    className="w-full px-4 py-3 bg-bg-secondary border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">
                    {t('admin_accounts.full_name')} *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="สมชาย ใจดี"
                    className="w-full px-4 py-3 bg-bg-secondary border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">
                    {t('admin_accounts.email')} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="somchai@example.com"
                    className="w-full px-4 py-3 bg-bg-secondary border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">
                    {t('admin_accounts.role')} *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-4 py-3 bg-bg-secondary border border-app-border rounded-lg text-app-text focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                  >
                    <option value="Customer">{t('admin_accounts.customer')}</option>
                    <option value="Admin">{t('admin_accounts.admin')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">
                    {t('admin_accounts.password')} {!editingAccount && '*'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder={editingAccount ? t('admin_accounts.leave_blank') : '••••••••'}
                      className="w-full px-4 py-3 pr-12 bg-bg-secondary border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-app-text-muted hover:text-app-text"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">
                    {t('admin_accounts.confirm_password')} {!editingAccount && '*'}
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder={editingAccount ? t('admin_accounts.leave_blank') : '••••••••'}
                    className="w-full px-4 py-3 bg-bg-secondary border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-grow flex items-center justify-center gap-2 bg-blue hover:bg-blue/90 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  <Save className="w-5 h-5" />
                  {editingAccount ? t('admin_accounts.update') : t('admin_accounts.create')}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-bg-secondary hover:bg-bg-tertiary text-app-text rounded-lg font-medium transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Accounts Table */}
        {!isCreating && (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary border-b border-app-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">
                      {t('admin_accounts.user')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">
                      {t('admin_accounts.email')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">
                      {t('admin_accounts.role')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">
                      {t('admin_accounts.created')}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-app-text uppercase">
                      {t('admin_accounts.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border">
                  {accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-bg-secondary transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-app-text">{account.fullName}</div>
                          <div className="text-xs text-app-text-muted">@{account.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-app-text">{account.email}</div>
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(account.role)}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-app-text-muted">{account.createdAt}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(account)}
                            className="p-2 text-blue hover:bg-blue/10 rounded-lg transition-all"
                            title={t('admin_accounts.edit')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(account.id)}
                            className="p-2 text-red hover:bg-red/10 rounded-lg transition-all"
                            title={t('admin_accounts.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAccounts;
