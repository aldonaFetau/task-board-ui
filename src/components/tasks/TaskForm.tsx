import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Task } from "../../types/domain";
import type { TaskStatus } from "../../types/enums";
import { useBoard } from "../../context/board/boardContext";

type TaskFormProps = {
  show: boolean;
  onClose: () => void;
  onSubmit: (task: {
    id?: string;
    title: string;
    description?: string;
    dueDate?: string;
    status: TaskStatus;
    listId: string;
  }) => Promise<void>;
  initial?: Task;
  listId?: string;
};

export default function TaskForm({
  show,
  onClose,
  onSubmit,
  initial,
  listId,
}: TaskFormProps) {

  const { lists } = useBoard();
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "ToDo" as TaskStatus,
    listId: listId ?? (lists.length > 0 ? lists[0].id :""), 
  });
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});
 
  
  
  useEffect(() => {
     // preload initial values if editing
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        dueDate: initial.dueDate ? initial.dueDate.split("T")[0] : "",
        status: initial.status || "ToDo",
        listId: initial.listId ?? listId ?? (lists.length > 0 ? lists[0].id : 0),
      });
    } else { 
      
      setForm({
      title: "",
      description: "",
      dueDate: "",
      status: "ToDo",
      listId: listId ?? (lists.length > 0 ? lists[0].id : ""),
    });} 
    
    setErrors({});
  
  }, [initial, show, listId, lists]);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
       const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = "Il titolo è obbligatorio.";
    if (!form.dueDate.trim()) newErrors.dueDate = "La scadenza è obbligatoria.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    await onSubmit({
      ...form,
      id: initial?.id,
    });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initial ? "Modifica Task" : "Nuovo Task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Titolo<span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
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
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoria (Lista)</Form.Label>
            <Form.Select
              value={form.listId}
              onChange={(e) =>
                setForm({ ...form, listId: e.target.value }) 
              }
            >
              {lists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Data di scadenza<span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}                
              isInvalid={!!errors.dueDate}
            />
             <Form.Control.Feedback type="invalid">
              {errors.dueDate}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stato</Form.Label>
            <Form.Select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as TaskStatus })
              }
            >
              <option value="ToDo">Da fare</option>
              <option value="InProgress">In corso</option>
              <option value="Completed">Completato</option>
            </Form.Select>
          </Form.Group>

         

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Annulla
            </Button>
            <Button type="submit" variant="primary">
              {initial ? "Salva" : "Crea"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
