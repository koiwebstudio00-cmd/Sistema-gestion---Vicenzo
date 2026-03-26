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
  Edit2,
  FileText,
  MapPin,
  Printer,
  Plus,
  Trash2,
  Users as UserIcon,
  X
} from "lucide-react";
import { formatCurrency, type EventStatus, type User, PACK_PREMIUM_ITEMS, USERS } from "../../features/demo/demoShared";

const INCLUDED_FURNITURE_LIST = ['Mesas redondas', 'Mesas cuadradas', 'Sillas metálicas', 'Banquetas'];
const SINGLE_PAYMENT_CATEGORIES = ['ALQUILER DEL SALÓN', 'TÉCNICA', 'IVA SALÓN', 'GRUPO ELECTRÓGENO'];
const EXTRA_OPTIONS = ['Alas LED', 'Cortinas LED', 'Guirnaldas exterior', 'Buzón', 'Pistola CO2', 'Máquina de boxeo', 'Cabina fotográfica'];
const PREMIUM_PACK_OPTIONS = [
  { id: 't3', label: 'Cabina DJ con pantallas en pista', price: 130000 },
  { id: 't4', label: 'Barras Láser Beam', price: 215000 },
  { id: 't5', label: 'Craquera', price: 120000 },
  { id: 't6', label: '12 Cabezales Aro LED', price: 210000 },
  { id: 't7', label: 'Pantallas Laterales', price: 220000 },
];

