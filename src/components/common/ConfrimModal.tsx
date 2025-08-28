import { Modal, Button } from "react-bootstrap";

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  confirmVariant?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  show,
  title,
  message,
  confirmLabel = "Conferma",
  confirmVariant = "danger",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className={`text-${confirmVariant}`}>
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Annulla
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
