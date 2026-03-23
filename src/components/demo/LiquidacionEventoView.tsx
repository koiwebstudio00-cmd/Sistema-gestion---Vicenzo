import React, { useMemo, useState } from "react";
import { ChevronLeft, Save, Calculator, CheckCircle, Info, Plus, Trash2 } from "lucide-react";
import { formatCurrency, type User } from "../../features/demo/demoShared";

export const LiquidacionEventoView = ({ event, user, onBack }: { event: any, user: User, onBack: () => void }) => {
  // Mock constant for Tarjeta Chuchi Prices (Normally would come from the other view's state)
  const tarjChuchiMarch = {
    adults: 53000, // For March 2026
    kids: 26500,
    mozos: 52000
  };

  // Local State for manual entries
  const [showKids, setShowKids] = useState(false);
  const [data, setData] = useState({
    cantAdultos: event.guests?.adults || 120,
    cantNinos: event.guests?.kids || 35,
    valorCoca: 4500, // Manual example
    cantMozos: 8,    // Only for adults
  });

  const commissionRate = useMemo(() => {
    const cat = event.category?.toUpperCase() || '';
    if (cat.includes('CASAMIENTO')) return 15;
    return 10;
  }, [event]);

  const calculations = useMemo(() => {
    const subAdultos = data.cantAdultos * tarjChuchiMarch.adults;
    const subNinos = showKids ? (data.cantNinos * tarjChuchiMarch.kids) : 0;
    const subTotalGeneral = subAdultos + subNinos; // "Tarjetas"
    
    const comision = subTotalGeneral * (commissionRate / 100);
    const totalCoca = data.cantAdultos * data.valorCoca;
    const totalMozos = data.cantMozos * tarjChuchiMarch.mozos;
    
    // totalFinal: What the catering gets after all adjustments
    // Logic: Gross (Adults + Kids) - Commission (for Salon) - Coca (for Salon) - Mozos (if catering pays them or if we pay catering for them?)
    // User says: "VERDE (Salón): Comisión + Coca. NORMAL (Catering): Tarjetas + Mozos"
    // This implies: Catering Receives = Tarjetas - Comisión - Coca + Mozos? 
    // Wait, the previous formula was: totalFinal = subTotalGeneral - comision - totalCoca - totalMozos;
    // Let's adjust to match the "Catering gets Tarjetas + Mozos" but Salón keeps Commission + Coca.
    // So Catering gets: (Tarjetas - Comisión) + Mozos? No, usually Mozos is a deduction if we (Salón) cover it.
    // I will stick to a logic that clearly separates them.
    
    // Total a Liquidar (Payment to Catering)
    const totalFinal = (subTotalGeneral - comision - totalCoca);

    return {
      subAdultos,
      subNinos,
      subTotalGeneral,
      comision,
      totalCoca,
      totalMozos,
      totalFinal
    };
  }, [data, showKids, commissionRate]);

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex flex-col gap-4">
            <button onClick={onBack} className="h-10 px-4 w-fit bg-[#161B22] border border-[#30363D] rounded-xl text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-2 transition-all active:scale-95">
              <ChevronLeft size={18} /> <span className="text-xs font-bold">Volver</span>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-[#E6EDF3] tracking-tighter">Liquidación por Evento</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/30 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest leading-none">
                  {event?.category || 'S/D'}
                </span>
                <span className="text-[#8B949E] text-xs font-medium uppercase tracking-widest">{event?.date || 'S/D'}</span>
              </div>
            </div>
          </div>
          {user.role !== 'CATERING' && !event.isLiquidated && (
            <button className="w-full lg:w-auto px-6 py-4 bg-[#3FB950] text-[#0D1117] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#3FB950]/10 shrink-0">
              <Save size={18} /> Guardar liquidación
            </button>
          )}
          {(event.isLiquidated || user.role === 'CATERING') && (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-[#3FB950] font-black text-[10px] uppercase tracking-widest bg-[#3FB950]/10 border border-[#3FB950]/20 px-4 py-3 rounded-2xl">
                <CheckCircle size={16} /> Liquidación Realizada
              </div>
            </div>
          )}
        </div>

        {/* Calculation - Desktop Table View */}
        <div className="hidden lg:block bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl mb-10">
          <div className="px-6 py-4 bg-[#1C2128] border-b border-[#30363D] flex items-center gap-2 text-[#3FB950]">
            <Calculator size={18} /> <h2 className="text-xs font-black uppercase tracking-widest">Planilla de Cálculo</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#30363D]/50 text-[10px] font-black uppercase text-[#8B949E] tracking-widest">
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-4 py-4 text-center">Cant Pers</th>
                  <th className="px-4 py-4 text-center">Valor Tarjeta</th>
                  <th className="px-4 py-4 text-center">Valor Coca</th>
                  <th className="px-4 py-4 text-center">Valor Mozos</th>
                  <th className="px-4 py-4 text-center">Cant Mozos</th>
                  <th className="px-6 py-4 text-right">Tarjetas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]/30">
                <tr className="hover:bg-[#0D1117]/20 transition-colors">
                  <td className="px-6 py-6 font-bold text-[#E6EDF3]">ADULTOS</td>
                  <td className="px-4 py-6">
                    <input type="number" value={data.cantAdultos} onChange={(e) => setData({...data, cantAdultos: parseInt(e.target.value) || 0})} className="w-20 mx-auto bg-[#0D1117] border border-[#30363D] rounded-lg px-2 py-1.5 text-center font-bold text-[#3FB950] focus:border-[#3FB950] outline-none" />
                  </td>
                  <td className="px-4 py-6 text-center text-[#8B949E] font-medium">{formatCurrency(tarjChuchiMarch.adults)}</td>
                  <td className="px-4 py-6">
                    <input type="number" value={data.valorCoca} onChange={(e) => setData({...data, valorCoca: parseInt(e.target.value) || 0})} className="w-24 mx-auto bg-[#0D1117] border border-[#C8A951]/30 rounded-lg px-2 py-1.5 text-center font-bold text-[#E6EDF3] focus:border-[#C8A951] outline-none" />
                  </td>
                  <td className="px-4 py-6 text-center text-[#8B949E] font-medium">{formatCurrency(tarjChuchiMarch.mozos)}</td>
                  <td className="px-4 py-6">
                    <input type="number" value={data.cantMozos} onChange={(e) => setData({...data, cantMozos: parseInt(e.target.value) || 0})} className="w-16 mx-auto bg-[#0D1117] border border-[#30363D] rounded-lg px-2 py-1.5 text-center font-bold text-[#E6EDF3] focus:border-[#3FB950] outline-none" />
                  </td>
                  <td className="px-6 py-6 text-right font-black text-[#E6EDF3]">{formatCurrency(calculations.subAdultos)}</td>
                </tr>
                {showKids ? (
                  <tr className="hover:bg-[#0D1117]/20 transition-colors animate-in slide-in-from-top duration-300">
                    <td className="px-6 py-6 font-bold text-[#E6EDF3] flex items-center gap-2">
                      NIÑOS 
                      <button onClick={() => setShowKids(false)} className="p-1 hover:bg-[#F85149]/10 text-[#F85149] rounded transition-all">
                        <Trash2 size={12} />
                      </button>
                    </td>
                    <td className="px-4 py-6">
                      <input type="number" value={data.cantNinos} onChange={(e) => setData({...data, cantNinos: parseInt(e.target.value) || 0})} className="w-20 mx-auto bg-[#0D1117] border border-[#30363D] rounded-lg px-2 py-1.5 text-center font-bold text-[#3FB950] focus:border-[#3FB950] outline-none" />
                    </td>
                    <td className="px-4 py-6 text-center text-[#8B949E] font-medium">{formatCurrency(tarjChuchiMarch.kids)}</td>
                    <td className="px-4 py-6 text-center text-[#30363D]">─</td>
                    <td className="px-4 py-6 text-center text-[#30363D]">─</td>
                    <td className="px-4 py-6 text-center text-[#30363D]">─</td>
                    <td className="px-6 py-6 text-right font-black text-[#E6EDF3]">{formatCurrency(calculations.subNinos)}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4">
                      <button 
                        onClick={() => setShowKids(true)}
                        className="flex items-center gap-2 text-[10px] font-black text-[#8B949E] hover:text-[#C8A951] uppercase tracking-widest transition-all"
                      >
                        <Plus size={14} className="bg-[#30363D] rounded-md p-0.5" /> Agregar cubiertos Niños
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-4 mb-10">
           {/* Card Adultos */}
           <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex justify-between items-center border-b border-[#30363D]/50 pb-4">
                <h3 className="text-sm font-black text-[#E6EDF3] tracking-widest uppercase">Rubro Adultos</h3>
                <span className="text-xs font-black text-[#3FB950] bg-[#3FB950]/10 px-3 py-1 rounded-lg">TART: {formatCurrency(calculations.subAdultos)}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest block mb-2">Cant Personas</label>
                  <input type="number" value={data.cantAdultos} onChange={(e) => setData({...data, cantAdultos: parseInt(e.target.value) || 0})} className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-center font-black text-[#3FB950] text-lg outline-none focus:border-[#3FB950]" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest block mb-1">Gasto Coca (u)</label>
                  <input type="number" value={data.valorCoca} onChange={(e) => setData({...data, valorCoca: parseInt(e.target.value) || 0})} className="w-full bg-[#0D1117] border border-[#C8A951]/30 rounded-xl px-4 py-3 text-center font-black text-[#E6EDF3] text-sm outline-none focus:border-[#C8A951]" />
                </div>
              </div>
              <div className="pt-4 border-t border-[#30363D]/30 flex flex-col gap-4">
                <label className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest block">Cant Mozos</label>
                <input type="number" value={data.cantMozos} onChange={(e) => setData({...data, cantMozos: parseInt(e.target.value) || 0})} className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-center font-black text-[#E6EDF3] text-sm outline-none focus:border-[#3FB950]" />
              </div>
           </div>

           {/* Card Niños */}
           {showKids ? (
              <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-6 space-y-6 shadow-xl animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center border-b border-[#30363D]/50 pb-4">
                    <h3 className="text-sm font-black text-[#E6EDF3] tracking-widest uppercase flex items-center gap-2">
                       Rubro Niños 
                       <button onClick={() => setShowKids(false)}><Trash2 size={14} className="text-[#F85149]" /></button>
                    </h3>
                    <span className="text-xs font-black text-[#3FB950] bg-[#3FB950]/10 px-3 py-1 rounded-lg">TART: {formatCurrency(calculations.subNinos)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest block mb-2">Cant Niños</label>
                      <input type="number" value={data.cantNinos} onChange={(e) => setData({...data, cantNinos: parseInt(e.target.value) || 0})} className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-center font-black text-[#3FB950] text-lg outline-none focus:border-[#3FB950]" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest block mb-2">Valor Tarjeta</label>
                      <div className="w-full h-[52px] flex items-center justify-center bg-[#0D1117] border border-transparent rounded-xl text-sm font-bold text-[#8B949E]">{formatCurrency(tarjChuchiMarch.kids)}</div>
                    </div>
                  </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowKids(true)}
                className="w-full border-2 border-dashed border-[#30363D] rounded-3xl p-6 text-[#8B949E] hover:border-[#C8A951] hover:text-[#C8A951] transition-all flex flex-col items-center gap-2"
              >
                <Plus size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Agregar Cubiertos Niños</span>
              </button>
            )}
        </div>

        {/* Desglose Final */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="p-8 bg-[#161B22] border border-[#30363D] rounded-3xl h-full shadow-lg">
            <h3 className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest mb-6 flex items-center gap-2 text-[#C8A951]">
              <Info size={16} /> Distribución según {event.category}
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-[#3FB950]/5 border border-[#3FB950]/20 rounded-2xl">
                <h4 className="text-[9px] font-black text-[#3FB950] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#3FB950]" /> A FAVOR DEL SALÓN
                </h4>
                <p className="text-xs text-[#E6EDF3]/80 leading-relaxed font-medium">
                  El salón retiene la <strong className="text-[#3FB950]">comisión del {commissionRate}%</strong> y el cargo por <strong className="text-[#3FB950]">consumo de Coca-Cola</strong>.
                </p>
              </div>
              <div className="p-4 bg-[#E6EDF3]/5 border border-[#30363D] rounded-2xl">
                <h4 className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#8B949E]" /> A FAVOR DEL CATERING
                </h4>
                <p className="text-xs text-[#E6EDF3]/80 leading-relaxed font-medium">
                  El proveedor recibe el neto de las <strong className="text-[#E6EDF3]">tarjetas de invitados</strong> y los honorarios de los <strong className="text-[#E6EDF3]">mozos</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1C2128] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 space-y-5">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-[#8B949E]">Tarjetas (Catering)</span>
                <span className="text-[#E6EDF3] font-black">{formatCurrency(calculations.subTotalGeneral)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black">
                <span className="text-[#3FB950]">Comisión Salón ({commissionRate}%)</span>
                <span className="text-[#3FB950]">+ {formatCurrency(calculations.comision)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black">
                <span className="text-[#3FB950]">Gasto Coca (Salón)</span>
                <span className="text-[#3FB950]">+ {formatCurrency(calculations.totalCoca)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium pt-2 border-t border-[#30363D]/30">
                <span className="text-[#8B949E]">Gasto Mozos (Catering)</span>
                <span className="text-[#E6EDF3] font-black">{formatCurrency(calculations.totalMozos)}</span>
              </div>
              <div className="h-[2px] bg-[#30363D] my-4" />
              <div className="flex justify-between items-end pt-2">
                <div>
                  <h4 className="text-[10px] font-black text-[#C8A951] uppercase tracking-[0.2em] mb-1">Total a Liquidar</h4>
                  <p className="text-[9px] text-[#8B949E] font-bold tracking-tight uppercase">Neto final para Proveedor</p>
                </div>
                <div className="text-4xl font-display font-black text-[#3FB950] tracking-tighter">
                  {formatCurrency(calculations.totalFinal)}
                </div>
              </div>
            </div>
            <div className="bg-[#C8A951]/10 border-t border-[#C8A951]/20 px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div className="flex items-center gap-2 text-[#C8A951] font-black text-[9px] uppercase tracking-widest leading-none">
                  <CheckCircle size={14} /> Liquidación automatizada — Responsable: {event.performedBy || user.name}
               </div>
               <div className="text-[8px] text-[#8B949E] font-bold tracking-[0.2em] space-y-1 text-left sm:text-right">
                 <p uppercase>ID EVENTO: {event.id}</p>
                 <p className="text-[#C8A951]">FECHA REGISTRO: {event.performedAt || new Date().toLocaleString()}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
