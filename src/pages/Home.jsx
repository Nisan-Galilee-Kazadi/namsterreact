import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    ArrowRight,
    Zap,
    ShieldCheck,
    Cpu,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Star
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

// â”€â”€â”€ Decorative background layer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BackgroundDecorations = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
        {/* Grid pattern */}
        <div
            className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
            style={{
                backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px),
                                  linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
                backgroundSize: '72px 72px',
            }}
        />

        {/* Orb top-right â€” primary blue */}
        <div
            className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(8,120,194,0.18) 0%, transparent 70%)',
                filter: 'blur(40px)',
            }}
        />

        {/* Orb center-left â€” accent cyan */}
        <div
            className="absolute top-1/3 -left-60 w-[500px] h-[500px] rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(0,210,255,0.12) 0%, transparent 70%)',
                filter: 'blur(50px)',
            }}
        />

        {/* Orb bottom-center â€” purple */}
        <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)',
                filter: 'blur(60px)',
            }}
        />

        {/* Floating ring top-left */}
        <div
            className="absolute top-24 left-10 w-48 h-48 rounded-full border border-primary/10 dark:border-primary/20"
            style={{ animation: 'spin 30s linear infinite' }}
        />
        <div
            className="absolute top-24 left-10 w-32 h-32 rounded-full border border-accent/10 dark:border-accent/15"
            style={{ margin: '2rem', animation: 'spin 20s linear infinite reverse' }}
        />

        {/* Floating ring bottom-right */}
        <div
            className="absolute bottom-32 right-16 w-64 h-64 rounded-full border border-primary/8 dark:border-primary/15"
            style={{ animation: 'spin 40s linear infinite' }}
        />

        {/* Small glowing dots */}
        {[
            { top: '15%', left: '8%', size: 5, color: 'primary' },
            { top: '45%', right: '5%', size: 4, color: 'accent' },
            { top: '70%', left: '15%', size: 3, color: 'primary' },
            { top: '30%', right: '20%', size: 6, color: 'accent' },
            { top: '80%', right: '30%', size: 4, color: 'primary' },
        ].map((dot, i) => (
            <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                    top: dot.top,
                    left: dot.left,
                    right: dot.right,
                    width: dot.size * 2,
                    height: dot.size * 2,
                    background: dot.color === 'primary'
                        ? 'rgba(8,120,194,0.5)'
                        : 'rgba(0,210,255,0.5)',
                    boxShadow: dot.color === 'primary'
                        ? '0 0 12px 4px rgba(8,120,194,0.3)'
                        : '0 0 12px 4px rgba(0,210,255,0.3)',
                    animationDelay: `${i * 0.7}s`,
                    animationDuration: `${2.5 + i * 0.5}s`,
                }}
            />
        ))}

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: '150px',
            }}
        />
    </div>
);

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const Home = () => {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);

    const steps = [
        {
            title: t('home.step1_title'),
            desc: t('home.step1_desc'),
            icon: <Zap className="w-8 h-8 text-primary" />
        },
        {
            title: t('home.step2_title'),
            desc: t('home.step2_desc'),
            icon: <Cpu className="w-8 h-8 text-accent" />
        },
        {
            title: t('home.step3_title'),
            desc: t('home.step3_desc'),
            icon: <ShieldCheck className="w-8 h-8 text-green-500" />
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % steps.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden dashboard-bg transition-colors duration-500">
            <BackgroundDecorations />

            <div className="relative z-10 p-4 md:p-8 pb-32 md:pb-8">
                <div className="max-w-7xl mx-auto">
                    <Navbar />

                    <main>
                        {/* Hero Section — réduit l'espace vertical */}
                        <div className="flex flex-col lg:flex-row items-center gap-10 py-4 lg:py-10">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={containerVariants}
                                className="flex-1 text-center lg:text-left z-10"
                            >
                                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-5">
                                    <Sparkles className="w-3.5 h-3.5" /> {t('home.badge')}
                                </motion.div>
                                <motion.h2 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] mb-5">
                                    {t('home.hero_title_1')} <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-accent">{t('home.hero_title_2')}</span>
                                </motion.h2>
                                <motion.p variants={itemVariants} className="text-lg text-gray-500 dark:text-white/80 font-medium mb-8 max-w-2xl mx-auto lg:mx-0">
                                    {t('home.hero_desc')}
                                </motion.p>
                                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                    <Link to="/demo">
                                        <Button className="px-10 py-4 text-lg flex items-center gap-2 group">
                                            {t('home.cta_demo')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <Link to="/app">
                                        <Button variant="secondary" className="px-8 py-4 text-lg">
                                            {t('home.cta_start')}
                                        </Button>
                                    </Link>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="flex-1 relative"
                            >
                                <div className="relative glass-card p-4 border border-white/60 dark:border-white/10 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 overflow-hidden group">
                                    <div className="absolute translate-y-full group-hover:translate-y-0 inset-0 bg-linear-to-t from-primary/20 to-transparent transition-transform duration-700 pointer-events-none" />
                                    <div className="aspect-4/3 bg-gray-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center border border-gray-100 dark:border-white/5 overflow-hidden">
                                        <div className="text-center p-8">
                                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                {steps[currentSlide].icon}
                                            </div>
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={currentSlide}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-2"
                                                >
                                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{steps[currentSlide].title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-white/70 font-medium">{steps[currentSlide].desc}</p>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between px-2">
                                        <div className="flex gap-1.5">
                                            {steps.map((_, idx) => (
                                                <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-8 bg-primary' : 'w-2 bg-gray-200 dark:bg-gray-700'}`} />
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setCurrentSlide(prev => (prev - 1 + steps.length) % steps.length)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                                                <ChevronLeft className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                            </button>
                                            <button onClick={() => setCurrentSlide(prev => (prev + 1) % steps.length)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                                                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Problem/Solution */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="py-12 md:py-20 border-t border-gray-100 dark:border-white/10"
                        >
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                                        {t('home.problem_title')} <span className="text-red-500 dark:text-red-400">{t('home.problem_highlight')}</span>
                                    </h3>
                                    <p className="text-lg text-gray-500 dark:text-white/80 font-medium leading-relaxed">
                                        {t('home.problem_desc')}
                                    </p>
                                </div>
                                <div className="glass-card p-8 border border-primary/20 bg-primary/5 relative">
                                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-primary mb-4">{t('home.solution_title')}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                        {t('home.solution_desc')}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <motion.section
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 md:py-16 border-t border-gray-100 dark:border-white/10"
                        >
                            {[
                                { label: t('home.stat_inv'), val: "500+" },
                                { label: t('home.stat_precision'), val: "100%" },
                                { label: t('home.stat_formats'), val: "10+" },
                                { label: t('home.stat_rating'), val: <Star className="w-8 h-8 text-primary fill-primary mx-auto" /> }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-1">{stat.val}</div>
                                    <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </motion.section>
                    </main>

                    <footer className="mt-8 py-8 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-medium text-gray-400 dark:text-white/60">
                        <p>© {new Date().getFullYear()} <span className="text-primary">Namster</span> Premium. {t('home.footer_rights')}</p>
                        <div className="flex items-center gap-6">
                            <a href="https://galileokazadidev.netlify.app" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors italic">Nisan-Galilée Kazadi</a>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-500" /> {t('home.footer_secured')}
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Home;

