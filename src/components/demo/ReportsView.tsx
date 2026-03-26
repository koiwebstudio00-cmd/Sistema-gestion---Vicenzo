import React, { useMemo } from "react";
import { AlertTriangle, BarChart3, Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, CreditCard, DollarSign, Edit2, FileText, Filter, Mail, MapPin, Package, Phone, Plus, Printer, Scale, Search, Tag, Trash2, Users, TrendingUp, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CATALOG_DATA, EVENTS_DATA, PACK_PREMIUM_ITEMS, USERS, formatCurrency, type EventStatus, type ServiceItem, type User } from "../../features/demo/demoShared";


export const ReportsView = () => {
  const [budgetsMili, setBudgetsMili] = React.useState(12);
  const [budgetsJulia, setBudgetsJulia] = React.useState(18);

  const dataIncome = [
    { name: 'Oct', value: 8200000 },
    { name: 'Nov', value: 11400000 },
    { name: 'Dic', value: 15800000 },
    { name: 'Ene', value: 9100000 },
    { name: 'Feb', value: 11350000 },
    { name: 'Mar', value: 13400000, active: true },
  ];

  const dataReservations = [
    { name: 'Oct', value: 2 },
    { name: 'Nov', value: 4 },
    { name: 'Dic', value: 8 },
    { name: 'Ene', value: 3 },
    { name: 'Feb', value: 5 },
    { name: 'Mar', value: 6 },
  ];

  const dataPie = [
    { name: '15 años', value: 3, color: '#E91E8C' },
    { name: 'Casamiento', value: 3, color: '#1F6FEB' },
    { name: 'Cumpleaños', value: 2, color: '#C8A951' },
    { name: 'Corporativo', value: 1, color: '#6B7280' },
    { name: 'Egresado', value: 1, color: '#8B5CF6' },
    { name: 'Otro', value: 1, color: '#22C55E' },
  ];

  const estimatedCollection = useMemo(() => {
    // Estimado base: 4 fijos (Alquiler 2M, Técnica 1.15M, IVA 200k, Gen 500k) + 150 menús (53k c/u) + 10 mozos (52k c/u)
    const baseEstimate = 2000000 + 1150000 + 200000 + 500000 + (150 * 53000) + (10 * 52000); // $12,320,000 aprox
    
    return EVENTS_DATA.slice(0, 5).map(ev => {
      // Mocking a logical percentage for the demo
      const percent = ev.status === 'CONFIRMADO' ? 85 : ev.status === 'SENA_EN_PROCESO' ? 42 : 15;
      return {
        id: ev.id,
        name: ev.title,
        percent,
        total: baseEstimate,
        collected: baseEstimate * (percent / 100)
      };
    });
  }, []);

  const totalAnnualEstimate = 145000000;
  const totalAnnualCollected = 84100000;
  const annualPercent = Math.round((totalAnnualCollected / totalAnnualEstimate) * 100);

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col overflow-y-auto bg-[#0D1117]">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 lg:gap-0">
        <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Reportes — Marzo 2026</h1>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <select className="w-full bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-4 pr-10 py-2 appearance-none focus:outline-none focus:border-[#C8A951]">
              <option>Este mes</option>
              <option>Último trimestre</option>
              <option>Este año</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8B949E] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <div className="text-[#8B949E] text-sm font-medium mb-2">Eventos este mes</div>
          <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">8</div>
          <div className="text-[#3FB950] text-xs font-medium flex items-center gap-1">
            ▲ 2 vs mes ant.
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <div className="text-[#8B949E] text-sm font-medium mb-2">Ingresos cobrados</div>
          <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">$13.4M</div>
          <div className="text-[#3FB950] text-xs font-medium flex items-center gap-1">
            ▲ +18% vs feb
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <div className="text-[#8B949E] text-sm font-medium mb-2">Averiguaciones confirmadas</div>
          <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">9</div>
          <div className="text-[#3FB950] text-xs font-medium flex items-center gap-1">
            ▲ 3 en la última semana
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <div className="text-[#8B949E] text-sm font-medium mb-2">Presupuestos del Mes</div>
          <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">{budgetsMili + budgetsJulia}</div>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-[#30363D]">
            <span className="text-[#C8A951] font-bold">Julia: {budgetsJulia}</span>
            <span className="text-[#1F6FEB] font-bold">Mili: {budgetsMili}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-xl">
          <h3 className="text-[#E6EDF3] font-display font-semibold mb-6">Ingresos por mes</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataIncome}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                <XAxis dataKey="name" stroke="#8B949E" tick={{ fill: '#8B949E' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#8B949E" tick={{ fill: '#8B949E' }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000000}M`} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0D1117', borderColor: '#30363D', color: '#E6EDF3' }}
                  itemStyle={{ color: '#E6EDF3' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {dataIncome.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.active ? '#C8A951' : '#1F6FEB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-xl">
          <h3 className="text-[#E6EDF3] font-display font-semibold mb-6">Distribución por categoría</h3>
          <div className="flex flex-col sm:flex-row items-center">
            <div className="h-64 w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0D1117', borderColor: '#30363D', color: '#E6EDF3' }}
                    itemStyle={{ color: '#E6EDF3' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 space-y-4">
              {dataPie.map((entry, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <div>
                    <div className="text-[#E6EDF3] font-medium">{entry.name}</div>
                    <div className="text-[#8B949E] text-xs">{entry.value} eventos</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Estimado de Cobro por Evento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-[#30363D] flex items-center justify-between">
            <h3 className="text-[#E6EDF3] font-display font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <Target size={18} className="text-[#C8A951]" /> Estimado de cobro por evento
            </h3>
            <span className="text-[10px] text-[#8B949E] font-bold uppercase tracking-tighter">Métricas de Proyección</span>
          </div>
          <div className="p-6 space-y-6">
            {estimatedCollection.map((ev) => (
              <div key={ev.id} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="text-xs font-black text-[#E6EDF3] uppercase tracking-tight truncate max-w-[200px] sm:max-w-none">{ev.name}</div>
                  <div className={`text-[11px] font-black ${ev.percent > 80 ? 'text-[#3FB950]' : 'text-[#C8A951]'}`}>{ev.percent}% cobrado</div>
                </div>
                <div className="relative h-3 bg-[#0D1117] rounded-full overflow-hidden border border-[#30363D]">
                  <div 
                    className={`h-full transition-all duration-1000 ${ev.percent > 80 ? 'bg-[#3FB950]' : ev.percent > 40 ? 'bg-[#C8A951]' : 'bg-[#F85149]'}`} 
                    style={{ width: `${ev.percent}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[9px] text-[#8B949E] font-bold uppercase tracking-widest">
                  <span>Cobrado: {formatCurrency(ev.collected)}</span>
                  <span>Estimado: {formatCurrency(ev.total)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-[#1C2128]/50 border-t border-[#30363D]">
            <p className="text-[9px] text-[#8B949E] italic leading-relaxed">
              * El estimado se calcula en base a los 4 servicios obligatorios (Alquiler, Técnica, IVA y Electrógeno) más un mínimo de 150 menús y 10 mozos.
            </p>
          </div>
        </div>

        <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none rotate-12">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-[#8B949E] text-[10px] font-black uppercase tracking-[0.2em] mb-8">Resumen Anual Proyectado</h3>
            
            <div className="space-y-8">
              <div>
                <div className="text-[#8B949E] text-[10px] font-black uppercase tracking-widest mb-1">Total estimado del año</div>
                <div className="text-3xl font-display font-black text-[#E6EDF3] tracking-tight">{formatCurrency(totalAnnualEstimate)}</div>
              </div>
              
              <div>
                <div className="text-[#3FB950] text-[10px] font-black uppercase tracking-widest mb-1 flex items-center justify-between">
                  Cobrado hasta hoy <span>{annualPercent}%</span>
                </div>
                <div className="text-3xl font-display font-black text-[#3FB950] tracking-tight">{formatCurrency(totalAnnualCollected)}</div>
                <div className="w-full h-1.5 bg-[#0D1117] rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-[#3FB950]" style={{ width: `${annualPercent}%` }} />
                </div>
              </div>

              <div className="pt-6 border-t border-[#30363D]">
                <div className="text-[#F85149] text-[10px] font-black uppercase tracking-widest mb-1">Por cobrar estimado</div>
                <div className="text-2xl font-display font-black text-[#F85149] tracking-tight">{formatCurrency(totalAnnualEstimate - totalAnnualCollected)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {/* Top Services */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-[#30363D]">
            <h3 className="text-[#E6EDF3] font-display font-semibold flex items-center gap-2">
              <Package size={18} className="text-[#C8A951]" /> Servicios más contratados
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { name: 'Pack Luces Premium', count: 12, percent: 85 },
                { name: 'Cabina Fotográfica', count: 10, percent: 71 },
                { name: 'Fuegos Artificiales', count: 8, percent: 57 },
                { name: 'Barra de Tragos', count: 7, percent: 50 },
                { name: 'Robot LED', count: 5, percent: 35 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#E6EDF3]">{item.name}</span>
                    <span className="text-[#8B949E]">{item.count} eventos ({item.percent}%)</span>
                  </div>
                  <div className="h-2 bg-[#0D1117] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C8A951]" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Menus */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-[#30363D]">
            <h3 className="text-[#E6EDF3] font-display font-semibold flex items-center gap-2">
              <FileText size={18} className="text-[#1F6FEB]" /> Menús más vendidos
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {[
              { name: 'Menú Jóvenes 15 años', count: 450, color: '#1F6FEB' },
              { name: 'Menú 2 Gourmet — Lomo', count: 320, color: '#3FB950' },
              { name: 'Menú 1 Adultos', count: 210, color: '#D29922' },
              { name: 'Buffet Premium', count: 150, color: '#F85149' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#0D1117]" style={{ backgroundColor: item.color }}>
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-[#E6EDF3] font-medium">{item.name}</div>
                  <div className="text-[#8B949E] text-xs uppercase tracking-tighter">{item.count} cubiertos</div>
                </div>
                <div className="text-[#E6EDF3] font-black text-lg">
                  {Math.round((item.count / 1130) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
