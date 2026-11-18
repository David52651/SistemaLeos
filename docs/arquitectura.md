# Arquitectura SistemaLeos

## Frontend
React + Vite

## Backend
Supabase
- Authentication
- Database
- Storage
- Row Level Security (RLS)
- RPC Functions (PostgreSQL)

Base de Datos
SistemaLeosDB

## Tecnologías
- React
- Vite
- Supabase
- React Router
- React Query (Estado del servidor y caché)
- React Hook Form + Zod (Formularios y validaciones)
- React-Select (Buscadores con autocompletado)
- Sonner (Notificaciones flotantes)
- Recharts (Gráficos del Dashboard)

## Estructura

src/
│
├── assets
├── components
│   ├── forms
│   ├── layout
│   └── ui
├── config
├── contexts
├── hooks
├── lib
│   ├── supabase.js
│   ├── queryClient.js
│   └── storage.js
├── modules
├── routes
├── services
├── styles
│   ├── components
│   ├── layout
│   └── modules
├── types
└── utils

## Módulos

- dashboard
    - pages (Dashboard con gráficos y métricas)
    - hooks (useDashboardData para cálculos)
- inventario
    - pages
    - components
        - selectors
        - modals
    - services
    - hooks
    - schemas
    - types
    - constants
    - utils
- movimientos
    - pages
    - components
    - services
    - hooks
    - schemas
    - constants
    - utils
- **alquileres**
    - pages (AlquileresPage con formulario de carrito y modales)
    - services (Conexión a RPCs crear_alquiler y devolver_alquiler)
    - hooks (Manejo de estado con React Query)
- catalogos
    - categorias
    - tallas
    - propietarios
    - danzas

## Patrones Arquitectónicos

### Centralización de Movimientos

Toda acción que modifique el estado del inventario o los catálogos pasa por el módulo de **Movimientos**:

- **Movimientos de inventario** → tabla `movimientos_inventario` (incluye tipos como `"Agregar"`, `"Desechar"`, `"Alquiler"` y `"Devolución"`).
- **Movimientos de catálogos** → tabla `movimientos_catalogos`.

El historial del frontend **unifica ambas fuentes** y las ordena por fecha, mostrando al usuario una sola tabla con colores distintivos para cada acción.

### RPCs Atómicas (Transacciones)

Las operaciones críticas se ejecutan mediante **funciones RPC en PostgreSQL** con `SECURITY DEFINER`. Esto garantiza que operaciones complejas (como registrar un alquiler con múltiples prendas, validar stock, descontarlo y dejar el movimiento histórico) se hagan en un solo paso. Si un artículo no tiene stock, se cancela todo el alquiler. Beneficios:
- Atomicidad (todo o nada).
- Validaciones en el backend (imposible saltarse las reglas desde el frontend).
- Trazabilidad completa.

### Módulo de Alquileres con "Carrito"

El módulo de alquileres utiliza un estado local de "carrito" en el frontend para armar el paquete o conjunto antes de enviarlo al backend. 
- Usa **dos selectores con `react-select`**: el primero agrupa los modelos de prendas (evitando duplicados) y el segundo despliega las tallas disponibles con su stock.
- Valida en el frontend (y en el backend) que no se alquilen más prendas de las disponibles.
- Restringe la cantidad a 1 por prenda si el alquiler es de tipo "Conjunto".
- Almacena observaciones individuales por cada prenda al momento de la salida y del retorno.

### Módulos de Catálogos en Solo Lectura

Categorías, Tallas y Propietarios son de **solo lectura** en sus módulos dedicados. La creación se hace desde el flujo de Movimientos → Nuevo artículo, centralizando la trazabilidad. 
**Excepción:** Danzas mantiene CRUD completo por mejoras futuras previstas.

### Componentes UI reutilizables

Todos los componentes de `src/components/ui` usan `forwardRef` para ser compatibles con React Hook Form:
- `Input`, `Select`, `Textarea`, `Checkbox`, `MultiSelectCheckbox`
- `Button`, `Card`, `Table`, `Modal`, `ConfirmDialog`, `Badge`, `Spinner`, `EmptyState`, `Loading`

### Modal con React Portal

`CatalogoModal` usa `createPortal` para renderizar en `<body>`, evitando problemas de `z-index` y `overflow` cuando el modal está anidado en layouts complejos. Es reutilizado tanto en Movimientos como en Alquileres (para ver la "factura" o registrar devoluciones).

### Gestión de Imágenes

Las imágenes de los artículos se almacenan en **Supabase Storage** y su URL pública se guarda en la tabla relacional `imagenes_articulo`. La subida se realiza desde el formulario de creación de artículos y se refleja instantáneamente en el inventario y en el modal de detalle.