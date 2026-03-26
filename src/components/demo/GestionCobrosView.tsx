import React, { useState, useMemo } from "react";
import { DollarSign, Calendar, CheckSquare, Square, Clock, Search, TrendingUp, Info, ChevronRight, Wallet, Receipt, Save, CheckCircle } from "lucide-react";
import { formatCurrency, type User } from "../../features/demo/demoShared";

interface CollectionItem {
    id: string;
    eventId: string;
    eventName: string;
    eventDate: string;
    serviceName: string;
    amount: number;
    paid: number;
    status: 'PENDING' | 'PARTIAL' | 'PAID';
    assignedTo: 'Guillermina' | 'Franco' | 'Valentina';
    lastPaymentBy?: string;
    lastPaymentDate?: string;
}

export const GestionCobrosView = ({ user }: { user: User }) => {
    // Mock data for Guillermina's collections
    const [collections, setCollections] = useState<CollectionItem[]>([
        { id: 'c1', eventId: '1', eventName: 'Casamiento Rodríguez-Pérez', eventDate: '2026-03-01', serviceName: 'Juego de living x4', amount: 140000, paid: 0, status: 'PENDING', assignedTo: 'Guillermina' },
        { id: 'c2', eventId: '1', eventName: 'Casamiento Rodríguez-Pérez', eventDate: '2026-03-01', serviceName: 'Cabina fotográfica', amount: 100000, paid: 50000, status: 'PARTIAL', assignedTo: 'Franco', lastPaymentBy: 'Julia', lastPaymentDate: '2026-02-20' },
        { id: 'c3', eventId: '2', eventName: '15 de Valentina Suárez', eventDate: '2026-03-07', serviceName: 'Juego de living x2', amount: 70000, paid: 0, status: 'PENDING', assignedTo: 'Guillermina' },
        { id: 'c4', eventId: '3', eventName: 'Cumpleaños TechCorp', eventDate: '2026-03-08', serviceName: 'Mesas altas + banquetas x5', amount: 100000, paid: 0, status: 'PENDING', assignedTo: 'Valentina' },
        { id: 'c5', eventId: '4', eventName: '15 de Isabella Torres', eventDate: '2026-03-14', serviceName: 'Mesa de dulces Extra', amount: 210000, paid: 0, status: 'PENDING', assignedTo: 'Franco' },
    ]);

    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
    const [notifications, setNotifications] = useState<{ person: string; total: number; eventNames: string[] }[]>([]);

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedItemIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedItemIds(newSet);
    };

    const handleCollect = () => {
        if (selectedItemIds.size === 0) return;
        const selected = collections.filter(item => selectedItemIds.has(item.id));
        const groupedNotifications = selected
            .filter(item => item.assignedTo !== 'Guillermina')
            .reduce<Record<string, { person: string; total: number; eventNames: string[] }>>((acc, item) => {
                if (!acc[item.assignedTo]) {
                    acc[item.assignedTo] = { person: item.assignedTo, total: 0, eventNames: [] };
                }
                acc[item.assignedTo].total += item.amount - item.paid;
                acc[item.assignedTo].eventNames.push(item.eventName);
                return acc;
            }, {});

        setCollections(prev => prev.map(c => {
            if (selectedItemIds.has(c.id)) {
                return { 
                    ...c, 
                    paid: c.amount, 
                    status: 'PAID', 
                    lastPaymentBy: user.name, 
                    lastPaymentDate: new Date().toISOString().split('T')[0] 
                };
            }
            return c;
        }));
        setNotifications(Object.values(groupedNotifications));
        setSelectedItemIds(newSet => { newSet.clear(); return newSet; });
    };

    // Logical grouping for events
    const pendingCollections = useMemo(() => collections.filter(c => c.status !== 'PAID'), [collections]);

    const groupedPending = useMemo(() => {
        const groups: { [key: string]: CollectionItem[] } = {};
        pendingCollections.forEach(c => {
            if (!groups[c.eventId]) groups[c.eventId] = [];
            groups[c.eventId].push(c);
        });
        return groups;
    }, [pendingCollections]);

    // Financial summaries
    const totalSelectedToCollect = useMemo(() => {
        return Array.from(selectedItemIds).reduce<number>((acc, id) => {
            const item = collections.find(c => c.id === id);
            if (item) return acc + (item.amount - item.paid);
            return acc;
        }, 0);
    }, [selectedItemIds, collections]);

    const globalPending = useMemo(() => {
        return pendingCollections.reduce((acc, c) => acc + (c.amount - c.paid), 0);
    }, [pendingCollections]);

    const selectedItemsList = useMemo(() => {
        return Array.from(selectedItemIds).map(id => collections.find(c => c.id === id)!).filter(Boolean);
    }, [selectedItemIds, collections]);

    const totalsByPerson = useMemo(() => {
        return pendingCollections.reduce<Record<string, number>>((acc, item) => {
            acc[item.assignedTo] = (acc[item.assignedTo] || 0) + (item.amount - item.paid);
            return acc;
        }, { Guillermina: 0, Franco: 0, Valentina: 0 });
    }, [pendingCollections]);

    return (
        <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3] animate-in fade-in duration-500 flex flex-col h-full">
            <div className="max-w-[1400px] mx-auto w-full h-full flex flex-col">
                <header className="mb-8 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#3FB950]/10 rounded-xl flex items-center justify-center text-[#3FB950] border border-[#3FB950]/20">
                            <Receipt size={20} />
                        </div>
                        <h1 className="text-3xl font-display font-black text-[#E6EDF3] tracking-tighter">Planilla de Cobros</h1>
                    </div>
                    <p className="text-[#8B949E] text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                       {user.role === 'GUILLERMINA' ? 'Planilla exclusiva de Guillermina' : 'Solo recibís notificaciones de cobro'}
                       <span className="text-[10px] bg-[#161B22] border border-[#30363D] px-2 py-0.5 rounded-full text-[#E6EDF3]">Usuario: {user.name}</span>
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#1F6FEB] mb-2">Franco</div>
                        <div className="text-2xl font-display font-black text-[#1F6FEB]">{formatCurrency(totalsByPerson.Franco || 0)}</div>
                    </div>
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#3FB950] mb-2">Guillermina</div>
                        <div className="text-2xl font-display font-black text-[#3FB950]">{formatCurrency(totalsByPerson.Guillermina || 0)}</div>
                    </div>
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#F778BA] mb-2">Valentina</div>
                        <div className="text-2xl font-display font-black text-[#F778BA]">{formatCurrency(totalsByPerson.Valentina || 0)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#8B949E] mb-2">Cobrado en el mes</div>
                        <div className="text-2xl font-display font-black text-[#E6EDF3]">{formatCurrency(620000)}</div>
                    </div>
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#8B949E] mb-2">Cobrado en el año</div>
                        <div className="text-2xl font-display font-black text-[#E6EDF3]">{formatCurrency(4180000)}</div>
                    </div>
                </div>

                {notifications.length > 0 && (
                    <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {notifications.map(notification => (
                            <div key={notification.person} className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
                                <div className="text-[10px] font-black uppercase tracking-widest text-[#C8A951] mb-2">Notificación enviada</div>
                                <div className="text-lg font-black text-[#E6EDF3] mb-1">{notification.person}</div>
                                <div className="text-sm text-[#8B949E] mb-3">Total a confirmar: {formatCurrency(notification.total)}</div>
                                <button className="px-4 py-2 rounded-xl bg-[#1F6FEB] text-white text-[10px] font-black uppercase tracking-widest">Confirmar recepción</button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-col xl:flex-row gap-8 flex-1 min-h-0">
                    {/* Tabla Estilo Excel (Spreadsheet) */}
                    <div className="flex-1 bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-4 bg-[#1C2128] border-b border-[#30363D] flex items-center justify-between shrink-0">
                            <h2 className="text-xs font-black uppercase tracking-widest text-[#8B949E] flex items-center gap-2">
                                <Calendar size={14} /> Próximos Eventos y Servicios Pendientes
                            </h2>
                        </div>
                        
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#1C2128] text-[10px] font-black uppercase tracking-[0.2em] text-[#8B949E] sticky top-0 z-10 shadow-sm border-b border-[#30363D]">
                                    <tr>
                                        <th className="px-6 py-4 w-32 border-r border-[#30363D]/30">Fecha</th>
                                        <th className="px-6 py-4 border-r border-[#30363D]/30 min-w-[200px]">Evento</th>
                                        <th className="px-6 py-4">Servicios Pendientes de Cobro</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#30363D]/50 text-sm">
                                    {Object.keys(groupedPending).length === 0 && (
                                        <tr><td colSpan={3} className="p-8 text-center text-[#8B949E] font-medium">No hay cobros pendientes registrados.</td></tr>
                                    )}
                                    {Object.keys(groupedPending).map((eventId, idx) => {
                                        const eventItems = groupedPending[eventId];
                                        return (
                                            <tr key={eventId} className="hover:bg-[#0D1117]/30 transition-colors">
                                                <td className="px-6 py-5 align-top border-r border-[#30363D]/10">
                                                    <span className="text-xs font-black tracking-widest text-[#8B949E] uppercase">
                                                        {eventItems[0].eventDate.split('-').reverse().join('/')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 align-top border-r border-[#30363D]/10">
                                                    <div className="font-bold text-[#E6EDF3] tracking-tight">{eventItems[0].eventName}</div>
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    <div className="flex flex-col gap-3">
                                                        {eventItems.map(item => {
                                                            const isSelected = selectedItemIds.has(item.id);
                                                            const balance = item.amount - item.paid;
                                                            return (
                                                                <button
                                                                    key={item.id}
                                                                    onClick={() => toggleSelection(item.id)}
                                                                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${isSelected ? 'bg-[#3FB950]/10 border-[#3FB950]/50 shadow-inner' : 'bg-[#0D1117] border-[#30363D] hover:border-[#8B949E]/50'}`}
                                                                >
                                                                    <div className={`mt-0.5 shrink-0 ${isSelected ? 'text-[#3FB950]' : 'text-[#8B949E]'}`}>
                                                                        {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className={`font-bold text-sm tracking-tight ${isSelected ? 'text-[#E6EDF3]' : 'text-[#8B949E]'}`}>
                                                                           {item.serviceName}
                                                                        </div>
                                                                        {item.paid > 0 && <div className="text-[10px] text-[#C8A951] font-bold uppercase mt-1">Acumulado a cuenta: {formatCurrency(item.paid)}</div>}
                                                                    </div>
                                                                    <div className={`font-black font-display text-base shrink-0 ${isSelected ? 'text-[#3FB950]' : 'text-[#E6EDF3]'}`}>
                                                                        {formatCurrency(balance)}
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Panel Lateral de Cobro */}
                    <div className="xl:w-[380px] shrink-0 space-y-6 flex flex-col">
                        <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-6 shadow-2xl relative overflow-hidden flex-1 flex flex-col">
                            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                                <DollarSign size={100} />
                            </div>
                            
                            <h2 className="text-xs font-black text-[#8B949E] uppercase tracking-widest mb-6 border-b border-[#30363D] pb-4">
                                Panel de Cobro
                            </h2>
                            
                            <div className="space-y-6 flex-1 flex flex-col">
                                <div className="bg-[#0D1117] border border-[#30363D] rounded-2xl p-4 flex-1 overflow-auto custom-scrollbar">
                                    <h3 className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest mb-3">Servicios Seleccionados ({selectedItemIds.size})</h3>
                                    {selectedItemsList.length === 0 ? (
                                        <p className="text-xs text-[#8B949E] italic text-center py-6">Selecciona ítems del listado para armar el cobro.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {selectedItemsList.map(item => (
                                                <div key={item.id} className="flex items-center justify-between gap-2 text-xs">
                                                    <span className="text-[#E6EDF3] font-medium truncate shrink">{item.serviceName}</span>
                                                    <span className="text-[#3FB950] font-bold shrink-0">{formatCurrency(item.amount - item.paid)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-[#3FB950]/5 border border-[#3FB950]/20 rounded-2xl p-5 shadow-inner">
                                    <h3 className="text-[10px] font-black text-[#3FB950] uppercase tracking-[0.2em] mb-1">Total a Registrar</h3>
                                    <div className="text-4xl font-display font-black text-[#E6EDF3] tracking-tighter">
                                        {formatCurrency(totalSelectedToCollect)}
                                    </div>
                                </div>

                                <button 
                                    onClick={handleCollect}
                                    disabled={selectedItemIds.size === 0}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#3FB950] text-[#0D1117] rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#3FB950]/10"
                                >
                                    <Save size={18} /> Procesar Cobro
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#1C2128] border border-[#30363D] rounded-3xl p-6 shadow-xl flex items-center justify-between shrink-0">
                            <div>
                                <h3 className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest mb-1">Pendiente General</h3>
                                <div className="text-2xl font-display font-black text-[#C8A951] tracking-tighter">
                                    {formatCurrency(globalPending)}
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-[#C8A951]/10 rounded-full flex items-center justify-center text-[#C8A951]">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
