import { useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/auth/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const location = useLocation() as any;

  function validate() {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Inserisci un'email valida.";
    }
    if (password.length < 7) {
      newErrors.password = "La password deve avere almeno 7 caratteri.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    await login(email, password);
    const to = location.state?.from?.pathname ?? "/board";
    navigate(to, { replace: true });
  }

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <Card.Body>
          <Card.Title className="mb-4">Accedi</Card.Title>

          <Form onSubmit={onSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
                required
              />
              {errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errors.password}
                required
              />
              {errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Button
              type="submit"
              className={`${styles.loginBtn} w-100`}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" animation="border" /> : "Entra"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
