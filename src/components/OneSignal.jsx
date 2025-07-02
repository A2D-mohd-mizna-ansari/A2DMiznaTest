import React, { useEffect } from "react";
import OneSignal from "react-onesignal";

const OneSignalComponent = () => {
  useEffect(() => {
    const initOneSignal = async () => {
      await OneSignal.init({
       appId: "06907524-9d59-48d3-aaac-078e174f07bd",
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
      });

      OneSignal.showSlidedownPrompt();
    };

    initOneSignal();

    // Push every 30 sec (fake for now)
    const intervalId = setInterval(() => {
      OneSignal.sendSelfNotification(
        "🚀 Hello!",
        "This is a demo message every 30 sec.",
        "https://a2-d-mizna-test.vercel.app",
        "https://cdn-icons-png.flaticon.com/512/1827/1827504.png"
      );
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>🔔 Push Notifications Demo</h2>
      <p>You'll see a notification every 30 seconds if permission is granted.</p>
    </div>
  );
};

export default OneSignalComponent;
