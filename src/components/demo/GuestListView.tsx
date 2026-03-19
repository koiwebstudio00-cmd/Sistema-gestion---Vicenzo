import React, { useState, useMemo } from "react";
import { Users, Search, CheckCircle, Clock, AlertTriangle, Calendar, Info, Lock, ChevronRight, FileText, X } from "lucide-react";
import { formatCurrency, GUESTS_MOCK, type Guest, type User } from "../../features/demo/demoShared";

export const GuestListView = ({ user }: { user: User }) => {
  const [activeTab, setActiveTab] = useState<'A-Z' | 'TABLES'>('A-Z');
  const [searchTerm, setSearchTerm] = useState('');
  const [guests, setGuests] = useState<Guest[]>(GUESTS_MOCK);
  const [isPlanillaOpen, setIsPlanillaOpen] = useState(false);
  
  // Simulation of business logic
  const paidCards = 30; // Mocked low to show alert if needed
  const loadedGuests = guests.length;
  const inCount = guests.filter(g => g.present).length;
  const isOverLimit = loadedGuests > paidCards;

  // Deadline logic (Mock 20/03/2025)
  const deadline = "20/03/2025";
  const isDeadlinePassed = false; 

  const togglePresence = (id: string) => {
    setGuests(prev => prev.map(g => 
      g.id === id ? { ...g, present: !g.present } : g
    ));
  };

  const filteredGuests = useMemo(() => {
    return guests.filter(g => 
      g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [guests, searchTerm]);

  const sortedAZ = useMemo(() => {
    const honors = filteredGuests.filter(g => g.type === 'HONOR');
    const others = filteredGuests.filter(g => g.type !== 'HONOR').sort((a,b) => a.name.localeCompare(b.name));
    return [...honors, ...others];
  }, [filteredGuests]);

  const groupedByTable = useMemo(() => {
    const tableGuests = filteredGuests.filter(g => g.type === 'ADULT' && g.table);
    const groups: { [key: number]: Guest[] } = {};
    tableGuests.forEach(g => {
      if (!groups[g.table!]) groups[g.table!] = [];
      groups[g.table!].push(g);
    });
    return groups;
  }, [filteredGuests]);

  const sortedTables = Object.keys(groupedByTable).map(Number).sort((a,b) => a - b);

  const getGuestColor = (type: Guest['type']) => {
    switch(type) {
      case 'HONOR': return '#C8A951';
      case 'ADULT': return '#1F6FEB';
      case 'YOUNG': return '#E91E8C';
      case 'AFTER_1AM': return '#8B5CF6';
      default: return '#8B949E';
    }
  };

  const PlanillaContent = () => (
    <div className="space-y-6">
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
        <h3 className="text-xs font-black text-[#C8A951] uppercase tracking-widest mb-6 flex items-center gap-2">
          <Clock size={16} /> Planilla Operativa
        </h3>
        <div className="space-y-4 text-xs">
          {[
            { label: 'Evento', value: '15 de Valentina Suárez' },
            { label: 'Fecha', value: 'Viernes 07/03/2025' },
            { label: 'Horario', value: '21:00 a 04:00' },
            { label: 'Salón', value: 'Vicenzo' }
          ].map((item, i) => (
            <div key={i} className="flex justify-between border-b border-[#30363D]/50 pb-2">
              <span className="text-[#8B949E] uppercase tracking-wider">{item.label}</span>
              <span className="font-bold text-[#E6EDF3]">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-[#C8A951]/5 border border-[#C8A951]/20 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-20"><FileText size={40} /></div>
          <h4 className="text-[10px] font-black uppercase text-[#C8A951] mb-2 flex items-center gap-1">
            <span>📝</span> Observaciones Salón
          </h4>
          <p className="text-[11px] text-[#8B949E] leading-relaxed italic relative z-10">
            "La torta ingresa por técnica a las 19hs. El cotillón se entrega a las 02:30 hs. Mantener aire acondicionado a 22 grados."
          </p>
        </div>
      </div>
      
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
        <h4 className="text-[10px] font-black uppercase text-[#8B949E] mb-4">Información Adicional</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <Users size={14} className="text-[#1F6FEB]" />
            <span className="text-[#8B949E]">Mozos cargados:</span>
            <span className="font-bold">6</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3] animate-in fade-in duration-500">
      {/* Mobile Drawer/Modal for Planilla */}
      {isPlanillaOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#30363D] w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#E6EDF3]">Detalles del Evento</h2>
              <button onClick={() => setIsPlanillaOpen(false)} className="p-2 text-[#8B949E] hover:text-[#E6EDF3]"><X size={24} /></button>
            </div>
            <PlanillaContent />
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
              <h1 className="text-3xl font-display font-black text-[#E6EDF3]">
                15 DE VALENTINA <br /><span className="text-[#C8A951]">07-03-2025</span>
              </h1>
              <div className="bg-[#161B22] border border-[#30363D] px-4 py-2 rounded-2xl flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xs font-black text-[#3FB950]">{inCount} / {loadedGuests}</div>
                  <div className="text-[8px] font-black uppercase text-[#8B949E] tracking-widest">Ingresaron</div>
                </div>
                <div className="w-[1px] h-6 bg-[#30363D]" />
                <Users size={20} className="text-[#3FB950]" />
              </div>
            </div>
            
            <button 
              onClick={() => setIsPlanillaOpen(true)}
              className="lg:hidden w-full py-3 bg-[#1F6FEB]/10 text-[#1F6FEB] border border-[#1F6FEB]/20 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 mb-6"
            >
              <FileText size={16} /> Ver Planilla Operativa
            </button>
          </div>

          {/* Controls */}
          <div className="mb-8 space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-[#8B949E]" size={20} />
              <input 
                type="text"
                placeholder="Buscar invitado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#161B22] border border-[#30363D] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-[#E6EDF3] focus:border-[#C8A951] outline-none transition-all shadow-inner"
              />
            </div>
            <div className="flex items-center gap-2 px-2">
              {isDeadlinePassed ? (
                <div className="flex items-center gap-1.5 text-[#F85149] text-[9px] font-black uppercase tracking-widest">
                  <Lock size={12} /> Carga bloqueada (venció {deadline}). Contactá al salón.
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[#8B949E] text-[9px] font-black uppercase tracking-widest">
                  <Calendar size={12} /> Carga abierta hasta: {deadline}
                </div>
              )}
            </div>
          </div>

          {/* Quota Alert */}
          {isOverLimit && (
            <div className="mb-8 bg-[#F85149]/10 border border-[#F85149]/30 p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-left-2">
              <div className="w-10 h-10 rounded-full bg-[#F85149]/20 flex items-center justify-center text-[#F85149]">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#F85149] uppercase tracking-wide">Alerta de cupo excedido</h4>
                <p className="text-[10px] text-[#F85149]/80 font-medium leading-tight">
                  Hay {loadedGuests} invitados pero solo se pagaron {paidCards} tarjetas. Avisar a Franco.
                </p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-6 mb-8 border-b border-[#30363D]">
            <button 
              onClick={() => setActiveTab('A-AZ')} // Typo fix to A-Z
              className={`pb-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'A-Z' || activeTab === 'A-AZ' ? 'text-[#C8A951]' : 'text-[#8B949E] opacity-50'}`}
            >
              Orden Alfabético
              {(activeTab === 'A-Z' || activeTab === 'A-AZ') && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#C8A951]" />}
            </button>
            <button 
              onClick={() => setActiveTab('TABLES')}
              className={`pb-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'TABLES' ? 'text-[#C8A951]' : 'text-[#8B949E] opacity-50'}`}
            >
              Por Número de Mesa
              {activeTab === 'TABLES' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#C8A951]" />}
            </button>
          </div>

          {/* Main List Container */}
          <div className="space-y-4 mb-20">
            {activeTab !== 'TABLES' ? (
              // Alphabetical List
              <div className="grid grid-cols-1 gap-3">
                {sortedAZ.map((g) => (
                  <div 
                    key={g.id} 
                    className={`group px-6 py-4 flex items-center justify-between bg-[#161B22] border border-[#30363D] rounded-2xl transition-all duration-300 ${g.present ? 'opacity-40 border-transparent scale-[0.98]' : 'hover:border-[#C8A951]/50 hover:shadow-xl'}`}
                  >
                    <div className="flex items-center gap-5">
                      <div 
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs font-black border-2 transition-transform group-hover:scale-110"
                        style={{ 
                          backgroundColor: `${getGuestColor(g.type)}15`,
                          borderColor: `${getGuestColor(g.type)}40`,
                          color: getGuestColor(g.type)
                        }}
                      >
                        {g.type === 'HONOR' ? 'H' : g.table || 'J'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-sm sm:text-base font-bold truncate transition-all ${g.present ? 'line-through decoration-[#E6EDF3]/40 text-[#8B949E]' : 'text-[#E6EDF3]'}`}>
                          {g.name}
                        </span>
                        <span 
                          className="text-[9px] font-black uppercase tracking-[0.15em] mt-0.5"
                          style={{ color: getGuestColor(g.type) }}
                        >
                          {g.type === 'HONOR' ? 'Quinceañera' : g.type === 'ADULT' ? `Mesa ${g.table}` : g.type === 'YOUNG' ? 'Joven' : 'After 1 AM'}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => togglePresence(g.id)}
                      className={`min-w-[44px] min-h-[44px] rounded-2xl border flex items-center justify-center transition-all ${
                        g.present 
                          ? 'bg-[#3FB950] border-[#3FB950] text-[#0D1117] shadow-[0_0_20px_rgba(63,185,80,0.3)]' 
                          : 'bg-transparent border-[#30363D] text-[#30363D] hover:border-[#3FB950] hover:text-[#3FB950]'
                      }`}
                    >
                      <CheckCircle size={22} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              // Table Grouped List
              <div className="space-y-10">
                {sortedTables.map(table => (
                  <div key={table} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#30363D]" />
                      <span className="text-[10px] font-black text-[#C8A951] uppercase tracking-[0.3em]">MESAS {table}</span>
                      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#30363D]" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {groupedByTable[table].map((g) => (
                        <div 
                          key={g.id} 
                          className={`group px-6 py-4 flex items-center justify-between bg-[#161B22] border border-[#30363D] rounded-2xl transition-all ${g.present ? 'opacity-40 border-transparent' : 'hover:border-[#1F6FEB]'}`}
                        >
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-[#1F6FEB]/10 border border-[#1F6FEB]/30 flex items-center justify-center text-[#1F6FEB] text-[10px] font-black">
                               {g.name[0]}
                             </div>
                             <span className={`text-sm font-bold truncate ${g.present ? 'line-through text-[#8B949E]' : 'text-[#E6EDF3]'}`}>
                               {g.name}
                             </span>
                          </div>
                          <button 
                            onClick={() => togglePresence(g.id)}
                            className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-all ${
                              g.present ? 'text-[#3FB950]' : 'text-[#30363D]'
                            }`}
                          >
                            <CheckCircle size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {(activeTab === 'TABLES' ? sortedTables : sortedAZ).length === 0 && (
              <div className="p-20 text-center bg-[#161B22] border border-dashed border-[#30363D] rounded-3xl">
                <Search className="mx-auto text-[#30363D] mb-4" size={48} />
                <p className="text-[#8B949E] font-medium">No se encontraron invitados para "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Desktop Only */}
        <div className="hidden lg:block w-full xl:w-[320px] shrink-0 sticky top-8 h-fit">
          <PlanillaContent />
        </div>
      </div>
    </div>
  );
};
