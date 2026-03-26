import React, { useMemo, useState } from 'react';
import { Search, Plus, Calendar, Phone, User as UserIcon, MessageSquare } from 'lucide-react';
import { type User } from '../../features/demo/demoShared';
import { Modal } from '../ui/Modal';

interface Inquiry {
  id: string;
  date: string;
  clientName: string;
  phone: string;
  eventType: string;
  eventDate?: string;
  status: 'PENDIENTE' | 'CONTACTADO' | 'REUNION' | 'PRESUPUESTO' | 'CONFIRMADA';
  observations: string;
  createdBy: 'Julia' | 'Mili';
}

const MOCK_INQUIRIES: Inquiry[] = [
  { id: '1', date: '2026-03-20', clientName: 'Ana García', phone: '351 555-1234', eventType: 'Casamiento', eventDate: '2027-01-15', status: 'PENDIENTE', observations: 'Preguntó por disponibilidad en enero.', createdBy: 'Julia' },
  { id: '2', date: '2026-03-21', clientName: 'Marcos López', phone: '351 555-5678', eventType: '15 Años', eventDate: '2026-11-20', status: 'PRESUPUESTO', observations: 'Enviado presupuesto Pack Premium.', createdBy: 'Mili' },
  { id: '3', date: '2026-03-22', clientName: 'Paula Ferreyra', phone: '351 555-1122', eventType: 'Cumpleaños', eventDate: '2026-09-12', status: 'CONFIRMADA', observations: 'Se confirmó visita al salón.', createdBy: 'Julia' },
  { id: '4', date: '2026-03-23', clientName: 'Nicolás Ríos', phone: '351 555-9988', eventType: 'Corporativo', eventDate: '2026-10-03', status: 'CONTACTADO', observations: 'Pidió opciones de menú corporativo.', createdBy: 'Mili' },
];

