# Reglas de Negocio

## SistemaLeos

Versión: 1.0

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

# 3. Gestión de Categorías

Las categorías representan la clasificación principal de los artículos.

Ejemplos:

* Sombreros
* Camisas
* Pantalones
* Polleras
* Fajas
* Zapatos

Reglas:

* Se pueden crear.
* Se pueden editar.
* No se eliminan desde la aplicación.
* La eliminación, en caso excepcional, debe realizarse directamente en la base de datos.

---

# 4. Gestión de Tallas

Las tallas permiten clasificar los artículos según sus dimensiones.

Ejemplos:

* S
* M
* L
* XL
* Talla única

Reglas:

* Se pueden crear.
* Se pueden editar.
* No se eliminan desde la aplicación.

---

# 5. Gestión de Propietarios

Los propietarios representan a la persona o entidad dueña original de una prenda o artículo.

Reglas:

* Un artículo pertenece a un propietario.
* El propietario puede ser modificado únicamente por un administrador.
* Los propietarios pueden crearse y editarse.
* No se eliminan desde la aplicación.

---

# 6. Gestión de Danzas

Las danzas representan las expresiones culturales asociadas a los artículos.

Ejemplos:

* Cashua Cajamarquina
* Chotanos
* Carnaval de Cajamarca

Reglas:

* Una danza puede tener múltiples artículos.
* Un artículo puede pertenecer a múltiples danzas.
* La relación es de muchos a muchos.

---

# 7. Gestión de Artículos

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

---

# 8. Código de Artículo

Cada artículo posee un código único.

Ejemplos:

* SOM-001
* CAM-001
* PAN-001

Reglas:

* El código nunca se reutiliza.
* El código es único.
* El código permanece asociado al artículo durante toda su vida útil.

---

# 9. Control de Stock

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

El sistema debe impedir disminuir el stock por debajo de cero.

---

# 10. Imágenes

Cada artículo debe poseer al menos una imagen.

Objetivos:

* Facilitar la identificación visual.
* Reducir la manipulación innecesaria de prendas.
* Agilizar consultas de clientes y usuarios.

En futuras versiones se permitirá:

* Varias imágenes por artículo.
* Imágenes asociadas a danzas.

---

# 11. Movimientos de Inventario

Todo cambio importante debe registrarse como movimiento.

Ejemplos:

* Ingreso.
* Préstamo recibido.
* Devolución.
* Pérdida.
* Baja.

Solo los administradores pueden registrar movimientos.

---

# 12. Eliminación de Registros

Como política general:

Los registros no se eliminan.

Se utilizarán mecanismos de desactivación o estados para conservar el historial.

Objetivos:

* Evitar pérdida de información.
* Mantener trazabilidad.
* Reducir errores humanos.

---

# 13. Auditoría

El sistema debe registrar cambios importantes realizados por los administradores.

Se registrará:

* Usuario responsable.
* Fecha.
* Hora.
* Acción realizada.
* Registro afectado.

Objetivos:

* Trazabilidad.
* Seguridad.
* Investigación de incidentes.
* Recuperación de información.

---

# 14. Seguridad

Las operaciones críticas estarán protegidas mediante:

* Autenticación.
* Roles.
* Validaciones.
* Auditoría.

No existirán funciones de creación de administradores dentro de la aplicación.

---

# 15. Preparación para Sistema de Alquiler

El sistema actual trabaja con inventario por lotes.

Sin embargo, la arquitectura deberá permitir una futura migración hacia inventario unitario.

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

# 16. Principios Generales

* No eliminar información innecesariamente.
* Mantener trazabilidad completa.
* Priorizar la integridad de los datos.
* Mantener simplicidad operativa para el negocio.
* Preparar el sistema para futuras ampliaciones.
* Garantizar que el inventario refleje la realidad física del local.
