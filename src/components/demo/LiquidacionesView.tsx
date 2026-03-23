import React, { useState } from "react";
import { Plus, Calculator, CreditCard, ChevronRight, TrendingUp, Info, CheckCircle, AlertCircle, History, Search, X, DollarSign } from "lucide-react";
import { TarjetaChuchiView } from "./TarjetaChuchiView";
import { LiquidacionEventoView } from "./LiquidacionEventoView";
import { EVENTS_DATA, type User, CATERING_PAYMENTS_MOCK, formatCurrency } from "../../features/demo/demoShared";

export const LiquidacionesView = ({ user }: { user: User }) => {
  const [activeView, setActiveView] = useState<'MENU' | 'CHUCHI' | 'EVENTO' | 'LIQUIDACION_LIST' | 'PAGOS_CATERING'>('MENU');
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
  if (activeView === 'EVENTO' && selectedEvent) return <LiquidacionEventoView event={selectedEvent} user={user} onBack={() => setActiveView('LIQUIDACION_LIST')} />;

  if (activeView === 'LIQUIDACION_LIST') {
    return (
      <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3] animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-1">
              <button onClick={() => setActiveView('MENU')} className="text-[#8B949E] hover:text-white flex items-center gap-2 font-bold mb-4 transition-colors"><ChevronRight size={16} className="rotate-180" /> Volver</button>
              <h1 className="text-3xl font-display font-black text-[#E6EDF3] tracking-tighter">Liquidación por Evento</h1>
              <p className="text-[#8B949E] text-xs font-bold uppercase tracking-widest">{showHistory ? 'Liquidaciones completadas' : 'Eventos pendientes de cierre'}</p>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showHistory ? 'bg-[#3FB950] text-[#0D1117]' : 'bg-[#1C2128] text-[#8B949E] border border-[#30363D] hover:text-[#E6EDF3]'}`}
            >
              <History size={14} /> {showHistory ? 'Ver Pendientes' : 'Historial'}
            </button>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#1C2128] border-b border-[#30363D] text-[10px] font-black uppercase text-[#8B949E] tracking-[0.2em]">
                  <tr>
                    <th className="px-6 py-5 w-16 text-center">Estado</th>
                    <th className="px-6 py-5 w-32">Fecha</th>
                    <th className="px-6 py-5">Evento</th>
                    <th className="px-6 py-5 text-right">Responsable</th>
                    <th className="px-6 py-5 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363D]/40">
                  {sortedEvents.map(ev => {
                    const isLiquidated = liquidatedIds.includes(ev.id);
                    const isPastDue = !isLiquidated && new Date(ev.date) < today;

                    let textColor = "text-[#E6EDF3]"; // White
                    let iconColor = "text-[#8B949E]";

                    if (isLiquidated) {
                      textColor = "text-[#3FB950]"; // Green
                      iconColor = "text-[#3FB950]";
                    } else if (isPastDue) {
                      textColor = "text-[#F85149]"; // Red
                      iconColor = "text-[#F85149]";
                    }

                    return (
                      <tr
                        key={ev.id}
                        onClick={() => {
                          setSelectedEvent(ev);
                          setActiveView('EVENTO');
                        }}
                        className="hover:bg-[#0D1117]/50 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-5 text-center">
                          <div className={`flex justify-center ${iconColor}`}>
                            {isLiquidated ? <CheckCircle size={20} /> : isPastDue ? <AlertCircle size={20} /> : <Calculator size={20} />}
                          </div>
                        </td>
                        <td className={`px-6 py-5 text-xs font-black tracking-widest uppercase ${textColor}`}>
                          {ev.date.split('-').reverse().join('/')}
                        </td>
                        <td className="px-6 py-5">
                          <div className={`text-sm font-black uppercase tracking-tight ${textColor}`}>
                            {ev.title}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          {isLiquidated ? (
                            <span className="text-[10px] text-[#C8A951] font-black uppercase tracking-tighter">
                              {CATERING_PAYMENTS_MOCK.find(p => p.concept.includes(ev.title))?.performedBy || 'Admin'}
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#30363D] font-bold uppercase tracking-tighter italic">Pendiente</span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <ChevronRight size={18} className="text-[#30363D] group-hover:text-[#C8A951] transition-all group-hover:translate-x-1" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'PAGOS_CATERING') {
    return (
      <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3] animate-in fade-in duration-300">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => setActiveView('MENU')} className="text-[#8B949E] hover:text-white flex items-center gap-2 font-bold mb-8 transition-colors"><ChevronRight size={16} className="rotate-180" /> Volver</button>

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
  }

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3] animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-display font-black text-[#E6EDF3] tracking-tighter mb-2">Módulo de Liquidaciones</h1>
          <p className="text-[#8B949E] text-sm font-medium uppercase tracking-[0.2em]">Gestión de costos y pagos al proveedor de catering</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Tarjeta Chuchi Card */}
          {user.role !== 'CATERING' && (
            <button
              onClick={() => setActiveView('CHUCHI')}
              className="group relative bg-[#161B22] border border-[#30363D] hover:border-[#C8A951] rounded-3xl p-8 text-left transition-all hover:-translate-y-1 shadow-xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A951]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#C8A951]/10 transition-colors" />
              <div className="w-14 h-14 bg-[#C8A951]/10 text-[#C8A951] rounded-2xl flex items-center justify-center mb-6 border border-[#C8A951]/20">
                <TrendingUp size={28} />
              </div>
              <h2 className="text-2xl font-black mb-2 flex items-center justify-between tracking-tighter">
                Tarjeta Chuchi
                <ChevronRight size={24} className="text-[#C8A951]" />
              </h2>
              <p className="text-[#8B949E] text-sm leading-relaxed mb-6 font-medium">Gestiona la tabla de precios base mensual para la actualización automática de presupuestos.</p>
              <span className="text-[10px] font-black tracking-widest uppercase py-2 px-4 bg-[#1C2128] border border-[#30363D] rounded-xl group-hover:border-[#C8A951]/30 transition-colors">Ir a configuración</span>
            </button>
          )}

          {/* Liquidación por Evento Card */}
          <button
            onClick={() => setActiveView('LIQUIDACION_LIST')}
            className={`group relative bg-[#161B22] border border-[#30363D] hover:border-[#1F6FEB] rounded-3xl p-8 text-left transition-all hover:-translate-y-1 shadow-xl overflow-hidden ${user.role === 'CATERING' ? 'md:col-span-2 max-w-xl' : ''}`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1F6FEB]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#1F6FEB]/10 transition-colors" />
            <div className="w-14 h-14 bg-[#1F6FEB]/10 text-[#1F6FEB] rounded-2xl flex items-center justify-center mb-6 border border-[#1F6FEB]/20">
              <Calculator size={28} />
            </div>
            <h2 className="text-2xl font-black mb-2 flex items-center justify-between tracking-tighter">
              Liquidación por Evento
              <ChevronRight size={24} className="text-[#1F6FEB]" />
            </h2>
            <p className="text-[#8B949E] text-sm leading-relaxed mb-6 font-medium">Liquidaciones pendientes y completadas detalle por detalle, persona por persona.</p>
            <span className="text-[10px] font-black tracking-widest uppercase py-2 px-4 bg-[#1C2128] border border-[#30363D] rounded-xl group-hover:border-[#1F6FEB]/30 transition-colors">Ver listado de eventos</span>
          </button>

          {/* Pagos al Catering Card */}
          <button
            onClick={() => setActiveView('PAGOS_CATERING')}
            className={`group relative bg-[#161B22] border border-[#30363D] hover:border-[#3FB950] rounded-3xl p-8 text-left transition-all hover:-translate-y-1 shadow-xl overflow-hidden ${user.role === 'CATERING' ? 'hidden' : 'md:col-span-2'}`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3FB950]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#3FB950]/10 transition-colors" />
            <div className="w-14 h-14 bg-[#3FB950]/10 text-[#3FB950] rounded-2xl flex items-center justify-center mb-6 border border-[#3FB950]/20">
              <CreditCard size={28} />
            </div>
            <h2 className="text-2xl font-black mb-2 flex items-center justify-between tracking-tighter">
              Pagos al Catering
              <ChevronRight size={24} className="text-[#3FB950]" />
            </h2>
            <p className="text-[#8B949E] text-sm leading-relaxed mb-6 font-medium max-w-xl">Historial de transferencias y pagos en efectivo al servicio de catering corporativo, incluyendo saldos adeudados unificados.</p>
            <span className="text-[10px] font-black tracking-widest uppercase py-2 px-4 bg-[#1C2128] border border-[#30363D] rounded-xl group-hover:border-[#3FB950]/30 transition-colors">Ver cuenta unificada</span>
          </button>
        </div>
      </div>
    </div>
  );
};