export const AveriguacionesView = ({ user }: { user: User }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    client: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Casamiento',
    vendor: user.role === 'MILI' ? 'Mili' : 'Julia'
  });

  const visibleInquiries = useMemo(() => {
    const roleFiltered = inquiries.filter(inquiry => {
      if (user.role === 'JULIA') return inquiry.createdBy === 'Julia';
      if (user.role === 'MILI') return inquiry.createdBy === 'Mili';
      return true;
    });

    return roleFiltered.filter(inquiry =>
      inquiry.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inquiries, searchTerm, user.role]);

  const canCreate = user.role !== 'MILI';

  const handleSaveInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquiries(prev => [
      {
        id: Date.now().toString(),
        date: inquiryForm.date,
        clientName: inquiryForm.client,
        phone: '351 555-0000',
        eventType: inquiryForm.type,
        eventDate: inquiryForm.date,
        status: 'PENDIENTE',
        observations: '',
        createdBy: inquiryForm.vendor as 'Julia' | 'Mili',
      },
      ...prev
    ]);
    setIsInquiryModalOpen(false);
    setInquiryForm({
      client: '',
      date: new Date().toISOString().split('T')[0],
      type: 'Casamiento',
      vendor: user.role === 'MILI' ? 'Mili' : 'Julia'
    });
  };

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-[#E6EDF3] tracking-tight">Averiguaciones</h1>
          <p className="text-xs text-[#8B949E] uppercase tracking-widest mt-1">
            {user.role === 'JULIA' ? 'Vista personal de Julia' : user.role === 'MILI' ? 'Vista personal de Mili' : 'Gestión general de consultas'}
          </p>
        </div>
        {canCreate && (
          <button onClick={() => setIsInquiryModalOpen(true)} className="w-full lg:w-auto bg-[#C8A951] text-[#0D1117] px-4 py-2 hover:bg-[#D4B96A] rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#C8A951]/10 uppercase text-xs tracking-widest">
            <Plus size={18} /> Nueva Consulta
          </button>
        )}
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-[#8B949E]" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#161B22] border border-[#30363D] rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-[#C8A951] outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleInquiries.map(inquiry => (
          <div key={inquiry.id} className="bg-[#161B22] border border-[#30363D] rounded-3xl p-6 hover:border-[#8B949E]/50 transition-all group overflow-hidden relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C8A951]/10 rounded-2xl flex items-center justify-center text-[#C8A951]">
                  <UserIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#E6EDF3] tracking-tight">{inquiry.clientName}</h3>
                  <p className="text-xs text-[#8B949E]">{inquiry.phone}</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-1 rounded bg-[#30363D] text-[#8B949E] border border-[#30363D]">
                {inquiry.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-xs text-[#8B949E]">
                <Calendar size={14} />
                <span>Fecha consulta: {new Date(inquiry.date).toLocaleDateString('es-AR')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8B949E]">
                <MessageSquare size={14} />
                <span className="font-bold text-[#E6EDF3]">{inquiry.eventType}</span>
                {inquiry.eventDate && <span> — Previsto: {new Date(inquiry.eventDate).toLocaleDateString('es-AR')}</span>}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#C8A951]">
                Hecha por: {inquiry.createdBy}
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button className="flex-1 bg-[#161B22] border border-[#30363D] text-[#E6EDF3] py-2 rounded-xl text-xs font-bold hover:bg-[#30363D] transition-all">Ver detalle</button>
              <button className="p-2 bg-[#1F6FEB]/10 text-[#1F6FEB] border border-[#1F6FEB]/30 rounded-xl hover:bg-[#1F6FEB]/20 transition-all"><Phone size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isInquiryModalOpen} onClose={() => setIsInquiryModalOpen(false)} title="Registrar Consulta">
        <form onSubmit={handleSaveInquiry} className="space-y-4">
          <div>
            <label className="block text-[#8B949E] text-[10px] font-black uppercase tracking-widest mb-1">Nombre del Cliente / Pareja</label>
            <input
              required
              type="text"
              value={inquiryForm.client}
              onChange={e => setInquiryForm({ ...inquiryForm, client: e.target.value })}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8B949E] text-[10px] font-black uppercase tracking-widest mb-1">Día de Visita</label>
              <input
                required
                type="date"
                value={inquiryForm.date}
                onChange={e => setInquiryForm({ ...inquiryForm, date: e.target.value })}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] outline-none"
              />
            </div>
            <div>
              <label className="block text-[#8B949E] text-[10px] font-black uppercase tracking-widest mb-1">Tipo de Evento</label>
              <select
                value={inquiryForm.type}
                onChange={e => setInquiryForm({ ...inquiryForm, type: e.target.value })}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] outline-none"
              >
                <option>Casamiento</option>
                <option>15 años</option>
                <option>Cumpleaños</option>
                <option>Corporativo</option>
                <option>Egresados</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[#8B949E] text-[10px] font-black uppercase tracking-widest mb-1">Atendido por</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-[#E6EDF3]">
                <input type="radio" value="Julia" checked={inquiryForm.vendor === 'Julia'} onChange={e => setInquiryForm({ ...inquiryForm, vendor: e.target.value })} className="accent-[#C8A951]" /> Julia
              </label>
              <label className="flex items-center gap-2 text-sm text-[#E6EDF3]">
                <input type="radio" value="Mili" checked={inquiryForm.vendor === 'Mili'} onChange={e => setInquiryForm({ ...inquiryForm, vendor: e.target.value })} className="accent-[#C8A951]" /> Mili
              </label>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[#30363D]">
            <button type="button" onClick={() => setIsInquiryModalOpen(false)} className="px-4 py-2 text-[#8B949E] hover:text-[#E6EDF3] text-sm font-bold">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-[#C8A951] text-[#0D1117] rounded-lg text-sm font-bold hover:scale-105 transition-transform shadow-lg shadow-[#C8A951]/20">
              Registrar consulta
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
