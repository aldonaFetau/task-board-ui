import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Task } from "../../types/domain";
import type { TaskStatus } from "../../types/enums";
import { useBoard } from "../../context/board/boardContext";
import '../../types/labels';
import { requiredMessages } from "../../types/labels";
import { labels, statusLabel } from "../../types/labels";

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
  const [errors, setErrors] = useState<{ requiredField?: string, dueDateError?:string }>({});
 
  
  
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

  // const handleSubmit = async (e: React.FormEvent) => {

  //   e.preventDefault();
  //      const newErrors: typeof errors = {};
  //   if (!form.title.trim()|| !form.dueDate.trim()) newErrors.requiredField = requiredMessages.requiredField;
      
  //   // Due date cannot be earlier than today
  //   if (form.dueDate) {
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);
  //     const dueDate = new Date(form.dueDate);

  //     if (dueDate < today) {
  //       newErrors.dueDateError = labels.dueDateCannotBePast;
  //     }
  //   }
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }
  //   await onSubmit({
  //     ...form,
  //     id: initial?.id,
  //   });
     
  //   onClose();
  // };
// Helper function to validate due date
  function validateDueDate(dateStr: string): string | undefined {
    if (!dateStr.trim()) return requiredMessages.requiredField; // empty
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    if (dueDate < today) return labels.dueDateCannotBePast;
    return undefined; // valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!form.title.trim()) {
      newErrors.requiredField = requiredMessages.requiredField;
    }

    const dueDateError = validateDueDate(form.dueDate);
    if (dueDateError) newErrors.dueDateError = dueDateError;

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
        <Modal.Title>{initial ? labels.modifyTaskModalTitle : labels.newTaskModalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>{labels.titleField}<span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control
              type="text"
              value={form.title}              
              isInvalid={!!errors.requiredField}
              onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                  if (!!errors.requiredField) {
                    setErrors({ ...errors, requiredField: undefined });
                  }
                }}
              
            />
               <Form.Control.Feedback type="invalid">
              {errors.requiredField}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{labels.descriptionField}</Form.Label>
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
            <Form.Label>{labels.categoryField}</Form.Label>
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
            <Form.Label>{labels.dueDateField}<span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control
              type="date"
              value={form.dueDate}
              onChange={(e) => {
                    const newDate = e.target.value;
                    setForm({ ...form, dueDate: newDate });

                    const error = validateDueDate(newDate);
                    setErrors({ ...errors, dueDateError: error });
                  }}               
              isInvalid={!!errors.dueDateError || !!errors.requiredField} 
            />
             <Form.Control.Feedback type="invalid">
              {errors.dueDateError || errors.requiredField}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{labels.stateField}</Form.Label>
            <Form.Select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as TaskStatus })
              }
            >
              <option value="ToDo">{statusLabel.ToDo}</option>
              <option value="InProgress">{statusLabel.InProgress}</option>
              <option value="Completed">{statusLabel.Completed}</option>
            </Form.Select>
          </Form.Group>

         

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              {labels.cancelBtnLabel}
            </Button>
            <Button type="submit" variant="primary">
              {initial ? labels.saveBtn : labels.addBtn}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
