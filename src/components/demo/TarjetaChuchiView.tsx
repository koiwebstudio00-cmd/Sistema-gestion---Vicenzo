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
  'MOZOS',
  'COCA'
];

export const TarjetaChuchiView = ({ user, onBack }: { user: User, onBack: () => void }) => {
  const isJefe = user.role === 'JEFE';
  const currentMonthIdx = new Date().getMonth();
  
  // Initial Mock Data base for calculation
  const initialBase: Record<string, number> = {
    'MENU 1': 53000,
    'MENU 2 POLLO': 68500,
    'MENU 2 LOMO': 74200,
    'BUFFET 1': 8500,
    'BUFFET 2': 12200,
    'NIÑOS': 26500,
    'MOZOS': 52000,
    'COCA': 15000
  };

  const [increaseRate, setIncreaseRate] = useState(3);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(currentMonthIdx);
  
  // State to hold the full 12x8 grid
  const [prices, setPrices] = useState<Record<string, number[]>>(() => {
    const grid: Record<string, number[]> = {};
    ROWS.forEach(row => {
      grid[row] = Array(12).fill(0);
      grid[row][0] = initialBase[row] || 0;
      // Auto-calculate others based on 3% monthly increase as starting point
      for (let i = 1; i < 12; i++) {
        grid[row][i] = Math.round(grid[row][i-1] * 1.03);
      }
    });
    return grid;
  });

  const handlePriceChange = (row: string, monthIdx: number, val: string) => {
    if (!isJefe || monthIdx !== currentMonthIdx) return;
    const newVal = parseInt(val) || 0;
    const newPrices = { ...prices };
    newPrices[row][monthIdx] = newVal;
    
    // Auto-calculate future months based on current increaseRate
    for (let i = monthIdx + 1; i < 12; i++) {
      newPrices[row][i] = Math.round(newPrices[row][i-1] * (1 + increaseRate / 100));
    }
    
    setPrices(newPrices);
  };

  const cascadeAllRows = (rate: number) => {
    const newPrices = { ...prices };
    ROWS.forEach(row => {
      // We only cascade from current month forward
      for (let i = currentMonthIdx + 1; i < 12; i++) {
        newPrices[row][i] = Math.round(newPrices[row][i-1] * (1 + rate / 100));
      }
    });
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
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C8A951]/10 text-[#C8A951] border border-[#C8A951]/30 hover:bg-[#C8A951]/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-[#C8A951]/5">
              <RefreshCw size={16} /> <span className="hidden sm:inline">Archivar Año</span>
            </button>
            <button className="flex-1 sm:flex-none px-6 py-3 bg-[#1F6FEB] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#388BFD] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1F6FEB]/20">
              <Save size={16} /> <span className="hidden sm:inline">Guardar cambios</span><span className="sm:hidden">Guardar</span>
            </button>
          </div>
        </div>

        {/* Increase Rate Selector */}
        <div className="mb-8 p-5 bg-[#161B22] border border-[#30363D] rounded-3xl flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <TrendingUp size={80} />
          </div>
          <div className="flex items-center gap-4 relative z-10 shrink-0">
            <div className="p-3 bg-[#C8A951]/20 text-[#C8A951] rounded-2xl border border-[#C8A951]/20 shadow-inner">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-[#8B949E] uppercase tracking-[0.2em] mb-1">Aumento Mensual Proyectado</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={increaseRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setIncreaseRate(val);
                    cascadeAllRows(val);
                  }}
                  className="w-20 bg-[#0D1117] border border-[#C8A951]/30 rounded-xl px-3 py-2 text-center font-display font-black text-[#C8A951] outline-none focus:border-[#C8A951] transition-all"
                />
                <span className="text-xl font-display font-black text-[#C8A951]">%</span>
              </div>
            </div>
          </div>
          <div className="h-12 w-px bg-[#30363D] hidden md:block" />
          <div className="relative z-10 flex-1">
            <p className="text-sm text-[#E6EDF3] font-medium leading-tight mb-1">
              Solo el <strong className="text-[#C8A951]">mes vigente ({MONTHS[currentMonthIdx]})</strong> es editable. 
            </p>
            <p className="text-[11px] text-[#8B949E] leading-relaxe">
              Al modificar el precio actual, los meses futuros se recalculan automáticamente usando el <strong className="text-[#C8A951]">{increaseRate}%</strong> de aumento. Los meses pasados permanecen bloqueados.
            </p>
          </div>
        </div>

        {/* Month Selector - MOBILE ONLY */}
        <div className="lg:hidden flex items-center justify-between gap-2 mb-6 bg-[#161B22] p-2 rounded-2xl border border-[#30363D]">
           <button 
             onClick={() => setSelectedMonthIdx(prev => Math.max(0, prev - 1))}
             disabled={selectedMonthIdx === 0}
             className="p-3 bg-[#0D1117] border border-[#30363D] rounded-xl text-[#E6EDF3] disabled:opacity-10 active:scale-90 transition-all shadow-lg"
           >
             <ChevronLeft size={20} />
           </button>
           <div className="flex-1 text-center">
             <div className="text-[9px] font-black text-[#C8A951] uppercase tracking-[0.35em] mb-1">MES SELECCIONADO</div>
             <div className="text-2xl font-display font-black text-[#E6EDF3] tracking-widest flex items-center justify-center gap-2">
               {MONTHS[selectedMonthIdx]}
               {selectedMonthIdx === currentMonthIdx && <div className="w-2 h-2 rounded-full bg-[#C8A951] animate-pulse" />}
             </div>
           </div>
           <button 
             onClick={() => setSelectedMonthIdx(prev => Math.min(11, prev + 1))}
             disabled={selectedMonthIdx === 11}
             className="p-3 bg-[#0D1117] border border-[#30363D] rounded-xl text-[#E6EDF3] disabled:opacity-10 active:scale-90 transition-all shadow-lg"
           >
             <ChevronRight size={20} />
           </button>
        </div>

        {/* Desktop View Table */}
        <div className="hidden lg:block bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#1C2128]">
                  <th className="px-6 py-6 text-[10px] font-black text-[#8B949E] uppercase tracking-[0.2em] bg-[#1C2128] sticky left-0 z-20 w-[220px] border-b border-[#30363D]">RUBRO</th>
                  {MONTHS.map((m, idx) => (
                    <th 
                      key={m} 
                      className={`px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center min-w-[130px] border-b ${idx === currentMonthIdx ? 'text-[#C8A951] bg-[#C8A951]/5 border-x border-[#C8A951]/20' : 'text-[#8B949E] border-[#30363D]'}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{m}</span>
                        {idx === currentMonthIdx && (
                          <span className="text-[8px] px-2 py-0.5 bg-[#C8A951] text-[#0D1117] rounded-full tracking-normal">VIGENTE</span>
                        )}
                        {idx < currentMonthIdx && (
                          <span className="text-[7px] text-[#8B949E]/50 tracking-tighter italic">CERRADO</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]/40 text-sm">
                {ROWS.map(row => (
                  <tr key={row} className="group">
                    <td className="px-6 py-5 font-black text-[#E6EDF3] bg-[#161B22] sticky left-0 z-20 border-r border-[#30363D]/30 shadow-xl flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-tight">{row}</span>
                        {row === 'COCA' && <span className="text-[8px] text-[#388BFD] font-bold tracking-widest mt-0.5 group-hover:animate-pulse">A FAVOR DEL SALÓN</span>}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-all">
                        <Lock size={12} className={row === 'COCA' ? 'text-[#388BFD]' : 'text-[#8B949E]/40'} />
                      </div>
                    </td>
                    {prices[row].map((price, idx) => (
                      <td 
                        key={idx} 
                        className={`px-3 py-4 transition-all ${idx === currentMonthIdx ? 'bg-[#C8A951]/5 border-x border-[#C8A951]/10' : ''} ${idx < currentMonthIdx ? 'opacity-30 grayscale' : ''}`}
                      >
                        <div className="relative group/cell">
                          <input 
                            type="number" 
                            disabled={!isJefe || idx !== currentMonthIdx}
                            value={price}
                            onChange={(e) => handlePriceChange(row, idx, e.target.value)}
                            className={`w-full bg-[#0D1117] border rounded-xl px-3 py-2.5 text-center font-display font-black shadow-inner transition-all
                              ${idx === currentMonthIdx 
                                ? 'border-[#C8A951] text-[#C8A951] focus:ring-2 focus:ring-[#C8A951]/20' 
                                : 'border-[#30363D] text-[#E6EDF3]/80'}
                              ${(!isJefe || idx !== currentMonthIdx) ? 'cursor-not-allowed text-[11px]' : 'text-sm'}`}
                          />
                          {idx !== currentMonthIdx && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-all pointer-events-none">
                               <Lock size={10} className="text-[#8B949E]" />
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View - Cards */}
        <div className="lg:hidden space-y-4">
           {ROWS.map(row => (
             <div key={row} className={`bg-[#161B22] border rounded-3xl p-5 flex items-center justify-between gap-4 shadow-xl transition-all ${selectedMonthIdx === currentMonthIdx ? 'border-[#C8A951]/40' : 'border-[#30363D]'}`}>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-black text-[#8B949E] uppercase tracking-[0.2em] mb-1">Rubro</div>
                  <div className="text-sm font-black text-[#E6EDF3] truncate tracking-tight uppercase">{row}</div>
                  {row === 'COCA' && <span className="text-[8px] bg-[#388BFD]/20 text-[#388BFD] px-2 py-0.5 rounded-full font-black mt-2 inline-block">SALÓN</span>}
                </div>
                <div className="w-44 relative">
                  <div className="text-[9px] font-black uppercase tracking-widest mb-1.5 text-right flex items-center justify-end gap-1.5">
                    {selectedMonthIdx === currentMonthIdx ? (
                      <span className="text-[#C8A951] flex items-center gap-1">Vigente <div className="w-1.5 h-1.5 rounded-full bg-[#C8A951] animate-pulse" /></span>
                    ) : (
                      <span className="text-[#8B949E]">{selectedMonthIdx < currentMonthIdx ? 'Cerrado' : 'Proyectado'}</span>
                    )}
                  </div>
                  <div className="relative group">
                    <input 
                      type="number" 
                      disabled={!isJefe || selectedMonthIdx !== currentMonthIdx}
                      value={prices[row][selectedMonthIdx]}
                      onChange={(e) => handlePriceChange(row, selectedMonthIdx, e.target.value)}
                      className={`w-full bg-[#0D1117] border shadow-2xl rounded-2xl px-4 py-3.5 text-right font-display font-black outline-none transition-all
                        ${selectedMonthIdx === currentMonthIdx 
                          ? 'border-[#C8A951] text-[#C8A951] text-lg' 
                          : 'border-[#30363D] text-[#8B949E] text-base opacity-60'}`}
                    />
                    {selectedMonthIdx !== currentMonthIdx && (
                      <Lock size={14} className="absolute left-4 top-4 text-[#8B949E]/40" />
                    )}
                  </div>
                </div>
             </div>
           ))}
        </div>

        {/* Footer info */}
        <div className="mt-12 p-6 bg-[#1C2128]/50 border border-[#30363D] rounded-3xl flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-[#161B22] border border-[#30363D] rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#3FB950] shadow-glow" />
              <span className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest leading-none mt-0.5">Sistema de Auditoría Activo</span>
            </div>
            <p className="text-[10px] text-[#8B949E] uppercase tracking-[0.25em]">Actualizado por {user.name} • {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};
