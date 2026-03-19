# Base de datos inicial

Este esquema se derivó de [demoShared.ts](/Users/julietagambarte/vicenzo/Sistema-gestion---Vicenzo/src/features/demo/demoShared.ts), que hoy concentra los tipos y datos mock de usuarios, eventos y catálogo.

## Objetivo

Tener una base inicial en Supabase para reemplazar los mocks actuales sin bloquear la evolución posterior del sistema. El foco de esta primera versión está en:

- usuarios y roles
- salones
- eventos
- catálogo de servicios
- bundles de servicios

## Tablas incluidas

### `public.salons`

Representa cada salón operado por el sistema.

Campos principales:

- `code`: identificador técnico
- `name`: nombre visible
- `is_active`: si el salón está habilitado

Se seedearon:

- `Vicenzo`
- `Casita San Javier`

### `public.profiles`

Representa usuarios internos de la aplicación.

Campos principales:

- `legacy_id`: id heredado del mock actual, útil para migrar o seedear sin perder trazabilidad con la demo
- `full_name`
- `role`
- `default_salon_id`
- `is_active`

Observación:

Esta tabla no está vinculada todavía a `auth.users`. Fue una decisión intencional para no bloquear el arranque de la BDD antes de definir autenticación y RLS. Cuando implementes login real, esta tabla puede migrarse o complementarse con una fila asociada a Supabase Auth.

Roles modelados como enum:

- `JEFE`
- `RECEPCIONISTA`
- `PRODUCCION`
- `TIO_FRANCO`
- `CATERING`

### `public.catalog_services`

Representa el catálogo de servicios y precios.

Campos principales:

- `legacy_id`: id del mock (`t1`, `f1`, `a1`, etc.)
- `category`
- `name`
- `currency`
- `price_ars`
- `price_usd`
- `effective_from`
- `effective_label`
- `is_active`

Decisiones de modelado:

- Se mantuvieron `price_ars` y `price_usd` porque así viene el mock actual.
- El enum `currency_code` indica la moneda principal del ítem.
- Hay constraints para exigir al menos un precio y para alinear moneda con campo informado.

### `public.service_bundles`

Agrupa servicios compuestos.

En esta primera versión se incluye:

- `Pack Premium`

### `public.service_bundle_items`

Tabla pivote entre bundle y servicio.

Se usa para mapear el contenido de `PACK_PREMIUM_ITEMS`:

- `t3`
- `t4`
- `t5`
- `t6`
- `t7`

### `public.events`

Representa cada evento comercial.

Campos principales:

- `legacy_id`
- `salon_id`
- `title`
- `category`
- `status`
- `event_date`
- `guest_count`
- `total_amount`
- `paid_amount`
- `balance_amount`
- `created_by_user_id`

Decisiones de modelado:

- `balance_amount` se genera automáticamente como `total_amount - paid_amount`.
- Se permite saldo negativo implícitamente porque hoy el mock contempla eventos con pago excedido.
- `status` y `category` se modelaron con enums para evitar inconsistencias.

## Relaciones

- `profiles.default_salon_id -> salons.id`
- `catalog_services` no depende de otras tablas
- `service_bundle_items.bundle_id -> service_bundles.id`
- `service_bundle_items.service_id -> catalog_services.id`
- `events.salon_id -> salons.id`
- `events.created_by_user_id -> profiles.id`

## Índices agregados

Se incluyeron índices útiles para el uso esperado:

- usuarios activos por rol
- servicios activos por categoría
- eventos por fecha
- eventos por estado y fecha
- eventos por categoría y fecha
- eventos por salón y fecha

La idea es cubrir primero listados, agenda y filtros comunes.

## Seeds incluidos

El script carga datos base para poder levantar la demo con contenido:

- 2 salones
- 6 usuarios
- 31 eventos
- 33 servicios del catálogo
- 1 bundle con sus ítems

## Lo que todavía no está modelado

Esto no aparece de forma estructural en `demoShared.ts`, así que quedó fuera del primer script:

- pagos detallados
- movimientos de caja
- gastos semanales
- liquidaciones de catering
- auditoría
- observaciones por área
- planilla operativa por evento
- contacto del responsable
- detalle de servicios contratados por evento
- permisos y RLS

## Próxima etapa recomendada

Después de este esquema base, el siguiente corte razonable sería agregar:

1. `event_contacts`
2. `event_services`
3. `payment_entries`
4. `expense_entries`
5. `event_notes`
6. políticas RLS por rol

## Archivo generado

El SQL quedó en:

- [20260311_001_initial_schema.sql](/Users/julietagambarte/vicenzo/Sistema-gestion---Vicenzo/supabase/migrations/20260311_001_initial_schema.sql)
