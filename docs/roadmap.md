# Roadmap

## Fase 1 - Infraestructura
[x] Base de datos (PostgreSQL / Supabase)
[x] Autenticación con Supabase Auth
[x] Roles (Administrador / Visitante)
[x] Router protegido y control de acceso
[x] Diseño de UI/UX (Componentes reutilizables con variables CSS)

---

## Fase 2 - Catálogos
[x] CRUD Categorías (migrado a solo lectura + activar/desactivar)
[x] CRUD Tallas (migrado a solo lectura + activar/desactivar)
[x] CRUD Propietarios (migrado a solo lectura + activar/desactivar)
[x] CRUD Danzas (mantiene CRUD completo con editor de texto enriquecido)

---

## Fase 3 - Inventario (Completado)
[x] CRUD Artículos (creación y edición centralizada vía Movimientos)
[x] Generación automática de códigos (Ej. CAM-BLA-L)
[x] Asociación de múltiples danzas a un artículo
[x] Búsqueda y filtros avanzados (código, nombre, propietario, categoría, talla)
[x] Modal de detalle del artículo tipo "ficha técnica" con visor de imágenes (zoom)
[x] Alertas visuales de stock bajo / agotado
[x] Subida de imágenes de artículos (Supabase Storage integrado)
[x] Agrupación visual de prendas por modelo y talla en la tabla principal

---

## Fase 4 - Movimientos (Auditoría)
[x] Registro de ingresos (Agregar stock)
[x] Registro de bajas (Desechar)
[x] Registro de ajustes de stock (Actualizar Stock por conteo físico)
[x] Registro de modificaciones de datos (Modificar Datos con diff de cambios)
[x] Registro de creación de catálogos
[x] Registro de stock inicial al crear un artículo
[x] Historial unificado en una sola tabla (inventario + catálogos)
[x] Generación de descripciones legibles para el usuario (ej. "Se agregaron X artículos")
[x] Diferenciación visual y lógica entre movimientos de "Alquiler" y "Devolución"

---

## Fase 5 - Sistema de Alquileres (Completado)
[x] Estructura de base de datos para alquileres (Cabecera y Detalles)
[x] Funciones RPC atómicas para crear alquiler y descontar stock
[x] Funciones RPC para registrar devoluciones y restaurar stock
[x] Formulario con "Carrito" para agrupar múltiples prendas
[x] Validación de tipos de alquiler: Conjunto (1 persona) y Paquete (grupos)
[x] Control de stock: validación en frontend y backend (no permite alquilar de más)
[x] Selector doble de prendas (1. Buscar Modelo -> 2. Elegir Talla)
[x] Registro de datos del cliente (DNI, Contacto, Dirección)
[x] Sugerencia automática de fecha de devolución (día siguiente)
[x] Alertas y badge visual para alquileres retrasados
[x] Modal tipo "Factura" con el detalle del alquiler
[x] Modal para registrar observaciones de retorno (ej. "Todo limpio")

---

## Fase 6 - Dashboard e Indicadores (Completado)
[x] Indicadores principales (Total de prendas, alquileres activos, retrasados, stock perdido)
[x] Lista de movimientos recientes (Últimos 5 movimientos)
[x] Gráficos estadísticos con Recharts (Tendencia de alquileres y Estado del inventario)
[x] Tooltips y leyendas interactivas en los gráficos (muestran porcentajes y cantidades al pasar el mouse)

---

## Fase 7 - Calidad y Pruebas
[ ] Pruebas funcionales de todos los flujos (QA Manual)
[ ] Pruebas de seguridad y políticas RLS en Supabase
[ ] Pruebas con usuarios reales (Encargado de tienda)
[ ] Corrección de errores y ajustes de UI/UX

---

## Fase 8 - Despliegue y Producción
[ ] Configuración de producción en Cloudflare Pages
[ ] Configuración de variables de entorno (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
[ ] Migración de datos reales a Supabase
[ ] Capacitación al personal
[ ] Puesta en marcha oficial

---

## Fase 9 - Mejoras Futuras (Backlog)
[ ] Sistema de reservas de prendas
[ ] Notificaciones automáticas (WhatsApp o Email al cliente)
[ ] Historial de clientes con deudas o incidencias
[ ] Múltiples imágenes por artículo (Galería)
[ ] Imágenes asociadas a danzas
[ ] Migración de inventario por lotes a inventario unitario