export type UserRole = 'JEFE' | 'RECEPCIONISTA' | 'PRODUCCION' | 'TIO_FRANCO' | 'CATERING' | 'CLIENTE' | 'INVITADO';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  avatar?: string;
}

export type EventStatus = 'POR_SENAR' | 'SENA_EN_PROCESO' | 'CONFIRMADO' | 'CANCELADO';
export type EventCategory = 'CASAMIENTO' | 'QUINCEANERA' | 'CORPORATIVO' | 'CUMPLEANOS' | 'ANIVERSARIO' | 'EGRESADO' | 'OTRO';

export interface Event {
  id: string;
  title: string;
  created_at?: string; // ISO date for price freezing
  date: string;
  category: EventCategory;
  guests: number;
  status: EventStatus;
  balance: number;
  total: number;
  paid: number;
  responsable: string;
  salon?: 'Vicenzo' | 'Casita San Javier';
  start_date?: string; // ISO datetime
  end_date?: string; // ISO datetime
  phones?: string[];
  address?: string;
  dni?: string;
  cuit?: string;
  decorator_name?: string;
  decorator_phone?: string;
  salon_min_guests?: number;
  adult_guests?: number;
  young_guests?: number; // Replaces children
  alert?: boolean;
  
  // Conditional fields
  wedding_info?: {
    partner1_name: string;
    partner2_name: string;
    partner1_father?: string;
    partner1_mother?: string;
    partner2_father?: string;
    partner2_mother?: string;
  };
  quince_info?: {
    quinceanera_name: string;
    school?: string;
    father_name?: string;
    mother_name?: string;
  };
}

export interface Guest {
  id: string;
  name: string;
  table?: number;
  type: 'ADULT' | 'YOUNG' | 'AFTER_1AM' | 'HONOR';
  present: boolean;
}

export const GUESTS_MOCK: Guest[] = [
  { id: 'h1', name: 'Valentina Suárez', type: 'HONOR', present: false },
  // Mesa 1
  { id: 'a1', name: 'Jorge Suárez', table: 1, type: 'ADULT', present: false },
  { id: 'a2', name: 'María Elena Suárez', table: 1, type: 'ADULT', present: false },
  { id: 'a3', name: 'Roberto Contreras', table: 1, type: 'ADULT', present: false },
  { id: 'a4', name: 'Ana Contreras', table: 1, type: 'ADULT', present: false },
  { id: 'a5', name: 'Pablo Méndez', table: 1, type: 'ADULT', present: false },
  { id: 'a6', name: 'Laura Méndez', table: 1, type: 'ADULT', present: false },
  { id: 'a7', name: 'Carlos Nieto', table: 1, type: 'ADULT', present: false },
  { id: 'a8', name: 'Fernanda Nieto', table: 1, type: 'ADULT', present: false },
  // Mesa 2
  { id: 'a9', name: 'Gustavo Torres', table: 2, type: 'ADULT', present: false },
  { id: 'a10', name: 'Silvia Torres', table: 2, type: 'ADULT', present: false },
  { id: 'a11', name: 'Marcos Ruiz', table: 2, type: 'ADULT', present: false },
  { id: 'a12', name: 'Patricia Ruiz', table: 2, type: 'ADULT', present: false },
  { id: 'a13', name: 'Diego Fernández', table: 2, type: 'ADULT', present: false },
  { id: 'a14', name: 'Valeria Fernández', table: 2, type: 'ADULT', present: false },
  { id: 'a15', name: 'Héctor Paz', table: 2, type: 'ADULT', present: false },
  { id: 'a16', name: 'Mónica Paz', table: 2, type: 'ADULT', present: false },
  // Jóvenes (Extracto)
  { id: 'y1', name: 'Agustina Vargas', type: 'YOUNG', present: false },
  { id: 'y2', name: 'Camila Ríos', type: 'YOUNG', present: false },
  { id: 'y3', name: 'Candela Suárez', type: 'YOUNG', present: false },
  { id: 'y4', name: 'Carla Mendoza', type: 'YOUNG', present: false },
  { id: 'y5', name: 'Catalina Flores', type: 'YOUNG', present: false },
  { id: 'y6', name: 'Delfina Torres', type: 'YOUNG', present: false },
  { id: 'y7', name: 'Emilia Gómez', type: 'YOUNG', present: false },
  // After 1AM
  { id: 't1', name: 'Bruno Salinas', type: 'AFTER_1AM', present: false },
  { id: 't2', name: 'Emanuel Quiroga', type: 'AFTER_1AM', present: false },
  { id: 't3', name: 'Franco Chiarello', type: 'AFTER_1AM', present: false }
];

