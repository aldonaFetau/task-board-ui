import { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import type { List, Task } from '../../types/domain';
import { useBoard } from '../../context/board/boardContext';
import TaskCard from '../tasks/TaskCard';
import TaskForm from '../tasks/TaskForm';


export default function ListColumn({ list }: { list: List }) {
  const { tasksByList, fetchTasks, addTask, removeList } = useBoard();
  const [showForm, setShowForm] = useState(false);

useEffect(() => {
  const idStr = String(list.id);
  if (idStr.startsWith('tmp-')) return; // skip optimistic lists
  fetchTasks(idStr);
}, [list.id]);



  const tasks = tasksByList[list.id] ?? [];
  const todo = tasks.filter(t => t.status === 'ToDo');
  const doing = tasks.filter(t => t.status === 'InProgress');
  const done = tasks.filter(t => t.status === 'Completed');

  return (
    <Card className="mb-3" style={{ minWidth: 320 }}>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <strong>{list.title}</strong>
        <div className="d-flex gap-2">
          <Button size="sm" onClick={() => setShowForm(true)}>+ Task</Button>
          <Button size="sm" variant="outline-danger" onClick={() => removeList(list.id)}>Elimina</Button>
        </div>
      </Card.Header>
   <Card.Body>
 <Card.Body>
  <Section title="Da fare" tasks={todo} />
  <Section title="In corso" tasks={doing} />
  <Section title="Completato" tasks={done} />
</Card.Body>

</Card.Body>



     <TaskForm
  listId={list.id}
  show={showForm}
  onClose={() => setShowForm(false)}
  onSubmit={async (payload: any) => {
    await addTask({ 
      ...payload, 
      listId: Number(list.id)  
    });
    setShowForm(false);
  }}
/>

    </Card>
  );
}


function Section({ title, tasks }: { title: string; tasks: Task[] }) {
  return (
    <>
      <h6 className="text-muted">{title}</h6>
      <div className="d-grid gap-2 mb-3">
        {tasks.length > 0 ? (
          tasks.map((t) => <TaskCard key={t.id} task={t} />)
        ) : (
          <p className="text-muted">Nessun elemento</p>
        )}
      </div>
    </>
  );
}
