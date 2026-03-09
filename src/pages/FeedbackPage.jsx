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
import Button from '../components/Button';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

const Feedback = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
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
        if (user?.id) {
            fetchFeedbacks();
            const interval = setInterval(fetchFeedbacks, 10000);
            return () => clearInterval(interval);
        }
    }, [user?.id, user?.role]);

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_BASE}/api/contact`, {
                userId: user?.id,
                name: `${user?.firstName} ${user?.lastName}`,
                email: user?.email,
                message
            });
            setSent(true);
            setMessage('');
            fetchFeedbacks();
        } catch (err) {
            setError(t('feedback_page.error_send'));
        } finally {
            setLoading(false);
        }
    };

    const handleAdminReply = async (e) => {
        e.preventDefault();
        if (!replyText || !replyingTo) return;
        setSendingReply(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_BASE}/api/admin/feedback/${replyingTo._id}/respond`,
                { response: replyText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReplyingTo(null);
            setReplyText('');
            fetchFeedbacks();
        } catch (err) {
            console.error(err);
        } finally {
            setSendingReply(false);
        }
    };

    const filteredFeedbacks = feedbacks.filter(fb =>
        fb.name?.toLowerCase().includes(adminSearch.toLowerCase()) ||
        fb.message?.toLowerCase().includes(adminSearch.toLowerCase()) ||
        fb.email?.toLowerCase().includes(adminSearch.toLowerCase())
    );

    const renderAdminView = () => (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t('feedback_page.admin_title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{t('feedback_page.admin_subtitle')}</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder={t('feedback_page.search_placeholder')}
                            value={adminSearch}
                            onChange={(e) => setAdminSearch(e.target.value)}
                            className="pl-11 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm w-full md:w-72 focus:ring-2 focus:ring-primary/20 outline-none text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {fetching ? (
                    [1, 2, 3].map(i => <div key={i} className="h-40 bg-white dark:bg-white/5 animate-pulse rounded-[40px] border border-gray-50 dark:border-white/5" />)
                ) : filteredFeedbacks.length > 0 ? (
                    filteredFeedbacks.map((fb) => (
                        <motion.div
                            key={fb._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-sm">
                                            {fb.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 dark:text-white">{fb.name}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 font-bold tracking-tight">{fb.email}</p>
                                        </div>
                                        <span className={`ml-auto md:ml-0 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${fb.status === 'replied' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                                            {fb.status === 'replied' ? t('feedback_page.status_replied') : t('feedback_page.status_pending')}
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100/50 dark:border-white/5">
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-relaxed italic">"{fb.message}"</p>
                                    </div>
                                    {fb.status === 'replied' && (
                                        <div className="pl-6 border-l-2 border-primary/20 space-y-2">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                                <Reply className="w-3" /> {t('feedback_page.your_response')}
                                            </p>
                                            <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl border border-primary/10">
                                                <p className="text-sm font-bold text-gray-600 dark:text-gray-400 leading-relaxed">{fb.response}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-row md:flex-col justify-end gap-3 shrink-0">
                                    {fb.status === 'pending' && (
                                        <button
                                            onClick={() => setReplyingTo(fb)}
                                            className="px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                                        >
                                            <Reply className="w-4 h-4 text-white" /> {t('feedback_page.reply')}
                                        </button>
                                    )}
                                    <div className="text-right text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest mt-auto">
                                        {t('feedback_page.received_on')} {new Date(fb.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-32 bg-white dark:bg-white/5 rounded-[40px] border border-dashed border-gray-200 dark:border-white/10">
                        <Inbox className="w-16 h-16 text-gray-100 dark:text-gray-800 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-gray-300 dark:text-gray-600">{t('feedback_page.no_messages_found')}</h3>
                        <p className="text-gray-400 dark:text-gray-500 font-medium">{t('feedback_page.inbox_empty')}</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {replyingTo && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setReplyingTo(null)}
                            className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[1000]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl z-[1001] p-12 border border-gray-100 dark:border-white/10"
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-3xl flex items-center justify-center">
                                    <MessageSquare className="w-9 h-9 text-orange-500" />
                                </div>
                                <button onClick={() => setReplyingTo(null)} className="p-3 text-gray-300 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight">{t('feedback_page.send_response_to', { name: replyingTo.name })}</h3>
                            <p className="text-gray-400 dark:text-gray-500 font-bold text-sm mb-8 tracking-tight">{t('feedback_page.write_official_response')}</p>

                            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5 mb-8 italic text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                "{replyingTo.message}"
                            </div>

                            <form onSubmit={handleAdminReply} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-2 mb-3 block">{t('feedback_page.your_response')}</label>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="w-full h-48 bg-gray-50 dark:bg-white/5 border-none rounded-3xl p-8 outline-hidden focus:ring-2 focus:ring-primary/20 text-sm font-bold resize-none transition-all text-gray-900 dark:text-white"
                                        placeholder={t('feedback_page.help_user_placeholder')}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={sendingReply || !replyText}
                                    className="w-full py-6 bg-primary text-white rounded-3xl font-black flex items-center justify-center gap-4 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {sendingReply ? t('feedback_page.sending') : t('feedback_page.send_response')}
                                    <Send className="w-6 h-6" />
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );

    const renderUserView = () => (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
                <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-xl p-10 border border-gray-100 dark:border-white/10 sticky top-12">
                    <div className="mb-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                            <MessageSquare className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('feedback_page.user_title')}</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">{t('feedback_page.user_subtitle')}</p>
                    </div>

                    {sent ? (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('feedback_page.message_received')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">{t('feedback_page.thanks_24h')}</p>
                            <Button onClick={() => setSent(false)} variant="secondary" className="w-full py-4 rounded-xl">{t('feedback_page.new_message')}</Button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleUserSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-2 text-sm font-medium">
                                    <Info className="w-4 h-4" /> {error}
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 block">{t('feedback_page.your_message')}</label>
                                <textarea
                                    className="w-full h-48 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-white/10 rounded-2xl p-6 outline-hidden transition-all text-sm font-medium resize-none shadow-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                    placeholder={t('feedback_page.help_you_placeholder')}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 group shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                disabled={loading || !message}
                            >
                                {loading ? t('feedback_page.sending_short') : t('feedback_page.send_message')}
                                {!loading && <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 lg:max-w-md">
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    {t('feedback_page.my_messages')} ({feedbacks.length})
                </h2>

                <div className="space-y-6">
                    {fetching ? (
                        [1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200/50 animate-pulse rounded-3xl" />)
                    ) : feedbacks.length > 0 ? (
                        feedbacks.map((fb) => (
                            <div key={fb._id} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        <Clock className="w-3 h-3" />
                                        {new Date(fb.createdAt).toLocaleDateString()}
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${fb.status === 'replied' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                                        {fb.status === 'replied' ? t('feedback_page.status_replied') : t('feedback_page.status_pending')}
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white mb-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100/50 dark:border-white/5 italic opacity-80">
                                    "{fb.message}"
                                </p>

                                {fb.status === 'replied' && (
                                    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 space-y-3">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                                            <Reply className="w-3.5 h-3.5" /> {t('feedback_page.admin_response')}
                                        </div>
                                        <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl border border-primary/10">
                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-relaxed">{fb.response}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-white/5 rounded-[32px] border border-dashed border-gray-200 dark:border-white/10">
                            <MessageSquare className="w-12 h-12 text-gray-200 dark:text-gray-800 mx-auto mb-4" />
                            <p className="text-gray-400 dark:text-gray-500 font-bold italic">{t('feedback_page.no_messages_yet')}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen dashboard-bg flex transition-all duration-300">
            <SideMenu isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <main className={`flex-1 transition-all duration-300 p-6 md:p-12 ml-0 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'}`}>
                {user?.role === 'admin' ? renderAdminView() : renderUserView()}
            </main>
        </div>
    );
};

export default Feedback;
