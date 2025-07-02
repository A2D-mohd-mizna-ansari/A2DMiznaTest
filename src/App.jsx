import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import LocationTest from './LocationTest';
import Permission from './components/homepage/Permission';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OneSignalComponent from './components/OneSignal';

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
        </nav>

        {/* ✅ Routes */}
        <Routes>
          <Route path="/a" element={<LocationTest />} />
          <Route path="/c" element={<OneSignalComponent />} />
          <Route
            path="/b"
            element={
              <Permission
                permissionsGranted={permissionsGranted}
                isInstalled={isInstalled}
                 onInstallClick={() => {
                     const platform = detectPlatform()
                     const urls = {
                        android: import.meta.env.VITE_ANDROID_APP_URL,
                        ios: import.meta.env.VITE_IOS_APP_URL
                     }
                     if (platform !== "web") {
                        window.location.href = urls[platform]
                     }
                  }}
                isCameraPermitted={true}
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
