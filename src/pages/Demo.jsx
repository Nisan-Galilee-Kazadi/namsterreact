import React from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const Demo = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const demoVideos = [
        {
            id: 1,
            title: 'Video 1: Description',
            desc: "Presentation rapide de l'outil et du resultat attendu."
        },
        {
            id: 2,
            title: 'Video 2: Utilisation Basic',
            desc: 'Workflow simple: upload du modele, upload de la liste, generation.'
        },
        {
            id: 3,
            title: 'Video 3: Utilisation avec Nom et Table',
            desc: 'Positionnement double (Nom + Table) et apercu avant export.'
        },
        {
            id: 4,
            title: 'Video 4: Creation de Template',
            desc: "Personnalisation d'un template avant passage dans le generateur."
        }
    ];

    return (
        <div className="min-h-screen dashboard-bg p-4 md:p-8 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto">
                <Navbar />

                <main className="mt-12 lg:mt-20">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="text-center mb-16"
                    >
                        <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
                            L'art de la saisie <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-accent">multiple automatisee</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-lg text-muted dark:text-white font-medium max-w-2xl mx-auto">
                            Decouvrez les principaux cas d'utilisation en video.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="mb-24"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {demoVideos.map((video, index) => (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card overflow-hidden border border-white/40 dark:border-white/10 shadow-xl rounded-3xl"
                                >
                                    <div className="aspect-video bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 relative flex items-center justify-center group">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)]" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/90">
                                            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:scale-105 transition-transform">
                                                <Play className="w-7 h-7 fill-current translate-x-0.5" />
                                            </div>
                                            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
                                                Espace video {video.id}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-2">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white">{video.title}</h3>
                                        <p className="text-sm text-muted dark:text-white">{video.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {[
                            {
                                title: 'Vitesse Eclaire',
                                desc: 'Traitez des centaines de noms en quelques secondes.',
                                icon: <Zap className="w-6 h-6" />,
                                color: 'text-yellow-500'
                            },
                            {
                                title: 'Precision Visuelle',
                                desc: 'Visualisation en temps reel du placement sur vos documents.',
                                icon: <Play className="w-6 h-6" />,
                                color: 'text-primary'
                            },
                            {
                                title: 'Securite Totale',
                                desc: 'Vos donnees sont traitees localement et ne sont jamais stockees.',
                                icon: <ShieldCheck className="w-6 h-6" />,
                                color: 'text-green-500'
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="glass-card p-8 border border-white/40 dark:border-white/10"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg mb-6 ${feature.color}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                                <p className="text-muted dark:text-white text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card p-12 text-center bg-linear-to-br from-primary/5 to-accent/5 border border-primary/20 relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-6 text-gray-900 dark:text-white">Pret a transformer votre workflow ?</h2>
                            <p className="text-muted dark:text-white mb-10 max-w-xl mx-auto">
                                Rejoignez des milliers d'utilisateurs qui gagnent du temps chaque jour avec Namster Premium.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button className="px-10 py-4 flex items-center gap-2 group">
                                    Essayer Maintenant <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button variant="secondary" className="px-10 py-4">
                                    Contacter le support
                                </Button>
                            </div>
                        </div>

                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
                    </motion.div>
                </main>

                <footer className="mt-20 py-8 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-medium text-muted dark:text-white">
                    <p>© {new Date().getFullYear()} Namster Premium. Tous droits reserves.</p>
                    <div className="flex items-center gap-6">
                        <span className="hover:text-primary transition-colors cursor-pointer">Confidentialite</span>
                        <span className="hover:text-primary transition-colors cursor-pointer">Conditions</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Demo;