export interface ServiceItem {
  id: string;
  name: string;
  priceArs: number | null;
  priceUsd: number | null;
  currency: 'ARS' | 'USD';
  vigencia: string;
  category: string;
}

export const USERS: User[] = [
  { id: '1', name: 'Franco', role: 'JEFE' },
  { id: '2', name: 'Julia', role: 'RECEPCIONISTA' },
  { id: '3', name: 'Hernán', role: 'PRODUCCION' },
  { id: '4', name: 'Tío Franco', role: 'TIO_FRANCO' },
  { id: 'u3', name: 'Catering (Eugenio)', role: 'CATERING', email: 'eugenio@catering.com' },
  { id: 'u4', name: 'Usuario Invitado', role: 'INVITADO', email: 'invitado@vicenzo.com' },
  { id: '6', name: 'Orlando', role: 'JEFE' },
];

export const EVENTS_DATA: Event[] = [
  { id: '1', title: 'Casamiento Rodríguez-Pérez', date: '2026-03-01', category: 'CASAMIENTO', guests: 200, status: 'CONFIRMADO', balance: 0, total: 15000000, paid: 15000000, responsable: 'Jorge Rodríguez', salon: 'Vicenzo', start_date: '2026-03-01T21:00:00', end_date: '2026-03-02T05:00:00', phones: ['3515551234'], salon_min_guests: 150, adult_guests: 180, young_guests: 20 },
  { id: '2', title: 'Quinceañera Valentina Suárez', date: '2026-03-07', category: 'QUINCEANERA', guests: 160, status: 'SENA_EN_PROCESO', balance: 4800000, total: 18200000, paid: 13400000, responsable: 'Jorge Suárez', salon: 'Vicenzo', start_date: '2026-03-07T21:00:00', end_date: '2026-03-08T05:00:00', phones: ['3515556789'], salon_min_guests: 150, adult_guests: 100, young_guests: 60 },
  { id: '3', title: 'Cumpleaños Empresarial TechCorp', date: '2026-03-08', category: 'CORPORATIVO', guests: 180, status: 'SENA_EN_PROCESO', balance: -125000, total: 19800000, paid: 19925000, responsable: 'Mariana Tech', salon: 'Casita San Javier', start_date: '2026-03-08T12:00:00', end_date: '2026-03-08T18:00:00', phones: ['3515550000'], salon_min_guests: 100, adult_guests: 180, young_guests: 0 },
  { id: '4', title: 'Quinceañera Isabella Torres', date: '2026-03-14', category: 'QUINCEANERA', guests: 140, status: 'POR_SENAR', balance: 12400000, total: 16500000, paid: 4100000, responsable: 'Alberto Torres', salon: 'Vicenzo', start_date: '2026-03-14T21:00:00', end_date: '2026-03-15T05:00:00', phones: ['3515551111'], salon_min_guests: 150, adult_guests: 90, young_guests: 50 },
  { id: '5', title: 'Casamiento Moreno-Giuliani', date: '2026-03-15', category: 'CASAMIENTO', guests: 220, status: 'CONFIRMADO', balance: 0, total: 22800000, paid: 22800000, responsable: 'Lucía Moreno', salon: 'Vicenzo', start_date: '2026-03-15T21:00:00', end_date: '2026-03-16T05:00:00', phones: ['3515552222'], salon_min_guests: 150, adult_guests: 200, young_guests: 20 },
  { id: '6', title: 'Cumpleaños 50 — Roberto Paz', date: '2026-03-21', category: 'CUMPLEANOS', guests: 170, status: 'SENA_EN_PROCESO', balance: -45000, total: 14500000, paid: 14545000, responsable: 'Roberto Paz', salon: 'Casita San Javier', start_date: '2026-03-21T21:00:00', end_date: '2026-03-22T04:00:00', phones: ['3515553333'], salon_min_guests: 100, adult_guests: 170, young_guests: 0 },
  { id: '7', title: 'Quinceañera Luciana Martínez', date: '2026-03-22', category: 'QUINCEANERA', guests: 190, status: 'CONFIRMADO', balance: 1200000, total: 17800000, paid: 16600000, responsable: 'Eduardo Martínez', salon: 'Vicenzo', start_date: '2026-03-22T21:00:00', end_date: '2026-03-23T05:00:00', phones: ['3515554444'], salon_min_guests: 150, adult_guests: 120, young_guests: 70 },
  { id: '8', title: 'Casamiento Blanco-Fernández', date: '2026-03-29', category: 'CASAMIENTO', guests: 210, status: 'SENA_EN_PROCESO', balance: 8900000, total: 21400000, paid: 12500000, responsable: 'Marta Blanco', salon: 'Vicenzo', start_date: '2026-03-29T21:00:00', end_date: '2026-03-30T05:00:00', phones: ['3515555555'], salon_min_guests: 150, adult_guests: 190, young_guests: 20 },
  { id: '9', title: 'Casamiento López-García', date: '2026-04-05', category: 'CASAMIENTO', guests: 180, status: 'CONFIRMADO', balance: 0, total: 16000000, paid: 16000000, responsable: 'Carlos López' },
  { id: '10', title: 'Quinceañera Sofía Méndez', date: '2026-04-12', category: 'QUINCEANERA', guests: 150, status: 'SENA_EN_PROCESO', balance: 5000000, total: 17000000, paid: 12000000, responsable: 'Hugo Méndez' },
  { id: '11', title: 'Cumpleaños 40 — Ana Ruiz', date: '2026-04-19', category: 'CUMPLEANOS', guests: 100, status: 'CONFIRMADO', balance: 0, total: 8000000, paid: 8000000, responsable: 'Ana Ruiz' },
  { id: '12', title: 'Evento Corporativo Banco Macro', date: '2026-04-25', category: 'CORPORATIVO', guests: 250, status: 'POR_SENAR', balance: 20000000, total: 25000000, paid: 5000000, responsable: 'RRHH Banco Macro' },
  { id: '13', title: 'Casamiento Pérez-Sánchez', date: '2026-05-03', category: 'CASAMIENTO', guests: 200, status: 'SENA_EN_PROCESO', balance: 10000000, total: 20000000, paid: 10000000, responsable: 'Javier Pérez' },
  { id: '14', title: 'Quinceañera Camila Fernández', date: '2026-05-10', category: 'QUINCEANERA', guests: 160, status: 'CONFIRMADO', balance: 0, total: 18000000, paid: 18000000, responsable: 'Raúl Fernández' },
  { id: '15', title: 'Cumpleaños 18 — Juan Pérez', date: '2026-05-17', category: 'CUMPLEANOS', guests: 120, status: 'SENA_EN_PROCESO', balance: 4000000, total: 10000000, paid: 6000000, responsable: 'Juan Pérez' },
  { id: '16', title: 'Evento Corporativo Google', date: '2026-05-24', category: 'CORPORATIVO', guests: 300, status: 'CONFIRMADO', balance: 0, total: 30000000, paid: 30000000, responsable: 'Admin Google AR' },
  { id: '17', title: 'Casamiento Gómez-Martínez', date: '2026-06-07', category: 'CASAMIENTO', guests: 220, status: 'POR_SENAR', balance: 15000000, total: 22000000, paid: 7000000, responsable: 'Mónica Gómez' },
  { id: '18', title: 'Quinceañera Valentina López', date: '2026-06-14', category: 'QUINCEANERA', guests: 180, status: 'SENA_EN_PROCESO', balance: 8000000, total: 19000000, paid: 11000000, responsable: 'Sergio López' },
  { id: '19', title: 'Cumpleaños 60 — María García', date: '2026-06-21', category: 'CUMPLEANOS', guests: 150, status: 'CONFIRMADO', balance: 0, total: 12000000, paid: 12000000, responsable: 'María García' },
  { id: '20', title: 'Casamiento Ruiz-Sánchez', date: '2026-07-05', category: 'CASAMIENTO', guests: 200, status: 'SENA_EN_PROCESO', balance: 10000000, total: 20000000, paid: 10000000, responsable: 'Sofía Ruiz' },
  { id: '21', title: 'Quinceañera Sofía Pérez', date: '2026-07-12', category: 'QUINCEANERA', guests: 160, status: 'CONFIRMADO', balance: 0, total: 18000000, paid: 18000000, responsable: 'Pedro Pérez' },
  { id: '22', title: 'Cumpleaños 50 — Carlos Fernández', date: '2026-08-02', category: 'CUMPLEANOS', guests: 120, status: 'SENA_EN_PROCESO', balance: 4000000, total: 10000000, paid: 6000000, responsable: 'Carlos Fernández' },
  { id: '23', title: 'Evento Corporativo Amazon', date: '2026-08-09', category: 'CORPORATIVO', guests: 300, status: 'CONFIRMADO', balance: 0, total: 30000000, paid: 30000000, responsable: 'Eventos Amazon' },
  { id: '24', title: 'Casamiento Martínez-Gómez', date: '2026-09-06', category: 'CASAMIENTO', guests: 220, status: 'POR_SENAR', balance: 15000000, total: 22000000, paid: 7000000, responsable: 'Andrés Martínez' },
  { id: '25', title: 'Quinceañera Valentina Ruiz', date: '2026-09-13', category: 'QUINCEANERA', guests: 180, status: 'SENA_EN_PROCESO', balance: 8000000, total: 19000000, paid: 11000000, responsable: 'Fabián Ruiz' },
  { id: '26', title: 'Cumpleaños 40 — Ana López', date: '2026-10-04', category: 'CUMPLEANOS', guests: 100, status: 'CONFIRMADO', balance: 0, total: 8000000, paid: 8000000, responsable: 'Ana López' },
  { id: '27', title: 'Evento Corporativo Facebook', date: '2026-10-11', category: 'CORPORATIVO', guests: 250, status: 'POR_SENAR', balance: 25000000, total: 25000000, paid: 5000000, responsable: 'Meta AR' },
  { id: '28', title: 'Casamiento Sánchez-Pérez', date: '2026-11-01', category: 'CASAMIENTO', guests: 200, status: 'SENA_EN_PROCESO', balance: 10000000, total: 20000000, paid: 10000000, responsable: 'Beatriz Sánchez' },
  { id: '29', title: 'Quinceañera Camila Fernández', date: '2026-11-08', category: 'QUINCEANERA', guests: 160, status: 'CONFIRMADO', balance: 0, total: 18000000, paid: 18000000, responsable: 'Raúl Fernández' },
  { id: '30', title: 'Cumpleaños 18 — Juan Ruiz', date: '2026-12-06', category: 'CUMPLEANOS', guests: 120, status: 'SENA_EN_PROCESO', balance: 4000000, total: 10000000, paid: 6000000, responsable: 'Juan Ruiz' },
  { id: '31', title: 'Evento Corporativo Apple', date: '2026-12-13', category: 'CORPORATIVO', guests: 300, status: 'CONFIRMADO', balance: 0, total: 30000000, paid: 30000000, responsable: 'Apple Store AR' },
  { id: '32', title: 'Boda de Lucía & Martín', date: '2026-10-17', category: 'CASAMIENTO', guests: 180, status: 'CONFIRMADO', balance: 0, total: 8400000, paid: 8400000, responsable: 'Lucía Fernández' },
  { id: '33', title: 'Aniversario 50 años - Familia Rossi', date: '2026-11-21', category: 'ANIVERSARIO', guests: 120, status: 'CONFIRMADO', balance: 0, total: 4200000, paid: 4200000, responsable: 'Ricardo Rossi' },
  { id: '34', title: 'Corporativo - TecnoLogistics', date: '2026-12-18', category: 'CORPORATIVO', guests: 250, status: 'CONFIRMADO', balance: 0, total: 3500000, paid: 3500000, responsable: 'Carlos Paz' },
  { id: '35', title: 'Egregados 2026 - Colegio Nacional', date: '2026-12-12', category: 'EGRESADO', guests: 200, status: 'SENA_EN_PROCESO', balance: 5000000, total: 10000000, paid: 5000000, responsable: 'Comisión de Padres' },
];

