import React, { useMemo, useState } from "react";
import { ChevronLeft, Save, Calculator, CheckCircle, Info } from "lucide-react";
import { formatCurrency, type User } from "../../features/demo/demoShared";

const PLANILLA_LIQUIDACION_MOCK: Record<string, {
  menuAdultos: 'Menú 1' | 'Menú 2' | 'Menú Pollo' | 'Buffet' | 'Menú Jóvenes';
  cantAdultos: number;
  cantNinos: number;
  valorCoca: number;
  cantMozosAdultos: number;
  cantMozosNinos: number;
  valorMozo: number;
  valorMenuNinos: number;
}> = {
  '1': { menuAdultos: 'Menú 1', cantAdultos: 180, cantNinos: 22, valorCoca: 4500, cantMozosAdultos: 12, cantMozosNinos: 2, valorMozo: 52000, valorMenuNinos: 0 },
  '2': { menuAdultos: 'Menú Jóvenes', cantAdultos: 155, cantNinos: 12, valorCoca: 4200, cantMozosAdultos: 8, cantMozosNinos: 1, valorMozo: 52000, valorMenuNinos: 0 },
  '5': { menuAdultos: 'Menú 2', cantAdultos: 200, cantNinos: 18, valorCoca: 4700, cantMozosAdultos: 13, cantMozosNinos: 2, valorMozo: 52000, valorMenuNinos: 0 },
};

const MENU_PRICES: Record<string, number> = {
  'Menú 1': 75000,
  'Menú 2': 92000,
  'Menú Pollo': 68000,
  'Buffet': 85000,
  'Menú Jóvenes': 53000,
};

