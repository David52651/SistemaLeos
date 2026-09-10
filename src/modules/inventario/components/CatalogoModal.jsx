import { createPortal } from "react-dom"; 

import "@/styles/catalogoModal.css";
import Button from "@/components/ui/Button";


export default function CatalogoModal({
  open,
  title,
  onClose,
  children,
  size = "md",
}) {

  if (!open) return null;

  const contenido = (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
    >
      <div className={`modal-container modal-${size}`}>

        <div className="modal-header">
          <h3>{title}</h3>
          <Button variant="ghost" onClick={onClose}>
            ✖
          </Button>
        </div>

        <div className="modal-body">
          {children}
        </div>

      </div>
    </div>
  );

  return createPortal(contenido, document.body);
}