import CatalogoModal from "../CatalogoModal";

import CategoriaForm from "@/modules/catalogos/categorias/components/CategoriaForm";
import TallaForm from "@/modules/catalogos/tallas/components/TallaForm";
import PropietarioForm from "@/modules/catalogos/propietarios/components/PropietarioForm";
import DanzaForm from "@/modules/catalogos/danzas/components/DanzaForm";

export default function ArticuloModals({
  modalCategoria,
  setModalCategoria,
  modalTalla,
  setModalTalla,
  modalPropietario,
  setModalPropietario,
  modalDanza,
  setModalDanza,
  crearCategoria,
  crearTalla,
  crearPropietario,
  crearDanza,
}) {
  return (
    <>
      <CatalogoModal
        open={modalCategoria}
        title="Nueva categoría"
        onClose={() => setModalCategoria(false)}
      >
        <CategoriaForm onSubmit={crearCategoria} />
      </CatalogoModal>

      <CatalogoModal
        open={modalTalla}
        title="Nueva talla"
        onClose={() => setModalTalla(false)}
      >
        <TallaForm onSubmit={crearTalla} />
      </CatalogoModal>

      <CatalogoModal
        open={modalPropietario}
        title="Nuevo propietario"
        onClose={() => setModalPropietario(false)}
      >
        <PropietarioForm onSubmit={crearPropietario} />
      </CatalogoModal>

      <CatalogoModal
        open={modalDanza}
        title="Nueva danza"
        onClose={() => setModalDanza(false)}
      >
        <DanzaForm onSubmit={crearDanza} />
      </CatalogoModal>
    </>
  );
}