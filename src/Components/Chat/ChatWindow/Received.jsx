export default function ReceivedChat(props) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours() % 12 || 12; // Convert 0 to 12
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";
    return `${hours}:${minutes} ${ampm}`;
  };
  const time = formatTime(props.time);
  return (
    <div className="chat">
      <div className="receivedchat">
        <div className="chattext">{props.message}</div>
        <div className="timecheck">{time}</div>
      </div>
    </div>
  );
}
