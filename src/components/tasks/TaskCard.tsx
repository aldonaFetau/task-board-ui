import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import type { Task } from "../../types/domain";
import type { TaskStatus } from "../../types/enums";
import { useBoard } from "../../context/board/boardContext";
import TaskForm from "./TaskForm";
import styles from "./TaskCard.module.scss";

export default function TaskCard({ task }: { task: Task }) {
  const { removeTask, updateTask } = useBoard();
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className={`${styles.taskRow} border rounded px-2 py-1 mb-1 bg-white`}>
      {/* Task title */}
      <span>{task.title}</span>

      {/* Action icons */}
      <div className={styles.actionIcons}>
        <i
          className="bi bi-pencil"
          title="Modifica"
          onClick={() => setShowDetails(true)}
        />
        <i
          className="bi bi-trash text-danger"
          title="Elimina"
          onClick={() => setShowConfirm(true)}
        />
      </div>

      {/* Edit modal */}
      <TaskForm
        show={showDetails}
        listId={task.listId}
        initial={task}
        onClose={() => setShowDetails(false)}
        onSubmit={async (payload) => {
          await updateTask(task.id, {
            title: payload.title,
            description: payload.description,
            dueDate: payload.dueDate,
            status: payload.status as TaskStatus,
            listId: payload.listId,
          });
          setShowDetails(false);
        }}
      />

      {/* Confirm delete modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2" />
            Conferma eliminazione
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Sei sicuro di voler eliminare il task: <br />
            <strong className="text-dark">“{task.title}”</strong>?
          </p>
          <p className="text-muted mb-0">
            Questa azione non può essere annullata.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Annulla
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              removeTask(task.id, task.listId);
              setShowConfirm(false);
            }}
          >
            Elimina definitivamente
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
