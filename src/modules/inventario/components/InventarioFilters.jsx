import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

import { useCatalogosInventario } from "../hooks/useCatalogosInventario";


export default function InventarioFilters({
    busqueda,
    setBusqueda,
    filtroCategoria,
    setFiltroCategoria,
    filtroTalla,
    setFiltroTalla,
    filtroPropietario,
    setFiltroPropietario,
    onLimpiar,
}) {

    const { categorias, tallas, propietarios } = useCatalogosInventario();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Buscador */}
            <Input
                label="Buscar"
                placeholder="Código, nombre o propietario..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            {/* Filtros en una sola fila */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: "1rem",
                    alignItems: "end",
                }}
            >
                <Select
                    label="Categoría"
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                    <option value="">Todas</option>
                    {categorias.data?.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </Select>

                <Select
                    label="Talla"
                    value={filtroTalla}
                    onChange={(e) => setFiltroTalla(e.target.value)}
                >
                    <option value="">Todas</option>
                    {tallas.data?.map((t) => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                </Select>

                <Select
                    label="Propietario"
                    value={filtroPropietario}
                    onChange={(e) => setFiltroPropietario(e.target.value)}
                >
                    <option value="">Todos</option>
                    {propietarios.data?.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                </Select>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={onLimpiar}
                >
                    Limpiar
                </Button>

            </div>

        </div>
    );
}