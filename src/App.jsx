import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LocationTest from './LocationTest'
import Permission from './components/homepage/Permission'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/a" element={<LocationTest />} />
          <Route
            path="/b"
            element={
              <Permission
                permissionsGranted={{ location: false, notification: false }} // 👈 Example values
                isInstalled={false}
                onInstallClick={() => console.log("Install clicked")}
                isCameraPermitted={false}
                handleCameraPermission={() => console.log("Camera permission")}
                handlePermissionsCanvasClose={() => console.log("Close permission canvas")}
                setUserPos={(pos) => console.log("User position:", pos)}
              />
            }
          />

        </Routes>
      </Router>
    </>
  )
}

export default App
