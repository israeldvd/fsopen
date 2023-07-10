import styles from "./Notification.module.css";

export const setTemporaryConfirmation = (
  { message, className },
  timeout,
  setConfirmationFunction
) => {
  setConfirmationFunction({
    message: message ? message : "Confirmed.",
    class: className ? className : "error",
  });
  setTimeout(() => {
    setConfirmationFunction({
      message: null,
      class: null,
    });
  }, timeout);
};

const Notification = ({ message, className }) => {
  if (message === null) {
    return null;
  }

  const finalClassName = `${styles.notification} ${
    className === "success" ? styles.success : styles.error
  }`;

  return <div className={finalClassName}>{message}</div>;
};

export default Notification;
