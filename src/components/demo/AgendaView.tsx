import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, BarChart3, Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, CreditCard, DollarSign, Edit2, FileText, Filter, Mail, MapPin, Package, Phone, Plus, Printer, Scale, Search, Tag, Trash2, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CATALOG_DATA, EVENTS_DATA, PACK_PREMIUM_ITEMS, USERS, formatCurrency, type EventCategory, type EventStatus, type ServiceItem, type User } from "../../features/demo/demoShared";
import { Modal } from "../ui/Modal";


export const AgendaView = ({ onSelectEvent }: { onSelectEvent: (id: string) => void }) => {
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

  const getEventColor = (category: EventCategory) => {
    switch (category) {
      case 'QUINCEANERA': return 'bg-[#E91E8C]/20 border-l-2 border-[#E91E8C] text-[#E6EDF3]';
      case 'CASAMIENTO': return 'bg-[#1F6FEB]/20 border-l-2 border-[#1F6FEB] text-[#E6EDF3]';
      case 'CUMPLEANOS': return 'bg-[#C8A951]/20 border-l-2 border-[#C8A951] text-[#E6EDF3]';
      case 'CORPORATIVO': return 'bg-[#6B7280]/20 border-l-2 border-[#6B7280] text-[#E6EDF3]';
      case 'EGRESADO': return 'bg-[#8B5CF6]/20 border-l-2 border-[#8B5CF6] text-[#E6EDF3]';
      case 'ANIVERSARIO': return 'bg-[#00D1FF]/20 border-l-2 border-[#00D1FF] text-[#E6EDF3]';
      case 'OTRO': return 'bg-[#22C55E]/20 border-l-2 border-[#22C55E] text-[#E6EDF3]';
      default: return 'bg-[#8B949E]/20 border-l-2 border-[#8B949E] text-[#E6EDF3]';
    }
  };

  const getCategoryColorHex = (cat?: EventCategory) => {
    switch (cat) {
      case 'QUINCEANERA': return '#E91E8C';
      case 'CASAMIENTO': return '#1F6FEB';
      case 'CUMPLEANOS': return '#C8A951';
      case 'CORPORATIVO': return '#6B7280';
      case 'EGRESADO': return '#8B5CF6';
      case 'ANIVERSARIO': return '#00D1FF';
      case 'OTRO': return '#22C55E';
      default: return '#8B949E';
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
                <option value="CASAMIENTO">Casamiento (Azul)</option>
                <option value="QUINCEANERA">15 Años (Rosa)</option>
                <option value="CUMPLEANOS">Cumpleaños (Dorado)</option>
                <option value="CORPORATIVO">Corporativo (Gris)</option>
                <option value="EGRESADO">Egresado (Violeta)</option>
                <option value="OTRO">Otro (Verde)</option>
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
                  onClick={() => handleMonthClick(index)}
                  className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 hover:border-[#8B949E] cursor-pointer transition-all group relative overflow-hidden"
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
                          <div
                            className={`w-7 h-7 rounded-[8px] flex items-center justify-center text-[11px] transition-all
                              ${hasEvents ? 'font-bold text-white shadow-md z-10' : 'text-[#8B949E] hover:bg-[#30363D]/30'}`}
                            style={hasEvents ? { 
                              backgroundColor: event?.status === 'CONFIRMADO' ? '#22C55E' : `${getCategoryColorHex(event?.category)}D9` 
                            } : {}}
                          >
                            {day}
                          </div>
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
          <div className="hidden lg:flex flex-1 bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden flex-col">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-7 border-b border-[#30363D] bg-[#0D1117]">
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                    <div key={day} className="py-3 text-center text-sm font-medium text-[#8B949E] uppercase tracking-wider">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-fr h-[calc(100vh-280px)] min-h-[500px]">
                  {blanks.map((_, i) => (
                    <div key={`blank-${i}`} className="border-b border-r border-[#30363D] bg-[#0D1117]/30 min-h-[100px]" />
                  ))}
                  {days.map(day => {
                    const dayEvents = getEventsForDay(day);
                    return (
                      <div key={day} className="border-b border-r border-[#30363D] p-2 min-h-[100px] relative group hover:bg-[#30363D]/10 transition-colors">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all mb-2
                            ${dayEvents.length > 0 ? 'font-bold text-white shadow-sm' : 'text-[#8B949E]'}`}
                          style={dayEvents.length > 0 ? { backgroundColor: getCategoryColorHex(dayEvents[0].category) } : {}}
                        >
                          {day}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dayEvents.map(event => (
                            <div
                              key={event.id}
                              onClick={(e) => { e.stopPropagation(); onSelectEvent(event.id); }}
                              className={`w-full text-[11px] p-2 rounded-lg mb-1 cursor-pointer hover:brightness-110 transition-all border border-white/5 shadow-sm group ${getEventColor(event.category)}`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <div className="font-bold truncate leading-tight flex-1 text-[#E6EDF3] group-hover:text-white">
                                  {event.responsable}
                                </div>
                                <span className={`${event.balance > 0 ? 'text-[#3FB950]' : 'text-[#8B949E]'} font-bold text-[12px] leading-none`}>$</span>
                              </div>
                              <div className="mt-1.5 flex items-center justify-between">
                                <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-tighter bg-white/10 text-white/90 border border-white/5`}>
                                  {event.status === 'POR_SENAR' ? 'POR SEÑAR' : event.status === 'SENA_EN_PROCESO' ? 'SEÑA EN PROC.' : event.status}
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
                    <div key={`end-blank-${i}`} className="border-b border-r border-[#30363D] bg-[#0D1117]/30 min-h-[100px]" />
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
                          w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all relative
                          ${isSelected ? 'ring-2 ring-offset-2 ring-offset-[#0D1117] ring-[#C8A951] z-10' : ''}
                          ${hasEvents ? 'font-bold text-white shadow-sm' : 'text-[#E6EDF3]'}
                        `}
                        style={hasEvents ? { backgroundColor: getCategoryColorHex(getEventsForDay(day)[0].category) } : {}}
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
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${event.category === 'CASAMIENTO' ? 'bg-[#1F6FEB]/20 text-[#1F6FEB]' :
                        event.category === 'QUINCEANERA' ? 'bg-[#E91E8C]/20 text-[#E91E8C]' :
                          event.category === 'CUMPLEANOS' ? 'bg-[#C8A951]/20 text-[#C8A951]' :
                            event.category === 'CORPORATIVO' ? 'bg-[#6B7280]/20 text-[#6B7280]' :
                              event.category === 'EGRESADO' ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]' :
                                'bg-[#22C55E]/20 text-[#22C55E]'
                        }`}>
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
