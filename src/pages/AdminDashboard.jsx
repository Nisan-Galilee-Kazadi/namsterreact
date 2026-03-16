import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    UserPlus,
    TrendingUp,
    Shield,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    Calendar,
    ArrowRight,
    Search as SearchIcon,
    AlertCircle,
    User,
    ChevronRight,
    Clock,
    MessageSquare,
    Eye,
    EyeOff
} from 'lucide-react';
import SideMenu from '../components/SideMenu';
import TopBar from '../components/TopBar';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import AlertModal from '../components/AlertModal';

const API_BASE =
    import.meta.env.VITE_API_BASE ||
    (import.meta.env.PROD
        ? 'https://namsterbackend-3.onrender.com'
        : 'http://localhost:3001');

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ users: 0, visitors: 0, totalVisits: 0, pendingFeedback: 0 });
    const [users, setUsers] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');

    const handleToggleSidebar = (val) => {
        setIsCollapsed(val);
        localStorage.setItem('sidebarCollapsed', val);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'success' });

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
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (userId) => {
        setAlertConfig({
            isOpen: true,
            title: 'Supprimer cet utilisateur ?',
            message: "Cette action est irréversible !",
            type: 'warning',
            showCancelButton: true,
            confirmText: 'Oui, supprimer',
            cancelText: 'Annuler',
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`${API_BASE}/api/admin/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAlertConfig({
                        isOpen: true,
                        title: 'Supprimé !',
                        message: 'L\'utilisateur a été supprimé avec succès.',
                        type: 'success'
                    });
                    fetchData();
                } catch (error) {
                    setAlertConfig({
                        isOpen: true,
                        title: 'Erreur',
                        message: 'Impossible de supprimer l\'utilisateur',
                        type: 'error'
                    });
                }
            }
        });
    };

    const handleEditClick = (userToEdit) => {
        setEditingUser(userToEdit);
        setEditForm({
            firstName: userToEdit.firstName,
            lastName: userToEdit.lastName,
            email: userToEdit.email,
            role: userToEdit.role
        });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setIsSubmittingEdit(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE}/api/admin/users/${editingUser._id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlertConfig({
                isOpen: true,
                title: 'Mis à jour !',
                message: 'Le compte a été modifié avec succès.',
                type: 'success'
            });
            setEditingUser(null);
            fetchData();
        } catch (error) {
            setAlertConfig({
                isOpen: true,
                title: 'Erreur',
                message: error.response?.data?.message || 'Erreur lors de la mise à jour',
                type: 'error'
            });
        } finally {
            setIsSubmittingEdit(false);
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) return;
        setSendingReply(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE}/api/admin/feedbacks/${replyingTo._id}/reply`, { reply: replyText }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlertConfig({
                isOpen: true,
                title: 'Réponse envoyée !',
                message: 'Votre réponse a été transmise à l\'utilisateur.',
                type: 'success'
            });
            setReplyingTo(null);
            setReplyText('');
            fetchData();
        } catch (error) {
            setAlertConfig({
                isOpen: true,
                title: 'Erreur',
                message: 'Impossible d\'envoyer la réponse',
                type: 'error'
            });
        } finally {
            setSendingReply(false);
        }
    };

    const filteredUsers = users.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const { t } = useTranslation();

    if (loading) {
        return (
            <div className="min-h-screen dashboard-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold animate-pulse">Chargement de l'administration...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen dashboard-bg flex transition-all duration-300">
            <SideMenu isCollapsed={isCollapsed} setIsCollapsed={handleToggleSidebar} />

            <main className={`flex-1 flex flex-col transition-all duration-300 p-6 md:p-10 ml-0 pt-32 ${isCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'}`}>
                <TopBar isCollapsed={isCollapsed} />
                {/* Header Section */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 text-primary font-bold text-sm mb-2 opacity-80 uppercase tracking-widest">
                            <Shield className="w-4 h-4" />
                            Admin Space
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Panneau de Contrôle</h1>
                    </motion.div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Rechercher un utilisateur..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium outline-hidden shadow-sm"
                            />
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Utilisateurs', value: stats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: 'Visiteurs Unique', value: stats.visitors, icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                        { label: 'Sessions Total', value: stats.totalVisits, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
                        { label: 'Feedbacks', value: stats.pendingFeedback, icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-500/10' }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total</span>
                            </div>
                            <div className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">{stat.value}</div>
                            <div className="text-sm font-bold text-gray-500 dark:text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Users Table */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                                <h3 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-3">
                                    <User className="w-5 h-5 text-primary" />
                                    Gestion des Comptes
                                </h3>
                                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full tracking-widest uppercase">
                                    {filteredUsers.length} Inscrits
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left bg-gray-50 dark:bg-white/2">
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilisateur</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {filteredUsers.map((u) => (
                                            <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black overflow-hidden border border-primary/20">
                                                            {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : (u.firstName?.[0] || 'U')}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-gray-900 dark:text-white text-sm">
                                                                {u.firstName} {u.lastName}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter ${u.role === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                                                        }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-green-500">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                                        <span className="text-[10px] font-black uppercase">Actif</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => setViewingUser(u)}
                                                            className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl text-gray-500 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditClick(u)}
                                                            className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl text-gray-500 hover:text-blue-500 transition-all border border-transparent hover:border-blue-500/20"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl text-gray-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
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
                        </div>

                        {/* Recent Visitors */}
                        <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
                            <h3 className="font-black text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-purple-500" />
                                Trafic Récent
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {visitors.slice(0, 6).map((v, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase truncate">{v.ip}</div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{v.browser}</div>
                                            <div className="text-[10px] text-gray-500 font-medium">{new Date(v.lastVisit).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Feedbacks Column */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
                            <h3 className="font-black text-xl text-gray-900 dark:text-white mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5 text-orange-500" />
                                    Feedbacks
                                </div>
                                <span className="w-6 h-6 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center text-[10px] font-black">
                                    {feedbacks.filter(f => !f.isRead).length}
                                </span>
                            </h3>
                            <div className="space-y-4">
                                {feedbacks.length === 0 ? (
                                    <div className="text-center py-10 opacity-40">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-3" />
                                        <p className="text-sm font-bold tracking-tight">Aucun feedback</p>
                                    </div>
                                ) : feedbacks.map((f) => (
                                    <div
                                        key={f._id}
                                        className={`p-5 rounded-2xl border transition-all ${f.replied ? 'bg-gray-50/50 dark:bg-white/2 border-gray-100 dark:border-white/5 opacity-60' : 'bg-orange-50/30 dark:bg-orange-500/5 border-orange-200/50 dark:border-orange-500/20'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="font-black text-sm text-gray-900 dark:text-white">{f.name}</div>
                                            <div className="text-[10px] font-medium text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">{f.message}</p>
                                        {!f.replied && (
                                            <button
                                                onClick={() => setReplyingTo(f)}
                                                className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                            >
                                                Répondre
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        )}
                                        {f.replied && (
                                            <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase">
                                                <CheckCircle className="w-3 h-3" />
                                                Déjà traité
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* View User Modal */}
            <AnimatePresence>
                {viewingUser && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setViewingUser(null)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden relative z-101 border border-white/10 shadow-2xl"
                        >
                            <div className="h-24 bg-linear-to-r from-primary to-accent"></div>
                            <div className="px-8 pb-8">
                                <div className="relative -mt-12 mb-6">
                                    <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 p-1.5 shadow-xl">
                                        <div className="w-full h-full rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-3xl font-black overflow-hidden">
                                            {viewingUser.avatar ? <img src={viewingUser.avatar} className="w-full h-full object-cover" /> : viewingUser.firstName[0]}
                                        </div>
                                    </div>
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                                    {viewingUser.firstName} {viewingUser.lastName}
                                </h4>
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-6">{viewingUser.email}</p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                        <Shield className="w-5 h-5 text-primary" />
                                        <div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Role Système</div>
                                            <div className="font-bold text-gray-900 dark:text-white uppercase">{viewingUser.role}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                        <Calendar className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inscrit le</div>
                                            <div className="font-bold text-gray-900 dark:text-white">{new Date(viewingUser.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit User Modal */}
            <AnimatePresence>
                {editingUser && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingUser(null)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 relative z-101 border border-white/10 shadow-2xl"
                        >
                            <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Modifier le Compte</h4>
                            <form onSubmit={handleUpdateUser} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Prénom</label>
                                        <input
                                            value={editForm.firstName}
                                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-hidden font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nom</label>
                                        <input
                                            value={editForm.lastName}
                                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-hidden font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-hidden font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Role</label>
                                    <select
                                        value={editForm.role}
                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-hidden font-bold appearance-none"
                                    >
                                        <option value="user">Utilisateur Standard</option>
                                        <option value="admin">Administrateur</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="flex-1 py-4 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-2xl font-black uppercase text-xs tracking-widest border border-gray-100 dark:border-white/10"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        disabled={isSubmittingEdit}
                                        className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        {isSubmittingEdit ? 'Enregistrement...' : 'Sauvegarder'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Reply Modal */}
            <AnimatePresence>
                {replyingTo && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setReplyingTo(null)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 relative z-101 border border-white/10 shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-gray-900 dark:text-white">Réponse à {replyingTo.name}</h4>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Support Client Namster</p>
                                </div>
                            </div>

                            <div className="mb-6 p-4 bg-gray-50 dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/5 italic text-sm text-gray-500">
                                "{replyingTo.message}"
                            </div>

                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Votre message officiel de support..."
                                className="w-full h-40 p-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-hidden font-medium text-sm mb-6 resize-none"
                            />

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setReplyingTo(null)}
                                    className="flex-1 py-4 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-2xl font-black uppercase text-xs tracking-widest"
                                >
                                    Fermer
                                </button>
                                <button
                                    onClick={handleSendReply}
                                    disabled={sendingReply || !replyText.trim()}
                                    className="flex-1 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {sendingReply ? 'Envoi...' : 'Transmettre'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AlertModal
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                onConfirm={alertConfig.onConfirm}
                onCancel={alertConfig.onCancel}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                confirmText={alertConfig.confirmText}
                cancelText={alertConfig.cancelText}
                showCancelButton={alertConfig.showCancelButton}
            />
        </div>
    );
};

// Add Globe icon import
const Globe = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

export default AdminDashboard;
