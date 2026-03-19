import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, BarChart3, Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, CreditCard, DollarSign, Edit2, FileText, Filter, Mail, MapPin, Package, Phone, Plus, Printer, Scale, Search, Tag, Trash2, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CATALOG_DATA, EVENTS_DATA, PACK_PREMIUM_ITEMS, USERS, formatCurrency, type EventStatus, type ServiceItem, type User } from "../../features/demo/demoShared";
import { Modal } from "../ui/Modal";


export const ExpensesView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2025-03-03', desc: 'Compra de bebidas', amount: 150000, category: 'INSUMOS', method: 'Efectivo' },
    { id: 2, date: '2025-03-01', desc: 'Pago personal extra', amount: 45000, category: 'PERSONAL', method: 'Transferencia' },
  ]);

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Gastos Semanales</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#F85149] hover:bg-[#ff6a62] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Registrar Gasto
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-[#0D1117] border-b border-[#30363D] text-[#8B949E] text-sm">
              <tr>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Descripción</th>
                <th className="p-4 font-medium">Categoría</th>
                <th className="p-4 font-medium">Método</th>
                <th className="p-4 font-medium text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-[#30363D]/20 transition-colors">
                  <td className="p-4 text-[#E6EDF3]">{exp.date}</td>
                  <td className="p-4 text-[#E6EDF3]">{exp.desc}</td>
                  <td className="p-4 text-[#8B949E] text-xs font-bold uppercase tracking-wider">{exp.category}</td>
                  <td className="p-4 text-[#8B949E]">{exp.method}</td>
                  <td className="p-4 text-right text-[#E6EDF3] font-mono">{formatCurrency(exp.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 pb-20">
        {expenses.map(exp => (
          <div key={exp.id} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="font-medium text-[#E6EDF3] text-lg leading-tight pr-2">{exp.desc}</div>
              <div className="text-[#E6EDF3] font-mono font-bold">{formatCurrency(exp.amount)}</div>
            </div>

            <div className="flex justify-between items-center text-sm text-[#8B949E]">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{exp.date}</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#30363D]/50 px-2 py-1 rounded">
                {exp.category}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-[#30363D] flex items-center gap-2 text-sm text-[#8B949E]">
              <div className="flex items-center gap-1">
                {exp.method === 'Efectivo' ? <DollarSign size={14} className="text-[#3FB950]" /> :
                  exp.method === 'Transferencia' ? <CheckCircle size={14} className="text-[#1F6FEB]" /> :
                    <CreditCard size={14} className="text-[#C8A951]" />}
                <span>{exp.method}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nuevo Gasto"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[#E6EDF3] hover:bg-[#30363D] rounded-lg font-medium transition-colors">Cancelar</button>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#F85149] text-white rounded-lg font-bold hover:bg-[#ff6a62] transition-colors">Guardar</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Descripción</label>
            <input type="text" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#F85149] focus:outline-none" placeholder="Ej: Compra de hielo" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Monto</label>
              <input type="number" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#F85149] focus:outline-none" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Fecha</label>
              <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#F85149] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Categoría</label>
            <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#F85149] focus:outline-none">
              <option>INSUMOS</option>
              <option>PERSONAL</option>
              <option>PROVEEDORES</option>
              <option>MANTENIMIENTO</option>
              <option>OTROS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Método de Pago</label>
            <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#F85149] focus:outline-none">
              <option>Efectivo</option>
              <option>Transferencia</option>
              <option>Tarjeta</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};
