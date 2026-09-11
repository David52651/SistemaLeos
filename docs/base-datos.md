# Base de Datos

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
| articulo_id   | uuid      |
| danza_id      | uuid      |

---

## imagenes_articulo

| Campo         | Tipo      |
|---------------|-----------|
| id            | uuid      |
| articulo_id   | uuid      |
| url_imagen    | text      |
| principal     | bool      |
| created_at    | timestamp |

---

## movimientos_inventario

| Campo            | Tipo      |
|------------------|-----------|
| id               | uuid      |
| articulo_id      | uuid      |
| usuario_id       | uuid      |
| tipo_movimiento  | varchar   |
| cantidad         | int       |
| motivo           | text      |
| movimiento       | text      |
| detalles         | jsonb     |
| fecha_movimiento | timestamp |

**Restricciones:**
- `CHECK (cantidad >= 0)`
- `CHECK (tipo_movimiento IN ('Agregar', 'Desechar', 'Actualizar Stock', 'Modificar Datos'))`

**Tipos válidos de `tipo_movimiento`:**
- `Agregar` — Ingreso de stock
- `Desechar` — Pérdida o baja
- `Actualizar Stock` — Ajuste por conteo
- `Modificar Datos` — Cambio en los datos del artículo

---

## movimientos_catalogos (NUEVA)

| Campo            | Tipo      |
|------------------|-----------|
| id               | uuid      |
| usuario_id       | uuid      |
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

# Funciones RPC

## registrar_movimiento_inventario

Registra un movimiento de stock (Agregar, Desechar, Actualizar Stock) y actualiza `articulos.stock_actual` de forma atómica.

**Parámetros:**
- `p_articulo_id UUID`
- `p_usuario_id UUID`
- `p_tipo_movimiento VARCHAR`
- `p_cantidad INT`
- `p_motivo TEXT`
- `p_movimiento TEXT`
- `p_detalles JSONB` (opcional)

---

## modificar_articulo_con_movimiento

Modifica los datos de un artículo (excepto stock) y registra el cambio en `movimientos_inventario` con el diff en `detalles`.

**Parámetros:**
- `p_articulo_id UUID`
- `p_usuario_id UUID`
- `p_nuevos_datos JSONB`
- `p_motivo TEXT`
- `p_movimiento TEXT`
- `p_detalles JSONB`

---

## crear_articulo_con_stock_inicial

Crea un artículo y, si tiene stock inicial > 0, registra automáticamente un movimiento tipo `"Agregar"` con motivo `"Stock inicial al crear artículo"`.

**Parámetros:**
- `p_datos JSONB`
- `p_usuario_id UUID`

**Retorna:** UUID del artículo creado.

---

## registrar_movimiento_catalogo

Registra la creación de una categoría, talla, propietario o danza en `movimientos_catalogos`.

**Parámetros:**
- `p_usuario_id UUID`
- `p_entidad VARCHAR`
- `p_entidad_id UUID`
- `p_nombre_entidad VARCHAR`
- `p_tipo_movimiento VARCHAR`
- `p_movimiento TEXT`
- `p_motivo TEXT`
- `p_detalles JSONB` (opcional)

**Retorna:** UUID del movimiento creado.