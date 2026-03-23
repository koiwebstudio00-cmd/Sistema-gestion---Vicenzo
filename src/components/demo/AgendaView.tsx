import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, BarChart3, Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, CreditCard, DollarSign, Edit2, FileText, Filter, Mail, MapPin, Package, Phone, Plus, Printer, Scale, Search, Tag, Trash2, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CATALOG_DATA, EVENTS_DATA, PACK_PREMIUM_ITEMS, USERS, formatCurrency, type EventCategory, type EventStatus, type ServiceItem, type User } from "../../features/demo/demoShared";
import { Modal } from "../ui/Modal";


export const AgendaView = ({ onSelectEvent, user }: { onSelectEvent: (id: string) => void, user: User }) => {
  const [viewMode, setViewMode] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const yearOptions = useMemo(() => {
    const years = [];
    const thisYear = new Date().getFullYear();
    for (let y = thisYear - 2; y <= thisYear + 5; y++) {
      years.push({ value: y.toString(), label: y.toString() });
    }
    return years;
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Shift to start on Monday

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return EVENTS_DATA.filter(e => {
      const eventDate = new Date(e.date);
      const matchesDate = e.date === dateStr;
      const matchesYear = eventDate.getFullYear() === currentYear;
      const matchesCategory = filterCategory === 'ALL' || e.category === filterCategory;
      const matchesStatus = filterStatus === 'ALL' || e.status === filterStatus;

      return matchesDate && matchesCategory && matchesStatus;
    });
  };

  const getEventStyles = (category?: EventCategory) => {
    switch (category) {
      case 'QUINCEANERA':
        return { bg: '#FFB3D9', border: '#E91E8C', text: '#E91E8C' };
      case 'CASAMIENTO':
        return { bg: '#9DB8E8', border: '#1A3A7A', text: '#1A3A7A' };
      case 'CUMPLEANOS':
        return { bg: '#FFF3A0', border: '#E8920A', text: '#E8920A' };
      case 'CORPORATIVO':
        return { bg: '#E0E0E0', border: '#606060', text: '#606060' };
      case 'EGRESADO':
        return { bg: '#9C27B0', border: '#9C27B0', text: '#4A0060' };
      case 'OTRO':
        return { bg: '#B8F0A0', border: '#3CB521', text: '#2E9018' };
      case 'ANIVERSARIO':
        return { bg: 'transparent', border: '#1A1A1A', text: '#1A1A1A' }; // Mapped to RESERVADO style
      default:
        return { bg: 'transparent', border: '#1A1A1A', text: '#1A1A1A' };
    }
  };

  const getEventColor = (category: EventCategory) => {
    switch (category) {
      case 'QUINCEANERA': return 'bg-[#FFB3D9] border-l-4 border-[#E91E8C] text-[#E91E8C]';
      case 'CASAMIENTO': return 'bg-[#9DB8E8] border-l-4 border-[#1A3A7A] text-[#1A3A7A]';
      case 'CUMPLEANOS': return 'bg-[#FFF3A0] border-l-4 border-[#E8920A] text-[#E8920A]';
      case 'CORPORATIVO': return 'bg-[#E0E0E0] border-l-4 border-[#606060] text-[#606060]';
      case 'EGRESADO': return 'bg-[#9C27B0] border-l-4 border-[#9C27B0] text-[#4A0060]';
      case 'ANIVERSARIO': return 'bg-[#1A1A1A] border-l-4 border-[#1A1A1A] text-white';
      case 'OTRO': return 'bg-[#B8F0A0] border-l-4 border-[#3CB521] text-[#2E9018]';
      default: return 'bg-[#30363D] border-l-4 border-[#8B949E] text-[#E6EDF3]';
    }
  };

  // Mobile: Get events for selected date and upcoming
  const selectedDateEvents = getEventsForDay(selectedDate);
  const upcomingEvents = EVENTS_DATA.filter(e => {
    const eventDate = new Date(e.date);
    const selected = new Date(currentYear, currentMonth, selectedDate);
    return eventDate >= selected;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleMonthClick = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    setViewMode('MONTHLY');
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col bg-[#0D1117]">
      {/* Header - Desktop & Mobile */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4 lg:gap-0">
        <div className="flex items-center gap-4">
          {viewMode === 'MONTHLY' && (
            <button
              onClick={() => setViewMode('ANNUAL')}
              className="p-2 hover:bg-[#161B22] rounded-lg text-[#8B949E] hover:text-[#E6EDF3] transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">
            {viewMode === 'ANNUAL' ? `Agenda ${currentYear}` : `Agenda — ${months[currentMonth]}`}
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          {/* Filters - Show in both views */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none w-full sm:w-auto">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-auto bg-[#161B22] border border-[#30363D] text-[#E6EDF3] text-sm rounded-lg pl-3 pr-8 py-2 appearance-none focus:outline-none focus:border-[#C8A951]"
              >
                <option value="ALL">Todos los tipos</option>
                <option value="CASAMIENTO">Casamiento</option>
                <option value="QUINCEANERA">15 Años</option>
                <option value="CUMPLEANOS">Cumpleaños</option>
                <option value="CORPORATIVO">Corporativo</option>
                <option value="EGRESADO">Egresado</option>
                <option value="OTRO">Otro</option>
                <option value="ANIVERSARIO">Reservado</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-[#8B949E] pointer-events-none" />
            </div>

            <div className="relative flex-1 sm:flex-none w-full sm:w-auto">
              <select
                value={currentYear.toString()}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="w-full sm:w-auto bg-[#161B22] border border-[#30363D] text-[#E6EDF3] text-sm rounded-lg pl-3 pr-8 py-2 appearance-none focus:outline-none focus:border-[#C8A951]"
              >
                {yearOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-[#8B949E] pointer-events-none" />
            </div>

            <div className="relative flex-1 sm:flex-none w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto bg-[#161B22] border border-[#30363D] text-[#E6EDF3] text-sm rounded-lg pl-3 pr-8 py-2 appearance-none focus:outline-none focus:border-[#C8A951]"
              >
                <option value="ALL">Todos los estados</option>
                <option value="POR_SENAR">Por señar</option>
                <option value="SENA_EN_PROCESO">Seña en proceso</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-[#8B949E] pointer-events-none" />
            </div>
          </div>

          <div className="hidden lg:block h-6 w-px bg-[#30363D]" />

          {viewMode === 'MONTHLY' && (
            <div className="hidden lg:flex items-center gap-4 bg-[#161B22] border border-[#30363D] rounded-lg p-1 w-full sm:w-auto justify-between sm:justify-start">
              <button onClick={handlePrevMonth} className="p-1.5 hover:bg-[#30363D] rounded text-[#8B949E] hover:text-[#E6EDF3]"><ChevronLeft size={20} /></button>
              <span className="font-medium px-2 min-w-[120px] text-center text-[#E6EDF3]">{months[currentMonth]} {currentYear}</span>
              <button onClick={handleNextMonth} className="p-1.5 hover:bg-[#30363D] rounded text-[#8B949E] hover:text-[#E6EDF3]"><ChevronRight size={20} /></button>
            </div>
          )}
        </div>
      </div>

      {/* Annual View */}
      {viewMode === 'ANNUAL' && (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {months.map((month, index) => {
              const daysInMonth = new Date(currentYear, index + 1, 0).getDate();
              const startDay = (new Date(currentYear, index, 1).getDay() + 6) % 7; // Mon=0
              const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
              const monthBlanks = Array.from({ length: startDay }, (_, i) => i);

              const monthEvents = EVENTS_DATA.filter(e => {
                const d = new Date(e.date);
                const matchesMonth = d.getMonth() === index && d.getFullYear() === currentYear;
                const matchesCategory = filterCategory === 'ALL' || e.category === filterCategory;
                const matchesStatus = filterStatus === 'ALL' || e.status === filterStatus;

                return matchesMonth && matchesCategory && matchesStatus;
              });

              return (
                <div
                  key={month}
                  onClick={() => {
                    const isRestricted = (user.role === 'ENCARGADO' || user.role === 'TIO_FRANCO');
                    if (!isRestricted) handleMonthClick(index);
                  }}
                  className={`bg-[#161B22] border border-[#30363D] rounded-xl p-4 hover:border-[#8B949E] transition-all group relative overflow-hidden ${user.role === 'ENCARGADO' || user.role === 'TIO_FRANCO' ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-[#E6EDF3] group-hover:text-[#C8A951] transition-colors">{month}</h3>
                  </div>

                  <div className="grid grid-cols-7 text-center mb-1">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                      <div key={`${d}-${i}`} className="text-[#8B949E] text-[10px] font-medium">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
                    {monthBlanks.map((_, i) => <div key={`b-${i}`} />)}
                    {monthDays.map(day => {
                      const dateStr = `${currentYear}-${(index + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                      const dayEvents = monthEvents.filter(e => e.date === dateStr);
                      const hasEvents = dayEvents.length > 0;
                      const event = hasEvents ? dayEvents[0] : null;


                      return (
                        <div key={day} className="flex justify-center items-center h-8 relative">
                          {hasEvents ? (
                            <div
                              className="w-8 h-8 rounded-[12px] flex items-center justify-center text-sm font-bold transition-all shadow-sm"
                              style={{
                                backgroundColor: getEventStyles(event?.category).bg,
                                border: `2px solid ${getEventStyles(event?.category).border}`,
                                color: getEventStyles(event?.category).text
                              }}
                            >
                              {day}
                            </div>
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center text-[11px] text-[#8B949E] hover:bg-[#30363D]/30 rounded-lg transition-all">
                              {day}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monthly View Content */}
      {viewMode === 'MONTHLY' && (
        <>
          {/* Mobile Filters */}
          <div className="lg:hidden mb-4">
            <div className="relative w-full">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-4 pr-10 py-2 appearance-none focus:outline-none focus:border-[#C8A951]"
              >
                <option value="ALL">Todos los tipos de evento</option>
                <option value="CASAMIENTO">Casamiento</option>
                <option value="QUINCEANERA">Quinceañera</option>
                <option value="CUMPLEANOS">Cumpleaños</option>
                <option value="CORPORATIVO">Corporativo</option>
                <option value="EGRESADO">Egresado</option>
                <option value="OTRO">Otro</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8B949E] pointer-events-none" />
            </div>
          </div>

          {/* Desktop View (Grid) */}
          <div className="hidden lg:flex flex-1 bg-[#161B22] border-t border-l border-[#30363D] rounded-xl overflow-hidden flex-col shadow-2xl">
            <div className="flex-1 overflow-x-auto">
              <div className="min-w-[800px] h-full flex flex-col">
                <div className="grid grid-cols-7 border-b border-[#30363D] bg-[#0D1117] sticky top-0 z-20">
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                    <div key={day} className="py-3 text-center text-[10px] font-black uppercase text-[#8B949E] tracking-[0.2em] border-r border-[#30363D]">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-fr flex-1">
                  {blanks.map((_, i) => (
                    <div key={`blank-${i}`} className="border-b border-r border-[#30363D] bg-[#0D1117]/30" />
                  ))}
                  {days.map(day => {
                    const dayEvents = getEventsForDay(day);
                    return (
                      <div key={day} className="border-b border-r border-[#30363D] p-2 relative group hover:bg-[#30363D]/10 transition-colors flex flex-col min-h-[110px]">
                        <div
                          className={`w-9 h-9 rounded-[12px] flex items-center justify-center text-sm transition-all mb-2
                            ${dayEvents.length > 0 ? 'font-bold shadow-sm' : 'text-[#8B949E]'}`}
                          style={dayEvents.length > 0 ? { 
                            backgroundColor: getEventStyles(dayEvents[0].category).bg,
                            border: `2px solid ${getEventStyles(dayEvents[0].category).border}`,
                            color: getEventStyles(dayEvents[0].category).text
                          } : {}}
                        >
                          {day}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dayEvents.map(event => (
                            <div
                              key={event.id}
                              onClick={(e) => { e.stopPropagation(); onSelectEvent(event.id); }}
                              className={`w-full p-2.5 rounded-lg mb-1 cursor-pointer hover:brightness-110 transition-all border border-white/5 shadow-md group relative z-10`}
                              style={{
                                backgroundColor: getEventStyles(event.category).bg,
                                borderLeft: `4px solid ${getEventStyles(event.category).border}`,
                              }}
                            >
                              <div 
                                className="text-[13px] font-bold truncate leading-tight mb-2"
                                style={{ color: getEventStyles(event.category).text }}
                              >
                                {event.title}
                              </div>
                              <div className="flex items-center justify-end gap-1.5">
                                <span 
                                  className="px-1.5 py-0.5 rounded-[4px] text-[7.5px] font-black uppercase tracking-tighter bg-white/10 border border-white/5"
                                  style={{ color: getEventStyles(event.category).text }}
                                >
                                  {event.status === 'POR_SENAR' ? 'POR SEÑAR' : event.status === 'SENA_EN_PROCESO' ? 'SEÑA EN PROC.' : event.status}
                                </span>
                                <span 
                                  className="font-bold text-[10px] leading-none"
                                  style={{ color: event.balance > 0 ? '#F85149' : event.balance < 0 ? '#3FB950' : '#8B949E' }}
                                >
                                  $
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {/* Fill remaining cells if needed */}
                  {Array.from({ length: 42 - (days.length + blanks.length) }).map((_, i) => (
                    <div key={`end-blank-${i}`} className="border-b border-r border-[#30363D] bg-[#0D1117]/30" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View (List & Compact Calendar) */}
          <div className="lg:hidden flex flex-col pb-20">
            {/* Compact Calendar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4 px-2">
                <div className="text-xl font-bold text-[#E6EDF3]">{months[currentMonth]} {currentYear}</div>
                <div className="flex gap-2">
                  <button onClick={handlePrevMonth} className="p-1 bg-[#161B22] rounded-lg border border-[#30363D] text-[#8B949E]"><ChevronLeft size={20} /></button>
                  <button onClick={handleNextMonth} className="p-1 bg-[#161B22] rounded-lg border border-[#30363D] text-[#8B949E]"><ChevronRight size={20} /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center mb-2">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                  <div key={d} className="text-[#8B949E] text-xs font-medium py-2">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-2">
                {blanks.map((_, i) => <div key={`mb-${i}`} />)}
                {days.map(day => {
                  const hasEvents = getEventsForDay(day).length > 0;
                  const isSelected = selectedDate === day;
                  return (
                    <div key={day} className="flex justify-center">
                        <button
                          onClick={() => setSelectedDate(day)}
                          className={`
                            w-9 h-9 rounded-[12px] flex items-center justify-center text-sm transition-all relative
                            ${isSelected ? 'ring-2 ring-offset-2 ring-offset-[#0D1117] ring-[#C8A951] z-10' : ''}
                            ${hasEvents ? 'font-bold shadow-sm' : 'text-[#E6EDF3]'}
                          `}
                          style={hasEvents ? {
                            backgroundColor: getEventStyles(getEventsForDay(day)[0].category).bg,
                            border: `2px solid ${getEventStyles(getEventsForDay(day)[0].category).border}`,
                            color: getEventStyles(getEventsForDay(day)[0].category).text
                          } : {}}
                        >
                          {day}
                        </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Tasks / Events List */}
            <div>
              <h2 className="text-lg font-bold text-[#E6EDF3] mb-4 px-2">Próximos Eventos</h2>

              <div className="space-y-3 px-1">
                {upcomingEvents.length > 0 ? upcomingEvents.map(event => {
                  const eventDate = new Date(event.date);
                  const isToday = eventDate.getDate() === new Date().getDate() && eventDate.getMonth() === new Date().getMonth();

                  return (
                    <div
                      key={event.id}
                      onClick={() => onSelectEvent(event.id)}
                      className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex items-center gap-4 group hover:border-[#8B949E] transition-colors cursor-pointer"
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: getEventStyles(event.category).bg,
                          borderColor: getEventStyles(event.category).border,
                          color: getEventStyles(event.category).text
                        }}
                      >
                        {event.category === 'CASAMIENTO' ? '💍' : event.category === 'QUINCEANERA' ? '👑' : event.category === 'EGRESADO' ? '🎓' : '🎉'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-[#E6EDF3] font-medium truncate">{event.title}</h3>
                        <div className="text-[#8B949E] text-sm flex items-center gap-2">
                          <span>{new Date(event.date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-xs font-bold px-2 py-1 rounded border ${event.status === 'CONFIRMADO' ? 'bg-[#3FB950]/10 text-[#3FB950] border-[#3FB950]/20' :
                          event.status === 'SENA_EN_PROCESO' ? 'bg-[#C8A951]/10 text-[#C8A951] border-[#C8A951]/20' :
                            event.status === 'CANCELADO' ? 'bg-[#F85149]/10 text-[#F85149] border-[#F85149]/20' :
                              'bg-[#D29922]/10 text-[#D29922] border-[#D29922]/20'
                          }`}>
                          {event.status === 'CONFIRMADO' ? 'CONF' : event.status === 'SENA_EN_PROCESO' ? 'SEÑA' : event.status === 'CANCELADO' ? 'CANC' : 'P.SEÑAR'}
                        </span>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-8 text-[#8B949E]">
                    No hay eventos próximos registrados.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
