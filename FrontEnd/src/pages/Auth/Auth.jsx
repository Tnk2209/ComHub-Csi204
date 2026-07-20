import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function Auth({ onNavigate }) {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError(t('login.validation_required'));
        return;
      }

      setSubmitting(true);
      try {
        const loggedInUser = await login({ email: formData.email, password: formData.password });
        onNavigate(loggedInUser.role === 'Admin' ? 'admin-dashboard' : 'landing');
      } catch (err) {
        setError(err.body?.message || t('login.login_failed', 'Login failed'));
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
        setError(t('register.validation_required'));
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError(t('register.validation_password_mismatch'));
        return;
      }

      if (formData.password.length < 8) {
        setError(t('register.validation_password_length'));
        return;
      }

      if (!agreeToTerms) {
        setError(t('register.validation_terms'));
        return;
      }

      const nameParts = formData.fullName.trim().split(/\s+/);
      const first_name = nameParts[0];
      const last_name = nameParts.slice(1).join(' ') || '-';

      setSubmitting(true);
      try {
        await register({ email: formData.email, password: formData.password, first_name, last_name });
        onNavigate('landing');
      } catch (err) {
        setError(err.body?.message || t('register.register_failed', 'Registration failed'));
      } finally {
        setSubmitting(false);
      }
    }
  };

  const toggleMode = () => {
    setMode(isLogin ? 'register' : 'login');
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setAgreeToTerms(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-text-primary mb-2">
            {isLogin ? t('login.welcome_back') : t('register.create_account')}
          </h1>
          <p className="text-text-secondary text-sm">
            {isLogin ? t('login.subtitle') : t('register.subtitle')}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-bg-surface rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Full Name Field (Register only) */}
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
                  {t('register.full_name')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t('register.full_name_placeholder')}
                    className="w-full pl-11 pr-4 py-3 bg-bg-secondary text-text-primary rounded-lg border border-separator-light dark:border-separator-dark focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                {isLogin ? t('login.email') : t('register.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={isLogin ? t('login.email_placeholder') : t('register.email_placeholder')}
                  className="w-full pl-11 pr-4 py-3 bg-bg-secondary text-text-primary rounded-lg border border-separator-light dark:border-separator-dark focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                {isLogin ? t('login.password') : t('register.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={isLogin ? t('login.password_placeholder') : t('register.password_placeholder')}
                  className="w-full pl-11 pr-12 py-3 bg-bg-secondary text-text-primary rounded-lg border border-separator-light dark:border-separator-dark focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-1 text-xs text-text-tertiary">{t('register.password_hint')}</p>
              )}
            </div>

            {/* Confirm Password Field (Register only) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                  {t('register.confirm_password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder={t('register.confirm_password_placeholder')}
                    className="w-full pl-11 pr-12 py-3 bg-bg-secondary text-text-primary rounded-lg border border-separator-light dark:border-separator-dark focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password (Login only) */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-separator-light dark:border-separator-dark text-blue focus:ring-2 focus:ring-blue focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-text-secondary">
                    {t('login.remember_me')}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => Swal.fire({ icon: 'info', title: t('login.forgot_password_info') })}
                  className="text-sm text-blue hover:text-blue/80 font-medium transition-colors"
                >
                  {t('login.forgot_password')}
                </button>
              </div>
            )}

            {/* Terms & Conditions (Register only) */}
            {!isLogin && (
              <div className="pt-2">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-separator-light dark:border-separator-dark text-blue focus:ring-2 focus:ring-blue focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                    {t('register.agree_to')}{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        Swal.fire({ icon: 'info', title: t('register.terms_info') });
                      }}
                      className="text-blue hover:text-blue/80 font-medium"
                    >
                      {t('register.terms_link')}
                    </button>
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue hover:bg-blue/90 text-white font-semibold py-3 rounded-lg transition-all shadow-[0_1px_3px_rgba(0,122,255,0.3)] hover:shadow-[0_2px_6px_rgba(0,122,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? '...'
                : isLogin ? t('login.sign_in') : t('register.create_account_button')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-separator-light dark:border-separator-dark"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-bg-surface text-text-tertiary">
                {isLogin ? t('login.or') : t('register.or')}
              </span>
            </div>
          </div>

          {/* Toggle Mode Link */}
          <div className="text-center">
            <span className="text-sm text-text-secondary">
              {isLogin ? t('login.no_account') : t('register.have_account')}{' '}
            </span>
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-blue hover:text-blue/80 font-semibold transition-colors"
            >
              {isLogin ? t('login.sign_up') : t('register.sign_in')}
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate('landing')}
            className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
          >
            ← {isLogin ? t('login.back_to_home') : t('register.back_to_home')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
