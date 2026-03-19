import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, BarChart3, Calculator, Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, CreditCard, DollarSign, Edit2, FileText, Filter, Info, Mail, MapPin, Package, Phone, Plus, Printer, Scale, Search, Tag, Trash2, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CATALOG_DATA, EVENTS_DATA, PACK_PREMIUM_ITEMS, USERS, formatCurrency, type EventStatus, type ServiceItem, type User } from "../../features/demo/demoShared";
import { Modal } from "../ui/Modal";


export const PaymentsView = ({ onSelectEvent, user }: { onSelectEvent: (id: string) => void, user: User }) => {
  if (!user) return null;
  const [activeSubTab, setActiveSubTab] = useState<'CLIENTS' | 'CATERING'>('CLIENTS');
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

  const eventBalances = [
    { name: 'Casamiento Rodríguez-Pérez', paid: 22800000, total: 22800000, percent: 100, status: 'SALDADO ✅' },
    { name: 'Casamiento Moreno-Giuliani', paid: 22800000, total: 22800000, percent: 100, status: 'SALDADO ✅' },
    { name: 'Quinceañera Luciana Martínez', paid: 16980000, total: 18180000, percent: 93, pending: 1200000 },
    { name: 'Quinceañera Valentina Suárez', paid: 13400000, total: 18200000, percent: 74, pending: 4800000 },
    { name: 'Cumpleaños 50 — Roberto Paz', paid: 10900000, total: 17000000, percent: 64, pending: 6100000 },
    { name: 'Casamiento Blanco-Fernández', paid: 12500000, total: 21400000, percent: 58, pending: 8900000 },
    { name: 'TechCorp Corporativo', paid: 10700000, total: 19800000, percent: 54, pending: 9100000 },
    { name: 'Quinceañera Isabella Torres', paid: 0, total: 12400000, percent: 0, pending: 12400000, alert: true },
  ];

  // Calculate events missing full señas
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
  const totalPages = Math.ceil(uniqueDates.length / itemsPerPage);
  const paginatedDates = uniqueDates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleDate = (date: string) => {
    setExpandedDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const getProgressColor = (percent: number) => {
    if (percent === 100) return '#3FB950';
    if (percent >= 60) return '#1F6FEB';
    if (percent >= 30) return '#D29922';
    return '#F85149';
  };

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
          <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Gestión de Pagos</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveSubTab('CLIENTS')}
              className={`text-[10px] font-black uppercase tracking-widest pb-1 transition-all border-b-2 ${activeSubTab === 'CLIENTS' ? 'border-[#C8A951] text-[#E6EDF3]' : 'border-transparent text-[#8B949E]'}`}
            >
              Cobros Clientes
            </button>
            <button 
              onClick={() => setActiveSubTab('CATERING')}
              className={`text-[10px] font-black uppercase tracking-widest pb-1 transition-all border-b-2 ${activeSubTab === 'CATERING' ? 'border-[#3FB950] text-[#E6EDF3]' : 'border-transparent text-[#8B949E]'}`}
            >
              Pagos al Catering
            </button>
          </div>
        </div>
        <div className="relative w-full lg:w-auto">
          <select className="w-full lg:w-auto bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-4 pr-10 py-2 appearance-none focus:outline-none focus:border-[#C8A951]">
            <option>Este mes</option>
            <option>Último trimestre</option>
            <option>Este año</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8B949E] pointer-events-none" />
        </div>
      </div>

      {activeSubTab === 'CLIENTS' ? (
        <>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 mt-4">
            <div className="bg-[#161B22] border border-[#30363D] border-t-4 border-t-[#3FB950] rounded-xl p-5">
              <div className="text-[#8B949E] text-sm font-medium mb-2">Total cobrado</div>
              <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">$13.400.000</div>
              <div className="text-[#3FB950] text-xs font-medium flex items-center gap-1">
                ▲ +18% vs feb
              </div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] border-t-4 border-t-[#F85149] rounded-xl p-5">
              <div className="text-[#8B949E] text-sm font-medium mb-2">Por señar</div>
              <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">{eventsWithoutFullSena}</div>
              <div className="text-[#F85149] text-xs font-medium flex items-center gap-1 leading-tight">
                eventos pendientes de seña
              </div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] border-t-4 border-t-[#C8A951] rounded-xl p-5">
              <div className="text-[#8B949E] text-sm font-medium mb-2">Pagos este mes</div>
              <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">14</div>
              <div className="text-[#8B949E] text-xs font-medium flex items-center gap-1">
                último: 01/03/25
              </div>
            </div>
          </div>

          {/* Payments Table (Full Width) */}
          <div className="w-full flex flex-col bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
            <div className="p-6 border-b border-[#30363D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <h3 className="text-[#E6EDF3] font-display font-semibold">Historial de Cobros</h3>
              {(user.role === 'JEFE' || user.role === 'RECEPCIONISTA') && (
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="w-full sm:w-auto bg-[#1F6FEB] hover:bg-[#388BFD] text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus size={16} />
                  Registrar pago cliente
                </button>
              )}
            </div>
            {/* ... Rest of existing table header indicators ... */}
            <div className="p-4 border-b border-[#30363D] space-y-4">
              {/* Existing Search / Filters for clients */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 text-[#8B949E] h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#C8A951]"
                  />
                </div>
              </div>
            </div>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-auto">
              <table className="w-full text-left">
                <thead className="bg-[#1C2128] border-b border-[#30363D] text-[#8B949E] text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="p-4">Fecha / Detalle</th>
                    <th className="p-4">Evento</th>
                    <th className="p-4">Descripción</th>
                    <th className="p-4 text-right">Monto</th>
                    <th className="p-4 text-center">Metodo</th>
                    <th className="p-4">Usuario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363D]/50">
                  {paginatedDates.map(date => (
                    <React.Fragment key={date}>
                      <tr className="bg-[#0D1117]/30 border-b border-[#30363D]/30"><td colSpan={6} className="px-4 py-2 text-[#C8A951] font-bold text-[10px]">{date}</td></tr>
                      {groupedPayments[date].map(p => (
                        <tr key={p.id} className="hover:bg-[#1C2128]/50 transition-colors">
                          <td className="p-4 text-[#8B949E] text-xs">{p.date}</td>
                          <td className="p-4 text-[#E6EDF3] text-sm font-bold">{p.event}</td>
                          <td className="p-4 text-[#8B949E] text-xs">{p.desc}</td>
                          <td className="p-4 text-right text-[#3FB950] font-bold">{formatCurrency(p.amount)}</td>
                          <td className="p-4 text-center">{getMethodIcon(p.method)}</td>
                          <td className="p-4 text-[#8B949E] text-xs">{p.user}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* CATERING TAB */
        <div className="mt-4 space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#30363D] flex items-center justify-between">
              <div>
                <h3 className="text-[#E6EDF3] font-bold flex items-center gap-2">
                  <Calculator size={18} className="text-[#3FB950]" /> Historial de Pagos al Catering
                </h3>
                <p className="text-[10px] text-[#8B949E] uppercase tracking-widest mt-1">Salidas registradas hacia proveedores</p>
              </div>
              {(user.role === 'JEFE' || user.role === 'RECEPCIONISTA') && (
                <button className="bg-[#3FB950] text-[#0D1117] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                  Registrar pago al catering
                </button>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#1C2128] border-b border-[#30363D] text-[10px] font-black uppercase text-[#8B949E] tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Fecha Pago</th>
                    <th className="px-6 py-4 text-right">Importe</th>
                    <th className="px-6 py-4">Tipo Evento</th>
                    <th className="px-6 py-4">Fecha Fiesta</th>
                    <th className="px-6 py-4 text-right text-[#F85149]">Débito Fiesta</th>
                    <th className="px-6 py-4 text-right text-[#3FB950]">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363D]/50 text-sm">
                  {[
                    { idPago: 1, fecha: '2025-03-05', importe: 1200000, tipo: 'Quinceañera', fiesta: '15/03/25', debito: 5200000, saldo: 4000000 },
                    { idPago: 2, fecha: '2025-02-28', importe: 3000000, tipo: 'Casamiento', fiesta: '05/03/25', debito: 7800000, saldo: 4800000 },
                  ].map(p => (
                    <tr key={p.idPago} className="hover:bg-[#0D1117]/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#E6EDF3]">{p.fecha}</td>
                      <td className="px-6 py-4 text-right font-black text-[#3FB950]">{formatCurrency(p.importe)}</td>
                      <td className="px-6 py-4 text-[#8B949E] font-medium">{p.tipo}</td>
                      <td className="px-6 py-4 text-[#E6EDF3]">{p.fiesta}</td>
                      <td className="px-6 py-4 text-right font-bold text-[#F85149]">{formatCurrency(p.debito)}</td>
                      <td className="px-6 py-4 text-right font-black text-[#C8A951]">{formatCurrency(p.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-6 bg-[#3FB950]/5 border border-[#3FB950]/20 rounded-2xl flex items-start gap-4">
             <Info size={20} className="text-[#3FB950] mt-0.5" />
             <p className="text-xs text-[#8B949E] leading-relaxed">
               Este panel muestra los pagos efectuados desde el salón hacia el proveedor de Catering. Los usuarios de Catering tienen acceso de <strong>SÓLO LECTURA</strong> para verificar su facturación y saldos pendientes.
             </p>
          </div>
        </div>
      )}

      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Registrar pago manual"
        footer={
          <>
            <button onClick={() => setIsRegisterModalOpen(false)} className="px-4 py-2 text-[#E6EDF3] hover:bg-[#30363D] rounded-lg font-medium transition-colors">Cancelar</button>
            <button onClick={() => setIsRegisterModalOpen(false)} className="px-4 py-2 bg-[#C8A951] text-[#0D1117] rounded-lg font-bold hover:bg-[#D4B96A] transition-colors">Registrar pago</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Imputar a servicio</label>
            <div className="relative">
              <select 
                value={registerForm.serviceName}
                onChange={(e) => setRegisterForm({...registerForm, serviceName: e.target.value})}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none appearance-none"
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
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8B949E] pointer-events-none" />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Buscar Evento</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-[#8B949E] h-4 w-4" />
              <input 
                type="text" 
                value={eventSearch}
                onChange={(e) => {
                  setEventSearch(e.target.value);
                  setShowEventResults(true);
                }}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-10 pr-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" 
                placeholder="Escriba el nombre del evento..." 
              />
            </div>
            {showEventResults && eventSearch && (
              <div className="absolute z-50 w-full mt-1 bg-[#161B22] border border-[#30363D] rounded-lg shadow-xl max-h-40 overflow-y-auto">
                {filteredEventResults.map(e => (
                  <div 
                    key={e.id}
                    onClick={() => {
                      setRegisterForm({...registerForm, eventId: e.id});
                      setEventSearch(e.title);
                      setShowEventResults(false);
                    }}
                    className="p-3 hover:bg-[#30363D] cursor-pointer text-[#E6EDF3] text-sm border-b border-[#30363D] last:border-none"
                  >
                    {e.title}
                  </div>
                ))}
                {filteredEventResults.length === 0 && <div className="p-3 text-[#8B949E] text-xs">No se encontraron eventos</div>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Monto</label>
              <input 
                type="number" 
                value={registerForm.amount}
                onChange={(e) => setRegisterForm({...registerForm, amount: e.target.value})}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" 
                placeholder="0.00" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Moneda</label>
              <select 
                value={registerForm.currency}
                onChange={(e) => setRegisterForm({...registerForm, currency: e.target.value})}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none"
              >
                <option>ARS</option>
                <option>USD</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Método de pago</label>
              <select 
                value={registerForm.method}
                onChange={(e) => setRegisterForm({...registerForm, method: e.target.value})}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none"
              >
                <option>Efectivo</option>
                <option>Transferencia</option>
                <option>Tarjeta</option>
                <option>Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Fecha</label>
              <input 
                type="date" 
                value={registerForm.date}
                onChange={(e) => setRegisterForm({...registerForm, date: e.target.value})}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Registrado por</label>
            <input type="text" value="Usuario actual (Auto)" disabled className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#8B949E] cursor-not-allowed" />
          </div>
        </div>
      </Modal>
    </div>
  );
};

