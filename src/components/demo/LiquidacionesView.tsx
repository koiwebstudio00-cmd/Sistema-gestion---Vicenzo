import React, { useState } from "react";
import { Plus, Calculator, CreditCard, ChevronRight, TrendingUp, Info, CheckCircle, AlertCircle, History, Search, X, DollarSign } from "lucide-react";
import { TarjetaChuchiView } from "./TarjetaChuchiView";
import { LiquidacionEventoView } from "./LiquidacionEventoView";
import { EVENTS_DATA, type User, CATERING_PAYMENTS_MOCK, formatCurrency } from "../../features/demo/demoShared";

export const LiquidacionesView = ({ user }: { user: User }) => {
  const [activeView, setActiveView] = useState<'MENU' | 'CHUCHI' | 'EVENTO'>('MENU');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock liquidation data (in a real app this comes from DB)
  const liquidatedIds = ['1', '5']; // Events already liquidated
  const today = new Date('2026-03-23');

  const getEventStatusStyle = (ev: any) => {
    const isLiquidated = liquidatedIds.includes(ev.id);
    const eventDate = new Date(ev.date);
    
    if (isLiquidated) return 'bg-[#0D1117] border-[#30363D] text-[#8B949E] opacity-60';
    if (eventDate < today) return 'bg-[#F85149]/5 border-[#F85149]/40 text-[#F85149] shadow-inner font-bold border-l-4';
    return 'bg-[#0D1117] border-[#30363D] text-[#E6EDF3] hover:border-[#C8A951]';
  };

  const filteredEvents = showHistory 
    ? EVENTS_DATA.filter(ev => liquidatedIds.includes(ev.id))
    : EVENTS_DATA;

  const sortedEvents = [...filteredEvents].sort((a, b) => a.date.localeCompare(b.date));

  if (activeView === 'CHUCHI') return <TarjetaChuchiView user={user} onBack={() => setActiveView('MENU')} />;
  if (activeView === 'EVENTO' && selectedEvent) return <LiquidacionEventoView event={selectedEvent} user={user} onBack={() => setActiveView('MENU')} />;

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3] animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-display font-black text-[#E6EDF3] tracking-tighter mb-2">Módulo de Liquidaciones</h1>
          <p className="text-[#8B949E] text-sm font-medium uppercase tracking-[0.2em]">Gestión de costos y pagos al proveedor de catering</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Tarjeta Chuchi Card */}
          {user.role !== 'CATERING' && (
            <button 
              onClick={() => setActiveView('CHUCHI')}
              className="group relative bg-[#161B22] border border-[#30363D] hover:border-[#C8A951] rounded-3xl p-8 text-left transition-all hover:scale-[1.02] shadow-xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A951]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#C8A951]/10 transition-colors" />
              <div className="w-14 h-14 bg-[#C8A951]/10 text-[#C8A951] rounded-2xl flex items-center justify-center mb-6 border border-[#C8A951]/20">
                <TrendingUp size={28} />
              </div>
              <h2 className="text-2xl font-black mb-2 flex items-center gap-2 tracking-tighter">
                Tarjeta Chuchi 
                <ChevronRight size={20} className="text-[#C8A951] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </h2>
              <p className="text-[#8B949E] text-sm leading-relaxed mb-6 font-medium">Gestiona la tabla de precios mensual proyectada con el ajuste automático.</p>
              <span className="text-[10px] font-black tracking-widest uppercase py-2 px-4 bg-[#1C2128] border border-[#30363D] rounded-xl group-hover:border-[#C8A951]/30 transition-colors">Configurar costos</span>
            </button>
          )}

          {/* Liquidación por Evento Card */}
          <div className={`bg-[#161B22] border border-[#30363D] rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col h-[500px] ${user.role === 'CATERING' ? 'lg:col-span-2' : ''}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-[#3FB950]/10 text-[#3FB950] rounded-2xl flex items-center justify-center border border-[#3FB950]/20">
                <Calculator size={28} />
              </div>
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showHistory ? 'bg-[#3FB950] text-[#0D1117]' : 'bg-[#1C2128] text-[#8B949E] border border-[#30363D] hover:text-[#E6EDF3]'}`}
              >
                <History size={14} /> {showHistory ? 'Ver Pendientes' : 'Historial'}
              </button>
            </div>
            
            <h2 className="text-2xl font-black mb-1 tracking-tighter">Liquidación por Evento</h2>
            <p className="text-[#8B949E] text-[10px] font-bold uppercase tracking-widest mb-6">{showHistory ? 'Liquidaciones completadas' : 'Eventos pendientes de cierre de cuenta'}</p>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {sortedEvents.map(ev => {
                const isLiquidated = liquidatedIds.includes(ev.id);
                const isPastDue = !isLiquidated && new Date(ev.date) < today;

                return (
                  <button
                    key={ev.id}
                    onClick={() => {
                      setSelectedEvent(ev);
                      setActiveView('EVENTO');
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${getEventStatusStyle(ev)}`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-[#30363D] ${isPastDue ? 'bg-[#F85149]/20 text-[#F85149]' : 'bg-[#0D1117] text-[#8B949E]'}`}>
                        {isLiquidated ? <CheckCircle size={18} /> : isPastDue ? <AlertCircle size={18} /> : <Calculator size={18} />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black truncate uppercase tracking-tight">{ev.title}</div>
                        <div className="text-[10px] opacity-70 font-bold uppercase tracking-widest mt-0.5">{ev.date.split('-').reverse().join('/')}</div>
                      </div>
                    </div>
                    {isLiquidated ? (
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest flex items-center gap-1">
                           Pagado <CheckCircle size={12} />
                        </span>
                        <span className="text-[8px] text-[#C8A951] font-bold uppercase mt-0.5">Por: {CATERING_PAYMENTS_MOCK.find(p => p.concept.includes(ev.title))?.performedBy || 'Admin'}</span>
                      </div>
                    ) : (
                      <ChevronRight size={16} className="text-[#8B949E] group-hover:text-[#C8A951] group-hover:translate-x-1 transition-all" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pagos al Catering - Unified Ledger Ledger */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl mb-12">
          <div className="p-8 border-b border-[#30363D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-[#E6EDF3] text-xl font-black flex items-center gap-2 tracking-tighter uppercase">
                <CreditCard size={22} className="text-[#3FB950]" /> Pagos al Catering
              </h3>
              <p className="text-[10px] text-[#8B949E] uppercase tracking-widest mt-1 font-bold">Estado de cuenta unificado — Salón vs Proveedor</p>
            </div>
            {(user.role === 'JEFE' || user.role === 'RECEPCIONISTA') && (
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="bg-[#3FB950] text-[#0D1117] px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#3FB950]/10 shrink-0"
              >
                Registrar pago
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#1C2128] border-b border-[#30363D] text-[10px] font-black uppercase text-[#8B949E] tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-5">Fecha</th>
                  <th className="px-8 py-5 text-right text-[#3FB950]">Importe (Pago)</th>
                  <th className="px-8 py-5 text-center">Tipo</th>
                  <th className="px-8 py-5 text-right text-[#F85149]">Liquidación</th>
                  <th className="px-8 py-5 text-right text-[#C8A951]">Saldo</th>
                  <th className="px-8 py-5">Realizada por</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]/40 text-sm">
                {CATERING_PAYMENTS_MOCK.map(p => (
                  <tr key={p.id} className="hover:bg-[#0D1117]/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-[#E6EDF3] font-black">{p.date.split('-').reverse().join('/')}</span>
                        <span className="text-[9px] text-[#8B949E] font-bold uppercase tracking-tight">{p.concept}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-[#3FB950]">
                      {p.type === 'PAGO' ? formatCurrency(p.amount) : '─'}
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest border ${p.type === 'PAGO' ? 'text-[#3FB950] bg-[#3FB950]/10 border-[#3FB950]/20' : 'text-[#F85149] bg-[#F85149]/10 border-[#F85149]/20'}`}>
                         {p.type}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-[#F85149]">
                      {p.type === 'LIQUIDACION' ? formatCurrency(p.liquidation || 0) : '─'}
                    </td>
                    <td className="px-8 py-5 text-right font-black text-[#C8A951] bg-[#C8A951]/5 border-l border-[#C8A951]/10">
                      {formatCurrency(p.balance)}
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest leading-none">{p.performedBy || '─'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Legend */}
        <div className="p-8 bg-[#3FB950]/5 border border-[#3FB950]/20 rounded-3xl flex items-start gap-5">
          <Info size={28} className="text-[#3FB950] shrink-0 mt-1" />
          <div className="space-y-1">
            <p className="text-xs text-[#8B949E] leading-relaxed font-medium">
              El <strong className="text-[#C8A951]">Saldo</strong> refleja la diferencia acumulada entre las liquidaciones de eventos (deuda) y los pagos realizados por el salón. 
            </p>
            <p className="text-[10px] text-[#3FB950] font-black uppercase tracking-widest mt-2 bg-[#3FB950]/10 px-2 py-1 rounded inline-block">Cálculo de balance automático activado</p>
          </div>
        </div>
      </div>

      {/* Registrar Pago Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0D1117]/80 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
          <div className="bg-[#161B22] border border-[#30363D] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#30363D] flex items-center justify-between bg-[#1C2128]">
               <h3 className="text-sm font-black text-[#E6EDF3] uppercase tracking-widest flex items-center gap-2">
                 <DollarSign size={16} className="text-[#3FB950]" /> Registrar Pago al Catering
               </h3>
               <button onClick={() => setShowPaymentModal(false)} className="text-[#8B949E] hover:text-[#E6EDF3] transition-colors">
                 <X size={20} />
               </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Monto a abonar</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3FB950] font-black text-xl">$</span>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-2xl py-4 pl-10 pr-4 text-2xl font-display font-black text-[#E6EDF3] outline-none focus:border-[#3FB950] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Forma de Pago</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-4 rounded-2xl bg-[#0D1117] border border-[#30363D] text-[10px] font-black uppercase tracking-widest text-[#8B949E] hover:border-[#3FB950] hover:text-[#3FB950] focus:bg-[#3FB950]/10 focus:border-[#3FB950] focus:text-[#3FB950] transition-all">
                    Efectivo
                  </button>
                  <button className="py-4 rounded-2xl bg-[#0D1117] border border-[#30363D] text-[10px] font-black uppercase tracking-widest text-[#8B949E] hover:border-[#3FB950] hover:text-[#3FB950] focus:bg-[#3FB950]/10 focus:border-[#3FB950] focus:text-[#3FB950] transition-all">
                    Transferencia
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setShowPaymentModal(false)}
                className="w-full bg-[#3FB950] text-[#0D1117] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-[#3FB950]/20"
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
