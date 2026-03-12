export const fonts = [
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

export const templates = [
    // --- WEDDING (Romantic & Elegant) ---
    {
        id: 1, nameKey: "wedding_arch_minimal", categoryKey: "wedding", colors: ["#fffaf0", "#fdfcf0"], bgStyle: "gradient", decor: "arch-minimal", layout: "centered", defaultFont: "Pinyon Script", orientation: "landscape",
        image: "/images/templates/wedding.png",
        config: { title: { x: 400, y: 160, size: 84 }, date: { x: 400, y: 300, size: 32 }, time: { x: 400, y: 340, size: 20 }, description: { x: 400, y: 420, size: 18 }, location: { x: 400, y: 530, size: 22 }, placeholders: { x: 400, y: 470, size: 20 } }
    },
    {
        id: 2, nameKey: "wedding_ornate_floral", categoryKey: "wedding", colors: ["#ffffff", "#f8f9fa"], bgStyle: "gradient", decor: "ornate-border", layout: "centered", defaultFont: "Great Vibes", orientation: "landscape",
        image: "/images/templates/wedding.png",
        config: { title: { x: 400, y: 220, size: 72 }, date: { x: 400, y: 320, size: 28 }, time: { x: 400, y: 360, size: 18 }, description: { x: 400, y: 440, size: 16 }, location: { x: 400, y: 550, size: 20 }, placeholders: { x: 400, y: 490, size: 18 } }
    },
    {
        id: 3, nameKey: "wedding_botanical_split", categoryKey: "wedding", colors: ["#f1f8e9", "#ffffff"], bgStyle: "gradient", decor: "leaf-border", layout: "split-horizontal", defaultFont: "Bodoni Moda", orientation: "landscape",
        image: "/images/templates/wedding.png",
        config: { title: { x: 400, y: 100, size: 72 }, date: { x: 220, y: 350, size: 38 }, time: { x: 220, y: 400, size: 22 }, description: { x: 580, y: 350, size: 18 }, location: { x: 400, y: 550, size: 22 }, placeholders: { x: 580, y: 450, size: 18 } }
    },
    {
        id: 4, nameKey: "wedding_boho_corners", categoryKey: "wedding", colors: ["#fff9c4", "#fffde7"], bgStyle: "gradient", decor: "floral-corners", layout: "centered-tight", defaultFont: "Sacramento", orientation: "landscape",
        image: "/images/templates/wedding.png",
        config: { title: { x: 400, y: 210, size: 70 }, date: { x: 400, y: 110, size: 24 }, time: { x: 400, y: 140, size: 18 }, description: { x: 400, y: 330, size: 18 }, location: { x: 400, y: 510, size: 24 }, placeholders: { x: 400, y: 430, size: 20 } }
    },
    {
        id: 5, nameKey: "wedding_royal_gold", categoryKey: "wedding", colors: ["#ffffff", "#fffdf0"], bgStyle: "gradient", decor: "royal-crest", layout: "centered", defaultFont: "Bodoni Moda", orientation: "landscape",
        image: "/images/templates/wedding.png",
        config: { title: { x: 400, y: 260, size: 56 }, date: { x: 400, y: 360, size: 28 }, time: { x: 400, y: 400, size: 18 }, description: { x: 400, y: 130, size: 22 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 470, size: 20 } }
    },
    {
        id: 6, nameKey: "wedding_vintage_script", categoryKey: "wedding", colors: ["#fff3e0", "#ffffff"], bgStyle: "gradient", decor: "border-slim", layout: "asymmetric-left", defaultFont: "Dancing Script", orientation: "landscape",
        image: "/images/templates/wedding.png",
        config: { title: { x: 280, y: 160, size: 72 }, date: { x: 280, y: 260, size: 32 }, time: { x: 280, y: 310, size: 22 }, description: { x: 280, y: 390, size: 18 }, location: { x: 280, y: 530, size: 22 }, placeholders: { x: 280, y: 470, size: 20 } }
    },

    // --- GALA (Sophisticated & Bold) ---
    {
        id: 7, nameKey: "gala_midnight_gold", categoryKey: "gala", colors: ["#000000", "#1a1a1a"], bgStyle: "gradient", decor: "golden-dust", layout: "centered-wide", defaultFont: "Cinzel", orientation: "landscape",
        image: "/images/templates/gala.png",
        config: { title: { x: 400, y: 200, size: 72 }, date: { x: 400, y: 340, size: 32 }, time: { x: 400, y: 380, size: 20 }, description: { x: 400, y: 440, size: 18 }, location: { x: 400, y: 120, size: 24 }, placeholders: { x: 400, y: 540, size: 22 } }
    },
    {
        id: 8, nameKey: "gala_emerald_arch", categoryKey: "gala", colors: ["#064e3b", "#065f46"], bgStyle: "gradient", decor: "arch", layout: "centered", defaultFont: "Playfair Display", orientation: "landscape",
        image: "/images/templates/gala.png",
        config: { title: { x: 400, y: 220, size: 84 }, date: { x: 400, y: 350, size: 32 }, time: { x: 400, y: 390, size: 22 }, description: { x: 400, y: 120, size: 18 }, location: { x: 400, y: 540, size: 24 }, placeholders: { x: 400, y: 480, size: 20 } }
    },
    {
        id: 9, nameKey: "gala_art_deco_lines", categoryKey: "gala", colors: ["#1e293b", "#0f172a"], bgStyle: "gradient", decor: "deco-lines", layout: "centered", defaultFont: "Bodoni Moda", orientation: "landscape",
        image: "/images/templates/gala.png",
        config: { title: { x: 400, y: 150, size: 64 }, date: { x: 400, y: 280, size: 24 }, time: { x: 400, y: 320, size: 18 }, description: { x: 400, y: 400, size: 16 }, location: { x: 400, y: 550, size: 22 }, placeholders: { x: 400, y: 480, size: 20 } }
    },
    {
        id: 10, nameKey: "gala_noir_badge", categoryKey: "gala", colors: ["#111111", "#000000"], bgStyle: "gradient", decor: "badge-style", layout: "centered", defaultFont: "Cinzel", orientation: "landscape",
        image: "/images/templates/gala.png",
        config: { title: { x: 400, y: 310, size: 64 }, date: { x: 400, y: 180, size: 28 }, time: { x: 400, y: 220, size: 20 }, description: { x: 400, y: 400, size: 18 }, location: { x: 400, y: 530, size: 24 }, placeholders: { x: 400, y: 460, size: 20 } }
    },
    {
        id: 11, nameKey: "gala_ruby_sidebar", categoryKey: "gala", colors: ["#450a0a", "#7f1d1d"], bgStyle: "gradient", decor: "border-thick", layout: "sidebar-left", defaultFont: "Outfit", orientation: "landscape",
        image: "/images/templates/gala.png",
        config: { title: { x: 220, y: 150, size: 60 }, date: { x: 220, y: 250, size: 32 }, time: { x: 220, y: 300, size: 22 }, description: { x: 220, y: 380, size: 18 }, location: { x: 220, y: 550, size: 22 }, placeholders: { x: 600, y: 300, size: 38 } }
    },
    {
        id: 12, nameKey: "gala_minimal_chic", categoryKey: "gala", colors: ["#ffffff", "#f1f5f9"], bgStyle: "gradient", decor: "border-slim", layout: "centered", defaultFont: "Cinzel", orientation: "landscape",
        image: "/images/templates/gala.png",
        config: { title: { x: 400, y: 200, size: 72 }, date: { x: 400, y: 320, size: 32 }, time: { x: 400, y: 360, size: 24 }, description: { x: 400, y: 420, size: 18 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 470, size: 22 } }
    },

    // --- PARTY (Energetic & Fun) ---
    {
        id: 13, nameKey: "party_neon_night", categoryKey: "party", colors: ["#4c1d95", "#8b5cf6"], bgStyle: "gradient", decor: "tech-grid", layout: "centered-tight", defaultFont: "Outfit", orientation: "landscape",
        image: "/images/templates/party.png",
        config: { title: { x: 400, y: 220, size: 84 }, date: { x: 400, y: 120, size: 28 }, time: { x: 400, y: 155, size: 18 }, description: { x: 400, y: 340, size: 18 }, location: { x: 400, y: 540, size: 24 }, placeholders: { x: 400, y: 460, size: 22 } }
    },
    {
        id: 14, nameKey: "party_starry_sky", categoryKey: "party", colors: ["#1e1b4b", "#312e81"], bgStyle: "gradient", decor: "stars", layout: "centered", defaultFont: "Sacramento", orientation: "landscape",
        image: "/images/templates/party.png",
        config: { title: { x: 400, y: 250, size: 92 }, date: { x: 400, y: 120, size: 32 }, time: { x: 400, y: 160, size: 20 }, description: { x: 400, y: 380, size: 18 }, location: { x: 400, y: 530, size: 24 }, placeholders: { x: 400, y: 450, size: 22 } }
    },
    {
        id: 15, nameKey: "party_floral_pop", categoryKey: "party", colors: ["#fce7f3", "#fbcfe8"], bgStyle: "gradient", decor: "floral-left", layout: "asymmetric-right", defaultFont: "Great Vibes", orientation: "landscape",
        image: "/images/templates/party.png",
        config: { title: { x: 550, y: 180, size: 72 }, date: { x: 550, y: 280, size: 32 }, time: { x: 550, y: 320, size: 22 }, description: { x: 550, y: 400, size: 18 }, location: { x: 550, y: 540, size: 24 }, placeholders: { x: 550, y: 470, size: 22 } }
    },
    {
        id: 16, nameKey: "party_tropical_vibe", categoryKey: "party", colors: ["#ecfdf5", "#d1fae5"], bgStyle: "gradient", decor: "leaf-border", layout: "centered", defaultFont: "Dancing Script", orientation: "landscape",
        image: "/images/templates/party.png",
        config: { title: { x: 400, y: 200, size: 84 }, date: { x: 400, y: 100, size: 32 }, time: { x: 400, y: 140, size: 20 }, description: { x: 400, y: 320, size: 22 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 430, size: 22 } }
    },
    {
        id: 17, nameKey: "party_golden_dust", categoryKey: "party", colors: ["#111111", "#222222"], bgStyle: "gradient", decor: "golden-dust", layout: "centered", defaultFont: "Cinzel", orientation: "landscape",
        image: "/images/templates/party.png",
        config: { title: { x: 400, y: 240, size: 72 }, date: { x: 400, y: 120, size: 32 }, time: { x: 400, y: 160, size: 20 }, description: { x: 400, y: 380, size: 18 }, location: { x: 400, y: 540, size: 24 }, placeholders: { x: 400, y: 460, size: 22 } }
    },
    {
        id: 18, nameKey: "party_retro_disco", categoryKey: "party", colors: ["#4c1d95", "#000000"], bgStyle: "gradient", decor: "deco-lines", layout: "centered", defaultFont: "Outfit", orientation: "landscape",
        image: "/images/templates/party.png",
        config: { title: { x: 400, y: 300, size: 84 }, date: { x: 400, y: 120, size: 32 }, time: { x: 400, y: 160, size: 24 }, description: { x: 400, y: 420, size: 20 }, location: { x: 400, y: 550, size: 26 }, placeholders: { x: 400, y: 480, size: 22 } }
    },

    // --- CORPORATE (Professional & Clean) ---
    {
        id: 19, nameKey: "corp_tech_focus", categoryKey: "corporate", colors: ["#0f172a", "#334155"], bgStyle: "gradient", decor: "tech-grid", layout: "sidebar-left", defaultFont: "Outfit", orientation: "landscape",
        image: "/images/templates/corporate.png",
        config: { title: { x: 600, y: 150, size: 56 }, date: { x: 600, y: 250, size: 24 }, time: { x: 600, y: 290, size: 18 }, description: { x: 600, y: 380, size: 16 }, location: { x: 600, y: 540, size: 20 }, placeholders: { x: 200, y: 300, size: 32 } }
    },
    {
        id: 20, nameKey: "corp_minimal_white", categoryKey: "corporate", colors: ["#ffffff", "#f8fafc"], bgStyle: "gradient", decor: "border-slim", layout: "centered", defaultFont: "Bodoni Moda", orientation: "landscape",
        image: "/images/templates/corporate.png",
        config: { title: { x: 400, y: 180, size: 48 }, date: { x: 400, y: 280, size: 24 }, time: { x: 400, y: 320, size: 18 }, description: { x: 400, y: 400, size: 16 }, location: { x: 400, y: 530, size: 22 }, placeholders: { x: 400, y: 460, size: 20 } }
    },
    {
        id: 21, nameKey: "corp_executive_arch", categoryKey: "corporate", colors: ["#1e293b", "#334155"], bgStyle: "gradient", decor: "arch", layout: "centered", defaultFont: "Playfair Display", orientation: "landscape",
        image: "/images/templates/corporate.png",
        config: { title: { x: 400, y: 220, size: 64 }, date: { x: 400, y: 350, size: 28 }, time: { x: 400, y: 390, size: 18 }, description: { x: 400, y: 120, size: 18 }, location: { x: 400, y: 540, size: 22 }, placeholders: { x: 400, y: 460, size: 20 } }
    },
    {
        id: 22, nameKey: "corp_split_design", categoryKey: "corporate", colors: ["#f8fafc", "#e2e8f0"], bgStyle: "gradient", decor: "deco-lines", layout: "split-horizontal", defaultFont: "Outfit", orientation: "landscape",
        image: "/images/templates/corporate.png",
        config: { title: { x: 400, y: 100, size: 72 }, date: { x: 250, y: 350, size: 32 }, time: { x: 250, y: 400, size: 20 }, description: { x: 600, y: 350, size: 18 }, location: { x: 400, y: 550, size: 22 }, placeholders: { x: 600, y: 450, size: 20 } }
    },
    {
        id: 23, nameKey: "corp_modern_badge", categoryKey: "corporate", colors: ["#111827", "#1f2937"], bgStyle: "gradient", decor: "badge-style", layout: "centered", defaultFont: "Outfit", orientation: "landscape",
        image: "/images/templates/corporate.png",
        config: { title: { x: 400, y: 310, size: 56 }, date: { x: 400, y: 180, size: 24 }, time: { x: 400, y: 220, size: 18 }, description: { x: 400, y: 400, size: 16 }, location: { x: 400, y: 520, size: 22 }, placeholders: { x: 400, y: 460, size: 18 } }
    },
    {
        id: 24, nameKey: "corp_grid_clean", categoryKey: "corporate", colors: ["#ffffff", "#ffffff"], bgStyle: "gradient", decor: "tech-grid", layout: "asymmetric-right", defaultFont: "Outfit", orientation: "landscape",
        image: "/images/templates/corporate.png",
        config: { title: { x: 550, y: 150, size: 60 }, date: { x: 550, y: 250, size: 28 }, time: { x: 550, y: 300, size: 18 }, description: { x: 550, y: 380, size: 18 }, location: { x: 550, y: 540, size: 22 }, placeholders: { x: 550, y: 460, size: 20 } }
    },

    // --- VIP (Exclusive & Luxury) ---
    {
        id: 25, nameKey: "vip_noir_crest", categoryKey: "vip", colors: ["#000000", "#111111"], bgStyle: "gradient", decor: "royal-crest", layout: "centered", defaultFont: "Cinzel", orientation: "landscape",
        image: "/images/templates/vip.png",
        config: { title: { x: 400, y: 260, size: 64 }, date: { x: 400, y: 380, size: 32 }, time: { x: 400, y: 420, size: 22 }, description: { x: 400, y: 140, size: 18 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 480, size: 22 } }
    },
    {
        id: 26, nameKey: "vip_golden_arch", categoryKey: "vip", colors: ["#1a1a1a", "#000000"], bgStyle: "gradient", decor: "arch", layout: "centered", defaultFont: "Pinyon Script", orientation: "landscape",
        image: "/images/templates/vip.png",
        config: { title: { x: 400, y: 220, size: 84 }, date: { x: 400, y: 350, size: 32 }, time: { x: 400, y: 390, size: 22 }, description: { x: 400, y: 120, size: 18 }, location: { x: 540, y: 24, size: 22 } }
    },
    {
        id: 27, nameKey: "vip_platinum_ornate", categoryKey: "vip", colors: ["#e2e8f0", "#f8fafc"], bgStyle: "gradient", decor: "ornate-border", layout: "centered", defaultFont: "Bodoni Moda", orientation: "landscape",
        image: "/images/templates/vip.png",
        config: { title: { x: 400, y: 200, size: 72 }, date: { x: 400, y: 320, size: 36 }, time: { x: 400, y: 360, size: 24 }, description: { x: 400, y: 420, size: 20 }, location: { x: 400, y: 550, size: 24 }, placeholders: { x: 400, y: 480, size: 22 } }
    },
    {
        id: 28, nameKey: "vip_emerald_luxury", categoryKey: "vip", colors: ["#064e3b", "#065f46"], bgStyle: "gradient", decor: "border-thick", layout: "asymmetric-left", defaultFont: "Cinzel", orientation: "landscape",
        image: "/images/templates/vip.png",
        config: { title: { x: 280, y: 200, size: 64 }, date: { x: 280, y: 320, size: 32 }, time: { x: 280, y: 360, size: 24 }, description: { x: 280, y: 440, size: 18 }, location: { x: 280, y: 540, size: 24 }, placeholders: { x: 600, y: 300, size: 42 } }
    },
    {
        id: 29, nameKey: "vip_script_minimal", categoryKey: "vip", colors: ["#ffffff", "#fdfcf0"], bgStyle: "gradient", decor: "arch-minimal", layout: "centered", defaultFont: "Alex Brush", orientation: "landscape",
        image: "/images/templates/vip.png",
        config: { title: { x: 400, y: 180, size: 92 }, date: { x: 400, y: 300, size: 32 }, time: { x: 400, y: 340, size: 20 }, description: { x: 400, y: 420, size: 20 }, location: { x: 400, y: 540, size: 24 }, placeholders: { x: 400, y: 470, size: 22 } }
    },
    {
        id: 30, nameKey: "vip_dark_diamond", categoryKey: "vip", colors: ["#000000", "#111111"], bgStyle: "gradient", decor: "deco-lines", layout: "centered", defaultFont: "Cinzel", orientation: "landscape",
        image: "/images/templates/vip.png",
        config: { title: { x: 400, y: 250, size: 72 }, date: { x: 200, y: 450, size: 32 }, time: { x: 600, y: 450, size: 32 }, description: { x: 400, y: 320, size: 24 }, location: { x: 400, y: 550, size: 28 }, placeholders: { x: 400, y: 420, size: 26 } }
    },

    // ================= PORTRAIT TEMPLATES =================

    {
        id: 31, nameKey: "portrait_modern_minimal", categoryKey: "gala", colors: ["#ffffff", "#f0f0f0"], bgStyle: "gradient", decor: "border-slim", layout: "centered", defaultFont: "Outfit", orientation: "portrait",
        image: "/images/templates/corporate.png", // fallback placeholder imagery
        config: {
            title: { x: 400, y: 200, size: 84 },
            date: { x: 400, y: 800, size: 36 },
            time: { x: 400, y: 860, size: 24 },
            description: { x: 400, y: 400, size: 22 },
            location: { x: 400, y: 1050, size: 26 },
            placeholders: { x: 400, y: 950, size: 24 }
        }
    },
    {
        id: 32, nameKey: "portrait_wedding_floral", categoryKey: "wedding", colors: ["#fffaf0", "#ffffff"], bgStyle: "gradient", decor: "floral-corners", layout: "centered", defaultFont: "Great Vibes", orientation: "portrait",
        image: "/images/templates/wedding.png",
        config: {
            title: { x: 400, y: 300, size: 90 },
            date: { x: 400, y: 700, size: 36 },
            time: { x: 400, y: 760, size: 24 },
            description: { x: 400, y: 500, size: 20 },
            location: { x: 400, y: 950, size: 24 },
            placeholders: { x: 400, y: 850, size: 22 }
        }
    },
    {
        id: 33, nameKey: "portrait_vip_noir", categoryKey: "vip", colors: ["#000000", "#111111"], bgStyle: "gradient", decor: "deco-lines", layout: "centered", defaultFont: "Cinzel", orientation: "portrait",
        image: "/images/templates/vip.png",
        config: {
            title: { x: 400, y: 250, size: 80 },
            date: { x: 400, y: 800, size: 40 },
            time: { x: 400, y: 860, size: 26 },
            description: { x: 400, y: 450, size: 20 },
            location: { x: 400, y: 1000, size: 26 },
            placeholders: { x: 400, y: 920, size: 24 }
        }
    },
    {
        id: 34, nameKey: "portrait_party_neon", categoryKey: "party", colors: ["#312e81", "#4c1d95"], bgStyle: "gradient", decor: "tech-grid", layout: "centered", defaultFont: "Outfit", orientation: "portrait",
        image: "/images/templates/party.png",
        config: {
            title: { x: 400, y: 220, size: 100 },
            date: { x: 400, y: 750, size: 42 },
            time: { x: 400, y: 820, size: 28 },
            description: { x: 400, y: 420, size: 22 },
            location: { x: 400, y: 1020, size: 28 },
            placeholders: { x: 400, y: 920, size: 26 }
        }
    }
];
