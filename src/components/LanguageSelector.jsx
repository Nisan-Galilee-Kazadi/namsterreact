import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';

const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' }
];

const LanguageSelector = ({ direction = 'down' }) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    const currentLanguage = languages.find(lang => lang.code === i18n.language?.split('-')[0]) || languages[0];

    // Recalculate dropdown position each time it opens
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPos({
                top: direction === 'up'
                    ? rect.top + window.scrollY - 8
                    : rect.bottom + window.scrollY + 8,
                right: window.innerWidth - rect.right,
            });
        }
    }, [isOpen, direction]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                buttonRef.current && !buttonRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        const handleScroll = () => setIsOpen(false);

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, []);

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    const dropdown = isOpen ? (
        <div
            ref={dropdownRef}
            style={{
                position: 'absolute',
                top: dropdownPos.top,
                right: dropdownPos.right,
                zIndex: 99999,
                transform: direction === 'up' ? 'translateY(-100%)' : 'none',
            }}
            className="w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
        >
            <div className="py-1">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition-colors ${currentLanguage.code === lang.code
                                ? 'bg-primary/10 text-primary dark:text-primary dark:bg-primary/20'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                    >
                        <span className="text-base">{lang.flag}</span>
                        <span className="flex-1">{lang.label}</span>
                        {currentLanguage.code === lang.code && (
                            <Check className="w-4 h-4 text-primary shrink-0" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    ) : null;

    return (
        <>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 p-2 rounded-xl text-gray-600 dark:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all"
                aria-label="Sélectionner la langue"
                aria-expanded={isOpen}
            >
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold uppercase hidden md:block">{currentLanguage.code}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {typeof document !== 'undefined' && createPortal(dropdown, document.body)}
        </>
    );
};

export default LanguageSelector;
