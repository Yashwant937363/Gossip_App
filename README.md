# Gossip AI - Real-Time Chat & Communication Platform

A feature-rich real-time messaging and video calling application built with React, featuring AI-powered chat assistance, message translation, conversation summarization, and live video conferencing.

**Live Demo:** https://gossip-app-dz7b.onrender.com/

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [WebSocket Events](#websocket-events)
- [APIs](#apis)
- [Database](#database)
- [Setup & Installation](#setup--installation)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

---

## ✨ Features

### Core Messaging
- **Real-time Chat**: Instant peer-to-peer messaging with Socket.IO
- **Chat Requests**: Send and manage friend connection requests
- **Message Status**: Track read/unread messages with seen indicators
- **Message Types**: Support for text and image messages
- **Image Editing**: Built-in image editor with Syncfusion for message attachments
- **Image Viewer**: Dedicated component for viewing shared images

### AI Features
- **AI ChatBot**: Integrated AI assistant for conversations with customizable response tones
- **Auto-Translation**: Automatic message translation with language selection
  - Supported Languages: English, Hindi, Marathi, Spanish, Punjabi
  - Per-user language preferences
  - Batch translation of multiple messages
- **Conversation Summarization**: AI-powered summaries of conversations with multiple formats:
  - Paragraph format
  - Bullet point format
  - Structured format (with topic, key points, conclusion)
- **Image Analysis**: AI-powered image description using `ai:image-analyze` events

### Video Communication
- **Real-time Video Calls**: Peer-to-peer video calling using Agora RTC SDK
- **Virtual Backgrounds**: 
  - Blur background
  - Color background
  - Custom image background
- **Camera & Microphone Controls**: Toggle camera and microphone during calls
- **Call Status Tracking**: Visual indicators for ringing, connected, and ended states

### User Experience
- **Authentication**: Email-based signup/signin with JWT token-based auth
- **User Profiles**: Profile pictures, user information, and account settings
- **Customizable Themes**: 
  - Light/Dark mode toggle
  - Custom color themes
  - CSS variables for dynamic styling (--theme-color, --theme-mode)
- **Real-time User Status**: Online/offline indicators for friends
- **Settings Panel**:
  - AI Settings (translation language, summarization format)
  - Theme Preferences
  - Profile Management

---

## 🏗️ Architecture

```
src/
  App.jsx              Main app component with routing and socket event listeners
  main.jsx             React root with Redux store and Agora provider
  
  Components/          React components organized by feature
    Home/              Landing/home page
    Chat/              Chat interface and messaging UI
      ChatWindow/      Chat display with message rendering
        ChatContainer/ Real-time message list
        ChatDate/      Date separator with summarization
        Received.jsx   Message reception with translation UI
        ImageEditor/   Image upload and editing
        ImageViewer/   Image preview component
      Call/            Video call interface
        VideoCall.jsx  Video call UI with background effects
    ChatBot/           AI assistant interface
    Account/           Authentication (signin/signup)
    Settings/          User preferences
      Profile/         Profile management
      Themes/          Theme customization
      AISettings/      AI feature configuration
    Navbar/            Main navigation
    MsgBars/           Toast notifications (Success, Error, Warning)
    Buttons/           Reusable button components
    Hooks/             Custom React hooks
  
  store/               Redux Toolkit state management
    store.js           Store configuration
    slices/
      UserSlice.js     Authentication, user data, settings
      ChatSlice.js     Messages, friends, chat state
      CallSlice.js     Video call state management
      ThemeSlice.js    Theme and styling preferences
      AIChatBotSlice.js AI chatbot messages
      UISlice.js       UI state (modals, warnings)
  
  socket/              WebSocket event handlers
    main.js            Socket initialization and core events
    call.js            Video call events
    ai.js              AI feature events
  
  service/             Utility services
    PeerService.js     WebRTC peer connection management
  
  assets/              Static assets (images, icons)
  index.css            Global styles
```

### Data Flow

1. **User Authentication** → Redux (UserSlice) → Socket connection with credentials
2. **Real-time Updates** → Socket events → Redux dispatch → Component re-render
3. **Message Sending** → Socket emit → Server processing → Broadcast back → Redux update
4. **AI Operations** → Socket emit with message data → Server processes → Socket response → Redux update

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.2** - UI library
- **Vite 5.0** - Build tool and dev server
- **React Router 6.21** - Client-side routing

### State Management & Forms
- **Redux Toolkit 2.0** - Predictable state management
- **React Redux 9.0** - React bindings for Redux
- **React Hook Form 7.49** - Efficient form handling

### Real-time Communication
- **Socket.IO Client 4.7** - Real-time bidirectional communication
- **Agora RTC SDK 4.22** - Video/audio conferencing
- **Agora RTC React 2.3** - React bindings for Agora
- **Agora Virtual Background 2.0** - Background effects for video

### UI & Styling
- **Motion 11.15** - Animation library (Framer Motion alternative)
- **React Bootstrap Icons 1.10** - Icon components
- **Emoji Mart 5.6** - Emoji picker with React integration
- **React Dropdown 1.11** - Dropdown component

### Image Processing
- **Syncfusion Image Editor 28.1** - Professional image editing

### Media & Utilities
- **React Player 2.16** - Media player component
- **Three.js 0.170** - 3D graphics
- **React Three Fiber 8.17** - React renderer for Three.js
- **React Three Drei 9.120** - Useful helpers for Three.js
- **JS Cookie 3.0** - Cookie management
- **Axios 1.6** - HTTP client

### Development Tools
- **ESLint 8.55** - Code linting
- **Vite Plugin React 4.2** - Fast Refresh for React

---

## 🌍 State Management

### Redux Slices

#### **UserSlice** (`src/store/slices/UserSlice.js`)
Manages authentication and user profile state.

**State:**
- `profile` - User avatar/profile image URL
- `fullname`, `username`, `email`, `dob` - User details
- `authtoken` - JWT authentication token
- `uid` - Unique user identifier
- `online` - Connection status
- `isLogin` - Authentication flag
- `settings.translation` - Language preference, always-translate toggle
- `settings.summarization` - Summarization format preference
- `requests` - Pending friend requests
- `errormsg`, `successmsg` - User notifications

**Async Thunks:**
- `signUpUser` - POST `/api/auth/signup`
- `signInUser` - POST `/api/auth/signin`
- `getUser` - POST `/api/auth/getuser` (auto-login)

**Key Actions:**
- `addRequest` - Add incoming friend request
- `removeRequest` - Remove friend request
- `changeLanguage` - Update translation language
- `changeAlwaysTranslate` - Toggle automatic translation
- `changeSummarizationFormat` - Update summary format

#### **ChatSlice** (`src/store/slices/ChatSlice.js`)
Manages friends list and chat messages.

**State:**
- `friends` - Array of friend objects with online status
- `chats` - Array of message objects
- `pending` - Loading state

**Friend Object Structure:**
```javascript
{
  uid: string,
  username: string,
  profile: string (avatar URL),
  online: boolean,
  email: string
}
```

**Message Object Structure:**
```javascript
{
  _id: ObjectId,
  Sender_ID: string,
  Receiver_ID: string,
  text: string,
  type: "text" | "image",
  seen: boolean,
  createdAt: timestamp,
  translatedText: [{ language: string, translatedText: string }]
}
```

**Async Thunks:**
- `fetchFriends` - GET `/api/chat/getFriends`
- `fetchChats` - GET `/api/chat/`

**Key Actions:**
- `addChat` - Add new message to state
- `addFriend` - Add friend to friends list
- `setFriendOnline/Offline` - Update friend status
- `setSeenMessages` - Mark messages as read
- `setMultipleTranslatedMessages` - Add batch translations
- `setSingleTranslatedMessage` - Add single translation

#### **CallSlice** (`src/store/slices/CallSlice.js`)
Manages video call state.

**State:**
- `incomingCall` - Incoming call object
- `onCall` - Current call status
- `callType` - "incomingvideo" or "outgoingvideo"
- `caller` - Caller information

**Key Actions:**
- `initializeVideoCall` - Start new call
- `cancelVideoCall` - End call

#### **ThemeSlice** (`src/store/slices/ThemeSlice.js`)
Manages UI theme preferences.

**State:**
- `themeColor` - Primary accent color
- `themeMode` - "white" (light) or "black" (dark)
- `colors` - Color palette with RGB values

**Key Actions:**
- `setThemeColor` - Update accent color
- `setThemeMode` - Toggle light/dark mode

#### **AIChatBotSlice** (`src/store/slices/AIChatBotSlice.js`)
Manages AI chatbot conversation history.

**State:**
- `messages` - Array of chatbot messages
- `loading` - Loading indicator

#### **UISlice** (`src/store/slices/UISlice.js`)
Manages general UI state.

**State:**
- `warningmsg` - Warning notification message
- `openedchat` - Currently opened chat window UID

---

## 🔌 WebSocket Events

All Socket.IO events are namespaced with descriptive prefixes for organization.

### User Management Events

#### Emit (Client → Server)
```javascript
socket.emit("user:connection", { username, profile, uid, settings }, callback)
// Establishes user connection with settings

socket.emit("user:finduser", uid, callback)
// Search for users to add as friends
// Returns: Array of user objects

socket.emit("user:sendchatrequest", fromuid, touid, callback)
// Send friend request to user
// Returns: Request confirmation

socket.emit("user:requestanswer", { fromuid, touid, answer, tousername }, callback)
// Respond to friend request (accept/reject)
// answer: "accept" | "reject"
```

#### Listen (Server → Client)
```javascript
socket.on("requestfromuser", ({ uid, profile, username }))
// Incoming friend request notification

socket.on("successmessage", ({ msg, user }))
// Friend request accepted notification

socket.on("errormessage", (message))
// Error notification

socket.on("friendonline", ({ uid }))
// Friend came online

socket.on("friendoffline", ({ uid }))
// Friend went offline
```

### Chat Events

#### Emit (Client → Server)
```javascript
socket.emit("chat:sendmessage", { fromuid, touid, message, type }, callback)
// Send message to friend
// type: "text" | "image"
// Returns: Message object with _id

socket.emit("chat:seenmessages", { fromuid, touid })
// Mark messages as read
```

#### Listen (Server → Client)
```javascript
socket.on("chat:receivemessage", (newChat))
// Receive new message from friend
// Payload: Full message object

socket.on("seenmessages", ({ uid }))
// Notification that friend read messages
```

### Video Call Events

#### Emit (Client → Server)
```javascript
socket.emit("call:videocalloutgoing", { fromuid, touid })
// Initiate outgoing video call

socket.emit("call:videocallcanceled", { touid })
// Cancel call

socket.emit("call:videocallringing", { fromuid })
// Send ringing signal from receiver
```

#### Listen (Server → Client)
```javascript
socket.on("call:videocallincoming", ({ fromuid }))
// Receive incoming call notification

socket.on("call:videocallcanceled")
// Call was canceled

socket.on("call:videocallringing")
// Receiver's ringing response
```

### AI Features Events

#### Emit (Client → Server)
```javascript
socket.emit("ai:chatbot:fromclient", { message, uid, tone }, callback)
// Send message to AI chatbot
// tone: Response tone preference
// Returns: AI response

socket.emit("ai:summarization", { conversation, format }, callback)
// Summarize conversation
// format: "paragraph" | "bullet" | "structured"
// Returns: Summary object

socket.emit("ai:translate:single-message", { id, text, to }, callback)
// Translate single message
// to: Target language (lowercase)
// Returns: { translatedText, language }

socket.emit("ai:translate:multiple-messages", { messages, to }, fromuid)
// Batch translate messages
// messages: [{ id, text }]
// Returns via: socket.on("ai:translated:multiple-messages")

socket.emit("ai:image-analyze", { url }, callback)
// Generate AI description for image
// Returns: Image description object
```

#### Listen (Server → Client)
```javascript
socket.on("ai:translated:multiple-messages", (data))
// Batch translation results
// Payload: { messages: [{ id, translatedText }], language }
```

### Settings Events

#### Emit (Client → Server)
```javascript
socket.emit("settings:translate:languageChange", { authtoken, language })
// Update user translation language

socket.emit("settings:translate:alwaysTranslateChange", { authtoken, alwaysTranslate })
// Update auto-translate preference

socket.emit("settings:summarization:formatChange", { authtoken, format })
// Update summarization format
```

---

## 🔗 APIs

All APIs use JWT authentication via `authtoken` header.

### Authentication Endpoints

#### Sign Up
```
POST /api/auth/signup
Content-Type: multipart/form-data

Parameters:
- fullname: string
- username: string
- email: string
- password: string
- dob: date
- profile: File (image)

Response:
{
  "success": true,
  "authtoken": "jwt-token",
  "uid": "user-id"
}
```

#### Sign In
```
POST /api/auth/signin
Content-Type: application/x-www-form-urlencoded

Parameters:
- email: string
- password: string

Response:
{
  "success": true,
  "authtoken": "jwt-token",
  "uid": "user-id",
  "username": string,
  "fullname": { firstname, lastname },
  "email": string,
  "dob": date,
  "profile": string (image URL),
  "settings": { translation: {...}, summarization: {...} }
}
```

#### Get User (Auto-login)
```
POST /api/auth/getuser
Headers:
- authtoken: "jwt-token"

Response:
{
  "success": true,
  "user": { uid, username, fullname, email, dob, profile, settings }
}
```

### Chat Endpoints

#### Get Friends & Messages
```
GET /api/chat/getFriends
Headers:
- authtoken: "jwt-token"

Response:
{
  "success": true,
  "friends": [
    { uid, username, profile, email, online }
  ],
  "chats": [
    { _id, Sender_ID, Receiver_ID, text, type, seen, createdAt, translatedText }
  ]
}
```

#### Get All Chats
```
GET /api/chat/
Headers:
- authtoken: "jwt-token"

Response:
{
  "success": true,
  "chats": [...]
}
```

### Base URL
```
VITE_API_SERVER_URL = http://localhost:5000 (development)
```

---

## 💾 Database

The backend uses a NoSQL database (implied MongoDB structure from code). Key collections:

### Users Collection
```javascript
{
  _id: ObjectId,
  uid: string (unique identifier),
  username: string (unique),
  email: string (unique),
  fullname: { firstname, lastname },
  password: string (hashed),
  dob: date,
  profile: string (profile image URL),
  settings: {
    translation: {
      language: string,
      alwaysTranslate: boolean
    },
    summarization: {
      format: "paragraph" | "bullet" | "structured"
    }
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Messages Collection
```javascript
{
  _id: ObjectId,
  Sender_ID: string,
  Receiver_ID: string,
  text: string,
  type: "text" | "image",
  seen: boolean,
  translatedText: [
    { language: string, translatedText: string }
  ],
  createdAt: timestamp
}
```

### Friends Collection
```javascript
{
  _id: ObjectId,
  User_ID: string,
  Friend_ID: string,
  status: "pending" | "accepted",
  createdAt: timestamp
}
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 16+ and npm
- Agora account with App ID (for video calling)
- Syncfusion license key (for image editor)
- Backend server running on `http://localhost:5000`

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/Yashwant937363/Gossip_App.git
cd Gossip_App
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Create .env.development file
cp .env.development .env.local
```

Update `.env.development` with your credentials:
```
VITE_API_SERVER_URL = http://localhost:5000
VITE_AGORA_APP_ID = your-agora-app-id
VITE_EDITOR_LICENSE_KEY = your-syncfusion-license-key
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 📦 Available Scripts

### Development
```bash
npm run dev
# Start Vite dev server with --host flag for network access
```

### Production Build
```bash
npm run build
# Compile React with Vite (output in dist/)
```

### Linting
```bash
npm run lint
# Run ESLint with React plugin
# Fails on warnings (--max-warnings 0)
```

### Preview Built App
```bash
npm run preview
# Preview production build locally
```

---

## 🌐 Deployment

### Current Deployment
The app is deployed on **Render.com**:
- **Live URL**: https://gossip-app-dz7b.onrender.com/

### Deployment Configuration

The app is configured with a proxy for API calls:
```json
"proxy": "http://localhost:5000/"
```

### Build for Production

1. **Build the app**
```bash
npm run build
```

2. **The `dist/` folder contains**
   - Optimized JavaScript bundles
   - CSS files
   - Static assets
   - index.html entry point

3. **Deploy to Render, Vercel, Netlify, etc.**
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Set environment variables on the platform
   - Ensure backend API is accessible from the deployed URL

### Environment Configuration for Production
Update `VITE_API_SERVER_URL` to your production backend URL before building.

---

## 🔐 Authentication Flow

1. User signs up/signs in via email
2. Backend validates credentials and generates JWT token
3. Token stored in browser cookies (expires in 365 days)
4. Token sent in `authtoken` header with every API request
5. On app load, `getUser` thunk attempts auto-login using stored token
6. Socket connection established only after successful authentication

---

## 🎨 Theming System

The app uses CSS custom properties for dynamic theming:

```css
--theme-mode      /* "white" or "black" */
--theme-color     /* Accent color hex */
--opposite-theme-mode /* Inverted theme mode */
--rgb-accent      /* RGB values of accent */
--rgb-background  /* RGB values of background */
--rgb-color       /* RGB values of text color */
```

Theme preferences are stored in browser cookies and persisted across sessions.

---

## 📝 Key Components

### Chat Flow Components
- **Chat.jsx** - Chat list and navigation
- **ChatWindow** - Message display and input
- **ChatContainer** - Scrollable message list
- **Received.jsx** - Message rendering with translation UI

### Real-time Features
- **VideoCall.jsx** - Video call UI with Agora integration
- **ChatBot.jsx** - AI assistant interface
- **ChatDate.jsx** - Conversation summarization trigger

### Settings Flow
- **Settings.jsx** - Settings layout
- **Profile.jsx** - User profile management
- **Themes.jsx** - Theme customization
- **AISettings.jsx** - AI feature configuration

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📞 Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Contact the maintainer

---

**Last Updated:** April 2025  
**Version:** 2.0.0
