import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Calendar, Users, Package, CreditCard, BarChart3, LogOut,
  ChevronLeft, ChevronRight, Search, Filter, Plus,
  MapPin, Phone, Mail, AlertTriangle, CheckCircle, Clock,
  DollarSign, FileText, Edit2, Printer, X, ChevronDown, Menu, Tag, Scale,
  Settings, Trash2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// --- TYPES ---

type UserRole = 'JEFE' | 'RECEPCIONISTA' | 'PRODUCCION' | 'TIO_FRANCO' | 'CATERING';

interface User {
  id: string;
  name: string;
  role: UserRole;
}

type EventStatus = 'CONFIRMADO' | 'SENADO' | 'RESERVADO_PENDIENTE' | 'CANCELADO';
type EventCategory = 'CASAMIENTO' | 'QUINCEANERA' | 'CUMPLEANOS' | 'CORPORATIVO';

interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: EventCategory;
  guests: number;
  status: EventStatus;
  balance: number; // Pending balance
  total: number;
  paid: number;
}

interface ServiceItem {
  id: string;
  name: string;
  priceArs: number | null;
  priceUsd: number | null;
  currency: 'ARS' | 'USD';
  vigencia: string;
  category: string;
}

// --- MOCK DATA ---

const USERS: User[] = [
  { id: '1', name: 'Franco', role: 'JEFE' },
  { id: '2', name: 'Julia', role: 'RECEPCIONISTA' },
  { id: '3', name: 'Hernán', role: 'PRODUCCION' },
  { id: '4', name: 'Tío Franco', role: 'TIO_FRANCO' },
  { id: '5', name: 'Catering (Bolognini)', role: 'CATERING' },
  { id: '6', name: 'Orlando', role: 'JEFE' },
];

const EVENTS_DATA: Event[] = [
  // MARZO
  { id: '1', title: 'Casamiento Rodríguez-Pérez', date: '2026-03-01', category: 'CASAMIENTO', guests: 200, status: 'CONFIRMADO', balance: 0, total: 15000000, paid: 15000000 },
  { id: '2', title: 'Quinceañera Valentina Suárez', date: '2026-03-07', category: 'QUINCEANERA', guests: 160, status: 'SENADO', balance: 4800000, total: 18200000, paid: 13400000 },
  { id: '3', title: 'Cumpleaños Empresarial TechCorp', date: '2026-03-08', category: 'CORPORATIVO', guests: 180, status: 'SENADO', balance: -125000, total: 19800000, paid: 19925000 }, // Balance a favor (A cuenta)
  { id: '4', title: 'Quinceañera Isabella Torres', date: '2026-03-14', category: 'QUINCEANERA', guests: 140, status: 'RESERVADO_PENDIENTE', balance: 12400000, total: 16500000, paid: 4100000 }, // Deuda alta (Debe)
  { id: '5', title: 'Casamiento Moreno-Giuliani', date: '2026-03-15', category: 'CASAMIENTO', guests: 220, status: 'CONFIRMADO', balance: 0, total: 22800000, paid: 22800000 }, // Saldado
  { id: '6', title: 'Cumpleaños 50 — Roberto Paz', date: '2026-03-21', category: 'CUMPLEANOS', guests: 170, status: 'SENADO', balance: -45000, total: 14500000, paid: 14545000 }, // Pequeño a favor (A cuenta)
  { id: '7', title: 'Quinceañera Luciana Martínez', date: '2026-03-22', category: 'QUINCEANERA', guests: 190, status: 'CONFIRMADO', balance: 1200000, total: 17800000, paid: 16600000 }, // Deuda pendiente (Debe)
  { id: '8', title: 'Casamiento Blanco-Fernández', date: '2026-03-29', category: 'CASAMIENTO', guests: 210, status: 'SENADO', balance: 8900000, total: 21400000, paid: 12500000 },
  // ABRIL
  { id: '9', title: 'Casamiento López-García', date: '2026-04-05', category: 'CASAMIENTO', guests: 180, status: 'CONFIRMADO', balance: 0, total: 16000000, paid: 16000000 },
  { id: '10', title: 'Quinceañera Sofía Méndez', date: '2026-04-12', category: 'QUINCEANERA', guests: 150, status: 'SENADO', balance: 5000000, total: 17000000, paid: 12000000 },
  { id: '11', title: 'Cumpleaños 40 — Ana Ruiz', date: '2026-04-19', category: 'CUMPLEANOS', guests: 100, status: 'CONFIRMADO', balance: 0, total: 8000000, paid: 8000000 },
  { id: '12', title: 'Evento Corporativo Banco Macro', date: '2026-04-25', category: 'CORPORATIVO', guests: 250, status: 'RESERVADO_PENDIENTE', balance: 20000000, total: 25000000, paid: 5000000 },
  // MAYO
  { id: '13', title: 'Casamiento Pérez-Sánchez', date: '2026-05-03', category: 'CASAMIENTO', guests: 200, status: 'SENADO', balance: 10000000, total: 20000000, paid: 10000000 },
  { id: '14', title: 'Quinceañera Camila Fernández', date: '2026-05-10', category: 'QUINCEANERA', guests: 160, status: 'CONFIRMADO', balance: 0, total: 18000000, paid: 18000000 },
  { id: '15', title: 'Cumpleaños 18 — Juan Pérez', date: '2026-05-17', category: 'CUMPLEANOS', guests: 120, status: 'SENADO', balance: 4000000, total: 10000000, paid: 6000000 },
  { id: '16', title: 'Evento Corporativo Google', date: '2026-05-24', category: 'CORPORATIVO', guests: 300, status: 'CONFIRMADO', balance: 0, total: 30000000, paid: 30000000 },
  // JUNIO
  { id: '17', title: 'Casamiento Gómez-Martínez', date: '2026-06-07', category: 'CASAMIENTO', guests: 220, status: 'RESERVADO_PENDIENTE', balance: 15000000, total: 22000000, paid: 7000000 },
  { id: '18', title: 'Quinceañera Valentina López', date: '2026-06-14', category: 'QUINCEANERA', guests: 180, status: 'SENADO', balance: 8000000, total: 19000000, paid: 11000000 },
  { id: '19', title: 'Cumpleaños 60 — María García', date: '2026-06-21', category: 'CUMPLEANOS', guests: 150, status: 'CONFIRMADO', balance: 0, total: 12000000, paid: 12000000 },
  // JULIO
  { id: '20', title: 'Casamiento Ruiz-Sánchez', date: '2026-07-05', category: 'CASAMIENTO', guests: 200, status: 'SENADO', balance: 10000000, total: 20000000, paid: 10000000 },
  { id: '21', title: 'Quinceañera Sofía Pérez', date: '2026-07-12', category: 'QUINCEANERA', guests: 160, status: 'CONFIRMADO', balance: 0, total: 18000000, paid: 18000000 },
  // AGOSTO
  { id: '22', title: 'Cumpleaños 50 — Carlos Fernández', date: '2026-08-02', category: 'CUMPLEANOS', guests: 120, status: 'SENADO', balance: 4000000, total: 10000000, paid: 6000000 },
  { id: '23', title: 'Evento Corporativo Amazon', date: '2026-08-09', category: 'CORPORATIVO', guests: 300, status: 'CONFIRMADO', balance: 0, total: 30000000, paid: 30000000 },
  // SEPTIEMBRE
  { id: '24', title: 'Casamiento Martínez-Gómez', date: '2026-09-06', category: 'CASAMIENTO', guests: 220, status: 'RESERVADO_PENDIENTE', balance: 15000000, total: 22000000, paid: 7000000 },
  { id: '25', title: 'Quinceañera Valentina Ruiz', date: '2026-09-13', category: 'QUINCEANERA', guests: 180, status: 'SENADO', balance: 8000000, total: 19000000, paid: 11000000 },
  // OCTUBRE
  { id: '26', title: 'Cumpleaños 40 — Ana López', date: '2026-10-04', category: 'CUMPLEANOS', guests: 100, status: 'CONFIRMADO', balance: 0, total: 8000000, paid: 8000000 },
  { id: '27', title: 'Evento Corporativo Facebook', date: '2026-10-11', category: 'CORPORATIVO', guests: 250, status: 'RESERVADO_PENDIENTE', balance: 20000000, total: 25000000, paid: 5000000 },
  // NOVIEMBRE
  { id: '28', title: 'Casamiento Sánchez-Pérez', date: '2026-11-01', category: 'CASAMIENTO', guests: 200, status: 'SENADO', balance: 10000000, total: 20000000, paid: 10000000 },
  { id: '29', title: 'Quinceañera Camila Gómez', date: '2026-11-08', category: 'QUINCEANERA', guests: 160, status: 'CONFIRMADO', balance: 0, total: 18000000, paid: 18000000 },
  // DICIEMBRE
  { id: '30', title: 'Cumpleaños 18 — Juan Ruiz', date: '2026-12-06', category: 'CUMPLEANOS', guests: 120, status: 'SENADO', balance: 4000000, total: 10000000, paid: 6000000 },
  { id: '31', title: 'Evento Corporativo Apple', date: '2026-12-13', category: 'CORPORATIVO', guests: 300, status: 'CONFIRMADO', balance: 0, total: 30000000, paid: 30000000 },
];

