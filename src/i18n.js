import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationFR from './locales/fr/translation.json';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationZH from './locales/zh/translation.json';

const resources = {
    fr: { translation: translationFR },
    en: { translation: translationEN },
    es: { translation: translationES },
    zh: { translation: translationZH }
};

const supportedLngs = ['fr', 'en', 'es', 'zh'];

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        supportedLngs,
        fallbackLng: 'fr',
        // Detection order: localStorage first (persists choice), then browser language
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            lookupLocalStorage: 'namster_language',
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false
        },
        // Normalize language codes: 'en-US' → 'en'
        load: 'languageOnly',
    });

export default i18n;
