import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Send,
    CheckCircle2,
    Info,
    Clock,
    Reply,
    Search,
    X,
    Inbox
} from 'lucide-react';
import SideMenu from '../components/SideMenu';
import TopBar from '../components/TopBar';
import Button from '../components/Button';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const API_BASE =
    import.meta.env.VITE_API_BASE ||
    (import.meta.env.PROD
        ? 'https://namsterbackend-3.onrender.com'
        : 'http://localhost:3001');

const Feedback = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');

    const handleToggleSidebar = (val) => {
        setIsCollapsed(val);
        localStorage.setItem('sidebarCollapsed', val);
    };

    const [feedbacks, setFeedbacks] = useState([]);
    const [fetching, setFetching] = useState(true);

    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [adminSearch, setAdminSearch] = useState('');

    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            if (user?.role === 'admin') {
                const res = await axios.get(`${API_BASE}/api/admin/feedbacks`, { headers });
                setFeedbacks(res.data);
            } else {
                const res = await axios.get(`${API_BASE}/api/contact/user/${user?.id}`, { headers });
                setFeedbacks(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (user) fetchFeedbacks();
    }, [user]);

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        setSendingReply(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE}/api/admin/feedbacks/${replyingTo._id}/reply`, {
                reply: replyText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReplyText('');
            setReplyingTo(null);
            fetchFeedbacks();
        } catch (err) {
            console.error(err);
        } finally {
            setSendingReply(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setError(t('features.form_error_msg'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE}/api/contact`, {
                name: `${user?.firstName} ${user?.lastName}`,
                email: user?.email,
                message: message
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSent(true);
            setMessage('');
            fetchFeedbacks();
        } catch (err) {
            setError(t('features.form_error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderAdminView = () => (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('feedback_page.admin_title')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{t('feedback_page.admin_subtitle')}</p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder={t('feedback_page.search_placeholder')}
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        className="pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-hidden w-full md:w-80 shadow-sm"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {feedbacks
                    .filter(f => f.name.toLowerCase().includes(adminSearch.toLowerCase()) || f.message.toLowerCase().includes(adminSearch.toLowerCase()))
                    .map((item, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={item._id}
                            className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase shadow-inner">
                                            {item.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 dark:text-white leading-tight">{item.name}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                <Mail className="w-3 h-3 text-primary" />
                                                {item.email}
                                            </div>
                                        </div>
                                        {item.replied ? (
                                            <span className="ml-auto px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full">{t('feedback_page.status_replied')}</span>
                                        ) : (
                                            <span className="ml-auto px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest rounded-full">{t('feedback_page.status_pending')}</span>
                                        )}
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/5 mb-4">
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm font-medium">{item.message}</p>
                                    </div>
                                    {item.replied && (
                                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                            <div className="flex items-center gap-2 mb-2 text-primary font-black text-[10px] uppercase tracking-widest">
                                                <Reply className="w-3 h-3" />
                                                {t('feedback_page.your_response')}
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium italic">"{item.reply}"</p>
                                        </div>
                                    )}
                                </div>
                                {!item.replied && (
                                    <div className="md:w-64 flex flex-col justify-end">
                                        <button
                                            onClick={() => setReplyingTo(item)}
                                            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl dark:shadow-white/5 flex items-center justify-center gap-2"
                                        >
                                            <Reply className="w-4 h-4" />
                                            {t('feedback_page.reply')}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-tighter">
                                <Clock className="w-3 h-3" />
                                {t('feedback_page.received_on')} {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                        </motion.div>
                    ))}

                {feedbacks.length === 0 && (
                    <div className="text-center py-24 bg-white dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-[40px] opacity-60">
                        <Inbox className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                        <h4 className="text-xl font-black text-gray-800 dark:text-white mb-2">{t('feedback_page.inbox_empty')}</h4>
                    </div>
                )}
            </div>

            {/* Reply Modal */}
            <AnimatePresence>
                {replyingTo && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setReplyingTo(null)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] p-10 relative z-101 border border-white/10 shadow-2xl"
                        >
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="mb-8">
                                <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary mb-6 shadow-inner">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('feedback_page.reply')}</h3>
                                <p className="text-gray-500 font-bold">{t('feedback_page.send_response_to').replace('{{name}}', replyingTo.name)}</p>
                            </div>

                            <form onSubmit={handleSubmitReply} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">{t('feedback_page.your_response')}</label>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={t('feedback_page.write_official_response')}
                                        required
                                        className="w-full h-40 p-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl focus:ring-4 focus:ring-primary/20 outline-hidden font-medium text-sm transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={sendingReply}
                                    className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {sendingReply ? t('feedback_page.sending') : t('feedback_page.send_response')}
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );

    const renderUserView = () => (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm"
            >
                <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
                    <div className="lg:col-span-2 p-10 bg-linear-to-br from-gray-900 to-slate-800 dark:from-white/5 dark:to-white/2 flex flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <MessageSquare className="w-64 h-64 -mr-20 -mt-20" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-5xl font-black tracking-tight mb-4">{t('feedback_page.user_title')}</h2>
                            <p className="text-gray-400 font-bold leading-relaxed">{t('feedback_page.user_subtitle')}</p>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-sm font-bold opacity-80">{t('feedback_page.thanks_24h')}</div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                                    <Info className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="text-sm font-bold opacity-80">{t('features.feedback_privacy')}</div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 p-10 lg:p-14 relative bg-white dark:bg-transparent">
                        <AnimatePresence mode="wait">
                            {sent ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center py-10"
                                >
                                    <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('feedback_page.message_received')}</h3>
                                    <p className="text-gray-500 font-bold max-w-xs">{t('feedback_page.thanks_24h')}</p>
                                    <Button
                                        onClick={() => setSent(false)}
                                        variant="secondary"
                                        className="mt-8 px-8"
                                    >
                                        Envoyer un autre message
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-8"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">{t('features.form_name')}</label>
                                            <div className="px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-gray-500 font-black text-sm tracking-tight truncate">
                                                {user?.firstName} {user?.lastName}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">{t('features.form_email')}</label>
                                            <div className="px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-gray-500 font-black text-sm tracking-tight truncate">
                                                {user?.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">{t('feedback_page.your_message')}</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={t('feedback_page.help_you_placeholder')}
                                            className="w-full h-48 p-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl focus:ring-4 focus:ring-primary/20 outline-hidden font-medium text-base transition-all resize-none shadow-xs"
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold">
                                            <X className="w-5 h-5" />
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/30 disabled:opacity-70 group"
                                    >
                                        {loading ? t('feedback_page.sending_short') : t('feedback_page.send_message')}
                                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* User Message History */}
            <div className="mt-12 space-y-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                    <Inbox className="w-6 h-6 text-primary" />
                    {t('feedback_page.my_messages')}
                </h3>
                <div className="space-y-4">
                    {feedbacks.length === 0 && !fetching && (
                        <div className="text-center py-12 bg-white dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl opacity-50 font-bold">
                            {t('feedback_page.no_messages_yet')}
                        </div>
                    )}
                    {feedbacks.map((f, idx) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={f._id}
                            className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-xs"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${f.replied ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                                    }`}>
                                    {f.replied ? t('feedback_page.status_replied') : t('feedback_page.status_pending')}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-4 leading-relaxed">{f.message}</p>
                            {f.replied && (
                                <div className="mt-4 p-5 bg-primary/5 rounded-2xl border border-primary/10">
                                    <div className="flex items-center gap-2 mb-2 text-primary font-black text-[10px] uppercase tracking-widest">
                                        <Reply className="w-3 h-3" />
                                        {t('feedback_page.admin_response')}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-bold italic leading-relaxed">"{f.reply}"</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen dashboard-bg flex transition-all duration-300">
            <SideMenu isCollapsed={isCollapsed} setIsCollapsed={handleToggleSidebar} />

            <main className={`flex-1 flex flex-col transition-all duration-300 p-6 md:p-12 ml-0 pt-32 ${isCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'}`}>
                <TopBar isCollapsed={isCollapsed} />
                <div className="mt-8">
                    {user?.role === 'admin' ? renderAdminView() : renderUserView()}
                </div>
            </main>
        </div>
    );
};

export default Feedback;
