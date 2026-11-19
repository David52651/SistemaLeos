import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner"; // Asegúrate de que esté importado

function App() {
  return (
    <>
      <AppRouter />
      
      {/* AGREGAMOS EL TOASTER AQUÍ */}
      <Toaster 
        position="top-center" 
        richColors 
        toastOptions={{
            style: {
                zIndex: 99999,
                fontSize: "1rem",
                padding: "16px",
            }
        }}
      />
    </>
  );
}

export default App;