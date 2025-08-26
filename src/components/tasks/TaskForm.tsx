import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Task } from "../../types/domain";

type TaskFormProps = {
  show: boolean;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    description?: string;
    dueDate?: string;
    status?: string;
    listId: string;
  }) => Promise<void>;
  initial?: Task;   
  listId: string;  
};

export default function TaskForm({ show, onClose, onSubmit, initial, listId }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Todo");

  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description ?? "");
      setDueDate(initial.dueDate ? initial.dueDate.split("T")[0] : "");
      setStatus(initial.status ?? "Todo");
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("Todo");
    }
    setErrors({});
  }, [initial, show]);

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "Il titolo è obbligatorio.";
    if (!dueDate.trim()) newErrors.dueDate = "La scadenza è obbligatoria.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit({
      title,
      description,
      dueDate,
      status,
      listId   
    });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{initial ? "Modifica Task" : "Nuovo Task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate>
          <Form.Group className="mb-3">
            <Form.Label>
              Titolo <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Scadenza <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              isInvalid={!!errors.dueDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dueDate}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stato</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Todo">Da fare</option>
              <option value="InProgress">In corso</option>
              <option value="Completed">Completato</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Annulla
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {initial ? "Aggiorna" : "Crea"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
