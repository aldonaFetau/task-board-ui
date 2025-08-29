import { useEffect, useState, useRef } from 'react';
import { Button, Container, Spinner, Alert, Form } from 'react-bootstrap';
import { useBoard, } from '../../context/board/boardContext';
import ListColumn from '../../components/lists/ListColumn';
import Header from '../../components/header/Header';
import styles from './BoardPage.module.scss';
import { useAuth } from "../../context/auth/authContext";
import { useNavigate } from "react-router-dom";
import '../../types/labels'
import { requiredMessages } from '../../types/labels';
import { FaRegFolderOpen } from 'react-icons/fa';
import { labels } from '../../types/labels';

export default function BoardPage() {
  const { lists, fetchLists, addList, loading, error } = useBoard();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [newListName, setNewListName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
 function handleLogout() {
    logout();          // clear auth state
    navigate("/"); 
  }
async function createList(e: React.FormEvent) {
  e.preventDefault();

  if (!newListName.trim()) {
    setErrorMessage(requiredMessages.requiredField); 
    return;
  }

  await addList(newListName.trim());
  setNewListName('');
  setErrorMessage(''); 
}
  useEffect(() => {
    fetchLists();
    // Clear input error message on click outside
       function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setErrorMessage('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


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
        placeholder= {labels.listNameFieldPlaceholeder}
        value={newListName}
        ref={inputRef}
        onChange={(e) => {
          setNewListName(e.target.value);
          if (errorMessage) setErrorMessage(""); // clear error when typing
      }}
    className={`${styles.addListInput} ${errorMessage ? styles.inputError : ''} ${errorMessage ? 'input-error' : ''}`}

      />
      {errorMessage && (
        <div className={styles.errorText}>* {errorMessage}</div>
      )}
    </div>
    <Button variant="primary" type="submit" size="sm">
      {labels.addBtn}
    </Button>
  </Form>
</div>

  
   {/* Centered Spinner or Empty Message */}
  {loading || (!loading && lists.length === 0) ? (
    <div className={styles.centeredFeedback}>
      {loading ? (
        <Spinner animation="border" role="status" variant="primary" />
      ) : (
            
        <p className={styles.noListMessage}>
          <FaRegFolderOpen size={20} style={{ marginBottom: '0.5rem', color: '#ded7d7ff' }} />
              {labels.noListMessage}
        </p>
      )}
    </div>
  ) : null}

  <div className={styles.columnsContainer}>
    {lists.map((list) => (
      <ListColumn key={list.id} list={list} />
    ))}
  </div>
</Container>

    </>
  );
}
