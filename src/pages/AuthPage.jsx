import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Phone, Calendar, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';

const AuthPage = ({ mode = 'login' }) => {
    const { t } = useTranslation();
    const { login, register, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        birthDate: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = useGoogleLogin({
        flow: 'implicit',
        ux_mode: 'popup',
        scope: 'openid email profile',
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                await googleLogin(tokenResponse.access_token);
                navigate('/dashboard');
            } catch (err) {
                setError(t('auth.error_google'));
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google login error:', error);
            setError(t('auth.error_google_failed'));
        }
    });

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');

        if (mode === 'signup' && step === 1) {
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
                setError(t('auth.error_required'));
                return;
            }
            setStep(2);
            return;
        }

        setLoading(true);
        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
            } else {
                await register(formData);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || t('auth.error_generic'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen dashboard-bg flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-white/10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                        {mode === 'login' ? t('auth.login_title') : t('auth.signup_title')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        {mode === 'login'
                            ? t('auth.login_subtitle')
                            : (step === 1 ? t('auth.signup_subtitle_step1') : t('auth.signup_subtitle_step2'))}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-300 rounded-2xl flex items-center gap-2 text-sm font-medium">
                        <Info className="w-4 h-4" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                        {mode === 'login' ? (
                            <motion.div
                                key="login-fields"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder={t('auth.email', 'Email')}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 focus:border-primary focus:bg-white dark:focus:bg-white/10 rounded-2xl outline-hidden transition-all text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder={t('auth.password')}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 focus:border-primary focus:bg-white dark:focus:bg-white/10 rounded-2xl outline-hidden transition-all text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </motion.div>
                        ) : step === 1 ? (
                            <motion.div
                                key="signup-step-1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={t('auth.firstname')}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 focus:border-primary focus:bg-white dark:focus:bg-white/10 rounded-2xl outline-hidden transition-all text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={t('auth.lastname')}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 focus:border-primary focus:bg-white dark:focus:bg-white/10 rounded-2xl outline-hidden transition-all text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 focus:border-primary focus:bg-white dark:focus:bg-white/10 rounded-2xl outline-hidden transition-all text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder={t('auth.password')}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 focus:border-primary focus:bg-white dark:focus:bg-white/10 rounded-2xl outline-hidden transition-all text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup-step-2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline mb-2"
                                >
                                    <ChevronLeft className="w-3 h-3" /> {t('auth.back')}
                                </button>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        placeholder={t('auth.phone')}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 focus:border-primary focus:bg-white dark:focus:bg-white/10 rounded-2xl outline-hidden transition-all text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-4">{t('auth.birthdate')}</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="date"
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 focus:border-primary focus:bg-white dark:focus:bg-white/10 rounded-2xl outline-hidden transition-all text-sm font-medium text-gray-900 dark:text-white"
                                            value={formData.birthDate}
                                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button type="submit" className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 group bg-primary hover:bg-primary-dark shadow-xl shadow-primary/20" disabled={loading}>
                        {loading
                            ? t('auth.loading')
                            : (mode === 'login'
                                ? t('auth.btn_login')
                                : (step === 1 ? t('auth.btn_continue') : t('auth.btn_register')))}
                        {!loading && (mode === 'signup' && step === 1
                            ? <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />)}
                    </Button>
                </form>

                {mode === 'login' && (
                    <>
                        <div className="mt-8 relative text-center">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-white/10"></div></div>
                            <span className="relative px-4 bg-white dark:bg-slate-900 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('auth.or_continue')}</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mt-6">
                            <button
                                onClick={() => handleGoogleLogin()}
                                className="w-full py-3 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-bold text-sm text-gray-900 dark:text-white"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                        </div>
                    </>
                )}

                <p className="mt-8 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {mode === 'login' ? (
                        <>{t('auth.no_account')} <Link to="/signup" className="text-primary hover:underline font-bold">{t('auth.register_link')}</Link></>
                    ) : (
                        <>{t('auth.already_account')} <Link to="/login" className="text-primary hover:underline font-bold">{t('auth.login_link')}</Link></>
                    )}
                </p>
            </motion.div>
        </div>
    );
};

export default AuthPage;

