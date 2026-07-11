import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
    open,
    title = "Confirmar acción",
    message,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    confirmVariant = "danger",
    onConfirm,
    onCancel,
}) {

    if (!open) return null;

    return (

        <Modal
            open={open}
            onClose={onCancel}
        >

            <div className="confirm-dialog">

                <div className="confirm-header">

                    <h3>

                        {title}

                    </h3>

                </div>

                <div className="confirm-body">

                    <p>

                        {message}

                    </p>

                </div>

                <div className="confirm-actions">

                    <Button
                        variant="secondary"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant={confirmVariant}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>

                </div>

            </div>

        </Modal>

    );

}