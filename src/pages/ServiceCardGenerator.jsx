import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
    Download,
    Plus,
    Trash2,
    CreditCard,
    Image as ImageIcon,
    MousePointer2,
    Type,
    Briefcase,
    Sparkles,
    CheckCircle2,
    User,
    Camera,
    MapPin,
    Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SideMenu from '../components/SideMenu';

const ServiceCardGenerator = () => {
    const { t } = useTranslation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // States - Entries (People)
    const [entries, setEntries] = useState([
        { id: 1, personName: 'JEAN DUPONT', service: 'PLOMBERIE', photo: null, validity: 'VALIDE 24H' },
        { id: 2, personName: 'MARIE CURIE', service: 'NETTOYAGE', photo: null, validity: 'VALIDE 24H' }
    ]);
    const [newEntry, setNewEntry] = useState({ personName: '', service: '', photo: null, validity: 'VALIDE 24H' });

    // States - Background & Global
    const [cardModel, setCardModel] = useState(null);
    const [bgStyle, setBgStyle] = useState('cover'); // 'cover' or 'fade'
    const [fadeColor, setFadeColor] = useState('#ffffff');
    const [selectedMode, setSelectedMode] = useState('personName');

    // Dynamic Custom Texts (Company, Address, etc.)
    const [customTexts, setCustomTexts] = useState([
        { id: 'ct1', label: 'ENTREPRISE', value: 'NAMSTER CORP', x: 50, y: 90, color: '#1e293b', size: 14 }
    ]);
    const [newCustomLabel, setNewCustomLabel] = useState('');

    // Positions & Styling
    const [namePos, setNamePos] = useState({ x: 50, y: 35 });
    const [servicePos, setServicePos] = useState({ x: 50, y: 45 });
    const [validPos, setValidPos] = useState({ x: 50, y: 75 });
    const [photoPos, setPhotoPos] = useState({ x: 50, y: 15, size: 25 });

    const [nameColor, setNameColor] = useState('#1e293b');
    const [serviceColor, setServiceColor] = useState('#64748b');
    const [validColor, setValidColor] = useState('#3b82f6');
    const [nameFont, setNameFont] = useState('helvetica');
    const [serviceFont, setServiceFont] = useState('helvetica');
    const [validFont, setValidFont] = useState('helvetica');
    const [fontSize, setFontSize] = useState(24);
    const [isBold, setIsBold] = useState(true);

    const fonts = [
        'helvetica',
        'courier',
        'times',
        'arial',
        'verdana',
        'tahoma',
        'georgia',
        'trebuchet ms',
        'impact',
        'comic sans ms',
        'monaco',
        'copperplate'
    ];

    const visualizerRef = useRef(null);
    const fileInputRef = useRef(null);
    const personPhotoRef = useRef(null);

    const addEntry = () => {
        if (newEntry.personName.trim()) {
            setEntries([...entries, { ...newEntry, id: Date.now() }]);
            setNewEntry({ personName: '', service: '', photo: null, validity: 'VALIDE 24H' });
        }
    };

    const removeEntry = (id) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    const addCustomText = () => {
        if (newCustomLabel.trim()) {
            const id = `ct-${Date.now()}`;
            setCustomTexts([...customTexts, {
                id,
                label: newCustomLabel.toUpperCase(),
                value: 'NOUVEAU TEXTE',
                x: 50,
                y: 85,
                color: '#64748b',
                size: 14,
                font: 'helvetica'
            }]);
            setNewCustomLabel('');
            setSelectedMode(id);
        }
    };

    const removeCustomText = (id) => {
        setCustomTexts(customTexts.filter(ct => ct.id !== id));
        if (selectedMode === id) setSelectedMode('personName');
    };

    const updateCustomText = (id, field, val) => {
        setCustomTexts(customTexts.map(ct => ct.id === id ? { ...ct, [field]: val } : ct));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setCardModel(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handlePersonPhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setNewEntry({ ...newEntry, photo: event.target.result });
            reader.readAsDataURL(file);
        }
    };

    const handleVisualizerClick = (e) => {
        if (!visualizerRef.current) return;
        const rect = visualizerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (selectedMode === 'personName') setNamePos({ x, y });
        else if (selectedMode === 'service') setServicePos({ x, y });
        else if (selectedMode === 'validity') setValidPos({ x, y });
        else if (selectedMode === 'photo') setPhotoPos({ ...photoPos, x, y });
        else if (selectedMode.startsWith('ct')) {
            updateCustomText(selectedMode, 'x', x);
            updateCustomText(selectedMode, 'y', y);
        }
    };

    const getPdfFont = (webFont) => {
        const lower = webFont.toLowerCase();
        if (lower.includes('courier') || lower.includes('monaco')) return 'courier';
        if (lower.includes('times') || lower.includes('georgia') || lower.includes('serif')) return 'times';
        return 'helvetica'; // Default for arial, verdana, tahoma, etc.
    };

    const generatePDF = async () => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const cardWidth = (pageWidth - (margin * 4)) / 3;
        const cardHeight = (pageHeight - (margin * 4)) / 3;

        for (let i = 0; i < entries.length; i++) {
            const pagePos = i % 9;
            if (i > 0 && pagePos === 0) doc.addPage();

            const col = pagePos % 3;
            const row = Math.floor(pagePos / 3);
            const x = margin + (col * (cardWidth + margin));
            const y = margin + (row * (cardHeight + margin));

            // Background
            if (cardModel) {
                if (bgStyle === 'fade') {
                    // Extract RGB from hex fadeColor
                    const r = parseInt(fadeColor.slice(1, 3), 16);
                    const g = parseInt(fadeColor.slice(3, 5), 16);
                    const b = parseInt(fadeColor.slice(5, 7), 16);

                    doc.setGState(new doc.GState({ opacity: 0.6 }));
                    doc.addImage(cardModel, 'PNG', x, y, cardWidth, cardHeight);

                    // Add a simpler but effective fade overlay for PDF
                    doc.setGState(new doc.GState({ opacity: 0.5 }));
                    doc.setFillColor(r, g, b);
                    doc.rect(x, y + (cardHeight * 0.4), cardWidth, cardHeight * 0.6, 'F');
                    doc.setGState(new doc.GState({ opacity: 1 }));
                } else {
                    doc.addImage(cardModel, 'PNG', x, y, cardWidth, cardHeight);
                }
            } else {
                doc.setDrawColor(200, 200, 200);
                doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'D');
            }

            // Identity Photo 
            if (entries[i].photo) {
                const px = x + (photoPos.x * cardWidth) / 100;
                const py = y + (photoPos.y * cardHeight) / 100;
                const pSize = (photoPos.size * cardWidth) / 100;
                doc.addImage(entries[i].photo, 'JPEG', px - pSize / 2, py - pSize / 2, pSize, pSize);
            }

            // Texts
            doc.setFont('helvetica', isBold ? 'bold' : 'normal');

            // Name
            doc.setFont(getPdfFont(nameFont), isBold ? 'bold' : 'normal');
            doc.setTextColor(nameColor);
            doc.setFontSize(fontSize * 0.3);
            doc.text(entries[i].personName, x + (namePos.x * cardWidth) / 100, y + (namePos.y * cardHeight) / 100, { align: 'center', maxWidth: cardWidth - 5 });

            // Service
            doc.setFont(getPdfFont(serviceFont), 'normal');
            doc.setTextColor(serviceColor);
            doc.setFontSize(fontSize * 0.25);
            doc.text(entries[i].service, x + (servicePos.x * cardWidth) / 100, y + (servicePos.y * cardHeight) / 100, { align: 'center', maxWidth: cardWidth - 5 });

            // Validity
            doc.setFont(getPdfFont(validFont), 'normal');
            doc.setTextColor(validColor);
            doc.setFontSize(fontSize * 0.2);
            doc.text(entries[i].validity, x + (validPos.x * cardWidth) / 100, y + (validPos.y * cardHeight) / 100, { align: 'center' });

            // Custom Texts
            customTexts.forEach(ct => {
                doc.setFont(getPdfFont(ct.font || 'helvetica'), 'bold');
                doc.setTextColor(ct.color);
                doc.setFontSize(ct.size);
                doc.text(ct.value, x + (ct.x * cardWidth) / 100, y + (ct.y * cardHeight) / 100, { align: 'center', maxWidth: cardWidth - 5 });
            });
        }
        doc.save('cartes-services-identite.pdf');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex transition-colors duration-300 font-outfit">
            <SideMenu isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <main className={`flex-1 transition-all duration-300 p-4 md:p-8 ml-0 ${isCollapsed ? "lg:ml-20" : "lg:ml-[280px]"}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
                                <Sparkles className="w-4 h-4 animate-pulse" />
                                <span className="uppercase tracking-[0.2em] text-[10px]">{t('dashboard.brand_experience')}</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                                Cartes de <span className="text-primary">Services</span> & Identité
                            </h1>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* CONTROLS */}
                        <div className="xl:col-span-4 space-y-6">
                            <section className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm">
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-primary" /> 1. Modèle de Fond
                                </h3>
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    className="aspect-[0.7/1] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden relative group max-w-[150px] mx-auto"
                                >
                                    {cardModel ? (
                                        <img src={cardModel} className="w-full h-full object-cover" />
                                    ) : (
                                        <Plus className="w-6 h-6 text-gray-300" />
                                    )}
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </div>
                                <div className="mt-4 flex flex-col gap-3">
                                    <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                                        <button onClick={() => setBgStyle('cover')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${bgStyle === 'cover' ? 'bg-white dark:bg-white/10 shadow-sm text-primary' : 'text-gray-400'}`}>NORMAL</button>
                                        <button onClick={() => setBgStyle('fade')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${bgStyle === 'fade' ? 'bg-white dark:bg-white/10 shadow-sm text-primary' : 'text-gray-400'}`}>EFFET FONDU</button>
                                    </div>

                                    {bgStyle === 'fade' && (
                                        <div className="flex items-center justify-between px-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Couleur du fondu</span>
                                            <div className="relative w-6 h-6 rounded-full border border-gray-200 overflow-hidden shadow-sm" style={{ backgroundColor: fadeColor }}>
                                                <input
                                                    type="color"
                                                    value={fadeColor}
                                                    onChange={(e) => setFadeColor(e.target.value)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" /> 2. Détenteurs
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex gap-4">
                                        <div onClick={() => personPhotoRef.current.click()} className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-200 dark:border-white/10 shrink-0 overflow-hidden">
                                            {newEntry.photo ? <img src={newEntry.photo} className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-gray-300" />}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input type="text" value={newEntry.personName} onChange={(e) => setNewEntry({ ...newEntry, personName: e.target.value.toUpperCase() })} placeholder="NOM COMPLET" className="w-full p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-primary/20" />
                                            <input type="text" value={newEntry.service} onChange={(e) => setNewEntry({ ...newEntry, service: e.target.value.toUpperCase() })} placeholder="SERVICE" className="w-full p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-primary/20" />
                                            <input type="text" value={newEntry.validity} onChange={(e) => setNewEntry({ ...newEntry, validity: e.target.value.toUpperCase() })} placeholder="VALIDITÉ (ex: 24H)" className="w-full p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-primary/20" />
                                        </div>
                                    </div>
                                    <button onClick={addEntry} className="w-full py-3 bg-primary text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                                        <Plus className="w-4 h-4" /> AJOUTER AU LOT
                                    </button>
                                    <input type="file" ref={personPhotoRef} className="hidden" onChange={handlePersonPhotoUpload} accept="image/*" />
                                </div>

                                <div className="max-h-[150px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {entries.map(e => (
                                        <div key={e.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-white/5 rounded-xl text-[10px] font-bold text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden shrink-0">{e.photo && <img src={e.photo} className="w-full h-full object-cover" />}</div>
                                                <div className="flex flex-col">
                                                    <span className="truncate max-w-[120px]">{e.personName}</span>
                                                    <span className="text-[8px] text-primary/70">{e.validity}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => removeEntry(e.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Type className="w-5 h-5 text-primary" /> 3. Textes Personnalisés
                                </h3>
                                <div className="flex gap-2">
                                    <input type="text" value={newCustomLabel} onChange={(e) => setNewCustomLabel(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomText()} placeholder="Ex: ADRESSE, LOGO..." className="flex-1 p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-primary/20" />
                                    <button onClick={addCustomText} className="p-3 bg-primary/10 text-primary rounded-xl"><Plus className="w-4 h-4" /></button>
                                </div>
                                {customTexts.map(ct => (
                                    <div key={ct.id} className="p-3 bg-gray-50 dark:bg-white/10 rounded-2xl relative group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[9px] font-black text-gray-400">{ct.label}</span>
                                            <button onClick={() => removeCustomText(ct.id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                        <input type="text" value={ct.value} onChange={(e) => updateCustomText(ct.id, 'value', e.target.value.toUpperCase())} className="w-full bg-white dark:bg-slate-900 p-2 rounded-lg text-[11px] font-bold outline-none" />
                                    </div>
                                ))}
                            </section>
                        </div>

                        {/* EDITOR */}
                        <div className="xl:col-span-8 flex flex-col gap-6">
                            <section className="bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden flex-1 border border-white/5 min-h-[600px]">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                        <div className="flex flex-wrap bg-slate-800/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 gap-1">
                                            <button onClick={() => setSelectedMode('photo')} className={`px-3 py-2 rounded-xl text-[9px] font-black transition-all flex items-center gap-1.5 ${selectedMode === 'photo' ? 'bg-primary text-white' : 'text-slate-400'}`}><Camera className="w-3.5 h-3.5" /> PHOTO</button>
                                            <button onClick={() => setSelectedMode('personName')} className={`px-3 py-2 rounded-xl text-[9px] font-black transition-all flex items-center gap-1.5 ${selectedMode === 'personName' ? 'bg-primary text-white' : 'text-slate-400'}`}><User className="w-3.5 h-3.5" /> NOM</button>
                                            <button onClick={() => setSelectedMode('service')} className={`px-3 py-2 rounded-xl text-[9px] font-black transition-all flex items-center gap-1.5 ${selectedMode === 'service' ? 'bg-primary text-white' : 'text-slate-400'}`}><Briefcase className="w-3.5 h-3.5" /> SERVICE</button>
                                            <button onClick={() => setSelectedMode('validity')} className={`px-3 py-2 rounded-xl text-[9px] font-black transition-all flex items-center gap-1.5 ${selectedMode === 'validity' ? 'bg-primary text-white' : 'text-slate-400'}`}><CheckCircle2 className="w-3.5 h-3.5" /> VALIDITÉ</button>
                                            {customTexts.map(ct => (
                                                <button key={ct.id} onClick={() => setSelectedMode(ct.id)} className={`px-3 py-2 rounded-xl text-[9px] font-black transition-all flex items-center gap-1.5 ${selectedMode === ct.id ? 'bg-primary text-white' : 'text-slate-400'}`}><Type className="w-3.5 h-3.5" /> {ct.label}</button>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                            {selectedMode === 'photo' ? (
                                                <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                                                    <span className="text-[9px] text-slate-400 font-black">TAILLE</span>
                                                    <input type="range" min="10" max="60" value={photoPos.size} onChange={(e) => setPhotoPos({ ...photoPos, size: parseInt(e.target.value) })} className="w-16 accent-primary" />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                                                        <Type className="w-3.5 h-3.5 text-slate-400" />
                                                        <select
                                                            value={
                                                                selectedMode === 'personName' ? nameFont :
                                                                    selectedMode === 'service' ? serviceFont :
                                                                        selectedMode === 'validity' ? validFont :
                                                                            (customTexts.find(c => c.id === selectedMode)?.font || 'helvetica')
                                                            }
                                                            onChange={(e) => {
                                                                const f = e.target.value;
                                                                if (selectedMode === 'personName') setNameFont(f);
                                                                else if (selectedMode === 'service') setServiceFont(f);
                                                                else if (selectedMode === 'validity') setValidFont(f);
                                                                else if (selectedMode.startsWith('ct')) updateCustomText(selectedMode, 'font', f);
                                                            }}
                                                            className="bg-transparent text-white text-[10px] font-bold outline-none border-none cursor-pointer"
                                                        >
                                                            {fonts.map(f => <option key={f} value={f} className="bg-slate-900">{f.toUpperCase()}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                                                        <span className="text-slate-400 text-[10px] font-bold">SIZE</span>
                                                        <input
                                                            type="number"
                                                            value={selectedMode.startsWith('ct') ? (customTexts.find(c => c.id === selectedMode)?.size || 14) : fontSize}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value);
                                                                if (selectedMode.startsWith('ct')) updateCustomText(selectedMode, 'size', val);
                                                                else setFontSize(val);
                                                            }}
                                                            className="w-10 bg-transparent text-white text-sm font-black outline-none"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            <div className="relative">
                                                <div
                                                    className="w-6 h-6 rounded-full border border-white/20 cursor-pointer shadow-inner"
                                                    style={{ backgroundColor: selectedMode === 'personName' ? nameColor : selectedMode === 'service' ? serviceColor : selectedMode === 'validity' ? validColor : (customTexts.find(c => c.id === selectedMode)?.color || '#fff') }}
                                                />
                                                <input
                                                    type="color"
                                                    value={selectedMode === 'personName' ? nameColor : selectedMode === 'service' ? serviceColor : selectedMode === 'validity' ? validColor : (customTexts.find(c => c.id === selectedMode)?.color || '#ffffff')}
                                                    onChange={(e) => {
                                                        const c = e.target.value;
                                                        if (selectedMode === 'personName') setNameColor(c);
                                                        else if (selectedMode === 'service') setServiceColor(c);
                                                        else if (selectedMode === 'validity') setValidColor(c);
                                                        else if (selectedMode.startsWith('ct')) updateCustomText(selectedMode, 'color', c);
                                                    }}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex items-center justify-center">
                                        <div
                                            ref={visualizerRef}
                                            onClick={handleVisualizerClick}
                                            className="relative bg-white shadow-2xl rounded-2xl overflow-hidden cursor-crosshair group"
                                            style={{ height: 'min(70vh, 500px)', aspectRatio: '0.7/1' }}
                                        >
                                            {cardModel ? (
                                                <div className="w-full h-full relative">
                                                    <img src={cardModel} className={`w-full h-full object-cover select-none pointer-events-none transition-all duration-500 ${bgStyle === 'fade' ? 'opacity-40 grayscale blur-[2px]' : 'opacity-100'}`} />
                                                    {bgStyle === 'fade' && (
                                                        <div
                                                            className="absolute inset-0 transition-all duration-500"
                                                            style={{
                                                                background: `linear-gradient(to bottom, transparent, ${fadeColor})`,
                                                                opacity: 0.7
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-full h-full bg-slate-50 flex items-center justify-center border-4 border-dashed border-slate-100">
                                                    <ImageIcon className="w-12 h-12 text-slate-100" />
                                                </div>
                                            )}

                                            {/* Person Photo */}
                                            <div
                                                className={`absolute transition-all border-2 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden ${selectedMode === 'photo' ? 'border-primary ring-4 ring-primary/20 scale-105 z-20' : 'border-gray-200 opacity-80'}`}
                                                style={{ left: `${photoPos.x}%`, top: `${photoPos.y}%`, transform: 'translate(-50%, -50%)', width: `${photoPos.size}%`, aspectRatio: '1/1' }}
                                            >
                                                {entries[0]?.photo ? <img src={entries[0].photo} className="w-full h-full object-cover" /> : <User className="w-1/2 h-1/2 text-gray-200" />}
                                            </div>

                                            {/* Labels */}
                                            <div className={`absolute transition-all whitespace-nowrap p-1 rounded ${selectedMode === 'personName' ? 'bg-primary/10 ring-2 ring-primary z-20 scale-110' : 'opacity-70'}`} style={{ left: `${namePos.x}%`, top: `${namePos.y}%`, transform: 'translate(-50%, -50%)', color: nameColor, fontSize: `${fontSize}px`, fontWeight: isBold ? 'bold' : 'normal', fontFamily: nameFont }}>
                                                {entries[0]?.personName || 'NOM PERSONNE'}
                                            </div>
                                            <div className={`absolute transition-all whitespace-nowrap p-1 rounded ${selectedMode === 'service' ? 'bg-primary/10 ring-2 ring-primary z-20 scale-110' : 'opacity-70'}`} style={{ left: `${servicePos.x}%`, top: `${servicePos.y}%`, transform: 'translate(-50%, -50%)', color: serviceColor, fontSize: `${fontSize * 0.8}px`, fontFamily: serviceFont }}>
                                                {entries[0]?.service || 'SERVICE'}
                                            </div>
                                            <div className={`absolute transition-all whitespace-nowrap p-1 rounded ${selectedMode === 'validity' ? 'bg-primary/10 ring-2 ring-primary z-20 scale-110' : 'opacity-70'}`} style={{ left: `${validPos.x}%`, top: `${validPos.y}%`, transform: 'translate(-50%, -50%)', color: validColor, fontSize: `${fontSize * 0.65}px`, fontFamily: validFont }}>
                                                {entries[0]?.validity || 'VALIDE 24H'}
                                            </div>
                                            {customTexts.map(ct => (
                                                <div key={ct.id} className={`absolute transition-all whitespace-nowrap p-1 rounded ${selectedMode === ct.id ? 'bg-primary/10 ring-2 ring-primary z-20 scale-110' : 'opacity-70'}`} style={{ left: `${ct.x}%`, top: `${ct.y}%`, transform: 'translate(-50%, -50%)', color: ct.color, fontSize: `${ct.size}px`, fontWeight: 'bold', fontFamily: ct.font || 'helvetica' }}>
                                                    {ct.value}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-center">
                                        <button
                                            onClick={generatePDF}
                                            className="px-10 py-5 bg-primary text-white rounded-[24px] font-black text-lg flex items-center gap-3 shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all active:scale-95"
                                        >
                                            <Download className="w-6 h-6" /> GÉNÉRER LE PDF
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
            `}</style>
        </div>
    );
};

export default ServiceCardGenerator;
