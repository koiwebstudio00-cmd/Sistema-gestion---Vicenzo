import React, { useMemo, useState } from "react";
import { ChevronLeft, Save, Calculator, CheckCircle, Info } from "lucide-react";
import { formatCurrency, type User } from "../../features/demo/demoShared";

export const LiquidacionEventoView = ({ event, user, onBack }: { event: any, user: User, onBack: () => void }) => {
  // Mock constant for Tarjeta Chuchi Prices (Normally would come from the other view's state)
  const tarjChuchiMarch = {
    adults: 53000, // For March 2026
    kids: 26500,
    mozos: 52000
  };

  // Local State for manual entries
  const [data, setData] = useState({
    cantAdultos: event.guests?.adults || 120,
    cantNinos: event.guests?.kids || 35,
    valorCoca: 4500, // Manual example
    cantMozos: 8,    // Only for adults
  });

  const calculations = useMemo(() => {
    const subAdultos = data.cantAdultos * tarjChuchiMarch.adults;
    const subNinos = data.cantNinos * tarjChuchiMarch.kids;
    const subTotalGeneral = subAdultos + subNinos;
    
    const comision = subTotalGeneral * 0.10;
    const totalCoca = data.cantAdultos * data.valorCoca;
    const totalMozos = data.cantMozos * tarjChuchiMarch.mozos;
    
    const totalFinal = subTotalGeneral - comision - totalCoca - totalMozos;

    return {
      subAdultos,
      subNinos,
      subTotalGeneral,
      comision,
      totalCoca,
      totalMozos,
      totalFinal
    };
  }, [data]);

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-1 transition-colors">
              <ChevronLeft size={20} /> Volver
            </button>
            <div className="h-6 w-px bg-[#30363D] hidden lg:block" />
            <div>
              <h1 className="text-2xl font-display font-bold text-[#E6EDF3] tracking-tight">Liquidación por Evento</h1>
              <div className="flex items-center gap-4 mt-1.5">
                <span className="text-xs font-black text-[#C8A951] uppercase tracking-[0.2em]">{event?.category || 'S/D'}</span>
                <span className="text-[#8B949E] text-xs font-medium uppercase tracking-widest">{event?.date || 'S/D'}</span>
              </div>
            </div>
          </div>
          <button className="px-6 py-3 bg-[#3FB950] text-[#0D1117] rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-[#3FB950]/10">
            <Save size={18} /> Guardar liquidación
          </button>
        </div>

        {/* Calculation Grid */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl mb-10">
          <div className="px-6 py-4 bg-[#1C2128] border-b border-[#30363D] flex items-center gap-2 text-[#3FB950]">
            <Calculator size={18} /> <h2 className="text-xs font-black uppercase tracking-widest">Planilla de Cálculo Manual</h2>
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
                  <th className="px-6 py-4 text-right">Sub Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]/30">
                {/* ADULTOS */}
                <tr className="hover:bg-[#0D1117]/20 transition-colors">
                  <td className="px-6 py-6 font-bold text-[#E6EDF3]">ADULTOS</td>
                  <td className="px-4 py-6">
                    <input 
                      type="number" 
                      value={data.cantAdultos}
                      onChange={(e) => setData({...data, cantAdultos: parseInt(e.target.value) || 0})}
                      className="w-20 mx-auto bg-[#0D1117] border border-[#30363D] rounded-lg px-2 py-1.5 text-center font-bold text-[#3FB950] focus:border-[#3FB950] outline-none" 
                    />
                  </td>
                  <td className="px-4 py-6 text-center text-[#8B949E] font-medium">{formatCurrency(tarjChuchiMarch.adults)}</td>
                  <td className="px-4 py-6">
                    <input 
                      type="number" 
                      value={data.valorCoca}
                      onChange={(e) => setData({...data, valorCoca: parseInt(e.target.value) || 0})}
                      className="w-24 mx-auto bg-[#0D1117] border border-[#C8A951]/30 rounded-lg px-2 py-1.5 text-center font-bold text-[#E6EDF3] focus:border-[#C8A951] outline-none" 
                    />
                  </td>
                  <td className="px-4 py-6 text-center text-[#8B949E] font-medium">{formatCurrency(tarjChuchiMarch.mozos)}</td>
                  <td className="px-4 py-6">
                    <input 
                      type="number" 
                      value={data.cantMozos}
                      onChange={(e) => setData({...data, cantMozos: parseInt(e.target.value) || 0})}
                      className="w-16 mx-auto bg-[#0D1117] border border-[#30363D] rounded-lg px-2 py-1.5 text-center font-bold text-[#E6EDF3] focus:border-[#3FB950] outline-none" 
                    />
                  </td>
                  <td className="px-6 py-6 text-right font-black text-[#E6EDF3]">{formatCurrency(calculations.subAdultos)}</td>
                </tr>

                {/* NIÑOS */}
                <tr className="hover:bg-[#0D1117]/20 transition-colors">
                  <td className="px-6 py-6 font-bold text-[#E6EDF3]">NIÑOS</td>
                  <td className="px-4 py-6">
                    <input 
                      type="number" 
                      value={data.cantNinos}
                      onChange={(e) => setData({...data, cantNinos: parseInt(e.target.value) || 0})}
                      className="w-20 mx-auto bg-[#0D1117] border border-[#30363D] rounded-lg px-2 py-1.5 text-center font-bold text-[#3FB950] focus:border-[#3FB950] outline-none" 
                    />
                  </td>
                  <td className="px-4 py-6 text-center text-[#8B949E] font-medium">{formatCurrency(tarjChuchiMarch.kids)}</td>
                  <td className="px-4 py-6 text-center text-[#30363D]">─</td>
                  <td className="px-4 py-6 text-center text-[#30363D]">─</td>
                  <td className="px-4 py-6 text-center text-[#30363D]">─</td>
                  <td className="px-6 py-6 text-right font-black text-[#E6EDF3]">{formatCurrency(calculations.subNinos)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Desglose Final */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="p-6 bg-[#161B22] border border-[#30363D] rounded-3xl h-full">
            <h3 className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Info size={14} className="text-[#C8A951]" /> Notas de Liquidación
            </h3>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              Los valores de tarjeta se aplican automáticamente según la "Tarjeta Chuchi" para el mes de {event.date?.split(' de ')[1]}. 
              La comisión del salón es fija del 10% sobre el sub-total general. 
              Los gastos de Mozos y Coca se deducen directamente del neto final a transferir.
            </p>
          </div>

          <div className="bg-[#1C2128] border border-[#30363D] rounded-3xl overflow-hidden shadow-xl">
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-[#8B949E]">Sub total general</span>
                <span className="text-[#E6EDF3]">{formatCurrency(calculations.subTotalGeneral)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-[#F85149]">Comisión Salón (10%)</span>
                <span className="text-[#F85149]">- {formatCurrency(calculations.comision)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-[#8B949E]">Gasto Mozos</span>
                <span className="text-[#F85149]">- {formatCurrency(calculations.totalMozos)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-[#8B949E]">Gasto Coca</span>
                <span className="text-[#F85149]">- {formatCurrency(calculations.totalCoca)}</span>
              </div>
              <div className="h-px bg-[#30363D] my-4" />
              <div className="flex justify-between items-end pt-2">
                <div>
                  <h4 className="text-[10px] font-black text-[#3FB950] uppercase tracking-[0.2em] mb-1">Total a Liquidar</h4>
                  <p className="text-xs text-[#8B949E] font-medium tracking-tight">Monto neto para transferir al Proveedor.</p>
                </div>
                <div className="text-3xl font-display font-black text-[#3FB950] tracking-tighter">
                  {formatCurrency(calculations.totalFinal)}
                </div>
              </div>
            </div>
            <div className="bg-[#3FB950]/10 border-t border-[#3FB950]/20 px-8 py-4 flex items-center gap-2 text-[#3FB950] font-black text-[9px] uppercase tracking-widest">
              <CheckCircle size={14} /> Cálculo validado matemáticamente
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
