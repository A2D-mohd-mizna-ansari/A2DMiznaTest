import React, { useState, useRef, useEffect } from "react";

const TruecallerLogin = () => {
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);

  // Helper to add a timestamped log message to the div
  const addLog = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `${timestamp} → ${msg}`]);
  };

  // Auto scroll to bottom on new logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const isAndroidChrome = () => {
    const ua = navigator.userAgent;
    const isAndroid = /Android/.test(ua);
    const isChrome = /Chrome/.test(ua);
    addLog(`Checking user agent: ${ua}`);
    addLog(`isAndroid: ${isAndroid}, isChrome: ${isChrome}`);
    return isAndroid && isChrome;
  };

  const generateNonce = () => {
    const nonce = crypto.randomUUID();
    addLog(`Generated nonce: ${nonce}`);
    return nonce;
  };

  const handleLogin = () => {
    addLog("Login button clicked");
    if (!isAndroidChrome()) {
      addLog("Not Android Chrome — login not supported");
      return;
    }
    const requestNonce = generateNonce();
    const partnerKey = "NdYnR43e796fb8a024fa697e2bed406d6e82f";
    const redirectUri = "https://a2-d-mizna-test.vercel.app/truecaller/callback";

    const url = `https://api4.truecaller.com/v1/auth?requestNonce=${requestNonce}&partnerKey=${partnerKey}&redirectUri=${encodeURIComponent(
      redirectUri
    )}`;
    addLog(`Redirecting to Truecaller API URL: ${url}`);
    window.location.href = url;
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "auto" }}>
      <h2>Login with Truecaller</h2>
      {isAndroidChrome() ? (
        <button
          onClick={handleLogin}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          Login with Truecaller
        </button>
      ) : (
        <p style={{ color: "red" }}>
          Truecaller login is only available on Android Chrome with the
          Truecaller app installed.
        </p>
      )}

      <div
        ref={logRef}
        style={{
          marginTop: "2rem",
          padding: "1rem",
          height: "250px",
          width: "100%",
          backgroundColor: "#111",
          color: "#eee",
          fontFamily: "monospace",
          fontSize: "12px",
          borderRadius: "8px",
          overflowY: "auto",
          whiteSpace: "pre-wrap",
        }}
      >
        <strong>Debug Logs:</strong>
        <br />
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default TruecallerLogin;
