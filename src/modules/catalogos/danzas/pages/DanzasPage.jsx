import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query"; 

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { useAuth } from "@/contexts/AuthContext";   
import { useDanzas } from "../hooks/useDanzas";

import DanzaForm from "../components/DanzaForm";

import {
  createDanza,
  updateDanza,
  desactivarDanza,
  activarDanza,
} from "../services/danzas.service";

import { registrarMovimientoCatalogo } from "@/modules/movimientos/services/movimientos.service";  


export default function DanzasPage() {

  /* =====================================================
     HOOKS (siempre al inicio)
  ===================================================== */

  const queryClient = useQueryClient();                    
  const { perfil } = useAuth();                           

  const {
    data: danzas,
    isLoading,
    refetch,
  } = useDanzas();

  const [
    editing,
    setEditing
  ] = useState(null);


  /* =====================================================
     CONFIRMACION DE ACCIONES
  ===================================================== */

  const [
    confirmAction,
    setConfirmAction
  ] = useState(null);


  function abrirConfirmacion(action) {
    setConfirmAction(action);
  }


  function cerrarConfirmacion() {
    setConfirmAction(null);
  }


  async function ejecutarConfirmacion() {

    if (!confirmAction) return;

    try {

      await confirmAction.execute();

      toast.success(confirmAction.successMessage);

      refetch();

    } catch (error) {

      toast.error(error.message);

    }

    cerrarConfirmacion();

  }


  /* =====================================================
     EARLY RETURN
  ===================================================== */

  if (isLoading) {
    return <p>Cargando danzas...</p>;
  }


  /* =====================================================
     CREAR (con registro en movimientos)
  ===================================================== */

  async function crearDanza(values) {
    try {

      const nueva = await createDanza(values);

      //  registrar la creación en movimientos_catalogos
      if (perfil?.id) {
        await registrarMovimientoCatalogo({
          usuario_id: perfil.id,
          entidad: "danza",
          entidad_id: nueva.id,
          nombre_entidad: nueva.nombre,
          accion: "Agregar",
          motivo: "Creación de catálogo",
        });

        // Refrescar el historial de movimientos
        queryClient.invalidateQueries({ queryKey: ["movimientos"] });
      }

      toast.success("Danza creada correctamente");

      refetch();

    } catch (error) {
      toast.error(error.message);
    }
  }


  /* =====================================================
     EDITAR
  ===================================================== */

  async function editarDanza(values) {
    try {

      await updateDanza(editing.id, values);

      toast.success("Danza actualizada correctamente");

      setEditing(null);

      refetch();

    } catch (error) {
      toast.error(error.message);
    }
  }


  async function guardarDanza(values) {

    if (editing) {
      await editarDanza(values);
      return;
    }

    await crearDanza(values);
  }


  /* =====================================================
     DESACTIVAR / ACTIVAR
  ===================================================== */

  function desactivarDanzaHandler(id) {

    abrirConfirmacion({
      title: "Desactivar danza",
      message: "¿Seguro que deseas desactivar esta danza?",
      execute: () => desactivarDanza(id),
      successMessage: "Danza desactivada correctamente",
    });

  }


  function activarDanzaHandler(id) {

    abrirConfirmacion({
      title: "Activar danza",
      message: "¿Seguro que deseas activar esta danza?",
      execute: () => activarDanza(id),
      successMessage: "Danza activada correctamente",
    });

  }


  /* =====================================================
     COLUMNAS
  ===================================================== */

  const columnas = [

    {
      key: "nombre",
      title: "Nombre",
    },

    {
      key: "ciudad",
      title: "Ciudad",
    },

{
    key: "descripcion",
    title: "Descripción",
    render: (danza) => (
        <div
            className="rich-text-preview"
            dangerouslySetInnerHTML={{ __html: danza.descripcion || "-" }}
        />
    ),
},

    {
      key: "estado",
      title: "Estado",
      render: (danza) => (
        <span
          className={
            danza.activo
              ? "status-active"
              : "status-inactive"
          }
        >
          {danza.activo ? "Activa" : "Inactiva"}
        </span>
      ),
    },

    {
      key: "acciones",
      title: "Acciones",
      render: (danza) => (
        <div className="table-actions">

          <Button
            type="button"
            variant="secondary"
            onClick={() => setEditing(danza)}
          >
            Editar
          </Button>

          {danza.activo ? (
            <Button
              type="button"
              variant="danger"
              onClick={() => desactivarDanzaHandler(danza.id)}
            >
              Desactivar
            </Button>
          ) : (
            <Button
              type="button"
              variant="success"
              onClick={() => activarDanzaHandler(danza.id)}
            >
              Activar
            </Button>
          )}

        </div>
      ),
    },
  ];


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div className="page-container">

      <h1>Danzas</h1>

      <Card>

        <h3>
          {editing ? "Editar danza" : "Nueva danza"}
        </h3>

        <DanzaForm
          onSubmit={guardarDanza}
          initialValues={editing}
        />

      </Card>

      <Card>

        <h3>Lista de danzas</h3>

        <Table
          columns={columnas}
          data={danzas || []}
        />

      </Card>

      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.title}
        message={confirmAction?.message}
        onConfirm={ejecutarConfirmacion}
        onCancel={cerrarConfirmacion}
      />

    </div>

  );
}