

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useRef } from "react";
import { Toast, ToastContainer as RBToastContainer } from "react-bootstrap";

type ToastItem = { id: number; message: string; variant: "success" | "danger" };

type NotificationContextType = {
  toasts: ToastItem[];
  addToast: (message: string, variant?: "success" | "danger") => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const addToast = (message: string, variant: "success" | "danger" = "success") => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message, variant }]);
  };

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ toasts, addToast }}>
      {children}
      <RBToastContainer
        position="top-center"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        {toasts.map((t) => (
          <Toast
            key={t.id}
            onClose={() => removeToast(t.id)}
            autohide
            delay={3000}
            style={{
              backgroundColor: t.variant === "success" ? "#4CAF50" : "#dc3545", // warm green or red
              color: "white",
            }}
          >
            <Toast.Body>{t.message}</Toast.Body>
          </Toast>
        ))}
      </RBToastContainer>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification must be used within NotificationProvider");
  return context;
};
