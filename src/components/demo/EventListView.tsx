import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, BarChart3, Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, CreditCard, DollarSign, Edit2, FileText, Filter, Mail, MapPin, Package, Phone, Plus, Printer, Scale, Search, Tag, Trash2, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CATALOG_DATA, EVENTS_DATA, PACK_PREMIUM_ITEMS, USERS, formatCurrency, type EventStatus, type ServiceItem, type User } from "../../features/demo/demoShared";
import { Modal } from "../ui/Modal";


export const EventListView = ({ onSelectEvent, onCreateEvent, user }: { onSelectEvent: (id: string) => void, onCreateEvent: () => void, user: User }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const isProduction = user.role === 'PRODUCCION' || user.role === 'ENCARGADO' || user.role === 'TIO_FRANCO';
  const currentMonth = '2026-03';

  const filteredEvents = EVENTS_DATA.filter(event => {
    const matchesStatus = filterStatus === 'ALL' || event.status === filterStatus;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCurrentMonth = !isProduction || event.date.startsWith(currentMonth);
    return matchesStatus && matchesSearch && matchesCurrentMonth;
  });

  const getStatusBadge = (status: EventStatus) => {
    const styles = {
      'POR_SENAR': 'bg-[#D29922]/15 text-[#D29922] border-[#D29922]/20',
      'SENA_EN_PROCESO': 'bg-[#C8A951]/15 text-[#C8A951] border-[#C8A951]/20',
      'CONFIRMADO': 'bg-[#3FB950]/15 text-[#3FB950] border-[#3FB950]/20',
      'CANCELADO': 'bg-[#F85149]/15 text-[#F85149] border-[#F85149]/20',
    };
    const labels: Record<EventStatus, string> = {
      'POR_SENAR': 'POR SEÑAR',
      'SENA_EN_PROCESO': 'SEÑA EN PROCESO',
      'CONFIRMADO': 'CONFIRMADO',
      'CANCELADO': 'CANCELADO',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4 lg:gap-0">
        <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Eventos — Vicenzo</h1>
        {!isProduction && user.role !== 'CATERING' && (
          <button
            onClick={onCreateEvent}
            className="w-full lg:w-auto bg-[#1F6FEB] hover:bg-[#388BFD] text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Nuevo evento
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full sm:w-auto max-w-none sm:max-w-md">
          <Search className="absolute left-3 top-2.5 text-[#8B949E] h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#C8A951]"
          />
        </div>
        <div className="relative w-full sm:w-auto min-w-[200px]">
          <Filter className="absolute left-3 top-2.5 text-[#8B949E] h-4 w-4" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-10 pr-4 py-2 appearance-none focus:outline-none focus:border-[#C8A951]"
          >
            <option value="ALL">Todos los estados</option>
            <option value="POR_SENAR">Por señar</option>
            <option value="SENA_EN_PROCESO">Seña en proceso</option>
            <option value="CONFIRMADO">Confirmado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-[#8B949E] pointer-events-none" />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:flex bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden flex-1 flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#0D1117] border-b border-[#30363D] text-[#8B949E] text-sm">
                <th className="p-4 font-medium">Evento</th>
                <th className="p-4 font-medium">Fecha</th>
                {user.role === 'CATERING' ? (
                  <>
                    <th className="p-4 font-medium text-center">Adultos</th>
                    <th className="p-4 font-medium text-center">Mozos</th>
                  </>
                ) : (
                  <>
                    <th className="p-4 font-medium">Categoría</th>
                    <th className="p-4 font-medium text-center">Invitados</th>
                  </>
                )}
                <th className="p-4 font-medium text-center">Estado</th>
                {!isProduction && user.role !== 'CATERING' && <th className="p-4 font-medium text-right">Balance</th>}
                <th className="p-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {filteredEvents.map(event => (
                <tr
                  key={event.id}
                  onClick={() => onSelectEvent(event.id)}
                  className="hover:bg-[#30363D]/20 cursor-pointer transition-colors group"
                >
                  <td className="p-4 font-medium text-[#E6EDF3]">{event.title}</td>
                  <td className="p-4 text-[#8B949E] tabular-nums">{new Date(event.date + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
                  {user.role === 'CATERING' ? (
                    <>
                      <td className="p-4 text-[#E6EDF3] text-center tabular-nums">{event.guests}</td>
                      <td className="p-4 text-[#E6EDF3] text-center tabular-nums">8</td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 text-[#E6EDF3] text-sm">{event.category}</td>
                      <td className="p-4 text-[#E6EDF3] text-center tabular-nums">{event.guests}</td>
                    </>
                  )}
                  <td className="p-4 text-center">{getStatusBadge(event.status)}</td>
                  {!isProduction && user.role !== 'CATERING' && (
                    <td className={`p-4 text-right tabular-nums font-medium ${event.balance > 0 ? 'text-[#F85149]' : event.balance < 0 ? 'text-[#3FB950]' : 'text-[#8B949E]'}`}>
                      {event.balance > 0 ? (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase opacity-70 leading-none mb-0.5">Debe</span>
                          <span>{formatCurrency(event.balance)}</span>
                        </div>
                      ) : event.balance < 0 ? (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase opacity-70 leading-none mb-0.5">A cuenta</span>
                          <span>{formatCurrency(Math.abs(event.balance))}</span>
                        </div>
                      ) : (
                        <span className="text-[#8B949E]">—</span>
                      )}
                    </td>
                  )}
                  <td className="p-4 text-center">
                    <button className="p-1.5 text-[#8B949E] hover:text-[#C8A951] hover:bg-[#C8A951]/10 rounded transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 pb-20">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            onClick={() => onSelectEvent(event.id)}
            className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 cursor-pointer active:bg-[#30363D]/20"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="font-medium text-[#E6EDF3] text-lg leading-tight pr-2">{event.title}</div>
              <div className="shrink-0">{getStatusBadge(event.status)}</div>
            </div>

            <div className="space-y-2 text-sm text-[#8B949E]">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{new Date(event.date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span>{user.role === 'CATERING' ? `${event.guests} adultos · 8 mozos` : `${event.guests} inv.`}</span>
                </div>
                {user.role !== 'CATERING' && (
                  <div className="flex items-center gap-2">
                    <Tag size={14} />
                    <span>{event.category}</span>
                  </div>
                )}
              </div>
            </div>

            {!isProduction && user.role !== 'CATERING' && event.balance !== 0 && (
              <div className="mt-3 pt-3 border-t border-[#30363D] flex justify-between items-center">
                <span className="text-sm text-[#8B949E]">{event.balance > 0 ? 'Debe:' : 'A cuenta:'}</span>
                <span className={`font-medium font-mono ${event.balance > 0 ? 'text-[#F85149]' : 'text-[#3FB950]'}`}>
                  {formatCurrency(Math.abs(event.balance))}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
