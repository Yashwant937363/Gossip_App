import { io } from "socket.io-client";
import { setOnline } from "./slices/UserSlice";
const SERVER_URL = import.meta.env.VITE_API_SERVER_URL

export const socket = io(SERVER_URL)

export function connecttoserver({ dispatch, username, profile, uid }) {
    socket.emit('user:connection', { username, profile, uid }, (acknowledgment) => {
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
        socket.emit('user:finduser', uid, (users) => {
            if (users) {
                resolve(users);
            } else {
                reject(new Error('No users found'));
            }
        });
    });
}

export function sendChatRequest(fromuid,touid) {
    return new Promise((resolve, reject) => {
        socket.emit('user:sendchatrequest', fromuid, touid, (userResponse) => {
            if (userResponse) {
                resolve(userResponse);
            } else {
                reject(new Error('Your Request has been Rejected'));
            }
        });
    });
}