export const CATALOG_DATA: ServiceItem[] = [
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
  { id: 'f1', category: 'FUEGOS ARTIFICIALES', name: 'Fontanas escalera (por unidad)', priceArs: null, priceUsd: 100, currency: 'USD', vigencia: 'Desde 01/03/25' },
  { id: 'f2', category: 'FUEGOS ARTIFICIALES', name: 'Fontanas pista (por unidad)', priceArs: null, priceUsd: 115, currency: 'USD', vigencia: 'Desde 01/03/25' },
  { id: 'f3', category: 'FUEGOS ARTIFICIALES', name: 'Fontanas portón (por unidad)', priceArs: null, priceUsd: 115, currency: 'USD', vigencia: 'Desde 01/03/25' },
  { id: 'f4', category: 'FUEGOS ARTIFICIALES', name: 'Cascada', priceArs: null, priceUsd: 128, currency: 'USD', vigencia: 'Desde 01/03/25' },
  { id: 'c1', category: 'CATERING JÓVENES', name: 'Menú Jóvenes 15 años (por persona)', priceArs: 53000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'c2', category: 'CATERING JÓVENES', name: 'Recepción tipo KFC (por persona)', priceArs: 7700, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'c3', category: 'CATERING JÓVENES', name: 'Barra de helados (por persona)', priceArs: 7700, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'c4', category: 'CATERING JÓVENES', name: 'Barra de tragos (por persona)', priceArs: 4100, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'c5', category: 'CATERING JÓVENES', name: 'Combo tragos + KFC (por persona)', priceArs: 9500, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'a1', category: 'MENÚ ADULTOS', name: 'Menú 1 Adultos (por persona)', priceArs: 67000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'a2', category: 'MENÚ ADULTOS', name: 'Menú 2 Gourmet — pollo (por persona)', priceArs: 75000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'a3', category: 'MENÚ ADULTOS', name: 'Menú 2 Gourmet — lomo (por persona)', priceArs: 86000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'a4', category: 'MENÚ ADULTOS', name: 'Buffet 1 — 3 elementos (por persona)', priceArs: 17500, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'a5', category: 'MENÚ ADULTOS', name: 'Buffet 2 — 4 elementos (por persona)', priceArs: 22500, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'p1', category: 'PERSONAL', name: 'Mozo (por 12 hs)', priceArs: 52000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd1', category: 'DECORACIÓN', name: 'Juego de living (por juego)', priceArs: 35000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd2', category: 'DECORACIÓN', name: 'Mesas altas + banquetas (por juego)', priceArs: 20000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd3', category: 'DECORACIÓN', name: 'Fundas de silla (por unidad)', priceArs: 800, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd4', category: 'DECORACIÓN', name: 'Alas LED', priceArs: 15000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd5', category: 'DECORACIÓN', name: 'Cortinas LED', priceArs: 20000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd6', category: 'DECORACIÓN', name: 'Guirnaldas exterior', priceArs: 20000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd7', category: 'DECORACIÓN', name: 'Buzón', priceArs: 10000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'd8', category: 'DECORACIÓN', name: 'Cabina fotográfica (3 horas)', priceArs: 100000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
  { id: 'tax1', category: 'IMPUESTOS', name: 'IVA', priceArs: 200000, priceUsd: null, currency: 'ARS', vigencia: 'Desde 01/03/25' },
];

export const PACK_PREMIUM_ITEMS = ['t3', 't4', 't5', 't6', 't7'];

export const formatCurrency = (amount: number, currency: 'ARS' | 'USD' = 'ARS') => {
  if (currency === 'USD') return `u$s ${amount}`;
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);
};
