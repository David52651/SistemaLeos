# Reglas de Negocio

## SistemaLeos

Versión: 1.2

---

# 1. Objetivo del Sistema

SistemaLeos es una aplicación web destinada a la gestión e inventario de vestimentas, accesorios y elementos culturales utilizados en diversas danzas.

El sistema tiene como finalidad:

* Organizar el inventario existente.
* Facilitar la búsqueda de artículos.
* Controlar existencias.
* Registrar movimientos importantes de forma centralizada.
* Mantener trazabilidad y auditoría de los cambios.
* **Gestionar el alquiler de vestuario a personas y agrupaciones.**

---

# 2. Usuarios del Sistema

Existen únicamente dos tipos de usuarios.

## 2.1 Administrador

Tiene acceso completo al sistema.

Puede:

* Crear, editar y desactivar registros.
* Registrar movimientos de inventario.
* Registrar alquileres y devoluciones.
* Gestionar el inventario y los catálogos.
* Visualizar la auditoría completa.

*Nota: Los administradores son creados exclusivamente desde Supabase. No existe funcionalidad dentro de la aplicación para crear administradores.*

## 2.2 Visitante

Tiene acceso limitado.

Puede:

* Consultar inventario.
* Buscar artículos.
* Visualizar imágenes.
* Filtrar por categorías y danzas.

No puede:

* Crear, editar o eliminar registros.
* Registrar movimientos ni alquileres.

---

# 3. Centralización de Movimientos

Toda acción que modifique el sistema se registra en el módulo de **Movimientos**, el cual unifica dos fuentes de datos:

## 3.1 Movimientos de Inventario (`movimientos_inventario`)
Se registran aquí:
* **Agregar:** Ingreso de stock.
* **Desechar:** Pérdida o baja.
* **Actualizar Stock:** Ajuste por conteo físico.
* **Modificar Datos:** Cambios en los datos del artículo (nombre, categoría, talla, etc.).
* **Alquileres:** Salidas y devoluciones de prendas (generados automáticamente por el módulo de alquileres).

## 3.2 Movimientos de Catálogos (`movimientos_catalogos`)
Se registran aquí:
* Creación de Categoría, Talla, Propietario o Danza.

## 3.3 Registro de Stock Inicial
Cuando se crea un artículo con `stock_actual > 0`, el sistema genera automáticamente un movimiento tipo `"Agregar"` con motivo `"Stock inicial al crear artículo"`.

---

# 4. Gestión de Catálogos

Los catálogos básicos (Categorías, Tallas y Propietarios) funcionan bajo la política de **solo lectura en sus módulos dedicados**.

* **Creación:** Se realizan desde el flujo de `Movimientos → + Nuevo artículo` (abriendo los modales correspondientes).
* **Modificación:** No se permite editar desde su módulo para evitar cambios no auditados.
* **Eliminación:** No se permite. Solo se pueden activar o desactivar.
* **Auditoría:** La creación queda registrada automáticamente en `movimientos_catalogos`.

*Excepción:* El módulo de **Danzas** mantiene su CRUD completo (crear, editar, activar/desactivar), ya que se prevén mejoras futuras (como asociación de imágenes). Sus creaciones también se auditan.

---

# 5. Gestión de Artículos e Inventario

Los artículos son el núcleo del sistema.

## 5.1 Creación y Modificación
* **Creación:** Exclusivamente desde `Movimientos → + Nuevo artículo`.
* **Modificación:** Exclusivamente desde `Movimientos` (tipo `"Modificar Datos"`).
* **Activación/Desactivación:** Se realiza desde el módulo de Inventario.

## 5.2 Código de Artículo
* Es único e irrepetible.
* Se genera automáticamente combinando el nombre y la talla (ej. `CAM-BLA-L`).

## 5.3 Control de Stock
* El stock refleja la cantidad física disponible.
* El sistema **prohíbe** stock negativo mediante validación en base de datos `CHECK (stock_actual >= 0)`.
* Si el stock llega a 0, el artículo **no se elimina**, sigue visible con una advertencia visual de "Agotado".

---

# 6. Gestión de Alquileres

El módulo de Alquileres permite controlar la salida y retorno de vestuario, descontando y sumando stock de forma automática.

## 6.1 Tipos de Alquiler
* **Conjunto:** Destinado a 1 sola persona. El sistema restringe la selección a **1 unidad por cada prenda**.
* **Paquete:** Destinado a grupos. Permite alquilar múltiples unidades de la misma prenda, respetando el stock máximo disponible.

## 6.2 Registro Obligatorio del Cliente
Para agilizar futuras búsquedas, es obligatorio registrar:
* Nombre (Persona o Agrupación).
* DNI / Carnet.
* Teléfono de contacto y Dirección (opcionales, pero recomendados).

## 6.3 Fechas y Devoluciones
* La fecha de salida se registra automáticamente con la fecha actual.
* La fecha de devolución pactada se sugiere para el día siguiente, pero es editable.
* El sistema cuenta con un **aviso visual (alerta)** cuando un alquiler ha superado la fecha pactada sin ser devuelto.
* Al registrar la devolución, el stock se restaura automáticamente y se genera un movimiento de `"Agregar"`.

## 6.4 Observaciones por Prenda
* **A la salida:** Se puede registrar una nota por cada prenda (ej. "Tiene un hueco pequeño"). Esto protege al negocio ante reclamos.
* **Al retorno:** Se puede registrar cómo regresó la prenda. Si todo está bien, existe un botón rápido de "Todo limpio y en buen estado".

---

# 7. Eliminación de Registros

Como política general inquebrantable: **Los registros no se eliminan.**

Se utiliza el campo `activo` para desactivar registros (usuarios, artículos, categorías, etc.). Esto garantiza que el historial de movimientos y alquileres nunca pierda sus referencias y mantenga la integridad relacional.

---

# 8. Auditoría y Seguridad

## 8.1 Auditoría
Todo cambio crítico registra:
* Usuario responsable.
* Fecha y hora exacta.
* Acción realizada (tipo de movimiento).
* Valores anteriores y nuevos (en caso de modificaciones).

## 8.2 Seguridad
* Uso de Roles (`administrador` / `visitante`).
* Validaciones dobles: Zod en el frontend y CHECK constraints en PostgreSQL.
* Uso de RPCs (Remote Procedure Calls) con `SECURITY DEFINER` para garantizar transacciones atómicas (si falla un paso, se cancela todo).
* RLS (Row Level Security) configurado en Supabase.

---

# 9. Principios Generales

* No eliminar información, solo desactivarla.
* Mantener trazabilidad completa de todas las acciones.
* Centralizar los cambios en el módulo de Movimientos.
* Garantizar que el inventario refleje la realidad física del local en todo momento.
* Preparar la arquitectura para futuras ampliaciones (sistema de reservas, inventario unitario, etc.).