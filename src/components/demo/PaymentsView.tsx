import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, BarChart3, Calculator, Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, CreditCard, DollarSign, Edit2, FileText, Filter, Info, Mail, MapPin, Package, Phone, Plus, Printer, Scale, Search, Tag, Trash2, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CATALOG_DATA, EVENTS_DATA, PACK_PREMIUM_ITEMS, USERS, formatCurrency, type EventStatus, type ServiceItem, type User } from "../../features/demo/demoShared";
import { Modal } from "../ui/Modal";

export const PaymentsView = ({ onSelectEvent, user }: { onSelectEvent: (id: string) => void, user: User }) => {
  if (!user) return null;
  const [filterEvent, setFilterEvent] = useState<string>('ALL');
  const [filterUser, setFilterUser] = useState<string>('ALL');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDates, setExpandedDates] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Mock Data for Payments
  const payments = [
    { id: 1, date: '2025-03-01', event: 'Casamiento Moreno-Giuliani', desc: 'Pago final — saldo total', amount: 4300000, currency: 'ARS', method: 'Transferencia', user: 'Julia', type: 'SALDO', eventId: '5' },
    { id: 2, date: '2025-03-01', event: 'Quinceañera Valentina Suárez', desc: 'A cuenta — Mobiliario', amount: 875000, currency: 'ARS', method: 'Transferencia', user: 'Julia', type: 'NORMAL', eventId: '2' },
    { id: 3, date: '2025-02-25', event: 'Quinceañera Valentina Suárez', desc: 'A cuenta — Pack Premium', amount: 400000, currency: 'ARS', method: 'Efectivo', user: 'Franco', type: 'NORMAL', eventId: '2' },
    { id: 4, date: '2025-02-22', event: 'Casamiento Blanco-Fernández', desc: 'A cuenta general', amount: 3500000, currency: 'ARS', method: 'Transferencia', user: 'Julia', type: 'NORMAL', eventId: '8' },
    { id: 5, date: '2025-02-15', event: 'Cumpleaños 50 — Roberto Paz', desc: 'A cuenta — Menú', amount: 2800000, currency: 'ARS', method: 'Transferencia', user: 'Julia', type: 'NORMAL', eventId: '6' },
    { id: 6, date: '2025-02-10', event: 'Quinceañera Valentina Suárez', desc: 'A cuenta — Menú Jóvenes', amount: 5000000, currency: 'ARS', method: 'Transferencia', user: 'Julia', type: 'NORMAL', eventId: '2' },
    { id: 7, date: '2025-02-05', event: 'TechCorp Corporativo', desc: 'A cuenta general', amount: 4000000, currency: 'ARS', method: 'Transferencia', user: 'Franco', type: 'NORMAL', eventId: '3' },
    { id: 8, date: '2025-01-28', event: 'Quinceañera Isabella Torres', desc: 'Seña — Alquiler Salón', amount: 2000000, currency: 'ARS', method: 'Efectivo', user: 'Julia', type: 'SENA', eventId: '4' },
    { id: 9, date: '2025-01-22', event: 'Quinceañera Valentina Suárez', desc: 'Seña — Música, Luces y Pantallas', amount: 1150000, currency: 'ARS', method: 'Transferencia', user: 'Julia', type: 'SENA', eventId: '2' },
    { id: 10, date: '2025-01-20', event: 'Casamiento Blanco-Fernández', desc: 'Seña — Alquiler Salón', amount: 2000000, currency: 'ARS', method: 'Efectivo', user: 'Franco', type: 'SENA', eventId: '8' },
    { id: 11, date: '2025-01-18', event: 'TechCorp Corporativo', desc: 'Seña — Música, Luces y Pantallas', amount: 1150000, currency: 'ARS', method: 'Transferencia', user: 'Julia', type: 'SENA', eventId: '3' },
    { id: 12, date: '2025-01-15', event: 'Quinceañera Valentina Suárez', desc: 'Seña — Alquiler Salón', amount: 2000000, currency: 'ARS', method: 'Efectivo', user: 'Franco', type: 'SENA', eventId: '2' },
    { id: 13, date: '2025-01-10', event: 'Casamiento Rodríguez-Pérez', desc: 'Pago final', amount: 6200000, currency: 'ARS', method: 'Transferencia', user: 'Julia', type: 'SALDO', eventId: '1' },
    { id: 14, date: '2025-01-05', event: 'Casamiento Moreno-Giuliani', desc: 'Seña — Alquiler Salón', amount: 2000000, currency: 'ARS', method: 'Efectivo', user: 'Franco', type: 'SENA', eventId: '5' },
  ];

  const eventsWithoutFullSena = useMemo(() => {
    return EVENTS_DATA.filter(evt => evt.status !== 'CONFIRMADO' && evt.status !== 'CANCELADO').length;
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = filterEvent === 'ALL' || payment.event === filterEvent;
    const matchesUser = filterUser === 'ALL' || payment.user === filterUser;
    const matchesDate = (!filterDateFrom || payment.date >= filterDateFrom) &&
      (!filterDateTo || payment.date <= filterDateTo);

    return matchesSearch && matchesEvent && matchesUser && matchesDate;
  });

  const groupedPayments = useMemo(() => {
    const sorted = [...filteredPayments].sort((a, b) => b.date.localeCompare(a.date));
    const groups: { [date: string]: typeof filteredPayments } = {};
    sorted.forEach(p => {
      if (!groups[p.date]) groups[p.date] = [];
      groups[p.date].push(p);
    });
    return groups;
  }, [filteredPayments]);

  const uniqueDates = useMemo(() => Object.keys(groupedPayments), [groupedPayments]);
  const paginatedDates = uniqueDates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Efectivo': return <DollarSign size={16} className="text-[#3FB950]" />;
      case 'Transferencia': return <CheckCircle size={16} className="text-[#1F6FEB]" />; 
      case 'Tarjeta': return <CreditCard size={16} className="text-[#C8A951]" />;
      default: return <DollarSign size={16} />;
    }
  };

  const [registerForm, setRegisterForm] = useState({
    eventId: '',
    serviceName: 'A cuenta general',
    amount: '',
    currency: 'ARS',
    type: 'A_CUENTA',
    method: 'Efectivo',
    date: new Date().toISOString().split('T')[0]
  });

  const [eventSearch, setEventSearch] = useState('');
  const [showEventResults, setShowEventResults] = useState(false);

  const filteredEventResults = EVENTS_DATA.filter(e => 
    e.title.toLowerCase().includes(eventSearch.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col overflow-y-auto">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 lg:gap-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Historial de Cobros</h1>
          <p className="text-[10px] text-[#8B949E] uppercase tracking-widest font-black">Registro y seguimiento de ingresos de eventos</p>
        </div>
        <div className="relative w-full lg:w-auto">
          <select className="w-full lg:w-auto bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-4 pr-10 py-2.5 appearance-none focus:outline-none focus:border-[#C8A951] font-bold text-xs">
            <option>Este mes</option>
            <option>Último trimestre</option>
            <option>Este año</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#8B949E] pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#161B22] border border-[#30363D] border-t-4 border-t-[#3FB950] rounded-2xl p-6 shadow-xl leading-tight">
            <div className="text-[#8B949E] text-[10px] font-black uppercase tracking-[0.15em] mb-2">Total cobrado</div>
            <div className="text-3xl font-display font-black text-[#E6EDF3] mb-1 tracking-tighter">$13.400.000</div>
            <div className="text-[#3FB950] text-[10px] font-bold flex items-center gap-1">
              ▲ +18% vs mes anterior
            </div>
          </div>
          <div className="bg-[#161B22] border border-[#30363D] border-t-4 border-t-[#F85149] rounded-2xl p-6 shadow-xl leading-tight">
            <div className="text-[#8B949E] text-[10px] font-black uppercase tracking-[0.15em] mb-2">Por señar</div>
            <div className="text-3xl font-display font-black text-[#E6EDF3] mb-1 tracking-tighter">{eventsWithoutFullSena}</div>
            <div className="text-[#F85149] text-[10px] font-bold">Eventos pendientes de seña</div>
          </div>
          <div className="bg-[#161B22] border border-[#30363D] border-t-4 border-t-[#C8A951] rounded-2xl p-6 shadow-xl leading-tight">
            <div className="text-[#8B949E] text-[10px] font-black uppercase tracking-[0.15em] mb-2">Operaciones</div>
            <div className="text-3xl font-display font-black text-[#E6EDF3] mb-1 tracking-tighter">14</div>
            <div className="text-[#8B949E] text-[10px] font-bold uppercase tracking-tight">Último cobro registrado hoy</div>
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 sm:p-8 border-b border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1C2128]/50">
            <h3 className="text-[#E6EDF3] text-xl font-black uppercase tracking-tighter">Historial de Cobros</h3>
            {(user.role === 'JEFE' || user.role === 'RECEPCIONISTA') && (
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full sm:w-auto bg-[#1F6FEB] hover:bg-[#388BFD] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#1F6FEB]/20"
              >
                <Plus size={16} /> Registrar pago cliente
              </button>
            )}
          </div>

          <div className="p-6 border-b border-[#30363D] bg-[#0D1117]/30">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-3 text-[#8B949E] h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por evento o detalle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#C8A951] transition-all font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1C2128] border-b border-[#30363D] text-[10px] font-black uppercase text-[#8B949E] tracking-[0.25em]">
                <tr>
                  <th className="px-8 py-5">Fecha</th>
                  <th className="px-8 py-5">Evento</th>
                  <th className="px-8 py-5">Descripción</th>
                  <th className="px-8 py-5 text-right">Monto</th>
                  <th className="px-8 py-5 text-center">Metodo</th>
                  <th className="px-8 py-5">Usuario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]/50">
                {paginatedDates.map(date => (
                  <React.Fragment key={date}>
                    <tr className="bg-[#0D1117]/70">
                      <td colSpan={6} className="px-8 py-3 text-[#C8A951] font-black italic text-[11px] tracking-widest uppercase border-b border-[#30363D]/30">{date}</td>
                    </tr>
                    {groupedPayments[date].map(p => (
                      <tr key={p.id} className="hover:bg-[#1C2128]/30 transition-colors group">
                        <td className="px-8 py-5 text-[#8B949E] text-xs font-bold">{p.date.split('-').reverse().slice(0, 2).join('/')}</td>
                        <td className="px-8 py-5 text-[#E6EDF3] font-bold group-hover:text-[#C8A951] transition-colors">{p.event}</td>
                        <td className="px-8 py-5 text-[#8B949E] text-xs font-medium max-w-xs truncate">{p.desc}</td>
                        <td className="px-8 py-5 text-right text-[#3FB950] font-black text-lg tabular-nums tracking-tighter">{formatCurrency(p.amount)}</td>
                        <td className="px-8 py-5 text-center">
                          <div className="flex justify-center">{getMethodIcon(p.method)}</div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="bg-[#30363D]/40 text-[#8B949E] px-2 py-1 rounded text-[9px] font-black uppercase tracking-tight border border-[#30363D]/50 group-hover:border-[#C8A951]/20 transition-all">{p.user}</span>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Registrar pago manual"
        footer={
          <div className="flex gap-4 justify-end w-full px-4">
            <button onClick={() => setIsRegisterModalOpen(false)} className="px-4 py-2 text-[#8B949E] hover:text-white font-bold transition-colors text-sm uppercase tracking-widest">Cancelar</button>
            <button onClick={() => setIsRegisterModalOpen(false)} className="px-6 py-3 bg-[#C8A951] text-[#0D1117] rounded-xl font-black uppercase text-[10px] tracking-[0.12em] hover:bg-[#D4B96A] transition-all shadow-lg shadow-[#C8A951]/20">Registrar cobro</button>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-[#8B949E] uppercase tracking-widest mb-2.5 ml-1">Servicio Destino</label>
            <div className="relative">
              <select 
                value={registerForm.serviceName}
                onChange={(e) => setRegisterForm({...registerForm, serviceName: e.target.value})}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-4 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none appearance-none font-bold text-sm transition-all"
              >
                <optgroup label="Servicios del catálogo">
                  {CATALOG_DATA.filter(item => !item.name.toLowerCase().includes('iva'))
                    .map(item => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))
                  }
                </optgroup>
                <option value="A cuenta general">A cuenta general</option>
              </select>
              <ChevronDown className="absolute right-4 top-[1.125rem] h-4 w-4 text-[#8B949E] pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#8B949E] uppercase tracking-widest mb-2.5 ml-1">Evento</label>
            <div className="relative">
              <Search className="absolute left-4 top-[1.125rem] text-[#8B949E] h-4 w-4" />
              <input 
                type="text" 
                value={eventSearch}
                onChange={(e) => {
                  setEventSearch(e.target.value);
                  setShowEventResults(true);
                }}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-12 pr-4 py-4 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none font-bold text-sm tracking-tight" 
                placeholder="Nombre del cliente o evento..." 
              />
            </div>
            {showEventResults && eventSearch && (
              <div className="absolute z-[120] w-full mt-1 bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                {filteredEventResults.map(e => (
                  <div 
                    key={e.id}
                    onClick={() => {
                      setRegisterForm({...registerForm, eventId: e.id});
                      setEventSearch(e.title);
                      setShowEventResults(false);
                    }}
                    className="p-4 hover:bg-[#3FB950]/10 hover:text-[#3FB950] cursor-pointer text-[#E6EDF3] text-xs font-black border-b border-[#30363D] last:border-none transition-all flex items-center justify-between"
                  >
                    <span>{e.title}</span>
                    <span className="text-[9px] bg-[#3FB950]/20 text-[#3FB950] px-1.5 py-0.5 rounded tracking-widest">{e.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-black text-[#8B949E] uppercase tracking-widest mb-2.5 ml-1">Importe</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-[#3FB950] font-black text-sm">$</span>
                <input 
                  type="number" 
                  value={registerForm.amount}
                  onChange={(e) => setRegisterForm({...registerForm, amount: e.target.value})}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-8 pr-4 py-4 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none font-black text-sm text-[#3FB950]" 
                  placeholder="0" 
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#8B949E] uppercase tracking-widest mb-2.5 ml-1">Moneda</label>
              <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-4 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none appearance-none font-bold text-sm">
                <option>ARS</option>
                <option>USD</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-black text-[#8B949E] uppercase tracking-widest mb-2.5 ml-1">Método</label>
              <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-4 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none appearance-none font-bold text-sm">
                <option>Efectivo</option>
                <option>Transferencia</option>
                <option>Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#8B949E] uppercase tracking-widest mb-2.5 ml-1">Fecha Cobro</label>
              <input 
                type="date" 
                value={registerForm.date}
                onChange={(e) => setRegisterForm({...registerForm, date: e.target.value})}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-4 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none font-bold text-sm" 
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
