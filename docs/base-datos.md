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
|---------------------------|


## artículos

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
| activo        | bool      |
| observaciones | text      |
| created_at    | timestamp |
| updated_at    | timestamp |
|---------------------------|


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
|---------------------------|


## artículo_danza

| Campo         | Tipo      |
|---------------|-----------|
| id            | uuid      |
| articulo_id   | uuid      |
| danza_id      | uuid      |
|---------------------------|


## imagenes_articulo

| Campo         | Tipo      |
|---------------|-----------|
| id            | uuid      |
| articulo_id   | uuid      |
| url_imagen    | text      |
| principal     | bool      |
| created_at    | timestamp |
|---------------------------|


## movimientos_inventario

| Campo            | Tipo      |
|------------------|-----------|
| id               | uuid      |
| articulo_id      | uuid      |
| usuario_id       | uuid      |
| tipo_movimiento  | varchar   |
| cantidad         | int       |
| motivo           | text      |
| fecha_movimiento | timestamp |
|------------------------------|


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
|---------------------------|


## tallas

| Campo         | Tipo      |
|---------------|-----------|
| id            | uuid      |
| nombre        | varchar   |
| activo        | bool      |
| created_at    | timestamp |
| updated_at    | timestamp |
|---------------------------|

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
|-----------------------------|