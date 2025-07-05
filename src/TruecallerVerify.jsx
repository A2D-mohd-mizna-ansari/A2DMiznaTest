import { useState, useEffect, useRef } from "react";

const TruecallerVerify = () => {
    const [status, setStatus] = useState("");
    const [logs, setLogs] = useState([]);
    const logRef = useRef(null);
    const requestNonce = useRef("req_" + Date.now());

    const addLog = (msg) => {
        setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} → ${msg}`]);
        setTimeout(() => {
            if (logRef.current) {
                logRef.current.scrollTop = logRef.current.scrollHeight;
            }
        }, 10);
    };

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
        addLog("🔍 handleVerifyClick initiated");

        const nonce = requestNonce.current;
        addLog(`🔑 Generated nonce: ${nonce}`);
        setStatus("Starting Truecaller verification...");
        addLog("ℹ️ Status set to: Starting Truecaller verification...");

        const deepLink = `truecallersdk://truesdk/web_verify?...`; // same as before, omitted for brevity
        addLog("🔗 Truecaller deep link: " + deepLink);

        let fallbackTriggered = false;
        let pollInterval;

        const callCallbackAPI = async () => {
            addLog("📞 callCallbackAPI triggered");
            const bodyPayload = {
                requestNonce: nonce,
                verified: true,
                data: {
                    phone: "+1234567890",
                    otherField: "value",
                },
            };

            addLog("⬆️ Sending POST to callback API: " + callbackUrl);
            addLog("📦 Payload: " + JSON.stringify(bodyPayload));

            try {
                const res = await fetch(callbackUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bodyPayload),
                });
                const result = await res.json();
                addLog("✅ Callback API response: " + JSON.stringify(result));
            } catch (err) {
                addLog("❌ Callback API error: " + err.message);
            }
        };

        const startPolling = () => {
            addLog("🔄 startPolling() initiated");
            setStatus("Truecaller app opened. Starting polling...");
            addLog("ℹ️ Status set: Truecaller app opened. Starting polling...");

            let attempts = 0;
            pollInterval = setInterval(async () => {
                attempts++;
                const pollUrl = `https://a2dmiznatest.onrender.com/verify-status?nonce=${nonce}`;
                addLog(`📡 Polling attempt #${attempts} to ${pollUrl}`);

                try {
                    const res = await fetch(pollUrl);
                    const result = await res.json();

                    addLog("📥 Poll response: " + JSON.stringify(result));

                    if (result.verified) {
                        clearInterval(pollInterval);
                        setStatus("✅ Number verified successfully!");
                        addLog("✅ Verification successful with data: " + JSON.stringify(result.data));
                    } else {
                        addLog("❓ Not yet verified.");
                        if (attempts >= 10) {
                            clearInterval(pollInterval);
                            setStatus("❌ Timed out. Try again.");
                            addLog("🛑 Polling stopped after 10 attempts.");
                        }
                    }
                } catch (err) {
                    clearInterval(pollInterval);
                    setStatus("⚠️ Error while checking verification.");
                    addLog("❌ Polling error: " + err.message);
                }
            }, 3000);
        };

        const cancelFallback = () => {
            if (!fallbackTriggered) {
                fallbackTriggered = true;
                clearTimeout(fallbackTimer);
                if (pollInterval) clearInterval(pollInterval);
                addLog("⚠️ Fallback canceled, starting polling instead.");
                startPolling();
            }
        };

        const onVisibilityChange = () => {
            addLog("📱 visibilitychange → Document hidden");
            cancelFallback();
        };
        const onBlur = () => {
            addLog("📱 blur → Window lost focus.");
            cancelFallback();
        };
        const onPageHide = () => {
            addLog("📱 pagehide → Page hidden.");
            cancelFallback();
        };

        addLog("📎 Adding event listeners for fallback detection");
        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener("blur", onBlur);
        window.addEventListener("pagehide", onPageHide);

        addLog("🚀 Launching Truecaller via deep link...");
        window.location.href = deepLink;

        await callCallbackAPI();

        const fallbackTimer = setTimeout(() => {
            if (!fallbackTriggered) {
                fallbackTriggered = true;
                setStatus("Redirecting to fallback...");
                addLog("⏳ App not opened → Redirecting to fallback URL.");
                window.location.href = callbackUrl + "?fallback=true";
            }
        }, 3000);

        useEffect(() => {
            addLog("🧹 Component mounted, cleanup registered");

            return () => {
                addLog("🧹 Cleaning up event listeners and intervals");
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
                    height: "300px",
                    width: "100%",
                    maxWidth: "450px",
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
        </div>
    );
};

export default TruecallerVerify;

