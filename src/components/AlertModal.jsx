import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, BellRing, Sparkles } from 'lucide-react';

const AlertModal = ({
    isOpen,
    onClose,
    onConfirm,
    onCancel,
    title,
    message,
    type = 'success',
    confirmText = 'Continuer',
    cancelText = 'Annuler',
    showCancelButton = false
}) => {
    const icons = {
        success: <CheckCircle2 className="w-10 h-10 text-emerald-500" />,
        error: <AlertCircle className="w-10 h-10 text-rose-500" />,
        info: <Info className="w-10 h-10 text-primary" />,
        warning: <BellRing className="w-10 h-10 text-amber-500" />
    };

    const colors = {
        success: 'border-emerald-500/10 bg-emerald-500/[0.02]',
        error: 'border-rose-500/10 bg-rose-500/[0.02]',
        info: 'border-primary/10 bg-primary/[0.02]',
        warning: 'border-amber-500/10 bg-amber-500/[0.02]'
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCancel}
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl dark:bg-black/60"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`relative w-full max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[48px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] overflow-hidden p-10 border ${colors[type] || colors.info} flex flex-col items-center text-center`}
                    >
                        {/* Status Glow */}
                        <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[80px] opacity-20 ${type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-rose-500' : 'bg-primary'
                            }`} />

                        <button
                            onClick={handleCancel}
                            className="absolute top-8 right-8 p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all active:scale-95 group"
                        >
                            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                        </button>

                        <div className={`relative w-24 h-24 rounded-[36px] flex items-center justify-center mb-8 shadow-2xl ${type === 'success' ? 'bg-emerald-500/10 shadow-emerald-500/10' :
                                type === 'error' ? 'bg-rose-500/10 shadow-rose-500/10' :
                                    'bg-primary/10 shadow-primary/10'
                            }`}>
                            {icons[type]}
                        </div>

                        <div className="space-y-3 mb-10">
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                                {title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed px-2">
                                {message}
                            </p>
                        </div>

                        <div className="flex flex-col w-full gap-3">
                            <button
                                onClick={handleConfirm}
                                className={`w-full py-5 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_40px_-10px] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 ${type === 'error' ? 'bg-rose-600 text-white shadow-rose-600/30' :
                                        type === 'success' ? 'bg-emerald-600 text-white shadow-emerald-600/30' :
                                            'bg-primary text-white shadow-primary/30'
                                    }`}
                            >
                                {confirmText}
                            </button>

                            {showCancelButton && (
                                <button
                                    onClick={handleCancel}
                                    className="w-full py-5 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    {cancelText}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AlertModal;
