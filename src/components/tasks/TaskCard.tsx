import { useState } from "react";
import type { Task } from "../../types/domain";
import { useBoard } from "../../context/board/boardContext";
import TaskForm from "./TaskForm";
import ConfirmModal from "../common/ConfrimModal";
import styles from "./TaskCard.module.scss";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { labels } from "../../types/labels";

export default function TaskCard({ task, statusClass }: { task: Task; statusClass?: string }) {
  const { removeTask, updateTask } = useBoard();
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className={`${styles.taskRow} ${statusClass ? styles[statusClass] : ""}`}>
      {/* Task title */}
      <span>{task.title}</span>

      {/* Action icons */}
<div className={styles.actionIcons}>
  <OverlayTrigger placement="top" overlay={<Tooltip id={`edit-${task.id}`}>{labels.modifyTask}</Tooltip>}>
    <i className="bi bi-pencil" onClick={() => setShowDetails(true)} />
  </OverlayTrigger>

  <OverlayTrigger placement="top" overlay={<Tooltip id={`delete-${task.id}`}>{labels.deleteBtn}</Tooltip>}>
    <i className="bi bi-trash text-danger" onClick={() => setShowConfirm(true)} />
  </OverlayTrigger>
</div>



      {/* Edit modal */}
      <TaskForm
        show={showDetails}
        listId={task.listId}
        initial={task}
        onClose={() => setShowDetails(false)}
        onSubmit={async (payload) => {
        await updateTask(task.id, payload);

          setShowDetails(false);
        }}
      />

      {/* Confirm delete modal */}
      <ConfirmModal
        show={showConfirm}
        title="Conferma eliminazione"
        message={
          <>
            <p>
              {labels.deleteTaskModalBodyText1} <br />
              <strong className="text-dark">“{task.title}”</strong>?
            </p>
            <p className="text-muted mb-0">{labels.deleteTaskModalBodyText2}</p>
          </>
        }
        confirmLabel={labels.deleteBtn}
        confirmVariant="danger"
        onConfirm={() => {
          removeTask(task.id, task.listId);
          setShowConfirm(false);
        }}
        onClose={() => setShowConfirm(false)}
      />
    </div>
  );
}
