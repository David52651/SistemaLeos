import "@/styles/catalogoModal.css";

export default function CatalogoModal({
  open,
  title,
  onClose,
  children,
}) {

  if (!open) return null;

  return (

    <div className="modal-overlay">

      <div className="modal-container">

        <div className="modal-header">

          <h3>{title}</h3>

          <button
            onClick={onClose}
          >
            ✖
          </button>

        </div>

        <div className="modal-body">

          {children}

        </div>

      </div>

    </div>

  );

}