import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

const TopBar = ({ isCollapsed }) => {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <div className={`fixed top-0 right-0 z-40 h-22 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 flex items-center justify-between md:justify-end gap-6 px-6 md:px-8 lg:px-12 transition-all duration-300 ${isCollapsed ? 'left-0 lg:left-[80px]' : 'left-0 lg:left-[280px]'}`}>
            <div className="md:hidden flex items-center">
                {/* Placeholder for mobile menu button if needed on left */}
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <LanguageSelector direction="down" />
                    <ThemeToggle />
                </div>

                <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden md:block"></div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{user?.role === 'admin' ? t('sidemenu.admin') : t('sidemenu.premium')}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shrink-0 border border-primary/20 relative group">
                            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-primary" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
