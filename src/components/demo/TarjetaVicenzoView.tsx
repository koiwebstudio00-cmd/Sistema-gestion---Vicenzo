import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Save, TrendingUp, Lock, RefreshCw } from "lucide-react";
import { type User } from "../../features/demo/demoShared";

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const ROWS = ['MENU 1', 'MENU 2 POLLO', 'MENU 2 LOMO', 'BUFFET 1', 'BUFFET 2', 'NIÑOS', 'MOZOS', 'COCA'];

export const TarjetaVicenzoView = ({ user, onBack }: { user: User, onBack: () => void }) => {
  const isJefe = user.role === 'JEFE';
  const currentMonthIdx = new Date().getMonth();

  const initialBase: Record<string, number> = {
    'MENU 1': 59000,
    'MENU 2 POLLO': 75000,
    'MENU 2 LOMO': 81500,
    'BUFFET 1': 11000,
    'BUFFET 2': 15000,
    'NIÑOS': 30000,
    'MOZOS': 57000,
    'COCA': 18000
  };

  const [increaseRate, setIncreaseRate] = useState(3);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(currentMonthIdx);
  const [prices, setPrices] = useState<Record<string, number[]>>(() => {
    const grid: Record<string, number[]> = {};
    ROWS.forEach(row => {
      grid[row] = Array(12).fill(0);
      grid[row][0] = initialBase[row] || 0;
      for (let i = 1; i < 12; i++) {
        grid[row][i] = Math.round(grid[row][i - 1] * 1.03);
      }
    });
    return grid;
  });

  const handlePriceChange = (row: string, monthIdx: number, val: string) => {
    if (!isJefe || monthIdx !== currentMonthIdx) return;
    const newVal = parseInt(val) || 0;
    const newPrices = { ...prices };
    newPrices[row][monthIdx] = newVal;
    for (let i = monthIdx + 1; i < 12; i++) {
      newPrices[row][i] = Math.round(newPrices[row][i - 1] * (1 + increaseRate / 100));
    }
    setPrices(newPrices);
  };

  const cascadeAllRows = (rate: number) => {
    const newPrices = { ...prices };
    ROWS.forEach(row => {
      for (let i = currentMonthIdx + 1; i < 12; i++) {
        newPrices[row][i] = Math.round(newPrices[row][i - 1] * (1 + rate / 100));
      }
    });
    setPrices(newPrices);
  };

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3] pb-32 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button onClick={onBack} className="h-10 px-4 bg-[#161B22] border border-[#30363D] rounded-xl text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-2 transition-all active:scale-95">
              <ChevronLeft size={18} /> <span className="text-xs font-bold">Volver</span>
            </button>
            <div className="h-6 w-px bg-[#30363D] hidden lg:block" />
            <div>
              <h1 className="text-2xl font-display font-black text-[#E6EDF3] tracking-tight">Tarjeta Vicenzo 💳</h1>
              <p className="text-[#8B949E] text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] mt-1">Tarifa propia del salón sobre base Chuchi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isJefe && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F85149]/10 text-[#F85149] border border-[#F85149]/30 rounded-lg text-[10px] font-black tracking-widest uppercase">
                <Lock size={12} /> Sólo lectura
              </div>
            )}
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/30 hover:bg-[#58A6FF]/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-[#58A6FF]/5">
              <RefreshCw size={16} /> <span className="hidden sm:inline">Archivar Año</span>
            </button>
            <button className="flex-1 sm:flex-none px-6 py-3 bg-[#58A6FF] text-[#0D1117] rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#58A6FF]/20">
              <Save size={16} /> <span className="hidden sm:inline">Guardar cambios</span><span className="sm:hidden">Guardar</span>
            </button>
          </div>
        </div>

        <div className="mb-8 p-5 bg-[#161B22] border border-[#30363D] rounded-3xl flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <TrendingUp size={80} />
          </div>
          <div className="flex items-center gap-4 relative z-10 shrink-0">
            <div className="p-3 bg-[#58A6FF]/20 text-[#58A6FF] rounded-2xl border border-[#58A6FF]/20 shadow-inner">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-[#8B949E] uppercase tracking-[0.2em] mb-1">Margen Mensual Proyectado</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={increaseRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setIncreaseRate(val);
                    cascadeAllRows(val);
                  }}
                  className="w-20 bg-[#0D1117] border border-[#58A6FF]/30 rounded-xl px-3 py-2 text-center font-display font-black text-[#58A6FF] outline-none focus:border-[#58A6FF] transition-all"
                />
                <span className="text-xl font-display font-black text-[#58A6FF]">%</span>
              </div>
            </div>
          </div>
          <div className="h-12 w-px bg-[#30363D] hidden md:block" />
          <div className="relative z-10 flex-1">
            <p className="text-sm text-[#E6EDF3] font-medium leading-tight mb-1">
              Usa la misma lógica que Tarjeta Chuchi, con valores un poco más altos para reflejar el margen del salón.
            </p>
            <p className="text-[11px] text-[#8B949E] leading-relaxed">
              Solo el mes vigente ({MONTHS[currentMonthIdx]}) es editable y proyecta el resto automáticamente.
            </p>
          </div>
        </div>

        <div className="lg:hidden flex items-center justify-between gap-2 mb-6 bg-[#161B22] p-2 rounded-2xl border border-[#30363D]">
          <button onClick={() => setSelectedMonthIdx(prev => Math.max(0, prev - 1))} disabled={selectedMonthIdx === 0} className="p-3 bg-[#0D1117] border border-[#30363D] rounded-xl text-[#E6EDF3] disabled:opacity-10">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 text-center">
            <div className="text-[9px] font-black text-[#58A6FF] uppercase tracking-[0.35em] mb-1">MES SELECCIONADO</div>
            <div className="text-2xl font-display font-black text-[#E6EDF3] tracking-widest">{MONTHS[selectedMonthIdx]}</div>
          </div>
          <button onClick={() => setSelectedMonthIdx(prev => Math.min(11, prev + 1))} disabled={selectedMonthIdx === 11} className="p-3 bg-[#0D1117] border border-[#30363D] rounded-xl text-[#E6EDF3] disabled:opacity-10">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="hidden lg:block bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#1C2128]">
                  <th className="px-6 py-6 text-[10px] font-black text-[#8B949E] uppercase tracking-[0.2em] bg-[#1C2128] sticky left-0 z-20 w-[220px] border-b border-[#30363D]">RUBRO</th>
                  {MONTHS.map((m, idx) => (
                    <th key={m} className={`px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center min-w-[130px] border-b ${idx === currentMonthIdx ? 'text-[#58A6FF] bg-[#58A6FF]/5 border-x border-[#58A6FF]/20' : 'text-[#8B949E] border-[#30363D]'}`}>
                      <div className="flex flex-col items-center gap-1">
                        <span>{m}</span>
                        {idx === currentMonthIdx && <span className="text-[8px] px-2 py-0.5 bg-[#58A6FF] text-[#0D1117] rounded-full tracking-normal">VIGENTE</span>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]/40 text-sm">
                {ROWS.map(row => (
                  <tr key={row}>
                    <td className="px-6 py-5 font-black text-[#E6EDF3] bg-[#161B22] sticky left-0 z-20 border-r border-[#30363D]/30 shadow-xl">
                      <span className="text-[11px] uppercase tracking-tight">{row}</span>
                    </td>
                    {prices[row].map((price, idx) => (
                      <td key={idx} className={`px-3 py-4 transition-all ${idx === currentMonthIdx ? 'bg-[#58A6FF]/5 border-x border-[#58A6FF]/10' : ''}`}>
                        <input
                          type="number"
                          disabled={!isJefe || idx !== currentMonthIdx}
                          value={price}
                          onChange={(e) => handlePriceChange(row, idx, e.target.value)}
                          className={`w-full bg-[#0D1117] border rounded-xl px-3 py-2.5 text-center font-display font-black ${idx === currentMonthIdx ? 'border-[#58A6FF] text-[#58A6FF]' : 'border-[#30363D] text-[#E6EDF3]/80'} ${(!isJefe || idx !== currentMonthIdx) ? 'cursor-not-allowed text-[11px]' : 'text-sm'}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:hidden space-y-4">
          {ROWS.map(row => (
            <div key={row} className={`bg-[#161B22] border rounded-3xl p-5 flex items-center justify-between gap-4 shadow-xl ${selectedMonthIdx === currentMonthIdx ? 'border-[#58A6FF]/40' : 'border-[#30363D]'}`}>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-black text-[#8B949E] uppercase tracking-[0.2em] mb-1">Rubro</div>
                <div className="text-sm font-black text-[#E6EDF3] truncate tracking-tight uppercase">{row}</div>
              </div>
              <div className="w-44 relative">
                <input
                  type="number"
                  disabled={!isJefe || selectedMonthIdx !== currentMonthIdx}
                  value={prices[row][selectedMonthIdx]}
                  onChange={(e) => handlePriceChange(row, selectedMonthIdx, e.target.value)}
                  className={`w-full bg-[#0D1117] border rounded-2xl px-4 py-3.5 text-right font-display font-black outline-none ${selectedMonthIdx === currentMonthIdx ? 'border-[#58A6FF] text-[#58A6FF] text-lg' : 'border-[#30363D] text-[#8B949E] text-base opacity-60'}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
