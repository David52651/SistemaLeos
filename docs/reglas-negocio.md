# Reglas de Negocio

## SistemaLeos

Versión: 1.1

---

# 1. Objetivo del Sistema

SistemaLeos es una aplicación web destinada a la gestión e inventario de vestimentas, accesorios y elementos culturales utilizados en diversas danzas.

El sistema tiene como finalidad:

* Organizar el inventario existente.
* Facilitar la búsqueda de artículos.
* Controlar existencias.
* Registrar movimientos importantes.
* Mantener trazabilidad de los cambios realizados.
* Preparar la infraestructura para un futuro sistema de alquiler.

---

# 2. Usuarios del Sistema

Existen únicamente dos tipos de usuarios.

## Administrador

Tiene acceso completo al sistema.

Puede:

* Crear registros.
* Editar registros.
* Registrar movimientos.
* Gestionar inventario.
* Visualizar auditoría.
* Gestionar catálogos.

Los administradores son creados exclusivamente desde Supabase.

No existe funcionalidad dentro de la aplicación para crear administradores.

---

## Visitante

Tiene acceso limitado.

Puede:

* Consultar inventario.
* Buscar artículos.
* Visualizar imágenes.
* Filtrar por categorías y danzas.

No puede:

* Crear registros.
* Editar registros.
* Eliminar registros.
* Registrar movimientos.

---

# 3. Centralización de Movimientos (NUEVO)

Todo cambio significativo en el sistema se registra en el módulo de **Movimientos**.

Esto aplica a dos categorías:

## 3.1 Movimientos de Inventario

Se registran en la tabla `movimientos_inventario`:

* Agregar stock (ingresos).
* Desechar artículo (pérdidas/bajas).
* Actualizar stock (conteo físico/ajuste).
* Modificar datos del artículo (nombre, categoría, talla, propietario, género, stock mínimo, observaciones).

## 3.2 Movimientos de Catálogos

Se registran en la tabla `movimientos_catalogos`:

* Creación de Categoría.
* Creación de Talla.
* Creación de Propietario.
* Creación de Danza.

## 3.3 Registro de Stock Inicial

Cuando se crea un artículo con stock inicial mayor a cero, se registra automáticamente un movimiento de tipo `"Agregar"` con motivo `"Stock inicial al crear artículo"`.

---

# 4. Gestión de Categorías

Las categorías representan la clasificación principal de los artículos.

Ejemplos:

* Sombreros
* Camisas
* Pantalones
* Polleras
* Fajas
* Zapatos

Reglas:

* **Solo lectura en su módulo.** Se crean desde el flujo de Movimientos → Nuevo artículo.
* No se editan desde su módulo dedicado.
* No se eliminan desde la aplicación.
* Se pueden activar o desactivar.
* La creación queda registrada en `movimientos_catalogos`.

---

# 5. Gestión de Tallas

Las tallas permiten clasificar los artículos según sus dimensiones.

Ejemplos:

* S
* M
* L
* XL
* Talla única

Reglas:

* **Solo lectura en su módulo.** Se crean desde el flujo de Movimientos → Nuevo artículo.
* No se editan desde su módulo dedicado.
* No se eliminan desde la aplicación.
* Se pueden activar o desactivar.
* La creación queda registrada en `movimientos_catalogos`.

---

# 6. Gestión de Propietarios

Los propietarios representan a la persona o entidad dueña original de una prenda o artículo.

Reglas:

* Un artículo pertenece a un propietario.
* **Solo lectura en su módulo.** Se crean desde el flujo de Movimientos → Nuevo artículo.
* No se editan desde su módulo dedicado.
* No se eliminan desde la aplicación.
* Se pueden activar o desactivar.
* La creación queda registrada en `movimientos_catalogos`.

---

# 7. Gestión de Danzas

Las danzas representan las expresiones culturales asociadas a los artículos.

Ejemplos:

* Cashua Cajamarquina
* Chotanos
* Carnaval de Cajamarca

Reglas:

* Una danza puede tener múltiples artículos.
* Un artículo puede pertenecer a múltiples danzas.
* La relación es de muchos a muchos.
* **El módulo de Danzas mantiene CRUD completo** (crear, editar, activar/desactivar) porque se prevén mejoras futuras.
* La creación desde el flujo de Movimientos también queda registrada en `movimientos_catalogos`.

---

# 8. Gestión de Artículos

