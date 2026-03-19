import React, { useState } from "react";
import { ChevronLeft, Save, TrendingUp, Lock, RefreshCw, Users } from "lucide-react";
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

  const handlePriceChange = (row: string, monthIdx: number, val: string) => {
    if (!isJefe) return;
    const newVal = parseInt(val) || 0;
    const newPrices = { ...prices };
    newPrices[row][monthIdx] = newVal;

    // If changing JAN and it's JEFE, ask if they want to cascade? 
    // For now, let it be manual/cascade only on initial load or explicit button
    setPrices(newPrices);
  };

  const cascadeCalculation = (row: string) => {
    const newPrices = { ...prices };
    const baseVal = newPrices[row][0];
    for (let i = 1; i < 12; i++) {
      newPrices[row][i] = Math.round(newPrices[row][i-1] * 1.03);
    }
    setPrices(newPrices);
  };

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-1 transition-colors">
              <ChevronLeft size={20} /> Volver a Liquidaciones
            </button>
            <div className="h-6 w-px bg-[#30363D] hidden lg:block" />
            <div>
              <h1 className="text-2xl font-display font-bold text-[#E6EDF3] tracking-tight">Tarjeta Chuchi 💳</h1>
              <p className="text-[#8B949E] text-xs font-medium uppercase tracking-widest mt-1">Tabla de precios proyectados / Catering</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isJefe && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F85149]/10 text-[#F85149] border border-[#F85149]/30 rounded-lg text-[10px] font-black tracking-widest uppercase">
                <Lock size={12} /> Sólo lectura
              </div>
            )}
            <button className="px-5 py-2.5 bg-[#1F6FEB] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#388BFD] transition-all flex items-center gap-2">
              <Save size={16} /> Guardar cambios
            </button>
          </div>
        </div>

        {/* Legend / Info */}
        <div className="mb-8 p-4 bg-[#161B22] border border-[#30363D] rounded-2xl flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3FB950]/20 text-[#3FB950] rounded-xl"><TrendingUp size={20} /></div>
            <div>
              <h3 className="text-xs font-bold">Automatización de precios</h3>
              <p className="text-[10px] text-[#8B949E]">Mes siguiente = Mes anterior × 1.03 (+3% inflacionario)</p>
            </div>
          </div>
          <div className="h-10 w-px bg-[#30363D] hidden md:block" />
          <p className="text-[10px] text-[#8B949E] max-w-sm italic">
            * Al cargar el valor de Enero, puedes presionar el ícono de refresco para proyectar todo el año automáticamente.
          </p>
        </div>

        {/* Main Table */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl">
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
                          {idx > 0 && isJefe && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#3FB950] rounded-full opacity-30"></div>
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

        {/* Footer Notes */}
        <div className="mt-8 text-center">
            <p className="text-[10px] text-[#8B949E] uppercase tracking-[0.2em]">Última actualización: Hoy, 17:35 hs — por {user.name}</p>
        </div>
      </div>
    </div>
  );
};
