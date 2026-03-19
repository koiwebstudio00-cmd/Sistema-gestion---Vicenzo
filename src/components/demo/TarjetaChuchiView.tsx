import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Save, TrendingUp, Lock, RefreshCw, Users } from "lucide-react";
import { formatCurrency, type User } from "../../features/demo/demoShared";

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const ROWS = [
  'MENU 1', 
  'MENU 2 POLLO', 
  'MENU 2 LOMO', 
  'BUFFET 1', 
  'BUFFET 2', 
  'NIÑOS', 
  'MOZOS'
];

export const TarjetaChuchiView = ({ user, onBack }: { user: User, onBack: () => void }) => {
  const isJefe = user.role === 'JEFE';
  
  // Initial Mock Data for ENE
  const initialBase: Record<string, number> = {
    'MENU 1': 53000,
    'MENU 2 POLLO': 68500,
    'MENU 2 LOMO': 74200,
    'BUFFET 1': 8500,
    'BUFFET 2': 12200,
    'NIÑOS': 26500,
    'MOZOS': 52000
  };

  // State to hold the full 12x7 grid
  const [prices, setPrices] = useState<Record<string, number[]>>(() => {
    const grid: Record<string, number[]> = {};
    ROWS.forEach(row => {
      grid[row] = Array(12).fill(0);
      grid[row][0] = initialBase[row] || 0;
      // Auto-calculate others based on 3% monthly increase
      for (let i = 1; i < 12; i++) {
        grid[row][i] = Math.round(grid[row][i-1] * 1.03);
      }
    });
    return grid;
  });

  const [selectedMonthIdx, setSelectedMonthIdx] = useState(new Date().getMonth());
  
  const handlePriceChange = (row: string, monthIdx: number, val: string) => {
    if (!isJefe) return;
    const newVal = parseInt(val) || 0;
    const newPrices = { ...prices };
    newPrices[row][monthIdx] = newVal;
    setPrices(newPrices);
  };

  const cascadeCalculation = (row: string) => {
    const newPrices = { ...prices };
    for (let i = 1; i < 12; i++) {
      newPrices[row][i] = Math.round(newPrices[row][i-1] * 1.03);
    }
    setPrices(newPrices);
  };

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3] pb-32 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button onClick={onBack} className="h-10 px-4 bg-[#161B22] border border-[#30363D] rounded-xl text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-2 transition-all active:scale-95">
              <ChevronLeft size={18} /> <span className="text-xs font-bold">Volver</span>
            </button>
            <div className="h-6 w-px bg-[#30363D] hidden lg:block" />
            <div>
              <h1 className="text-2xl font-display font-black text-[#E6EDF3] tracking-tight">Tarjeta Chuchi 💳</h1>
              <p className="text-[#8B949E] text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] mt-1">Costos proyectados del Catering</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isJefe && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F85149]/10 text-[#F85149] border border-[#F85149]/30 rounded-lg text-[10px] font-black tracking-widest uppercase">
                <Lock size={12} /> Sólo lectura
              </div>
            )}
            <button className="flex-1 sm:flex-none px-6 py-3 bg-[#1F6FEB] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#388BFD] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1F6FEB]/20">
              <Save size={16} /> <span className="hidden sm:inline">Guardar cambios</span><span className="sm:hidden">Guardar</span>
            </button>
          </div>
        </div>

        {/* Legend / Info */}
        <div className="mb-8 p-5 bg-[#161B22] border border-[#30363D] rounded-3xl flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <TrendingUp size={80} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-[#3FB950]/20 text-[#3FB950] rounded-2xl border border-[#3FB950]/20"><TrendingUp size={24} /></div>
            <div>
              <h3 className="text-xs font-black text-[#E6EDF3] uppercase tracking-widest mb-1">Automatización Proyectada</h3>
              <p className="text-[11px] text-[#8B949E] leading-relaxed">Cálculo inflacionario del <strong>3% mensual</strong> basado en el costo del mes anterior.</p>
            </div>
          </div>
          <div className="h-10 w-px bg-[#30363D] hidden md:block" />
          <p className="text-[10px] text-[#C8A951] italic relative z-10">
            Tip: Al cargar enero, puedes proyectar todo el año automáticamente con el botón de refresco.
          </p>
        </div>

        {/* Month Selector - MOBILE ONLY */}
        <div className="lg:hidden flex items-center justify-between gap-2 mb-6 bg-[#161B22] p-2 rounded-2xl border border-[#30363D]">
           <button 
             onClick={() => setSelectedMonthIdx(prev => Math.max(0, prev - 1))}
             disabled={selectedMonthIdx === 0}
             className="p-3 bg-[#0D1117] border border-[#30363D] rounded-xl text-[#E6EDF3] disabled:opacity-20 active:scale-90 transition-all"
           >
             <ChevronLeft size={20} />
           </button>
           <div className="flex-1 text-center">
             <div className="text-[10px] font-black text-[#C8A951] uppercase tracking-[0.3em] mb-1">MES SELECCIONADO</div>
             <div className="text-xl font-display font-black text-[#E6EDF3] tracking-widest">{MONTHS[selectedMonthIdx]}</div>
           </div>
           <button 
             onClick={() => setSelectedMonthIdx(prev => Math.min(11, prev + 1))}
             disabled={selectedMonthIdx === 11}
             className="p-3 bg-[#0D1117] border border-[#30363D] rounded-xl text-[#E6EDF3] disabled:opacity-20 active:scale-90 transition-all"
           >
             <ChevronRight size={20} />
           </button>
        </div>

        {/* Desktop View Table */}
        <div className="hidden lg:block bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1C2128] border-b border-[#30363D]">
                  <th className="px-6 py-4 text-[10px] font-black text-[#8B949E] uppercase tracking-widest bg-[#1C2128] sticky left-0 z-10 w-[200px]">RUBRO</th>
                  {MONTHS.map(m => (
                    <th key={m} className="px-4 py-4 text-[10px] font-black text-[#8B949E] uppercase tracking-widest text-center min-w-[120px]">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]/50 text-sm">
                {ROWS.map(row => (
                  <tr key={row} className="hover:bg-[#0D1117]/20 transition-colors group">
                    <td className="px-6 py-4 font-bold text-[#E6EDF3] bg-[#161B22] sticky left-0 z-10 border-r border-[#30363D]/30 flex items-center justify-between">
                      <span className="text-xs tracking-tight">{row}</span>
                      {isJefe && (
                        <button 
                          onClick={() => cascadeCalculation(row)}
                          title="Proyectar año (+3% mensual)"
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#30363D] rounded transition-all text-[#3FB950]"
                        >
                          <RefreshCw size={12} />
                        </button>
                      )}
                    </td>
                    {prices[row].map((price: number, idx: number) => (
                      <td key={idx} className="px-2 py-3">
                        <div className="relative group/cell">
                          <input 
                            type="number" 
                            disabled={!isJefe}
                            value={price}
                            onChange={(e) => handlePriceChange(row, idx, e.target.value)}
                            className={`w-full bg-[#0D1117] border ${idx === 0 ? 'border-[#C8A951]/30' : 'border-[#30363D]'} rounded-xl px-3 py-2 text-center font-display font-medium text-[#E6EDF3] outline-none focus:border-[#C8A951] ${!isJefe && 'cursor-not-allowed opacity-80'}`}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View - Single Month List (No more sliders!) */}
        <div className="lg:hidden space-y-3">
           {ROWS.map(row => (
             <div key={row} className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest mb-1">Rubro</div>
                  <div className="text-xs font-black text-[#E6EDF3] truncate leading-tight uppercase tracking-tight">{row}</div>
                  {isJefe && selectedMonthIdx === 0 && (
                    <button 
                      onClick={() => cascadeCalculation(row)}
                      className="mt-2 text-[9px] font-black text-[#3FB950] uppercase tracking-widest flex items-center gap-1.5 bg-[#3FB950]/10 px-2 py-1 rounded-lg"
                    >
                      <RefreshCw size={10} /> Proyectar Año
                    </button>
                  )}
                </div>
                <div className="w-40">
                  <div className="text-[9px] font-black text-[#C8A951] uppercase tracking-widest mb-1 text-right">Precio Actual</div>
                  <div className="relative">
                    <input 
                      type="number" 
                      disabled={!isJefe}
                      value={prices[row][selectedMonthIdx]}
                      onChange={(e) => handlePriceChange(row, selectedMonthIdx, e.target.value)}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-right font-display font-black text-[#E6EDF3] outline-none focus:border-[#C8A951] text-sm"
                    />
                  </div>
                </div>
             </div>
           ))}
        </div>

        {/* Footer Notes */}
        <div className="mt-8 text-center">
            <p className="text-[10px] text-[#8B949E] uppercase tracking-[0.2em]">Última actualización: Hoy, 17:35 hs — por {user.name}</p>
        </div>
      </div>
    </div>
  );
};
