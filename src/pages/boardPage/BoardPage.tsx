import { useEffect, useState } from 'react';
import { Button, Container, Spinner, Alert, Form } from 'react-bootstrap';
import { useBoard } from '../../context/board/boardContext';
import ListColumn from '../../components/lists/ListColumn';
import Header from '../../components/header/Header';
import styles from './BoardPage.module.scss';
import { useAuth } from "../../context/auth/authContext";
import { useNavigate } from "react-router-dom";
export default function BoardPage() {
  const { lists, fetchLists, addList, loading, error } = useBoard();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [newListName, setNewListName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
 function handleLogout() {
    logout();          // clear auth state
    navigate("/"); // redirect to login 
  }
async function createList(e: React.FormEvent) {
  e.preventDefault();

  if (!newListName.trim()) {
    setErrorMessage('Devi inserire un nome per la lista'); // set error message
    return;
  }

  await addList(newListName.trim());
  setNewListName('');
  setErrorMessage(''); // clear error after successful add
}
  useEffect(() => {
    fetchLists();
  }, []);


  const nothing = !loading && lists.length === 0;

  return (
    <>
 <Header 
  user={{ name: user?.name }} 
     onLogout={handleLogout} 
/>

<Container fluid className={styles.board}>
  {/* Top-right Add List form container */}
<div className={styles.addListWrapper}>
  <Form onSubmit={createList} className={styles.addListCard}>
    <div className={styles.inputWrapper}>
      <Form.Control
        placeholder="Nome Di Nuova lista"
        value={newListName}
        onChange={(e) => {
    setNewListName(e.target.value);
    if (errorMessage) setErrorMessage(""); // clear error when typing
  }}
        className={`${styles.addListInput} ${errorMessage ? styles.inputError : ''}`}
      />
      {errorMessage && (
        <div className={styles.errorText}>* {errorMessage}</div>
      )}
    </div>
    <Button variant="primary" type="submit" size="sm">
      Aggiungi
    </Button>
  </Form>
</div>

  {loading && <Spinner />}
  {error && <Alert variant="danger">{error}</Alert>}
  {nothing && <Alert>Nessuna lista trovata. Creane una per iniziare.</Alert>}

  <div className={styles.columnsContainer}>
    {lists.map((list) => (
      <ListColumn key={list.id} list={list} />
    ))}
  </div>
</Container>

    </>
  );
}
