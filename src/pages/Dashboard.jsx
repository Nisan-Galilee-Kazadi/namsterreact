import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Clock,
  FileStack,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  Calendar,
  Star,
  Settings,
  LayoutGrid,
  History as HistoryIcon,
  Search,
  Filter,
  Shield,
  CreditCard,
  User,
  Mail,
  Bell,
  Globe,
  CheckCircle,
  Settings2,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [visibleAdvanced, setVisibleAdvanced] = useState({
    title: false,
    date: false,
    time: false,
    location: false,
    description: false,
    placeholders: false
  });
  const [customizationData, setCustomizationData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    primaryColor: "#ffffff",
    secondaryColor: "#f0f0f0",
    fontFamily: "Outfit",
    bgType: "gradient", // 'gradient' | 'image'
    bgImage: null,
    bgPosition: "center", // 'full/center', 'left', 'right'
    textColor: "#1a1a1a",
    elementsConfig: {
      title: { x: null, y: null, size: null },
      date: { x: null, y: null, size: null },
      time: { x: null, y: null, size: null },
      description: { x: null, y: null, size: null },
      location: { x: null, y: null, size: null },
      placeholders: { x: null, y: null, size: null }
    }
  });

  const getContrastYIQ = (hexcolor) => {
    if (!hexcolor || hexcolor.startsWith('linear')) return '#1a1a1a';
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#1a1a1a' : '#ffffff';
  };
  const canvasRef = useRef(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState({ invitationsGénérées: 0, heuresGagnées: 0, precision: 100 });
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", email: "" });

  const API_BASE =
    import.meta.env.VITE_API_BASE ||
    (import.meta.env.PROD
      ? 'https://namsterbackend-3.onrender.com'
      : 'http://localhost:3001');

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      const [pRes, sRes] = await Promise.all([
        axios.get(`${API_BASE}/api/user/profile`, { headers }),
        axios.get(`${API_BASE}/api/user/stats`, { headers })
      ]);
      setUserProfile(pRes.data);
      setUserStats(sRes.data);
      setEditForm({
        firstName: pRes.data.firstName || "",
        lastName: pRes.data.lastName || "",
        email: pRes.data.email || ""
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`${API_BASE}/api/auth/profile`, editForm, { headers });
      fetchDashboardData();
      alert(t('dashboard.profile_updated_success'));
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(t('dashboard.profile_updated_error'));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const templates = [
    // --- WEDDING (Romantic & Elegant) ---
    {
      id: 1, nameKey: "wedding_arch_minimal", categoryKey: "wedding", colors: ["#fffaf0", "#fdfcf0"], bgStyle: "gradient", decor: "arch-minimal", layout: "centered", defaultFont: "Pinyon Script",
      config: { title: { x: 400, y: 160, size: 84 }, date: { x: 400, y: 300, size: 32 }, time: { x: 400, y: 340, size: 20 }, description: { x: 400, y: 420, size: 18 }, location: { x: 400, y: 530, size: 22 }, placeholders: { x: 400, y: 470, size: 20 } }
    },
    {
      id: 2, nameKey: "wedding_ornate_floral", categoryKey: "wedding", colors: ["#ffffff", "#f8f9fa"], bgStyle: "gradient", decor: "ornate-border", layout: "centered", defaultFont: "Great Vibes",
      config: { title: { x: 400, y: 220, size: 72 }, date: { x: 400, y: 320, size: 28 }, time: { x: 400, y: 360, size: 18 }, description: { x: 400, y: 440, size: 16 }, location: { x: 400, y: 550, size: 20 }, placeholders: { x: 400, y: 490, size: 18 } }
    },
    {
      id: 3, nameKey: "wedding_botanical_split", categoryKey: "wedding", colors: ["#f1f8e9", "#ffffff"], bgStyle: "gradient", decor: "leaf-border", layout: "split-horizontal", defaultFont: "Bodoni Moda",
      config: { title: { x: 400, y: 100, size: 72 }, date: { x: 220, y: 350, size: 38 }, time: { x: 220, y: 400, size: 22 }, description: { x: 580, y: 350, size: 18 }, location: { x: 400, y: 550, size: 22 }, placeholders: { x: 580, y: 450, size: 18 } }
    },
    {
      id: 4, nameKey: "wedding_boho_corners", categoryKey: "wedding", colors: ["#fff9c4", "#fffde7"], bgStyle: "gradient", decor: "floral-corners", layout: "centered-tight", defaultFont: "Sacramento",
      config: { title: { x: 400, y: 210, size: 70 }, date: { x: 400, y: 110, size: 24 }, time: { x: 400, y: 140, size: 18 }, description: { x: 400, y: 330, size: 18 }, location: { x: 400, y: 510, size: 24 }, placeholders: { x: 400, y: 430, size: 20 } }
    },
    {
      id: 5, nameKey: "wedding_royal_gold", categoryKey: "wedding", colors: ["#ffffff", "#fffdf0"], bgStyle: "gradient", decor: "royal-crest", layout: "centered", defaultFont: "Bodoni Moda",
      config: { title: { x: 400, y: 260, size: 56 }, date: { x: 400, y: 360, size: 28 }, time: { x: 400, y: 400, size: 18 }, description: { x: 400, y: 130, size: 22 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 470, size: 20 } }
    },
    {
      id: 6, nameKey: "wedding_vintage_script", categoryKey: "wedding", colors: ["#fff3e0", "#ffffff"], bgStyle: "gradient", decor: "border-slim", layout: "asymmetric-left", defaultFont: "Dancing Script",
      config: { title: { x: 280, y: 160, size: 72 }, date: { x: 280, y: 260, size: 32 }, time: { x: 280, y: 310, size: 22 }, description: { x: 280, y: 390, size: 18 }, location: { x: 280, y: 530, size: 22 }, placeholders: { x: 280, y: 470, size: 20 } }
    },

    // --- GALA (Sophisticated & Bold) ---
    {
      id: 7, nameKey: "gala_midnight_gold", categoryKey: "gala", colors: ["#000000", "#1a1a1a"], bgStyle: "gradient", decor: "golden-dust", layout: "centered-wide", defaultFont: "Cinzel",
      config: { title: { x: 400, y: 200, size: 72 }, date: { x: 400, y: 340, size: 32 }, time: { x: 400, y: 380, size: 20 }, description: { x: 400, y: 440, size: 18 }, location: { x: 400, y: 120, size: 24 }, placeholders: { x: 400, y: 540, size: 22 } }
    },
    {
      id: 8, nameKey: "gala_emerald_arch", categoryKey: "gala", colors: ["#064e3b", "#065f46"], bgStyle: "gradient", decor: "arch", layout: "centered", defaultFont: "Playfair Display",
      config: { title: { x: 400, y: 220, size: 84 }, date: { x: 400, y: 350, size: 32 }, time: { x: 400, y: 390, size: 22 }, description: { x: 400, y: 120, size: 18 }, location: { x: 400, y: 540, size: 24 }, placeholders: { x: 400, y: 480, size: 20 } }
    },
    {
      id: 9, nameKey: "gala_art_deco_lines", categoryKey: "gala", colors: ["#1e293b", "#0f172a"], bgStyle: "gradient", decor: "deco-lines", layout: "centered", defaultFont: "Bodoni Moda",
      config: { title: { x: 400, y: 150, size: 64 }, date: { x: 400, y: 280, size: 24 }, time: { x: 400, y: 320, size: 18 }, description: { x: 400, y: 400, size: 16 }, location: { x: 400, y: 550, size: 22 }, placeholders: { x: 400, y: 480, size: 20 } }
    },
    {
      id: 10, nameKey: "gala_noir_badge", categoryKey: "gala", colors: ["#111111", "#000000"], bgStyle: "gradient", decor: "badge-style", layout: "centered", defaultFont: "Cinzel",
      config: { title: { x: 400, y: 310, size: 64 }, date: { x: 400, y: 180, size: 28 }, time: { x: 400, y: 220, size: 20 }, description: { x: 400, y: 400, size: 18 }, location: { x: 400, y: 530, size: 24 }, placeholders: { x: 400, y: 460, size: 20 } }
    },
    {
      id: 11, nameKey: "gala_ruby_sidebar", categoryKey: "gala", colors: ["#450a0a", "#7f1d1d"], bgStyle: "gradient", decor: "border-thick", layout: "sidebar-left", defaultFont: "Outfit",
      config: { title: { x: 220, y: 150, size: 60 }, date: { x: 220, y: 250, size: 32 }, time: { x: 220, y: 300, size: 22 }, description: { x: 220, y: 380, size: 18 }, location: { x: 220, y: 550, size: 22 }, placeholders: { x: 600, y: 300, size: 38 } }
    },
    {
      id: 12, nameKey: "gala_minimal_chic", categoryKey: "gala", colors: ["#ffffff", "#f1f5f9"], bgStyle: "gradient", decor: "border-slim", layout: "centered", defaultFont: "Cinzel",
      config: { title: { x: 400, y: 200, size: 72 }, date: { x: 400, y: 320, size: 32 }, time: { x: 400, y: 360, size: 24 }, description: { x: 400, y: 420, size: 18 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 470, size: 22 } }
    },

    // --- PARTY (Energetic & Fun) ---
    {
      id: 13, nameKey: "party_neon_night", categoryKey: "party", colors: ["#4c1d95", "#8b5cf6"], bgStyle: "gradient", decor: "tech-grid", layout: "centered-tight", defaultFont: "Outfit",
      config: { title: { x: 400, y: 220, size: 84 }, date: { x: 400, y: 120, size: 28 }, time: { x: 400, y: 155, size: 18 }, description: { x: 400, y: 340, size: 18 }, location: { x: 400, y: 540, size: 24 }, placeholders: { x: 400, y: 460, size: 22 } }
    },
    {
      id: 14, nameKey: "party_starry_sky", categoryKey: "party", colors: ["#1e1b4b", "#312e81"], bgStyle: "gradient", decor: "stars", layout: "centered", defaultFont: "Sacramento",
      config: { title: { x: 400, y: 250, size: 92 }, date: { x: 400, y: 120, size: 32 }, time: { x: 400, y: 160, size: 20 }, description: { x: 400, y: 380, size: 18 }, location: { x: 400, y: 530, size: 24 }, placeholders: { x: 400, y: 450, size: 22 } }
    },
    {
      id: 15, nameKey: "party_floral_pop", categoryKey: "party", colors: ["#fce7f3", "#fbcfe8"], bgStyle: "gradient", decor: "floral-left", layout: "asymmetric-right", defaultFont: "Great Vibes",
      config: { title: { x: 550, y: 180, size: 72 }, date: { x: 550, y: 280, size: 32 }, time: { x: 550, y: 320, size: 22 }, description: { x: 550, y: 400, size: 18 }, location: { x: 550, y: 540, size: 24 }, placeholders: { x: 550, y: 470, size: 22 } }
    },
    {
      id: 16, nameKey: "party_tropical_vibe", categoryKey: "party", colors: ["#ecfdf5", "#d1fae5"], bgStyle: "gradient", decor: "leaf-border", layout: "centered", defaultFont: "Dancing Script",
      config: { title: { x: 400, y: 200, size: 84 }, date: { x: 400, y: 100, size: 32 }, time: { x: 400, y: 140, size: 20 }, description: { x: 400, y: 320, size: 22 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 430, size: 22 } }
    },
    {
      id: 17, nameKey: "party_golden_dust", categoryKey: "party", colors: ["#111111", "#222222"], bgStyle: "gradient", decor: "golden-dust", layout: "centered", defaultFont: "Cinzel",
      config: { title: { x: 400, y: 240, size: 72 }, date: { x: 400, y: 120, size: 32 }, time: { x: 400, y: 160, size: 20 }, description: { x: 400, y: 380, size: 18 }, location: { x: 400, y: 540, size: 24 }, placeholders: { x: 400, y: 460, size: 22 } }
    },
    {
      id: 18, nameKey: "party_retro_disco", categoryKey: "party", colors: ["#4c1d95", "#000000"], bgStyle: "gradient", decor: "deco-lines", layout: "centered", defaultFont: "Outfit",
      config: { title: { x: 400, y: 300, size: 84 }, date: { x: 400, y: 120, size: 32 }, time: { x: 400, y: 160, size: 24 }, description: { x: 400, y: 420, size: 20 }, location: { x: 400, y: 550, size: 26 }, placeholders: { x: 400, y: 480, size: 22 } }
    },

    // --- CORPORATE (Professional & Clean) ---
    {
      id: 19, nameKey: "corp_tech_focus", categoryKey: "corporate", colors: ["#0f172a", "#334155"], bgStyle: "gradient", decor: "tech-grid", layout: "sidebar-left", defaultFont: "Outfit",
      config: { title: { x: 600, y: 150, size: 56 }, date: { x: 600, y: 250, size: 24 }, time: { x: 600, y: 290, size: 18 }, description: { x: 600, y: 380, size: 16 }, location: { x: 600, y: 540, size: 20 }, placeholders: { x: 200, y: 300, size: 32 } }
    },
    {
      id: 20, nameKey: "corp_minimal_white", categoryKey: "corporate", colors: ["#ffffff", "#f8fafc"], bgStyle: "gradient", decor: "border-slim", layout: "centered", defaultFont: "Bodoni Moda",
      config: { title: { x: 400, y: 180, size: 48 }, date: { x: 400, y: 280, size: 24 }, time: { x: 400, y: 320, size: 18 }, description: { x: 400, y: 400, size: 16 }, location: { x: 400, y: 530, size: 22 }, placeholders: { x: 400, y: 460, size: 20 } }
    },
    {
      id: 21, nameKey: "corp_executive_arch", categoryKey: "corporate", colors: ["#1e293b", "#334155"], bgStyle: "gradient", decor: "arch", layout: "centered", defaultFont: "Playfair Display",
      config: { title: { x: 400, y: 220, size: 64 }, date: { x: 400, y: 350, size: 28 }, time: { x: 400, y: 390, size: 18 }, description: { x: 400, y: 120, size: 18 }, location: { x: 400, y: 540, size: 22 }, placeholders: { x: 400, y: 460, size: 20 } }
    },
    {
      id: 22, nameKey: "corp_split_design", categoryKey: "corporate", colors: ["#f8fafc", "#e2e8f0"], bgStyle: "gradient", decor: "deco-lines", layout: "split-horizontal", defaultFont: "Outfit",
      config: { title: { x: 400, y: 100, size: 72 }, date: { x: 250, y: 350, size: 32 }, time: { x: 250, y: 400, size: 20 }, description: { x: 600, y: 350, size: 18 }, location: { x: 400, y: 550, size: 22 }, placeholders: { x: 600, y: 450, size: 20 } }
    },
    {
      id: 23, nameKey: "corp_modern_badge", categoryKey: "corporate", colors: ["#111827", "#1f2937"], bgStyle: "gradient", decor: "badge-style", layout: "centered", defaultFont: "Outfit",
      config: { title: { x: 400, y: 310, size: 56 }, date: { x: 400, y: 180, size: 24 }, time: { x: 400, y: 220, size: 18 }, description: { x: 400, y: 400, size: 16 }, location: { x: 400, y: 520, size: 22 }, placeholders: { x: 400, y: 460, size: 18 } }
    },
    {
      id: 24, nameKey: "corp_grid_clean", categoryKey: "corporate", colors: ["#ffffff", "#ffffff"], bgStyle: "gradient", decor: "tech-grid", layout: "asymmetric-right", defaultFont: "Outfit",
      config: { title: { x: 550, y: 150, size: 60 }, date: { x: 550, y: 250, size: 28 }, time: { x: 550, y: 300, size: 18 }, description: { x: 550, y: 380, size: 18 }, location: { x: 550, y: 540, size: 22 }, placeholders: { x: 550, y: 460, size: 20 } }
    },

    // --- VIP (Exclusive & Luxury) ---
    {
      id: 25, nameKey: "vip_noir_crest", categoryKey: "vip", colors: ["#000000", "#111111"], bgStyle: "gradient", decor: "royal-crest", layout: "centered", defaultFont: "Cinzel",
      config: { title: { x: 400, y: 260, size: 64 }, date: { x: 400, y: 380, size: 32 }, time: { x: 400, y: 420, size: 22 }, description: { x: 400, y: 140, size: 18 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 480, size: 22 } }
    },
    {
      id: 26, nameKey: "vip_golden_arch", categoryKey: "vip", colors: ["#1a1a1a", "#000000"], bgStyle: "gradient", decor: "arch", layout: "centered", defaultFont: "Pinyon Script",
      config: { title: { x: 400, y: 220, size: 84 }, date: { x: 400, y: 350, size: 32 }, time: { x: 400, y: 390, size: 22 }, description: { x: 400, y: 120, size: 18 }, location: { x: 400, y: 540, size: 24 }, placeholders: { x: 400, y: 470, size: 22 } }
    },
    {
      id: 27, nameKey: "vip_platinum_ornate", categoryKey: "vip", colors: ["#e2e8f0", "#f8fafc"], bgStyle: "gradient", decor: "ornate-border", layout: "centered", defaultFont: "Bodoni Moda",
      config: { title: { x: 400, y: 200, size: 72 }, date: { x: 400, y: 320, size: 36 }, time: { x: 400, y: 360, size: 24 }, description: { x: 400, y: 420, size: 20 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 480, size: 22 } }
    },
    {
      id: 28, nameKey: "vip_emerald_luxury", categoryKey: "vip", colors: ["#064e3b", "#065f46"], bgStyle: "gradient", decor: "border-thick", layout: "asymmetric-left", defaultFont: "Cinzel",
      config: { title: { x: 280, y: 200, size: 64 }, date: { x: 280, y: 320, size: 32 }, time: { x: 280, y: 360, size: 24 }, description: { x: 280, y: 440, size: 18 }, location: { x: 280, y: 540, size: 24 }, placeholders: { x: 600, y: 300, size: 42 } }
    },
    {
      id: 29, nameKey: "vip_script_minimal", categoryKey: "vip", colors: ["#ffffff", "#fdfcf0"], bgStyle: "gradient", decor: "arch-minimal", layout: "centered", defaultFont: "Alex Brush",
      config: { title: { x: 400, y: 180, size: 92 }, date: { x: 400, y: 300, size: 32 }, time: { x: 400, y: 340, size: 20 }, description: { x: 400, y: 420, size: 20 }, location: { x: 400, y: 540, size: 24 }, placeholders: { x: 400, y: 470, size: 22 } }
    },
    {
      id: 30, nameKey: "vip_dark_diamond", categoryKey: "vip", colors: ["#000000", "#111111"], bgStyle: "gradient", decor: "deco-lines", layout: "centered", defaultFont: "Cinzel",
      config: { title: { x: 400, y: 250, size: 72 }, date: { x: 200, y: 450, size: 32 }, time: { x: 600, y: 450, size: 32 }, description: { x: 400, y: 320, size: 24 }, location: { x: 400, y: 550, size: 28 }, placeholders: { x: 400, y: 420, size: 26 } }
    },
  ];

  const fonts = [
    "Alex Brush",
    "Great Vibes",
    "Dancing Script",
    "Playfair Display",
    "Cinzel",
    "Outfit",
    "Montserrat",
    "Lato",
    "Lora",
    "Cormorant Garamond",
    "Rochester",
    "Sacramento",
    "Pinyon Script",
    "Bodoni Moda"
  ];

  useEffect(() => {
    if (selectedTemplate && canvasRef.current) {
      renderCanvas();
    }
  }, [selectedTemplate, customizationData]);

  const renderCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // Clear everything first
    ctx.fillStyle = customizationData.bgType === 'image' ? (customizationData.primaryColor || "#ffffff") : "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Wait for fonts to be ready in the document
    await document.fonts.ready;

    const drawAll = (img = null) => {
      renderBackground(ctx, width, height, img);
      renderContent(ctx, width, height);
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

    // Base fill
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

    // Special Architectural Shapes (Arches etc)
    if (decor?.includes('arch')) {
      ctx.save();
      ctx.fillStyle = customizationData.secondaryColor || '#f9f9f9';
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(0,0,0,0.1)';

      const archW = width * 0.7;
      const archH = height * 0.8;
      const archX = (width - archW) / 2;
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

    // Default positions based on layout & background position
    let centerX = width / 2;
    let startY = 120;
    let textAlign = "center";
    let contentWidth = width * 0.8;

    if (pos === 'left') {
      centerX = width * 0.75;
      contentWidth = width * 0.4;
    } else if (pos === 'right') {
      centerX = width * 0.25;
      contentWidth = width * 0.4;
    } else if (layout === "split") {
      centerX = width * 0.7;
      contentWidth = width * 0.4;
      textAlign = "left";
    }

    // Architectural Layout Details (Boxes, lines etc)
    if (layout === "centered-box" || decor === "boxed-content") {
      ctx.save();
      ctx.fillStyle = customizationData.secondaryColor || 'rgba(255,255,255,0.8)';
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      const bw = width * 0.5;
      const bh = height * 0.7;
      ctx.fillRect((width - bw) / 2, (height - bh) / 2, bw, bh);
      ctx.strokeRect((width - bw) / 2 + 10, (height - bh) / 2 + 10, bw - 20, bh - 20);
      ctx.restore();
    }

    if (layout === "split-diag") {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(width, 0);
      ctx.strokeStyle = customizationData.secondaryColor;
      ctx.lineWidth = 100;
      ctx.globalAlpha = 0.1;
      ctx.stroke();
      ctx.restore();
    }

    // Settings helpers
    const getConf = (key, defaultX, defaultY, defaultSize) => {
      const conf = customizationData.elementsConfig[key] || {};
      return {
        x: conf.x !== null ? conf.x : defaultX,
        y: conf.y !== null ? conf.y : defaultY,
        size: conf.size !== null ? conf.size : defaultSize
      };
    };

    // Elegant Separators (Pinterest style)
    const drawSeparator = (x, y, w) => {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(x - w / 2, y);
      ctx.lineTo(x + w / 2, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Decor drawing
    ctx.save();
    ctx.strokeStyle = textColor;
    ctx.fillStyle = textColor;

    if (decor === 'floral-left') {
      ctx.globalAlpha = 0.2;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const rx = 50 + Math.random() * 100;
        const ry = Math.random() * height;
        const rs = 40 + Math.random() * 60;
        ctx.arc(rx, ry, rs, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    } else if (decor === 'floral-corners') {
      ctx.globalAlpha = 0.3;
      const s = 120;
      [[0, 0], [width, 0], [0, height], [width, height]].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.stroke();
        for (let j = 0; j < 5; j++) {
          ctx.beginPath();
          ctx.arc(x, y, s - (j * 15), 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    } else if (decor === 'border-slim' || decor === 'border-thick' || decor === 'ornate-border') {
      ctx.globalAlpha = 0.4;
      const padding = decor === 'border-slim' ? 25 : 50;
      ctx.lineWidth = decor === 'border-thick' ? 8 : 2;
      ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

      if (decor === 'ornate-border') {
        ctx.lineWidth = 1;
        ctx.strokeRect(padding + 10, padding + 10, width - (padding + 10) * 2, height - (padding + 10) * 2);
        // Corner accents
        const cs = 40;
        [[padding, padding], [width - padding, padding], [padding, height - padding], [width - padding, height - padding]].forEach(([cx, cy]) => {
          ctx.beginPath();
          ctx.arc(cx, cy, cs, 0, Math.PI * 2);
          ctx.stroke();
        });
      }
    } else if (decor === 'deco-lines') {
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const d = i * 15;
        ctx.strokeRect(d, d, width - d * 2, height - d * 2);
      }
      ctx.beginPath();
      ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2);
      ctx.stroke();
    } else if (decor === 'tech-grid') {
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < width; i += 50) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      }
      for (let i = 0; i < height; i += 50) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }
    } else if (decor === 'leaf-border') {
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        const rx = Math.random() * width;
        const ry = i % 2 === 0 ? Math.random() * 80 : height - Math.random() * 80;
        ctx.ellipse(rx, ry, 70, 25, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (decor === 'stars' || decor === 'golden-dust') {
      ctx.globalAlpha = decor === 'stars' ? 0.6 : 0.4;
      for (let i = 0; i < 150; i++) {
        const size = Math.random() * 2;
        ctx.fillRect(Math.random() * width, Math.random() * height, size, size);
      }
    } else if (decor === 'royal-crest' || decor === 'badge-style') {
      ctx.globalAlpha = 0.2;
      const cx = width / 2;
      const cy = decor === 'royal-crest' ? 80 : 300;
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.textAlign = textAlign;
    ctx.fillStyle = textColor;

    // 1. Title
    const tC = getConf('title', centerX, startY, 64);
    ctx.font = `bold ${tC.size}px "${customizationData.fontFamily}", sans-serif`;
    ctx.fillText(customizationData.title || t('template_modal.canvas_default_title'), tC.x, tC.y);

    if (decor === 'ornate-border' || layout.includes('centered')) {
      drawSeparator(tC.x, tC.y + 40, 100);
    }

    // 2. Date
    const dC = getConf('date', centerX, startY + 110, 28);
    ctx.font = `normal ${dC.size}px "${customizationData.fontFamily}", sans-serif`;
    ctx.fillText(customizationData.date || t('template_modal.canvas_default_date'), dC.x, dC.y);

    // 3. Time
    const tmC = getConf('time', centerX, startY + 150, 20);
    ctx.font = `300 ${tmC.size}px "${customizationData.fontFamily}", sans-serif`;
    ctx.fillText(customizationData.time || t('template_modal.canvas_default_time'), tmC.x, tmC.y);

    // 4. Description
    const dsC = getConf('description', centerX, startY + 180, 18);
    ctx.font = `italic ${dsC.size}px "${customizationData.fontFamily}", sans-serif`;
    ctx.globalAlpha = 0.8;
    const descText = customizationData.description || t('template_modal.canvas_default_description');
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

    // 5. Placeholders
    const pC = getConf('placeholders', centerX, currY + 60, 22);
    ctx.globalAlpha = 1.0;
    ctx.font = `bold ${pC.size}px "${customizationData.fontFamily}", sans-serif`;
    ctx.fillText(t('template_modal.canvas_guest_line'), pC.x, pC.y);
    ctx.fillText(t('template_modal.canvas_table_line'), pC.x, pC.y + pC.size + 10);

    // 6. Location
    const lC = getConf('location', centerX, height - 60, 22);
    ctx.font = `bold ${lC.size}px "${customizationData.fontFamily}", sans-serif`;
    ctx.fillText(customizationData.location || t('template_modal.canvas_default_location'), lC.x, lC.y);

    // 7. Signature
    ctx.save();
    ctx.textAlign = "right";
    ctx.globalAlpha = 0.3;
    ctx.font = "bold 13px 'Outfit', sans-serif";
    ctx.fillText(t('template_modal.canvas_signature'), width - 20, height - 20);
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

  useEffect(() => {
    const path = location.pathname.replace("/", "") || "overview";
    if (path === "dashboard") setActiveTab("overview");
    else setActiveTab(path);
  }, [location]);

  const stats = [
    {
      label: t('dashboard.stat_invitations'),
      val: userStats.invitationsGénérées,
      icon: <FileStack className="w-5 h-5" />,
      color: "bg-blue-500",
      shadow: "shadow-blue-500/20",
    },
    {
      label: t('dashboard.stat_recent'),
      val: userStats.opérationsGénérations,
      icon: <Clock className="w-5 h-5" />,
      color: "bg-orange-500",
      shadow: "shadow-orange-500/20",
    },
    {
      label: t('dashboard.stat_precision'),
      val: `${userStats.precision}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "bg-purple-500",
      shadow: "shadow-purple-500/20",
    },
  ];

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="group bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all cursor-pointer"
            onClick={() => navigate('/app')}
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-xl ${stat.shadow} group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </div>
              <Zap className="w-5 h-5 text-gray-100 group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.val}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {t('dashboard.recent_activity')}
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 font-bold">
                {t('dashboard.last_5')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/app"
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('dashboard.new')}
              </Link>
              <Link
                to="/history"
                className="bg-gray-50 dark:bg-white/5 p-2 rounded-xl group-hover:bg-primary transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </Link>
            </div>
          </div>

          {userProfile?.history?.length > 0 ? (
            <div className="space-y-4 mt-8 relative z-10">
              {userProfile.history.slice(-5).reverse().map((h, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100/50 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-gray-900 dark:text-white">{h.details}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">{new Date(h.timestamp).toLocaleDateString()} • {new Date(h.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
              <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Calendar className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-900 dark:text-white font-black text-lg">
                {t('dashboard.ready_to_start')}
              </p>
              <p className="text-gray-400 font-medium max-w-xs mx-auto mt-2">
                {t('dashboard.start_desc')}
              </p>

              <Link
                to="/app"
                className="mt-8 text-primary font-bold text-sm underline-offset-4 hover:underline"
              >
                {t('dashboard.create_now')}
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-900 p-8 rounded-[32px] border border-gray-800 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h3 className="text-2xl font-black text-white">{t('dashboard.profile_status')}</h3>
                <p className="text-sm text-gray-400 font-bold">
                  {t('dashboard.evolution')}
                </p>
              </div>
              <Star className={`w-6 h-6 ${userProfile?.isPremium ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-gray-600'}`} />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 mb-2">
                  <span>{t('dashboard.user_level')}</span>
                  <span className="text-primary">{userStats.invitationsGénérées > 500 ? t('dashboard.expert') : userStats.invitationsGénérées > 100 ? t('dashboard.advanced') : t('dashboard.beginner')}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (userStats.invitationsGénérées / 1000) * 100)}%` }}
                    className="h-full bg-linear-to-r from-primary to-accent"
                  />
                </div>
                <p className="text-[9px] text-gray-500 mt-2 font-bold uppercase tracking-wider">
                  {1000 - userStats.invitationsGénérées} {t('dashboard.next_level')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors">
                  <p className="text-[10px] font-black text-gray-500 uppercase mb-1">{t('dashboard.eco_impact')}</p>
                  <p className="text-xl font-black text-white">{Math.round(userStats.invitationsGénérées * 0.5)}g CO2</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors">
                  <p className="text-[10px] font-black text-gray-500 uppercase mb-1">{t('dashboard.productivity')}</p>
                  <p className="text-xl font-black text-white">x2.5</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <LayoutGrid className="w-6 h-6 text-primary" />
              {t('dashboard.fav_templates')}
            </h3>
            <div className="space-y-4">
              {templates.slice(0, 2).map((tpl, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-primary">
                    {tpl.icon}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{tpl.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{tpl.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTemplates = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          {/* Title removed as requested, handled by main header */}
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('dashboard.search')}
              className="pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-primary/20 outline-none text-gray-900 dark:text-white"
            />
          </div>
          <button className="p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates.map((tpl) => (
          <motion.div
            key={tpl.id}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-white/5 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden group relative"
          >
            <div
              className="aspect-[4/3] relative overflow-hidden flex items-center justify-center"
              style={{ background: tpl.bgStyle }}
            >
              <div className="text-white opacity-90 scale-150 transform">
                {tpl.icon}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

              <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => {
                    setSelectedTemplate(tpl);
                    setCustomizationData({
                      ...customizationData,
                      primaryColor: tpl.colors[0],
                      secondaryColor: tpl.colors[1],
                      fontFamily: tpl.defaultFont || "Outfit",
                      textColor: getContrastYIQ(tpl.colors[0]),
                      elementsConfig: tpl.config || {
                        title: { x: null, y: null, size: null },
                        date: { x: null, y: null, size: null },
                        time: { x: null, y: null, size: null },
                        description: { x: null, y: null, size: null },
                        location: { x: null, y: null, size: null },
                        placeholders: { x: null, y: null, size: null }
                      }
                    });
                  }}
                  className="px-6 py-3 bg-white dark:bg-primary text-gray-900 dark:text-white rounded-xl text-xs font-black shadow-lg hover:scale-105 transition-transform"
                >
                  {t('dashboard.customize')}
                </button>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                {t(tpl.nameKey)}
              </h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                {t(tpl.categoryKey)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderHistory = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden"
    >
      <div className="p-8 border-b border-gray-50 dark:border-white/10 flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          {t('dashboard.history_title')}
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/10 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400">
          <HistoryIcon className="w-4 h-4" />
          {t('dashboard.all_activity')}
        </div>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/10">
        {userProfile?.history?.length > 0 ? (
          userProfile.history.slice().reverse().map((h, i) => (
            <div
              key={i}
              className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 ${h.action === 'generation' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'} rounded-2xl flex items-center justify-center`}>
                  {h.action === 'generation' ? <FileStack className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 dark:text-white text-lg">
                    {h.details}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                    <span>{new Date(h.timestamp).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{new Date(h.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-6 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 transition-all">
                  {t('dashboard.details')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
              {t('dashboard.no_activity_title')}
            </h3>
            <p className="text-gray-400 font-medium max-w-sm mx-auto">
              {t('dashboard.no_activity_desc')}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">{t('dashboard.my_profile')}</h3>
          <p className="text-sm text-gray-400 font-medium">
            {t('dashboard.profile_desc')}
          </p>
        </div>
        <div className="md:col-span-2 bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-gray-50 dark:border-white/10">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-primary" />
              )}
            </div>
            <button className="px-4 py-2 bg-gray-900 dark:bg-primary text-white rounded-xl text-xs font-black shadow-lg">
              {t('dashboard.change_avatar')}
            </button>
            <button className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              {t('dashboard.delete')}
            </button>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                  {t('auth.firstname')}
                </label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                  {t('auth.lastname')}
                </label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                {t('dashboard.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-gray-600" />
                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  className="w-full p-4 pl-12 bg-gray-100 dark:bg-white/5 border-none rounded-2xl text-sm font-bold text-gray-400 dark:text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary py-4 px-8 rounded-xl font-bold ml-auto block">
              {t('dashboard.save')}
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-50 dark:border-white/10">
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">{t('dashboard.subscription')}</h3>
          <p className="text-sm text-gray-400 font-medium">
            {t('dashboard.subscription_desc')}
          </p>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="p-8 bg-linear-to-br from-gray-900 to-black rounded-[32px] text-white relative overflow-hidden">
            <Star className="absolute -right-4 -top-4 w-24 h-24 opacity-10 fill-white" />
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-lg uppercase tracking-tight">
                  {t('dashboard.active')}
                </span>
                <h4 className="text-2xl font-black mt-2">{t('dashboard.premium_plan_name')}</h4>
              </div>
              <CreditCard className="w-10 h-10 text-primary" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-8">
              {t('dashboard.unlimited')}
            </p>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-white dark:bg-primary text-gray-900 dark:text-white rounded-xl text-sm font-black hover:bg-gray-100 dark:hover:bg-primary/90 transition-all">
                {t('dashboard.manage_sub')}
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                {t('dashboard.next_payment')}
              </span>
            </div>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-4 text-amber-800">
            <Bell className="w-5 h-5" />
            <p className="text-xs font-bold">
              {t('dashboard.auto_renew')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen dashboard-bg flex transition-all duration-300 font-outfit">
      <SideMenu isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main
        className={`flex-1 transition-all duration-300 p-4 md:p-8 ml-0 ${isCollapsed ? "lg:ml-20" : "lg:ml-[280px]"}`}
      >
        {/* Dashboard Header - Unified without tabs */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="uppercase tracking-[0.2em] text-[10px]">
                {t('dashboard.brand_experience')}
              </span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              {activeTab === "overview"
                ? `${t('dashboard.greeting')} ${user?.firstName}`
                : activeTab === "templates"
                  ? t('dashboard.tab_templates')
                  : activeTab === "history"
                    ? t('dashboard.tab_history')
                    : t('dashboard.tab_settings')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
              {activeTab === "overview"
                ? t('dashboard.tab_desc_overview')
                : activeTab === "templates"
                  ? t('dashboard.tab_desc_templates')
                  : activeTab === "history"
                    ? t('dashboard.tab_desc_history')
                    : t('dashboard.tab_desc_settings')}
            </p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "templates" && renderTemplates()}
          {activeTab === "history" && renderHistory()}
          {activeTab === "settings" && renderSettings()}
        </AnimatePresence>
      </main>


      {/* Template Customization Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setSelectedTemplate(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col md:flex-row"
            >
              {/* Left: Inputs */}
              <div className="w-full md:w-1/3 p-8 bg-gray-50 dark:bg-white/5 border-r border-gray-100 dark:border-white/10 overflow-y-auto">
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{t('template_modal.title')}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('template_modal.subtitle')}</p>
                </div>

                <div className="space-y-6">
                  {/* Integrated Advanced Controls Helper */}
                  {(() => {
                    const renderAdvanced = (key) => {
                      if (!visibleAdvanced[key]) return null;
                      const conf = customizationData.elementsConfig[key] || { x: null, y: null, size: null };
                      const updateConf = (updates) => {
                        setCustomizationData({
                          ...customizationData,
                          elementsConfig: {
                            ...customizationData.elementsConfig,
                            [key]: { ...conf, ...updates }
                          }
                        });
                      };

                      return (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          className="mt-2 p-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 space-y-3 overflow-hidden shadow-sm"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[8px] text-gray-400 font-bold uppercase">{t('template_modal.position_x')}</label>
                              <input type="range" min="0" max="800" className="w-full h-1 bg-gray-100 dark:bg-white/10 rounded-lg appearance-none accent-primary" value={conf.x || 400} onChange={(e) => updateConf({ x: parseInt(e.target.value) })} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] text-gray-400 font-bold uppercase">{t('template_modal.position_y')}</label>
                              <input type="range" min="0" max="600" className="w-full h-1 bg-gray-100 dark:bg-white/10 rounded-lg appearance-none accent-primary" value={conf.y || 300} onChange={(e) => updateConf({ y: parseInt(e.target.value) })} />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] text-gray-400 font-bold uppercase">{t('template_modal.font_size')}: {conf.size || 'Auto'}px</label>
                            <input type="range" min="10" max="150" className="w-full h-1 bg-gray-100 dark:bg-white/10 rounded-lg appearance-none accent-primary" value={conf.size || 24} onChange={(e) => updateConf({ size: parseInt(e.target.value) })} />
                          </div>
                        </motion.div>
                      );
                    };

                    const AdvancedToggle = ({ id }) => (
                      <button
                        onClick={() => setVisibleAdvanced({ ...visibleAdvanced, [id]: !visibleAdvanced[id] })}
                        className={`p-1 rounded-md transition-colors ${visibleAdvanced[id] ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:text-gray-400 cursor-pointer'}`}
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                      </button>
                    );

                    return (
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('template_modal.event_title')}</label>
                            <AdvancedToggle id="title" />
                          </div>
                          <input type="text" className="w-full p-4 bg-white dark:bg-white/5 dark:text-white rounded-2xl border-none shadow-sm text-sm font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none" placeholder={t('template_modal.event_placeholder')} value={customizationData.title} onChange={(e) => setCustomizationData({ ...customizationData, title: e.target.value })} />
                          {renderAdvanced('title')}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center px-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('template_modal.date')}</label>
                              <AdvancedToggle id="date" />
                            </div>
                            <input type="date" className="w-full p-4 bg-white dark:bg-white/5 dark:text-white rounded-2xl border-none shadow-sm text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" value={customizationData.date} onChange={(e) => setCustomizationData({ ...customizationData, date: e.target.value })} />
                            {renderAdvanced('date')}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center px-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('template_modal.time')}</label>
                              <AdvancedToggle id="time" />
                            </div>
                            <input type="time" className="w-full p-4 bg-white dark:bg-white/5 dark:text-white rounded-2xl border-none shadow-sm text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" value={customizationData.time} onChange={(e) => setCustomizationData({ ...customizationData, time: e.target.value })} />
                            {renderAdvanced('time')}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('template_modal.location')}</label>
                            <AdvancedToggle id="location" />
                          </div>
                          <input type="text" className="w-full p-4 bg-white dark:bg-white/5 dark:text-white rounded-2xl border-none shadow-sm text-sm font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none" placeholder={t('template_modal.location_placeholder')} value={customizationData.location} onChange={(e) => setCustomizationData({ ...customizationData, location: e.target.value })} />
                          {renderAdvanced('location')}
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('template_modal.message')}</label>
                            <AdvancedToggle id="description" />
                          </div>
                          <textarea rows={3} className="w-full p-4 bg-white dark:bg-white/5 dark:text-white rounded-2xl border-none shadow-sm text-sm font-medium resize-none placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none" placeholder={t('template_modal.message_placeholder')} value={customizationData.description} onChange={(e) => setCustomizationData({ ...customizationData, description: e.target.value })} />
                          {renderAdvanced('description')}
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 shadow-sm">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('template_modal.adjust_placeholders')}</span>
                          <AdvancedToggle id="placeholders" />
                        </div>
                        {renderAdvanced('placeholders')}
                      </div>
                    );
                  })()}

                  <div className="pt-4 space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 block">{t('template_modal.bg_style')}</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCustomizationData({ ...customizationData, bgType: 'gradient' })}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all ${customizationData.bgType === 'gradient' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-white/10 text-gray-400'}`}
                        >
                          {t('template_modal.gradient')}
                        </button>
                        <button
                          onClick={() => setCustomizationData({ ...customizationData, bgType: 'image' })}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all ${customizationData.bgType === 'image' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-white/10 text-gray-400'}`}
                        >
                          {t('template_modal.image')}
                        </button>
                      </div>

                      {customizationData.bgType === 'image' || customizationData.bgType === 'gradient' ? (
                        <div className="space-y-4 p-4 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                          {customizationData.bgType === 'image' && (
                            <input
                              type="file"
                              accept="image/*"
                              className="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (re) => setCustomizationData({ ...customizationData, bgImage: re.target.result });
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          )}
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('template_modal.position_direction')}</label>
                            <div className="flex gap-1">
                              {['center', 'left', 'right'].map(pos => (
                                <button
                                  key={pos}
                                  onClick={() => setCustomizationData({ ...customizationData, bgPosition: pos })}
                                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition-all ${customizationData.bgPosition === pos ? 'bg-gray-900 dark:bg-primary text-white border-transparent' : 'bg-gray-50 dark:bg-white/5 text-gray-400 border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                                >
                                  {pos === 'center' ? t('template_modal.position_full') : pos === 'left' ? t('template_modal.position_left') : t('template_modal.position_right')}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 block">{t('template_modal.typography')}</label>
                      <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] text-gray-400 font-bold mb-1 block">{t('template_modal.font')}</label>
                            <select
                              className="w-full p-3 bg-gray-50 dark:bg-white/5 dark:text-white rounded-xl border-none text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                              value={customizationData.fontFamily}
                              onChange={(e) => setCustomizationData({ ...customizationData, fontFamily: e.target.value })}
                            >
                              {fonts.map(font => (
                                <option key={font} value={font}>{font}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-400 font-bold mb-1 block">{t('template_modal.text_color')}</label>
                            <input
                              type="color"
                              className="w-full h-10 p-1 bg-white rounded-xl shadow-sm border-none cursor-pointer"
                              value={customizationData.textColor}
                              onChange={(e) => setCustomizationData({ ...customizationData, textColor: e.target.value })}
                            />
                          </div>
                        </div>
                        {customizationData.bgType === 'gradient' && (
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50 dark:border-white/5">
                            <div>
                              <label className="text-[10px] text-gray-400 font-bold mb-1 block">{t('template_modal.color_1')}</label>
                              <input type="color" className="w-full h-10 p-1 bg-white rounded-xl shadow-sm border-none cursor-pointer" value={customizationData.primaryColor} onChange={(e) => setCustomizationData({ ...customizationData, primaryColor: e.target.value })} />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 font-bold mb-1 block">{t('template_modal.color_2')}</label>
                              <input type="color" className="w-full h-10 p-1 bg-white rounded-xl shadow-sm border-none cursor-pointer" value={customizationData.secondaryColor} onChange={(e) => setCustomizationData({ ...customizationData, secondaryColor: e.target.value })} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <button
                    onClick={handleFinalizeTemplate}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    {t('template_modal.finalize')}
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="w-full py-4 mt-3 text-gray-400 dark:text-gray-500 font-bold hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {t('template_modal.cancel')}
                  </button>
                </div>
              </div>

              {/* Right: Live Preview */}
              <div className="w-full md:w-2/3 bg-gray-200/50 p-8 flex items-center justify-center relative">
                <div className="absolute top-8 right-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 pointer-events-none">
                  {t('template_modal.preview')}
                </div>
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[80vh] shadow-2xl rounded-sm bg-white dark:ring-4 dark:ring-white/10"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
