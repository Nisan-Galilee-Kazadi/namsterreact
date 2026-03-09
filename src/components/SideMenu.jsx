import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    History,
    FileStack,
    Settings,
    LogOut,
    ShieldCheck,
    User,
    MessageSquare,
    Star,
    ChevronLeft,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

const SideMenu = ({ isCollapsed, setIsCollapsed }) => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems = [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: t('sidemenu.dashboard'), path: '/dashboard' },
        { icon: <FileStack className="w-5 h-5" />, label: t('sidemenu.templates'), path: '/templates' },
        { icon: <History className="w-5 h-5" />, label: t('sidemenu.history'), path: '/history' },
        { icon: <MessageSquare className="w-5 h-5" />, label: t('sidemenu.feedback'), path: '/feedback' },
        { icon: <Settings className="w-5 h-5" />, label: t('sidemenu.settings'), path: '/settings' },
    ];

    if (user?.role === 'admin') {
        menuItems.unshift({ icon: <ShieldCheck className="w-5 h-5 text-accent" />, label: t('sidemenu.admin'), path: '/admin' });
    }

    const NavContent = ({ isMobile = false }) => (
        <>
            {/* Logo Section */}
            <div className={`p-6 border-b border-gray-100 dark:border-white/10 ${isMobile ? 'flex justify-between items-center' : ''}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg shadow-primary/20">
                        N
                    </div>
                    {(!isCollapsed || isMobile) && (
                        <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight whitespace-nowrap">
                            Namster<span className="text-primary">.</span>
                        </span>
                    )}
                </div>
                {isMobile && (
                    <button onClick={() => setIsMobileOpen(false)} className="p-2 text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Menu Items */}
            <div className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => isMobile && setIsMobileOpen(false)}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all relative group
                            ${isActive
                                ? 'bg-primary/10 text-primary shadow-xs'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}
                        `}
                    >
                        <div className="shrink-0">{item.icon}</div>
                        {(!isCollapsed || isMobile) && (
                            <span className="whitespace-nowrap">{item.label}</span>
                        )}
                        {(isCollapsed && !isMobile) && (
                            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 font-medium">
                                {item.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* User & Premium Section */}
            <div className="p-4 border-t border-gray-100 dark:border-white/10 space-y-4">
                {(!isCollapsed || isMobile) ? (
                    <div>
                        <div className="p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-white/5">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                                {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-primary" />}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user?.firstName} {user?.lastName}</p>
                                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                            </div>
                        </div>

                        <div className="mt-4 p-5 bg-linear-to-br from-primary to-accent rounded-2xl text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-primary/20">
                            <Star className="absolute -right-2 -top-2 w-12 h-12 opacity-20 group-hover:scale-125 transition-transform fill-white" />
                            <p className="text-[10px] font-bold mb-1 uppercase tracking-widest opacity-80">{t('sidemenu.status')}</p>
                            <p className="text-sm font-black">{t('sidemenu.premium')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 ring-primary/20 transition-all">
                            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-primary" />}
                        </div>
                        <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                            <Star className="w-5 h-5" />
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={logout}
                        className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {(!isCollapsed || isMobile) && <span>{t('sidemenu.logout')}</span>}
                    </button>
                    <div className="flex items-center justify-between gap-2">
                        <LanguageSelector direction="up" />
                        {(!isCollapsed || isMobile) && <ThemeToggle />}
                    </div>
                </div>
            </div>
        </>
    );

    return (
            <>
                {/* Mobile Header Toggle */}
                <div className="lg:hidden fixed top-6 right-6 z-50">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-900 border border-gray-100"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {isMobileOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileOpen(false)}
                                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] lg:hidden"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 h-full w-[280px] bg-white dark:bg-slate-900 z-[101] flex flex-col shadow-2xl lg:hidden"
                            >
                                <NavContent isMobile />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Desktop Sidebar */}
                <motion.div
                    initial={false}
                    animate={{ width: isCollapsed ? 80 : 280 }}
                    className="h-screen bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-white/10 flex-col fixed left-0 top-0 z-50 shadow-xl shadow-gray-200/50 dark:shadow-none hidden lg:flex"
                >
                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-10 w-6 h-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-primary shadow-sm z-50 transition-colors"
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>

                    <NavContent />
                </motion.div>
            </>
    );
};

export default SideMenu;


