import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setOnline } from "./slices/UserSlice";
const SERVER_URL = import.meta.env.VITE_API_SERVER_URL

const socket = io(SERVER_URL)

export function connecttoserver({ dispatch, username, profile, uid }) {
    socket.emit('userconnection', { username, profile, uid }, (acknowledgment) => {
        if (acknowledgment && acknowledgment.success) {
            dispatch(setOnline(true))
            console.log('User connection successful!');
        } else {
            dispatch(setOnline(false))
            console.error('Error in user connection:', acknowledgment.error);
        }
    }
    )
}

export function findusers(uid) {
    return new Promise((resolve, reject) => {
        socket.emit('finduser', uid, (users) => {
            if (users) {
                resolve(users);
            } else {
                reject(new Error('No users found'));
            }
        });
    });
}

export function sendChatRequest(uid) {
    return new Promise((resolve, reject) => {
        socket.emit('sendchatrequest', uid, (userResponse) => {
            if (userResponse) {
                resolve(userResponse);
            } else {
                reject(new Error('Your Request has been Rejected'));
            }
        });
    });
}
