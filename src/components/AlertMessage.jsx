function AlertMessage({ type = "info", message }) {
  if (!message) return null;

  return <p className={`alert ${type}`}>{message}</p>;
}

export default AlertMessage;