const CATALOG_DATA: ServiceItem[] = [
  // TÉCNICA
  { id: 't1', category: 'TÉCNICA & SONIDO', name: 'Alquiler Salón / Seña', priceArs: 2000000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 't2', category: 'TÉCNICA & SONIDO', name: 'Música, Luces y Pantallas / Seña', priceArs: 1150000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 't3', category: 'TÉCNICA & SONIDO', name: 'Cabina DJ con pantallas en pista', priceArs: 130000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 't4', category: 'TÉCNICA & SONIDO', name: 'Barras Láser Beam', priceArs: 215000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 't5', category: 'TÉCNICA & SONIDO', name: 'Craquera', priceArs: 120000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 't6', category: 'TÉCNICA & SONIDO', name: '12 Cabezales Aro LED', priceArs: 210000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 't7', category: 'TÉCNICA & SONIDO', name: 'Pantallas Laterales', priceArs: 220000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 't8', category: 'TÉCNICA & SONIDO', name: 'Pack Luces Premium', priceArs: 740000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 't9', category: 'TÉCNICA & SONIDO', name: 'Sonido para recepción exterior', priceArs: 30000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 't10', category: 'TÉCNICA & SONIDO', name: 'Grupo Electrógeno', priceArs: 500000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  // FUEGOS
  { id: 'f1', category: 'FUEGOS ARTIFICIALES', name: 'Fontanas escalera (por unidad)', priceArs: null, priceUsd: 100, currency: 'USD', vigencia: 'Desde 01/03/25' },
  { id: 'f2', category: 'FUEGOS ARTIFICIALES', name: 'Fontanas pista (por unidad)', priceArs: null, priceUsd: 115, currency: 'USD', vigencia: 'Desde 01/03/25' },
  { id: 'f3', category: 'FUEGOS ARTIFICIALES', name: 'Fontanas portón (por unidad)', priceArs: null, priceUsd: 115, currency: 'USD', vigencia: 'Desde 01/03/25' },
  { id: 'f4', category: 'FUEGOS ARTIFICIALES', name: 'Cascada', priceArs: null, priceUsd: 128, currency: 'USD', vigencia: 'Desde 01/03/25' },
  // CATERING
  { id: 'c1', category: 'CATERING JÓVENES', name: 'Menú Jóvenes 15 años (por persona)', priceArs: 53000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'c2', category: 'CATERING JÓVENES', name: 'Recepción tipo KFC (por persona)', priceArs: 7700, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'c3', category: 'CATERING JÓVENES', name: 'Barra de helados (por persona)', priceArs: 7700, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'c4', category: 'CATERING JÓVENES', name: 'Barra de tragos (por persona)', priceArs: 4100, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'c5', category: 'CATERING JÓVENES', name: 'Combo tragos + KFC (por persona)', priceArs: 9500, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  // ADULTOS
  { id: 'a1', category: 'MENÚ ADULTOS', name: 'Menú 1 Adultos (por persona)', priceArs: 67000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'a2', category: 'MENÚ ADULTOS', name: 'Menú 2 Gourmet — pollo (por persona)', priceArs: 75000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'a3', category: 'MENÚ ADULTOS', name: 'Menú 2 Gourmet — lomo (por persona)', priceArs: 86000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'a4', category: 'MENÚ ADULTOS', name: 'Buffet 1 — 3 elementos (por persona)', priceArs: 17500, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'a5', category: 'MENÚ ADULTOS', name: 'Buffet 2 — 4 elementos (por persona)', priceArs: 22500, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  // PERSONAL
  { id: 'p1', category: 'PERSONAL', name: 'Mozo (por 12 hs)', priceArs: 52000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  // DECORACION
  { id: 'd1', category: 'DECORACIÓN', name: 'Juego de living (por juego)', priceArs: 35000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd2', category: 'DECORACIÓN', name: 'Mesas altas + banquetas (por juego)', priceArs: 20000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd3', category: 'DECORACIÓN', name: 'Fundas de silla (por unidad)', priceArs: 800, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd4', category: 'DECORACIÓN', name: 'Alas LED', priceArs: 15000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd5', category: 'DECORACIÓN', name: 'Cortinas LED', priceArs: 20000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd6', category: 'DECORACIÓN', name: 'Guirnaldas exterior', priceArs: 20000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd7', category: 'DECORACIÓN', name: 'Buzón', priceArs: 10000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd8', category: 'DECORACIÓN', name: 'Cabina fotográfica (3 horas)', priceArs: 100000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
];

// --- HELPERS ---

const formatCurrency = (amount: number, currency: 'ARS' | 'USD' = 'ARS') => {
  if (currency === 'USD') return `u$s ${amount}`;
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);
};

// --- COMPONENT PLACEHOLDERS ---

const CustomSelect = ({ value, onChange, options, label }: { value: string, onChange: (val: string) => void, options: { value: string, label: string }[], label: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-lg px-4 py-2.5 cursor-pointer flex justify-between items-center focus:outline-none focus:border-[#C8A951] focus:ring-1 focus:ring-[#C8A951]"
      >
        <span>{selectedOption?.label || 'Seleccionar...'}</span>
        <ChevronDown className={`h-4 w-4 text-[#8B949E] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#161B22] border border-[#30363D] rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {options.map(option => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 cursor-pointer hover:bg-[#30363D]/50 flex items-center justify-between ${value === option.value ? 'text-[#C8A951] bg-[#30363D]/20' : 'text-[#E6EDF3]'}`}
            >
              <span>{option.label}</span>
              {value === option.value && <CheckCircle size={16} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LoginView = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [selectedUser, setSelectedUser] = useState<string>(USERS[0].id);
  const [salon, setSalon] = useState('Vicenzo');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.id === selectedUser);
    if (user) onLogin(user);
  };

  const salonOptions = [
    { value: 'Vicenzo', label: 'Vicenzo' },
    { value: 'Casita San Javier', label: 'Casita San Javier' }
  ];

  const userOptions = USERS.map(user => ({
    value: user.id,
    label: `${user.name} (${user.role})`
  }));

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1117] text-[#E6EDF3] font-sans">
      <div className="w-full max-w-[420px] mx-4 bg-[#161B22] border border-[#30363D] rounded-xl p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://i.postimg.cc/fTXLSgfS/images-removebg-preview.png"
            alt="Vicenzo Logo"
            className="h-12 object-contain mb-4"
          />
          <h2 className="text-xl font-display font-semibold text-[#E6EDF3]">Sistema de Gestión de Eventos</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-2">Salón activo</label>
            <CustomSelect
              value={salon}
              onChange={setSalon}
              options={salonOptions}
              label="Salón activo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-2">Usuario</label>
            <CustomSelect
              value={selectedUser}
              onChange={setSelectedUser}
              options={userOptions}
              label="Usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-2">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#C8A951] focus:ring-1 focus:ring-[#C8A951]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#C8A951] hover:bg-[#D4B96A] text-[#0D1117] font-bold py-3 rounded-lg transition-colors"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

const Sidebar = ({ activeView, onChangeView, user, onLogout, isOpen, onClose }: any) => {
  const [salon, setSalon] = useState('Vicenzo');

  const menuItems = [
    { id: 'AGENDA', label: 'Agenda', icon: Calendar },
    { id: 'EVENTOS', label: 'Eventos', icon: FileText },
    { id: 'CATALOGO', label: 'Presupuesto', icon: Package, restricted: ['PRODUCCION', 'TIO_FRANCO', 'CATERING'] },
    { id: 'PAGOS', label: 'Pagos', icon: CreditCard, restricted: ['PRODUCCION', 'TIO_FRANCO', 'CATERING'] },
    { id: 'LIQUIDACIONES', label: 'Liquidaciones', icon: FileText, restricted: ['PRODUCCION', 'TIO_FRANCO'] },
    { id: 'REPORTES', label: 'Reportes', icon: BarChart3, restricted: ['PRODUCCION', 'TIO_FRANCO', 'CATERING'] },
    { id: 'GASTOS', label: 'Gastos Semanales', icon: DollarSign, restricted: ['RECEPCIONISTA', 'PRODUCCION', 'CATERING'] },
  ];

  const filteredItems = menuItems.filter(item => {
    if (user.role === 'CATERING') {
      return ['AGENDA', 'EVENTOS', 'LIQUIDACIONES'].includes(item.id);
    }
    return !item.restricted || !item.restricted.includes(user.role);
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0D1117] border-r border-[#30363D] 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col items-center border-b border-[#30363D]/50 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 text-[#8B949E] hover:text-[#E6EDF3] lg:hidden"
          >
            <X size={20} />
          </button>

          <img
            src="https://i.postimg.cc/fTXLSgfS/images-removebg-preview.png"
            alt="Vicenzo"
            className="h-10 object-contain mb-4"
          />

          <div className="relative w-full">
            <select
              value={salon}
              onChange={(e) => setSalon(e.target.value)}
              className="w-full bg-[#161B22] border border-[#30363D] text-[#E6EDF3] text-sm rounded-lg px-3 py-2 appearance-none focus:outline-none focus:border-[#C8A951]"
            >
              <option value="Vicenzo">Vicenzo</option>
              <option value="Casita San Javier">Casita San Javier</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-[#8B949E] pointer-events-none" />
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {filteredItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id);
                  onClose(); // Close sidebar on mobile when item clicked
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? 'bg-[#C8A951]/15 text-[#C8A951]'
                  : 'text-[#E6EDF3] hover:bg-[#161B22]'
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 space-y-1">
          <button
            onClick={() => {
              onChangeView('CONFIGURACION');
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'CONFIGURACION'
              ? 'bg-[#C8A951]/15 text-[#C8A951]'
              : 'text-[#E6EDF3] hover:bg-[#161B22]'
              }`}
          >
            <Settings size={18} />
            Configuración
          </button>
        </div>

        <div className="p-4 border-t border-[#30363D]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#161B22] border border-[#30363D] flex items-center justify-center text-[#C8A951] font-bold">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#E6EDF3] truncate">{user.name}</p>
              <p className="text-xs text-[#8B949E] truncate">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 text-[#F85149] hover:bg-[#F85149]/10 px-2 py-1.5 rounded text-sm transition-colors"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
};

const Modal = ({ isOpen, onClose, title, children, footer }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#30363D] shrink-0">
          <h3 className="text-lg font-display font-semibold text-[#E6EDF3]">{title}</h3>
          <button onClick={onClose} className="text-[#8B949E] hover:text-[#E6EDF3]">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-[#30363D] bg-[#0D1117]/50 rounded-b-xl shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

const AgendaView = ({ onSelectEvent }: { onSelectEvent: (id: string) => void }) => {
  const [viewMode, setViewMode] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Shift to start on Monday

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return EVENTS_DATA.filter(e => {
      const matchesDate = e.date === dateStr;
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
      default: return 'bg-[#8B5CF6]/20 border-l-2 border-[#8B5CF6] text-[#E6EDF3]';
    }
  };

  const getCategoryColorHex = (cat?: EventCategory) => {
    switch (cat) {
      case 'QUINCEANERA': return '#E91E8C';
      case 'CASAMIENTO': return '#1F6FEB';
      case 'CUMPLEANOS': return '#C8A951';
      case 'CORPORATIVO': return '#6B7280';
      default: return '#8B5CF6';
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
                <option value="CONFIRMADO">Confirmado</option>
                <option value="SENADO">Señado</option>
                <option value="RESERVADO_PENDIENTE">Reservado pendiente</option>
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
                        <div key={day} className="flex justify-center items-center h-6 relative">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all
                              ${hasEvents ? 'font-bold text-white shadow-sm' : 'text-[#8B949E]'}`}
                            style={hasEvents ? { backgroundColor: getCategoryColorHex(event?.category) } : {}}
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
                        <div className="mt-2 space-y-1.5">
                          {dayEvents.map(event => {
                            const statusLabel = event.status === 'RESERVADO_PENDIENTE' ? 'RESERVADO PENDIENTE' : event.status === 'SENADO' ? 'SEÑADO' : event.status;
                            return (
                              <div
                                key={event.id}
                                onClick={(e) => { e.stopPropagation(); onSelectEvent(event.id); }}
                                className={`text-xs p-1.5 rounded mb-1 truncate cursor-pointer hover:brightness-110 ${getEventColor(event.category)}`}
                              >
                                <div className="font-medium truncate">{event.title}</div>
                                <div className="opacity-75 text-[10px] uppercase flex justify-between">
                                  <span>{statusLabel}</span>
                                  {event.balance > 0 && <span className="text-[#F85149] font-bold">$</span>}
                                </div>
                              </div>
                            );
                          })}
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
                              'bg-[#8B5CF6]/20 text-[#8B5CF6]'
                        }`}>
                        {event.category === 'CASAMIENTO' ? '💍' : event.category === 'QUINCEANERA' ? '👑' : '🎉'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-[#E6EDF3] font-medium truncate">{event.title}</h3>
                        <div className="text-[#8B949E] text-sm flex items-center gap-2">
                          <span>{new Date(event.date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-xs font-bold px-2 py-1 rounded border ${event.status === 'CONFIRMADO' ? 'bg-[#3FB950]/10 text-[#3FB950] border-[#3FB950]/20' :
                          event.status === 'SENADO' ? 'bg-[#C8A951]/10 text-[#C8A951] border-[#C8A951]/20' :
                            event.status === 'CANCELADO' ? 'bg-[#F85149]/10 text-[#F85149] border-[#F85149]/20' :
                              'bg-[#D29922]/10 text-[#D29922] border-[#D29922]/20'
                          }`}>
                          {event.status === 'CONFIRMADO' ? 'CONF' : event.status === 'SENADO' ? 'SEÑADO' : event.status === 'CANCELADO' ? 'CANC' : 'RES.PEND'}
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

const CreateEventView = ({ onBack }: { onBack: () => void }) => {
  const [activeCategory, setActiveCategory] = useState<string>('TÉCNICA & SONIDO');
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);

  const categories = Array.from(new Set(CATALOG_DATA.map(item => item.category)));

  const toggleService = (item: ServiceItem) => {
    if (selectedServices.find(s => s.id === item.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== item.id));
    } else {
      setSelectedServices([...selectedServices, item]);
    }
  };

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 shrink-0 gap-4 lg:gap-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-1">
            <ChevronLeft size={20} /> Volver
          </button>
          <div className="h-6 w-px bg-[#30363D]" />
          <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Nuevo Evento</h1>
        </div>
        <button onClick={onBack} className="w-full lg:w-auto bg-[#C8A951] hover:bg-[#D4B96A] text-[#0D1117] px-6 py-2 rounded-lg font-bold transition-colors">
          Crear Evento
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:grid lg:grid-cols-12 gap-8">
        {/* Left Column: Form Data (Scrollable) */}
        <div className="lg:col-span-5 overflow-y-auto pr-2 space-y-6 pb-20 lg:pb-0">
          {/* Section 1: Datos del Evento */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
            <h4 className="text-[#C8A951] font-display font-medium mb-3 border-b border-[#30363D] pb-1">Datos del Evento</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#8B949E] mb-1">Nombre del evento</label>
                <input type="text" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" placeholder="Ej: Casamiento Pérez-Gómez" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B949E] mb-1">Categoría</label>
                <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none">
                  <option>Casamiento</option>
                  <option>Quinceañera</option>
                  <option>Cumpleaños</option>
                  <option>Corporativo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B949E] mb-1">Salón</label>
                <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none">
                  <option>Vicenzo</option>
                  <option>Casita San Javier</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Fecha y Horario */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
            <h4 className="text-[#C8A951] font-display font-medium mb-3 border-b border-[#30363D] pb-1">Fecha y Horario</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8B949E] mb-1">Fecha</label>
                <input type="date" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B949E] mb-1">Hora Inicio</label>
                <input type="time" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B949E] mb-1">Hora Fin</label>
                <input type="time" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Section 3: Invitados */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
            <h4 className="text-[#C8A951] font-display font-medium mb-3 border-b border-[#30363D] pb-1">Invitados</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8B949E] mb-1">Adultos</label>
                <input type="number" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B949E] mb-1">Niños</label>
                <input type="number" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B949E] mb-1">Total Estimado</label>
                <input type="number" disabled className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-[#8B949E] cursor-not-allowed" placeholder="0" />
              </div>
            </div>
          </div>

          {/* Section 4: Cliente */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
            <h4 className="text-[#C8A951] font-display font-medium mb-3 border-b border-[#30363D] pb-1">Datos del Cliente</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#8B949E] mb-1">Responsable Principal</label>
                <input type="text" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" placeholder="Nombre completo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B949E] mb-1">Teléfono</label>
                <input type="tel" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" placeholder="381..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B949E] mb-1">Email</label>
                <input type="email" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" placeholder="cliente@email.com" />
              </div>
            </div>
          </div>

          {/* Section 5: Observaciones */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
            <h4 className="text-[#C8A951] font-display font-medium mb-3 border-b border-[#30363D] pb-1">Observaciones</h4>
            <textarea className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none h-24" placeholder="Notas adicionales..."></textarea>
          </div>
        </div>

        {/* Right Column: Services (Fixed/Scrollable) */}
        <div className="lg:col-span-7 flex flex-col bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden h-[500px] lg:h-auto">
          <div className="p-4 border-b border-[#30363D] bg-[#0D1117]">
            <h3 className="text-[#E6EDF3] font-display font-semibold mb-4">Selección de Servicios</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === cat
                    ? 'bg-[#C8A951] text-[#0D1117]'
                    : 'bg-[#30363D] text-[#8B949E] hover:text-[#E6EDF3]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-2">
              {CATALOG_DATA.filter(item => item.category === activeCategory).map(item => {
                const isSelected = selectedServices.some(s => s.id === item.id);
                return (
                  <div key={item.id}
                    onClick={() => toggleService(item)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between group ${isSelected
                      ? 'bg-[#C8A951]/10 border-[#C8A951] shadow-[0_0_10px_rgba(200,169,81,0.1)]'
                      : 'bg-[#0D1117] border-[#30363D] hover:border-[#8B949E]'
                      }`}
                  >
                    <div>
                      <div className={`font-medium ${isSelected ? 'text-[#C8A951]' : 'text-[#E6EDF3]'}`}>{item.name}</div>
                      <div className="text-xs text-[#8B949E] mt-0.5">
                        {item.priceArs ? formatCurrency(item.priceArs) : (item.priceUsd ? `USD ${item.priceUsd}` : 'Consultar')}
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#C8A951] border-[#C8A951]' : 'border-[#8B949E] group-hover:border-[#E6EDF3]'
                      }`}>
                      {isSelected && <CheckCircle size={14} className="text-[#0D1117]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Summary */}
          <div className="p-4 border-t border-[#30363D] bg-[#0D1117]">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#8B949E]">{selectedServices.length} servicios seleccionados</span>
              <span className="text-[#E6EDF3] font-mono font-bold">
                Total estimado: {formatCurrency(selectedServices.reduce((acc, curr) => acc + (curr.priceArs || 0), 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventListView = ({ onSelectEvent, onCreateEvent, user }: { onSelectEvent: (id: string) => void, onCreateEvent: () => void, user: User }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const isProduction = user.role === 'PRODUCCION' || user.role === 'TIO_FRANCO';

  const filteredEvents = EVENTS_DATA.filter(event => {
    const matchesStatus = filterStatus === 'ALL' || event.status === filterStatus;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: EventStatus) => {
    const styles = {
      'CONFIRMADO': 'bg-[#3FB950]/15 text-[#3FB950] border-[#3FB950]/20',
      'SENADO': 'bg-[#C8A951]/15 text-[#C8A951] border-[#C8A951]/20',
      'RESERVADO_PENDIENTE': 'bg-[#D29922]/15 text-[#D29922] border-[#D29922]/20',
      'CANCELADO': 'bg-[#F85149]/15 text-[#F85149] border-[#F85149]/20',
    };
    const labels: Record<EventStatus, string> = {
      'CONFIRMADO': 'CONFIRMADO',
      'SENADO': 'SEÑADO',
      'RESERVADO_PENDIENTE': 'RESERVADO PENDIENTE',
      'CANCELADO': 'CANCELADO',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4 lg:gap-0">
        <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Eventos — Vicenzo</h1>
        {!isProduction && user.role !== 'CATERING' && (
          <button
            onClick={onCreateEvent}
            className="w-full lg:w-auto bg-[#1F6FEB] hover:bg-[#388BFD] text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Nuevo evento
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full sm:w-auto max-w-none sm:max-w-md">
          <Search className="absolute left-3 top-2.5 text-[#8B949E] h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#C8A951]"
          />
        </div>
        <div className="relative w-full sm:w-auto min-w-[200px]">
          <Filter className="absolute left-3 top-2.5 text-[#8B949E] h-4 w-4" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-10 pr-4 py-2 appearance-none focus:outline-none focus:border-[#C8A951]"
          >
            <option value="ALL">Todos los estados</option>
            <option value="CONFIRMADO">Confirmado</option>
            <option value="SENADO">Señado</option>
            <option value="RESERVADO_PENDIENTE">Reservado Pendiente</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-[#8B949E] pointer-events-none" />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:flex bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden flex-1 flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#0D1117] border-b border-[#30363D] text-[#8B949E] text-sm">
                <th className="p-4 font-medium">Evento</th>
                <th className="p-4 font-medium">Fecha</th>
                {user.role === 'CATERING' ? (
                  <>
                    <th className="p-4 font-medium text-center">Adultos</th>
                    <th className="p-4 font-medium text-center">Mozos</th>
                  </>
                ) : (
                  <>
                    <th className="p-4 font-medium">Categoría</th>
                    <th className="p-4 font-medium text-center">Invitados</th>
                  </>
                )}
                <th className="p-4 font-medium text-center">Estado</th>
                {!isProduction && user.role !== 'CATERING' && <th className="p-4 font-medium text-right">Balance</th>}
                <th className="p-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {filteredEvents.map(event => (
                <tr
                  key={event.id}
                  onClick={() => onSelectEvent(event.id)}
                  className="hover:bg-[#30363D]/20 cursor-pointer transition-colors group"
                >
                  <td className="p-4 font-medium text-[#E6EDF3]">{event.title}</td>
                  <td className="p-4 text-[#8B949E] tabular-nums">{new Date(event.date + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
                  {user.role === 'CATERING' ? (
                    <>
                      <td className="p-4 text-[#E6EDF3] text-center tabular-nums">{event.guests}</td>
                      <td className="p-4 text-[#E6EDF3] text-center tabular-nums">8</td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 text-[#E6EDF3] text-sm">{event.category}</td>
                      <td className="p-4 text-[#E6EDF3] text-center tabular-nums">{event.guests}</td>
                    </>
                  )}
                  <td className="p-4 text-center">{getStatusBadge(event.status)}</td>
                  {!isProduction && user.role !== 'CATERING' && (
                    <td className={`p-4 text-right tabular-nums font-medium ${event.balance > 0 ? 'text-[#F85149]' : event.balance < 0 ? 'text-[#3FB950]' : 'text-[#8B949E]'}`}>
                      {event.balance > 0 ? (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase opacity-70 leading-none mb-0.5">Debe</span>
                          <span>{formatCurrency(event.balance)}</span>
                        </div>
                      ) : event.balance < 0 ? (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase opacity-70 leading-none mb-0.5">A cuenta</span>
                          <span>{formatCurrency(Math.abs(event.balance))}</span>
                        </div>
                      ) : (
                        <span className="text-[#8B949E]">—</span>
                      )}
                    </td>
                  )}
                  <td className="p-4 text-center">
                    <button className="p-1.5 text-[#8B949E] hover:text-[#C8A951] hover:bg-[#C8A951]/10 rounded transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 pb-20">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            onClick={() => onSelectEvent(event.id)}
            className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 cursor-pointer active:bg-[#30363D]/20"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="font-medium text-[#E6EDF3] text-lg leading-tight pr-2">{event.title}</div>
              <div className="shrink-0">{getStatusBadge(event.status)}</div>
            </div>

            <div className="space-y-2 text-sm text-[#8B949E]">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{new Date(event.date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span>{user.role === 'CATERING' ? `${event.guests} adultos · 8 mozos` : `${event.guests} inv.`}</span>
                </div>
                {user.role !== 'CATERING' && (
                  <div className="flex items-center gap-2">
                    <Tag size={14} />
                    <span>{event.category}</span>
                  </div>
                )}
              </div>
            </div>

            {!isProduction && user.role !== 'CATERING' && event.balance !== 0 && (
              <div className="mt-3 pt-3 border-t border-[#30363D] flex justify-between items-center">
                <span className="text-sm text-[#8B949E]">{event.balance > 0 ? 'Debe:' : 'A cuenta:'}</span>
                <span className={`font-medium font-mono ${event.balance > 0 ? 'text-[#F85149]' : 'text-[#3FB950]'}`}>
                  {formatCurrency(Math.abs(event.balance))}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
const EventDetailView = ({ eventId, onBack, user }: { eventId: string, onBack: () => void, user: User }) => {
  const [isPlanillaOpen, setIsPlanillaOpen] = useState(false);
  const [status, setStatus] = useState<EventStatus>('SENADO');
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const isProduction = user.role === 'PRODUCCION' || user.role === 'TIO_FRANCO';

  // Mock specific data for this view as requested
  const eventData = {
    title: "Quinceañera Valentina Suárez",
    date: "Viernes 14 de marzo de 2026", // Updated to be near current simulated time (Mar 10, 2026)
    isoDate: "2026-03-14",
    time: "21:00 hs — 04:00 hs",
    salon: "Vicenzo",
    category: "QUINCEANERA",
    client: {
      resp1: "Jorge Suárez",
      resp2: "María Elena Suárez",
      address: "Av. Aconquija 1250, Yerba Buena",
      dni: "28.441.920",
      phone: "381-4521890 / 381-5778234",
      school: "Instituto Nuestra Señora del Huerto",
      decorator: "Carlos Nieto (381-6846518)"
    },
    guests: {
      min: 160,
      confirmed: 155,
      kids: 4,
      after: 12
    },
    senas: [
      { label: "Alquiler del Salón / Seña", date: "15/01/2026", status: "PAGADA" },
      { label: "Música, Luces y Pantallas / Seña", date: "22/01/2026", status: "PENDIENTE" }
    ],
    financial: {
      total: 18200000,
      collected: 13400000,
      pending: 4800000,
      senas: 3150000,
      account: 10250000
    },
    payments: [
      { date: "15/01/2026", desc: "Seña Alquiler", amount: 2000000, method: "Efectivo", user: "Franco" },
      { date: "22/01/2026", desc: "Seña Música/Luces", amount: 1150000, method: "Transferencia", user: "Julia" },
      { date: "10/02/2026", desc: "A cuenta — Menú Jóvenes", amount: 5000000, method: "Transferencia", user: "Julia" },
      { date: "25/02/2026", desc: "A cuenta — Pack Premium", amount: 400000, method: "Efectivo", user: "Franco" },
      { date: "01/03/2026", desc: "Vuelto de tarjeta - Crédito cliente", amount: 40000, method: "SISTEMA", user: "Admin", isMovement: true, movementType: 'A_CUENTA' },
      { date: "05/03/2026", desc: "Diferencia de cubiertos - Deuda", amount: 150000, method: "SISTEMA", user: "Julia", isMovement: true, movementType: 'DEBIENDO' },
      { date: "08/03/2026", desc: "A cuenta — Mobiliario", amount: 875000, method: "Transferencia", user: "Julia" },
    ],
    observations: [
      "1 mesa principal para 7 personas (quinceañera + corte).",
      "10 mesas rectangulares para adultos.",
      "Ceniceros — 2 jóvenes + 3 adultos.",
      "Confirmar decorador 72hs antes del evento."
    ]
  };

  const services = [
    {
      category: "TÉCNICA",
      items: [
        { name: "Música, Luces y Pantallas (base)", qty: "1u", price: 1150000, status: "PAGADO", isSena: true },
        { name: "Pack Luces Premium", qty: "1u", price: 740000, status: "A CUENTA" },
        { name: "Sonido para recepción exterior", qty: "1u", price: 30000, status: "PENDIENTE" },
        { name: "Fuegos — Fontanas escalera", qty: "7u", price: 700, status: "PENDIENTE", unitPrice: true },
        { name: "Fuegos — Fontanas pista", qty: "8u", price: 920, status: "PENDIENTE", unitPrice: true },
      ]
    },
    {
      category: "CATERING JÓVENES",
      items: [
        { name: "Menú Jóvenes 15 años", qty: "155p", price: 53000, status: "A CUENTA", unitPrice: true, subitems: ["Kiosco 1: Americano (hamburguesa)", "Kiosco 2: Italiano (ravioles)", "Kiosco 3: Mexicano (tacos)"] },
        { name: "Barra de helados", qty: "155p", price: 7700, status: "PENDIENTE", unitPrice: true },
        { name: "Barra de tragos", qty: "—", price: 4100, status: "PENDIENTE", unitPrice: true },
      ]
    },
    {
      category: "MENÚ ADULTOS",
      items: [
        { name: "(no incluido en este evento)", qty: "", price: 0, status: "", isInfo: true }
      ]
    },
    {
      category: "MEDIA TARJETA",
      items: [
        { name: "Niños (4) — ½ Menú Jóvenes", qty: "4p", price: 26500, status: "PENDIENTE", unitPrice: true },
        { name: "Después de 1 AM (12) — ½ Menú Jóvenes", qty: "12p", price: 26500, status: "PENDIENTE", unitPrice: true },
      ]
    },
    {
      category: "MOBILIARIO",
      items: [
        { name: "Mesas cuadradas", qty: "6u", price: 0, status: "incluido", isIncluded: true },
        { name: "Sillas metálicas", qty: "58u", price: 0, status: "incluido", isIncluded: true },
        { name: "Fundas de silla blancas", qty: "58u", price: 800, status: "PENDIENTE", unitPrice: true },
        { name: "Living (juegos)", qty: "5u", price: 35000, status: "A CUENTA", unitPrice: true },
        { name: "Mesas altas + banquetas", qty: "3u", price: 20000, status: "PENDIENTE", unitPrice: true },
      ]
    },
    {
      category: "DECORACIÓN Y EXTRAS",
      items: [
        { name: "Cabina fotográfica", qty: "1u", price: 100000, status: "A CUENTA" },
        { name: "Alas LED", qty: "1u", price: 15000, status: "PENDIENTE" },
        { name: "Grupo electrógeno", qty: "1u", price: 500000, status: "A CUENTA" },
      ]
    },
    {
      category: "PERSONAL",
      items: [
        { name: "Mozos", qty: "2u", price: 52000, status: "PENDIENTE", unitPrice: true, required: 4 },
      ]
    }
  ];

  const alerts = useMemo(() => {
    const list: { type: 'RED' | 'YELLOW', text: string }[] = [];

    // Señas no pagadas
    eventData.senas.forEach(sena => {
      if (sena.status !== 'PAGADA') {
        list.push({ type: 'RED', text: `Seña de ${sena.label} pendiente de pago` });
      }
    });

    // Invitados confirmados < mínimo contratado
    if (eventData.guests.confirmed < eventData.guests.min) {
      list.push({ type: 'YELLOW', text: `Invitados confirmados por debajo del mínimo (${eventData.guests.confirmed} vs ${eventData.guests.min})` });
    }

    // Mozos cargados < mozos requeridos
    const mozosItem: any = services.find(c => c.category === 'PERSONAL')?.items.find(i => i.name === 'Mozos');
    if (mozosItem && typeof mozosItem.required === 'number') {
      const loaded = parseInt(mozosItem.qty);
      if (loaded < mozosItem.required) {
        list.push({ type: 'RED', text: `Mozos insuficientes: se cargaron ${loaded}, se requieren ${mozosItem.required}` });
      }
    }

    // Evento en menos de 48hs y saldo pendiente
    const eventTime = new Date(eventData.isoDate + 'T12:00:00').getTime();
    const now = new Date().getTime();
    const hoursRemaining = (eventTime - now) / (1000 * 60 * 60);
    if (hoursRemaining < 48 && eventData.financial.pending > 0) {
      list.push({ type: 'RED', text: "Evento próximo con saldo sin cancelar" });
    }

    return list;
  }, [eventData, services]);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    type: 'A_CUENTA', // SENA, A_CUENTA, SALDO, ADICIONAL
    method: 'EFECTIVO',
    notes: ''
  });

  const [movementForm, setMovementForm] = useState({
    type: 'A_CUENTA',
    amount: '',
    currency: 'ARS',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log("Payment submitted:", paymentForm);
    setIsPaymentModalOpen(false);
    setPaymentForm({ amount: '', type: 'A_CUENTA', method: 'EFECTIVO', notes: '' });
  };

  const handleMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Movement submitted:", movementForm);
    setIsMovementModalOpen(false);
    setMovementForm({
      type: 'A_CUENTA',
      amount: '',
      currency: 'ARS',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const paymentTypes = [
    { value: 'SENA', label: 'Seña' },
    { value: 'A_CUENTA', label: 'A cuenta' },
    { value: 'SALDO', label: 'Saldo' },
    { value: 'ADICIONAL', label: 'Adicional' }
  ];

  const PlanillaOperativa = () => (
    <div className="fixed inset-0 z-[60] bg-white text-black overflow-auto p-8 font-mono text-sm">
      <div className="max-w-4xl mx-auto border border-black p-8 bg-white">
        <div className="flex justify-between items-start mb-6 border-b-2 border-black pb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">PLANILLA DE FIESTA — VICENZO</h1>
            <p>Fecha: Viernes 07/03/2025 &nbsp;&nbsp; Hora: 21:00 – 04:00 hs</p>
            <p>Evento: Quinceañera Valentina Suárez</p>
          </div>
          <div className="text-right no-print">
            <button onClick={() => window.print()} className="bg-black text-white px-4 py-2 rounded font-sans font-bold mr-2">IMPRIMIR</button>
            <button onClick={() => setIsPlanillaOpen(false)} className="bg-gray-200 px-4 py-2 rounded font-sans">CERRAR</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p><strong>Responsable:</strong> Jorge Suárez — 381-4521890</p>
            <p><strong>Colegio:</strong> Instituto Nuestra Señora del Huerto</p>
          </div>
          <div>
            <p><strong>Decorador:</strong> Carlos Nieto (381-6846518)</p>
          </div>
        </div>

        <div className="space-y-8">
          {[
            {
              title: "MOBILIARIO", items: [
                { name: "Mesas cuadradas", val: "SÍ", cant: "6" },
                { name: "Sillas metálicas", val: "SÍ", cant: "58" },
                { name: "Fundas blancas", val: "SÍ", cant: "58" },
                { name: "Living (juegos)", val: "SÍ", cant: "5" },
                { name: "Mesas altas + banquetas", val: "SÍ", cant: "3" },
              ]
            },
            {
              title: "TÉCNICA Y OPCIONALES", items: [
                { name: "Pack Luces Premium", val: "SÍ", cant: "" },
                { name: "Sonido exterior", val: "SÍ", cant: "" },
                { name: "Fuegos — Fontanas escalera", val: "SÍ", cant: "7" },
                { name: "Fuegos — Fontanas pista", val: "SÍ", cant: "8" },
                { name: "Cabina fotográfica", val: "SÍ", cant: "" },
                { name: "Alas LED", val: "SÍ", cant: "" },
                { name: "Grupo electrógeno", val: "SÍ", cant: "" },
              ]
            },
            {
              title: "CATERING", items: [
                { name: "Menú Jóvenes", val: "SÍ", cant: "155" },
                { name: "  Kiosco 1: Americano", val: "", cant: "" },
                { name: "  Kiosco 2: Italiano", val: "", cant: "" },
                { name: "  Kiosco 3: Mexicano", val: "", cant: "" },
                { name: "Barra de helados", val: "SÍ", cant: "155" },
                { name: "Barra de tragos", val: "SÍ", cant: "" },
                { name: "Kiosco tipo KFC", val: "NO", cant: "" },
                { name: "Niños", val: "SÍ", cant: "4" },
                { name: "Después de 1 AM", val: "SÍ", cant: "12" },
              ]
            },
          ].map((section, idx) => (
            <div key={idx} className="border border-black overflow-hidden">
              <div className="flex bg-[#0D1117] text-white print:bg-white print:text-black border-b border-black font-bold p-2 sticky top-0 md:top-[-1px] z-10">
                <span className="flex-1">{section.title}</span>
                <span className="w-16 text-center">SÍ/NO</span>
                <span className="w-16 text-center">CANT.</span>
              </div>
              <div className="divide-y divide-black/10">
                {section.items.map((item, i) => (
                  <div key={i} className={`flex py-2 px-2 items-center ${i % 2 !== 0 ? 'bg-gray-50' : 'bg-white'} print:bg-white`}>
                    <span className="flex-1">{item.name}</span>
                    <span className={`w-16 text-center font-bold ${item.val === 'SÍ' ? 'text-green-600 print:text-black' :
                      item.val === 'NO' ? 'text-red-600 print:text-black' : ''
                      }`}>
                      {item.val}
                    </span>
                    <span className="w-16 text-center">{item.cant}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="border border-black overflow-hidden">
            <div className="bg-[#0D1117] text-white print:bg-white print:text-black border-b border-black font-bold p-2 sticky top-0 md:top-[-1px] z-10 uppercase">
              PERSONAL
            </div>
            <div className="p-4 bg-white">
              <p className="flex items-center gap-2">
                <span className="font-bold">Mozos:</span>
                2 asignados <span className="text-red-600 font-bold">⚠️ (se recomiendan 4)</span>
              </p>
            </div>
          </div>

          <div className="border border-black overflow-hidden">
            <div className="bg-[#0D1117] text-white print:bg-white print:text-black border-b border-black font-bold p-2 sticky top-0 md:top-[-1px] z-10 uppercase">
              OBSERVACIONES
            </div>
            <div className="p-4 bg-white">
              <ul className="list-disc pl-5 space-y-1">
                {eventData.observations.map((obs, i) => <li key={i}>{obs}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-4 border-t-2 border-black text-center font-bold text-xl">
          ★ SIN VALORES ★
        </div>
      </div>
    </div>
  );

  if (isPlanillaOpen) return <PlanillaOperativa />;

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Mobile Top Row: Back + Status */}
        <div className="flex items-center justify-between lg:hidden">
          <button onClick={onBack} className="text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-1">
            <ChevronLeft size={20} /> Volver
          </button>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              className={`border font-bold rounded-lg pl-3 pr-8 py-1.5 text-sm appearance-none focus:outline-none ${status === 'CONFIRMADO' ? 'bg-[#3FB950]/10 border-[#3FB950]/30 text-[#3FB950] focus:border-[#3FB950]' :
                status === 'SENADO' ? 'bg-[#C8A951]/10 border-[#C8A951]/30 text-[#C8A951] focus:border-[#C8A951]' :
                  status === 'RESERVADO_PENDIENTE' ? 'bg-[#D29922]/10 border-[#D29922]/30 text-[#D29922] focus:border-[#D29922]' :
                    'bg-[#F85149]/10 border-[#F85149]/30 text-[#F85149] focus:border-[#F85149]'
                }`}
            >
              <option value="CONFIRMADO">CONFIRMADO</option>
              <option value="SENADO">SEÑADO</option>
              <option value="RESERVADO_PENDIENTE">RESERVADO PENDIENTE</option>
              <option value="CANCELADO">CANCELADO</option>
            </select>
            <ChevronDown className={`absolute right-2 top-2.5 h-3 w-3 pointer-events-none ${status === 'CONFIRMADO' ? 'text-[#3FB950]' :
              status === 'SENADO' ? 'text-[#C8A951]' :
                status === 'RESERVADO_PENDIENTE' ? 'text-[#D29922]' :
                  'text-[#F85149]'
              }`} />
          </div>
        </div>

        {/* Desktop Header Layout */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-1">
              <ChevronLeft size={20} /> Volver
            </button>
            <div className="h-6 w-px bg-[#30363D]" />
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/30 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                  15 AÑOS
                </span>
                <h1 className="text-xl font-display font-bold text-[#E6EDF3]">{eventData.title}</h1>
              </div>
              <div className="text-[#8B949E] text-sm mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1"><Calendar size={14} /> {eventData.date}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {eventData.time}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> Salón: {eventData.salon}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlanillaOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#161B22] border border-[#30363D] hover:bg-[#30363D] text-[#E6EDF3] rounded-lg transition-colors"
            >
              <Printer size={18} />
              <span>Ver Planilla Operativa</span>
            </button>
            {!isProduction && (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#3FB950] hover:bg-[#2ea043] text-white rounded-lg font-bold transition-colors"
              >
                <DollarSign size={18} />
                <span>Registrar Pago</span>
              </button>
            )}
            {user.role !== 'CATERING' && (
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                  className={`border font-bold rounded-lg pl-4 pr-10 py-2 appearance-none focus:outline-none ${status === 'CONFIRMADO' ? 'bg-[#3FB950]/10 border-[#3FB950]/30 text-[#3FB950] focus:border-[#3FB950]' :
                    status === 'SENADO' ? 'bg-[#C8A951]/10 border-[#C8A951]/30 text-[#C8A951] focus:border-[#C8A951]' :
                      status === 'RESERVADO_PENDIENTE' ? 'bg-[#D29922]/10 border-[#D29922]/30 text-[#D29922] focus:border-[#D29922]' :
                        'bg-[#F85149]/10 border-[#F85149]/30 text-[#F85149] focus:border-[#F85149]'
                    }`}
                >
                  <option value="CONFIRMADO">CONFIRMADO</option>
                  <option value="SENADO">SEÑADO</option>
                  <option value="RESERVADO_PENDIENTE">RESERVADO PENDIENTE</option>
                  <option value="CANCELADO">CANCELADO</option>
                </select>
                <ChevronDown className={`absolute right-3 top-3 h-4 w-4 pointer-events-none ${status === 'CONFIRMADO' ? 'text-[#3FB950]' :
                  status === 'SENADO' ? 'text-[#C8A951]' :
                    status === 'RESERVADO_PENDIENTE' ? 'text-[#D29922]' :
                      'text-[#F85149]'
                  }`} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Content Header */}
        <div className="lg:hidden space-y-4">
          <div className="bg-[#161B22] p-4 rounded-2xl border border-[#30363D] shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">
                {eventData.category}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-[#8B949E] uppercase font-bold tracking-widest">
                <MapPin size={10} className="text-[#C8A951]" /> {eventData.salon}
              </div>
            </div>

            <h1 className="text-xl font-display font-bold text-[#E6EDF3] leading-tight mb-4">{eventData.title}</h1>

            <div className="grid grid-cols-1 gap-2.5">
              <div className="flex items-center gap-3 text-[#E6EDF3] text-sm bg-[#0D1117]/50 p-2 rounded-lg border border-[#30363D]/50">
                <Calendar size={16} className="text-[#C8A951]" />
                <span>{eventData.date}</span>
              </div>
              <div className="flex items-center gap-3 text-[#E6EDF3] text-sm bg-[#0D1117]/50 p-2 rounded-lg border border-[#30363D]/50">
                <Clock size={16} className="text-[#C8A951]" />
                <span>{eventData.time}</span>
              </div>
            </div>
          </div>

          {/* Mobile Main Actions */}
          <div className="grid grid-cols-12 gap-2">
            <button
              onClick={() => setIsPlanillaOpen(true)}
              className="col-span-4 flex flex-col items-center justify-center gap-1.5 p-3 bg-[#161B22] border border-[#30363D] active:bg-[#30363D] text-[#E6EDF3] rounded-xl transition-all"
            >
              <Printer size={18} className="text-[#8B949E]" />
              <span className="text-[10px] font-bold uppercase">Planilla</span>
            </button>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="col-span-6 flex items-center justify-center gap-2 p-3 bg-[#3FB950] active:bg-[#2ea043] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#3FB950]/10"
            >
              <DollarSign size={20} />
              <span>PAGO</span>
            </button>
            <button
              onClick={() => setIsMovementModalOpen(true)}
              className="col-span-2 flex items-center justify-center p-3 bg-[#161B22] border border-[#30363D] active:bg-[#30363D] text-[#E6EDF3] rounded-xl transition-all"
              title="Movimiento de dinero"
            >
              <Scale size={20} className="text-[#8B949E]" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar & Financial Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6 border-b border-[#30363D] pb-6">
        <div className="w-full md:w-auto">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            {[
              { id: 'ALERTS', label: 'Alertas', icon: AlertTriangle, color: '#F85149' },
              { id: 'CLIENT', label: 'Datos', icon: Users, color: '#C8A951' },
              { id: 'GUESTS', label: 'Invitados', icon: Users, color: '#C8A951' },
              { id: 'PAYMENTS', label: 'Pagos', icon: CreditCard, color: '#C8A951' },
              { id: 'OBS', label: 'Obs.', icon: FileText, color: '#C8A951' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${activeTab === tab.id
                  ? 'bg-[#C8A951] border-[#C8A951] text-[#0D1117] shadow-lg shadow-[#C8A951]/10'
                  : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:border-[#8B949E]'
                  }`}
              >
                <tab.icon size={14} className={activeTab === tab.id ? 'text-[#0D1117]' : ''} style={activeTab === tab.id ? {} : { color: tab.color }} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {!isProduction && (
          <div className="w-full md:w-auto">
            <div className="bg-[#0D1117] border border-[#3FB950]/30 border-l-4 border-l-[#3FB950] rounded-2xl px-5 py-3 shadow-lg flex justify-between items-center md:block">
              <div className="text-[#8B949E] text-[10px] font-bold uppercase tracking-widest mb-1">TOTAL COBRADO</div>
              <div className="text-2xl font-display font-bold text-[#3FB950] font-mono">
                {formatCurrency(eventData.financial.collected)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Panel Overlay/Content */}
      {
        activeTab && (
          <div className="mb-6 bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-[#30363D] pb-3">
              <h3 className="text-lg font-display font-bold text-[#E6EDF3] flex items-center gap-2">
                {activeTab === 'ALERTS' && <><AlertTriangle className="text-[#F85149]" /> Alertas y Estado de Señas</>}
                {activeTab === 'CLIENT' && <><Users className="text-[#C8A951]" /> Datos del Cliente</>}
                {activeTab === 'GUESTS' && <><Users className="text-[#C8A951]" /> Invitados y Mínimos</>}
                {activeTab === 'PAYMENTS' && <><CreditCard className="text-[#C8A951]" /> Historial de Pagos</>}
                {activeTab === 'OBS' && <><FileText className="text-[#C8A951]" /> Observaciones</>}
              </h3>
              <button onClick={() => setActiveTab(null)} className="text-[#8B949E] hover:text-[#E6EDF3]">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {activeTab === 'ALERTS' && (
                <div className="space-y-4">
                  {alerts.length > 0 ? (
                    alerts.map((alert, i) => (
                      <div key={i} className={`p-4 rounded-lg border flex items-center gap-3 ${alert.type === 'RED' ? 'bg-[#F85149]/10 border-[#F85149]/30 text-[#E6EDF3]' : 'bg-[#D29922]/10 border-[#D29922]/30 text-[#E6EDF3]'
                        }`}>
                        <AlertTriangle size={20} className={alert.type === 'RED' ? 'text-[#F85149]' : 'text-[#D29922]'} />
                        <span className="font-medium">{alert.text}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-[#3FB950]/5 border border-[#3FB950]/20 rounded-xl">
                      <CheckCircle size={32} className="text-[#3FB950] mx-auto mb-3" />
                      <span className="text-[#3FB950] font-bold">✅ Sin alertas para este evento</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'CLIENT' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-4">
                    <div>
                      <span className="block text-[#8B949E] text-xs font-medium uppercase tracking-wider mb-1">Responsables</span>
                      <div className="text-[#E6EDF3] text-base">{eventData.client.resp1}</div>
                      <div className="text-[#E6EDF3] text-base">{eventData.client.resp2}</div>
                    </div>
                    <div>
                      <span className="block text-[#8B949E] text-xs font-medium uppercase tracking-wider mb-1">Dirección</span>
                      <div className="text-[#E6EDF3] text-base">{eventData.client.address}</div>
                    </div>
                    <div>
                      <span className="block text-[#8B949E] text-xs font-medium uppercase tracking-wider mb-1">Colegio</span>
                      <div className="text-[#E6EDF3] text-base">{eventData.client.school}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[#8B949E] text-xs font-medium uppercase tracking-wider mb-1">DNI</span>
                        <div className="text-[#E6EDF3] text-base font-mono">{eventData.client.dni}</div>
                      </div>
                      <div>
                        <span className="block text-[#8B949E] text-xs font-medium uppercase tracking-wider mb-1">Teléfonos</span>
                        <div className="text-[#E6EDF3] text-base font-mono">{eventData.client.phone}</div>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[#8B949E] text-xs font-medium uppercase tracking-wider mb-1">Decorador</span>
                      <div className="text-[#E6EDF3] text-base">{eventData.client.decorator}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'GUESTS' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
                      <h4 className="text-[#8B949E] text-xs font-bold uppercase tracking-wider mb-4">Garantía y Contratación</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-[#8B949E]">Mínimo contratado:</span>
                          <span className="text-[#E6EDF3] font-bold font-mono">{eventData.guests.min}</span>
                        </div>
                        <div className={`flex justify-between items-center p-3 border-l-4 rounded-r-lg ${eventData.guests.confirmed < eventData.guests.min ? 'bg-[#D29922]/10 border-[#D29922]' : 'bg-[#3FB950]/10 border-[#3FB950]'}`}>
                          <span className="text-[#E6EDF3] font-medium font-display">Confirmados:</span>
                          <span className="text-[#E6EDF3] text-xl font-bold font-mono">{eventData.guests.confirmed}</span>
                        </div>
                        {eventData.guests.confirmed < eventData.guests.min && (
                          <p className="text-xs text-[#D29922]">⚠️ Confirmados por debajo del mínimo contratado</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
                      <h4 className="text-[#8B949E] text-xs font-bold uppercase tracking-wider mb-4">Desglose de invitados</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#8B949E]">Adultos:</span>
                          <span className="text-[#E6EDF3] font-mono">{eventData.guests.confirmed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8B949E]">Niños (3-8 años):</span>
                          <span className="text-[#E6EDF3] font-mono">{eventData.guests.kids}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8B949E]">Después de 1 AM:</span>
                          <span className="text-[#E6EDF3] font-mono">{eventData.guests.after}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'PAYMENTS' && (
                <div className="bg-[#0D1117] rounded-xl border border-[#30363D] overflow-hidden">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-[#161B22] border-b border-[#30363D] text-[#8B949E]">
                        <th className="p-3 font-medium">Fecha</th>
                        <th className="p-3 font-medium">Descripción</th>
                        <th className="p-3 font-medium">Monto</th>
                        <th className="p-3 font-medium">Método</th>
                        <th className="p-3 font-medium">Usuario</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#30363D]">
                      {eventData.payments.map((pay, i) => (
                        <tr key={i} className="text-[#E6EDF3] hover:bg-[#161B22]/50">
                          <td className="p-3 font-mono text-[#8B949E]">{pay.date}</td>
                          <td className="p-3">
                            <div className="flex flex-col">
                              <span>{pay.desc}</span>
                              {(pay as any).isMovement && (
                                <span className={`text-[10px] font-bold w-max px-1.5 rounded mt-0.5 ${(pay as any).movementType === 'A_CUENTA' ? 'bg-[#3FB950]/10 text-[#3FB950]' : 'bg-[#F85149]/10 text-[#F85149]'}`}>
                                  {(pay as any).movementType === 'A_CUENTA' ? 'A CUENTA' : 'DEBIENDO'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className={`p-3 font-bold font-mono ${(pay as any).isMovement && (pay as any).movementType === 'DEBIENDO' ? 'text-[#F85149]' : ''}`}>
                            {formatCurrency(pay.amount)}
                          </td>
                          <td className="p-3 text-[#8B949E]">{pay.method}</td>
                          <td className="p-3 text-[#8B949E]">{pay.user}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'OBS' && (
                <div className="space-y-4">
                  <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
                    <textarea
                      readOnly
                      className="w-full bg-transparent border-none text-[#E6EDF3] text-sm focus:outline-none min-h-[150px] resize-none"
                      value={eventData.observations.join('\n')}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Content Grid */}
      <div className="pb-20 lg:pb-0">
        {/* Main Content - Always visible (Services) */}
        <div className="w-full">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
            <h3 className="text-[#E6EDF3] font-display font-semibold mb-6 flex items-center gap-2">
              <Package size={20} className="text-[#C8A951]" /> Servicios contratados
            </h3>


            <div className="space-y-8">
              {services.map((cat, i) => (
                <div key={i} className="bg-[#0D1117]/30 rounded-lg p-4 border border-[#30363D]/50">
                  <h4 className="text-[#8B949E] text-xs font-bold uppercase tracking-wider border-b border-[#30363D] pb-2 mb-4">
                    {cat.category}
                  </h4>
                  <div className="space-y-4">
                    {cat.items.map((item: any, j) => (
                      <div key={j} className={`relative p-3 rounded-lg transition-colors ${item.alert ? 'bg-[#F85149]/5 border border-[#F85149]/20' : 'hover:bg-[#161B22]/50'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {item.isIncluded && <CheckCircle size={14} className="text-[#3FB950]" />}
                              {item.isSena && <CheckCircle size={14} className="text-[#3FB950]" />}
                              {item.alert && <AlertTriangle size={16} className="text-[#F85149]" />}
                              <span className={`text-sm ${item.isInfo ? 'text-[#8B949E] italic' : 'text-[#E6EDF3] font-medium'}`}>
                                {item.name}
                              </span>
                            </div>
                            {item.subitems && (
                              <div className="ml-6 mt-1.5 space-y-1">
                                {item.subitems.map((sub: string, k: number) => (
                                  <div key={k} className="text-xs text-[#8B949E] flex items-center gap-1.5">
                                    <span className="text-[#30363D]">↳</span> {sub}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {!item.isInfo && !isProduction && (
                            <div className="text-right ml-4">
                              <div className="flex items-center justify-end gap-3">
                                {item.qty && <span className="text-xs text-[#8B949E] font-mono">{item.qty}</span>}
                                <span className="text-sm text-[#E6EDF3] font-mono font-medium min-w-[100px]">
                                  {item.price === 0 ? 'incluido' : formatCurrency(item.price)}
                                  {item.unitPrice && <span className="text-[10px] text-[#8B949E] block">c/u</span>}
                                </span>
                              </div>
                              <div className={`text-[10px] font-bold mt-1 uppercase tracking-tighter ${item.status === 'PAGADO' || item.status === 'incluido' ? 'text-[#3FB950]' :
                                item.status === 'A CUENTA' ? 'text-[#C8A951]' :
                                  'text-[#8B949E]'
                                }`}>
                                {item.status}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        title="Nuevo movimiento de dinero"
        footer={
          <>
            <button
              onClick={() => setIsMovementModalOpen(false)}
              className="px-4 py-2 text-[#8B949E] hover:text-[#E6EDF3] rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleMovementSubmit}
              className="px-4 py-2 bg-[#C8A951] text-[#0D1117] rounded-lg font-bold hover:bg-[#D4B96A] transition-colors"
            >
              Guardar movimiento
            </button>
          </>
        }
      >
        <form onSubmit={handleMovementSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-2">Tipo de movimiento</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMovementForm({ ...movementForm, type: 'A_CUENTA' })}
                className={`p-3 rounded-xl border text-center transition-all ${movementForm.type === 'A_CUENTA' ? 'bg-[#3FB950]/10 border-[#3FB950] text-[#3FB950]' : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#8B949E]'}`}
              >
                <div className="font-bold text-sm">A cuenta</div>
                <div className="text-[10px] opacity-70">(Adelanto/Vuelto)</div>
              </button>
              <button
                type="button"
                onClick={() => setMovementForm({ ...movementForm, type: 'DEBIENDO' })}
                className={`p-3 rounded-xl border text-center transition-all ${movementForm.type === 'DEBIENDO' ? 'bg-[#F85149]/10 border-[#F85149] text-[#F85149]' : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#8B949E]'}`}
              >
                <div className="font-bold text-sm">Debiendo</div>
                <div className="text-[10px] opacity-70">(Deuda generada)</div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Monto</label>
              <input
                type="number"
                value={movementForm.amount}
                onChange={(e) => setMovementForm({ ...movementForm, amount: e.target.value })}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Moneda</label>
              <select
                value={movementForm.currency}
                onChange={(e) => setMovementForm({ ...movementForm, currency: e.target.value })}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none"
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Fecha</label>
            <input
              type="date"
              value={movementForm.date}
              onChange={(e) => setMovementForm({ ...movementForm, date: e.target.value })}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Descripción</label>
            <textarea
              value={movementForm.description}
              onChange={(e) => setMovementForm({ ...movementForm, description: e.target.value })}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none resize-none h-20"
              placeholder="Ej: Vuelto de tarjeta — $40.000"
              required
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Registrar Nuevo Pago"
        footer={
          <>
            <button
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2 text-[#E6EDF3] hover:bg-[#30363D] rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handlePaymentSubmit}
              className="px-4 py-2 bg-[#3FB950] text-white rounded-lg font-bold hover:bg-[#2ea043] transition-colors"
            >
              Confirmar Pago
            </button>
          </>
        }
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Monto</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-[#8B949E]">$</span>
              <input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-8 pr-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Tipo de Pago</label>
            <div className="relative">
              <select
                value={paymentForm.type}
                onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] appearance-none focus:border-[#C8A951] focus:outline-none"
              >
                {paymentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8B949E] pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Método de Pago</label>
            <div className="relative">
              <select
                value={paymentForm.method}
                onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] appearance-none focus:border-[#C8A951] focus:outline-none"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="TARJETA">Tarjeta de Crédito/Débito</option>
                <option value="CHEQUE">Cheque</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8B949E] pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Notas / Observaciones</label>
            <textarea
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none min-h-[80px]"
              placeholder="Detalles adicionales..."
            />
          </div>
        </form>
      </Modal>
    </div >
  );
};

const CateringEventDetailView = ({ eventData }: { eventData: any }) => {
  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-display font-bold text-[#E6EDF3] mb-4">{eventData.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#8B949E]">
            <Calendar size={16} />
            <span>{eventData.date}</span>
          </div>
          <div className="flex items-center gap-2 text-[#8B949E]">
            <Clock size={16} />
            <span>{eventData.time}</span>
          </div>
          <div className="flex items-center gap-2 text-[#8B949E]">
            <MapPin size={16} />
            <span>{eventData.salon}</span>
          </div>
        </div>
        <div className="bg-[#0D1117] rounded-lg p-4 border border-[#30363D]">
          <h3 className="text-[#C8A951] font-medium mb-3">Cantidades</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#8B949E]">Adultos:</span>
              <span className="text-[#E6EDF3] font-bold">{eventData.guests.confirmed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B949E]">Mozos:</span>
              <span className="text-[#E6EDF3] font-bold">8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LiquidacionesView = () => (
  <div className="p-4 lg:p-8 h-full flex flex-col items-center justify-center">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 bg-[#161B22] border border-[#30363D] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C8A951]">
        <Clock size={40} />
      </div>
      <h1 className="text-3xl font-display font-bold text-[#E6EDF3] mb-4">Liquidaciones — Catering</h1>
      <p className="text-lg text-[#8B949E] leading-relaxed">
        Este módulo está en construcción.<br />
        Próximamente podrás gestionar las liquidaciones del catering por evento desde acá.
      </p>
    </div>
  </div>
);
const CatalogView = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);

  const categories = ['ALL', ...Array.from(new Set(CATALOG_DATA.map(item => item.category)))];

  const filteredCatalog = activeCategory === 'ALL'
    ? CATALOG_DATA
    : CATALOG_DATA.filter(item => item.category === activeCategory);

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4 lg:gap-0">
        <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Presupuesto de Servicios</h1>
        <button
          className="w-full lg:w-auto bg-[#1F6FEB] hover:bg-[#388BFD] text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Agregar servicio
        </button>
      </div>

      {/* Mobile Category Filter (Dropdown) */}
      <div className="lg:hidden mb-6 relative">
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="w-full bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-4 pr-10 py-3 appearance-none focus:outline-none focus:border-[#C8A951] font-medium"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'ALL' ? 'Todos los servicios' : cat}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-[#8B949E] pointer-events-none" />
      </div>

      {/* Desktop Category Filter (Buttons) */}
      <div className="hidden lg:flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat
              ? 'bg-[#C8A951] text-[#0D1117]'
              : 'bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#8B949E]'
              }`}
          >
            {cat === 'ALL' ? 'Todos' : cat}
          </button>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:flex bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden flex-1 flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-[#0D1117] z-10">
              <tr className="border-b border-[#30363D] text-[#8B949E] text-sm">
                <th className="p-4 font-medium">Servicio</th>
                <th className="p-4 font-medium">Categoría</th>
                <th className="p-4 font-medium text-right">Precio ARS</th>
                <th className="p-4 font-medium text-right">Precio USD</th>
                <th className="p-4 font-medium text-center">Moneda</th>
                <th className="p-4 font-medium">Vigencia</th>
                <th className="p-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {filteredCatalog.map(item => (
                <tr key={item.id} className="hover:bg-[#30363D]/20 transition-colors group">
                  <td className="p-4 font-medium text-[#E6EDF3]">{item.name}</td>
                  <td className="p-4 text-[#8B949E] text-xs uppercase tracking-wider">{item.category}</td>
                  <td className="p-4 text-right tabular-nums text-[#E6EDF3]">
                    {item.priceArs ? formatCurrency(item.priceArs) : '—'}
                  </td>
                  <td className="p-4 text-right tabular-nums text-[#E6EDF3]">
                    {item.priceUsd ? `u$s ${item.priceUsd}` : '—'}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${item.currency === 'USD' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
                      {item.currency}
                    </span>
                  </td>
                  <td className="p-4 text-[#8B949E] text-sm">{item.vigencia}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 text-[#8B949E] hover:text-[#C8A951] hover:bg-[#C8A951]/10 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#30363D] rounded transition-colors">
                        <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 pb-20">
        {filteredCatalog.map(item => (
          <div
            key={item.id}
            className="bg-[#161B22] border border-[#30363D] rounded-xl p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium text-[#E6EDF3] text-lg leading-tight pr-2">{item.name}</div>
              <button
                onClick={() => setEditingItem(item)}
                className="p-1.5 text-[#8B949E] hover:text-[#C8A951] hover:bg-[#C8A951]/10 rounded transition-colors shrink-0"
              >
                <Edit2 size={16} />
              </button>
            </div>

            <div className="mb-3">
              <span className="text-[#8B949E] text-xs font-bold uppercase tracking-wider bg-[#30363D]/50 px-2 py-1 rounded">
                {item.category}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <span className="block text-[#8B949E] text-xs mb-0.5">Precio ARS</span>
                <span className="text-[#E6EDF3] font-mono font-medium">
                  {item.priceArs ? formatCurrency(item.priceArs) : '—'}
                </span>
              </div>
              <div>
                <span className="block text-[#8B949E] text-xs mb-0.5">Precio USD</span>
                <span className="text-[#E6EDF3] font-mono font-medium">
                  {item.priceUsd ? `u$s ${item.priceUsd}` : '—'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#30363D]">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded ${item.currency === 'USD' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
                  {item.currency}
                </span>
              </div>
              <span className="text-[#8B949E] text-xs">Vigencia: {item.vigencia}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Editar Precio"
        footer={
          <>
            <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-[#E6EDF3] hover:bg-[#30363D] rounded-lg font-medium transition-colors">Cancelar</button>
            <button onClick={() => setEditingItem(null)} className="px-4 py-2 bg-[#C8A951] text-[#0D1117] rounded-lg font-bold hover:bg-[#D4B96A] transition-colors">Guardar Cambios</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Servicio</label>
            <input type="text" value={editingItem?.name || ''} disabled className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#8B949E] cursor-not-allowed" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Nuevo Precio</label>
              <input type="number" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Moneda</label>
              <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none">
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Vigencia desde</label>
            <input type="date" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" />
          </div>
        </div>
      </Modal>
    </div>
  );
};
const ReportsView = () => {
  const dataIncome = [
    { name: 'Oct', value: 8200000 },
    { name: 'Nov', value: 11400000 },
    { name: 'Dic', value: 15800000 },
    { name: 'Ene', value: 9100000 },
    { name: 'Feb', value: 11350000 },
    { name: 'Mar', value: 13400000, active: true },
  ];

  const dataReservations = [
    { name: 'Oct', value: 2 },
    { name: 'Nov', value: 4 },
    { name: 'Dic', value: 8 },
    { name: 'Ene', value: 3 },
    { name: 'Feb', value: 5 },
    { name: 'Mar', value: 6 },
  ];

  const dataPie = [
    { name: '15 años', value: 3, color: '#C8A951' },
    { name: 'Casamiento', value: 3, color: '#1F6FEB' },
    { name: 'Cumpleaños', value: 2, color: '#3FB950' },
  ];

  const topEvents = [
    { name: 'Casamiento Moreno-Giuliani', total: 22800000, collected: 22800000, percent: 100 },
    { name: 'Casamiento Blanco-Fernández', total: 21400000, collected: 12500000, percent: 58 },
    { name: 'Cumpleaños Empresarial TechCorp', total: 19800000, collected: 13600000, percent: 69 },
    { name: 'Quinceañera Valentina Suárez', total: 18200000, collected: 13400000, percent: 74 },
  ];

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col overflow-y-auto">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 lg:gap-0">
        <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Reportes — Marzo 2025</h1>
        <div className="relative w-full lg:w-auto">
          <select className="w-full lg:w-auto bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-4 pr-10 py-2 appearance-none focus:outline-none focus:border-[#C8A951]">
            <option>Este mes</option>
            <option>Último trimestre</option>
            <option>Este año</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8B949E] pointer-events-none" />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <div className="text-[#8B949E] text-sm font-medium mb-2">Eventos este mes</div>
          <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">8</div>
          <div className="text-[#3FB950] text-xs font-medium flex items-center gap-1">
            ▲ 2 vs mes ant.
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <div className="text-[#8B949E] text-sm font-medium mb-2">Ingresos cobrados</div>
          <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">$13.4M</div>
          <div className="text-[#3FB950] text-xs font-medium flex items-center gap-1">
            ▲ +18% vs feb
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <div className="text-[#8B949E] text-sm font-medium mb-2">Saldo pendiente</div>
          <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">$24.4M</div>
          <div className="text-[#D29922] text-xs font-medium flex items-center gap-1">
            ⚠️ 3 eventos
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <div className="text-[#8B949E] text-sm font-medium mb-2">Señas del mes</div>
          <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">5 señas</div>
          <div className="text-[#8B949E] text-xs font-medium flex items-center gap-1">
            en Marzo
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
          <h3 className="text-[#E6EDF3] font-display font-semibold mb-6">Ingresos por mes</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataIncome}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                <XAxis dataKey="name" stroke="#8B949E" tick={{ fill: '#8B949E' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#8B949E" tick={{ fill: '#8B949E' }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000000}M`} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0D1117', borderColor: '#30363D', color: '#E6EDF3' }}
                  itemStyle={{ color: '#E6EDF3' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {dataIncome.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.active ? '#C8A951' : '#1F6FEB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
          <h3 className="text-[#E6EDF3] font-display font-semibold mb-6">Distribución por categoría</h3>
          <div className="flex flex-col sm:flex-row items-center">
            <div className="h-64 w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0D1117', borderColor: '#30363D', color: '#E6EDF3' }}
                    itemStyle={{ color: '#E6EDF3' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-4">
              {dataPie.map((entry, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <div>
                    <div className="text-[#E6EDF3] font-medium">{entry.name}</div>
                    <div className="text-[#8B949E] text-sm">{entry.value} eventos</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Services */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#30363D]">
            <h3 className="text-[#E6EDF3] font-display font-semibold flex items-center gap-2">
              <Package size={18} className="text-[#C8A951]" /> Servicios más contratados
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { name: 'Pack Luces Premium', count: 12, percent: 85 },
                { name: 'Cabina Fotográfica', count: 10, percent: 71 },
                { name: 'Fuegos Artificiales', count: 8, percent: 57 },
                { name: 'Barra de Tragos', count: 7, percent: 50 },
                { name: 'Robot LED', count: 5, percent: 35 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#E6EDF3]">{item.name}</span>
                    <span className="text-[#8B949E]">{item.count} eventos ({item.percent}%)</span>
                  </div>
                  <div className="h-2 bg-[#0D1117] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C8A951]" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Menus */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#30363D]">
            <h3 className="text-[#E6EDF3] font-display font-semibold flex items-center gap-2">
              <FileText size={18} className="text-[#1F6FEB]" /> Menús más vendidos
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {[
              { name: 'Menú Jóvenes 15 años', count: 450, color: '#1F6FEB' },
              { name: 'Menú 2 Gourmet — Lomo', count: 320, color: '#3FB950' },
              { name: 'Menú 1 Adultos', count: 210, color: '#D29922' },
              { name: 'Buffet Premium', count: 150, color: '#F85149' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#0D1117]" style={{ backgroundColor: item.color }}>
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-[#E6EDF3] font-medium">{item.name}</div>
                  <div className="text-[#8B949E] text-xs">{item.count} cubiertos vendidos</div>
                </div>
                <div className="text-[#E6EDF3] font-bold text-lg">
                  {Math.round((item.count / 1130) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonality - Sales */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#30363D]">
            <h3 className="text-[#E6EDF3] font-display font-semibold flex items-center gap-2">
              <BarChart3 size={18} className="text-[#3FB950]" /> Meses con mayor facturación
            </h3>
          </div>
          <div className="p-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Dic', value: 15800000 },
                  { name: 'Mar', value: 13400000 },
                  { name: 'Nov', value: 11400000 },
                  { name: 'Feb', value: 11350000 },
                  { name: 'Ene', value: 9100000 },
                ]} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#8B949E" tick={{ fill: '#E6EDF3' }} width={30} axisLine={false} tickLine={false} />
                  <RechartsTooltip
                    cursor={{ fill: '#30363D', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#0D1117', borderColor: '#30363D', color: '#E6EDF3' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="value" fill="#3FB950" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Seasonality - Events Count */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#30363D]">
            <h3 className="text-[#E6EDF3] font-display font-semibold flex items-center gap-2">
              <Calendar size={18} className="text-[#F85149]" /> Meses con más eventos
            </h3>
          </div>
          <div className="p-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Diciembre', value: 12 },
                  { name: 'Noviembre', value: 10 },
                  { name: 'Marzo', value: 8 },
                  { name: 'Febrero', value: 7 },
                  { name: 'Enero', value: 5 },
                ]} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#8B949E" tick={{ fill: '#E6EDF3' }} width={70} axisLine={false} tickLine={false} />
                  <RechartsTooltip
                    cursor={{ fill: '#30363D', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#0D1117', borderColor: '#30363D', color: '#E6EDF3' }}
                  />
                  <Bar dataKey="value" fill="#F85149" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* New Chart - Seasonality - Reservations Count */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#30363D]">
            <h3 className="text-[#E6EDF3] font-display font-semibold flex items-center gap-2">
              <BarChart3 size={18} className="text-[#E8570A]" /> Meses con más reservas
            </h3>
          </div>
          <div className="p-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataReservations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                  <XAxis dataKey="name" stroke="#8B949E" tick={{ fill: '#E6EDF3' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0D1117', borderColor: '#30363D', color: '#E6EDF3' }}
                    cursor={{ fill: '#30363D', opacity: 0.4 }}
                  />
                  <Bar dataKey="value" fill="#E8570A" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const PaymentsView = ({ onSelectEvent }: { onSelectEvent: (id: string) => void }) => {
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
      case 'Transferencia': return <CheckCircle size={16} className="text-[#1F6FEB]" />; // Using CheckCircle as generic icon for transfer
      case 'Tarjeta': return <CreditCard size={16} className="text-[#C8A951]" />;
      default: return <DollarSign size={16} />;
    }
  };

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col overflow-y-auto">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 lg:gap-0">
        <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Pagos — Vicenzo</h1>
        <div className="relative w-full lg:w-auto">
          <select className="w-full lg:w-auto bg-[#161B22] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-4 pr-10 py-2 appearance-none focus:outline-none focus:border-[#C8A951]">
            <option>Este mes</option>
            <option>Último trimestre</option>
            <option>Este año</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8B949E] pointer-events-none" />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#161B22] border border-[#30363D] border-t-4 border-t-[#3FB950] rounded-xl p-5">
          <div className="text-[#8B949E] text-sm font-medium mb-2">Total cobrado</div>
          <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">$13.400.000</div>
          <div className="text-[#3FB950] text-xs font-medium flex items-center gap-1">
            ▲ +18% vs feb
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] border-t-4 border-t-[#F85149] rounded-xl p-5">
          <div className="text-[#8B949E] text-sm font-medium mb-2">Señas pendientes</div>
          <div className="text-3xl font-display font-bold text-[#E6EDF3] mb-1">{eventsWithoutFullSena}</div>
          <div className="text-[#F85149] text-xs font-medium flex items-center gap-1 leading-tight">
            eventos sin seña completa
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
          <h3 className="text-[#E6EDF3] font-display font-semibold">Historial de Pagos</h3>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="w-full sm:w-auto bg-[#1F6FEB] hover:bg-[#388BFD] text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Registrar pago manual
          </button>
        </div>

        <div className="p-4 border-b border-[#30363D] space-y-4">
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
            <div className="flex gap-2">
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#C8A951]"
                title="Desde"
              />
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#C8A951]"
                title="Hasta"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-2.5 text-[#8B949E] h-4 w-4" />
              <select
                value={filterEvent}
                onChange={(e) => setFilterEvent(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-10 pr-4 py-2 text-sm appearance-none focus:outline-none focus:border-[#C8A951]"
              >
                <option value="ALL">Todos los eventos</option>
                {Array.from(new Set(payments.map(p => p.event))).map(evt => (
                  <option key={evt} value={evt}>{evt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-[#8B949E] pointer-events-none" />
            </div>
            <div className="relative flex-1">
              <Users className="absolute left-3 top-2.5 text-[#8B949E] h-4 w-4" />
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-lg pl-10 pr-4 py-2 text-sm appearance-none focus:outline-none focus:border-[#C8A951]"
              >
                <option value="ALL">Todos los usuarios</option>
                {Array.from(new Set(payments.map(p => p.user))).map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-[#8B949E] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-[#161B22] z-10">
              <tr className="border-b border-[#30363D] text-[#8B949E] text-xs uppercase tracking-wider">
                <th className="p-4 font-medium w-48">Fecha / Detalle</th>
                <th className="p-4 font-medium">Evento</th>
                <th className="p-4 font-medium">Descripción</th>
                <th className="p-4 font-medium text-right">Monto</th>
                <th className="p-4 font-medium text-center">Moneda</th>
                <th className="p-4 font-medium text-center">Método</th>
                <th className="p-4 font-medium">Registrado por</th>
                <th className="p-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {paginatedDates.map(date => {
                const dayPayments = groupedPayments[date];
                const dayTotal = dayPayments.reduce((sum, p) => sum + p.amount, 0);
                const isExpanded = expandedDates.includes(date);

                return (
                  <React.Fragment key={date}>
                    <tr
                      onClick={() => toggleDate(date)}
                      className="bg-[#0D1117] hover:bg-[#30363D]/30 cursor-pointer border-b border-[#30363D] group transition-colors"
                    >
                      <td className="p-4 font-bold text-[#C8A951] text-sm tabular-nums flex items-center gap-3">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        {new Date(date + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                      <td colSpan={2} className="p-4 text-[#8B949E] text-xs italic">
                        {dayPayments.length} movimiento(s) registrado(s)
                      </td>
                      <td className="p-4 text-right text-[#3FB950] font-bold tabular-nums">
                        {formatCurrency(dayTotal)}
                      </td>
                      <td colSpan={4} className="p-4"></td>
                    </tr>
                    {isExpanded && dayPayments.map(payment => (
                      <tr key={payment.id} className="hover:bg-[#C8A951]/5 transition-colors group">
                        <td className="p-4 text-[#8B949E] text-xs pl-10 tabular-nums">{payment.date}</td>
                        <td className="p-4 text-[#E6EDF3] text-sm font-medium">{payment.event}</td>
                        <td className="p-4 text-[#E6EDF3] text-sm">
                          <div className="flex items-center gap-2">
                            {payment.desc}
                            {payment.type === 'SENA' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/30">SEÑA</span>}
                            {payment.type === 'SALDO' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/30">SALDO</span>}
                          </div>
                        </td>
                        <td className="p-4 text-right text-[#E6EDF3] text-sm font-medium tabular-nums">{formatCurrency(payment.amount)}</td>
                        <td className="p-4 text-center text-[#8B949E] text-xs font-bold">{payment.currency}</td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center" title={payment.method}>
                            {getMethodIcon(payment.method)}
                          </div>
                        </td>
                        <td className="p-4 text-[#8B949E] text-sm">{payment.user}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEvent(payment.eventId);
                            }}
                            className="p-1.5 text-[#8B949E] hover:text-[#C8A951] hover:bg-[#C8A951]/10 rounded transition-colors"
                            title="Ver evento"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden p-4 space-y-4">
          {paginatedDates.map(date => {
            const dayPayments = groupedPayments[date];
            const dayTotal = dayPayments.reduce((sum, p) => sum + p.amount, 0);
            const isExpanded = expandedDates.includes(date);

            return (
              <div key={date} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
                <div
                  onClick={() => toggleDate(date)}
                  className="p-4 flex justify-between items-center bg-[#0D1117] cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-bold text-[#C8A951]">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    {date}
                  </div>
                  <div className="text-[#3FB950] font-bold">{formatCurrency(dayTotal)}</div>
                </div>

                {isExpanded && (
                  <div className="divide-y divide-[#30363D]">
                    {dayPayments.map(payment => (
                      <div key={payment.id} className="p-4 bg-[#161B22]">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-[#E6EDF3] font-medium text-sm">{payment.event}</h4>
                          <div className="flex items-center gap-2">
                            {payment.type === 'SENA' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/30">SEÑA</span>}
                            {payment.type === 'SALDO' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/30">SALDO</span>}
                          </div>
                        </div>
                        <p className="text-[#8B949E] text-xs mb-3">{payment.desc}</p>
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2 text-xs text-[#8B949E]">
                            {getMethodIcon(payment.method)}
                            <span>{payment.user}</span>
                          </div>
                          <div className="text-[#E6EDF3] font-mono font-bold">{formatCurrency(payment.amount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#30363D] flex flex-col sm:flex-row items-center justify-between text-sm text-[#8B949E] gap-4 sm:gap-0">
          <div>Mostrando {Math.min(uniqueDates.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(uniqueDates.length, currentPage * itemsPerPage)} días de {uniqueDates.length}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-[#0D1117] border border-[#30363D] rounded hover:bg-[#30363D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-[#0D1117] border border-[#30363D] rounded hover:bg-[#30363D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

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
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Evento</label>
            <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none">
              {EVENTS_DATA.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Tipo de Pago</label>
            <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none">
              <option value="SENA">Seña</option>
              <option value="A_CUENTA">A cuenta</option>
              <option value="SALDO">Saldo</option>
              <option value="ADICIONAL">Adicional</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Monto</label>
              <input type="number" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Moneda</label>
              <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none">
                <option>ARS</option>
                <option>USD</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Método de pago</label>
              <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none">
                <option>Efectivo</option>
                <option>Transferencia</option>
                <option>Tarjeta</option>
                <option>Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Fecha</label>
              <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Notas / Observaciones</label>
            <textarea
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#C8A951] focus:outline-none min-h-[80px]"
              placeholder="Detalles adicionales..."
            />
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

const UsersView = ({ currentUser }: { currentUser: User }) => {
  const isJefe = currentUser.role === 'JEFE';

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col overflow-y-auto">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 lg:gap-0">
        <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Gestión de Usuarios</h1>
        {isJefe ? (
          <button className="bg-[#C8A951] text-[#0D1117] px-4 py-2 rounded-lg font-bold hover:bg-[#D4B96A] transition-colors flex items-center gap-2">
            <Plus size={18} /> Agregar usuario
          </button>
        ) : (
          <button
            disabled
            title="Solo Franco u Orlando pueden gestionar usuarios"
            className="bg-[#30363D] text-[#8B949E] px-4 py-2 rounded-lg font-bold cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={18} /> Agregar usuario
          </button>
        )}
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#30363D] text-[#8B949E] text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Usuario</th>
                <th className="p-4 font-medium">Rol</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {USERS.map(u => (
                <tr key={u.id} className="hover:bg-[#C8A951]/5 transition-colors group">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#30363D] flex items-center justify-center text-[#C8A951] font-bold text-xs">
                      {u.name[0]}
                    </div>
                    <span className="text-[#E6EDF3] font-medium">{u.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#1F6FEB]/10 text-[#1F6FEB] border border-[#1F6FEB]/20 uppercase">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-[#3FB950] text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3FB950]" /> Activo
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {isJefe ? (
                      <button className="p-2 text-[#8B949E] hover:text-[#F85149] hover:bg-[#F85149]/10 rounded transition-colors" title="Eliminar usuario">
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button
                        disabled
                        title="Solo Franco u Orlando pueden gestionar usuarios"
                        className="p-2 text-[#30363D] cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 p-4 bg-[#C8A951]/10 border border-[#C8A951]/20 rounded-lg">
        <p className="text-sm text-[#C8A951] flex items-center gap-2">
          <AlertTriangle size={16} />
          <strong>Seguridad:</strong> Solo los roles JEFE (Franco y Orlando) tienen permisos para modificar la nómina de usuarios del sistema.
        </p>
      </div>
    </div>
  );
};

const ExpensesView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2025-03-03', desc: 'Compra de bebidas', amount: 150000, category: 'INSUMOS', method: 'Efectivo' },
    { id: 2, date: '2025-03-01', desc: 'Pago personal extra', amount: 45000, category: 'PERSONAL', method: 'Transferencia' },
  ]);

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Gastos Semanales</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#F85149] hover:bg-[#ff6a62] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Registrar Gasto
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-[#0D1117] border-b border-[#30363D] text-[#8B949E] text-sm">
              <tr>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Descripción</th>
                <th className="p-4 font-medium">Categoría</th>
                <th className="p-4 font-medium">Método</th>
                <th className="p-4 font-medium text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-[#30363D]/20 transition-colors">
                  <td className="p-4 text-[#E6EDF3]">{exp.date}</td>
                  <td className="p-4 text-[#E6EDF3]">{exp.desc}</td>
                  <td className="p-4 text-[#8B949E] text-xs font-bold uppercase tracking-wider">{exp.category}</td>
                  <td className="p-4 text-[#8B949E]">{exp.method}</td>
                  <td className="p-4 text-right text-[#E6EDF3] font-mono">{formatCurrency(exp.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 pb-20">
        {expenses.map(exp => (
          <div key={exp.id} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="font-medium text-[#E6EDF3] text-lg leading-tight pr-2">{exp.desc}</div>
              <div className="text-[#E6EDF3] font-mono font-bold">{formatCurrency(exp.amount)}</div>
            </div>

            <div className="flex justify-between items-center text-sm text-[#8B949E]">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{exp.date}</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#30363D]/50 px-2 py-1 rounded">
                {exp.category}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-[#30363D] flex items-center gap-2 text-sm text-[#8B949E]">
              <div className="flex items-center gap-1">
                {exp.method === 'Efectivo' ? <DollarSign size={14} className="text-[#3FB950]" /> :
                  exp.method === 'Transferencia' ? <CheckCircle size={14} className="text-[#1F6FEB]" /> :
                    <CreditCard size={14} className="text-[#C8A951]" />}
                <span>{exp.method}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nuevo Gasto"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[#E6EDF3] hover:bg-[#30363D] rounded-lg font-medium transition-colors">Cancelar</button>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#F85149] text-white rounded-lg font-bold hover:bg-[#ff6a62] transition-colors">Guardar</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Descripción</label>
            <input type="text" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#F85149] focus:outline-none" placeholder="Ej: Compra de hielo" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Monto</label>
              <input type="number" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#F85149] focus:outline-none" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B949E] mb-1">Fecha</label>
              <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#F85149] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Categoría</label>
            <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#F85149] focus:outline-none">
              <option>INSUMOS</option>
              <option>PERSONAL</option>
              <option>PROVEEDORES</option>
              <option>MANTENIMIENTO</option>
              <option>OTROS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1">Método de Pago</label>
            <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#E6EDF3] focus:border-[#F85149] focus:outline-none">
              <option>Efectivo</option>
              <option>Transferencia</option>
              <option>Tarjeta</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('AGENDA');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('AGENDA');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedEventId(null);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedEventId(null);
  };

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    setCurrentView('FICHA');
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-[#0D1117] text-[#E6EDF3] font-sans">
      <Sidebar
        activeView={currentView}
        onChangeView={handleNavigate}
        user={currentUser}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 h-screen overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-[#30363D] flex items-center justify-between bg-[#0D1117] shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="text-[#E6EDF3] p-1 hover:bg-[#161B22] rounded-lg">
              <Menu size={24} />
            </button>
            <span className="font-display font-bold text-lg text-[#E6EDF3]">Vicenzo</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#161B22] border border-[#30363D] flex items-center justify-center text-[#C8A951] font-bold text-sm">
            {currentUser.name[0]}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {currentView === 'AGENDA' && <AgendaView onSelectEvent={handleSelectEvent} />}
          {currentView === 'EVENTOS' && <EventListView onSelectEvent={handleSelectEvent} onCreateEvent={() => handleNavigate('NUEVO_EVENTO')} user={currentUser} />}
          {currentView === 'NUEVO_EVENTO' && <CreateEventView onBack={() => handleNavigate('EVENTOS')} />}
          {currentView === 'FICHA' && (
            currentUser.role === 'CATERING' ? (
              <div className="p-4 lg:p-8">
                <button onClick={() => handleNavigate('EVENTOS')} className="text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-1 mb-6">
                  <ChevronLeft size={20} /> Volver
                </button>
                <CateringEventDetailView eventData={{
                  title: "Quinceañera Valentina Suárez",
                  date: "Viernes 07 de marzo de 2025",
                  time: "21:00 hs — 04:00 hs",
                  salon: "Vicenzo",
                  guests: { confirmed: 155 }
                }} />
              </div>
            ) : (
              <EventDetailView eventId={selectedEventId} onBack={() => handleNavigate('EVENTOS')} user={currentUser} />
            )
          )}
          {currentView === 'CATALOGO' && <CatalogView />}
          {currentView === 'PAGOS' && <PaymentsView onSelectEvent={handleSelectEvent} />}
          {currentView === 'REPORTES' && <ReportsView />}
          {currentView === 'GASTOS' && <ExpensesView />}
          {currentView === 'LIQUIDACIONES' && <LiquidacionesView />}
          {currentView === 'CONFIGURACION' && <UsersView currentUser={currentUser!} />}
        </div>
      </main>
    </div>
  );
}
