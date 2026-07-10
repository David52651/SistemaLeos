import "@/styles/catalogoModal.css";

import Button from "@/components/ui/Button";


export default function CatalogoModal({
  open,
  title,
  onClose,
  children,
}) {


  if (!open) return null;


  return (

    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
    >


      <div className="modal-container">


        <div className="modal-header">


          <h3>
            {title}
          </h3>



          <Button

            variant="ghost"

            onClick={onClose}

          >

            ✖

          </Button>


        </div>



        <div className="modal-body">

          {children}

        </div>


      </div>


    </div>

  );

}