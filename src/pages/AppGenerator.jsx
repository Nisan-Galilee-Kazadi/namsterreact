import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Settings,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Layout,
  Type,
  Hash,
  ChevronRight,
  User as UserIcon,
  Star,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Search,
  FileImage,
  MapPin,
  Bold,
  Italic,
  Underline,
  HelpCircle,
  FileSpreadsheet,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import AuthModal from "../components/AuthModal";
import { useTranslation } from "react-i18next";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD
    ? "https://namsterbackend-3.onrender.com"
    : "http://localhost:3001");

function AppGenerator() {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const location = useLocation();
  const [modelFile, setModelFile] = useState(null);
  const [listFile, setListFile] = useState(null);

  const [sessionId, setSessionId] = useState(null);
  const [coordsName, setCoordsName] = useState(null);
  const [coordsTable, setCoordsTable] = useState(null);
  const [selectionMode, setSelectionMode] = useState("name");
  const [useTable, setUseTable] = useState(false);

  const [settings, setSettings] = useState({
    fontFamily: "Arial",
    fontSize: 48,
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    color: "#000000",
  });

  const fontOptions = [
    "Alex Brush",
    "Great Vibes",
    "Dancing Script",
    "Playfair Display",
    "Bodoni Moda",
    "Cinzel",
    "Cormorant Garamond",
    "Pinyon Script",
    "Rochester",
    "Sacramento",
    "Brush Script MT",
    "Monotype Corsiva",
    "Lucida Calligraphy",
    "Segoe Script",
    "Gabriola",
    "Palace Script MT",
    "Edwardian Script ITC",
    "Kunstler Script",
    "Vladimir Script",
    "Vivaldi",
    "Garamond",
    "Book Antiqua",
  ];

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [namesTotal, setNamesTotal] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [modelPreviewSrc, setModelPreviewSrc] = useState(null);
  const [testPreviewSrc, setTestPreviewSrc] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Zoom states
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // File format detection
  const [fileFormat, setFileFormat] = useState(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [dontShowTourAgain, setDontShowTourAgain] = useState(false);
  const [highlightRect, setHighlightRect] = useState(null);
  const [statusPulse, setStatusPulse] = useState(false);

  const TOUR_STORAGE_KEY = "namster_hide_tutorial";

  const tourSteps = useMemo(
    () => [
      {
        targetId: "tour-nav-import",
        title: t("tutorial.welcome_title"),
        description:
          "Chargez le modele, la liste puis cliquez sur upload pour initialiser le projet.",
      },
      {
        targetId: "tour-nav-mode",
        title: "Choix du mode",
        description:
          "Choisissez Nom pour un seul champ, ou Nom + Table pour gerer les deux positions.",
      },
      {
        targetId: "tour-nav-production",
        title: "Production",
        description:
          "Tester cree un apercu. Generer lance la generation finale du lot.",
      },
      {
        targetId: "tour-nav-guide",
        title: t("app.guide"),
        description:
          "Ce bouton relance le guide a tout moment si vous voulez revoir les etapes.",
      },
      {
        targetId: "tour-typography-card",
        title: t("app.typography"),
        description:
          "Ce panneau controle l'apparence du texte et reste visible pendant la mise en page.",
      },
      {
        targetId: "tour-font-select",
        title: t("app.font"),
        description:
          "Choisissez une police. Chaque option affiche un apercu de son style.",
      },
      {
        targetId: "tour-size-slider",
        title: t("app.size"),
        description:
          "Ajustez la taille du texte en pixels pour correspondre au modele.",
      },
      {
        targetId: "tour-style-controls",
        title: t("app.style"),
        description: "Activez le gras, l'italique et le souligne selon vos besoins.",
      },
      {
        targetId: "tour-color-controls",
        title: t("app.color"),
        description:
          "Definissez la couleur exacte via le picker ou la valeur hexadecimale.",
      },
    ],
    [t],
  );

  useEffect(() => {
    const hidden = localStorage.getItem(TOUR_STORAGE_KEY) === "true";
    setDontShowTourAgain(hidden);
    if (!hidden) setTourOpen(true);
  }, []);

  const saveTourPreference = (val) => {
    localStorage.setItem(TOUR_STORAGE_KEY, val ? "true" : "false");
    setDontShowTourAgain(val);
  };

  const closeTour = () => setTourOpen(false);

  const modelImgRef = useRef(null);
  const containerRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    if (!status) return;

    setStatusPulse(true);
    const pulseTimer = setTimeout(() => setStatusPulse(false), 1500);

    const shouldFocusStatus =
      status.includes("Session") ||
      status.includes("Test") ||
      status.includes("Erreur") ||
      status.toLowerCase().includes("termin");

    if (shouldFocusStatus && statusRef.current) {
      statusRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return () => clearTimeout(pulseTimer);
  }, [status]);

  useEffect(() => {
    if (!tourOpen) return;

    const updateHighlight = () => {
      const currentStep = tourSteps[tourStep];
      if (!currentStep) return;
      const target = document.getElementById(currentStep.targetId);
      if (!target) {
        setHighlightRect(null);
        return;
      }

      target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      const rect = target.getBoundingClientRect();
      const padding = 8;
      setHighlightRect({
        top: Math.max(rect.top - padding, 8),
        left: Math.max(rect.left - padding, 8),
        width: Math.min(rect.width + padding * 2, window.innerWidth - 16),
        height: Math.min(rect.height + padding * 2, window.innerHeight - 16),
      });
    };

    const frame = requestAnimationFrame(updateHighlight);
    const onViewportChange = () => requestAnimationFrame(updateHighlight);

    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [tourOpen, tourStep, tourSteps]);

  const openTour = () => {
    setTourStep(0);
    setTourOpen(true);
  };

  const goNextTourStep = () => {
    if (tourStep >= tourSteps.length - 1) {
      closeTour();
      return;
    }
    setTourStep((prev) => prev + 1);
  };

  const goPrevTourStep = () => {
    if (tourStep <= 0) return;
    setTourStep((prev) => prev - 1);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel((prev) => Math.min(Math.max(prev + delta, 0.5), 3));
    };

    container.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleNativeWheel);
  }, [modelPreviewSrc]);

  useEffect(() => {
    if (modelFile) {
      const reader = new FileReader();
      reader.onload = (e) => setModelPreviewSrc(e.target.result);
      reader.readAsDataURL(modelFile);
    } else {
      setModelPreviewSrc(null);
    }
  }, [modelFile]);

  useEffect(() => {
    if (location.state?.preloadedModel) {
      setModelFile(location.state.preloadedModel);
    }
    if (location.state?.defaultSettings) {
      setSettings((prev) => ({
        ...prev,
        ...location.state.defaultSettings,
      }));
    }
  }, [location.state]);

  // File format detection function
  const detectFileFormat = (file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    const formatMap = {
      jpg: "JPEG",
      jpeg: "JPEG",
      png: "PNG",
      gif: "GIF",
      bmp: "BMP",
      webp: "WebP",
      svg: "SVG",
      tiff: "TIFF",
      tif: "TIFF",
    };
    return formatMap[extension] || "Inconnu";
  };

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleUpload = async () => {
    if (!modelFile || !listFile) {
      setStatus(t("app.status_error_upload"));
      return;
    }

    setIsLoading(true);
    setStatus(t("app.upload_in_progress"));

    const formData = new FormData();
    formData.append("model", modelFile);
    formData.append("list", listFile);

    // Ajouter les parametres de style
    formData.append("settings", JSON.stringify(settings));
    formData.append("coordsName", JSON.stringify(coordsName));
    formData.append("coordsTable", JSON.stringify(coordsTable));
    formData.append("useTable", useTable);

    try {
      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { sessionId, namesTotal } = response.data;
      setSessionId(sessionId);
      setNamesTotal(namesTotal);
      setStatus(t("app.status_session_created", { count: namesTotal }));

    } catch (error) {
      console.error(error);
      setStatus(t("app.status_error_upload"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (e) => {
    if (!modelImgRef.current) return;
    const img = modelImgRef.current;
    const rect = img.getBoundingClientRect();

    // The rect already reflects zoom/pan transform. Convert click directly to natural pixels.
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const naturalX = Math.round(x * (img.naturalWidth / rect.width));
    const naturalY = Math.round(y * (img.naturalHeight / rect.height));
    const clampedX = Math.max(0, Math.min(naturalX, img.naturalWidth));
    const clampedY = Math.max(0, Math.min(naturalY, img.naturalHeight));

    if (selectionMode === "name") {
      setCoordsName({ x: clampedX, y: clampedY });
      if (useTable) setSelectionMode("table");
    } else {
      setCoordsTable({ x: clampedX, y: clampedY });
      setSelectionMode("name");
    }
  };

  const handleModeSelect = (mode) => {
    if (mode === "name") {
      setSelectionMode("name");
      return;
    }

    if (useTable && selectionMode === "table") {
      setUseTable(false);
      setCoordsTable(null);
      setSelectionMode("name");
      return;
    }

    setUseTable(true);
    setSelectionMode("table");
  };

  const getMarkerStyle = (coords) => {
    const img = modelImgRef.current;
    if (
      !coords ||
      !img?.naturalWidth ||
      !img?.naturalHeight ||
      !img?.clientWidth ||
      !img?.clientHeight
    )
      return null;
    return {
      left: `${(coords.x / img.naturalWidth) * img.clientWidth}px`,
      top: `${(coords.y / img.naturalHeight) * img.clientHeight}px`,
    };
  };

  const handleTest = async () => {
    if (!sessionId) return setStatus("Session manquante.");
    if (!coordsName) return setStatus(t('app.status_set_name_position'));

    setIsLoading(true);
    setStatus(t('app.status_test_in_progress'));

    try {
      const response = await axios.post(`${API_BASE}/api/test`, {
        sessionId,
        x: coordsName.x,
        y: coordsName.y,
        tx: coordsTable?.x,
        ty: coordsTable?.y,
        useTable,
        ...settings,
      });
      setTestPreviewSrc(response.data.preview);
      setStatus(t("app.status_test_success"));


      // Scroll to result card
      setTimeout(() => {
        const card = document.getElementById("result-card");
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (error) {
      console.error(error);
      setStatus(t("app.status_error_test"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!sessionId) return setStatus("Session manquante.");
    if (!coordsName) return setStatus(t('app.status_set_name_position'));

    setIsLoading(true);
    setStatus(t('app.status_gen_in_progress'));
    setProgress(0);

    try {
      const response = await axios.post(
        `${API_BASE}/api/generate`,
        {
          sessionId,
          x: coordsName.x,
          y: coordsName.y,
          tx: coordsTable?.x,
          ty: coordsTable?.y,
          useTable,
          ...settings,
          offset: 0,
          limit: namesTotal,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percentCompleted);
          },
        },
      );

      const rawDownloadUrl = response.data.downloadUrl;
      const absoluteDownloadUrl = rawDownloadUrl?.startsWith("http")
        ? rawDownloadUrl
        : `${API_BASE}${rawDownloadUrl}`;
      setDownloadUrl(absoluteDownloadUrl);
      setStatus(t('app.status_gen_done'));
      setProgress(100);


      // Enregistrer l'historique
      if (user && token) {
        try {
          await axios.post(
            `${API_BASE}/api/user/history`,
            {
              action: "generation",
            details: `Generation de ${namesTotal} invitations.`,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
        } catch (err) {
          console.error("Erreur historique:", err);
        }
      }
    } catch (error) {
      console.error(error);
      setStatus(t("app.status_error_gen"));
    } finally {
      setIsLoading(false);
    }
  };


  const currentTourStep = tourSteps[tourStep];
  const isTourLastStep = tourStep === tourSteps.length - 1;
  const tooltipWidth = 360;
  const tooltipHeight = 220;
  const tooltipStyle = highlightRect
    ? (() => {
        const spaceBelow = window.innerHeight - (highlightRect.top + highlightRect.height);
        const placeAbove = spaceBelow < tooltipHeight + 24;
        const top = placeAbove
          ? Math.max(12, highlightRect.top - tooltipHeight - 16)
          : Math.min(window.innerHeight - tooltipHeight - 12, highlightRect.top + highlightRect.height + 16);
        const left = Math.min(
          Math.max(12, highlightRect.left),
          Math.max(12, window.innerWidth - tooltipWidth - 12),
        );
        return { top: `${top}px`, left: `${left}px` };
      })()
    : { top: "24px", left: "24px" };

  return (
    <div className="h-screen flex flex-col overflow-hidden dashboard-bg transition-colors duration-500">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Continuer l'aventure ?"
      />


      
      <AnimatePresence>
        {tourOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[210] bg-slate-950/75"
            />
            {highlightRect && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed z-[211] rounded-2xl border-2 border-primary pointer-events-none"
                style={{
                  top: `${highlightRect.top}px`,
                  left: `${highlightRect.left}px`,
                  width: `${highlightRect.width}px`,
                  height: `${highlightRect.height}px`,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  boxShadow:
                    "0 0 0 9999px rgba(2,6,23,0.62), 0 0 0 2px rgba(255,255,255,0.45), 0 0 28px rgba(56,189,248,0.75)",
                }}
              />
            )}
            <motion.aside
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed z-[212] w-[min(360px,calc(100vw-24px))] rounded-2xl border border-white/15 bg-slate-900 text-white shadow-2xl"
              style={tooltipStyle}
            >
              <div className="p-5 space-y-3">
                <div className="text-[11px] uppercase tracking-widest text-primary font-black">
                  Guide {tourStep + 1}/{tourSteps.length}
                </div>
                <h3 className="text-base font-black">{currentTourStep?.title}</h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {currentTourStep?.description}
                </p>
                <label className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dontShowTourAgain}
                    onChange={(e) => saveTourPreference(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-500 bg-transparent accent-primary"
                  />
                  {t("tutorial.dont_show_again")}
                </label>
                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    onClick={closeTour}
                    className="px-3 py-2 rounded-lg border border-white/20 text-slate-200 text-xs font-bold hover:bg-white/10"
                  >
                    Passer
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goPrevTourStep}
                      disabled={tourStep === 0}
                      className="px-3 py-2 rounded-lg border border-white/20 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10"
                    >
                      Precedent
                    </button>
                    <button
                      onClick={goNextTourStep}
                      className="px-3 py-2 rounded-lg bg-primary text-xs font-black text-white hover:brightness-110"
                    >
                      {isTourLastStep ? t("tutorial.btn_finish") : t("tutorial.btn_next")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
{/* Ribbon Topbar */}
      <div className="shrink-0 z-[100] bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-white/10 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center gap-8 px-8 py-2 overflow-x-auto no-scrollbar border-b border-gray-50 dark:border-white/5">
          {/* Logo Section */}
          <div className="flex items-center gap-3 shrink-0 py-2 border-r border-gray-100 dark:border-white/10 pr-8">
            <a href="/">
              <img
                src="/images/logo.png"
                className="w-10 h-10 rounded-xl"
                alt="Namster"
              />
            </a>
            <a href="/">
              <span className="text-xl font-black bg-clip-text text-transparent bg-linear-to-r from-primary to-accent">
                Namster
              </span>
            </a>
          </div>

          {/* Quick Actions Ribbon */}
          <div className="flex items-center gap-6 py-1">
            <div id="tour-nav-import" className="flex flex-col gap-1.5 min-w-[120px]">
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                {t("app.importing")}
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="top-model"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setModelFile(e.target.files[0])}
                />
                <label
                  htmlFor="top-model"
                  className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                  title={t("app.upload_model")}
                >
                  <ImageIcon className="w-5 h-5" />
                </label>
                <input
                  type="file"
                  id="top-list"
                  className="hidden"
                  accept=".csv,.xlsx,.doc,.docx,.pdf"
                  onChange={(e) => setListFile(e.target.files[0])}
                />
                <label
                  htmlFor="top-list"
                  className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                  title={t("app.upload_list")}
                >
                  <FileSpreadsheet className="w-5 h-5" />
                </label>
                <button
                  onClick={handleUpload}
                  disabled={isLoading || !modelFile || !listFile}
                  className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 disabled:cursor-not-allowed"
                >
                  <Upload className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="w-px h-12 bg-gray-100 dark:border-white/10 shrink-0" />

            <div id="tour-nav-mode" className="flex flex-col gap-1.5 min-w-[250px]">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Mode
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider ${useTable ? "text-accent" : "text-primary"}`}
                >
                  {useTable ? "Nom + Table" : "Nom"}
                </span>
              </div>
              <div className="flex items-stretch gap-1.5 bg-linear-to-r from-gray-50 to-white dark:from-white/5 dark:to-white/[0.07] p-1.5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-inner">
                <button
                  onClick={() => {
                    setUseTable(false);
                    setCoordsTable(null);
                    setSelectionMode("name");
                  }}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-black transition-all border ${!useTable ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 -translate-y-[1px]" : "bg-white/70 dark:bg-transparent border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"}`}
                >
                  Nom
                </button>
                <button
                  onClick={() => {
                    setUseTable(true);
                    if (!coordsName) setSelectionMode("name");
                    else if (!coordsTable) setSelectionMode("table");
                  }}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-black transition-all border ${useTable ? "bg-accent text-white border-accent shadow-lg shadow-cyan-500/20 -translate-y-[1px]" : "bg-white/70 dark:bg-transparent border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"}`}
                >
                  Nom + Table
                </button>
              </div>
            </div>

            <div className="w-px h-12 bg-gray-100 dark:border-white/10 shrink-0" />

            <div id="tour-nav-production" className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                Production
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTest}
                  disabled={isLoading || !sessionId || !coordsName}
                  className="px-5 py-2.5 bg-white dark:bg-white/5 border-2 border-primary text-primary dark:text-white rounded-xl text-xs font-black hover:bg-primary hover:text-white transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Tester
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={
                    isLoading || !sessionId || !coordsName || !testPreviewSrc
                  }
                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-30 disabled:grayscale disabled:scale-100 disabled:cursor-not-allowed"
                >
                  Generer
                </button>
              </div>
            </div>

            <div className="w-px h-12 bg-gray-100 dark:border-white/10 shrink-0" />

            <div id="tour-nav-guide" className="flex items-center gap-4 py-2 border-l border-gray-100 dark:border-white/10 pl-6 ml-auto">
              <button
                onClick={openTour}
                className="p-3 text-gray-400 hover:text-primary transition-colors flex flex-col items-center gap-1 group"
                title="Aide & Tutoriel"
              >
                <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="text-[8px] font-black uppercase">Guide</span>
              </button>
              <div className="w-px h-8 bg-gray-100 dark:border-white/10" />
              <ThemeToggle />
              {user && (
                <>
                  <div className="w-px h-8 bg-gray-100 dark:border-white/10" />
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-white/20 shadow-sm bg-white dark:bg-white/10 flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Dynamic Status Bar (Restored Functionality) - Separated Row */}
          <div
            ref={statusRef}
            className={`relative overflow-hidden max-w-[1600px] mx-auto px-8 py-2.5 flex items-center justify-between bg-gray-50/80 dark:bg-slate-950/40 border-y border-gray-100 dark:border-white/10 transition-all ${statusPulse ? "ring-2 ring-primary/40 shadow-lg shadow-primary/20 rounded-xl" : ""}`}
          >
            {statusPulse && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.2, ease: "linear" }}
                className="absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-primary/20 to-transparent pointer-events-none"
              />
            )}
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    {status || t("app.status_loading")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${status && (status.includes("Erreur") || status.includes("Error")) ? "bg-red-500" : status && (status.includes("succès") || status.includes("success") || status.includes("terminée") || status.includes("complete")) ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {status || t("app.status_ready")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {progress > 0 && progress < 100 && (
                <div className="flex items-center gap-4 min-w-[300px]">
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                    />
                  </div>
                  <span className="text-[10px] font-black text-primary">
                    {progress}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,65%)_minmax(0,35%)] gap-8 items-start">
            {/* Main Preview Area */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-card overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white/40 dark:bg-white/5">
                  <div className="flex items-center gap-4">
                    <h2 className="text-gray-800 dark:text-white font-bold flex items-center gap-2">
                      <Layout className="w-5 h-5 text-primary" />{" "}
                      {t("app.visualizer_title")}
                    </h2>
                    {fileFormat && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase">
                        <FileImage className="w-3 h-3" /> {t("app.model_label")}{" "}
                        : {fileFormat}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {modelPreviewSrc && (
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/10 rounded-lg p-1">
                        <button
                          onClick={handleZoomOut}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded transition-colors"
                          title="Zoom arriere"
                        >
                          <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 px-2">
                          {Math.round(zoomLevel * 100)}%
                        </span>
                        <button
                          onClick={handleZoomIn}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded transition-colors"
                          title="Zoom avant"
                        >
                          <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={handleResetZoom}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded transition-colors"
                          title="Reinitialiser zoom"
                        >
                          <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    )}
                    <div className="text-xs font-bold text-gray-500 flex items-center gap-3">
                      {coordsName && (
                        <span className="flex items-center gap-1 text-primary">
                          <Type className="w-3 h-3" /> {coordsName.x},{" "}
                          {coordsName.y}
                        </span>
                      )}
                      {useTable && coordsTable && (
                        <span className="flex items-center gap-1 text-accent">
                          <Hash className="w-3 h-3" /> {coordsTable.x},{" "}
                          {coordsTable.y}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative group min-h-[750px] flex items-center justify-center bg-gray-100/30 dark:bg-slate-950/40 m-4 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-white/5 shadow-inner overflow-hidden">
                  {modelPreviewSrc && useTable && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
                      <div className="bg-white/90 dark:bg-slate-900/85 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-2 shadow-xl flex flex-col gap-2">
                        <button
                          onClick={() => handleModeSelect("name")}
                          className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${selectionMode === "name" ? "bg-primary text-white shadow-md" : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"}`}
                        >
                          N - Nom
                        </button>
                        <button
                          onClick={() => handleModeSelect("table")}
                          className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${selectionMode === "table" ? "bg-accent text-white shadow-md" : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"}`}
                        >
                          T - Table
                        </button>
                      </div>
                    </div>
                  )}
                  {!modelPreviewSrc ? (
                    <div className="text-center p-12">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                      </div>
                      <p className="text-gray-400 dark:text-gray-500 font-medium italic flex items-center justify-center gap-2">
                        {t("app.preview_placeholder")}{" "}
                        <ArrowLeft className="w-4 h-4 animate-pulse" />
                      </p>
                    </div>
                  ) : (
                    <div
                      ref={containerRef}
                      className="relative cursor-crosshair overflow-hidden w-full h-full flex items-center justify-center"
                    >
                      <div
                        className="relative"
                        style={{
                          transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                          transformOrigin: "center",
                          transition: isDragging
                            ? "none"
                            : "transform 0.2s ease-out",
                        }}
                      >
                        <img
                          src={modelPreviewSrc}
                          ref={modelImgRef}
                          onClick={handleImageClick}
                          className="max-w-full max-h-[75vh] shadow-2xl rounded-sm select-none"
                          alt="Work in progress"
                          draggable={false}
                        />
                        {(() => {
                          const marker = getMarkerStyle(coordsName);
                          if (!marker) return null;
                          return (
                            <div
                              style={marker}
                              className="absolute -translate-x-1/2 -translate-y-full pointer-events-none"
                            >
                              <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-md border border-white text-[9px] font-black">
                                N
                              </div>
                            </div>
                          );
                        })()}
                        {useTable &&
                          (() => {
                            const marker = getMarkerStyle(coordsTable);
                            if (!marker) return null;
                            return (
                              <div
                                style={marker}
                                className="absolute -translate-x-1/2 -translate-y-full pointer-events-none"
                              >
                                <div className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center shadow-md border border-white text-[9px] font-black">
                                  T
                                </div>
                              </div>
                            );
                          })()}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {testPreviewSrc && (
                  <motion.div
                    id="result-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-6 border-2 border-green-500/20 shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />{" "}
                        {t("app.final_render")}
                      </h2>
                      {downloadUrl && (
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-primary text-white rounded-lg hover:scale-105 transition-transform"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <div className="bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 p-2 shadow-inner">
                      <img
                        src={testPreviewSrc}
                        alt="Test Result"
                        className="w-full h-auto rounded-lg shadow-sm"
                      />
                    </div>
                    <p className="mt-4 text-[10px] text-gray-400 font-medium text-center italic">
                      {t("app.status_test_success")}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls Area */}
            <div className="space-y-2 lg:min-h-[520px]">
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                id="tour-typography-card" className="glass-card p-6 lg:fixed lg:top-34 lg:right-8 lg:w-[min(560px,34vw)]"
              >
                <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-6">
                  <Settings className="w-5 h-5 text-primary" /> Typography
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-300 uppercase mb-2 block">
                      Police
                    </label>
                    <select
                      id="tour-font-select"
                      className="font-picker w-full glass-input bg-white dark:bg-slate-900 px-3 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none text-gray-900 dark:text-white border border-gray-100 dark:border-white/10"
                      value={settings.fontFamily}
                      onChange={(e) =>
                        setSettings({ ...settings, fontFamily: e.target.value })
                      }
                    >
                      {fontOptions.map((fontName) => (
                        <option
                          key={fontName}
                          value={fontName}
                          style={{ fontFamily: `'${fontName}', sans-serif` }}
                        >
                          {fontName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-300 uppercase">
                        Taille
                      </label>
                      <span className="text-xs font-black text-primary">
                        {settings.fontSize}px
                      </span>
                    </div>
                    <input
                      id="tour-size-slider"
                      type="range"
                      min="10"
                      max="200"
                      step="1"
                      className="w-full accent-primary"
                      value={settings.fontSize}
                      onChange={(e) =>
                        setSettings({ ...settings, fontSize: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-300 uppercase mb-2 block">
                      Style
                    </label>
                    <div id="tour-style-controls" className="flex gap-2">
                      <button
                        onClick={() =>
                          setSettings({
                            ...settings,
                            fontWeight:
                              settings.fontWeight === "bold"
                                ? "normal"
                                : "bold",
                          })
                        }
                        className={`flex-1 p-3 rounded-xl border transition-all ${settings.fontWeight === "bold" ? "bg-primary text-white border-primary shadow-lg" : "bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-white/10"}`}
                      >
                        <Bold className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() =>
                          setSettings({
                            ...settings,
                            fontStyle:
                              settings.fontStyle === "italic"
                                ? "normal"
                                : "italic",
                          })
                        }
                        className={`flex-1 p-3 rounded-xl border transition-all ${settings.fontStyle === "italic" ? "bg-primary text-white border-primary shadow-lg" : "bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-white/10"}`}
                      >
                        <Italic className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() =>
                          setSettings({
                            ...settings,
                            textDecoration:
                              settings.textDecoration === "underline"
                                ? "none"
                                : "underline",
                          })
                        }
                        className={`flex-1 p-3 rounded-xl border transition-all ${settings.textDecoration === "underline" ? "bg-primary text-white border-primary shadow-lg" : "bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-white/10"}`}
                      >
                        <Underline className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-300 uppercase mb-2 block">
                      Couleur
                    </label>
                    <div id="tour-color-controls" className="flex gap-3">
                      <div className="relative w-12 h-12 shrink-0 group">
                        <input
                          type="color"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          value={settings.color}
                          onChange={(e) =>
                            setSettings({ ...settings, color: e.target.value })
                          }
                        />
                        <div
                          className="w-full h-full rounded-xl border-2 border-white dark:border-slate-800 shadow-md transition-transform group-hover:scale-105"
                          style={{ backgroundColor: settings.color }}
                        />
                      </div>
                      <input
                        type="text"
                        className="flex-1 glass-input bg-white dark:bg-white/5 px-4 py-3 rounded-xl text-sm font-mono font-bold uppercase text-gray-900 dark:text-white"
                        value={settings.color}
                        onChange={(e) =>
                          setSettings({ ...settings, color: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-sm font-medium text-gray-400 dark:text-gray-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-primary font-bold">Namster</span> Premium.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default AppGenerator;

