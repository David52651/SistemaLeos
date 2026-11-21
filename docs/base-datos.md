# Base de Datos

## Estado de versionado

Este documento describe la estructura esperada, pero no sustituye migraciones
ejecutables. Los archivos `database/schema.sql`, `database/reset.sql` y
`database/seed.sql` están vacíos actualmente. Por ello, la definición efectiva
de tablas, funciones RPC y políticas RLS debe obtenerse del proyecto Supabase
antes de generar migraciones o revisar permisos; hacerlo a partir de esta
descripción incompleta podría cambiar el comportamiento o bloquear accesos.

## categorias

| Campo         | Tipo      |
|---------------|-----------|
| id            | uuid      |
| nombre        | varchar   |
| descripcion   | text      |
| activo        | bool      |
| created_at    | timestamp |
| updated_at    | timestamp |

---

## articulos

| Campo         | Tipo      |
|---------------|-----------|
| id            | uuid      |
| codigo        | varchar   |
| nombre        | varchar   |
| descripcion   | text      |
| categoria_id  | uuid      |
| talla_id      | uuid      |
| propietario_id| uuid      |
| genero        | varchar   |
| stock_actual  | int       |
| stock_min     | int       |
| activo        | bool      |
| observaciones | text      |
| created_at    | timestamp |
| updated_at    | timestamp |

**Restricciones:**
- `CHECK (stock_actual >= 0)` — evita stock negativo.

---

## danzas

| Campo         | Tipo      |
|---------------|-----------|
| id            | uuid      |
| nombre        | varchar   |
| ciudad        | varchar   |
| descripcion   | text      |
| activo        | bool      |
| created_at    | timestamp |
| updated_at    | timestamp |

---

## articulo_danza

| Campo         | Tipo      |
|---------------|-----------|
| id            | uuid      |
| articulo_id   | uuid (FK) |
| danza_id      | uuid (FK) |

---

## imagenes_articulo

| Campo         | Tipo      |
|---------------|-----------|
| id            | uuid      |
| articulo_id   | uuid (FK) |
| url_imagen    | text      |
| principal     | bool      |
| created_at    | timestamp |

---

## movimientos_inventario

| Campo            | Tipo      |
|------------------|-----------|
| id               | uuid      |
| articulo_id      | uuid (FK) |
| usuario_id       | uuid (FK) |
| tipo_movimiento  | varchar   |
| cantidad         | int       |
| motivo           | text      |
| fecha_movimiento | timestamp |
| detalles         | jsonb     |
| movimiento       | text      |

**Restricciones:**
- `CHECK (cantidad >= 0)`
- `CHECK (tipo_movimiento IN ('Agregar', 'Desechar', 'Actualizar Stock', 'Modificar Datos', 'Alquiler', 'Devolución'))` ⬅️ ACTUALIZADO

**Tipos válidos de `tipo_movimiento`:**
- `Agregar` — Ingreso de stock.
- `Desechar` — Pérdida o baja.
- `Actualizar Stock` — Ajuste por conteo.
- `Modificar Datos` — Cambio en los datos del artículo.
- **`Alquiler` — Salida de prendas por alquiler.**
- **`Devolución` — Retorno de prendas alquiladas.**

---

## movimientos_catalogos

| Campo            | Tipo      |
|------------------|-----------|
| id               | uuid      |
| usuario_id       | uuid (FK) |
| entidad          | varchar   |
| entidad_id       | uuid      |
| nombre_entidad   | varchar   |
| tipo_movimiento  | varchar   |
| movimiento       | text      |
| motivo           | text      |
| detalles         | jsonb     |
| fecha_movimiento | timestamp |

**Entidades válidas:** `categoria`, `talla`, `propietario`, `danza`

**Tipos válidos de `tipo_movimiento`:**
- `Agregar` — Creación de catálogo
- `Modificar` — Cambio de datos
- `Activar` — Reactivación
- `Desactivar` — Desactivación

---

## propietarios

| Campo         | Tipo      |
|---------------|-----------|
| id            | uuid      |
| nombre        | varchar   |
| tipo          | varchar   |
| telefono      | varchar   |
| correo        | varchar   |
| observaciones | text      |
| activo        | bool      |
| created_at    | timestamp |
| updated_at    | timestamp |