export const LiquidacionEventoView = ({ event, user, onBack }: { event: any, user: User, onBack: () => void }) => {
  const autoData = PLANILLA_LIQUIDACION_MOCK[event?.id || '2'] || PLANILLA_LIQUIDACION_MOCK['2'];
  const commissionRate = useMemo(() => {
    const cat = event.category?.toUpperCase() || '';
    return cat.includes('CASAMIENTO') ? 15 : 10;
  }, [event]);

  const [editableData, setEditableData] = useState({
    valorCoca: autoData.valorCoca,
    cantMozosAdultos: autoData.cantMozosAdultos,
    cantMozosNinos: autoData.cantMozosNinos,
  });

  const calculations = useMemo(() => {
    const valorTarjetaAdultos = MENU_PRICES[autoData.menuAdultos];
    const tarjetasAdultos = autoData.cantAdultos * valorTarjetaAdultos;
    const tarjetasNinos = autoData.cantNinos * autoData.valorMenuNinos;
    const totalTarjetas = tarjetasAdultos + tarjetasNinos;
    const totalCoca = (autoData.cantAdultos + autoData.cantNinos) * editableData.valorCoca;
    const totalMozos =
      (editableData.cantMozosAdultos * autoData.valorMozo) +
      (editableData.cantMozosNinos * autoData.valorMozo);
    const comision = totalTarjetas * (commissionRate / 100);
    const totalFinal = totalTarjetas + totalMozos - comision - totalCoca;

    return {
      valorTarjetaAdultos,
      tarjetasAdultos,
      tarjetasNinos,
      totalTarjetas,
      totalCoca,
      totalMozos,
      comision,
      totalFinal,
    };
  }, [autoData, editableData, commissionRate]);

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex flex-col gap-4">
            <button onClick={onBack} className="h-10 px-4 w-fit bg-[#161B22] border border-[#30363D] rounded-xl text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-2 transition-all active:scale-95">
              <ChevronLeft size={18} /> <span className="text-xs font-bold">Volver</span>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-[#E6EDF3] tracking-tighter">Liquidación por Evento</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/30 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest leading-none">
                  {event?.category || 'S/D'}
                </span>
                <span className="text-[#8B949E] text-xs font-medium uppercase tracking-widest">{event?.date || 'S/D'}</span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-[#161B22] border border-[#30363D] px-2 py-1 rounded-lg text-[#3FB950]">
                  Auto desde planilla
                </span>
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

        <div className="mb-6 bg-[#161B22] border border-[#30363D] rounded-3xl p-6">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-[#C8A951] mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#E6EDF3]">Los datos de menú y cantidades salen predefinidos desde la planilla mock del evento.</p>
              <p className="text-xs text-[#8B949E] mt-1">Solo quedan editables cantidad de coca y cantidad de mozos, tal como pediste.</p>
            </div>
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl mb-10">
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
                  <td className="px-6 py-6 font-bold text-[#E6EDF3]">
                    <div className="flex flex-col gap-2">
                      <span>ADULTOS</span>
                      <span className="bg-[#0D1117] border border-[#30363D] text-[#8B949E] text-[10px] font-bold uppercase px-3 py-2 rounded-lg w-fit">
                        {autoData.menuAdultos}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-center font-bold text-[#3FB950]">{autoData.cantAdultos}</td>
                  <td className="px-4 py-6 text-center text-[#8B949E] font-medium">{formatCurrency(calculations.valorTarjetaAdultos)}</td>
                  <td className="px-4 py-6">
                    <input
                      type="number"
                      value={editableData.valorCoca}
                      onChange={(e) => setEditableData({ ...editableData, valorCoca: parseInt(e.target.value) || 0 })}
                      className="w-24 mx-auto bg-[#0D1117] border border-[#30363D] rounded-lg px-2 py-1.5 text-center font-bold text-[#E6EDF3] focus:border-[#3FB950] outline-none block"
                    />
                  </td>
                  <td className="px-4 py-6 text-center text-[#8B949E] font-medium">{formatCurrency(autoData.valorMozo)}</td>
                  <td className="px-4 py-6">
                    <input
                      type="number"
                      value={editableData.cantMozosAdultos}
                      onChange={(e) => setEditableData({ ...editableData, cantMozosAdultos: parseInt(e.target.value) || 0 })}
                      className="w-16 mx-auto bg-[#0D1117] border border-[#30363D] rounded-lg px-2 py-1.5 text-center font-bold text-[#E6EDF3] focus:border-[#3FB950] outline-none block"
                    />
                  </td>
                  <td className="px-6 py-6 text-right font-black text-[#E6EDF3]">{formatCurrency(calculations.tarjetasAdultos)}</td>
                </tr>
                <tr className="hover:bg-[#0D1117]/20 transition-colors">
                  <td className="px-6 py-6 font-bold text-[#E6EDF3]">NIÑOS</td>
                  <td className="px-4 py-6 text-center font-bold text-[#3FB950]">{autoData.cantNinos}</td>
                  <td className="px-4 py-6 text-center text-[#8B949E] font-medium">{formatCurrency(autoData.valorMenuNinos)}</td>
                  <td className="px-4 py-6 text-center text-[#8B949E] font-medium">{formatCurrency(editableData.valorCoca)}</td>
                  <td className="px-4 py-6 text-center text-[#8B949E] font-medium">{formatCurrency(autoData.valorMozo)}</td>
                  <td className="px-4 py-6">
                    <input
                      type="number"
                      value={editableData.cantMozosNinos}
                      onChange={(e) => setEditableData({ ...editableData, cantMozosNinos: parseInt(e.target.value) || 0 })}
                      className="w-16 mx-auto bg-[#0D1117] border border-[#30363D] rounded-lg px-2 py-1.5 text-center font-bold text-[#E6EDF3] focus:border-[#3FB950] outline-none block"
                    />
                  </td>
                  <td className="px-6 py-6 text-right font-black text-[#E6EDF3]">{formatCurrency(calculations.tarjetasNinos)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="p-8 bg-[#161B22] border border-[#30363D] rounded-3xl h-full shadow-lg">
            <h3 className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest mb-6 flex items-center gap-2 text-[#C8A951]">
              <Info size={16} /> Desglose automático
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-[#3FB950]/5 border border-[#3FB950]/20 rounded-2xl">
                <h4 className="text-[9px] font-black text-[#3FB950] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3FB950]" /> A FAVOR DEL SALÓN
                </h4>
                <p className="text-xs text-[#E6EDF3]/80 leading-relaxed font-medium">
                  Comisión del {commissionRate}% y consumo de coca.
                </p>
              </div>
              <div className="p-4 bg-[#E6EDF3]/5 border border-[#30363D] rounded-2xl">
                <h4 className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8B949E]" /> EN CONTRA DEL SALÓN
                </h4>
                <p className="text-xs text-[#E6EDF3]/80 leading-relaxed font-medium">
                  Tarjetas netas al catering y costo de mozos.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1C2128] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 space-y-5">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-[#8B949E]">Tarjetas</span>
                <span className="text-[#E6EDF3] font-black">{formatCurrency(calculations.totalTarjetas)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black">
                <span className="text-[#3FB950]">Comisión salón ({commissionRate}%)</span>
                <span className="text-[#3FB950]">{formatCurrency(calculations.comision)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black">
                <span className="text-[#3FB950]">Coca</span>
                <span className="text-[#3FB950]">{formatCurrency(calculations.totalCoca)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium pt-2 border-t border-[#30363D]/30">
                <span className="text-[#8B949E]">Mozos</span>
                <span className="text-[#E6EDF3] font-black">{formatCurrency(calculations.totalMozos)}</span>
              </div>
              <div className="h-[2px] bg-[#30363D] my-4" />
              <div className="flex justify-between items-end pt-2">
                <div>
                  <h4 className="text-[10px] font-black text-[#C8A951] uppercase tracking-[0.2em] mb-1">Total a Liquidar</h4>
                  <p className="text-[9px] text-[#8B949E] font-bold tracking-tight uppercase">Calculado desde la planilla mock</p>
                </div>
                <div className={`${calculations.totalFinal >= 0 ? 'text-[#3FB950]' : 'text-[#8B949E]'} text-4xl font-display font-black tracking-tighter`}>
                  {formatCurrency(calculations.totalFinal)}
                </div>
              </div>
            </div>
            <div className="bg-[#C8A951]/10 border-t border-[#C8A951]/20 px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[#C8A951] font-black text-[9px] uppercase tracking-widest leading-none">
                <CheckCircle size={14} /> Liquidación automatizada — Responsable: {event.performedBy || user.name}
              </div>
              <div className="text-[8px] text-[#8B949E] font-bold tracking-[0.2em] space-y-1 text-left sm:text-right">
                <p>ID EVENTO: {event.id}</p>
                <p className="text-[#C8A951]">FECHA REGISTRO: {event.performedAt || new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
