import React, { useState, useMemo } from "react";
import { DollarSign, Calendar, CheckCircle, Clock, Search, TrendingUp, Info, ChevronRight, Wallet, ArrowUpRight } from "lucide-react";
import { CATALOG_DATA, EVENTS_DATA, formatCurrency, type User } from "../../features/demo/demoShared";

// Type for a collection record
interface CollectionItem {
    id: string;
    eventId: string;
    eventName: string;
    eventDate: string;
    serviceName: string;
    amount: number;
    paid: number;
    status: 'PENDING' | 'PARTIAL' | 'PAID';
    lastPaymentBy?: string;
    lastPaymentDate?: string;
}

export const GestionCobrosView = ({ user }: { user: User }) => {
    // Mock data for Guillermina's collections
    const [collections, setCollections] = useState<CollectionItem[]>([
        { id: 'c1', eventId: '1', eventName: 'Casamiento Rodríguez-Pérez', eventDate: '2026-03-01', serviceName: 'Juego de living x4', amount: 140000, paid: 0, status: 'PENDING' },
        { id: 'c2', eventId: '1', eventName: 'Casamiento Rodríguez-Pérez', eventDate: '2026-03-01', serviceName: 'Cabina fotográfica', amount: 100000, paid: 50000, status: 'PARTIAL', lastPaymentBy: 'Julia', lastPaymentDate: '2026-02-20' },
        { id: 'c3', eventId: '2', eventName: '15 de Valentina Suárez', eventDate: '2026-03-07', serviceName: 'Juego de living x2', amount: 70000, paid: 0, status: 'PENDING' },
        { id: 'c4', eventId: '3', eventName: 'Cumpleaños TechCorp', eventDate: '2026-03-08', serviceName: 'Mesas altas + banquetas x5', amount: 100000, paid: 0, status: 'PENDING' },
        { id: 'c5', eventId: '4', eventName: '15 de Isabella Torres', eventDate: '2026-03-14', serviceName: 'Juego de living x6', amount: 210000, paid: 0, status: 'PENDING' },
    ]);

    const handleCollect = (id: string) => {
        setCollections(prev => prev.map(c => {
            if (c.id === id) {
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
    };

    // Logical grouping for "Por cobrar hoy/semana"
    const currentWeekCollections = useMemo(() => {
        return collections.filter(c => c.status !== 'PAID').slice(0, 3); // Mocking current week
    }, [collections]);

    const groupedPending = useMemo(() => {
        const groups: { [key: string]: CollectionItem[] } = {};
        currentWeekCollections.forEach(c => {
            if (!groups[c.eventId]) groups[c.eventId] = [];
            groups[c.eventId].push(c);
        });
        return groups;
    }, [currentWeekCollections]);

    const totalToCollect = useMemo(() => {
        return collections.reduce((acc, c) => acc + (c.amount - c.paid), 0);
    }, [collections]);

    const summaryByItem = useMemo(() => {
        const summary: { [key: string]: number } = {};
        collections.filter(c => c.status !== 'PAID').forEach(c => {
            summary[c.serviceName] = (summary[c.serviceName] || 0) + (c.amount - c.paid);
        });
        return summary;
    }, [collections]);

    return (
        <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3] animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#C8A951]/10 rounded-xl flex items-center justify-center text-[#C8A951] border border-[#C8A951]/20">
                            <Wallet size={20} />
                        </div>
                        <h1 className="text-3xl font-display font-black text-[#E6EDF3] tracking-tighter">Gestión de Cobros</h1>
                    </div>
                    <p className="text-[#8B949E] text-xs font-bold uppercase tracking-[0.2em]">Panel Personalizado — {user.name}</p>
                </header>

                {/* Section Superior: Por cobrar hoy */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-black text-[#E6EDF3] uppercase tracking-widest flex items-center gap-2">
                            <Clock size={18} className="text-[#3FB950]" /> Por cobrar hoy / esta semana
                        </h2>
                        <span className="text-[10px] font-black bg-[#3FB950]/10 text-[#3FB950] px-3 py-1 rounded-full uppercase tracking-widest border border-[#3FB950]/20">
                            {currentWeekCollections.length} Pendientes
                        </span>
                    </div>

                    <div className="space-y-6">
                        {Object.keys(groupedPending).map(eventId => {
                            const items = groupedPending[eventId];
                            return (
                                <div key={eventId} className="bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden shadow-xl">
                                    <div className="bg-[#1C2128] px-6 py-4 border-b border-[#30363D] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={14} className="text-[#C8A951]" />
                                            <span className="text-xs font-black text-[#E6EDF3] uppercase tracking-tight">{items[0].eventName}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#8B949E] uppercase tracking-widest">{items[0].eventDate.split('-').reverse().join('/')}</span>
                                    </div>
                                    <div className="p-2">
                                        {items.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-[#0D1117]/50 rounded-2xl transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-2 h-2 rounded-full bg-[#1F6FEB]" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-[#E6EDF3] line-clamp-1">{item.serviceName}</span>
                                                        <span className="text-[10px] text-[#8B949E] font-medium">Saldo: {formatCurrency(item.amount - item.paid)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-lg font-display font-black text-[#E6EDF3]">{formatCurrency(item.amount)}</div>
                                                    <button 
                                                        onClick={() => handleCollect(item.id)}
                                                        className="h-10 px-5 bg-[#3FB950] text-[#0D1117] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#3FB950]/10"
                                                    >
                                                        Cobrar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Section Inferior: Saldo pendiente total */}
                <section>
                    <h2 className="text-sm font-black text-[#E6EDF3] uppercase tracking-widest mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-[#C8A951]" /> Saldo pendiente total
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                <DollarSign size={120} />
                             </div>
                             <div className="relative z-10">
                                <h3 className="text-[10px] font-black text-[#8B949E] uppercase tracking-[0.2em] mb-4">Total por percibir</h3>
                                <div className="text-5xl font-display font-black text-[#C8A951] tracking-tighter mb-4">
                                    {formatCurrency(totalToCollect)}
                                </div>
                                <p className="text-xs text-[#8B949E] leading-relaxed max-w-sm">
                                    Este monto representa la sumatoria de todos los servicios bajo tu autoridad pendientes de cobro final.
                                </p>
                             </div>
                        </div>

                        <div className="bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden shadow-xl">
                            <div className="p-5 border-b border-[#30363D] bg-[#1C2128]">
                                <h3 className="text-[10px] font-black text-[#E6EDF3] uppercase tracking-widest">Desglose por Ítem</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                {Object.keys(summaryByItem).map(item => (
                                    <div key={item} className="flex justify-between items-center text-xs">
                                        <span className="text-[#8B949E] font-medium truncate pr-2">{item}</span>
                                        <span className="text-[#E6EDF3] font-black">{formatCurrency(summaryByItem[item])}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Info Note */}
                <div className="mt-12 p-8 bg-[#1F6FEB]/5 border border-[#1F6FEB]/20 rounded-3xl flex items-start gap-4 shadow-inner">
                    <Info size={24} className="text-[#1F6FEB] shrink-0 mt-1" />
                    <div className="space-y-1">
                        <p className="text-xs text-[#8B949E] leading-relaxed font-medium">
                            Los servicios aquí listados están asignados a tu autoridad por la administración. Cada cobro realizado queda auditado con tu usuario y la fecha exacta del registro.
                        </p>
                        <p className="text-[10px] text-[#1F6FEB] font-black uppercase tracking-widest mt-2 border border-[#1F6FEB]/20 px-2 py-1 rounded w-fit">Acceso restringido — Auditable por Gcia</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