---

## tallas

| Campo         | Tipo      |
|---------------|-----------|
| id            | uuid      |
| nombre        | varchar   |
| activo        | bool      |
| created_at    | timestamp |
| updated_at    | timestamp |

---

## usuarios

| Campo           | Tipo      |
|-----------------|-----------|
| id              | uuid      |
| auth_user_id    | uuid      |
| nombre_completo | varchar   |
| email           | varchar   |
| rol             | varchar   |
| activo          | bool      |
| created_at      | timestamp |
| updated_at      | timestamp |

---

## alquileres (NUEVA)

| Campo                     | Tipo      |
|---------------------------|-----------|
| id                        | uuid      |
| usuario_id                | uuid (FK) |
| cliente_nombre            | text      |
| tipo                      | text      |
| fecha_salida              | timestamp |
| fecha_devolucion_pactada  | timestamp |
| fecha_devolucion_real     | timestamp |
| estado                    | text      |
| observaciones             | text      |
| created_at                | timestamp |
| cliente_dni               | varchar   |
| cliente_contacto          | varchar   |
| cliente_direccion         | text      |

**Restricciones:**
- `CHECK (tipo IN ('Conjunto', 'Paquete'))`
- `CHECK (estado IN ('Activo', 'Devuelto'))`

---

## alquiler_detalles (NUEVA)

| Campo                  | Tipo      |
|------------------------|-----------|
| id                     | uuid      |
| alquiler_id            | uuid (FK) |
| articulo_id            | uuid (FK) |
| cantidad               | int       |
| observacion_salida     | text      |
| observacion_devolucion | text      |

**Restricciones:**
- `CHECK (cantidad > 0)`
- `ON DELETE CASCADE` en `alquiler_id` (si se borra la cabecera, se borran los detalles).

---

# Funciones RPC

## registrar_movimiento_inventario
Registra un movimiento de stock (Agregar, Desechar, Actualizar Stock) y actualiza `articulos.stock_actual` de forma atómica.
**Parámetros:** `p_articulo_id`, `p_usuario_id`, `p_tipo_movimiento`, `p_cantidad`, `p_motivo`, `p_movimiento`, `p_detalles`.

---

## modificar_articulo_con_movimiento
Modifica los datos de un artículo (excepto stock) y registra el cambio en `movimientos_inventario` con el diff en `detalles`.
**Parámetros:** `p_articulo_id`, `p_usuario_id`, `p_nuevos_datos`, `p_motivo`, `p_movimiento`, `p_detalles`.

---

## crear_articulo_con_stock_inicial
Crea un artículo y, si tiene stock inicial > 0, registra automáticamente un movimiento tipo `"Agregar"` con motivo `"Stock inicial al crear artículo"`.
**Parámetros:** `p_datos`, `p_usuario_id`.
**Retorna:** UUID del artículo creado.

---

## registrar_movimiento_catalogo
Registra la creación de una categoría, talla, propietario o danza en `movimientos_catalogos`.
**Parámetros:** `p_usuario_id`, `p_entidad`, `p_entidad_id`, `p_nombre_entidad`, `p_tipo_movimiento`, `p_movimiento`, `p_motivo`, `p_detalles`.
**Retorna:** UUID del movimiento creado.

---

## crear_alquiler
Registra la cabecera del alquiler, los detalles (carrito), valida el stock de cada prenda, descuenta el stock y registra un movimiento de tipo **`"Alquiler"`**. Todo de forma atómica.
**Parámetros:** `p_usuario_id`, `p_cliente_nombre`, `p_cliente_dni`, `p_cliente_contacto`, `p_cliente_direccion`, `p_tipo`, `p_fecha_devolucion_pactada`, `p_observaciones`, `p_detalles`.
**Retorna:** UUID del alquiler creado.

---

## devolver_alquiler
Recibe el ID del alquiler, suma el stock devuelto, guarda las observaciones de retorno, cambia el estado a `"Devuelto"` y registra un movimiento de tipo **`"Devolución"`**.
**Parámetros:** `p_alquiler_id`, `p_usuario_id`, `p_detalles_devolucion`.
**Retorna:** VOID.