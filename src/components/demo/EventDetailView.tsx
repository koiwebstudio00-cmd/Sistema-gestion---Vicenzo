import React, { useMemo, useState } from "react";
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  ChevronDown, 
  ChevronLeft, 
  Clock, 
  CreditCard, 
  DollarSign, 
  FileText, 
  MapPin, 
  Printer, 
  Plus, 
  Trash2, 
  Users as UserIcon, 
  X 
} from "lucide-react";
import { formatCurrency, type EventStatus, type User, PACK_PREMIUM_ITEMS, USERS } from "../../features/demo/demoShared";

const INCLUDED_FURNITURE_LIST = ['Mesas redondas', 'Mesas cuadradas', 'Sillas metálicas'];

export const EventDetailView = ({ eventId, onBack, user }: { eventId: string, onBack: () => void, user: User }) => {
  const [status, setStatus] = useState<EventStatus>('SENA_EN_PROCESO');
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isPlanillaOpen, setIsPlanillaOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [selectedCategoryForPayment, setSelectedCategoryForPayment] = useState<string | null>(null);
  const [isAddFurnitureOpen, setIsAddFurnitureOpen] = useState(false);
  const [isAddCateringOpen, setIsAddCateringOpen] = useState(false);
  const [isAddExtraOpen, setIsAddExtraOpen] = useState(false);
  const isCateringUser = user.role === 'CATERING';

  // Mock data setup
  const eventData = {
    title: "Quinceañera Valentina Suárez",
    date: "Viernes 14 de marzo de 2026",
    isoDate: "2026-03-14",
    time: "21:00 hs — 04:00 hs",
    salon: "Vicenzo",
    category: "QUINCEANERA",
    createdAt: "2026-02-18",
    observations: [
      "1 mesa principal para 7 personas (quinceañera + corte).",
      "10 mesas rectangulares para adultos.",
      "Ceniceros — 2 jóvenes + 3 adultos.",
      "Confirmar decorador 72hs antes del evento."
    ]
  };

  const [services, setServices] = useState([
    {
      category: "ALQUILER DEL SALÓN",
      items: [
        { name: "Alquiler del Salón", qty: "1u", price: 3500000, status: "PAGADO", isMandatory: true, amountPaid: 3500000, paymentMonth: 'Enero', paymentMethod: 'Efectivo' },
      ]
    },
    {
      category: "TÉCNICA",
      items: [
        { id: 't8', name: "Pack Luces Premium", qty: "1u", price: 740000, status: "A CUENTA", isMandatory: true, amountPaid: 400000, paymentMonth: 'Febrero', paymentMethod: 'Transferencia' },
        { name: "Música, Luces y Pantallas (base)", qty: "1u", price: 1150000, status: "PAGADO", isMandatory: true, amountPaid: 1150000, paymentMonth: 'Enero', paymentMethod: 'Efectivo' },
        { name: "Cabina DJ con pantallas en pista", qty: "—", price: 130000, status: "incluido" },
        { name: "Barras Láser Beam", qty: "—", price: 215000, status: "incluido" },
        { name: "Craquera", qty: "—", price: 120000, status: "incluido" },
        { name: "12 Cabezales Aro LED", qty: "—", price: 210000, status: "incluido" },
        { name: "Pantallas Laterales", qty: "—", price: 220000, status: "incluido" },
        { name: "Sonido para recepción exterior", qty: "1u", price: 30000, status: "PENDIENTE" },
      ]
    },
    {
      category: "GRUPO ELECTRÓGENO",
      items: [
        { name: "Grupo electrógeno", qty: "1u", price: 500000, status: "PENDIENTE", isMandatory: true },
      ]
    },
    {
      category: "IVA SALÓN",
      items: [
        { name: "IVA Salón", qty: "1u", price: 200000, status: "PENDIENTE", isMandatory: true },
      ]
    },
    {
      category: "MOBILIARIO",
      items: [
        { name: "Mesas redondas", qty: "10u", price: 0, status: "incluido" },
        { name: "Mesas cuadradas", qty: "6u", price: 0, status: "incluido" },
        { name: "Sillas metálicas", qty: "160u", price: 0, status: "incluido" },
        { name: "Fundas de silla blancas", qty: "160u", price: 800, status: "PENDIENTE", unitPrice: true },
        { name: "Living (juegos)", qty: "5u", price: 35000, status: "A CUENTA", unitPrice: true, amountPaid: 875000, paymentMonth: 'Marzo', paymentMethod: 'Transferencia' },
      ]
    },
    {
      category: "CATERING",
      items: [
        { id: 'c1', name: "Menú Jóvenes 15 años", qty: "155p", price: 53000, status: "A CUENTA", unitPrice: true, amountPaid: 5000000, paymentMonth: 'Febrero', paymentMethod: 'Transferencia' },
        { id: 'c3', name: "Barra de helados", qty: "155p", price: 7700, status: "PENDIENTE", unitPrice: true },
        { id: 'c4', name: "Después de 1 AM (Pizza/Sandwich)", qty: "12p", price: 26500, status: "PENDIENTE", unitPrice: true },
        { id: 'p1', name: "Mozos", qty: "2u", price: 52000, status: "PENDIENTE", unitPrice: true },
      ]
    },
    {
      category: "EXTRAS",
      items: [
        { name: "Cabina fotográfica", qty: "1u", price: 100000, status: "PENDIENTE" },
      ]
    }
  ]);

  const totalPaid = useMemo(() => {
    return services.reduce((acc, cat) => {
      return acc + cat.items.reduce((sum, item: any) => sum + (item.amountPaid || 0), 0);
    }, 0);
  }, [services]);

  const alerts = useMemo(() => {
    const list: { type: 'RED' | 'YELLOW', text: string }[] = [];
    const createdAt = new Date(eventData.createdAt);
    const expirationDate = new Date(createdAt);
    expirationDate.setDate(createdAt.getDate() + 30);
    const today = new Date();
    const diffDays = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7 && diffDays >= 0) {
      list.push({ type: 'RED', text: `El precio de seña vence el ${expirationDate.toLocaleDateString('es-AR')}. Confirmar antes de esa fecha.` });
    }
    return list;
  }, [eventData]);

  const [paymentForm, setPaymentForm] = useState({ 
    service: '', 
    amount: '', 
    qty: '1', 
    method: 'EFECTIVO', 
    date: new Date().toISOString().split('T')[0] 
  });
  const [balanceForm, setBalanceForm] = useState({
    type: 'FAVOR' as 'FAVOR' | 'CONTRA',
    amount: '',
    currency: 'ARS' as 'ARS' | 'USD',
    detail: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [furnitureForm, setFurnitureForm] = useState({ type: 'INCLUIDO' as 'INCLUIDO' | 'EXTRA', name: '', qty: '', price: '' });
  const [cateringForm, setCateringForm] = useState({ type: 'JOVENES' as 'JOVENES'|'ADULTOS'|'NINOS'|'DESPUES'|'MOZOS', menuType: 'M1', buffet: false, qty: '', price: '' });
  const [extraForm, setExtraForm] = useState({ name: '', qty: '', price: '', status: 'PENDIENTE' });

  if (isPlanillaOpen) return <div className="p-8"><button onClick={() => setIsPlanillaOpen(false)}>Cerrar</button></div>;

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-1">
              <ChevronLeft size={20} /> Volver
            </button>
            <div className="h-6 w-px bg-[#30363D] hidden lg:block" />
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/30 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                  {eventData.category}
                </span>
                <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">{eventData.title}</h1>
              </div>
              <div className="text-[#8B949E] text-xs mt-1.5 flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#C8A951]" /> {eventData.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#C8A951]" /> {eventData.time}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#C8A951]" /> {eventData.salon}</span>
                <span className="bg-[#161B22] px-2 py-0.5 rounded border border-[#30363D]">
                  Precio válido hasta: {(() => {
                    const d = new Date(eventData.createdAt);
                    d.setDate(d.getDate() + 30);
                    return d.toLocaleDateString('es-AR');
                  })()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsPlanillaOpen(true)} className="px-4 py-2 bg-[#161B22] border border-[#30363D] hover:bg-[#30363D] rounded-xl text-xs font-bold transition-all flex items-center gap-2">
              <Printer size={16} /> Planilla
            </button>
            <button onClick={() => setIsBalanceModalOpen(true)} className="px-4 py-2 bg-[#C8A951] text-[#0D1117] hover:bg-[#E3B341] rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-[#C8A951]/10">
              Balance ⚖️
            </button>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className={`appearance-none border font-black rounded-xl pl-4 pr-10 py-2.5 text-xs outline-none ${
                  status === 'CONFIRMADO' ? 'bg-[#3FB950]/10 border-[#3FB950]/30 text-[#3FB950]' :
                  status === 'SENA_EN_PROCESO' ? 'bg-[#C8A951]/10 border-[#C8A951]/30 text-[#C8A951]' :
                  status === 'POR_SENAR' ? 'bg-[#D29922]/10 border-[#D29922]/30 text-[#D29922]' :
                  'bg-[#F85149]/10 border-[#F85149]/30 text-[#F85149]'
                }`}
              >
                <option value="POR_SENAR">POR SEÑAR</option>
                <option value="SENA_EN_PROCESO">SEÑA EN PROCESO</option>
                <option value="CONFIRMADO">CONFIRMADO</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 pointer-events-none opacity-50" />
            </div>
          </div>
        </div>

        {/* --- DASHBOARD FINANCIERO (Solo Admin) --- */}
        {user.role !== 'CATERING' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-[#161B22] border border-[#30363D] rounded-2xl">
              <span className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest">Total Presupuestado</span>
              <div className="text-xl font-display font-bold text-[#E6EDF3] mt-1">{formatCurrency(eventData.budgetTotal || 5200000)}</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#30363D] rounded-2xl">
              <span className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest">Total Pagado</span>
              <div className="text-xl font-display font-bold text-[#3FB950] mt-1">{formatCurrency(22800000)}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 items-center overflow-x-auto pb-2 sm:pb-0">
          {[
            { id: 'ALERTS', label: 'Alertas', icon: AlertTriangle, color: '#F85149' },
            { id: 'CLIENT', label: 'Datos Cliente', icon: UserIcon, color: '#C8A951' },
            { id: 'OBS', label: 'Obs.', icon: FileText, color: '#C8A951' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                activeTab === tab.id ? 'bg-[#C8A951] border-[#C8A951] text-[#0D1117]' : 'bg-[#161B22] border-[#30363D] text-[#8B949E]'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

      {/* Content Panels */}
      {activeTab === 'ALERTS' && (
        <div className="mb-8 p-6 bg-[#161B22] border border-[#30363D] rounded-2xl animate-in fade-in slide-in-from-top-2">
          <h3 className="text-sm font-black uppercase mb-4 text-[#F85149] flex items-center gap-2">
            <AlertTriangle size={18} /> Alertas Críticas
          </h3>
          <div className="space-y-3">
            {alerts.length > 0 ? alerts.map((alert, i) => (
              <div key={i} className="p-4 rounded-xl border bg-[#F85149]/10 border-[#F85149]/30 text-[#F85149] font-bold text-sm">
                {alert.text}
              </div>
            )) : (
              <div className="p-4 rounded-xl border bg-[#3FB950]/10 border-[#3FB950]/30 text-[#3FB950] font-bold text-sm">
                Sin alertas pendientes
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'OBS' && (
        <div className="mb-8 space-y-6 animate-in fade-in slide-in-from-top-2">
          {/* Observaciones Generales */}
          {(user.role === 'JEFE' || user.role === 'RECEPCIONISTA') && (
            <div className="p-6 bg-[#161B22] border border-[#30363D] rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A951] flex items-center gap-2">
                  <FileText size={16} /> Observaciones Generales
                </h3>
                <span className="text-[8px] font-black px-1.5 py-0.5 bg-[#C8A951]/10 text-[#C8A951] rounded border border-[#C8A951]/20">PRIVADO</span>
              </div>
              <textarea 
                className="w-full h-32 bg-[#0D1117] border border-[#30363D] rounded-xl p-4 text-sm text-[#E6EDF3] focus:border-[#C8A951] outline-none transition-all placeholder:text-[#30363D]"
                placeholder="Notas internas del salón, logística, datos sensibles..."
              />
            </div>
          )}

          {/* Observaciones Catering */}
          {(user.role === 'JEFE' || user.role === 'RECEPCIONISTA' || user.role === 'CATERING') && (
            <div className="p-6 bg-[#161B22] border border-[#30363D] rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3FB950] flex items-center gap-2">
                  <UserIcon size={16} /> Observaciones para Catering
                </h3>
                {user.role === 'CATERING' ? (
                  <span className="text-[8px] font-black px-1.5 py-0.5 bg-[#8B949E]/10 text-[#8B949E] rounded border border-[#8B949E]/20">SÓLO LECTURA</span>
                ) : (
                  <span className="text-[8px] font-black px-1.5 py-0.5 bg-[#3FB950]/10 text-[#3FB950] rounded border border-[#3FB950]/20">COMPARTIDO</span>
                )}
              </div>
              {user.role === 'CATERING' ? (
                <div className="w-full bg-[#0D1117]/50 border border-[#30363D]/50 rounded-xl p-4 text-sm text-[#8B949E] italic min-h-[100px]">
                  {eventData.observations[3] || "Sin indicaciones específicas cargadas aún."}
                </div>
              ) : (
                <textarea 
                  className="w-full h-32 bg-[#0D1117] border border-[#30363D] rounded-xl p-4 text-sm text-[#E6EDF3] focus:border-[#3FB950] outline-none transition-all placeholder:text-[#30363D]"
                  placeholder="Instrucciones para Eugenio/Bolognini: platos especiales, tiempos de servicio..."
                />
              )}
            </div>
          )}
        </div>
      )}

        {/* Secciones */}
        <div className="space-y-10">
          {services.map((category, idx) => {
            // CATERING ROLE: Only see CATERING section
            if (user.role === 'CATERING' && category.category !== 'CATERING') return null;
            
            const sectionPaid = category.items.reduce((sum, item: any) => sum + (item.amountPaid || 0), 0);
            const isPackActive = category.items.some((i: any) => i.name === 'Pack Luces Premium' && i.status !== 'PENDIENTE');

            return (
              <div key={idx} className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden animate-in fade-in duration-300">
                <div className="bg-[#1C2128] border-b border-[#30363D] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black text-[#E6EDF3] tracking-widest uppercase">{category.category}</h2>
                    <div className="h-4 w-[1px] bg-[#30363D]" />
                    {user.role !== 'CATERING' && (
                      <span className="text-[#3FB950] text-sm font-bold">
                        {formatCurrency(sectionPaid)} pagado
                      </span>
                    )}
                    {user.role === 'CATERING' && category.category === 'CATERING' && (
                      <span className="text-[#3FB950] text-sm font-bold">
                        MI RUBRO — {formatCurrency(sectionPaid)} COBRADO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {category.category === 'MOBILIARIO' && (
                      <button onClick={() => setIsAddFurnitureOpen(true)} className="p-2 bg-[#1F6FEB]/10 text-[#1F6FEB] border border-[#1F6FEB]/30 hover:bg-[#1F6FEB]/20 rounded-xl transition-all" title="Cargar mobiliario">
                        <Plus size={18} />
                      </button>
                    )}
                    {category.category === 'CATERING' && (
                      <button onClick={() => setIsAddCateringOpen(true)} className="p-2 bg-[#1F6FEB]/10 text-[#1F6FEB] border border-[#1F6FEB]/30 hover:bg-[#1F6FEB]/20 rounded-xl transition-all" title="Cargar catering">
                        <Plus size={18} />
                      </button>
                    )}
                    {category.category === 'EXTRAS' && (
                      <button onClick={() => setIsAddExtraOpen(true)} className="p-2 bg-[#1F6FEB]/10 text-[#1F6FEB] border border-[#1F6FEB]/30 hover:bg-[#1F6FEB]/20 rounded-xl transition-all" title="Cargar extras">
                        <Plus size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setSelectedCategoryForPayment(category.category);
                        setIsPaymentModalOpen(true);
                      }} 
                      className="px-4 py-2 bg-[#C8A951]/10 text-[#C8A951] border border-[#C8A951]/30 hover:bg-[#C8A951]/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Registrar pago
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#0D1117]/30 border-b border-[#30363D]/50">
                        <th className="px-6 py-3 text-[10px] font-black uppercase text-[#8B949E] tracking-widest">Cant.</th>
                        <th className="px-6 py-3 text-[10px] font-black uppercase text-[#8B949E] tracking-widest">Nombre</th>
                        <th className="px-6 py-3 text-[10px] font-black uppercase text-[#8B949E] tracking-widest text-right">Precio ind.</th>
                        <th className="px-6 py-3 text-[10px] font-black uppercase text-[#8B949E] tracking-widest text-right">Total</th>
                        <th className="px-6 py-3 text-[10px] font-black uppercase text-[#8B949E] tracking-widest text-center">Estado</th>
                        <th className="px-6 py-3 text-[10px] font-black uppercase text-[#8B949E] tracking-widest text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#30363D]/30 text-sm">
                      {category.items.map((item: any, iIdx) => {
                        const isIncludedInPack = PACK_PREMIUM_ITEMS.includes(item.id || '') || ['Cabina DJ con pantallas en pista', 'Barras Láser Beam', 'Craquera', '12 Cabezales Aro LED', 'Pantallas Laterales'].includes(item.name);
                        const isIncludedFurniture = INCLUDED_FURNITURE_LIST.includes(item.name);
                        const isFreeItem = item.status === 'REGALO' || item.status === 'SIN CARGO';
                        
                        const qtyVal = parseInt(item.qty) || 1;
                        const unitPrice = isFreeItem ? 0 : item.price;
                        const totalPrice = (item.status === 'incluido' || (isPackActive && isIncludedInPack) || isIncludedFurniture || isFreeItem) ? 0 : (item.unitPrice ? unitPrice * qtyVal : unitPrice);

                        return (
                          <tr key={iIdx} className="hover:bg-[#0D1117]/20 transition-colors">
                            <td className="px-6 py-4">
                              {isIncludedFurniture ? (
                                <input type="number" defaultValue={qtyVal} className="w-16 bg-[#0D1117] border border-[#30363D] rounded-lg px-2 py-1 text-xs font-bold text-[#3FB950] outline-none focus:border-[#3FB950]" />
                              ) : (
                                <span className="font-bold text-[#8B949E]">{item.qty}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#E6EDF3] tracking-tight">{item.name}</span>
                                {item.isMandatory && <span className="bg-[#F85149] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">OBLIGATORIO</span>}
                                {isFreeItem && <span className="bg-[#1F6FEB]/20 text-[#1F6FEB] border border-[#1F6FEB]/40 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{item.status}</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right text-[#8B949E]">
                              {item.status === 'incluido' || (isPackActive && isIncludedInPack) || isIncludedFurniture || isFreeItem ? '—' : formatCurrency(unitPrice)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className={`font-bold ${totalPrice === 0 ? 'text-[#8B949E]' : 'text-[#E6EDF3]'}`}>{totalPrice === 0 ? '—' : formatCurrency(totalPrice)}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                                isIncludedFurniture || isFreeItem ? 'bg-[#3FB950]/20 text-[#3FB950]' :
                                item.status === 'PENDIENTE' ? 'bg-[#30363D] text-[#8B949E]' : 
                                'bg-[#3FB950]/20 text-[#3FB950]'
                              }`}>
                                {isIncludedFurniture ? 'INCLUIDO' : (isPackActive && isIncludedInPack) ? 'EN PACK' : item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {item.status === 'PENDIENTE' && !isIncludedFurniture && !isFreeItem && (
                                  <button title="Pagar" onClick={() => setIsPaymentModalOpen(true)} className="p-1.5 bg-[#C8A951]/10 text-[#C8A951] hover:bg-[#C8A951]/20 rounded transition-colors">
                                    <DollarSign size={12} />
                                  </button>
                                )}
                                {!item.isMandatory && (
                                  <button title="Eliminar" className="p-1.5 bg-[#F85149]/10 text-[#F85149] hover:bg-[#F85149]/20 rounded transition-colors">
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {category.category === 'CATERING' && (
                  <div className="bg-[#1C2128] px-6 py-3 border-t border-[#30363D] text-right">
                    <span className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest mr-4">Total Catering Contratado:</span>
                    <span className="text-sm font-black text-[#E6EDF3]">{formatCurrency(category.items.reduce((sum, item: any) => sum + (item.status === 'incluido' ? 0 : (item.unitPrice ? item.price * (parseInt(item.qty) || 0) : item.price)), 0))}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Gran Total */}
        <div className="mt-12 bg-[#161B22] border-t-2 border-[#C8A951] p-8 rounded-b-2xl mb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-[#C8A951] text-xs font-black uppercase mb-1">Total Acumulado Pagado</h4>
              <p className="text-[#8B949E] text-[10px] italic">Suma de todos los registros de pago procesados por el salón.</p>
            </div>
            <div className="text-center md:text-right">
              <div className="text-4xl font-display font-black text-[#E6EDF3] tracking-tighter">{formatCurrency(totalPaid)}</div>
              <div className="flex items-center justify-center md:justify-end gap-1.5 mt-1 text-[#3FB950] font-bold text-[10px]">
                <CheckCircle size={14} /> Actualizado al día
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
          <div className="bg-[#161B22] border border-[#30363D] w-full max-w-md rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><DollarSign className="text-[#3FB950]" /> Registrar Pago</h2>
            <div className="space-y-4">
              <input type="number" placeholder="Monto ARS" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none" />
              <div className="flex gap-3 mt-8">
                <button onClick={() => setIsPaymentModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-[#30363D] font-bold text-sm">Cancelar</button>
                <button onClick={() => setIsPaymentModalOpen(false)} className="flex-1 bg-[#3FB950] text-white font-bold rounded-xl text-sm">Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddFurnitureOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
          <div className="bg-[#161B22] border border-[#30363D] w-full max-w-md rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="text-[#1F6FEB]" /> Gestionar Mobiliario</h2>
            <div className="space-y-6">
              <div className="flex p-1 bg-[#0D1117] rounded-xl border border-[#30363D]">
                <button onClick={() => setFurnitureForm({...furnitureForm, type: 'INCLUIDO'})} className={`flex-1 py-2 rounded-lg text-xs font-bold ${furnitureForm.type === 'INCLUIDO' ? 'bg-[#1F6FEB] text-white' : 'text-[#8B949E]'}`}>SALÓN</button>
                <button onClick={() => setFurnitureForm({...furnitureForm, type: 'EXTRA'})} className={`flex-1 py-2 rounded-lg text-xs font-bold ${furnitureForm.type === 'EXTRA' ? 'bg-[#C8A951] text-[#0D1117]' : 'text-[#8B949E]'}`}>EXTRA</button>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsAddFurnitureOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-[#30363D] font-bold text-sm">Cancelar</button>
                <button onClick={() => setIsAddFurnitureOpen(false)} className="flex-1 bg-[#1F6FEB] text-white font-bold rounded-xl text-sm tracking-widest uppercase">Cargar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddCateringOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
          <div className="bg-[#161B22] border border-[#30363D] w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="text-[#1F6FEB]" /> Agregar Catering</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['JOVENES', 'ADULTOS', 'NINOS', 'DESPUES', 'MOZOS'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setCateringForm({...cateringForm, type: t as any})}
                    className={`py-2 rounded-lg text-[9px] font-black tracking-widest transition-all ${cateringForm.type === t ? 'bg-[#1F6FEB] text-white' : 'bg-[#0D1117] text-[#8B949E] border border-[#30363D]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {cateringForm.type === 'ADULTOS' && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <select 
                      value={cateringForm.menuType}
                      onChange={(e) => setCateringForm({...cateringForm, menuType: e.target.value})}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none text-xs text-[#E6EDF3] font-bold"
                    >
                      <option value="M1">Menú 1 Adultos</option>
                      <option value="M2_POLLO">Menú 2 Gourmet — Pollo</option>
                      <option value="M2_LOMO">Menú 2 Gourmet — Lomo</option>
                      <option value="ESPECIAL">Menú Especial</option>
                    </select>
                    <label className="flex items-center gap-3 p-3 bg-[#0D1117] rounded-xl border border-[#30363D] cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={cateringForm.buffet}
                        onChange={(e) => setCateringForm({...cateringForm, buffet: e.target.checked})}
                        className="w-4 h-4 rounded border-[#30363D] bg-[#161B22] text-[#1F6FEB]"
                      />
                      <span className="text-xs font-bold text-[#8B949E]">Incluye Buffet de Postre</span>
                    </label>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Cantidad</label>
                    <input type="number" placeholder="Cantidad" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none focus:border-[#C8A951]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Precio Unit.</label>
                    <input type="number" placeholder="ARS" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none focus:border-[#C8A951]" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setIsAddCateringOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-[#30363D] font-bold text-sm">Cancelar</button>
                <button onClick={() => setIsAddCateringOpen(false)} className="flex-1 bg-[#1F6FEB] text-white font-bold rounded-xl text-xs uppercase tracking-widest">Añadir</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddExtraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
          <div className="bg-[#161B22] border border-[#30363D] w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#C8A951]"><Plus /> Agregar Servicio Extra</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Nombre del extra</label>
                <input 
                  type="text" 
                  value={extraForm.name}
                  onChange={(e) => setExtraForm({...extraForm, name: e.target.value})}
                  placeholder="Ej: Humo bajo, Pista LED" 
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none focus:border-[#C8A951]" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Cantidad</label>
                  <input 
                    type="number" 
                    value={extraForm.qty}
                    onChange={(e) => setExtraForm({...extraForm, qty: e.target.value})}
                    placeholder="1" 
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none focus:border-[#C8A951]" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Precio Unit.</label>
                  <input 
                    type="number" 
                    value={extraForm.price}
                    onChange={(e) => setExtraForm({...extraForm, price: e.target.value})}
                    placeholder="ARS" 
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none focus:border-[#C8A951]" 
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Tipo de Cargo</label>
                <select 
                  value={extraForm.status}
                  onChange={(e) => setExtraForm({...extraForm, status: e.target.value})}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none font-bold text-xs"
                >
                  <option value="PENDIENTE">CON CARGO (Pendiente)</option>
                  <option value="REGALO">REGALO ($0)</option>
                  <option value="SIN CARGO">SIN CARGO ($0)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-between items-center bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
                <span className="text-xs font-bold text-[#8B949E]">TOTAL CALCULADO:</span>
                <span className="text-lg font-black text-[#E6EDF3]">
                  {extraForm.status === 'PENDIENTE' 
                    ? formatCurrency((parseInt(extraForm.qty) || 0) * (parseInt(extraForm.price) || 0))
                    : '$ 0'}
                </span>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setIsAddExtraOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-[#30363D] font-bold text-sm">Cancelar</button>
                <button onClick={() => setIsAddExtraOpen(false)} className="flex-1 bg-[#C8A951] text-[#0D1117] font-bold rounded-xl text-xs uppercase tracking-widest">Agregar extra</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isBalanceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
          <div className="bg-[#161B22] border border-[#30363D] w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="p-2 bg-[#C8A951]/20 rounded-xl text-[#C8A951] tracking-tighter">⚖️</div>
                Estado de Balance
              </h2>
              <button onClick={() => setIsBalanceModalOpen(false)} className="text-[#8B949E] hover:text-white"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              <div className="flex p-1 bg-[#0D1117] rounded-2xl border border-[#30363D]">
                <button 
                  onClick={() => setBalanceForm({...balanceForm, type: 'FAVOR'})}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${balanceForm.type === 'FAVOR' ? 'bg-[#3FB950] text-[#0D1117]' : 'text-[#8B949E]'}`}
                >
                  A FAVOR DEL SALÓN
                </button>
                <button 
                  onClick={() => setBalanceForm({...balanceForm, type: 'CONTRA'})}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${balanceForm.type === 'CONTRA' ? 'bg-[#F85149] text-white' : 'text-[#8B949E]'}`}
                >
                  EN CONTRA
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Monto</label>
                  <input 
                    type="number" 
                    value={balanceForm.amount}
                    onChange={(e) => setBalanceForm({...balanceForm, amount: e.target.value})}
                    placeholder="0.00" 
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none focus:border-[#C8A951] font-display font-bold text-lg" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Moneda</label>
                  <div className="flex h-[52px] p-1 bg-[#0D1117] rounded-xl border border-[#30363D]">
                    <button onClick={() => setBalanceForm({...balanceForm, currency: 'ARS'})} className={`flex-1 rounded-lg text-xs font-black ${balanceForm.currency === 'ARS' ? 'bg-[#30363D] text-[#E6EDF3]' : 'text-[#8B949E]'}`}>ARS</button>
                    <button onClick={() => setBalanceForm({...balanceForm, currency: 'USD'})} className={`flex-1 rounded-lg text-xs font-black ${balanceForm.currency === 'USD' ? 'bg-[#3FB950]/20 text-[#3FB950]' : 'text-[#8B949E]'}`}>USD</button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Detalle del movimiento</label>
                <textarea 
                  value={balanceForm.detail}
                  onChange={(e) => setBalanceForm({...balanceForm, detail: e.target.value})}
                  placeholder="Ej: Ajuste por servicio no utilizado, Pago extra..." 
                  className="w-full h-24 bg-[#0D1117] border border-[#30363D] rounded-xl p-4 outline-none focus:border-[#C8A951] text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Fecha del movimiento</label>
                <input 
                  type="date" 
                  value={balanceForm.date}
                  onChange={(e) => setBalanceForm({...balanceForm, date: e.target.value})}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none focus:border-[#C8A951] font-bold text-sm" 
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsBalanceModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-[#30363D] font-bold text-sm">Cancelar</button>
                <button onClick={() => setIsBalanceModalOpen(false)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${balanceForm.type === 'FAVOR' ? 'bg-[#3FB950] text-[#0D1117]' : 'bg-[#F85149] text-white'}`}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
