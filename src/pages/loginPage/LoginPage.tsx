import { useState } from 'react';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/auth/authContext';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo');
  const navigate = useNavigate();
  const location = useLocation() as any;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
    const to = location.state?.from?.pathname ?? '/';
    navigate(to, { replace: true });
  }

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <Card.Body>
          <Card.Title>Accedi</Card.Title>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control value={email} onChange={e => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </Form.Group>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Entra'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
