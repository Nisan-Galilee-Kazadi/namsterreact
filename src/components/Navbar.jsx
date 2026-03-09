import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, Play, Home as HomeIcon, User as UserIcon, MonitorPlay } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Desktop Header - Top */}
            <header className="hidden md:flex items-center gap-6 mb-12 sticky top-0 z-[100] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl py-4 px-2 -mx-2 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-linear-to-r from-primary to-accent rounded-xl blur opacity-25"></div>
                        <img src="/images/logo.png" alt="Namster" className="relative w-12 h-12 rounded-xl shadow-lg glass-card p-1" />
                    </div>
                    <div className="min-w-0">
                        <Link to="/" className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-primary to-accent block">Namster</Link>
                        <p className="text-gray-500 dark:text-white/60 text-xs font-semibold uppercase tracking-widest leading-tight">Premium Edition</p>
                    </div>
                </div>
                <nav className="flex items-center gap-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 dark:border-white/10 shadow-sm ml-auto">
                    <Link
                        to="/"
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 dark:text-white hover:bg-white/50 dark:hover:bg-white/10'}`}
                    >
                        <HomeIcon className="w-4 h-4" /> <span>{t('nav.home')}</span>
                    </Link>
                    <Link
                        to="/features"
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/features') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 dark:text-white hover:bg-white/50 dark:hover:bg-white/10'}`}
                    >
                        <Star className="w-4 h-4" /> <span>{t('nav.features')}</span>
                    </Link>
                    <Link
                        to="/demo"
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/demo') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 dark:text-white hover:bg-white/50 dark:hover:bg-white/10'}`}
                    >
                        <MonitorPlay className="w-4 h-4" /> <span>{t('nav.demo')}</span>
                    </Link>
                    {user ? (
                        <Link
                            to="/dashboard"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/dashboard') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 dark:text-white hover:bg-white/50 dark:hover:bg-white/10'}`}
                        >
                            <UserIcon className="w-4 h-4" /> <span>{t('nav.dashboard')}</span>
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all"
                        >
                            <span>{t('nav.login')}</span>
                        </Link>
                    )}
                    <Link
                        to="/app"
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/app') ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-primary text-white hover:scale-[1.02] active:scale-[0.98]'}`}
                    >
                        <Play className="w-4 h-4 fill-current" /> {t('nav.launch')}
                    </Link>
                    <div className="ml-2 pl-2 flex items-center gap-1 border-l border-gray-200 dark:border-white/10">
                        <LanguageSelector />
                        <ThemeToggle />
                    </div>
                </nav>
            </header>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--nav-bg)] backdrop-blur-xl border-t border-gray-100 dark:border-white/10 px-6 py-3 flex items-center justify-between shadow-[0_-8px_30px_rgb(0,0,0,0.4)]">
                <Link
                    to="/"
                    className={`flex flex-col items-center gap-1 transition-all ${isActive('/') ? 'text-primary scale-110' : 'text-gray-400 dark:text-white'}`}
                >
                    <HomeIcon className={`w-6 h-6 ${isActive('/') ? 'fill-primary/10' : ''}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider hidden md:block">{t('nav.home')}</span>
                </Link>
                <Link
                    to="/demo"
                    className={`flex flex-col items-center gap-1 transition-all ${isActive('/demo') ? 'text-primary scale-110' : 'text-gray-400 dark:text-white'}`}
                >
                    <MonitorPlay className={`w-6 h-6 ${isActive('/demo') ? 'fill-primary/10' : ''}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('nav.demo')}</span>
                </Link>
                <Link
                    to="/app"
                    className="relative -top-8"
                >
                    <div className="w-16 h-16 bg-primary rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center text-white border-4 border-white dark:border-slate-900 transition-colors">
                        <Play className="w-12 h-12 fill-current translate-x-0.5" />
                    </div>
                </Link>
                <Link
                    to="/features"
                    className={`flex flex-col items-center gap-1 transition-all ${isActive('/features') ? 'text-primary scale-110' : 'text-gray-400 dark:text-white'}`}
                >
                    <Star className={`w-6 h-6 ${isActive('/features') ? 'fill-primary/10' : ''}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('nav.functions')}</span>
                </Link>
                {user ? (
                    <Link
                        to="/dashboard"
                        className={`flex flex-col items-center gap-1 transition-all ${isActive('/dashboard') ? 'text-primary scale-110' : 'text-gray-400 dark:text-white'}`}
                    >
                        <UserIcon className={`w-6 h-6 ${isActive('/dashboard') ? 'fill-primary/10' : ''}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{t('nav.profile')}</span>
                    </Link>
                ) : (
                    <Link
                        to="/login"
                        className={`flex flex-col items-center gap-1 transition-all ${isActive('/login') ? 'text-primary scale-110' : 'text-gray-400 dark:text-white'}`}
                    >
                        <UserIcon className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{t('nav.login')}</span>
                    </Link>
                )}
            </nav>

            {/* Mobile Header Branding (Top) */}
            <div className="md:hidden flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <img src="/images/logo.png" alt="Namster" className="w-10 h-10 rounded-lg glass-card p-1 shadow-sm border border-white/40 dark:border-white/10" />
                    <h1 className="text-xl font-black bg-clip-text text-transparent bg-linear-to-r from-primary to-accent">Namster</h1>
                </div>
                <div className="flex items-center gap-3">
                    <LanguageSelector />
                    <ThemeToggle />
                    <div className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest border border-gray-100 dark:border-white/10 rounded-md px-2 py-1">v2.0</div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
