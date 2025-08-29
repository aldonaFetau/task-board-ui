import type { TaskStatus } from './enums';

// Map status codes to human-readable labels
export const statusLabel: Record<TaskStatus, string> = {
  ToDo: 'Da fare',
  InProgress: 'In corso',
  Completed: 'Completato',
};
export const requiredMessages = {
    requiredField: "Campo è obbligatorio"
};

export const BoardCardNotifications = {
  taskCreateSuccess: "Task creato con successo",
  taskCreateFailed: "Creazione task fallita",
  taskUpdateSuccess: "Task aggiornato con successo",
  taskUpdateFailed: "Aggiornamento task fallito",
  taskDeleteSuccess: "Task eliminato con successo",
  taskDeleteFailed: "Eliminazione task fallita",
  addListSuccess: "Lista creata con successo",
  addListFailed: "Creazione lista fallita",
  removeListSuccess: "Lista eliminata con successo",
  removeListFailed: "Eliminazione lista fallita",
  fetchListsFailed: "Errore nel caricamento delle liste",
  fetchTasksFailed: "Errore nel caricamento dei task",
  statusChangeSuccess: "Stato task aggiornato con successo",
  statusChangeFailed: "Aggiornamento stato task fallito",
  searchFailed: "Errore nella ricerca dei task"

};
 
export const labels  = {
    confirmBtnLabel:"Conferma",
    cancelBtnLabel:'Annula',
    searchTask: "Cerca task...",
    logoutBtnLabel:'Logout',
    addTask:'Aggiungi Task',
    deleteList:'Elimina Lista',
    modifyTask:'Modifica',
    deleteBtn:'Elimina',
    deleteModalTitle:'Conferma eliminazione lista',
    deleteListModalBodyText1:'Sei sicuro di voler eliminare la lista:',
    deleteListModalBodyText2:'Tutti i task collegati andranno persi.',
    deleteTaskModalBodyText1:'Sei sicuro di voler eliminare il task:',
    deleteTaskModalBodyText2:'Questa azione non può essere annullata.',
    modifyTaskModalTitle:'Modifica Task',
    newTaskModalTitle:'Nuovo Task',
    titleField:'Titolo',
    descriptionField:'Descrizione',
    categoryField:'Categoria (Lista)',
    dueDateField:'Data di scadenza',
    stateField:'Stato',
    noData:'Nessun elemento',
    saveBtn:'Salva',
    addBtn:'Aggiungi',
    searchFailed:'Ricerca fallita',
    boardContextError:'useBoard must be used within BoardProvider',
    notificationContextError:"useNotification must be used within NotificationProvider",
    listNameFieldPlaceholeder:"Nome Di Nuova lista",
    noListMessage:'Nessuna lista trovata. Creane una per iniziare.',
    emailValidationError:"Inserisci un'email valida.",
    passwordValidationError:"La password deve avere almeno 7 caratteri.",
    emailField:'Email',
    passwordField:'Password',
    loginField:'Entra',
    loginErrorMessage:'Login failed',
    dueDateCannotBePast:"La data di scadenza non può essere antecedente a oggi"
};
