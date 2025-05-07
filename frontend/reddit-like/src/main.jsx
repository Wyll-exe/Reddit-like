import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.jsx'

import { createClient } from '@liveblocks/client'
import { LiveblocksProvider, RoomProvider } from '@liveblocks/react'


const client = createClient({
  publicApiKey: "",
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LiveblocksProvider client={client}>
      <RoomProvider id="react-whiteboard-1">
        <App />
      </RoomProvider>
    </LiveblocksProvider>

  </StrictMode>,
)