Los artículos constituyen el núcleo del inventario.

Ejemplos:

* Sombrero Chotano
* Camisa Blanca
* Pantalón Negro de Lana

Cada artículo debe contener:

* Código.
* Nombre.
* Categoría.
* Talla.
* Propietario.
* Stock.
* Imagen principal.
* Observaciones.

**Creación:** desde Movimientos → "+ Nuevo artículo".
**Modificación:** desde Movimientos → tipo "Modificar Datos".
**Activación/Desactivación:** desde el módulo de Inventario.

---

# 9. Código de Artículo

Cada artículo posee un código único.

Ejemplos:

* SOM-001
* CAM-001
* PAN-001

Reglas:

* El código nunca se reutiliza.
* El código es único.
* El código permanece asociado al artículo durante toda su vida útil.
* **Se genera automáticamente** a partir del nombre y la talla.

---

# 10. Control de Stock

El stock representa la cantidad física disponible de un artículo.

Ejemplo:

Sombrero Chotano

Stock: 12

Significa que existen doce unidades disponibles.

---

## Stock Agotado

Cuando un artículo alcanza stock cero:

* No se elimina.
* No se oculta.
* Continúa visible en el sistema.
* Debe mostrarse una advertencia visual.

Ejemplo:

⚠ Artículo agotado

El sistema debe impedir disminuir el stock por debajo de cero (validado tanto en el frontend como en la base de datos mediante `CHECK (stock_actual >= 0)`).

---

# 11. Imágenes

Cada artículo debe poseer al menos una imagen.

Objetivos:

* Facilitar la identificación visual.
* Reducir la manipulación innecesaria de prendas.
* Agilizar consultas de clientes y usuarios.

En futuras versiones se permitirá:

* Varias imágenes por artículo.
* Imágenes asociadas a danzas.

---

# 12. Movimientos de Inventario

Todo cambio importante debe registrarse como movimiento.

Tipos soportados actualmente:

* **Agregar** — Ingreso de stock.
* **Desechar** — Pérdida o baja.
* **Actualizar Stock** — Ajuste por conteo físico.
* **Modificar Datos** — Cambio en los datos del artículo.

Solo los administradores pueden registrar movimientos.

Cada movimiento incluye:

* Fecha y hora.
* Usuario responsable.
* Artículo afectado.
* Tipo de movimiento.
* Cantidad (0 para modificaciones de datos).
* Motivo.
* Descripción textual del cambio.
* Detalles JSON con el diff (para "Modificar Datos").

---

# 13. Eliminación de Registros

Como política general:

Los registros no se eliminan.

Se utilizarán mecanismos de desactivación o estados para conservar el historial.

Objetivos:

* Evitar pérdida de información.
* Mantener trazabilidad.
* Reducir errores humanos.

---

# 14. Auditoría

El sistema registra cambios importantes realizados por los administradores.

Se registra:

* Usuario responsable.
* Fecha.
* Hora.
* Acción realizada.
* Registro afectado.
* Valores anteriores y nuevos (para modificaciones).

Objetivos:

* Trazabilidad.
* Seguridad.
* Investigación de incidentes.
* Recuperación de información.

---

# 15. Seguridad

Las operaciones críticas están protegidas mediante:

* Autenticación.
* Roles (`administrador` / `visitante`).
* Validaciones (Zod en frontend, CHECK constraints en backend).
* Auditoría completa.
* RPCs atómicas con `SECURITY DEFINER` en Supabase.

No existen funciones de creación de administradores dentro de la aplicación.

---

# 16. Preparación para Sistema de Alquiler

El sistema actual trabaja con inventario por lotes.

Sin embargo, la arquitectura permite una futura migración hacia inventario unitario.

Ejemplo futuro:

SOM-001

SOM-002

SOM-003

SOM-004

Cada unidad podrá tener estados independientes:

* Disponible.
* Alquilado.
* Perdido.
* En mantenimiento.

El stock visible será calculado automáticamente a partir de dichas unidades.

---

# 17. Principios Generales

* No eliminar información innecesariamente.
* Mantener trazabilidad completa.
* Priorizar la integridad de los datos.
* Mantener simplicidad operativa para el negocio.
* Preparar el sistema para futuras ampliaciones.
* Garantizar que el inventario refleje la realidad física del local.
* Centralizar los cambios en el módulo de Movimientos.