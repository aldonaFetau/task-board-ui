import { useEffect, useState } from "react";
import { Card, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import type { List, Task } from "../../types/domain";
import { useBoard } from "../../context/board/boardContext";
import TaskCard from "../tasks/TaskCard";
import TaskForm from "../tasks/TaskForm";
import ConfirmModal from "../common/ConfrimModal";
import "../../styles/index.scss";
import styles from "./ListColumns.module.scss";
import { labels, statusLabel } from "../../types/labels";
export default function ListColumn({ list }: { list: List }) {
  const { tasksByList, fetchTasks, addTask, removeList } = useBoard();
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const idStr = String(list.id);
    if (!idStr.startsWith("tmp-")) fetchTasks(idStr);
  }, [list.id]);

  const tasks = tasksByList[list.id] ?? [];
  const todo = tasks.filter((t) => t.status === "ToDo");
  const doing = tasks.filter((t) => t.status === "InProgress");
  const done = tasks.filter((t) => t.status === "Completed");

  return (
<Card className={`mb-3 ${styles.listColumn}`} style={{ minWidth: 320 }}>
      <Card.Header className={styles.header}>
        <strong>{list.title}</strong>
        <div className="d-flex gap-2">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-add-${list.id}`}>{labels.addTask}</Tooltip>}
          >
            <Button size="sm" variant="primary" onClick={() => setShowForm(true)}>
              <FaPlus />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-remove-${list.id}`}>{labels.deleteList}</Tooltip>}
          >
            <Button size="sm" variant="outline-danger" onClick={() => setShowConfirm(true)}>
              <FaTrash />
            </Button>
          </OverlayTrigger>
        </div>
      </Card.Header>

      <Card.Body>
        <Section title={statusLabel.ToDo} tasks={todo} />
        <Section title={statusLabel.InProgress} tasks={doing} />
        <Section title={statusLabel.Completed} tasks={done} />
      </Card.Body>

      <TaskForm
        listId={list.id}
        show={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={async (payload: any) => {
          await addTask({ ...payload});
          setShowForm(false);
        }}
      />

      {/* Confirm delete modal */}
      <ConfirmModal
        show={showConfirm}
        title={labels.deleteModalTitle}
        message={
          <>
            <p>
             {labels.deleteListModalBodyText1} <br />
              <strong className="text-dark">“{list.title}”</strong>?
            </p>
            <p className="text-muted mb-0"> {labels.deleteListModalBodyText2}</p>
          </>
        }
        confirmLabel={labels.deleteList}
        confirmVariant="danger"
        onConfirm={() => {
          removeList(list.id);
          setShowConfirm(false);
        }}
        onClose={() => setShowConfirm(false)}
      />
    </Card>
  );
}

function Section({ title, tasks }: { title: string; tasks: Task[] }) {
  const statusClass = title === statusLabel.ToDo ? "todo" : title === statusLabel.InProgress ? "doing" : "done";

  return (
    <div className={`section ${statusClass} mb-4`}>
      <h6 className="text-muted mb-2">{title}</h6>
      <div className="d-flex flex-column gap-2">
        {tasks.length > 0 ? (
          tasks.map((t) => <TaskCard key={t.id} task={t} statusClass={statusClass} />)
        ) : (
          <p className="text-muted fst-italic mb-0">{labels.noData} </p>
        )}
      </div>
    </div>
  );
}
