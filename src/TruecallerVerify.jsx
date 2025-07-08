import { useState, useEffect, useRef } from "react";

const TruecallerVerify = () => {

const [apiLogs, setApiLogs] = useState([]);
useEffect(() => {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const [url, options] = args;

    try {
      const response = await originalFetch(...args);
      const clonedResponse = response.clone();

      let data;
      try {
        data = await clonedResponse.json();
      } catch (e) {
        data = await clonedResponse.text(); // fallback if not JSON
      }

      const method =
        options?.method?.toUpperCase() || (options?.body ? "POST" : "GET");

      setApiLogs(prev => [
        ...prev,
        {
          url,
          method,
          status: response.status,
          response: data,
        },
      ]);

      return response;
    } catch (err) {
      const method =
        options?.method?.toUpperCase() || (options?.body ? "POST" : "GET");

      setApiLogs(prev => [
        ...prev,
        {
          url,
          method,
          error: err.message,
        },
      ]);
      throw err;
    }
  };

  return () => {
    window.fetch = originalFetch; // restore on cleanup
  };
}, []);


  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);
  const requestNonce = useRef("req_" + Date.now());

  // Add logs into the debug box
  const addLog = (msg) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} → ${msg}`]);
    // Auto scroll to bottom
    setTimeout(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 10);
  };

  // Intercept console messages to also add them to logs div
  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      addLog("LOG: " + args.map(String).join(" "));
      originalLog(...args);
    };
    console.warn = (...args) => {
      addLog("WARN: " + args.map(String).join(" "));
      originalWarn(...args);
    };
    console.error = (...args) => {
      addLog("ERROR: " + args.map(String).join(" "));
      originalError(...args);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const partnerKey = "NdYnR43e796fb8a024fa697e2bed406d6e82f";
  const partnerName = "Test";
  const privacyUrl = "https://a2-d-mizna-test.vercel.app/privacy";
  const termsUrl = "https://a2-d-mizna-test.vercel.app/terms";
  const callbackUrl = "https://a2dmiznatest.onrender.com/truecaller/callback";

  const handleVerifyClick = async () => {
    const nonce = requestNonce.current;
    addLog(`🔑 Generated nonce: ${nonce}`);
    setStatus("Starting Truecaller verification...");

    const deepLink = `truecallersdk://truesdk/web_verify?type=btmsheet&requestNonce=${encodeURIComponent(
      nonce
    )}&partnerKey=${encodeURIComponent(partnerKey)}&partnerName=${encodeURIComponent(
      partnerName
    )}&lang=en&privacyUrl=${encodeURIComponent(
      privacyUrl
    )}&termsUrl=${encodeURIComponent(
      termsUrl
    )}&loginPrefix=Verify%20with%20Truecaller&ctaPrefix=Continue%20with%20Truecaller&ctaColor=%231e88e5&ctaTextColor=%23ffffff&btnShape=round&skipOption=Use%20another%20method&ttl=60000`;

    addLog("LOG: Redirecting to Truecaller deep link: " + deepLink);

    let fallbackTriggered = false;
    let pollInterval;

    // Call callback API first to simulate verification completed
    // (Your server expects this callback to mark the nonce as verified)

    const startPolling = () => {
      setStatus("Truecaller app opened. Starting polling...");
      addLog("✅ App opened, starting polling...");

      let attempts = 0;
      pollInterval = setInterval(async () => {
        attempts++;
        addLog(`📡 Polling attempt #${attempts} for nonce: ${nonce}`);

        try {
          const res = await fetch(
            `https://91tj1q3l-3000.inc1.devtunnels.ms/verify-status?nonce=${nonce}`
          );
          const result = await res.json();
          addLog("Poll response: " + JSON.stringify(result));

          if (result.verified) {
            clearInterval(pollInterval);
            console.log("✅ Verification success:", result.data);
            setStatus("✅ Number verified successfully!");
            addLog("✅ Verification success: " + JSON.stringify(result.data));
          } else {
            addLog("❓ Still not verified.");
            if (attempts >= 10) {
              clearInterval(pollInterval);
              setStatus("❌ Timed out. Try again.");
              addLog("❌ Polling ended after 10 attempts without success.");
            }
          }
        } catch (err) {
          clearInterval(pollInterval);
          console.error("Error during polling:", err);
          setStatus("⚠️ Error while checking verification.");
          addLog("⚠️ Polling error: " + err.message);
        }
      }, 3000);
    };

    const cancelFallback = () => {
      if (!fallbackTriggered) {
        fallbackTriggered = true;
        clearTimeout(fallbackTimer);
        if (pollInterval) clearInterval(pollInterval);

        startPolling();
      }
    };

    // Detect if app was opened by listening to visibility and focus events
    const onVisibilityChange = () => {
      if (document.hidden) {
        // addLog("📱 visibilitychange → Document hidden, assuming app opened.");
        cancelFallback();
      }
    };
    const onBlur = () => {
      // addLog("📱 blur → Window lost focus.");
      cancelFallback();
    };
    const onPageHide = () => {
      // addLog("📱 pagehide → Page hide event.");
      cancelFallback();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("pagehide", onPageHide);

    addLog("🚀 Redirecting to deep link...");
    window.location.href = deepLink;

    // Call callback API immediately after deep link redirect to simulate verification done

    const fallbackTimer = setTimeout(() => {
      if (!fallbackTriggered) {
        fallbackTriggered = true;
        addLog("⚠️ App not detected. Going to fallback.");
        setStatus("Redirecting to fallback...");
        // window.location.href = callbackUrl + "?fallback=true";
      }
    }, 3000);

    // Cleanup event listeners on unmount
    useEffect(() => {
      return () => {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.removeEventListener("blur", onBlur);
        window.removeEventListener("pagehide", onPageHide);
        clearInterval(pollInterval);
        clearTimeout(fallbackTimer);
      };
    }, []);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>📲 Verify with Truecaller</h1>
      <button
        style={{
          backgroundColor: "#1e88e5",
          color: "white",
          border: "none",
          padding: "1rem 2rem",
          fontSize: "1.2rem",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={handleVerifyClick}
      >
        Verify My Number
      </button>
      <div style={{ marginTop: "1rem", fontWeight: "bold" }}>{status}</div>

      <div
        ref={logRef}
        style={{
          marginTop: "2rem",
          padding: "1rem",
          height: "250px",
          width: "100%",
          maxWidth: "400px",
          overflowY: "scroll",
          backgroundColor: "#111",
          color: "#eee",
          fontFamily: "monospace",
          fontSize: "12px",
          borderRadius: "8px",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "left",
        }}
      >
        <strong>Debug Logs:</strong>
        <br />
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
        <button
          onClick={() => {
            navigator.clipboard.writeText(logs.join("\n")).then(() => {
              alert("✅ Logs copied to clipboard!");
            });
          }}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#444",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          📋 Copy Logs
        </button>
      </div>
      <div
  style={{
    marginTop: "2rem",
    padding: "1rem",
    height: "250px",
    width: "100%",
    maxWidth: "500px",
    overflowY: "scroll",
    backgroundColor: "#222",
    color: "#ddd",
    fontFamily: "monospace",
    fontSize: "12px",
    borderRadius: "8px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
  }}
>
  <strong>Debug API Logs:</strong>
  <br />
  {apiLogs.map((log, i) => (
    <div key={i} style={{ marginBottom: "0.5rem" }}>
      🔗 <strong>{log.method}</strong> {log.url}
      <br />
      {log.error ? (
        <span style={{ color: "red" }}>❌ Error: {log.error}</span>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {typeof log.response === "object"
            ? JSON.stringify(log.response, null, 2)
            : log.response}
        </pre>
      )}
      <hr />
    </div>
  ))}
</div>

    </div>
  );
};

export default TruecallerVerify;
