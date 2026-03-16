import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Check, CreditCard, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const SubscriptionModal = ({ isOpen, onClose, currentPlan }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("info"); // 'info' or 'payment'

  const plans = [
    {
      id: "free",
      name: "Standard",
      price: "0€",
      features: ["5 campagnes / mois", "Templates de base", "Support standard"],
      active: currentPlan === "free"
    },
    {
      id: "premium",
      name: "Premium",
      price: "19€",
      period: "/ mois",
      features: ["Invitations Illimitées", "Tous les templates Pro", "Export ZIP Haute Qualité", "Support Prioritaire"],
      active: currentPlan === "premium",
      recommended: true
    }
  ];

  const handleUpgrade = () => {
    setLoading(true);
    setTimeout(() => {
      setStep("payment");
      setLoading(false);
    }, 1000);
  };

  const handleConfirmPayment = () => {
      setLoading(true);
      setTimeout(() => {
          onClose();
          setLoading(false);
          // In a real app, refresh user state here
      }, 2000);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-white/20 dark:border-white/10"
          >
            {/* Header decor */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-primary via-accent to-primary" />
            
            <button
              onClick={onClose}
              className="absolute top-8 right-8 p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all z-20 active:scale-95"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex flex-col lg:flex-row">
              {/* Sidebar Info */}
              <div className="lg:w-72 bg-gray-50 dark:bg-white/5 p-10 flex flex-col justify-between border-r border-gray-100 dark:border-white/10">
                <div>
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 animate-pulse">
                    <Star className="w-8 h-8 fill-primary" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-4 tracking-tighter">
                    Namster <span className="text-primary">Premium</span>
                  </h2>
                  <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-8 leading-relaxed">
                    Débloquez la puissance totale de l'automatisation.
                  </p>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs font-black text-green-500 uppercase tracking-widest">
                        <ShieldCheck className="w-5 h-5" />
                        Paiement Sécurisé
                    </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-10">
                {step === "info" ? (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      {plans.map((plan) => (
                        <div 
                          key={plan.id}
                          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group ${plan.active ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-white/10 hover:border-primary/30'}`}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <div>
                                <h4 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
                                    {plan.name}
                                    {plan.recommended && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-md uppercase tracking-widest">Recommended</span>}
                                </h4>
                                <p className="text-2xl font-black text-primary mt-1">{plan.price}<span className="text-sm text-gray-400 font-bold">{plan.period}</span></p>
                            </div>
                            {plan.active ? (
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                                    <Check className="w-6 h-6" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 border-2 border-gray-100 dark:border-white/10 rounded-full group-hover:border-primary/50 transition-all" />
                            )}
                          </div>
                          <ul className="grid grid-cols-1 gap-2">
                            {plan.features.map((f, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                                <Check className="w-3 h-3 text-green-500" /> {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleUpgrade}
                      disabled={loading}
                      className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-3xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? "Chargement..." : "Continuer vers le paiement"}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8 animate-[fade-in_0.3s_ease-out]">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Finaliser mon abonnement</h3>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Titulaire de la carte</label>
                            <input type="text" placeholder="NOM PRÉNOM" className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-2xl outline-none font-bold text-sm" />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Informations de carte</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-4 pl-12 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-2xl outline-none font-bold text-sm" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Expiration</label>
                                <input type="text" placeholder="MM/YY" className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-2xl outline-none font-bold text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">CVC</label>
                                <input type="text" placeholder="123" className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-2xl outline-none font-bold text-sm" />
                            </div>
                        </div>
                    </div>

                    <button
                      onClick={handleConfirmPayment}
                      disabled={loading}
                      className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? "Traitement..." : "Payer 19,00 €"}
                    </button>
                    
                    <button 
                        onClick={() => setStep("info")}
                        className="w-full py-2 text-xs font-black text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors"
                    >
                        Retour aux plans
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;
