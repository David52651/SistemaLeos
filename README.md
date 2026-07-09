# SistemaLeos

SistemaLeos es un sistema web desarrollado para la gestión del inventario de vestimentas folclóricas del **Grupo de Música y Danzas Folclóricas Cajamarca Fernando Serván Rocha**.

El proyecto está desarrollado con **React + Vite + Supabase** y ha sido diseñado con una arquitectura modular que permitirá incorporar en el futuro nuevos módulos como alquileres, clientes, contratos, pagos y reportes.

---

# Características

* Gestión de artículos de inventario.
* Gestión de categorías.
* Gestión de tallas.
* Gestión de propietarios.
* Gestión de danzas.
* Asociación de un artículo con una o varias danzas.
* Generación automática de códigos.
* Control de stock.
* Autenticación mediante Supabase.
* Control de acceso por roles.
* Arquitectura preparada para futuras ampliaciones.

---

# Tecnologías utilizadas

* React
* Vite
* JavaScript
* Supabase
* PostgreSQL
* React Router
* React Hook Form
* TanStack Query
* Sonner

---

# Estructura del proyecto

```
src/
├── components/
├── config/
├── contexts/
├── hooks/
├── lib/
├── modules/
├── routes/
├── services/
├── styles/
├── types/
└── utils/
```

---

# Instalación

Clonar el repositorio

```bash
git clone https://github.com/David52651/SistemaLeos.git
```

Ingresar a la carpeta

```bash
cd SistemaLeos
```

Instalar dependencias

```bash
npm install
```

Crear el archivo `.env`

Copiar el archivo:

```
.env.example
```

como

```
.env
```

y completar las variables correspondientes de Supabase.

Ejecutar el proyecto

```bash
npm run dev
```

---

# Variables de entorno

El proyecto utiliza las siguientes variables:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

# Estado del proyecto

Actualmente se encuentra en desarrollo.

Versión actual:

**v0.1.0**

Módulo implementado:

* Inventario

Próximos módulos:

* Alquileres
* Clientes
* Contratos
* Pagos
* Reportes
* Dashboard avanzado

---

# Documentación

La documentación técnica se encuentra en la carpeta:

```
docs/
```

Incluye:

* Arquitectura
* Base de datos
* Roadmap
* Reglas de negocio
* Instalación

---

# Licencia

Este proyecto se desarrolla con fines académicos y de gestión para el Grupo de Música y Danzas Folclóricas Cajamarca Fernando Serván Rocha.
