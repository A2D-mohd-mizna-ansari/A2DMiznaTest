// OneSignalComponent.jsx
import React, { useEffect } from "react";

const OneSignalComponent = () => {
  useEffect(() => {
    // Wait until window.OneSignal is available
    const initOneSignal = () => {
      window.OneSignal = window.OneSignal || [];

      window.OneSignal.push(() => {
        window.OneSignal.init({
          appId: "06907524-9d59-48d3-aaac-078e174f07bd",
          notifyButton: { enable: true },
          allowLocalhostAsSecureOrigin: true,
        });

        // ✅ Show prompt after init
        window.OneSignal.showSlidedownPrompt();
      });
    };

    initOneSignal();

    // Fake push every 30 seconds using global SDK
    const intervalId = setInterval(() => {
      if (window.OneSignal?.sendSelfNotification) {
        window.OneSignal.sendSelfNotification(
          "🚀 New Message",
          "This is a simulated notification every 30 seconds.",
          "https://a2-d-mizna-test.vercel.app",
          "https://cdn-icons-png.flaticon.com/512/1827/1827504.png"
        );
      } else {
        console.warn("sendSelfNotification not available yet.");
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>🔔 OneSignal Global SDK Demo</h2>
      <p>You'll see a notification every 30 seconds if permission is granted.</p>
    </div>
  );
};

export default OneSignalComponent;
