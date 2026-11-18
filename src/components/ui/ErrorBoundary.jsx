import { Component } from "react";
import Button from "./Button";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error atrapado por el Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                    height: "100vh", background: "var(--bg-body)", color: "var(--text-primary)", padding: "2rem", textAlign: "center"
                }}>
                    <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>¡Ups! Algo salió mal.</h1>
                    <p style={{ opacity: 0.7, marginBottom: "2rem", maxWidth: "500px" }}>
                        Ha ocurrido un error inesperado en el sistema. Por favor, intenta recargar la página. Si el problema persiste, contacte con soporte técnico.
                    </p>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Recargar Página
                        </Button>
                        <Button variant="secondary" onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>
                            Ir al Login
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;