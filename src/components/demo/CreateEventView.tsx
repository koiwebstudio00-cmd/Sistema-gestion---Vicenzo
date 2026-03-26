import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  User, 
  Phone, 
  Plus, 
  Trash2, 
  Info,
  Building,
  Heart,
  Crown,
  FileText
} from 'lucide-react';
import { EventCategory, EventStatus, formatCurrency } from '../../features/demo/demoShared';

interface CreateEventViewProps {
  onBack: () => void;
  onSave?: (event: any) => void;
}

export const CreateEventView: React.FC<CreateEventViewProps> = ({ onBack, onSave }) => {
  // --- STATE ---
  const [formData, setFormData] = useState({
    // Datos Generales
    title: '',
    category: 'CUMPLEANOS' as EventCategory,
    salon: 'Vicenzo' as 'Vicenzo' | 'Casita San Javier',
    vendedor: '',
    startDate: '',
    startTime: '21:00',
    endDate: '',
    endTime: '05:00',
    
    // Campos Condicionales (15 años)
    quinceaneraName: '',
    school: '',
    fatherName: '',
    motherName: '',
    
    // Campos Condicionales (Casamiento)
    partner1Name: '',
    partner2Name: '',
    partner1Father: '',
    partner1Mother: '',
    partner2Father: '',
    partner2Mother: '',
    
    // Datos del Cliente
    responsable: '',
    address: '',
    dni: '',
    cuit: '',
    phones: [''],
    decoratorName: '',
    decoratorPhone: '',
    
    // Invitados
    salonMinGuests: 150,
    adultGuests: 0,
    youngGuests: 0,
    
    // Alquiler
    alquilerTotal: '',
    alquilerSena: '2000000',
    
    // Estado Inicial
    status: 'POR_SENAR' as EventStatus
  });

  // --- DERIVED STATE ---
  const totalGuests = Number(formData.adultGuests) + Number(formData.youngGuests);

  // --- HANDLERS ---
  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...formData.phones];
    newPhones[index] = value;
    setFormData({ ...formData, phones: newPhones });
  };

  const addPhone = () => {
    setFormData({ ...formData, phones: [...formData.phones, ''] });
  };

  const removePhone = (index: number) => {
    if (formData.phones.length > 1) {
      const newPhones = formData.phones.filter((_, i) => i !== index);
      setFormData({ ...formData, phones: newPhones });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
  };

  // --- AUTOMATION ---
  useEffect(() => {
    const total = Number(formData.alquilerTotal) || 0;
    const sena = Number(formData.alquilerSena) || 0;
    
    if (total > 0 && !formData.alquilerSena) {
      setFormData(prev => ({ ...prev, alquilerSena: '2000000' }));
      return;
    }

    // Auto-status logic
    if (formData.status !== 'CANCELADO') {
      let nextStatus: EventStatus = 'POR_SENAR';
      if (sena > 0) {
        if (sena >= total && total > 0) {
          nextStatus = 'CONFIRMADO';
        } else {
          nextStatus = 'SENA_EN_PROCESO';
        }
      }
      
      if (formData.status !== nextStatus) {
        setFormData(prev => ({ ...prev, status: nextStatus }));
      }
    }
  }, [formData.alquilerTotal, formData.alquilerSena, formData.status]);

  // Helper for Section Titles
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-6 mt-8 opacity-50">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#30363D]"></div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{title}</span>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#30363D]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] pb-20">
      {/* Header Fijo */}
      <div className="sticky top-0 z-50 bg-[#0D1117]/80 backdrop-blur-md border-b border-[#30363D] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-[#30363D] rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-display font-bold">Nuevo Evento</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-[#8B949E] hover:text-[#E6EDF3] transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              className="bg-[#C8A951] hover:bg-[#D4B96A] text-[#0D1117] px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-[#C8A951]/10"
            >
              Guardar evento
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-4">
        <form onSubmit={handleSubmit}>
          
          {/* --- DATOS GENERALES --- */}
          <SectionHeader title="Datos Generales" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#161B22] p-8 rounded-2xl border border-[#30363D]">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Nombre del evento</label>
              <input 
                type="text"
                placeholder="Ej: Casamiento Rodríguez - Pérez"
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] focus:ring-1 focus:ring-[#C8A951]/20 outline-none transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Tipo de evento</label>
              <select 
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as EventCategory})}
              >
                <option value="CUMPLEANOS">Cumpleaños</option>
                <option value="15_ANOS">15 Años</option>
                <option value="CASAMIENTO">Casamiento</option>
                <option value="CORPORATIVO">Corporativo</option>
                <option value="EGRESADO">Egresado</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Presupuesto por (Vendedor)</label>
              <select 
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none"
                value={formData.vendedor}
                onChange={e => setFormData({...formData, vendedor: e.target.value})}
              >
                <option value="">Seleccionar...</option>
                <option value="Mili">Mili</option>
                <option value="Julia">Julia</option>
                <option value="Franco">Franco</option>
                <option value="Hernán">Hernán</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Salón</label>
              <select 
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none"
                value={formData.salon}
                onChange={e => setFormData({...formData, salon: e.target.value as any})}
              >
                <option value="Vicenzo">Vicenzo</option>
                <option value="Casita San Javier">Casita San Javier</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Fecha Inicio</label>
                <input 
                  type="date"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Hora Inicio</label>
                <input 
                  type="time"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none"
                  value={formData.startTime}
                  onChange={e => setFormData({...formData, startTime: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Fecha Fin</label>
                <input 
                  type="date"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none"
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Hora Fin</label>
                <input 
                  type="time"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none"
                  value={formData.endTime}
                  onChange={e => setFormData({...formData, endTime: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* --- CAMPOS CONDICIONALES --- */}
          {formData.category === '15_ANOS' && (
            <>
              <SectionHeader title="Datos de la Quinceañera" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#161B22] p-8 rounded-2xl border border-[#30363D] animate-in fade-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Nombre de la quinceañera</label>
                  <input type="text" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none" value={formData.quinceaneraName} onChange={e => setFormData({...formData, quinceaneraName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Colegio</label>
                  <input type="text" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none" value={formData.school} onChange={e => setFormData({...formData, school: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Nombre del padre</label>
                  <input type="text" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Nombre de la madre</label>
                  <input type="text" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none" value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} />
                </div>
              </div>
            </>
          )}

          {formData.category === 'CASAMIENTO' && (
            <>
              <SectionHeader title="Datos del Casamiento" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#161B22] p-8 rounded-2xl border border-[#30363D] animate-in fade-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Nombre novio/a 1</label>
                  <input type="text" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none" value={formData.partner1Name} onChange={e => setFormData({...formData, partner1Name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Nombre novio/a 2</label>
                  <input type="text" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none" value={formData.partner2Name} onChange={e => setFormData({...formData, partner2Name: e.target.value})} />
                </div>
                <div className="p-4 bg-[#0D1117] rounded-xl border border-[#30363D] space-y-4">
                  <h4 className="text-[10px] uppercase font-black text-[#8B949E]">Padres de novio/a 1</h4>
                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1">Padre</label>
                    <input type="text" className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 outline-none focus:border-[#C8A951]" value={formData.partner1Father} onChange={e => setFormData({...formData, partner1Father: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1">Madre</label>
                    <input type="text" className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 outline-none focus:border-[#C8A951]" value={formData.partner1Mother} onChange={e => setFormData({...formData, partner1Mother: e.target.value})} />
                  </div>
                </div>
                <div className="p-4 bg-[#0D1117] rounded-xl border border-[#30363D] space-y-4">
                  <h4 className="text-[10px] uppercase font-black text-[#8B949E]">Padres de novio/a 2</h4>
                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1">Padre</label>
                    <input type="text" className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 outline-none focus:border-[#C8A951]" value={formData.partner2Father} onChange={e => setFormData({...formData, partner2Father: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1">Madre</label>
                    <input type="text" className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 outline-none focus:border-[#C8A951]" value={formData.partner2Mother} onChange={e => setFormData({...formData, partner2Mother: e.target.value})} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* --- DATOS DEL CLIENTE --- */}
          <SectionHeader title="Datos del Cliente" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#161B22] p-8 rounded-2xl border border-[#30363D]">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Nombre del responsable</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-[#8B949E] h-5 w-5" />
                <input 
                  type="text"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-12 pr-4 py-3 focus:border-[#C8A951] outline-none"
                  value={formData.responsable}
                  onChange={e => setFormData({...formData, responsable: e.target.value})}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Dirección</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-[#8B949E] h-5 w-5" />
                <input 
                  type="text"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-12 pr-4 py-3 focus:border-[#C8A951] outline-none"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">DNI</label>
              <input type="text" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none" value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">CUIT</label>
              <input type="text" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none" value={formData.cuit} onChange={e => setFormData({...formData, cuit: e.target.value})} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Teléfonos</label>
              <div className="space-y-3">
                {formData.phones.map((phone, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-4 top-3 text-[#30363D] h-4 w-4" />
                      <input 
                        type="text"
                        placeholder="Nro de teléfono"
                        className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#C8A951]"
                        value={phone}
                        onChange={e => handlePhoneChange(index, e.target.value)}
                      />
                    </div>
                    {formData.phones.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removePhone(index)}
                        className="p-3 text-[#F85149] hover:bg-[#F85149]/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={addPhone}
                  className="flex items-center gap-2 text-sm text-[#C8A951] hover:text-[#D4B96A] font-bold px-1 py-2 transition-colors"
                >
                  <Plus size={16} />
                  Agregar teléfono
                </button>
              </div>
            </div>

            <div className="md:col-span-2 pt-4 border-t border-[#30363D]">
              <h4 className="text-[10px] uppercase font-black text-[#8B949E] mb-4">Decorador / Ambientador</h4>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Nombre completo" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none" value={formData.decoratorName} onChange={e => setFormData({...formData, decoratorName: e.target.value})} />
                <input type="text" placeholder="Teléfono" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none" value={formData.decoratorPhone} onChange={e => setFormData({...formData, decoratorPhone: e.target.value})} />
              </div>
            </div>
          </div>

          {/* --- INVITADOS --- */}
          <SectionHeader title="Invitados (aproximado)" />
          <div className="bg-[#161B22] p-8 rounded-2xl border border-[#30363D]">
            <div className="flex items-start gap-4 p-4 bg-[#C8A951]/5 border border-[#C8A951]/20 rounded-xl mb-8">
              <Info className="text-[#C8A951] h-5 w-5 mt-0.5 shrink-0" />
              <p className="text-sm text-[#E6EDF3]/80 leading-relaxed italic">
                Estos valores son estimados iniciales. El total se comparte automáticamente con el catering.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Mínimo Salón</label>
                <input 
                  type="number" 
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none focus:border-[#C8A951]" 
                  value={formData.salonMinGuests}
                  onChange={e => setFormData({...formData, salonMinGuests: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Adultos aprox</label>
                <input 
                  type="number" 
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none focus:border-[#C8A951]" 
                  value={formData.adultGuests}
                  onChange={e => setFormData({...formData, adultGuests: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Jóvenes aprox</label>
                <input 
                  type="number" 
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none focus:border-[#C8A951]" 
                  value={formData.youngGuests}
                  onChange={e => setFormData({...formData, youngGuests: Number(e.target.value)})}
                />
              </div>
              <div className="bg-[#1F6FEB]/5 border border-[#1F6FEB]/20 rounded-xl p-3 h-[48px] flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase text-[#1F6FEB] leading-none mb-1">Total Aprox</span>
                <span className="text-lg font-display font-bold text-[#E6EDF3] leading-none">{totalGuests}</span>
              </div>
            </div>
          </div>

          {/* --- ALQUILER DEL SALÓN --- */}
          <SectionHeader title="Alquiler del Salón" />
          <div className="bg-[#161B22] p-8 rounded-2xl border border-[#30363D]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Monto total de Alquiler</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-[#8B949E] font-bold">$</span>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-8 pr-4 py-3 outline-none focus:border-[#C8A951]" 
                    value={formData.alquilerTotal}
                    onChange={e => setFormData({...formData, alquilerTotal: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Seña dejada</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-[#8B949E] font-bold">$</span>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-8 pr-4 py-3 outline-none focus:border-[#C8A951]" 
                    value={formData.alquilerSena}
                    onChange={e => setFormData({...formData, alquilerSena: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- ESTADO INICIAL --- */}
          <SectionHeader title="Estado Inicial" />
          <div className="bg-[#161B22] p-8 rounded-2xl border border-[#30363D]">
            <div className="max-w-sm">
              <label className="block text-xs font-bold text-[#8B949E] uppercase mb-2">Estado del evento</label>
              <select 
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 focus:border-[#C8A951] outline-none font-bold"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as EventStatus})}
              >
                <option value="POR_SENAR">POR SEÑAR</option>
                <option value="SENA_EN_PROCESO">SEÑA EN PROCESO</option>
                <option value="CONFIRMADO">CONFIRMADO</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
            </div>
          </div>

          <div className="mt-12 flex justify-center pb-10">
            <button 
              type="submit"
              className="bg-[#C8A951] hover:bg-[#D4B96A] text-[#0D1117] px-12 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-[#C8A951]/20 transform hover:-translate-y-1 active:scale-95"
            >
              Finalizar y Guardar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
