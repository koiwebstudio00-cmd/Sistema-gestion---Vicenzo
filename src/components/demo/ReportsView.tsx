import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, BarChart3, Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, CreditCard, DollarSign, Edit2, FileText, Filter, Mail, MapPin, Package, Phone, Plus, Printer, Scale, Search, Tag, Trash2, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CATALOG_DATA, EVENTS_DATA, PACK_PREMIUM_ITEMS, USERS, formatCurrency, type EventStatus, type ServiceItem, type User } from "../../features/demo/demoShared";
import { Modal } from "../ui/Modal";


export const ReportsView = () => {
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

  const topEvents = [
    { name: 'Casamiento Moreno-Giuliani', total: 22800000, collected: 22800000, percent: 100 },
    { name: 'Casamiento Blanco-Fernández', total: 21400000, collected: 12500000, percent: 58 },
    { name: 'Cumpleaños Empresarial TechCorp', total: 19800000, collected: 13600000, percent: 69 },
    { name: 'Quinceañera Valentina Suárez', total: 18200000, collected: 13400000, percent: 74 },
  ];

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col overflow-y-auto">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 lg:gap-0">
        <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Reportes — Marzo 2025</h1>
        <div className="relative w-full lg:w-auto">
          <select className="w-full lg:w-auto bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-4 pr-10 py-2 appearance-none focus:outline-none focus:border-[#C8A951]">
            <option>Este mes</option>
            <option>Último trimestre</option>
            <option>Este año</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8B949E] pointer-events-none" />
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
          <div className="text-[#8B949E] text-sm font-medium mb-2">Saldo pendiente</div>
          <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">$24.4M</div>
          <div className="text-[#D29922] text-xs font-medium flex items-center gap-1">
            ⚠️ 3 eventos
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <div className="text-[#8B949E] text-sm font-medium mb-2">Pagos del mes</div>
          <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">5 pagos</div>
          <div className="text-[#8B949E] text-xs font-medium flex items-center gap-1">
            en Marzo
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
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
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
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
            <div className="w-1/2 space-y-4">
              {dataPie.map((entry, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <div>
                    <div className="text-[#E6EDF3] font-medium">{entry.name}</div>
                    <div className="text-[#8B949E] text-sm">{entry.value} eventos</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Services */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
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
                  <div className="flex justify-between text-sm mb-1">
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
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
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
                  <div className="text-[#8B949E] text-xs">{item.count} cubiertos vendidos</div>
                </div>
                <div className="text-[#E6EDF3] font-bold text-lg">
                  {Math.round((item.count / 1130) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonality - Sales */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#30363D]">
            <h3 className="text-[#E6EDF3] font-display font-semibold flex items-center gap-2">
              <BarChart3 size={18} className="text-[#3FB950]" /> Meses con mayor facturación
            </h3>
          </div>
          <div className="p-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Dic', value: 15800000 },
                  { name: 'Mar', value: 13400000 },
                  { name: 'Nov', value: 11400000 },
                  { name: 'Feb', value: 11350000 },
                  { name: 'Ene', value: 9100000 },
                ]} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#8B949E" tick={{ fill: '#E6EDF3' }} width={30} axisLine={false} tickLine={false} />
                  <RechartsTooltip
                    cursor={{ fill: '#30363D', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#0D1117', borderColor: '#30363D', color: '#E6EDF3' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="value" fill="#3FB950" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Seasonality - Events Count */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#30363D]">
            <h3 className="text-[#E6EDF3] font-display font-semibold flex items-center gap-2">
              <Calendar size={18} className="text-[#F85149]" /> Meses con más eventos
            </h3>
          </div>
          <div className="p-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Diciembre', value: 12 },
                  { name: 'Noviembre', value: 10 },
                  { name: 'Marzo', value: 8 },
                  { name: 'Febrero', value: 7 },
                  { name: 'Enero', value: 5 },
                ]} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#8B949E" tick={{ fill: '#E6EDF3' }} width={70} axisLine={false} tickLine={false} />
                  <RechartsTooltip
                    cursor={{ fill: '#30363D', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#0D1117', borderColor: '#30363D', color: '#E6EDF3' }}
                  />
                  <Bar dataKey="value" fill="#F85149" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* New Chart - Seasonality - Reservations Count */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#30363D]">
            <h3 className="text-[#E6EDF3] font-display font-semibold flex items-center gap-2">
              <BarChart3 size={18} className="text-[#E8570A]" /> Meses con más reservas
            </h3>
          </div>
          <div className="p-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataReservations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                  <XAxis dataKey="name" stroke="#8B949E" tick={{ fill: '#E6EDF3' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0D1117', borderColor: '#30363D', color: '#E6EDF3' }}
                    cursor={{ fill: '#30363D', opacity: 0.4 }}
                  />
                  <Bar dataKey="value" fill="#E8570A" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

