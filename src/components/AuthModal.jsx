import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";

const AuthModal = ({ isOpen, onClose, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden p-8 border border-white/40 dark:border-white/10"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-400 dark:text-gray-600" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                {title || "Action Requise"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
                {message ||
                  "Inscrivez-vous pour continuer à générer vos invitations sans limite."}
              </p>

              <div className="space-y-4">
                <Link to="/signup" className="block">
                  <Button className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 group bg-primary">
                    Créer un compte{" "}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link
                  to="/login"
                  className="block text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Déjà inscrit ? Se connecter
                </Link>
              </div>

              <div className="mt-10 p-4 bg-linear-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-1">
                  <Star className="w-3.5 h-3.5 fill-primary" /> Premium Edition
                </div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Rejoignez la communauté Namster et profitez d'une expérience
                  de création sans limites.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
