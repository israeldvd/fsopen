const Notification = ({ message }) => {
  if (!message.text) {
    return <></>
  }

  return <div className={`notification ${message.class}`}>{message.text}</div>
}

export default Notification
