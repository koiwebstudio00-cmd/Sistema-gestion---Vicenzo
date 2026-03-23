import React, { useState, useMemo } from "react";
import { Users, Search, CheckCircle, Clock, FileText, X, Plus, Trash2, LayoutGrid, List, MessageSquare } from "lucide-react";
import { GUESTS_MOCK, type Guest, type User } from "../../features/demo/demoShared";

export const GuestListView = ({ user }: { user: User }) => {
  const [activeMainTab, setActiveMainTab] = useState<'A-Z' | 'TABLES'>('A-Z');
  const [activeSubTab, setActiveSubTab] = useState<'ADULTS' | 'YOUNG'>('ADULTS');
  const [searchTerm, setSearchTerm] = useState('');
  const [guests, setGuests] = useState<Guest[]>(GUESTS_MOCK);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [newGuest, setNewGuest] = useState<{name: string, type: Guest['type'], table: string}>({
    name: '',
    type: 'ADULT',
    table: ''
  });

  const togglePresence = (id: string) => {
    setGuests(prev => prev.map(g => 
      g.id === id ? { ...g, present: !g.present } : g
    ));
  };

  const addGuest = () => {
    if (!newGuest.name) return;
    const guest: Guest = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGuest.name,
      type: newGuest.type,
      table: newGuest.type === 'ADULT' ? parseInt(newGuest.table) || 1 : undefined,
      present: false
    };
    setGuests([...guests, guest]);
    setNewGuest({ name: '', type: 'ADULT', table: '' });
    setShowAddModal(false);
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  // Counters
  const adultGuests = guests.filter(g => g.type === 'ADULT' || g.type === 'HONOR');
  const youngGuests = guests.filter(g => g.type === 'YOUNG' || g.type === 'AFTER_1AM');
  
  const stats = {
    adultsIn: adultGuests.filter(g => g.present).length,
    adultsTotal: adultGuests.length,
    youngIn: youngGuests.filter(g => g.present).length,
    youngTotal: youngGuests.length,
  };

  const filteredGuests = useMemo(() => {
    return guests.filter(g => 
      g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [guests, searchTerm]);

  const sortedAZ = useMemo(() => {
    return [...filteredGuests].sort((a,b) => a.name.localeCompare(b.name));
  }, [filteredGuests]);

  const groupedByTable = useMemo(() => {
    const tableGuests = guests.filter(g => (g.type === 'ADULT' || g.type === 'HONOR') && g.table);
    const groups: { [key: number]: Guest[] } = {};
    tableGuests.forEach(g => {
      if (!groups[g.table!]) groups[g.table!] = [];
      groups[g.table!].push(g);
    });
    return groups;
  }, [guests]);

  const sortedTables = Object.keys(groupedByTable).map(Number).sort((a,b) => a - b);

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3] animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto pb-24">
        
        {/* Header & Counters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-display font-black text-[#E6EDF3] tracking-tighter">LISTA DE INVITADOS</h1>
            <p className="text-[#8B949E] text-xs font-bold uppercase tracking-widest mt-1">15 de Valentina — 07/03/2026</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-[#161B22] border border-[#30363D] p-4 rounded-2xl flex flex-col items-center min-w-[120px]">
              <span className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest mb-1">Adultos</span>
              <div className="text-xl font-display font-black text-[#1F6FEB]">{stats.adultsIn} <span className="text-[#30363D]">/</span> {stats.adultsTotal}</div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] p-4 rounded-2xl flex flex-col items-center min-w-[120px]">
              <span className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest mb-1">Jóvenes</span>
              <div className="text-xl font-display font-black text-[#E91E8C]">{stats.youngIn} <span className="text-[#30363D]">/</span> {stats.youngTotal}</div>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#30363D]" size={20} />
            <input 
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#161B22] border border-[#30363D] rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-[#C8A951] outline-none transition-all shadow-inner"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="h-[58px] px-6 bg-[#3FB950] text-[#0D1117] rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-[#3FB950]/10"
          >
            <Plus size={20} /> Cargar Invitado
          </button>
        </div>

        {/* Main Tabs */}
        <div className="flex border-b border-[#30363D] mb-8">
          <button 
            onClick={() => setActiveMainTab('A-Z')}
            className={`flex items-center gap-2 px-6 py-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${activeMainTab === 'A-Z' ? 'text-[#C8A951] border-[#C8A951]' : 'text-[#8B949E] border-transparent opacity-50'}`}
          >
            <List size={16} /> Orden Alfabético
          </button>
          <button 
            onClick={() => setActiveMainTab('TABLES')}
            className={`flex items-center gap-2 px-6 py-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${activeMainTab === 'TABLES' ? 'text-[#C8A951] border-[#C8A951]' : 'text-[#8B949E] border-transparent opacity-50'}`}
          >
            <LayoutGrid size={16} /> Por Número de Mesa
          </button>
        </div>

        {/* Content Area */}
        {activeMainTab === 'A-Z' ? (
          <div className="space-y-6">
            {/* Sub Tabs */}
            <div className="flex gap-2 p-1 bg-[#161B22] border border-[#30363D] rounded-xl w-fit">
              <button 
                onClick={() => setActiveSubTab('ADULTS')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'ADULTS' ? 'bg-[#1F6FEB] text-white' : 'text-[#8B949E] hover:text-[#E6EDF3]'}`}
              >
                Adultos
              </button>
              <button 
                onClick={() => setActiveSubTab('YOUNG')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'YOUNG' ? 'bg-[#E91E8C] text-white' : 'text-[#8B949E] hover:text-[#E6EDF3]'}`}
              >
                Jóvenes / After
              </button>
            </div>

            {/* List A-Z */}
            <div className="grid grid-cols-1 gap-3">
              {sortedAZ
                .filter(g => activeSubTab === 'ADULTS' 
                  ? (g.type === 'ADULT' || g.type === 'HONOR')
                  : (g.type === 'YOUNG' || g.type === 'AFTER_1AM')
                )
                .map(g => (
                  <div 
                    key={g.id} 
                    className={`flex items-center justify-between p-5 bg-[#161B22] border border-[#30363D] rounded-2xl transition-all ${g.present ? 'bg-[#3FB950]/5 border-[#3FB950]/20' : 'hover:border-[#C8A951]/40'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black ${g.type === 'ADULT' || g.type === 'HONOR' ? 'bg-[#1F6FEB]/10 text-[#1F6FEB] border border-[#1F6FEB]/20' : 'bg-[#E91E8C]/10 text-[#E91E8C] border border-[#E91E8C]/20'}`}>
                         {activeSubTab === 'ADULTS' ? (
                           <>
                            <span className="text-[8px] uppercase opacity-60">Mesa</span>
                            <span className="text-lg leading-none">{g.table || '—'}</span>
                           </>
                         ) : (
                           <Users size={18} />
                         )}
                      </div>
                      <div>
                        <div className={`font-black uppercase tracking-tight ${g.present ? 'text-[#3FB950] line-through opacity-70' : 'text-[#E6EDF3]'}`}>{g.name}</div>
                        <div className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest">{g.type}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <button onClick={() => removeGuest(g.id)} className="p-3 text-[#30363D] hover:text-[#F85149] transition-colors"><Trash2 size={16} /></button>
                       {user.role !== 'INVITADO' && (
                         <button 
                           onClick={() => togglePresence(g.id)}
                           className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${g.present ? 'bg-[#3FB950] border-[#3FB950] text-[#0D1117] shadow-lg shadow-[#3FB950]/20' : 'border-[#30363D] text-[#30363D] hover:border-[#3FB950] hover:text-[#3FB950]'}`}
                         >
                           <CheckCircle size={24} />
                         </button>
                       )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          /* Table Groups (No checkboxes as per request) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTables.map(tableNum => (
              <div key={tableNum} className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-[#1C2128] px-4 py-3 border-b border-[#30363D] flex items-center justify-between">
                  <span className="text-xs font-black text-[#C8A951] uppercase tracking-[0.2em]">Mesa {tableNum}</span>
                  <span className="text-[10px] font-bold text-[#8B949E]">{groupedByTable[tableNum].length} pers</span>
                </div>
                <div className="p-4 space-y-2">
                  {groupedByTable[tableNum].map(g => (
                    <div key={g.id} className="flex items-center justify-between py-1 border-b border-[#30363D]/30 last:border-0">
                      <span className={`text-xs font-bold ${g.present ? 'text-[#3FB950] line-through opacity-60' : 'text-[#8B949E]'}`}>{g.name}</span>
                      {g.present && <CheckCircle size={10} className="text-[#3FB950]" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0D1117]/90 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="bg-[#161B22] border border-[#30363D] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#30363D] flex items-center justify-between bg-[#1C2128]">
              <h3 className="text-sm font-black text-[#E6EDF3] uppercase tracking-widest flex items-center gap-2">
                <Plus size={18} className="text-[#3FB950]" /> Cargar Nuevo Invitado
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#8B949E] hover:text-[#E6EDF3] transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Type Switcher */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">¿Qué tipo de invitado es?</label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#0D1117] rounded-2xl border border-[#30363D]">
                  <button onClick={() => setNewGuest({...newGuest, type: 'ADULT'})} className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${newGuest.type === 'ADULT' ? 'bg-[#1F6FEB] text-white shadow-lg shadow-[#1F6FEB]/20' : 'text-[#8B949E] hover:text-[#E6EDF3]'}`}>Adulto</button>
                  <button onClick={() => setNewGuest({...newGuest, type: 'YOUNG'})} className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${newGuest.type === 'YOUNG' ? 'bg-[#E91E8C] text-white shadow-lg shadow-[#E91E8C]/20' : 'text-[#8B949E] hover:text-[#E6EDF3]'}`}>Joven</button>
                  <button onClick={() => setNewGuest({...newGuest, type: 'AFTER_1AM'})} className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${newGuest.type === 'AFTER_1AM' ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20' : 'text-[#8B949E] hover:text-[#E6EDF3]'}`}>After 1AM</button>
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Nombre Completo</label>
                <input 
                  type="text" 
                  autoFocus
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-2xl px-5 py-4 text-base font-bold text-[#E6EDF3] outline-none focus:border-[#C8A951] transition-all"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              {/* Table Input (Only for Adults) */}
              {newGuest.type === 'ADULT' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Número de Mesa</label>
                  <input 
                    type="number" 
                    value={newGuest.table}
                    onChange={(e) => setNewGuest({...newGuest, table: e.target.value})}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-2xl px-5 py-4 text-center text-3xl font-display font-black text-[#C8A951] outline-none focus:border-[#C8A951] transition-all"
                    placeholder="0"
                  />
                </div>
              )}

              <button 
                onClick={addGuest}
                disabled={!newGuest.name || (newGuest.type === 'ADULT' && !newGuest.table)}
                className="w-full bg-[#3FB950] text-[#0D1117] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-[#3FB950]/20 disabled:opacity-20 disabled:pointer-events-none"
              >
                Sumar a la lista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
