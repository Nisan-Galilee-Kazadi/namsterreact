import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    Shield,
    Layers,
    MousePointer2,
    Type,
    Download,
    Send,
    MessageSquare,
    Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';

const Features = () => {
    const { t } = useTranslation();
    const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const WEB3FORMS_KEY = "00b59229-53c0-4777-9e71-8a937ab48a60";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!feedback.message) {
            setStatus(t('features.form_error_msg'));
            return;
        }

        setIsLoading(true);
        setStatus(t('features.form_sending'));
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    name: feedback.name,
                    email: feedback.email,
                    message: feedback.message,
                    subject: `Nouveau message Namster de ${feedback.name || 'Anonyme'}`,
                    from_name: 'Namster Premium'
                })
            });

            const data = await response.json();

            if (data.success) {
                setStatus(t('features.form_success'));
                setFeedback({ name: '', email: '', message: '' });
            } else {
                throw new Error(data.message || t('features.form_error'));
            }
        } catch (error) {
            console.error(error);
            setStatus(error.message || t('features.form_error'));
        } finally {
            setIsLoading(false);
        }
    };


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const featuresList = [
        {
            title: t('features.f1_title'),
            desc: t('features.f1_desc'),
            icon: <Layers className="w-6 h-6 text-primary" />
        },
        {
            title: t('features.f2_title'),
            desc: t('features.f2_desc'),
            icon: <MousePointer2 className="w-6 h-6 text-accent" />
        },
        {
            title: t('features.f3_title'),
            desc: t('features.f3_desc'),
            icon: <Type className="w-6 h-6 text-purple-500" />
        },
        {
            title: t('features.f4_title'),
            desc: t('features.f4_desc'),
            icon: <Download className="w-6 h-6 text-green-500" />
        }
    ];

    return (
        <div className="min-h-screen dashboard-bg p-4 md:p-8 pb-32 md:pb-8">
            <div className="max-w-6xl mx-auto">
                <Navbar />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-12"
                >
                    <header className="text-center max-w-3xl mx-auto">
                        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                            {t('features.title_1')} <span className="text-primary tracking-tight">{t('features.title_2')}</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-lg text-gray-500 dark:text-white font-medium">
                            {t('features.subtitle')}
                        </motion.p>
                    </header>

                    <section className="grid md:grid-cols-2 gap-6">
                        {featuresList.map((f, i) => (
                            <motion.div key={i} variants={itemVariants}>
                                <Card className="h-full group hover:bg-white/60 dark:hover:bg-slate-800/40 transition-all duration-500 border border-white/60 dark:border-white/10">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                        {f.icon}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{f.title}</h2>
                                    <p className="text-gray-500 dark:text-white font-medium leading-relaxed">{f.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </section>

                    <section className="relative">
                        <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-1" />
                        <motion.div
                            variants={itemVariants}
                            className="relative glass-card p-8 md:p-12 border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                        <MessageSquare className="w-8 h-8 text-primary" /> {t('features.feedback_title')}
                                    </h2>
                                    <p className="text-gray-500 dark:text-white font-medium mb-8">
                                        {t('features.feedback_desc')}
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm font-bold text-primary">
                                            <Sparkles className="w-4 h-4" /> {t('features.feedback_response')}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-gray-400 dark:text-white">
                                            <Shield className="w-4 h-4" /> {t('features.feedback_privacy')}
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={feedback.name}
                                            onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                                            className="glass-input px-4 py-3 rounded-xl text-sm font-medium w-full"
                                            placeholder={t('features.form_name')}
                                        />
                                        <input
                                            type="email"
                                            value={feedback.email}
                                            onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                                            className="glass-input px-4 py-3 rounded-xl text-sm font-medium w-full"
                                            placeholder={t('features.form_email')}
                                        />
                                    </div>
                                    <textarea
                                        rows="4"
                                        value={feedback.message}
                                        onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                                        className="glass-input px-4 py-4 rounded-xl text-sm font-medium w-full resize-none"
                                        placeholder={t('features.form_message')}
                                    />
                                    <Button
                                        type="submit"
                                        className={`w-full py-4 flex items-center justify-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? t('features.form_sending') : t('features.form_send')} <Send className="w-4 h-4" />
                                    </Button>

                                    {status && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-xs font-bold text-primary text-center"
                                        >
                                            {status}
                                        </motion.div>
                                    )}
                                </form>
                            </div>
                        </motion.div>
                    </section>
                </motion.div>

                <footer className="mt-20 py-8 border-t border-gray-100 dark:border-white/10 text-center text-sm font-medium text-gray-400 dark:text-white">
                    <p>© {new Date().getFullYear()} <span className="text-primary">Namster</span> {t('features.footer')}</p>
                </footer>
            </div>
        </div>
    );
};

export default Features;

