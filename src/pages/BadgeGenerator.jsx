import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import {
    Download,
    Plus,
    Trash2,
    Printer,
    Image as ImageIcon,
    User,
    MousePointer2,
    Type,
    Briefcase,
    Sparkles,
    LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SideMenu from '../components/SideMenu';
import TopBar from '../components/TopBar';

const BadgeGenerator = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');

    const handleToggleSidebar = (val) => {
        setIsCollapsed(val);
        localStorage.setItem('sidebarCollapsed', val);
    };

    // States
    const [names, setNames] = useState(['JEAN DUPONT', 'MARIE CURIE', 'ALBERT EINSTEIN']);
    const [workstation, setWorkstation] = useState('POSTE 01'); // "Poste de Travail" instead of "Site"
    const [newName, setNewName] = useState('');
    const [badgeModel, setBadgeModel] = useState(null);
    const [selectedMode, setSelectedMode] = useState('name'); // 'name' or 'workstation'

    // Positions in percentage (0 to 100)
    const [namePos, setNamePos] = useState({ x: 50, y: 50 });
    const [workPos, setWorkPos] = useState({ x: 50, y: 65 });

    // Styling
    const [fontSize, setFontSize] = useState(24);
    const [textColor, setTextColor] = useState('#1e293b');
    const [isBold, setIsBold] = useState(true);
    const [appendWorkToName, setAppendWorkToName] = useState(false);

    const visualizerRef = useRef(null);
    const fileInputRef = useRef(null);

    const addName = () => {
        if (newName.trim()) {
            setNames([...names, newName.trim().toUpperCase()]);
            setNewName('');
        }
    };

    const removeName = (index) => {
        setNames(names.filter((_, i) => i !== index));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setBadgeModel(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleVisualizerClick = (e) => {
        if (!visualizerRef.current) return;
        const rect = visualizerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (selectedMode === 'name') {
            setNamePos({ x, y });
        } else {
            setWorkPos({ x, y });
        }
    };

    const generatePDF = async () => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;

        const badgeWidth = (pageWidth - (margin * 3)) / 2;
        const badgeHeight = (pageHeight - (margin * 6)) / 5;

        for (let i = 0; i < names.length; i++) {
            const pagePos = i % 10;
            if (i > 0 && pagePos === 0) {
                doc.addPage();
            }

            const col = pagePos % 2;
            const row = Math.floor(pagePos / 2);

            const x = margin + (col * (badgeWidth + margin));
            const y = margin + (row * (badgeHeight + margin));

            // 1. Draw Badge Background
            if (badgeModel) {
                doc.addImage(badgeModel, 'PNG', x, y, badgeWidth, badgeHeight);
            } else {
                doc.setDrawColor(220, 220, 220);
                doc.roundedRect(x, y, badgeWidth, badgeHeight, 3, 3, 'D');
            }

            // 2. Draw Text
            doc.setTextColor(textColor);
            doc.setFontSize(fontSize * 0.35); // Adjust for PDF mm vs px
            doc.setFont('helvetica', isBold ? 'bold' : 'normal');

            const nameX = x + (namePos.x * badgeWidth) / 100;
            const nameY = y + (namePos.y * badgeHeight) / 100;

            const displayText = appendWorkToName
                ? `${names[i]} - ${workstation}`
                : names[i];

            doc.text(displayText, nameX, nameY, { align: 'center' });

            if (!appendWorkToName) {
                const sx = x + (workPos.x * badgeWidth) / 100;
                const sy = y + (workPos.y * badgeHeight) / 100;
                doc.setFontSize(fontSize * 0.25);
                doc.setFont('helvetica', 'normal');
                doc.text(workstation, sx, sy, { align: 'center' });
            }
        }

        doc.save('badges-namster-pro.pdf');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex transition-colors duration-300 font-outfit">
            <SideMenu isCollapsed={isCollapsed} setIsCollapsed={handleToggleSidebar} />

            <main className={`flex-1 flex flex-col transition-all duration-300 p-4 md:p-8 ml-0 pt-32 ${isCollapsed ? "lg:ml-[80px]" : "lg:ml-[280px]"}`}>
                <TopBar isCollapsed={isCollapsed} />
                <div className="mt-8 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
                                <Sparkles className="w-4 h-4 animate-pulse" />
                                <span className="uppercase tracking-[0.2em] text-[10px]">
                                    {t('dashboard.brand_experience')}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                                Badges <span className="text-primary italic">Express</span> Pro
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
                                Créez vos badges personnalisés avec votre propre modèle et gérez les postes de travail.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* LEFT: CONTROLS */}
                        <div className="xl:col-span-4 space-y-6">
                            {/* Upload Section */}
                            <section className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm">
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-primary" />
                                    1. Modèle de Badge
                                </h3>
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    className="aspect-[1.8/1] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all overflow-hidden relative group"
                                >
                                    {badgeModel ? (
                                        <img src={badgeModel} alt="Modele" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                                <Plus className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-black text-gray-600 dark:text-gray-400 italic">Cliquer pour uploader</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                    />
                                </div>
                            </section>

                            {/* Content Section */}
                            <section className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                    2. Données
                                </h3>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Poste de Travail</label>
                                    <input
                                        type="text"
                                        value={workstation}
                                        onChange={(e) => setWorkstation(e.target.value.toUpperCase())}
                                        className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none text-gray-900 dark:text-white transition-all shadow-sm"
                                        placeholder="ex: POSTE 01"
                                    />
                                </div>

                                <label className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                                        checked={appendWorkToName}
                                        onChange={(e) => setAppendWorkToName(e.target.checked)}
                                    />
                                    <span className="text-xs font-black text-gray-700 dark:text-gray-300 leading-tight">
                                        Fusionner Poste et Nom
                                    </span>
                                </label>

                                <div className="pt-2 border-t border-gray-50 dark:border-white/5">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Ajouter Participants</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addName()}
                                            className="flex-1 p-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none text-gray-900 dark:text-white transition-all shadow-sm"
                                            placeholder="Nom Prénom"
                                        />
                                        <button onClick={addName} className="p-4 bg-primary text-white rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
                                            <Plus className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    <AnimatePresence>
                                        {names.map((name, idx) => (
                                            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300">
                                                <span>{name}</span>
                                                <button onClick={() => removeName(idx)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1 rounded-md transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </section>
                        </div>

                        {/* RIGHT: EDITOR */}
                        <div className="xl:col-span-8 flex flex-col gap-6">
                            <section className="bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden flex-1 border border-white/5">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />

                                <div className="relative z-10 flex flex-col h-full">
                                    {/* Editor Toolbar */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                        <div className="flex bg-slate-800/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
                                            <button
                                                onClick={() => setSelectedMode('name')}
                                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${selectedMode === 'name' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                            >
                                                <MousePointer2 className="w-3.5 h-3.5" />
                                                {appendWorkToName ? "POSITION BLOC" : "POSITION NOM"}
                                            </button>
                                            {!appendWorkToName && (
                                                <button
                                                    onClick={() => setSelectedMode('workstation')}
                                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${selectedMode === 'workstation' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                                >
                                                    <Briefcase className="w-3.5 h-3.5" />
                                                    POSTE DE TRAVAIL
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                            <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                                                <Type className="w-4 h-4 text-slate-400" />
                                                <input
                                                    type="number"
                                                    value={fontSize}
                                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                    className="w-10 bg-transparent text-white text-sm font-black outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                            </div>
                                            <div className="relative group">
                                                <div
                                                    className="w-6 h-6 rounded-full border border-white/20 cursor-pointer shadow-inner"
                                                    style={{ backgroundColor: textColor }}
                                                />
                                                <input
                                                    type="color"
                                                    value={textColor}
                                                    onChange={(e) => setTextColor(e.target.value)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Canvas Area */}
                                    <div className="flex-1 flex items-center justify-center">
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            ref={visualizerRef}
                                            onClick={handleVisualizerClick}
                                            className="relative bg-white shadow-2xl rounded-xl overflow-hidden cursor-crosshair group ring-1 ring-white/10"
                                            style={{ width: 'min(100%, 600px)', aspectRatio: '1.8/1' }}
                                        >
                                            {badgeModel ? (
                                                <img src={badgeModel} alt="View" className="w-full h-full object-contain pointer-events-none select-none" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                                                    <ImageIcon className="w-12 h-12 text-slate-300 mb-4" />
                                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] text-center px-8">Uploadez un modèle pour commencer</p>
                                                </div>
                                            )}

                                            {/* Labels Overlays */}
                                            <div
                                                className={`absolute pointer-events-none transition-all duration-300 whitespace-nowrap flex flex-col items-center ${selectedMode === 'name' ? 'ring-2 ring-primary ring-offset-4 ring-offset-white scale-110' : 'opacity-70'}`}
                                                style={{ left: `${namePos.x}%`, top: `${namePos.y}%`, transform: 'translate(-50%, -50%)', color: textColor, fontSize: `${fontSize}px`, fontWeight: isBold ? 'bold' : 'normal' }}
                                            >
                                                {names[0] || 'NOM PRÉNOM'} {appendWorkToName ? `- ${workstation}` : ''}
                                            </div >

                                            {!appendWorkToName && (
                                                <div
                                                    className={`absolute pointer-events-none transition-all duration-300 whitespace-nowrap ${selectedMode === 'workstation' ? 'ring-2 ring-primary ring-offset-4 ring-offset-white scale-110' : 'opacity-70'}`}
                                                    style={{ left: `${workPos.x}%`, top: `${workPos.y}%`, transform: 'translate(-50%, -50%)', color: textColor, fontSize: `${fontSize * 0.75}px`, fontWeight: 'normal' }}
                                                >
                                                    {workstation}
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="mt-10 flex justify-center">
                                        <button
                                            onClick={generatePDF}
                                            className="btn-primary py-5 px-12 rounded-[24px] font-black text-lg flex items-center gap-3 shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all text-white bg-primary"
                                        >
                                            <Download className="w-6 h-6" />
                                            Générer le PDF Final
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
            `}</style>
        </div>
    );
};

export default BadgeGenerator;
