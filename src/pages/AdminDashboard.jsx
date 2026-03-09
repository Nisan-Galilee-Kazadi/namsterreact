import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    MousePointer2,
    Download,
    MessageSquare,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    CheckCircle2,
    Activity,
    ShieldAlert,
    Database,
    Globe,
    TrendingUp,
    Clock,
    UserPlus,
    LayoutGrid,
    List,
    AlertCircle,
    Server,
    Zap,
    Reply,
    X,
    Send,
    Trash2,
    CheckCircle,
    DownloadCloud,
    Pencil,
    Save,
    Eye
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import SideMenu from '../components/SideMenu';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

// Custom SweetAlert configuration following design system
const swalConfig = {
    customClass: {
        popup: 'rounded-[32px] border border-gray-100 dark:border-white/10 shadow-2xl bg-white dark:bg-slate-900',
        title: 'text-2xl font-black text-gray-900 dark:text-white',
        htmlContainer: 'text-sm font-medium text-gray-600 dark:text-gray-400',
        confirmButton: 'px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all',
        cancelButton: 'px-8 py-4 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-2xl font-black hover:bg-gray-200 dark:hover:bg-white/10 transition-all',
        actions: 'gap-3'
    },
    buttonsStyling: false,
    showClass: {
        popup: 'animate-[scale-in_0.3s_ease-out]'
    },
    hideClass: {
        popup: 'animate-[scale-out_0.2s_ease-in]'
    }
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ users: 0, visitors: 0, totalVisits: 0, pendingFeedback: 0 });
    const [users, setUsers] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    // Edit User States
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', role: 'user' });
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

    // User Details Modal State
    const [viewingUser, setViewingUser] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const [sRes, uRes, vRes, fRes] = await Promise.all([
                axios.get(`${API_BASE}/api/admin/stats`, { headers }),
                axios.get(`${API_BASE}/api/admin/users`, { headers }),
                axios.get(`${API_BASE}/api/admin/visitors`, { headers }),
                axios.get(`${API_BASE}/api/admin/feedbacks`, { headers })
            ]);
            setStats(sRes.data);
            setUsers(uRes.data);
            setVisitors(vRes.data);
            setFeedbacks(fRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Auto-refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText || !replyingTo) return;
        setSendingReply(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE}/api/admin/feedback/${replyingTo._id}/respond`,
                { response: replyText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReplyingTo(null);
            setReplyText('');
            fetchData();
            Swal.fire({
                ...swalConfig,
                icon: 'success',
                title: 'Réponse envoyée',
                text: 'Votre réponse a été envoyée avec succès.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: 'Erreur',
                text: 'Impossible d\'envoyer la réponse.',
            });
        } finally {
            setSendingReply(false);
        }
    };

    const handleExportCSV = () => {
        if (!users.length) return;
        const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Role', 'Premium', 'Banned', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...users.map(u => [
                u._id,
                u.firstName,
                u.lastName,
                u.email,
                u.role,
                u.isPremium ? 'Yes' : 'No',
                u.isBanned ? 'Yes' : 'No',
                new Date(u.createdAt).toISOString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `namster_users_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDeleteUser = async (userId) => {
        const result = await Swal.fire({
            ...swalConfig,
            title: 'Êtes-vous sûr ?',
            text: "Cette action est irréversible !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE}/api/admin/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(users.filter(u => u._id !== userId));
                fetchData(); // Refresh stats
                Swal.fire({
                    ...swalConfig,
                    icon: 'success',
                    title: 'Supprimé !',
                    text: 'L\'utilisateur a été supprimé.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (err) {
                console.error(err);
                Swal.fire({
                    ...swalConfig,
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de la suppression.'
                });
            }
        }
    };

    const handleTogglePremium = async (targetUser) => {
        const action = targetUser.isPremium ? 'retirer' : 'ajouter';
        const result = await Swal.fire({
            ...swalConfig,
            title: `Confirmer l'action`,
            text: `Voulez-vous vraiment ${action} le statut Premium pour cet utilisateur ?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Oui, ${action} !`,
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const newStatus = !targetUser.isPremium;
                const res = await axios.patch(`${API_BASE}/api/admin/users/${targetUser._id}/status`,
                    { isPremium: newStatus },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUsers(users.map(u => u._id === targetUser._id ? res.data : u));
                Swal.fire({
                    ...swalConfig,
                    icon: 'success',
                    title: 'Succès !',
                    text: `Le statut Premium a été ${newStatus ? 'ajouté' : 'retiré'} avec succès.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (err) {
                console.error(err);
                Swal.fire({
                    ...swalConfig,
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Impossible de modifier le statut Premium.'
                });
            }
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setEditForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            role: user.role || 'user'
        });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!editingUser) return;
        setIsSubmittingEdit(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${API_BASE}/api/admin/users/${editingUser._id}`,
                editForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(users.map(u => u._id === editingUser._id ? res.data : u));
            setEditingUser(null);
            Swal.fire({
                ...swalConfig,
                icon: 'success',
                title: 'Mis à jour !',
                text: 'Les informations de l\'utilisateur ont été mises à jour.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: 'Erreur',
                text: 'Impossible de mettre à jour l\'utilisateur.'
            });
        } finally {
            setIsSubmittingEdit(false);
        }
    };



    const statCards = [
        { label: 'Utilisateurs', val: stats.users, icon: <Users className="w-5 h-5" />, trend: '+12%', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Visiteurs Uniques', val: stats.visitors, icon: <MousePointer2 className="w-5 h-5" />, trend: '+5%', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Visites Totales', val: stats.totalVisits, icon: <Activity className="w-5 h-5" />, trend: '+18%', color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Feedbacks Attente', val: stats.pendingFeedback, icon: <MessageSquare className="w-5 h-5" />, trend: '-3', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    const filteredUsers = users.filter(u =>
        u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen dashboard-bg flex transition-all duration-300">
            <SideMenu isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <main className={`flex-1 transition-all duration-300 p-6 md:p-8 ml-0 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'}`}>
                {/* Header Section */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-900 text-white rounded-full w-fit mb-3 border border-gray-900/10 shadow-lg shadow-gray-900/10">
                            <ShieldAlert className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Zone Administrateur • Live</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3 leading-tight">
                            Console de Gestion
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Gérez votre plateforme et répondez aux utilisateurs.</p>
                    </motion.div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <button onClick={handleExportCSV} className="flex-1 lg:flex-none px-6 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 shadow-sm">
                            <Download className="w-5 h-5" />
                            Export CSV
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statCards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-xs hover:shadow-xl hover:shadow-gray-200/40 dark:hover:shadow-none transition-all relative overflow-hidden group cursor-default"
                        >
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    {card.icon}
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${card.trend.startsWith('+') ? 'text-green-500 bg-green-50 dark:bg-green-500/10' : 'text-red-500 bg-red-50 dark:bg-red-500/10'}`}>
                                    {card.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {card.trend}
                                </div>
                            </div>
                            <div className="relative z-10">
                                <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{card.label}</p>
                                <p className="text-3xl font-black text-gray-900 dark:text-white">{card.val}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* User Management Section */}
                    <div className="lg:col-span-12 space-y-8">
                        <section className="bg-white dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-gray-50 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                        <Users className="w-6 h-6 text-primary" />
                                        Utilisateurs Enregistrés
                                    </h3>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Liste complète des membres de Namster</p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:flex-none">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Trouver un membre..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-sm font-medium outline-hidden focus:ring-2 focus:ring-primary/20 w-full lg:w-80 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <button className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"><Filter className="w-5 h-5" /></button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-[#FBFCFD] dark:bg-white/5 text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-gray-50 dark:border-white/10">
                                            <th className="px-8 py-5">Utilisateur</th>
                                            <th className="px-8 py-5">Status / Rôle</th>
                                            <th className="px-8 py-5">Activité</th>
                                            <th className="px-8 py-5">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-white/10">
                                        {filteredUsers.map((u, i) => (
                                            <tr key={u._id} className="hover:bg-gray-50/40 dark:hover:bg-white/5 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-sm shadow-xl shadow-gray-900/10 group-hover:scale-105 transition-transform">
                                                            {(u.firstName?.[0] || '?')}{(u.lastName?.[0] || '')}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-900 dark:text-white">{u.firstName} {u.lastName}</p>
                                                            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${u.isPremium ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}>
                                                            {u.isPremium ? 'Premium' : 'Standard'}
                                                        </span>
                                                        {u.role === 'admin' && (
                                                            <span className="text-[9px] text-primary font-bold flex items-center gap-1">
                                                                <ShieldAlert className="w-2.5 h-2.5" /> Chef de Projet
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                                                        <Clock className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                                                        {new Date(u.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setViewingUser(u)}
                                                            className="p-2.5 bg-green-50 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                                                            title="Voir détails"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => handleTogglePremium(u)}
                                                            className={`p-2.5 rounded-xl transition-all ${u.isPremium ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-gray-100 text-gray-400 hover:bg-amber-50 hover:text-amber-500'}`}
                                                            title={u.isPremium ? "Retirer Premium" : "Passer Premium"}
                                                        >
                                                            <Zap className={`w-4 h-4 ${u.isPremium ? 'fill-current' : ''}`} />
                                                        </button>

                                                        <button
                                                            onClick={() => openEditModal(u)}
                                                            className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                                                            title="Éditer l'utilisateur"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                            title="Supprimer l'utilisateur"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            {/* Feedback Management */}
                            <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[40px] border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden text-gray-900 dark:text-white">
                                <div className="p-8 border-b border-gray-50 dark:border-white/5">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                        <MessageSquare className="w-6 h-6 text-orange-500" />
                                        Feedbacks Clients
                                    </h3>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 font-medium tracking-tight">Répondez aux demandes des utilisateurs</p>
                                </div>

                                <div className="divide-y divide-gray-50 dark:divide-white/5 p-4 max-h-[600px] overflow-y-auto">
                                    {feedbacks.length > 0 ? feedbacks.map((fb) => (
                                        <div key={fb._id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-white/5 rounded-3xl transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs">
                                                        {fb.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900 dark:text-white">{fb.name}</p>
                                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">{fb.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${fb.status === 'replied' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                                                    {fb.status === 'replied' ? 'Déjà répondu' : 'Prioritaire'}
                                                </span>
                                            </div>
                                            <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-xs mb-4">
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 italic">"{fb.message}"</p>
                                            </div>

                                            {fb.status === 'replied' ? (
                                                <div className="pl-6 border-l-2 border-primary/20 space-y-2 text-gray-900 dark:text-white">
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                                        <Reply className="w-3 h-3" /> Votre réponse :
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-primary/5 dark:bg-primary/10 p-3 rounded-xl">{fb.response}</p>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setReplyingTo(fb)}
                                                    className="w-full py-3 bg-primary text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                                >
                                                    <Reply className="w-4 h-4 text-white" /> Répondre maintenant
                                                </button>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="px-8 py-20 text-center text-gray-400 dark:text-gray-500 font-bold italic">Aucun feedback disponible.</div>
                                    )}
                                </div>
                            </div>

                            {/* Server & Side Info */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-gray-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
                                    <h3 className="text-xl font-black mb-10 flex items-center gap-3">
                                        <Server className="w-6 h-6 text-primary" />
                                        Infrastructure
                                    </h3>

                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-gray-400">Database Uptime</span>
                                                <span className="text-green-400 font-black">100%</span>
                                            </div>
                                            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} className="bg-primary h-full" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white/5 rounded-2xl">
                                                <p className="text-[10px] font-black text-gray-500 uppercase mb-1">CPU</p>
                                                <p className="text-xl font-black">14%</p>
                                            </div>
                                            <div className="p-4 bg-white/5 rounded-2xl">
                                                <p className="text-[10px] font-black text-gray-500 uppercase mb-1">RAM</p>
                                                <p className="text-xl font-black">1.8GB</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                                </div>

                                <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-gray-100 dark:border-white/10 shadow-sm">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                        <Globe className="w-6 h-6 text-purple-600" />
                                        Visiteurs (Top 10)
                                    </h3>
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                        {visitors.slice(0, 10).map((v, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                                <div className="overflow-hidden">
                                                    <p className="text-xs font-black text-gray-900 dark:text-white truncate">{v.ip}</p>
                                                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter">Namster User</p>
                                                </div>
                                                <span className="text-xs font-black bg-primary text-white px-3 py-1 rounded-xl shadow-sm shadow-primary/20">{v.visitCount}v</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Reply Modal */}
                <AnimatePresence>
                    {replyingTo && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setReplyingTo(null)}
                                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[1000]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl z-[1001] p-10 border border-gray-100 dark:border-white/10"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
                                        <MessageSquare className="w-8 h-8 text-orange-500" />
                                    </div>
                                    <button onClick={() => setReplyingTo(null)} className="p-2 text-gray-300 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Répondre à {replyingTo.name}</h3>
                                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 mb-8 italic text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    "{replyingTo.message}"
                                </div>

                                <form onSubmit={handleReply} className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1 mb-2 block">Votre réponse officielle</label>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="w-full h-40 bg-gray-50 dark:bg-white/5 border-none rounded-3xl p-6 outline-hidden focus:ring-2 focus:ring-primary/20 text-sm font-bold resize-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                            placeholder="Écrivez votre message ici..."
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={sendingReply || !replyText}
                                        className="w-full py-5 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {sendingReply ? 'Envoi...' : 'Envoyer la réponse'}
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Edit User Modal */}
                <AnimatePresence>
                    {editingUser && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setEditingUser(null)}
                                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[1000]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl z-[1001] p-10 border border-gray-100 dark:border-white/10"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                        <Pencil className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <button onClick={() => setEditingUser(null)} className="p-2 text-gray-300 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Modifier l'utilisateur</h3>
                                <p className="text-gray-400 dark:text-gray-500 text-sm font-medium mb-8">Changez les informations du profil ci-dessous.</p>

                                <form onSubmit={handleUpdateUser} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1 mb-2 block">Prénom</label>
                                            <input
                                                type="text"
                                                value={editForm.firstName}
                                                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 outline-hidden focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                                placeholder="Prénom"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1 mb-2 block">Nom</label>
                                            <input
                                                type="text"
                                                value={editForm.lastName}
                                                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 outline-hidden focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                                placeholder="Nom"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1 mb-2 block">Email</label>
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 outline-hidden focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                            placeholder="exemple@email.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1 mb-2 block">Rôle</label>
                                        <select
                                            value={editForm.role}
                                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 outline-hidden focus:ring-2 focus:ring-blue-500/20 text-sm font-bold appearance-none cursor-pointer text-gray-900 dark:text-white"
                                        >
                                            <option value="user">Utilisateur Standard</option>
                                            <option value="admin">Administrateur</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmittingEdit}
                                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-6"
                                    >
                                        {isSubmittingEdit ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                        <Save className="w-5 h-5" />
                                    </button>
                                </form>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* User Details Modal */}
                <AnimatePresence>
                    {viewingUser && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setViewingUser(null)}
                                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[1000]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl z-[1001] p-10 border border-gray-100 dark:border-white/10 max-h-[90vh] overflow-y-auto"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                                        <Eye className="w-8 h-8 text-green-500" />
                                    </div>
                                    <button onClick={() => setViewingUser(null)} className="p-2 text-gray-300 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Détails de l'utilisateur</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Nom complet</label>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{viewingUser.firstName} {viewingUser.lastName}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Email</label>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{viewingUser.email}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Rôle</label>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${viewingUser.role === 'admin' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}>
                                            {viewingUser.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Statut</label>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${viewingUser.isPremium ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}>
                                            {viewingUser.isPremium ? 'Premium' : 'Standard'}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Date d'inscription</label>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(viewingUser.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Dernière activité</label>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(viewingUser.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 dark:border-white/10 pt-6">
                                    <h4 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-primary" />
                                        Statistiques d'activité
                                    </h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-center">
                                            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                                {(() => {
                                                    let totalItems = 0;
                                                    viewingUser.history?.forEach(h => {
                                                        if (h.action === "generation" || h.action === "generate") {
                                                            const match = h.details.match(/\d+/);
                                                            if (match) {
                                                                totalItems += parseInt(match[0]);
                                                            } else {
                                                                totalItems += 1;
                                                            }
                                                        }
                                                    });
                                                    return totalItems;
                                                })()}
                                            </p>
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Invitations</p>
                                        </div>
                                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl text-center">
                                            <p className="text-2xl font-black text-orange-600 dark:text-orange-400">
                                                {viewingUser.history?.filter(h => h.action === "generation" || h.action === "generate").length || 0}
                                            </p>
                                            <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-1">Opérations</p>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl text-center">
                                            <p className="text-2xl font-black text-green-600 dark:text-green-400">
                                                {(() => {
                                                    let totalItems = 0;
                                                    viewingUser.history?.forEach(h => {
                                                        if (h.action === "generation" || h.action === "generate") {
                                                            const match = h.details.match(/\d+/);
                                                            if (match) {
                                                                totalItems += parseInt(match[0]);
                                                            } else {
                                                                totalItems += 1;
                                                            }
                                                        }
                                                    });
                                                    return Math.round(totalItems * 5 / 60);
                                                })()}h
                                            </p>
                                            <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mt-1">Temps économisé</p>
                                        </div>
                                    </div>
                                </div>

                                {viewingUser.history && viewingUser.history.length > 0 && (
                                    <div className="border-t border-gray-100 dark:border-white/10 pt-6 mt-6">
                                        <h4 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-primary" />
                                            Historique récent
                                        </h4>
                                        <div className="space-y-3 max-h-60 overflow-y-auto">
                                            {viewingUser.history.slice(-5).reverse().map((h, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                                    <div className={`w-8 h-8 ${(h.action === 'generation' || h.action === 'generate') ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'} rounded-xl flex items-center justify-center`}>
                                                        {(h.action === 'generation' || h.action === 'generate') ? <Zap className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-black text-gray-900 dark:text-white">{h.details}</p>
                                                        <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase">{new Date(h.timestamp).toLocaleDateString()} • {new Date(h.timestamp).toLocaleTimeString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboard;



