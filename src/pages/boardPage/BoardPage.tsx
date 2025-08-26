import { useEffect, useState } from 'react';
import { Button, Container, Spinner, Alert, Form } from 'react-bootstrap';
import { useBoard } from '../../context/board/boardContext';
import ListColumn from '../../components/lists/ListColumn';
import styles from './BoardPage.module.scss';

export default function BoardPage() {
  const { lists, fetchLists, addList, loading, error } = useBoard();
  const [newListName, setNewListName] = useState('');

  useEffect(() => { fetchLists(); }, []);

  async function createList(e: React.FormEvent) {
    e.preventDefault();
    if (!newListName.trim()) return;
    await addList(newListName.trim());
    setNewListName('');
  }

  const nothing = !loading && lists.length === 0;

  return (
    <Container fluid className={styles.board}>
      <header className={styles.header}>
        <h1>Le mie liste</h1>
        <form onSubmit={createList} className={styles.addForm}>
          <Form.Control
            placeholder="Nome Di Nuova Lista"
            value={newListName}
            onChange={e => setNewListName(e.target.value)}
          />
          <Button type="submit">Aggiungi</Button>
        </form>
      </header>

      {loading && <Spinner />}
      {error && <Alert variant="danger">{error}</Alert>}
      {nothing && <Alert>Nessuna lista. Creane una per iniziare.</Alert>}

      <div className={styles.columns}>
        {lists.map(list => (
          <ListColumn key={list.id} list={list} />
        ))}
      </div>
    </Container>
  );
}
