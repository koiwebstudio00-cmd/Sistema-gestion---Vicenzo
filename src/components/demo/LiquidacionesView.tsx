import React, { useState } from "react";
import { Calculator, CreditCard, ChevronRight, TrendingUp, Info } from "lucide-react";
import { TarjetaChuchiView } from "./TarjetaChuchiView";
import { LiquidacionEventoView } from "./LiquidacionEventoView";
import { EVENTS_DATA, type User } from "../../features/demo/demoShared";

export const LiquidacionesView = ({ user }: { user: User }) => {
  const [activeView, setActiveView] = useState<'MENU' | 'CHUCHI' | 'EVENTO'>('MENU');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  if (activeView === 'CHUCHI') return <TarjetaChuchiView user={user} onBack={() => setActiveView('MENU')} />;
  if (activeView === 'EVENTO' && selectedEvent) return <LiquidacionEventoView event={selectedEvent} user={user} onBack={() => setActiveView('MENU')} />;

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3] animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-display font-black text-[#E6EDF3] tracking-tighter mb-2">Módulo de Liquidaciones</h1>
          <p className="text-[#8B949E] text-sm font-medium uppercase tracking-[0.2em]">Gestión de costos y pagos al proveedor de catering</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Tarjeta Chuchi Card */}
          <button 
            onClick={() => setActiveView('CHUCHI')}
            className="group relative bg-[#161B22] border border-[#30363D] hover:border-[#C8A951] rounded-3xl p-10 text-left transition-all hover:scale-[1.02] shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A951]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#C8A951]/10 transition-colors" />
            <div className="w-14 h-14 bg-[#C8A951]/10 text-[#C8A951] rounded-2xl flex items-center justify-center mb-8 border border-[#C8A951]/20">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">Tarjeta Chuchi <ChevronRight size={18} className="text-[#C8A951] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /></h3>
            <p className="text-[#8B949E] text-sm leading-relaxed mb-6">Gestiona la tabla de precios mensual proyectada con el 3% inflacionario automático.</p>
            <span className="text-[10px] font-black tracking-widest uppercase py-1.5 px-3 bg-[#1C2128] border border-[#30363D] rounded-lg">Configurar costos</span>
          </button>

          {/* Liquidación por Evento Card */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-10 shadow-xl">
            <div className="w-14 h-14 bg-[#3FB950]/10 text-[#3FB950] rounded-2xl flex items-center justify-center mb-8 border border-[#3FB950]/20">
              <Calculator size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Liquidación por Evento</h3>
            <p className="text-[#8B949E] text-sm leading-relaxed mb-8">Selecciona un evento para generar la planilla de pago neto al proveedor.</p>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Buscar evento reciente</label>
              <select 
                onChange={(e) => {
                  const ev = EVENTS_DATA.find(ev => ev.id === e.target.value);
                  if (ev) {
                    setSelectedEvent(ev);
                    setActiveView('EVENTO');
                  }
                }}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none focus:border-[#3FB950] font-bold text-xs"
              >
                <option value="">Seleccionar evento...</option>
                {EVENTS_DATA.slice(0, 5).map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <footer className="p-6 bg-[#1C2128] border border-[#30363D] rounded-3xl flex items-start gap-4">
          <Info size={24} className="text-[#C8A951] shrink-0" />
          <p className="text-xs text-[#8B949E] leading-relaxed italic">
            El sistema de liquidaciones utiliza los precios vigentes de la Tarjeta Chuchi según el mes real de realización de cada evento. Asegúrate de que la tabla de precios esté actualizada antes de procesar pagos finales.
          </p>
        </footer>
      </div>
    </div>
  );
};
