export default function ReceivedChat(props) {
    const time = new Date(props.time)
    return (
        <div className='chat'>
            <div className='receivedchat'>
                <div className='chattext'>{props.message}</div>
                <div className="timecheck">{time.getHours()}:{time.getMinutes()}</div>
            </div>
        </div>
    )
}
