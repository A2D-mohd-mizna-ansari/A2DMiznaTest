import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import LocationTest from './LocationTest';
import Permission from './components/homepage/Permission';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NotificationComponent from './components/OneSignal';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        {/* ✅ Navbar */}
        <nav style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#f0f0f0',
          borderBottom: '1px solid #ccc'
        }}>
          <Link to="/a">Location Test</Link>
          <Link to="/b">Ekmc Clone Permissions</Link>
          <Link to="/c">One Signal</Link>
        </nav>

        {/* ✅ Routes */}
        <Routes>
          <Route path="/a" element={<LocationTest />} />
          <Route path="/c" element={<NotificationComponent />} />
          <Route
            path="/b"
            element={
              <Permission
                  permissionsGranted={{ location: false, notification: false }}Add commentMore actions
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
  );
}

export default App;
