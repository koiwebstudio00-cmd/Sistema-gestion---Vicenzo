import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, BarChart3, Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, CreditCard, DollarSign, Edit2, FileText, Filter, Mail, MapPin, Package, Phone, Plus, Printer, Scale, Search, Tag, Trash2, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CATALOG_DATA, EVENTS_DATA, PACK_PREMIUM_ITEMS, USERS, formatCurrency, type EventStatus, type ServiceItem, type User } from "../../features/demo/demoShared";
import { Modal } from "../ui/Modal";


export const CatalogView = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);

  const categories = ['ALL', ...Array.from(new Set(CATALOG_DATA.map(item => item.category)))];

  const filteredCatalog = activeCategory === 'ALL'
    ? CATALOG_DATA
    : CATALOG_DATA.filter(item => item.category === activeCategory);

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4 lg:gap-0">
        <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Presupuesto de Servicios</h1>
        <button
          className="w-full lg:w-auto bg-[#1F6FEB] hover:bg-[#388BFD] text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Agregar servicio
        </button>
      </div>

      {/* Mobile Category Filter (Dropdown) */}
      <div className="lg:hidden mb-6 relative">
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="w-full bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-4 pr-10 py-3 appearance-none focus:outline-none focus:border-[#C8A951] font-medium"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'ALL' ? 'Todos los servicios' : cat}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-[#8B949E] pointer-events-none" />
      </div>

      {/* Desktop Category Filter (Buttons) */}
      <div className="hidden lg:flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat
              ? 'bg-[#C8A951] text-[#0D1117]'
              : 'bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#8B949E]'
              }`}
          >
            {cat === 'ALL' ? 'Todos' : cat}
          </button>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:flex bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden flex-1 flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-[#0D1117] z-10">
              <tr className="border-b border-[#30363D] text-[#8B949E] text-sm">
                <th className="p-4 font-medium">Servicio</th>
                <th className="p-4 font-medium">Categoría</th>
                <th className="p-4 font-medium text-right">Precio ARS</th>
                <th className="p-4 font-medium text-right">Precio USD</th>
                <th className="p-4 font-medium text-center">Moneda</th>
                <th className="p-4 font-medium">Vigencia</th>
                <th className="p-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {filteredCatalog.map(item => (
                <tr key={item.id} className="hover:bg-[#30363D]/20 transition-colors group">
                  <td className="p-4 font-medium text-[#E6EDF3]">{item.name}</td>
                  <td className="p-4 text-[#8B949E] text-xs uppercase tracking-wider">{item.category}</td>
                  <td className="p-4 text-right tabular-nums text-[#E6EDF3]">
                    {item.priceArs ? formatCurrency(item.priceArs) : '—'}
                  </td>
                  <td className="p-4 text-right tabular-nums text-[#E6EDF3]">
                    {item.priceUsd ? `u$s ${item.priceUsd}` : '—'}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${item.currency === 'USD' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
                      {item.currency}
                    </span>
                  </td>
                  <td className="p-4 text-[#8B949E] text-sm">{item.vigencia}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 text-[#8B949E] hover:text-[#C8A951] hover:bg-[#C8A951]/10 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#30363D] rounded transition-colors">
                        <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 pb-20">
        {filteredCatalog.map(item => (
          <div
            key={item.id}
            className="bg-[#161B22] border border-[#30363D] rounded-xl p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium text-[#E6EDF3] text-lg leading-tight pr-2">{item.name}</div>
              <button
                onClick={() => setEditingItem(item)}
                className="p-1.5 text-[#8B949E] hover:text-[#C8A951] hover:bg-[#C8A951]/10 rounded transition-colors shrink-0"
              >
                <Edit2 size={16} />
              </button>
            </div>

            <div className="mb-3">
              <span className="text-[#8B949E] text-xs font-bold uppercase tracking-wider bg-[#30363D]/50 px-2 py-1 rounded">
                {item.category}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <span className="block text-[#8B949E] text-xs mb-0.5">Precio ARS</span>
                <span className="text-[#E6EDF3] font-mono font-medium">
                  {item.priceArs ? formatCurrency(item.priceArs) : '—'}
                </span>
              </div>
              <div>
                <span className="block text-[#8B949E] text-xs mb-0.5">Precio USD</span>
                <span className="text-[#E6EDF3] font-mono font-medium">
                  {item.priceUsd ? `u$s ${item.priceUsd}` : '—'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#30363D]">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded ${item.currency === 'USD' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
                  {item.currency}
                </span>
              </div>
              <span className="text-[#8B949E] text-xs">Vigencia: {item.vigencia}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Editar Precio"
        footer={
          <>
            <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-[#E6EDF3] hover:bg-[#30363D] rounded-lg font-medium transition-colors">Cancelar</button>
            <button onClick={() => setEditingItem(null)} className="px-4 py-2 bg-[#C8A951] text-[#0D1117] rounded-lg font-bold hover:bg-[#D4B96A] transition-colors">Guardar Cambios</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Servicio</label>
            <input type="text" value={editingItem?.name || ''} disabled className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#8B949E] cursor-not-allowed" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Nuevo Precio</label>
              <input type="number" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Moneda</label>
              <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none">
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Vigencia desde</label>
            <input type="date" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" />
          </div>
        </div>
      </Modal>
    </div>
  );
};
