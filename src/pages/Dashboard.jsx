import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../api";
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
import { templates } from "../data/templates";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState(null);
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
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", email: "" });
  const avatarInputRef = useRef(null);

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
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`${API_BASE}/api/auth/profile`, editForm, { headers });
      await fetchDashboardData();
      alert(t('dashboard.profile_updated_success'));
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(t('dashboard.profile_updated_error'));
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!user || activeTab !== 'templates') return;
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get(`${API_URL}/user/saved-templates`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setSavedTemplates(res.data || []))
      .catch(() => setSavedTemplates([]));
  }, [user, activeTab]);

  const templates = [
    // --- WEDDING (Romantic & Elegant) ---
    {
      id: 1, nameKey: "wedding_arch_minimal", categoryKey: "wedding", colors: ["#fffaf0", "#fdfcf0"], bgStyle: "gradient", decor: "arch-minimal", layout: "centered", defaultFont: "Pinyon Script",
      image: "/images/templates/wedding.png",
      config: { title: { x: 400, y: 160, size: 84 }, date: { x: 400, y: 300, size: 32 }, time: { x: 400, y: 340, size: 20 }, description: { x: 400, y: 420, size: 18 }, location: { x: 400, y: 530, size: 22 }, placeholders: { x: 400, y: 470, size: 20 } }
    },
    {
      id: 2, nameKey: "wedding_ornate_floral", categoryKey: "wedding", colors: ["#ffffff", "#f8f9fa"], bgStyle: "gradient", decor: "ornate-border", layout: "centered", defaultFont: "Great Vibes",
      image: "/images/templates/wedding.png",
      config: { title: { x: 400, y: 220, size: 72 }, date: { x: 400, y: 320, size: 28 }, time: { x: 400, y: 360, size: 18 }, description: { x: 400, y: 440, size: 16 }, location: { x: 400, y: 550, size: 20 }, placeholders: { x: 400, y: 490, size: 18 } }
    },
    {
      id: 3, nameKey: "wedding_botanical_split", categoryKey: "wedding", colors: ["#f1f8e9", "#ffffff"], bgStyle: "gradient", decor: "leaf-border", layout: "split-horizontal", defaultFont: "Bodoni Moda",
      image: "/images/templates/wedding.png",
      config: { title: { x: 400, y: 100, size: 72 }, date: { x: 220, y: 350, size: 38 }, time: { x: 220, y: 400, size: 22 }, description: { x: 580, y: 350, size: 18 }, location: { x: 400, y: 550, size: 22 }, placeholders: { x: 580, y: 450, size: 18 } }
    },
    {
      id: 4, nameKey: "wedding_boho_corners", categoryKey: "wedding", colors: ["#fff9c4", "#fffde7"], bgStyle: "gradient", decor: "floral-corners", layout: "centered-tight", defaultFont: "Sacramento",
      image: "/images/templates/wedding.png",
      config: { title: { x: 400, y: 210, size: 70 }, date: { x: 400, y: 110, size: 24 }, time: { x: 400, y: 140, size: 18 }, description: { x: 400, y: 330, size: 18 }, location: { x: 400, y: 510, size: 24 }, placeholders: { x: 400, y: 430, size: 20 } }
    },
    {
      id: 5, nameKey: "wedding_royal_gold", categoryKey: "wedding", colors: ["#ffffff", "#fffdf0"], bgStyle: "gradient", decor: "royal-crest", layout: "centered", defaultFont: "Bodoni Moda",
      image: "/images/templates/wedding.png",
      config: { title: { x: 400, y: 260, size: 56 }, date: { x: 400, y: 360, size: 28 }, time: { x: 400, y: 400, size: 18 }, description: { x: 400, y: 130, size: 22 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 470, size: 20 } }
    },
    {
      id: 6, nameKey: "wedding_vintage_script", categoryKey: "wedding", colors: ["#fff3e0", "#ffffff"], bgStyle: "gradient", decor: "border-slim", layout: "asymmetric-left", defaultFont: "Dancing Script",
      image: "/images/templates/wedding.png",
      config: { title: { x: 280, y: 160, size: 72 }, date: { x: 280, y: 260, size: 32 }, time: { x: 280, y: 310, size: 22 }, description: { x: 280, y: 390, size: 18 }, location: { x: 280, y: 530, size: 22 }, placeholders: { x: 280, y: 470, size: 20 } }
    },

    // --- GALA (Sophisticated & Bold) ---
    {
      id: 7, nameKey: "gala_midnight_gold", categoryKey: "gala", colors: ["#000000", "#1a1a1a"], bgStyle: "gradient", decor: "golden-dust", layout: "centered-wide", defaultFont: "Cinzel",
      image: "/images/templates/gala.png",
      config: { title: { x: 400, y: 200, size: 72 }, date: { x: 400, y: 340, size: 32 }, time: { x: 400, y: 380, size: 20 }, description: { x: 400, y: 440, size: 18 }, location: { x: 400, y: 120, size: 24 }, placeholders: { x: 400, y: 540, size: 22 } }
    },
    {
      id: 8, nameKey: "gala_emerald_arch", categoryKey: "gala", colors: ["#064e3b", "#065f46"], bgStyle: "gradient", decor: "arch", layout: "centered", defaultFont: "Playfair Display",
      image: "/images/templates/gala.png",
      config: { title: { x: 400, y: 220, size: 84 }, date: { x: 400, y: 350, size: 32 }, time: { x: 400, y: 390, size: 22 }, description: { x: 400, y: 120, size: 18 }, location: { x: 400, y: 540, size: 24 }, placeholders: { x: 400, y: 480, size: 20 } }
    },
    {
      id: 9, nameKey: "gala_art_deco_lines", categoryKey: "gala", colors: ["#1e293b", "#0f172a"], bgStyle: "gradient", decor: "deco-lines", layout: "centered", defaultFont: "Bodoni Moda",
      image: "/images/templates/gala.png",
      config: { title: { x: 400, y: 150, size: 64 }, date: { x: 400, y: 280, size: 24 }, time: { x: 400, y: 320, size: 18 }, description: { x: 400, y: 400, size: 16 }, location: { x: 400, y: 550, size: 22 }, placeholders: { x: 400, y: 480, size: 20 } }
    },
    {
      id: 10, nameKey: "gala_noir_badge", categoryKey: "gala", colors: ["#111111", "#000000"], bgStyle: "gradient", decor: "badge-style", layout: "centered", defaultFont: "Cinzel",
      image: "/images/templates/gala.png",
      config: { title: { x: 400, y: 310, size: 64 }, date: { x: 400, y: 180, size: 28 }, time: { x: 400, y: 220, size: 20 }, description: { x: 400, y: 400, size: 18 }, location: { x: 400, y: 530, size: 24 }, placeholders: { x: 400, y: 460, size: 20 } }
    },
    {
      id: 11, nameKey: "gala_ruby_sidebar", categoryKey: "gala", colors: ["#450a0a", "#7f1d1d"], bgStyle: "gradient", decor: "border-thick", layout: "sidebar-left", defaultFont: "Outfit",
      image: "/images/templates/gala.png",
      config: { title: { x: 220, y: 150, size: 60 }, date: { x: 220, y: 250, size: 32 }, time: { x: 220, y: 300, size: 22 }, description: { x: 220, y: 380, size: 18 }, location: { x: 220, y: 550, size: 22 }, placeholders: { x: 600, y: 300, size: 38 } }
    },
    {
      id: 12, nameKey: "gala_minimal_chic", categoryKey: "gala", colors: ["#ffffff", "#f1f5f9"], bgStyle: "gradient", decor: "border-slim", layout: "centered", defaultFont: "Cinzel",
      image: "/images/templates/gala.png",
      config: { title: { x: 400, y: 200, size: 72 }, date: { x: 400, y: 320, size: 32 }, time: { x: 400, y: 360, size: 24 }, description: { x: 400, y: 420, size: 18 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 470, size: 22 } }
    },

    // --- PARTY (Energetic & Fun) ---
    {
      id: 13, nameKey: "party_neon_night", categoryKey: "party", colors: ["#4c1d95", "#8b5cf6"], bgStyle: "gradient", decor: "tech-grid", layout: "centered-tight", defaultFont: "Outfit",
      image: "/images/templates/party.png",
      config: { title: { x: 400, y: 220, size: 84 }, date: { x: 400, y: 120, size: 28 }, time: { x: 400, y: 155, size: 18 }, description: { x: 400, y: 340, size: 18 }, location: { x: 400, y: 540, size: 24 }, placeholders: { x: 400, y: 460, size: 22 } }
    },
    {
      id: 14, nameKey: "party_starry_sky", categoryKey: "party", colors: ["#1e1b4b", "#312e81"], bgStyle: "gradient", decor: "stars", layout: "centered", defaultFont: "Sacramento",
      image: "/images/templates/party.png",
      config: { title: { x: 400, y: 250, size: 92 }, date: { x: 400, y: 120, size: 32 }, time: { x: 400, y: 160, size: 20 }, description: { x: 400, y: 380, size: 18 }, location: { x: 400, y: 530, size: 24 }, placeholders: { x: 400, y: 450, size: 22 } }
    },
    {
      id: 15, nameKey: "party_floral_pop", categoryKey: "party", colors: ["#fce7f3", "#fbcfe8"], bgStyle: "gradient", decor: "floral-left", layout: "asymmetric-right", defaultFont: "Great Vibes",
      image: "/images/templates/party.png",
      config: { title: { x: 550, y: 180, size: 72 }, date: { x: 550, y: 280, size: 32 }, time: { x: 550, y: 320, size: 22 }, description: { x: 550, y: 400, size: 18 }, location: { x: 550, y: 540, size: 24 }, placeholders: { x: 550, y: 470, size: 22 } }
    },
    {
      id: 16, nameKey: "party_tropical_vibe", categoryKey: "party", colors: ["#ecfdf5", "#d1fae5"], bgStyle: "gradient", decor: "leaf-border", layout: "centered", defaultFont: "Dancing Script",
      image: "/images/templates/party.png",
      config: { title: { x: 400, y: 200, size: 84 }, date: { x: 400, y: 100, size: 32 }, time: { x: 400, y: 140, size: 20 }, description: { x: 400, y: 320, size: 22 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 430, size: 22 } }
    },
    {
      id: 17, nameKey: "party_golden_dust", categoryKey: "party", colors: ["#111111", "#222222"], bgStyle: "gradient", decor: "golden-dust", layout: "centered", defaultFont: "Cinzel",
      image: "/images/templates/party.png",
      config: { title: { x: 400, y: 240, size: 72 }, date: { x: 400, y: 120, size: 32 }, time: { x: 400, y: 160, size: 20 }, description: { x: 400, y: 380, size: 18 }, location: { x: 400, y: 540, size: 24 }, placeholders: { x: 400, y: 460, size: 22 } }
    },
    {
      id: 18, nameKey: "party_retro_disco", categoryKey: "party", colors: ["#4c1d95", "#000000"], bgStyle: "gradient", decor: "deco-lines", layout: "centered", defaultFont: "Outfit",
      image: "/images/templates/party.png",
      config: { title: { x: 400, y: 300, size: 84 }, date: { x: 400, y: 120, size: 32 }, time: { x: 400, y: 160, size: 24 }, description: { x: 400, y: 420, size: 20 }, location: { x: 400, y: 550, size: 26 }, placeholders: { x: 400, y: 480, size: 22 } }
    },

    // --- CORPORATE (Professional & Clean) ---
    {
      id: 19, nameKey: "corp_tech_focus", categoryKey: "corporate", colors: ["#0f172a", "#334155"], bgStyle: "gradient", decor: "tech-grid", layout: "sidebar-left", defaultFont: "Outfit",
      image: "/images/templates/corporate.png",
      config: { title: { x: 600, y: 150, size: 56 }, date: { x: 600, y: 250, size: 24 }, time: { x: 600, y: 290, size: 18 }, description: { x: 600, y: 380, size: 16 }, location: { x: 600, y: 540, size: 20 }, placeholders: { x: 200, y: 300, size: 32 } }
    },
    {
      id: 20, nameKey: "corp_minimal_white", categoryKey: "corporate", colors: ["#ffffff", "#f8fafc"], bgStyle: "gradient", decor: "border-slim", layout: "centered", defaultFont: "Bodoni Moda",
      image: "/images/templates/corporate.png",
      config: { title: { x: 400, y: 180, size: 48 }, date: { x: 400, y: 280, size: 24 }, time: { x: 400, y: 320, size: 18 }, description: { x: 400, y: 400, size: 16 }, location: { x: 400, y: 530, size: 22 }, placeholders: { x: 400, y: 460, size: 20 } }
    },
    {
      id: 21, nameKey: "corp_executive_arch", categoryKey: "corporate", colors: ["#1e293b", "#334155"], bgStyle: "gradient", decor: "arch", layout: "centered", defaultFont: "Playfair Display",
      image: "/images/templates/corporate.png",
      config: { title: { x: 400, y: 220, size: 64 }, date: { x: 400, y: 350, size: 28 }, time: { x: 400, y: 390, size: 18 }, description: { x: 400, y: 120, size: 18 }, location: { x: 400, y: 540, size: 22 }, placeholders: { x: 400, y: 460, size: 20 } }
    },
    {
      id: 22, nameKey: "corp_split_design", categoryKey: "corporate", colors: ["#f8fafc", "#e2e8f0"], bgStyle: "gradient", decor: "deco-lines", layout: "split-horizontal", defaultFont: "Outfit",
      image: "/images/templates/corporate.png",
      config: { title: { x: 400, y: 100, size: 72 }, date: { x: 250, y: 350, size: 32 }, time: { x: 250, y: 400, size: 20 }, description: { x: 600, y: 350, size: 18 }, location: { x: 400, y: 550, size: 22 }, placeholders: { x: 600, y: 450, size: 20 } }
    },
    {
      id: 23, nameKey: "corp_modern_badge", categoryKey: "corporate", colors: ["#111827", "#1f2937"], bgStyle: "gradient", decor: "badge-style", layout: "centered", defaultFont: "Outfit",
      image: "/images/templates/corporate.png",
      config: { title: { x: 400, y: 310, size: 56 }, date: { x: 400, y: 180, size: 24 }, time: { x: 400, y: 220, size: 18 }, description: { x: 400, y: 400, size: 16 }, location: { x: 400, y: 520, size: 22 }, placeholders: { x: 400, y: 460, size: 18 } }
    },
    {
      id: 24, nameKey: "corp_grid_clean", categoryKey: "corporate", colors: ["#ffffff", "#ffffff"], bgStyle: "gradient", decor: "tech-grid", layout: "asymmetric-right", defaultFont: "Outfit",
      image: "/images/templates/corporate.png",
      config: { title: { x: 550, y: 150, size: 60 }, date: { x: 550, y: 250, size: 28 }, time: { x: 550, y: 300, size: 18 }, description: { x: 550, y: 380, size: 18 }, location: { x: 550, y: 540, size: 22 }, placeholders: { x: 550, y: 460, size: 20 } }
    },

    // --- VIP (Exclusive & Luxury) ---
    {
      id: 25, nameKey: "vip_noir_crest", categoryKey: "vip", colors: ["#000000", "#111111"], bgStyle: "gradient", decor: "royal-crest", layout: "centered", defaultFont: "Cinzel",
      image: "/images/templates/vip.png",
      config: { title: { x: 400, y: 260, size: 64 }, date: { x: 400, y: 380, size: 32 }, time: { x: 400, y: 420, size: 22 }, description: { x: 400, y: 140, size: 18 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 480, size: 22 } }
    },
    {
      id: 26, nameKey: "vip_golden_arch", categoryKey: "vip", colors: ["#1a1a1a", "#000000"], bgStyle: "gradient", decor: "arch", layout: "centered", defaultFont: "Pinyon Script",
      image: "/images/templates/vip.png",
      config: { title: { x: 400, y: 220, size: 84 }, date: { x: 400, y: 350, size: 32 }, time: { x: 400, y: 390, size: 22 }, description: { x: 400, y: 120, size: 18 }, location: { x: 540, y: 24, size: 22 } }
    },
    {
      id: 27, nameKey: "vip_platinum_ornate", categoryKey: "vip", colors: ["#e2e8f0", "#f8fafc"], bgStyle: "gradient", decor: "ornate-border", layout: "centered", defaultFont: "Bodoni Moda",
      image: "/images/templates/vip.png",
      config: { title: { x: 400, y: 200, size: 72 }, date: { x: 400, y: 320, size: 36 }, time: { x: 400, y: 360, size: 24 }, description: { x: 400, y: 420, size: 20 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 480, size: 22 } }
    },
    {
      id: 28, nameKey: "vip_emerald_luxury", categoryKey: "vip", colors: ["#064e3b", "#065f46"], bgStyle: "gradient", decor: "border-thick", layout: "asymmetric-left", defaultFont: "Cinzel",
      image: "/images/templates/vip.png",
      config: { title: { x: 280, y: 200, size: 64 }, date: { x: 280, y: 320, size: 32 }, time: { x: 280, y: 360, size: 24 }, description: { x: 280, y: 440, size: 18 }, location: { x: 280, y: 540, size: 24 }, placeholders: { x: 600, y: 300, size: 42 } }
    },
    {
      id: 29, nameKey: "vip_script_minimal", categoryKey: "vip", colors: ["#ffffff", "#fdfcf0"], bgStyle: "gradient", decor: "arch-minimal", layout: "centered", defaultFont: "Alex Brush",
      image: "/images/templates/vip.png",
      config: { title: { x: 400, y: 180, size: 92 }, date: { x: 400, y: 300, size: 32 }, time: { x: 400, y: 340, size: 20 }, description: { x: 400, y: 420, size: 20 }, location: { x: 400, y: 540, size: 24 }, placeholders: { x: 400, y: 470, size: 22 } }
    },
    {
      id: 30, nameKey: "vip_dark_diamond", categoryKey: "vip", colors: ["#000000", "#111111"], bgStyle: "gradient", decor: "deco-lines", layout: "centered", defaultFont: "Cinzel",
      image: "/images/templates/vip.png",
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

      // Add a subtle divider line for split modes
      if (pos === 'left' || pos === 'right') {
        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Special Architectural Shapes (Arches etc)
    if (decor?.includes('arch')) {
      ctx.save();
      ctx.fillStyle = customizationData.secondaryColor || '#f9f9f9';
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(0,0,0,0.1)';

      let archCenter = width / 2;
      let archMaxWidth = width;
      if (pos === 'left') { archCenter = width * 0.75; archMaxWidth = width * 0.5; }
      else if (pos === 'right') { archCenter = width * 0.25; archMaxWidth = width * 0.5; }

      const archW = Math.min(archMaxWidth * 0.7, 400);
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

    // Default positions based on layout & background position
    let centerX = width / 2;
    let startY = 100;
    let textAlign = "center";
    let contentWidth = width * 0.8;

    if (pos === 'left') {
      // Background Image/Gradient is on the LEFT (0-400), Text on the RIGHT (400-800)
      centerX = width * 0.75; // Center of the right half
      contentWidth = width * 0.4;
      textAlign = "center";
    } else if (pos === 'right') {
      // Background Image/Gradient is on the RIGHT (400-800), Text on the LEFT (0-400)
      centerX = width * 0.25; // Center of the left half
      contentWidth = width * 0.4;
      textAlign = "center";
    }

    // If it's a specific split layout from template but pos is center, apply defaults
    if (layout === "split" && pos === "center") {
      centerX = width * 0.7;
      contentWidth = width * 0.4;
      textAlign = "left";
    } else if (layout === "sidebar-left" && pos === "center") {
      centerX = width * 0.65;
      contentWidth = width * 0.5;
      textAlign = "left";
    }

    // Adjust startY if needed for asymmetric layouts
    if (pos !== 'center') {
      startY = 140;
    }

    // Global Alignment Setup
    ctx.textAlign = textAlign;

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
    if (location.state?.tab === "templates") setActiveTab("templates");
    else if (path === "dashboard") setActiveTab("overview");
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
              {templates.slice(0, 3).map((tpl, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/customize/${tpl.id}`)}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all cursor-pointer group/item"
                >
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-primary overflow-hidden border border-gray-100 dark:border-white/10">
                    {tpl.image ? (
                      <img src={tpl.image} alt="" className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-gray-900 dark:text-white group-hover/item:text-primary transition-colors">{t('dashboard.templates.' + tpl.nameKey)}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('dashboard.template_categories.' + tpl.categoryKey)}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
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
        <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-2">
          {["all", "wedding", "gala", "party", "corporate", "vip"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${selectedCategory === cat
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
                }`}
            >
              {cat === "all" ? t('dashboard.all_categories') || "All" : t('dashboard.template_categories.' + cat)}
            </button>
          ))}
        </div>
        <div className="flex gap-3 w-full md:w-auto ml-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('dashboard.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-primary/20 outline-none text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {user && savedTemplates.length > 0 && (
        <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
            Mes modèles sauvegardés
          </h3>
          <div className="flex flex-wrap gap-3">
            {savedTemplates.map((st) => (
              <div
                key={st.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10"
              >
                <span className="text-sm font-bold text-gray-900 dark:text-white">{st.name}</span>
                <button
                  type="button"
                  onClick={() => navigate(`/customize/${st.templateId}`, { state: { customizationData: st.customizationData } })}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90"
                >
                  Ouvrir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates
          .filter((tpl) => {
            const matchesSearch = t('dashboard.templates.' + tpl.nameKey).toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "all" || tpl.categoryKey === selectedCategory;
            return matchesSearch && matchesCategory;
          })
          .map((tpl) => {
            const isFav = user?.favoriteTemplateIds?.includes(tpl.id) ?? false;
            return (
              <motion.div
                key={tpl.id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-white/5 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden group relative"
              >
                <div
                  className="aspect-[4/3] relative overflow-hidden flex items-center justify-center p-0"
                  style={{ background: tpl.bgStyle }}
                >
                  {tpl.image ? (
                    <img
                      src={tpl.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="text-white opacity-90 scale-150 transform">
                      {tpl.icon}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  {user && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFavoriteLoadingId(tpl.id);
                        const token = localStorage.getItem('token');
                        if (isFav) {
                          axios.delete(`${API_URL}/user/favorites/${tpl.id}`, { headers: { Authorization: `Bearer ${token}` } })
                            .then(() => refreshUser())
                            .finally(() => setFavoriteLoadingId(null));
                        } else {
                          axios.post(`${API_URL}/user/favorites`, { templateId: tpl.id }, { headers: { Authorization: `Bearer ${token}` } })
                            .then(() => refreshUser())
                            .finally(() => setFavoriteLoadingId(null));
                        }
                      }}
                      disabled={favoriteLoadingId === tpl.id}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isFav ? 'bg-primary/20 text-primary' : 'bg-white/80 dark:bg-black/30 text-gray-500 hover:text-primary'}`}
                      title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  )}
                  <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => navigate(`/customize/${tpl.id}`)}
                      className="px-6 py-3 bg-white dark:bg-primary text-gray-900 dark:text-white rounded-xl text-xs font-black shadow-lg hover:scale-105 transition-transform"
                    >
                      {t('dashboard.customize')}
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                    {t('dashboard.templates.' + tpl.nameKey)}
                  </h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {t('dashboard.template_categories.' + tpl.categoryKey)}
                  </p>
                </div>
              </motion.div>
            );
          })}
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
        <div className="md:col-span-2 bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm space-y-8 relative overflow-hidden">
          {/* Subtle background element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-gray-50 dark:border-white/10 relative z-10">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl transition-transform group-hover:scale-105">
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
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full font-bold text-xs transition-opacity backdrop-blur-sm cursor-pointer"
              >
                Upload
              </button>
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => alert("Avatar upload simulation. Backend endpoint needed.")} />
            </div>

            <div className="flex-1">
              <h4 className="font-black text-gray-900 dark:text-white text-lg mb-1">{user?.firstName} {user?.lastName}</h4>
              <p className="text-sm text-gray-400 font-medium mb-4">{user?.email}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-5 py-2.5 bg-gray-900 dark:bg-primary text-white rounded-xl text-xs font-black shadow-lg hover:-translate-y-0.5 transition-transform"
                >
                  {t('dashboard.change_avatar')}
                </button>
                <button
                  type="button"
                  onClick={() => { if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) alert("Action simulée.") }}
                  className="px-5 py-2.5 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded-xl text-xs font-black hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  {t('dashboard.delete')}
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                  {t('auth.firstname')}
                </label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none text-gray-900 dark:text-white transition-all shadow-sm inset-shadow-sm"
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
                  className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none text-gray-900 dark:text-white transition-all shadow-sm inset-shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                {t('dashboard.email')} <span className="text-gray-300 ml-2 font-normal lowercase">(Non modifiable)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  className="w-full p-4 pl-12 bg-gray-100/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-400 cursor-not-allowed opacity-70"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Shield className="w-4 h-4 text-green-500/50" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary py-4 px-10 rounded-xl font-black flex items-center gap-3 disabled:opacity-70 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {t('dashboard.save')}
                  </>
                )}
              </button>
            </div>
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
      
    </div>
  );
};

export default Dashboard;
