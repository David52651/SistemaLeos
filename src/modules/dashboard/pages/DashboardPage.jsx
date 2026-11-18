import { useDashboardData } from "../hooks/useDashboardData";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";

import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";

export default function DashboardPage() {
    const { 
        totalArticulos, 
        stockTotalUnidades,
        alquileresActivos, 
        alquileresRetrasados, 
        stockPerdidoMes,
        datosTorta,
        datosArea,
        ultimosMovimientos,
        isLoading,
        hayRetrasos
    } = useDashboardData();

    if (isLoading) return <p>Cargando dashboard...</p>;

    const cardStyle = {
        padding: "1.5rem",
        borderRadius: "12px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        boxShadow: "var(--shadow-sm)"
    };

    const tituloMetrica = { fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px" };
    const valorMetrica = { fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 };
    const subtextoMetrica = { fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "4px" };

    const totalUnidadesTorta = datosTorta.reduce((sum, item) => sum + item.value, 0);

    const columnasMovimientos = [
        { key: "fecha", title: "Fecha", render: (m) => new Date(m.fecha_movimiento).toLocaleDateString() },
        { key: "articulo", title: "Artículo", render: (m) => m.articulos?.nombre || "-" },
        { key: "tipo", title: "Tipo", render: (m) => (
            <Badge variant={m.tipo_movimiento === "Desechar" ? "danger" : "primary"}>
                {m.tipo_movimiento}
            </Badge>
        )},
        { key: "movimiento", title: "Detalle", render: (m) => m.movimiento }
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={{ margin: 0 }}>Dashboard</h1>
                {hayRetrasos && (
                    <Badge variant="danger" style={{ fontSize: "1rem", padding: "8px 16px" }}>
                        ⚠️ {alquileresRetrasados} Alquiler(es) retrasado(s)
                    </Badge>
                )}
            </div>

            {/* 1. MÉTRICAS PRINCIPALES */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                <div style={cardStyle}>
                    <span style={tituloMetrica}>Artículos Totales</span>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                        <span style={valorMetrica}>{totalArticulos}</span>
                        <span style={subtextoMetrica}>
                            {stockTotalUnidades} unidades en stock
                        </span>
                    </div>
                </div>
                
                <div style={cardStyle}>
                    <span style={tituloMetrica}>Alquileres Activos</span>
                    <span style={estilosValor(valorMetrica, "var(--color-primary)")}>{alquileresActivos}</span>
                </div>

                <div style={{ ...cardStyle, border: hayRetrasos ? "1px solid var(--danger)" : cardStyle.border }}>
                    <span style={tituloMetrica}>Alquileres Retrasados</span>
                    <span style={estilosValor(valorMetrica, hayRetrasos ? "var(--danger)" : "var(--text-primary)")}>
                        {alquileresRetrasados}
                    </span>
                </div>

                <div style={cardStyle}>
                    <span style={tituloMetrica}>Stock Perdido (Mes)</span>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                        <span style={estilosValor(valorMetrica, "var(--color-warning)")}>{stockPerdidoMes}</span>
                        <span style={subtextoMetrica}>
                            unidades
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. GRÁFICOS */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
                
                {/* Gráfico de Área */}
                <Card>
                    <h3 style={{ marginTop: 0 }}>Tendencia de Alquileres (Últimos 6 meses)</h3>
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={datosArea} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAlquileres" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="mes" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" allowDecimals={false} />
                                <Tooltip 
                                    contentStyle={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                                    itemStyle={{ color: "var(--color-primary)" }}
                                />
                                <Area type="monotone" dataKey="alquileres" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorAlquileres)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Gráfico de Torta */}
                <Card>
                    <h3 style={{ marginTop: 0 }}>Estado del Inventario</h3>
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={datosTorta}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {datosTorta.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                                    formatter={(value, name) => {
                                        const pct = ((value / totalUnidadesTorta) * 100).toFixed(1);
                                        return [`${value} unidades (${pct}%)`, name];
                                    }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    wrapperStyle={{ color: "var(--text-primary)" }}
                                    formatter={(value, entry) => {
                                        const pct = ((entry.payload.value / totalUnidadesTorta) * 100).toFixed(0);
                                        return <span style={{ color: "var(--text-primary)" }}>{value} ({pct}%)</span>;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* 3. ÚLTIMOS MOVIMIENTOS */}
            <Card>
                <h3 style={{ marginTop: 0 }}>Últimos 5 Movimientos</h3>
                <Table columns={columnasMovimientos} data={ultimosMovimientos} />
            </Card>
        </div>
    );
}

function estilosValor(baseStyle, color) {
    return { ...baseStyle, color };
}