export const EventDetailView = ({ eventId, onBack, user }: { eventId: string, onBack: () => void, user: User }) => {
  const [status, setStatus] = useState<EventStatus>('SENA_EN_PROCESO');
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isPlanillaOpen, setIsPlanillaOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [selectedCategoryForPayment, setSelectedCategoryForPayment] = useState<string | null>(null);
  const [selectedItemForPayment, setSelectedItemForPayment] = useState<any | null>(null);
  const [isAddFurnitureOpen, setIsAddFurnitureOpen] = useState(false);
  const [isAddCateringOpen, setIsAddCateringOpen] = useState(false);
  const [cateringStep, setCateringStep] = useState<1 | 2>(1);
  const [cateringMenuType, setCateringMenuType] = useState<'JOVENES' | 'ADULTOS' | null>(null);
  const [isAddTecnicaOpen, setIsAddTecnicaOpen] = useState(false);
  const [extraForm, setExtraForm] = useState({ name: EXTRA_OPTIONS[0], method: 'EFECTIVO' });
  const [sessionPayments, setSessionPayments] = useState<any[]>([]);
  const [selectedPremiumServices, setSelectedPremiumServices] = useState<string[]>(PREMIUM_PACK_OPTIONS.map(option => option.id));
  const isCateringUser = user.role === 'CATERING';

  // Mock data setup
  const eventData = {
    title: "Quinceañera Valentina Suárez",
    clientName: "Familia Suárez",
    clientPhone: "351 456-7890",
    guests: { adults: 155, kids: 12 },
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
        { name: "Alquiler del Salón", qty: "1u", price: 3500000, status: "A CUENTA", isMandatory: true, amountPaid: 850000, paymentMonth: 'Enero', paymentMethod: 'Efectivo', lastPaymentDate: "12/03/26" },
      ]
    },
    {
      category: "TÉCNICA",
      items: [
        { name: "Base", qty: "1u", price: 1150000, status: "PAGADO", isMandatory: true, amountPaid: 1150000, paymentMonth: 'Enero', paymentMethod: 'Efectivo' },
        { id: 't8', name: "Pack Premium", qty: "1u", price: 740000, status: "A CUENTA", isMandatory: false, amountPaid: 400000, paymentMonth: 'Febrero', paymentMethod: 'Transferencia', subItems: ['Cabina DJ con pantallas en pista', 'Barras Láser Beam', 'Craquera', '12 Cabezales Aro LED', 'Pantallas Laterales'] },
        { name: "Sonido exterior", qty: "1u", price: 30000, status: "PENDIENTE" },
      ]
    },
    {
      category: "GRUPO ELECTRÓGENO",
      items: [
        { name: "Grupo Electrógeno", qty: "1u", price: 500000, status: "PENDIENTE", isMandatory: true },
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
        { name: "Banquetas", qty: "12u", price: 0, status: "incluido" },
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
        { name: "Alas LED", qty: "1u", price: 15000, status: "PENDIENTE" },
        { name: "Cortinas LED", qty: "1u", price: 20000, status: "PENDIENTE" },
        { name: "Guirnaldas exterior", qty: "1u", price: 20000, status: "PENDIENTE" },
        { name: "Buzón", qty: "1u", price: 10000, status: "PENDIENTE" },
        { name: "Pistola CO2", qty: "1u", price: 90000, status: "PENDIENTE" },
        { name: "Máquina de boxeo", qty: "1u", price: 85000, status: "PENDIENTE" },
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
  const [cateringForm, setCateringForm] = useState({ type: 'JOVENES' as 'JOVENES' | 'ADULTOS' | 'NINOS' | 'DESPUES' | 'MOZOS', menuType: 'M1', buffet: false, qty: '', price: '' });

  const areSenasPaid = useMemo(() => {
    const salonSena = services.find(s => s.category === "ALQUILER DEL SALÓN")?.items[0];
    const tecnicaSena = services.find(s => s.category === "TÉCNICA")?.items.find(i => i.name === "Base");
    return salonSena?.status === "PAGADO" && tecnicaSena?.status === "PAGADO";
  }, [services]);

  const getItemTotal = (categoryName: string, item: any) => {
    const qtyVal = parseInt(item.qty) || 1;
    if (item.status === 'incluido' || INCLUDED_FURNITURE_LIST.includes(item.name) || item.status === 'REGALO' || item.status === 'SIN CARGO') {
      return 0;
    }
    return item.unitPrice ? item.price * qtyVal : item.price;
  };

  const isItemFullyPaid = (categoryName: string, item: any) => {
    const total = getItemTotal(categoryName, item);
    return total > 0 && (item.amountPaid || 0) >= total;
  };

  const handleAddSessionPayment = (payment: any) => {
    setSessionPayments([...sessionPayments, { ...payment, id: Date.now().toString() }]);
  };

  const handleSaveSession = () => {
    setSessionPayments([]);
    setIsPaymentModalOpen(false);
    alert("Sesión guardada correctamente");
  };

  const handleConfirmPayment = () => {
    if (!selectedCategoryForPayment || !selectedItemForPayment) return;

    const isFixedSingleUnit = selectedCategoryForPayment === 'TÉCNICA' || selectedCategoryForPayment === 'EXTRAS' || ['IVA SALÓN', 'GRUPO ELECTRÓGENO'].includes(selectedCategoryForPayment);
    const amount = isFixedSingleUnit ? Number(paymentForm.amount || selectedItemForPayment.price) : Number(paymentForm.amount || 0);
    const nextStatus =
      paymentForm.method === 'PENDIENTE'
        ? 'PENDIENTE'
        : amount + (selectedItemForPayment.amountPaid || 0) >= getItemTotal(selectedCategoryForPayment, selectedItemForPayment)
          ? 'PAGADO'
          : 'A CUENTA';

    setServices(prev => prev.map(category => {
      if (category.category !== selectedCategoryForPayment) return category;
      return {
        ...category,
        items: category.items.map((item: any) => {
          if (item.name !== selectedItemForPayment.name) return item;
          return {
            ...item,
            amountPaid: paymentForm.method === 'PENDIENTE' ? (item.amountPaid || 0) : (item.amountPaid || 0) + amount,
            status: nextStatus,
            paymentMethod: paymentForm.method,
            lastPaymentDate: new Date().toLocaleDateString('es-AR')
          };
        })
      };
    }));

    if (paymentForm.method !== 'PENDIENTE') {
      handleAddSessionPayment({
        service: selectedItemForPayment.name,
        amount,
        method: paymentForm.method
      });
    }

    setIsPaymentModalOpen(false);
    setSelectedItemForPayment(null);
  };

  const cateringPaymentSummary = useMemo(() => {
    return services
      .find(category => category.category === 'CATERING')
      ?.items.map((item: any) => `${item.qty} ${item.name}`)
      .join(' · ') || '';
  }, [services]);

  if (isPlanillaOpen) {
    return (
      <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3] relative font-sans print:bg-white print:text-black print:p-0">
        <style dangerouslySetInnerHTML={{
          __html: `
          @media print {
            @page { size: A4 portrait; margin: 1cm !important; }
            html, body { background-color: white !important; color: black !important; margin: 0 !important; padding: 0 !important; }
            .print-hidden, nav, header, aside, .no-print { display: none !important; }
            .print-visible { display: block !important; visibility: visible !important; color: black !important; background: white !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
        `}} />

        {/* Header con botón Cerrar - solo en pantalla */}
        <div className="flex justify-between items-center mb-6 print-hidden max-w-4xl mx-auto">
          <button onClick={() => setIsPlanillaOpen(false)} className="h-10 px-4 bg-[#161B22] border border-[#30363D] rounded-xl text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-2 transition-all">
            <ChevronLeft size={18} /> Volver al Detalle
          </button>
          <button onClick={() => window.print()} className="h-10 px-4 bg-[#3FB950] text-[#0D1117] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-[#3FB950]/10">
            <Printer size={18} /> Imprimir Planilla
          </button>
        </div>

        {/* Planilla imprimible */}
        <div className="print-visible bg-white text-black p-6 sm:p-10 max-w-4xl mx-auto min-h-[1056px] shadow-lg print:shadow-none print:w-full">
          <div className="border-b-4 border-black pb-4 mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter">Planilla Operativa</h1>
              <h2 className="text-lg sm:text-xl font-bold text-gray-600 mt-1 uppercase tracking-widest">{eventData.title}</h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="bg-black text-white px-3 py-1 text-xs sm:text-sm font-black uppercase tracking-widest">{eventData.category}</span>
              <p className="font-bold mt-2 text-xs sm:text-sm">ID: {eventId || '123'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 border-b border-gray-300 pb-8">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Fecha y Hora</p>
                <p className="text-lg font-bold">{eventData.date} | {eventData.time}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Salón</p>
                <p className="text-lg font-bold">{eventData.salon}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Responsable Evento</p>
                <p className="text-lg font-bold">{eventData.clientName}</p>
                <p className="text-sm font-medium">{eventData.clientPhone}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Asistencia</p>
                <p className="text-lg font-bold">{eventData.guests.adults} Adultos / {eventData.guests.kids} Menores / {parseInt(eventData.guests.adults as any) + parseInt(eventData.guests.kids as any)} Total</p>
              </div>
            </div>
          </div>

          {/* Menú y Servicios Gastronómicos */}
          <div className="mb-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] border-l-4 border-black pl-3 mb-4">Catering y Menú</h3>
            <table className="w-full text-left text-xs sm:text-sm mb-4">
              <thead className="border-b border-black">
                <tr>
                  <th className="py-2 font-black uppercase w-16">Cant</th>
                  <th className="py-2 font-black uppercase">Detalle del Servicio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.find(s => s.category === 'CATERING')?.items.map((item: any, i) => (
                  <tr key={i}>
                    <td className="py-3 font-bold">{item.qty}</td>
                    <td className="py-3 font-medium">
                      {item.name}
                      {item.subItems && <span className="text-xs text-gray-500 block italic mt-1">{item.subItems.join(', ')}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] border-l-4 border-black pl-3 mb-4">Mobiliario Principal</h3>
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-black">
                <tr>
                  <th className="py-2 font-black uppercase w-16">Cant</th>
                  <th className="py-2 font-black uppercase">Elemento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.find(s => s.category === 'MOBILIARIO')?.items.map((item: any, i) => (
                  <tr key={i}>
                    <td className="py-3 font-bold">{item.qty}</td>
                    <td className="py-3 font-medium">{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-black">Instrucciones Logísticas y Observaciones</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
              {eventData.observations.map((obs, i) => (
                <li key={i}>{obs}</li>
              ))}
            </ul>
          </div>

          <div className="mt-16 pt-8 border-t border-black grid grid-cols-3 text-center gap-4 sm:gap-12 pb-10">
            <div>
              <div className="border-b border-gray-400 h-16 w-full mb-2"></div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500">Firma Jefe Salón</p>
            </div>
            <div>
              <div className="border-b border-gray-400 h-16 w-full mb-2"></div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500">Firma Maitre</p>
            </div>
            <div>
              <div className="border-b border-gray-400 h-16 w-full mb-2"></div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500">Firma Cocina</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] text-[#E6EDF3] relative font-sans">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page { size: portrait; margin: 0.5cm !important; }
          html, body { background-color: white !important; color: black !important; margin: 0 !important; padding: 0 !important; }
          #sidebar, nav, aside, .no-print, header, [role="navigation"], .print-hidden, .print:hidden { display: none !important; }
          .print-visible { display: block !important; visibility: visible !important; }
          .print-container { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            color: black !important; 
            background: white !important; 
            z-index: 9999 !important;
          }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}} />

      {/* Print-only layout */}
      <div className="hidden print:block print-container p-10 font-sans text-black bg-white min-h-screen">
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
          <div>
            <img src="https://i.postimg.cc/fTXLSgfS/images-removebg-preview.png" alt="Vicenzo" className="h-16 w-auto mb-2" />
            <h1 className="text-3xl font-black uppercase tracking-tighter">Ficha de Evento</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Salón de Eventos & Catering</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Estado del Evento</div>
            <div className="text-xl font-black border-2 border-black px-4 py-1 rounded-lg inline-block">
              {status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-10">
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b border-gray-200 pb-1 mb-3">Detalles del Evento</h2>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Evento</p>
              <p className="text-lg font-black">{eventData.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Fecha</p>
                <p className="font-bold">{eventData.date}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Horario</p>
                <p className="font-bold">{eventData.time}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Ubicación</p>
              <p className="font-bold">{eventData.salon}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b border-gray-200 pb-1 mb-3">Datos del Cliente</h2>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Cliente</p>
              <p className="text-lg font-black">{eventData.clientName}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Teléfono</p>
              <p className="font-bold">{eventData.clientPhone}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Invitados aprox.</p>
              <p className="font-bold">{eventData.guests.adults} Adultos / {eventData.guests.kids} Menores</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1">Presupuesto y Servicios</h2>
          {services.map((category, idx) => {
            const isMandatory = ["ALQUILER DEL SALÓN", "TÉCNICA", "IVA SALÓN", "GRUPO ELECTRÓGENO"].includes(category.category);

            return (
              <div key={idx} className="break-inside-avoid mb-6">
                <div className="flex justify-between items-center bg-gray-100 px-3 py-2 border-l-4 border-black mb-2">
                  <h3 className="text-xs font-black uppercase tracking-widest">
                    {category.category} {isMandatory && <span className="text-[8px] font-normal lowercase text-gray-400 opacity-60 ml-1">(obligatorio)</span>}
                  </h3>
                </div>
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-gray-300 text-gray-400">
                      <th className="py-2 font-black uppercase tracking-tighter w-12">Cant.</th>
                      <th className="py-2 font-black uppercase tracking-tighter">Descripción</th>
                      <th className="py-2 text-right font-black uppercase tracking-tighter">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {category.items.map((item: any, i: number) => {
                      const shouldHideState = category.category === 'GRUPO ELECTRÓGENO' && !item.amountPaid;
                      const printName = category.category === 'GRUPO ELECTRÓGENO' ? 'Grupo Electrógeno' : item.name;

                      return (
                        <tr key={i}>
                          <td className="py-2 font-bold">{item.qty}</td>
                          <td className="py-2">
                            <div className="font-bold">{printName}</div>
                          </td>
                          <td className="py-2 text-right font-bold">
                            {category.category === 'MOBILIARIO' ? `${item.qty} ${item.name}` : shouldHideState ? 'OBLIGATORIO' : item.status}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        <div className="mt-12 pt-8 border-t-2 border-gray-100 grid grid-cols-2 gap-10">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Observaciones y Notas</h4>
            <div className="text-[11px] text-gray-600 line-clamp-6 bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[100px]">
              {eventData.observations[0] || "Sin observaciones generales adicionales registradas en esta ficha."}
            </div>
          </div>
          <div className="flex flex-col justify-end items-end space-y-2">
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest uppercase mb-1">Fecha de impresión</p>
              <p className="text-xs font-bold">{new Date().toLocaleDateString('es-AR')} — {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs</p>
            </div>
            <div className="w-48 h-24 border-b border-black mt-8"></div>
            <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Firma del Cliente / Responsable</p>
          </div>
        </div>

        <div className="mt-10 text-center border-t border-gray-100 pt-4">
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Vicenzo — Ficha Técnica Operativa — No válida como comprobante fiscal</p>
        </div>
      </div>

      {/* Interactive UI - Hidden on Print */}
      <div className="max-w-7xl mx-auto print:hidden print-hidden flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between">
                <button
                  onClick={onBack}
                  className="h-10 px-4 bg-[#161B22] border border-[#30363D] rounded-xl text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-2 transition-all active:scale-95"
                >
                  <ChevronLeft size={18} /> <span className="text-xs font-bold">Volver</span>
                </button>
                <div className="lg:hidden flex items-center gap-2">
                  <span className="bg-[#C8A951]/10 text-[#C8A951] border border-[#C8A951]/20 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {eventData.category}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
                  <div className="hidden lg:block">
                    <span className="bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/30 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      {eventData.category}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-black text-[#E6EDF3] leading-tight max-w-xl">
                    {eventData.title}
                  </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3 lg:gap-6 bg-[#161B22]/50 p-4 lg:p-0 rounded-2xl border border-[#30363D]/30 lg:border-none">
                  <div className="flex items-center gap-3 text-[#E6EDF3] text-xs">
                    <div className="p-2 bg-[#C8A951]/10 rounded-lg text-[#C8A951]"><Calendar size={14} /></div>
                    <span className="font-medium">{eventData.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#E6EDF3] text-xs">
                    <div className="p-2 bg-[#C8A951]/10 rounded-lg text-[#C8A951]"><Clock size={14} /></div>
                    <span className="font-medium">{eventData.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#E6EDF3] text-xs">
                    <div className="p-2 bg-[#C8A951]/10 rounded-lg text-[#C8A951]"><MapPin size={14} /></div>
                    <span className="font-medium">{eventData.salon}</span>
                  </div>
                  {!areSenasPaid && (
                    <div className="hidden sm:flex items-center gap-2 bg-[#0D1117] px-3 py-1.5 rounded-lg border border-[#30363D] text-[10px] text-[#8B949E]">
                      <span className="font-black text-[#6E7681]">VALIDEZ PRECIO SEÑA:</span>
                      {(() => {
                        const d = new Date(eventData.createdAt);
                        d.setDate(d.getDate() + 30);
                        return d.toLocaleDateString('es-AR');
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <button onClick={() => window.print()} className="flex-1 sm:flex-none px-4 py-3 bg-[#161B22] border border-[#30363D] hover:bg-[#30363D] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                <Printer size={16} /> Imprimir
              </button>
              {(user.role === 'JEFE' || user.role === 'GUILLERMINA') && (
                <>
                  <button onClick={() => setIsPlanillaOpen(true)} className="flex-1 sm:flex-none px-4 py-3 bg-[#161B22] border border-[#30363D] hover:bg-[#30363D] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                    <FileText size={16} /> Planilla
                  </button>
                  <button onClick={() => setIsBalanceModalOpen(true)} className="flex-1 sm:flex-none px-4 py-3 bg-[#C8A951] text-[#0D1117] hover:bg-[#E3B341] rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C8A951]/10">
                    Balance ⚖️
                  </button>
                </>
              )}

              <div className="relative flex-1 sm:flex-none flex items-center gap-2">
                {!isEditingStatus ? (
                  <button
                    onClick={() => setIsEditingStatus(true)}
                    className="p-3 bg-[#161B22] border border-[#30363D] hover:border-[#8B949E] rounded-xl text-[#8B949E] hover:text-[#E6EDF3] transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                    <select
                      value={status}
                      autoFocus
                      onChange={(e) => {
                        setStatus(e.target.value as EventStatus);
                        setIsEditingStatus(false);
                      }}
                      onBlur={() => setIsEditingStatus(false)}
                      className="appearance-none border bg-[#161B22] border-[#30363D] font-black rounded-xl px-4 py-3 text-xs outline-none text-[#E6EDF3] focus:border-[#C8A951] custom-select"
                    >
                      <option value="POR_SENAR">POR SEÑAR</option>
                      <option value="SENA_EN_PROCESO">SEÑA EN PROCESO</option>
                      <option value="CONFIRMADO">CONFIRMADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>


          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { id: 'ALERTS', label: 'Alertas', icon: AlertTriangle },
              { id: 'CLIENT', label: 'Datos Cliente', icon: UserIcon },
              { id: 'OBS', label: 'Observaciones', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all border ${activeTab === tab.id
                    ? 'bg-[#30363D] border-[#8B949E] text-white shadow-sm'
                    : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:border-[#8B949E]/50'
                  }`}
              >
                <tab.icon size={12} /> {tab.label}
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
              {(user.role === 'JEFE' || user.role === 'GUILLERMINA') && (
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
              {(user.role === 'JEFE' || user.role === 'GUILLERMINA' || user.role === 'CATERING' || user.role === 'JULIA' || user.role === 'MILI' || user.role === 'ENCARGADO' || user.role === 'TIO_FRANCO') && (
                <div className="p-6 bg-[#161B22] border border-[#30363D] rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3FB950] flex items-center gap-2">
                      <UserIcon size={16} /> Observaciones para Catering / Planilla
                    </h3>
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
                </div>
              )}
            </div>
          )}

          {/* Secciones */}
          <div className="space-y-10">
            {services.map((category, idx) => {
              if (user.role === 'CATERING' && category.category !== 'CATERING') return null;

              const sectionPaid = category.items.reduce((sum, item: any) => sum + (item.amountPaid || 0), 0);
              const isPackActive = category.items.some((i: any) => i.name === 'Pack Premium' && i.status !== 'PENDIENTE');

              const totalUnitCount = category.items.reduce((sum, item: any) => {
                if (category.category === 'MOBILIARIO' && item.name.toLowerCase().includes('mesa')) return sum + (parseInt(item.qty) || 0);
                if (category.category === 'CATERING' && item.name.toLowerCase().includes('menú')) return sum + (parseInt(item.qty) || 0);
                return sum;
              }, 0);

              return (
                <div key={idx} className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden animate-in fade-in duration-300">
                  <div className="bg-[#1C2128] border-b border-[#30363D] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <h2 className="text-xs font-black text-[#E6EDF3] tracking-widest uppercase">{category.category}</h2>
                      <div className="h-4 w-[1px] bg-[#30363D]" />
                      {user.role !== 'CATERING' && (
                        <span className="text-[#3FB950] text-sm font-bold">
                          {(() => {
                            if (category.category === 'MOBILIARIO' || category.category === 'CATERING') {
                              return `${totalUnitCount} ${category.category === 'MOBILIARIO' ? 'Mesas' : 'Menús'}`;
                            }

                            const sectionTotal = category.items.reduce((sum, item: any) => sum + (parseFloat(item.price) * (parseFloat(item.qty) || 1)), 0);
                            const isFullyPaid = sectionPaid >= sectionTotal && sectionTotal > 0;

                            if (isFullyPaid) return 'PAGADO';
                            return `${formatCurrency(sectionPaid)} A CUENTA`;
                          })()}
                        </span>
                      )}
                      {category.category === 'CATERING' && (
                        <span className="text-[#8B949E] text-xs font-bold leading-relaxed">
                          {cateringPaymentSummary}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {(user.role === 'JEFE' || user.role === 'GUILLERMINA') && (
                        (() => {
                          const sectionTotal = category.items.reduce((sum, item: any) => sum + (parseFloat(item.price) * (parseFloat(item.qty) || 1)), 0);
                          const isFullyPaid = sectionPaid >= sectionTotal && sectionTotal > 0;
                          if (isFullyPaid) return null;

                          return (
                            <button
                              onClick={() => {
                                setSelectedCategoryForPayment(category.category);
                                if (category.items.length === 1) {
                                  const item = category.items[0];
                                  setSelectedItemForPayment(item);
                                  setPaymentForm({
                                    ...paymentForm,
                                    amount: item.price.toString(),
                                    qty: '1',
                                    method: (item.status === 'REGALO' || item.status === 'SIN CARGO') ? 'REGALO' : 'EFECTIVO'
                                  });
                                } else {
                                  setSelectedItemForPayment(null);
                                  setPaymentForm({ ...paymentForm, amount: '', qty: '1', method: 'EFECTIVO' });
                                }
                                setIsPaymentModalOpen(true);
                              }}
                              className="h-10 px-4 bg-[#3FB950] text-[#0D1117] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#3FB950]/20 flex items-center justify-center gap-2"
                            >
                              Registrar pago
                            </button>
                          );
                        })()
                      )}
                      {category.category === 'CATERING' && (user.role === 'JEFE' || user.role === 'GUILLERMINA' || user.role === 'JULIA') && (
                        <button
                          onClick={() => {
                            setCateringStep(1);
                            setCateringMenuType(null);
                            setIsAddCateringOpen(true);
                          }}
                          className="p-2 bg-[#1F6FEB]/10 text-[#1F6FEB] border border-[#1F6FEB]/30 hover:bg-[#1F6FEB]/20 rounded-xl transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#0D1117]/30 border-b border-[#30363D]/50">
                          <th className="px-6 py-3 text-[10px] font-black uppercase text-[#8B949E] tracking-widest">Cant.</th>
                          <th className="px-6 py-3 text-[10px] font-black uppercase text-[#8B949E] tracking-widest">Nombre</th>
                          {(user.role === 'JEFE' || user.role === 'GUILLERMINA') && (
                            <>
                              {category.category !== 'ALQUILER DEL SALÓN' && (
                                <th className="px-6 py-3 text-[10px] font-black uppercase text-[#8B949E] tracking-widest text-right">Precio ind.</th>
                              )}
                              <th className="px-6 py-3 text-[10px] font-black uppercase text-[#8B949E] tracking-widest text-right">Total</th>
                              <th className="px-6 py-3 text-[10px] font-black uppercase text-[#8B949E] tracking-widest text-center">Estado</th>
                              <th className="px-6 py-3 text-[10px] font-black uppercase text-[#8B949E] tracking-widest text-right">
                                {category.category === 'ALQUILER DEL SALÓN' ? 'Último Pago' : 'Acciones'}
                              </th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#30363D]/30 text-sm">
                        {category.items.map((item: any, iIdx) => {
                          const isIncludedInPack = PACK_PREMIUM_ITEMS.includes(item.id || '') || ['Cabina DJ con pantallas en pista', 'Barras Láser Beam', 'Craquera', '12 Cabezales Aro LED', 'Pantallas Laterales'].includes(item.name);
                          const isIncludedFurniture = INCLUDED_FURNITURE_LIST.includes(item.name);
                          const isFreeItem = item.status === 'REGALO' || item.status === 'SIN CARGO';
                          const qtyVal = parseInt(item.qty) || 1;
                          const unitPrice = isFreeItem ? 0 : item.price;
                          const totalPrice = getItemTotal(category.category, item);
                          const isFullyPaid = isItemFullyPaid(category.category, item);
                          const shouldCompactPaid = SINGLE_PAYMENT_CATEGORIES.includes(category.category) && isFullyPaid;
                          const shouldHidePrice = category.category === 'ALQUILER DEL SALÓN' && isFullyPaid;
                          const shouldHideRegister = category.category !== 'CATERING' && isFullyPaid;

                          return (
                            <tr key={iIdx} className={`hover:bg-[#0D1117]/20 transition-colors border-b border-[#30363D]/30 last:border-0 relative ${shouldCompactPaid ? 'opacity-70' : ''}`}>
                              <td className="px-6 py-4">
                                <span className="font-bold text-[#8B949E]">{item.qty}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#E6EDF3] tracking-tight">{item.name}</span>
                                    {item.isMandatory && <span className="bg-[#F85149] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">OBLIGATORIO</span>}
                                    {isFreeItem && <span className="bg-[#1F6FEB]/20 text-[#1F6FEB] border border-[#1F6FEB]/40 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{item.status}</span>}
                                  </div>
                                  {item.updatedBy && (
                                    <div className="flex items-center gap-1 text-[9px] text-[#8B949E] italic mt-0.5">
                                      <span>Modificado por {item.updatedBy}</span>
                                      {item.updatedAt && <span>el {item.updatedAt}</span>}
                                    </div>
                                  )}
                                  {item.subItems && (
                                    <div className="flex flex-col gap-0.5 mt-1 ml-2">
                                      {item.subItems.map((sub: string, subI: number) => (
                                        <span key={subI} className="text-[10px] text-[#8B949E] flex items-center gap-1">
                                          <div className="w-1 h-1 bg-[#30363D] rounded-full" /> {sub}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                              {(user.role === 'JEFE' || user.role === 'GUILLERMINA') && (
                                <>
                                  {category.category !== 'ALQUILER DEL SALÓN' && (
                                    <td className="px-6 py-4 text-right text-[#8B949E]">
                                      {category.category === 'TÉCNICA' || category.category === 'EXTRAS' || shouldHidePrice || totalPrice === 0 ? '—' : formatCurrency(unitPrice)}
                                    </td>
                                  )}
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex flex-col items-end gap-1">
                                      <span className={`font-bold ${totalPrice === 0 || shouldHidePrice ? 'text-[#8B949E]' : 'text-[#E6EDF3]'}`}>{shouldHidePrice ? 'PAGADO' : totalPrice === 0 ? '—' : formatCurrency(totalPrice)}</span>
                                      {category.category === 'ALQUILER DEL SALÓN' && totalPrice > 0 && (
                                        <div className="w-32 h-1.5 bg-[#161B22] rounded-full overflow-hidden border border-[#30363D]">
                                          <div
                                            className="h-full bg-[#161B22] transition-all duration-500"
                                            style={{ width: `${Math.min(100, (item.amountPaid / totalPrice) * 100)}%` }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    {category.category === 'ALQUILER DEL SALÓN' ? (
                                      <div className="flex flex-col items-center gap-1">
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${item.amountPaid >= totalPrice ? 'bg-[#3FB950]/20 text-[#3FB950]' :
                                            item.amountPaid > 0 ? 'bg-[#C8A951]/20 text-[#C8A951]' :
                                              'bg-[#30363D] text-[#8B949E]'
                                          }`}>
                                          {isFullyPaid ? 'PAGADO' : item.amountPaid > 0 ? `A CUENTA ${formatCurrency(item.amountPaid)}` : 'PENDIENTE'}
                                        </span>
                                        {item.amountPaid > 0 && item.amountPaid < totalPrice && (
                                          <span className="text-[10px] text-[#8B949E] font-medium">Restan {formatCurrency(totalPrice - item.amountPaid)}</span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${isIncludedFurniture || isFreeItem ? 'bg-[#3FB950]/20 text-[#3FB950]' :
                                          item.status === 'PENDIENTE' ? 'bg-[#30363D] text-[#8B949E]' :
                                            'bg-[#3FB950]/20 text-[#3FB950]'
                                        }`}>
                                        {isIncludedFurniture ? 'INCLUIDO' : (isPackActive && isIncludedInPack) ? 'EN PACK' : item.status}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    {category.category === 'ALQUILER DEL SALÓN' ? (
                                      <span className="text-xs font-medium text-[#8B949E]">{item.amountPaid >= totalPrice ? 'PAGADO' : item.lastPaymentDate || '—'}</span>
                                    ) : (
                                      <div className="flex items-center justify-end gap-2">
                                        {!shouldHideRegister && !isIncludedFurniture && !isFreeItem && (
                                          <button
                                            title="Pagar"
                                            onClick={() => {
                                              setSelectedCategoryForPayment(category.category);
                                              setSelectedItemForPayment(item);
                                              setPaymentForm({ ...paymentForm, amount: item.price.toString(), qty: '1', method: 'EFECTIVO' });
                                              setIsPaymentModalOpen(true);
                                            }}
                                            className="p-1.5 bg-[#C8A951]/10 text-[#C8A951] hover:bg-[#C8A951]/20 rounded transition-colors"
                                          >
                                            <DollarSign size={12} />
                                          </button>
                                        )}
                                        {!isFullyPaid && !item.isMandatory && (
                                          <button title="Eliminar" className="p-1.5 bg-[#F85149]/10 text-[#F85149] hover:bg-[#F85149]/20 rounded transition-colors">
                                            <Trash2 size={12} />
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="lg:hidden divide-y divide-[#30363D]/30">
                    {category.items.map((item: any, iIdx) => {
                      const totalPrice = (item.status === 'incluido' || INCLUDED_FURNITURE_LIST.includes(item.name)) ? 0 : item.price;
                      return (
                        <div key={iIdx} className="p-6 space-y-4">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-[#E6EDF3] text-sm leading-snug">{item.name}</h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {item.isMandatory && <span className="bg-[#F85149] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">OBLIGATORIO</span>}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#30363D]/30">
                            <div>
                              <span className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest block mb-1">Cantidad</span>
                              <span className="font-bold text-[#E6EDF3] text-sm">{item.qty}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest block mb-1">Total</span>
                              <span className={`font-black text-sm ${totalPrice === 0 ? 'text-[#8B949E]' : 'text-[#3FB950]'}`}>
                                {totalPrice === 0 ? 'Incluido' : formatCurrency(totalPrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer info */}
          <div className="mt-12 bg-[#161B22] border-t-2 border-[#1F6FEB]/30 p-6 rounded-b-2xl mb-20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h4 className="text-[#8B949E] text-[10px] font-black uppercase tracking-widest">Resumen de Cuenta</h4>
              <p className="text-[#8B949E] text-[10px] italic">Información consolidada de cobros procesados.</p>
            </div>
            <div className="flex flex-col sm:items-end gap-1">
              {(user.role === 'JEFE' || user.role === 'GUILLERMINA') && (
                <div className="flex items-center gap-3">
                  <span className="text-[#8B949E] text-[10px] font-bold uppercase">Total Acumulado Pagado:</span>
                  <span className="text-xl font-display font-black text-[#E6EDF3] tracking-tighter">{formatCurrency(totalPaid)}</span>
                </div>
              )}
              <div className="flex items-center justify-center sm:justify-end gap-1.5 text-[#3FB950] font-bold text-[9px] uppercase tracking-tighter bg-[#3FB950]/5 px-2 py-0.5 rounded border border-[#3FB950]/20">
                <CheckCircle size={10} /> Actualizado al día
              </div>
            </div>
          </div>
        </div>

        {/* Modales */}
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
            <div className="bg-[#161B22] border border-[#30363D] w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-[#1C2128] border-b border-[#30363D] px-8 py-6 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2"><DollarSign className="text-[#3FB950]" /> Registrar Pago / Servicio</h2>
                <button onClick={() => setIsPaymentModalOpen(false)} className="text-[#8B949E] hover:text-white transition-colors"><X size={24} /></button>
              </div>

              <div className="p-8">
                {!selectedItemForPayment ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-[#C8A951]/20 text-[#C8A951] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{selectedCategoryForPayment}</span>
                      <h3 className="text-sm font-bold text-[#8B949E]">Seleccione el servicio a registrar:</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {services.find(c => c.category === selectedCategoryForPayment)?.items.map((item: any, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedPremiumServices(PREMIUM_PACK_OPTIONS.map(option => option.id));
                            setSelectedItemForPayment(item);
                            setPaymentForm({
                              ...paymentForm,
                              amount: item.price.toString(),
                              method: (item.status === 'REGALO' || item.status === 'SIN CARGO') ? 'REGALO' : 'EFECTIVO'
                            });
                          }}
                          className="flex flex-col text-left p-4 bg-[#0D1117] border border-[#30363D] hover:border-[#C8A951] rounded-xl transition-all group"
                        >
                          <span className="font-bold text-[#E6EDF3] mb-1 group-hover:text-[#C8A951]">{item.name}</span>
                          {selectedCategoryForPayment !== 'TÉCNICA' && selectedCategoryForPayment !== 'EXTRAS' && (
                            <span className="text-xs text-[#8B949E]">{formatCurrency(item.price)}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-start justify-between bg-[#0D1117] p-5 rounded-2xl border border-[#30363D]">
                      <div>
                        <span className="text-[10px] font-black text-[#C8A951] uppercase tracking-[0.2em] mb-1 block">Servicio Seleccionado</span>
                        <h3 className="text-lg font-bold text-[#E6EDF3] leading-tight">{selectedItemForPayment.name}</h3>
                        <p className="text-xs text-[#8B949E] mt-1">Precio fijo: {formatCurrency(Number(paymentForm.amount || selectedItemForPayment.price))}</p>
                      </div>
                      <button onClick={() => setSelectedItemForPayment(null)} className="text-[10px] font-black text-[#F85149] uppercase hover:underline">Cambiar</button>
                    </div>

                    {selectedCategoryForPayment === 'TÉCNICA' && selectedItemForPayment.name === 'Pack Premium' && (
                      <div className="space-y-4 bg-[#0D1117] border border-[#30363D] rounded-2xl p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-black text-[#E6EDF3]">Servicios del Pack Premium</h4>
                            <p className="text-xs text-[#8B949E]">Marcá servicios puntuales o elegí pack completo para aplicar el descuento.</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedPremiumServices(PREMIUM_PACK_OPTIONS.map(option => option.id));
                              setPaymentForm({ ...paymentForm, amount: selectedItemForPayment.price.toString() });
                            }}
                            className="px-3 py-2 rounded-xl bg-[#C8A951] text-[#0D1117] text-[10px] font-black uppercase tracking-widest"
                          >
                            Pack completo
                          </button>
                        </div>
                        <div className="space-y-2">
                          {PREMIUM_PACK_OPTIONS.map(option => (
                            <label key={option.id} className="flex items-center justify-between p-3 rounded-xl border border-[#30363D]">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={selectedPremiumServices.includes(option.id)}
                                  onChange={(e) => {
                                    const next = e.target.checked
                                      ? [...selectedPremiumServices, option.id]
                                      : selectedPremiumServices.filter(id => id !== option.id);
                                    setSelectedPremiumServices(next);
                                    const fullPack = next.length === PREMIUM_PACK_OPTIONS.length;
                                    const partialTotal = PREMIUM_PACK_OPTIONS.filter(packItem => next.includes(packItem.id)).reduce((sum, packItem) => sum + packItem.price, 0);
                                    setPaymentForm({ ...paymentForm, amount: String(fullPack ? selectedItemForPayment.price : partialTotal) });
                                  }}
                                  className="accent-[#C8A951]"
                                />
                                <span className="text-sm font-bold text-[#E6EDF3]">{option.label}</span>
                              </div>
                              <span className="text-xs text-[#8B949E]">{formatCurrency(option.price)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {selectedCategoryForPayment !== 'ALQUILER DEL SALÓN' && selectedCategoryForPayment !== 'TÉCNICA' && selectedCategoryForPayment !== 'EXTRAS' && !['IVA SALÓN', 'GRUPO ELECTRÓGENO'].includes(selectedCategoryForPayment || '') && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Cantidad</label>
                          <input
                            type="number"
                            value={paymentForm.qty}
                            onChange={(e) => {
                              const newQty = e.target.value;
                              setPaymentForm({
                                ...paymentForm,
                                qty: newQty,
                                amount: (parseFloat(selectedItemForPayment.price) * (parseFloat(newQty) || 1)).toString()
                              });
                            }}
                            className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none focus:border-[#C8A951] font-bold"
                          />
                        </div>
                      )}
                      {(['IVA SALÓN', 'GRUPO ELECTRÓGENO'].includes(selectedCategoryForPayment || '') || selectedCategoryForPayment === 'TÉCNICA' || selectedCategoryForPayment === 'EXTRAS') ? (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Precio definido</label>
                          <div className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 font-bold text-[#3FB950]">
                            {formatCurrency(Number(paymentForm.amount || selectedItemForPayment.price))}
                          </div>
                          <p className="text-[10px] text-[#8B949E]">Este servicio usa el valor fijo del presupuesto.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1">Monto a registrar</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-[#8B949E] font-bold">$</span>
                            <input
                              type="number"
                              disabled={paymentForm.method === 'REGALO'}
                              value={paymentForm.method === 'REGALO' ? '0' : paymentForm.amount}
                              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                              className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-8 pr-4 py-3 outline-none font-bold text-[#3FB950] disabled:opacity-50 focus:border-[#C8A951]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest ml-1 block text-center">Forma de Pago / Estado</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'EFECTIVO', icon: DollarSign, color: '#3FB950' },
                          { id: 'TRANSFERENCIA', icon: CreditCard, color: '#1F6FEB' },
                          { id: 'PENDIENTE', icon: Clock, color: '#D29922' },
                          { id: 'REGALO', icon: Plus, color: '#C8A951' }
                        ].map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setPaymentForm({ ...paymentForm, method: method.id as any })}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${paymentForm.method === method.id
                                ? 'bg-[#E6EDF3] border-white text-black scale-105 shadow-xl'
                                : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#8B949E]/50'
                              }`}
                          >
                            <method.icon size={20} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{method.id}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {paymentForm.method === 'PENDIENTE' && (
                      <div className="p-4 bg-[#D29922]/10 border border-[#D29922]/30 rounded-xl flex items-center gap-3 text-xs text-[#D29922] font-bold">
                        <Clock size={16} />
                        Este servicio se sumará al saldo deudor del cliente.
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <button onClick={() => setIsPaymentModalOpen(false)} className="flex-1 px-4 py-4 rounded-xl border border-[#30363D] font-bold text-sm hover:bg-[#30363D] transition-all">Cancelar</button>
                      <button onClick={handleConfirmPayment} className="flex-[2] bg-[#3FB950] text-[#0D1117] font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-[#3FB950]/10 hover:brightness-110 active:scale-95 transition-all">
                        Confirmar {paymentForm.method === 'PENDIENTE' ? 'Servicio' : 'Cobro'}
                      </button>
                    </div>
                  </div>
                )}
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
                  Balance
                </h2>
                <button onClick={() => setIsBalanceModalOpen(false)} className="text-[#8B949E] hover:text-white"><X size={24} /></button>
              </div>
              <div className="space-y-6">
                <div className="flex p-1 bg-[#0D1117] rounded-full border border-[#30363D]">
                  <button onClick={() => setBalanceForm({ ...balanceForm, type: 'FAVOR' })} className={`flex-1 py-2 rounded-full text-[10px] font-black ${balanceForm.type === 'FAVOR' ? 'bg-[#3FB950] text-black' : 'text-[#8B949E]'}`}>A FAVOR</button>
                  <button onClick={() => setBalanceForm({ ...balanceForm, type: 'CONTRA' })} className={`flex-1 py-2 rounded-full text-[10px] font-black ${balanceForm.type === 'CONTRA' ? 'bg-[#F85149] text-white' : 'text-[#8B949E]'}`}>EN CONTRA</button>
                </div>
                <div className="space-y-4">
                  <input type="number" placeholder="Monto" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none" />
                  <textarea placeholder="Detalle" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 outline-none h-24" />
                </div>
                <button onClick={() => setIsBalanceModalOpen(false)} className="w-full py-4 bg-[#C8A951] text-black font-black rounded-xl text-xs uppercase tracking-widest">Guardar Balance</button>
              </div>
            </div>
          </div>
        )}

        {isAddFurnitureOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
            <div className="bg-[#161B22] border border-[#30363D] w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="text-[#1F6FEB]" /> Mobiliario</h2>
              <div className="space-y-6">
                <div className="flex p-1 bg-[#0D1117] rounded-xl border border-[#30363D]">
                  <button onClick={() => setFurnitureForm({ ...furnitureForm, type: 'INCLUIDO' })} className={`flex-1 py-2 rounded-lg text-xs font-bold ${furnitureForm.type === 'INCLUIDO' ? 'bg-[#1F6FEB] text-white' : 'text-[#8B949E]'}`}>SALÓN</button>
                  <button onClick={() => setFurnitureForm({ ...furnitureForm, type: 'EXTRA' })} className={`flex-1 py-2 rounded-lg text-xs font-bold ${furnitureForm.type === 'EXTRA' ? 'bg-[#C8A951] text-[#0D1117]' : 'text-[#8B949E]'}`}>EXTRA</button>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setIsAddFurnitureOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-[#30363D] font-bold text-sm">Cancelar</button>
                  <button onClick={() => setIsAddFurnitureOpen(false)} className="flex-1 bg-[#1F6FEB] text-white font-bold rounded-xl text-sm">Agregar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAddCateringOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
            <div className="bg-[#161B22] border border-[#30363D] w-full max-w-lg rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="text-[#1F6FEB]" /> Configurar Catering</h2>

              {cateringStep === 1 && (
                <div className="space-y-6">
                  <p className="text-[#8B949E] text-sm">Seleccione el tipo de menú a configurar:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setCateringMenuType('JOVENES')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${cateringMenuType === 'JOVENES' ? 'bg-[#1F6FEB] border-[#1F6FEB] text-white scale-105 shadow-xl shadow-[#1F6FEB]/20' : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#8B949E]/50'}`}>
                      <span className="font-bold">Menú Jóvenes</span>
                    </button>
                    <button onClick={() => setCateringMenuType('ADULTOS')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${cateringMenuType === 'ADULTOS' ? 'bg-[#1F6FEB] border-[#1F6FEB] text-white scale-105 shadow-xl shadow-[#1F6FEB]/20' : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#8B949E]/50'}`}>
                      <span className="font-bold">Menú Adultos</span>
                    </button>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button onClick={() => setIsAddCateringOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-[#30363D] font-bold text-sm hover:bg-[#30363D]">Cancelar</button>
                    <button disabled={!cateringMenuType} onClick={() => setCateringStep(2)} className="flex-1 bg-[#1F6FEB] text-white font-bold rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed">Siguiente</button>
                  </div>
                </div>
              )}

              {cateringStep === 2 && cateringMenuType === 'JOVENES' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <p className="text-[#8B949E] text-xs font-bold uppercase tracking-widest">Opciones - Menú Jóvenes</p>
                  <div className="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                    {[
                      { label: 'Menú jóvenes', price: 53000 },
                      { label: 'Barra de helados', price: 7700 },
                      { label: 'Pizzas (Después 1am)', price: 26500 },
                      { label: 'Mozos (1 cada 30 jóvenes)', price: 52000 }
                    ].map((item, idx) => (
                      <label key={idx} className="flex items-center justify-between p-4 bg-[#0D1117] border border-[#30363D] hover:border-[#1F6FEB]/50 rounded-xl cursor-pointer transition-all">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#30363D] text-[#1F6FEB] focus:ring-[#1F6FEB]" />
                          <span className="text-[#E6EDF3] font-bold text-sm">{item.label}</span>
                        </div>
                        <span className="text-[#8B949E] text-xs">${item.price.toLocaleString('es-AR')}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button onClick={() => setCateringStep(1)} className="flex-1 px-4 py-3 rounded-xl border border-[#30363D] font-bold text-sm hover:bg-[#30363D]">Atrás</button>
                    <button onClick={() => setIsAddCateringOpen(false)} className="flex-1 bg-[#1F6FEB] text-white font-bold rounded-xl text-sm shadow-lg shadow-[#1F6FEB]/20">Guardar Opciones</button>
                  </div>
                </div>
              )}

              {cateringStep === 2 && cateringMenuType === 'ADULTOS' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <p className="text-[#8B949E] text-xs font-bold uppercase tracking-widest">Opciones - Menú Adultos</p>
                  <div className="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                    {[
                      { label: 'Menú 1 (Tradicional)', price: 75000 },
                      { label: 'Menú 2 (Premium)', price: 92000 },
                      { label: 'Menú Pollo', price: 68000 },
                      { label: 'Buffet Frío/Caliente', price: 85000 },
                      { label: 'Mozos (1 cada 15 adultos)', price: 52000 }
                    ].map((item, idx) => (
                      <label key={idx} className="flex items-center justify-between p-4 bg-[#0D1117] border border-[#30363D] hover:border-[#1F6FEB]/50 rounded-xl cursor-pointer transition-all">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked={idx === 0 || idx === 4} className="w-4 h-4 rounded border-[#30363D] text-[#1F6FEB] focus:ring-[#1F6FEB]" />
                          <span className="text-[#E6EDF3] font-bold text-sm">{item.label}</span>
                        </div>
                        <span className="text-[#8B949E] text-xs">${item.price.toLocaleString('es-AR')}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button onClick={() => setCateringStep(1)} className="flex-1 px-4 py-3 rounded-xl border border-[#30363D] font-bold text-sm hover:bg-[#30363D]">Atrás</button>
                    <button onClick={() => setIsAddCateringOpen(false)} className="flex-1 bg-[#1F6FEB] text-white font-bold rounded-xl text-sm shadow-lg shadow-[#1F6FEB]/20">Guardar Opciones</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isAddTecnicaOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
            <div className="bg-[#161B22] border border-[#30363D] w-full max-w-lg rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="text-[#C8A951]" /> Configurar Técnica</h2>

              <div className="space-y-6">
                <p className="text-[#8B949E] text-sm mb-4">Seleccione los servicios a agregar al evento:</p>
                <div className="space-y-3">
                  {[
                    { label: 'Música, Luces y Pantallas (Base)', price: 1150000, isPack: false },
                    { label: 'Pack Luces Premium', price: 740000, isPack: true, subItems: ['Cabina DJ con pantallas', 'Barras Láser Beam', 'Craquera', '12 Cabezales Aro LED', 'Pantallas Laterales'] },
                    { label: 'Sonido para recepción exterior', price: 30000, isPack: false },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#0D1117] border border-[#30363D] rounded-xl flex flex-col gap-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked={item.isPack} className="w-4 h-4 rounded border-[#30363D] text-[#C8A951] focus:ring-[#C8A951]" />
                          <span className="text-[#E6EDF3] font-bold text-sm tracking-tight">{item.label}</span>
                        </div>
                        <span className="text-[#8B949E] text-xs">${item.price.toLocaleString('es-AR')}</span>
                      </label>
                      {item.isPack && (
                        <div className="pl-7 grid grid-cols-2 gap-2 mt-2">
                          {item.subItems?.map((sub, i) => (
                            <label key={i} className="flex items-center gap-2 text-xs text-[#8B949E] cursor-pointer hover:text-[#E6EDF3]">
                              <input type="checkbox" defaultChecked className="w-3 h-3 rounded border-[#30363D] text-[#C8A951] focus:ring-[#C8A951]" />
                              {sub}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setIsAddTecnicaOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-[#30363D] font-bold text-sm hover:bg-[#30363D]">Cancelar</button>
                  <button onClick={() => setIsAddTecnicaOpen(false)} className="flex-1 bg-[#C8A951] text-[#0D1117] font-black rounded-xl text-sm shadow-lg shadow-[#C8A951]/20">Actualizar Técnica</button>
                </div>
              </div>
            </div>
            </div>
        )}

            {/* Panel Lateral: Sesión Actual */}
            <div className="lg:w-80 shrink-0 space-y-6">
              <div className="sticky top-24 bg-[#161B22] border border-[#30363D] rounded-3xl p-6 shadow-2xl flex flex-col h-[calc(100vh-8rem)]">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#30363D]">
                  <h3 className="text-xs font-black text-[#8B949E] uppercase tracking-widest flex items-center gap-2">
                    <Clock size={16} /> Sesión Actual
                  </h3>
                  {sessionPayments.length > 0 && (
                    <span className="bg-[#3FB950] text-[#0D1117] text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                      VIVO
                    </span>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                  {sessionPayments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                      <div className="w-12 h-12 bg-[#0D1117] rounded-full flex items-center justify-center border border-[#30363D]">
                        <DollarSign size={20} className="text-[#8B949E]" />
                      </div>
                      <p className="text-xs font-medium text-[#8B949E] italic">No hay cobros registrados en esta visita.</p>
                    </div>
                  ) : (
                    sessionPayments.map((p, i) => (
                      <div key={p.id} className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 animate-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-[#8B949E] uppercase tracking-tighter truncate w-32">{p.service}</span>
                          <button onClick={() => setSessionPayments(prev => prev.filter(item => item.id !== p.id))} className="text-[#8B949E] hover:text-[#F85149] transition-colors"><X size={14} /></button>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                            <span className="text-lg font-display font-black text-[#3FB950] leading-none">{formatCurrency(p.amount)}</span>
                            <span className="text-[9px] font-bold text-[#8B949E] mt-1">{p.method}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {sessionPayments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-[#30363D] space-y-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-black text-[#8B949E] uppercase">Total Sesión</span>
                      <span className="text-2xl font-display font-black text-[#E6EDF3] tracking-tighter">
                        {formatCurrency(sessionPayments.reduce((acc, p) => acc + Number(p.amount), 0))}
                      </span>
                    </div>
                    <button
                      onClick={handleSaveSession}
                      className="w-full bg-[#3FB950] text-[#0D1117] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#3FB950]/10 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} /> Finalizar y Guardar
                    </button>
                  </div>
                )}
            </div>
          </div>
    </div>
    </div>
      );
};
