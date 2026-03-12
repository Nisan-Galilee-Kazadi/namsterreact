import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowLeft, Sparkles, Settings2, Download, Image as ImageIcon, Type, Palette, Monitor, Star, Save } from "lucide-react";
import { templates, fonts } from "../data/templates";
import SideMenu from "../components/SideMenu";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../api";

const TemplateCustomizer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();

  const templateId = parseInt(id, 10);
  const selectedTemplate = templates.find(t => t.id === templateId) || templates[0];
  const preloadedCustomization = location.state?.customizationData;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('text'); // 'text', 'background', 'typography'
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [customizationData, setCustomizationData] = useState(() => {
    const base = {
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      primaryColor: selectedTemplate.colors[0],
      secondaryColor: selectedTemplate.colors[1],
      fontFamily: selectedTemplate.defaultFont,
      bgType: selectedTemplate.bgStyle || "gradient",
      bgImage: null,
      bgPosition: "center",
      orientation: selectedTemplate.orientation || "landscape",
      textColor: "#1a1a1a",
      elementsConfig: {
        title: { x: null, y: null, size: null },
        date: { x: null, y: null, size: null },
        time: { x: null, y: null, size: null },
        description: { x: null, y: null, size: null },
        location: { x: null, y: null, size: null },
        placeholders: { x: null, y: null, size: null }
      }
    };
    if (preloadedCustomization && typeof preloadedCustomization === 'object') {
      return { ...base, ...preloadedCustomization, elementsConfig: { ...base.elementsConfig, ...(preloadedCustomization.elementsConfig || {}) } };
    }
    return base;
  });
  const isFavorite = user?.favoriteTemplateIds?.includes(selectedTemplate.id) ?? false;

  const [visibleAdvanced, setVisibleAdvanced] = useState({
    title: false,
    date: false,
    time: false,
    location: false,
    description: false,
    placeholders: false
  });

  const canvasRef = useRef(null);

  const isPortrait = customizationData.orientation === "portrait";
  const canvasWidth = isPortrait ? 800 : 800;
  const canvasHeight = isPortrait ? 1200 : 600;

  useEffect(() => {
    if (selectedTemplate && canvasRef.current) {
      renderCanvas();
    }
  }, [selectedTemplate, customizationData]);

  const renderCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear everything first
    ctx.fillStyle = customizationData.bgType === 'image' ? (customizationData.primaryColor || "#ffffff") : "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Wait for fonts to be ready
    await document.fonts.ready;

    const drawAll = (img = null) => {
      renderBackground(ctx, canvasWidth, canvasHeight, img);
      renderContent(ctx, canvasWidth, canvasHeight);
    };

    if (customizationData.bgType === 'image' && customizationData.bgImage) {
      const img = new Image();
      img.onload = () => drawAll(img);
      img.onerror = () => drawAll(null);
      img.src = customizationData.bgImage;
    } else {
      drawAll(null);
    }
  };

  const renderBackground = (ctx, width, height, loadedImg = null) => {
    const layout = selectedTemplate?.layout || "centered";
    const decor = selectedTemplate?.decor;

    ctx.fillStyle = customizationData.primaryColor || "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const pos = customizationData.bgPosition || 'center';

    const drawImageScaled = (img, x, y, w, h) => {
      const scale = Math.max(w / img.width, h / img.height);
      const iw = img.width * scale;
      const ih = img.height * scale;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
      ctx.restore();
    };

    if (customizationData.bgType === 'image' && (customizationData.bgImage || loadedImg)) {
      const img = loadedImg || new Image();
      if (!loadedImg) img.src = customizationData.bgImage;

      if (img.complete || loadedImg) {
        if (pos === 'center' || pos === 'full') {
          drawImageScaled(img, 0, 0, width, height);
        } else {
          const drawWidth = width * 0.5;
          const dx = pos === 'left' ? 0 : drawWidth;
          drawImageScaled(img, dx, 0, drawWidth, height);
        }
      }
    } else if (customizationData.bgType === 'gradient') {
      let gradient;
      if (pos === 'left') {
        gradient = ctx.createLinearGradient(0, 0, width * 0.5, 0);
      } else if (pos === 'right') {
        gradient = ctx.createLinearGradient(width * 0.5, 0, width, 0);
      } else if (isPortrait) {
        gradient = ctx.createLinearGradient(0, 0, 0, height);
      } else {
        gradient = ctx.createLinearGradient(0, 0, width, height);
      }

      gradient.addColorStop(0, customizationData.primaryColor);
      gradient.addColorStop(1, customizationData.secondaryColor);
      ctx.fillStyle = gradient;

      if (pos === 'left') {
        ctx.fillRect(0, 0, width * 0.5, height);
        ctx.fillStyle = customizationData.secondaryColor;
        ctx.fillRect(width * 0.5, 0, width * 0.5, height);
      } else if (pos === 'right') {
        ctx.fillRect(width * 0.5, 0, width * 0.5, height);
        ctx.fillStyle = customizationData.primaryColor;
        ctx.fillRect(0, 0, width * 0.5, height);
      } else {
        ctx.fillRect(0, 0, width, height);
      }
    }

    if (decor?.includes('arch')) {
      ctx.save();
      ctx.fillStyle = customizationData.secondaryColor || '#f9f9f9';
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(0,0,0,0.1)';

      let archCenter = width / 2;
      let archMaxWidth = width;
      if (pos === 'left') { archCenter = width * 0.75; archMaxWidth = width * 0.5; }
      else if (pos === 'right') { archCenter = width * 0.25; archMaxWidth = width * 0.5; }

      const archW = Math.min(archMaxWidth * 0.7, isPortrait ? 600 : 400);
      const archH = height * 0.8;
      const archX = archCenter - archW / 2;
      const archY = (height - archH) / 2 + 20;

      ctx.beginPath();
      ctx.moveTo(archX, archY + archH);
      ctx.lineTo(archX, archY + archW / 2);
      ctx.arc(archX + archW / 2, archY + archW / 2, archW / 2, Math.PI, 0);
      ctx.lineTo(archX + archW, archY + archH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  };

  const renderContent = (ctx, width, height) => {
    const layout = selectedTemplate?.layout || "centered";
    const decor = selectedTemplate?.decor;
    const textColor = customizationData.textColor || "#1a1a1a";
    const pos = customizationData.bgPosition || 'center';

    let centerX = width / 2;
    let startY = isPortrait ? 200 : 100;
    let textAlign = "center";
    let contentWidth = width * 0.8;

    if (pos === 'left') {
      centerX = width * 0.75;
      contentWidth = width * 0.4;
      textAlign = "center";
    } else if (pos === 'right') {
      centerX = width * 0.25;
      contentWidth = width * 0.4;
      textAlign = "center";
    }

    if (layout === "split" && pos === "center") {
      centerX = width * 0.7;
      contentWidth = width * 0.4;
      textAlign = "left";
    } else if (layout === "sidebar-left" && pos === "center") {
      centerX = width * 0.65;
      contentWidth = width * 0.5;
      textAlign = "left";
    }

    if (pos !== 'center') {
      startY = isPortrait ? 240 : 140;
    }

    ctx.textAlign = textAlign;

    const getConf = (key, defaultX, defaultY, defaultSize) => {
      const conf = customizationData.elementsConfig[key] || {};
      const templateConf = selectedTemplate.config?.[key] || {};
      return {
        x: conf.x !== null ? conf.x : (templateConf.x || defaultX),
        y: conf.y !== null ? conf.y : (templateConf.y || defaultY),
        size: conf.size !== null ? conf.size : (templateConf.size || defaultSize)
      };
    };

    ctx.save();
    ctx.strokeStyle = textColor;
    ctx.fillStyle = textColor;

    const tC = getConf('title', centerX, startY, isPortrait ? 90 : 64);
    ctx.font = `bold ${tC.size}px "${customizationData.fontFamily}", sans-serif`;
    ctx.fillText(customizationData.title || (isPortrait ? "Portrait Event" : "Sample Event"), tC.x, tC.y);

    const dsC = getConf('description', centerX, tC.y + 60, isPortrait ? 24 : 18);
    ctx.font = `italic ${dsC.size}px "${customizationData.fontFamily}", sans-serif`;
    ctx.globalAlpha = 0.8;
    const descText = customizationData.description || "Join us for a wonderful celebration filled with joy and happiness.";
    const words = descText.split(' ');
    let line = '';
    let currY = dsC.y;
    const maxDescWidth = contentWidth;

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      if (metrics.width > maxDescWidth && n > 0) {
        ctx.fillText(line.trim(), dsC.x, currY);
        line = words[n] + ' ';
        currY += dsC.size + 10;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), dsC.x, currY);

    const dC = getConf('date', centerX, isPortrait ? height - 350 : currY + 60, isPortrait ? 40 : 28);
    ctx.globalAlpha = 1.0;
    ctx.font = `normal ${dC.size}px "${customizationData.fontFamily}", sans-serif`;
    ctx.fillText(customizationData.date || "OCTOBER 14, 2026", dC.x, dC.y);

    const tmC = getConf('time', centerX, dC.y + (isPortrait ? 60 : 40), isPortrait ? 28 : 20);
    ctx.font = `300 ${tmC.size}px "${customizationData.fontFamily}", sans-serif`;
    ctx.fillText(customizationData.time || "4:00 PM UNTIL LATE", tmC.x, tmC.y);

    const pC = getConf('placeholders', centerX, tmC.y + (isPortrait ? 80 : 60), isPortrait ? 26 : 22);
    ctx.font = `bold ${pC.size}px "${customizationData.fontFamily}", sans-serif`;
    ctx.fillText("INVITÉ(E): [NOM]", pC.x, pC.y);
    ctx.fillText("TABLE: [01]", pC.x, pC.y + pC.size + 10);

    const lC = getConf('location', centerX, height - (isPortrait ? 100 : 60), isPortrait ? 28 : 22);
    ctx.font = `bold ${lC.size}px "${customizationData.fontFamily}", sans-serif`;
    ctx.fillText(customizationData.location || "123 Event Venue, City State", lC.x, lC.y);

    ctx.restore();
  };

  const handleFinalizeTemplate = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      await renderCanvas();
      canvas.toBlob((blob) => {
        const file = new File([blob], "invitation_template.png", { type: "image/png" });
        navigate('/app', {
          state: {
            preloadedModel: file,
            defaultSettings: {
              fontFamily: customizationData.fontFamily,
              color: customizationData.textColor,
              fontWeight: 'bold',
              fontSize: 24
            }
          }
        });
      });
    }
  };

  const handleSaveTemplate = async () => {
    if (!user || !saveName.trim()) return;
    setSaveLoading(true);
    try {
      await axios.post(`${API_URL}/user/saved-templates`, {
        name: saveName.trim(),
        templateId: selectedTemplate.id,
        customizationData
      });
      setShowSaveModal(false);
      setSaveName("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Erreur lors de la sauvegarde");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user || favoriteLoading) return;
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await axios.delete(`${API_URL}/user/favorites/${selectedTemplate.id}`);
      } else {
        await axios.post(`${API_URL}/user/favorites`, { templateId: selectedTemplate.id });
      }
      await refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const AdvancedToggle = ({ id }) => (
    <button type="button" onClick={(e) => { e.preventDefault(); setVisibleAdvanced({ ...visibleAdvanced, [id]: !visibleAdvanced[id] }); }} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
      <Settings2 className={`w-4 h-4 ${visibleAdvanced[id] ? 'text-primary' : 'text-gray-400'}`} />
    </button>
  );

  const renderAdvanced = (id) => {
    if (!visibleAdvanced[id]) return null;
    return (
      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="pt-2 grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-white/5 mt-2 overflow-hidden">
        <div>
          <label className="text-[9px] uppercase font-black text-gray-500 mb-1 block">Taille</label>
          <input type="number" className="w-full p-2 bg-gray-50 dark:bg-white/5 dark:text-gray-300 rounded-lg text-xs"
            value={customizationData.elementsConfig[id].size || ''}
            onChange={(e) => setCustomizationData({ ...customizationData, elementsConfig: { ...customizationData.elementsConfig, [id]: { ...customizationData.elementsConfig[id], size: parseFloat(e.target.value) || null } } })}
            placeholder="Auto" />
        </div>
        <div>
          <label className="text-[9px] uppercase font-black text-gray-500 mb-1 block">Pos X</label>
          <input type="number" className="w-full p-2 bg-gray-50 dark:bg-white/5 dark:text-gray-300 rounded-lg text-xs"
            value={customizationData.elementsConfig[id].x || ''}
            onChange={(e) => setCustomizationData({ ...customizationData, elementsConfig: { ...customizationData.elementsConfig, [id]: { ...customizationData.elementsConfig[id], x: parseFloat(e.target.value) || null } } })}
            placeholder="Auto" />
        </div>
        <div>
          <label className="text-[9px] uppercase font-black text-gray-500 mb-1 block">Pos Y</label>
          <input type="number" className="w-full p-2 bg-gray-50 dark:bg-white/5 dark:text-gray-300 rounded-lg text-xs"
            value={customizationData.elementsConfig[id].y || ''}
            onChange={(e) => setCustomizationData({ ...customizationData, elementsConfig: { ...customizationData.elementsConfig, [id]: { ...customizationData.elementsConfig[id], y: parseFloat(e.target.value) || null } } })}
            placeholder="Auto" />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex bg-gray-50 dark:bg-slate-900 min-h-screen text-gray-900 dark:text-gray-100">
      <SideMenu isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`flex-1 transition-all duration-300 h-[100dvh] flex flex-col md:flex-row overflow-hidden ${isCollapsed ? 'ml-20 pl-2' : 'ml-64 pl-4'}`}>
        
        {/* Left Side: Customization Sidebar — reste fixe, ne scroll pas */}
        <div className="w-full md:w-[400px] shrink-0 bg-white dark:bg-white/5 border-r border-gray-200 dark:border-white/10 flex flex-col min-h-0 md:min-h-0 h-full">
          <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between shadow-sm sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-20">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/dashboard', { state: { tab: 'templates' } })} className="p-2 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
              <div>
                <h2 className="text-lg font-black">{t(`dashboard.${selectedTemplate.nameKey}`, selectedTemplate.nameKey)}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase font-black text-gray-400">Format</span>
                  <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setCustomizationData(prev => ({ ...prev, orientation: 'portrait' }))}
                      className={`px-2.5 py-1 text-[10px] font-bold transition-colors ${customizationData.orientation === 'portrait' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                    >
                      Portrait
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomizationData(prev => ({ ...prev, orientation: 'landscape' }))}
                      className={`px-2.5 py-1 text-[10px] font-bold transition-colors ${customizationData.orientation === 'landscape' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                    >
                      Paysage
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(true)}
                    className="p-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                    title="Sauvegarder sous un nom"
                  >
                    <Save className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    disabled={favoriteLoading}
                    className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500'}`}
                    title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </>
              )}
              <button onClick={handleFinalizeTemplate} className="bg-primary hover:bg-primary/90 text-white p-2.5 rounded-full shadow-lg shadow-primary/20 transition-all">
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showSaveModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !saveLoading && setShowSaveModal(false)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-sm"
              >
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Sauvegarder ce modèle</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Donnez un nom à cette personnalisation pour la retrouver plus tard.</p>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Ex: Mariage Sophie 2026"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm font-medium mb-4 focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => !saveLoading && setShowSaveModal(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10">
                    Annuler
                  </button>
                  <button type="button" onClick={handleSaveTemplate} disabled={saveLoading || !saveName.trim()} className="px-4 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                    {saveLoading ? "Enregistrement…" : "Enregistrer"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          <div className="flex border-b border-gray-100 dark:border-white/10 px-4 pt-4 shrink-0 bg-gray-50/50 dark:bg-transparent">
            {[
              { id: 'text', label: 'Contenu', icon: Type },
              { id: 'background', label: 'Arrière-plan', icon: ImageIcon },
              { id: 'typography', label: 'Style', icon: Palette }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 flex flex-col items-center gap-1 ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {activeTab === 'text' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Titre</label>
                    <AdvancedToggle id="title" />
                  </div>
                  <input type="text" className="w-full p-4 bg-gray-50 dark:bg-white/5 dark:text-white rounded-2xl border-none shadow-inner text-sm font-black focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Nom de l'événement" value={customizationData.title} onChange={(e) => setCustomizationData({ ...customizationData, title: e.target.value })} />
                  {renderAdvanced('title')}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</label>
                      <AdvancedToggle id="date" />
                    </div>
                    <input type="text" className="w-full p-3 bg-gray-50 dark:bg-white/5 dark:text-white rounded-xl border-none shadow-inner text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" placeholder="14 Oct 2026" value={customizationData.date} onChange={(e) => setCustomizationData({ ...customizationData, date: e.target.value })} />
                    {renderAdvanced('date')}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Heure</label>
                      <AdvancedToggle id="time" />
                    </div>
                    <input type="text" className="w-full p-3 bg-gray-50 dark:bg-white/5 dark:text-white rounded-xl border-none shadow-inner text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" placeholder="16:00" value={customizationData.time} onChange={(e) => setCustomizationData({ ...customizationData, time: e.target.value })} />
                    {renderAdvanced('time')}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lieu</label>
                    <AdvancedToggle id="location" />
                  </div>
                  <input type="text" className="w-full p-4 bg-gray-50 dark:bg-white/5 dark:text-white rounded-2xl border-none shadow-inner text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none pt-4" placeholder="Adresse" value={customizationData.location} onChange={(e) => setCustomizationData({ ...customizationData, location: e.target.value })} />
                  {renderAdvanced('location')}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message</label>
                    <AdvancedToggle id="description" />
                  </div>
                  <textarea rows={3} className="w-full p-4 bg-gray-50 dark:bg-white/5 dark:text-white rounded-2xl border-none shadow-inner text-sm font-medium resize-none placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Message d'invitation..." value={customizationData.description} onChange={(e) => setCustomizationData({ ...customizationData, description: e.target.value })} />
                  {renderAdvanced('description')}
                </div>
              </motion.div>
            )}

            {activeTab === 'background' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
                  <button onClick={(e) => { e.preventDefault(); setCustomizationData({ ...customizationData, bgType: 'gradient' }); }} className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${customizationData.bgType === 'gradient' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-gray-500'}`}>
                    Dégradé / Couleur
                  </button>
                  <button onClick={(e) => { e.preventDefault(); setCustomizationData({ ...customizationData, bgType: 'image' }); }} className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${customizationData.bgType === 'image' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-gray-500'}`}>
                    Image
                  </button>
                </div>

                {customizationData.bgType === 'image' && (
                  <div className="p-5 border border-dashed border-primary/30 rounded-2xl bg-primary/5 text-center">
                    <Monitor className="w-8 h-8 mx-auto mb-3 text-primary/50" />
                    <label className="text-primary font-bold text-sm cursor-pointer hover:underline">
                      Cliquez pour uploader
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => setCustomizationData({ ...customizationData, bgImage: re.target.result });
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                    <p className="text-[10px] text-gray-400 mt-1">PNG, JPG (Max 5MB)</p>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Position & Composition</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['left', 'center', 'right'].map(pos => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setCustomizationData(prev => ({ ...prev, bgPosition: pos }))}
                        className={`py-2.5 rounded-xl text-[10px] font-bold border transition-all ${customizationData.bgPosition === pos ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                      >
                        {pos === 'center' ? 'Plein Format' : pos === 'left' ? 'Aligné Gauche' : 'Aligné Droite'}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'typography' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Police principale</label>
                  <select className="w-full p-4 bg-gray-50 dark:bg-white/5 dark:text-white rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" value={customizationData.fontFamily} onChange={(e) => setCustomizationData({ ...customizationData, fontFamily: e.target.value })}>
                    {fonts.map(font => <option key={font} value={font}>{font}</option>)}
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Palette de couleurs</label>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Texte</span>
                    <input type="color" className="w-8 h-8 rounded shrink-0 cursor-pointer border-none bg-transparent" value={customizationData.textColor} onChange={(e) => setCustomizationData({ ...customizationData, textColor: e.target.value })} />
                  </div>

                  {customizationData.bgType === 'gradient' && (
                    <>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Arrière-plan 1</span>
                        <input type="color" className="w-8 h-8 rounded shrink-0 cursor-pointer border-none bg-transparent" value={customizationData.primaryColor} onChange={(e) => setCustomizationData({ ...customizationData, primaryColor: e.target.value })} />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Arrière-plan 2</span>
                        <input type="color" className="w-8 h-8 rounded shrink-0 cursor-pointer border-none bg-transparent" value={customizationData.secondaryColor} onChange={(e) => setCustomizationData({ ...customizationData, secondaryColor: e.target.value })} />
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Side: Canva-like Work Area — scroll en portrait, taille stable */}
        <div className="flex-1 min-w-0 min-h-[60vh] bg-gray-100 dark:bg-gray-900/50 p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-y-auto">
          <div className="w-full max-w-xl mx-auto flex items-center justify-between mb-4 px-2 sm:px-4">
            <h1 className="text-lg sm:text-xl font-black text-gray-800 dark:text-white capitalize">Espace de Travail</h1>
            <div className="flex gap-2 sm:gap-3 items-center">
              <button 
                onClick={handleFinalizeTemplate}
                className="btn-primary py-2 px-4 sm:py-2.5 sm:px-6 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Générer les Invitations</span>
                <span className="sm:hidden">Générer</span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-xl mx-auto flex items-center justify-center min-h-0 bg-transparent rounded-3xl p-2 sm:p-4 overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              className="max-h-full max-w-full rounded-2xl shadow-2xl transition-all duration-300 bg-white"
              style={{ objectFit: 'contain', aspectRatio: isPortrait ? '2/3' : '16/9', width: '100%', height: 'auto', maxHeight: '100%' }}
            />
          </div>
          
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-4">
            Prévisualisation • {canvasWidth}×{canvasHeight}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplateCustomizer;
