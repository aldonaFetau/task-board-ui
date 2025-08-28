import React, { useState } from "react";
import {
  Container,
  Button,
  Form,
  InputGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import { FaRegClipboard, FaSearch } from "react-icons/fa";
import styles from "./Header.module.scss";
import TaskCard from "../tasks/TaskCard";
import { useBoard } from "../../context/board/boardContext";

type HeaderProps = {
  user?: { name?: string };
  onLogout?: () => void;
};

export default function Header({ user, onLogout }: HeaderProps) {
  const { searchTasks } = useBoard();
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const found = await searchTasks(query);
      setResults(found);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className={styles.appHeader}>
        <Container className="d-flex justify-content-between align-items-center">
          {/* Left: Logo + Title */}
          <div className="d-flex align-items-center gap-2">
            <FaRegClipboard className={styles.icon} />
            <h1 className={styles.title}>Scheda Attività</h1>
          </div>

          {/* Center: Search bar */}
          <div className="flex-grow-1 d-flex justify-content-center px-3">
            <InputGroup style={{ maxWidth: "500px", width: "100%" }}>
              <Form.Control
                type="text"
                placeholder="Cerca task..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button className={styles.searchBtn} onClick={handleSearch}>
                <FaSearch />
              </Button>
            </InputGroup>
          </div>

          {/* Right: User info + Logout */}
          <div className="d-flex align-items-center gap-3">
            <span className={styles.userName}>{user?.name || "Utente"}</span>
            <Button
              className={styles.logoutBtn}
              size="sm"
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        </Container>
      </header>

      {/* Modal with search results */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Risultati ricerca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
            </div>
          ) : results.length > 0 ? (
            results.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                statusClass={getStatusClass(task.status)}
              />
            ))
          ) : (
            <p className="text-muted">Nessun task trovato.</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

function getStatusClass(status: string) {
  switch (status) {
    case "ToDo":
      return "todo";
    case "InProgress":
      return "doing";
    case "Completed":
      return "done";
    default:
      return "";
  }
}
