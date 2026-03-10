# Documentación del Sistema de Gestión de Eventos - Vicenzo

Este documento detalla los módulos y funcionalidades del sistema de gestión para el salón de eventos Vicenzo.

## 1. Módulo de Autenticación y Roles
El sistema cuenta con un control de acceso basado en roles para asegurar la privacidad y la integridad de los datos.

*   **Roles de Usuario:**
    *   **JEFE (Franco):** Acceso total a todos los módulos y funcionalidades.
    *   **RECEPCIONISTA (Julia):** Acceso a la gestión de eventos, agenda y registro de gastos. Sin acceso a reportes estratégicos.
    *   **PRODUCCIÓN (Hernán):** Acceso limitado a la información operativa. Puede ver la agenda y el detalle de los eventos (invitados, servicios), pero **no ve información financiera** (precios, saldos, pagos).
    *   **TÍO FRANCO:** Rol especial con acceso a la agenda, detalle operativo de eventos (sin precios) y al módulo de gastos.

## 2. Módulo de Agenda
Vista principal para la planificación temporal de los eventos.

*   **Funcionalidades:**
    *   **Calendario Visual:** Vista mensual con indicadores de eventos.
    *   **Código de Colores:** Identificación rápida del estado del evento (Confirmado, Señado, Reservado).
    *   **Alertas Financieras:** Indicadores visuales (signo $) para eventos con saldo pendiente.
    *   **Filtros:** Capacidad para filtrar por tipo de evento (Casamiento, Quinceañera, etc.) y estado de pago.

## 3. Módulo de Eventos (Listado y Gestión)
Administración centralizada de todas las fiestas contratadas.

*   **Funcionalidades:**
    *   **Listado General:** Tabla con todos los eventos, fecha, categoría, invitados y estado.
    *   **Buscador:** Búsqueda rápida por nombre del evento.
    *   **Filtros de Estado:** Filtrar por Confirmado, Señado, Reservado o Cancelado.
    *   **Nuevo Evento:** Formulario para dar de alta una nueva fiesta con datos básicos.
    *   **Acceso a Ficha:** Navegación directa al detalle de cada evento.

## 4. Ficha de Evento (Detalle)
El corazón operativo y administrativo de cada fiesta.

*   **Funcionalidades:**
    *   **Datos del Cliente:** Información de contacto, responsables, DNI y dirección.
    *   **Gestión de Invitados:** Control de mínimos contratados vs. invitados confirmados, desglose de niños y adultos.
    *   **Servicios Contratados:** Listado detallado de todos los servicios (Catering, Técnica, Ambientación) con sus estados (Incluido, A cuenta, Pagado, Pendiente).
    *   **Resumen Financiero:** (Oculto para Producción/Tío Franco) Panel con Total Presupuestado, Total Cobrado y Saldo Pendiente.
    *   **Historial de Pagos:** Registro de todos los pagos realizados para este evento específico.
    *   **Planilla Operativa:** Generación de una vista imprimible con toda la información técnica y operativa para el día de la fiesta (sin datos de costos).
    *   **Registro de Pagos:** Botón directo para ingresar nuevos pagos (Seña, A cuenta, Saldo).

## 5. Módulo de Pagos
Gestión centralizada de la caja y los ingresos.

*   **Funcionalidades:**
    *   **Historial Global:** Tabla con todos los pagos recibidos de todos los eventos.
    *   **Métricas Clave:** Total cobrado en el periodo, saldo pendiente global.
    *   **Registro de Pago Manual:** Formulario para ingresar pagos (Efectivo, Transferencia, Tarjeta, Cheque) imputados a un evento específico.
    *   **Estado por Evento:** Panel lateral con el porcentaje de cobro de cada fiesta activa.

## 6. Módulo de Gastos Semanales
Control de egresos y costos operativos.

*   **Funcionalidades:**
    *   **Registro de Gastos:** Carga de gastos operativos (Insumos, Personal, Proveedores, Mantenimiento).
    *   **Historial:** Listado de gastos con fecha, descripción, categoría y monto.
    *   **Acceso:** Disponible para Jefe y Tío Franco (y Recepcionista).

## 7. Módulo de Catálogo
Base de datos de precios y servicios.

*   **Funcionalidades:**
    *   **Listado de Precios:** Precios actualizados de todos los servicios adicionales y menús.
    *   **Selección:** Herramienta para seleccionar servicios y calcular un presupuesto rápido estimado.
    *   **Restricción:** No accesible para roles operativos.

## 8. Módulo de Reportes
Inteligencia de negocio y estadísticas.

*   **Funcionalidades:**
    *   **Dashboard Financiero:** Ingresos mensuales, ocupación del salón.
    *   **Gráficos:** Evolución de ingresos por mes y distribución de tipos de eventos.
    *   **Estadísticas Detalladas:**
        *   **Servicios más contratados:** Ranking de adicionales populares.
        *   **Menús más vendidos:** Preferencias gastronómicas de los clientes.
        *   **Estacionalidad:** Meses con mayor facturación y mayor cantidad de eventos.
