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
- React Query
- React Hook Form
- Zod
- Sonner (notificaciones)

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
- usuarios
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
- movimientos (NUEVO)
    - pages
    - components
    - services
    - hooks
    - schemas
    - constants
    - utils
- catalogos
    - categorias
    - tallas
    - propietarios
    - danzas

## Patrones Arquitectónicos

### Centralización de Movimientos

Toda acción que modifique el estado del inventario o los catálogos pasa por el módulo de **Movimientos**:

- **Movimientos de inventario** → tabla `movimientos_inventario`
- **Movimientos de catálogos** → tabla `movimientos_catalogos`

El historial del frontend **unifica ambas fuentes** y las ordena por fecha, mostrando al usuario una sola tabla.

### RPCs Atómicas

Las operaciones críticas (crear artículo, modificar artículo, registrar movimiento) se ejecutan mediante **funciones RPC en PostgreSQL** con `SECURITY DEFINER`. Esto garantiza:

- Atomicidad (todo o nada).
- Validaciones en el backend.
- Imposibilidad de estados inconsistentes.
- Trazabilidad completa.

### Módulos de Catálogos en Solo Lectura

Categorías, Tallas y Propietarios ahora son de **solo lectura**. La creación se hace desde el flujo de Movimientos → Nuevo artículo. Esto centraliza la trazabilidad y evita cambios no auditados.

**Excepción:** Danzas mantiene CRUD completo por mejoras futuras previstas.

### Componentes UI reutilizables

Todos los componentes de `src/components/ui` usan `forwardRef` para ser compatibles con React Hook Form:
- `Input`, `Select`, `Textarea`, `Checkbox`, `MultiSelectCheckbox`
- `Button`, `Card`, `Table`, `Modal`, `ConfirmDialog`, `Badge`, `Spinner`, `EmptyState`, `Loading`

### Modal con React Portal

`CatalogoModal` usa `createPortal` para renderizar en `<body>`, evitando problemas de `z-index` y `overflow` cuando el modal está anidado en layouts complejos.