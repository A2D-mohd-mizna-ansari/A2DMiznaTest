import { useEffect, useState } from "react"
import allowedCheck from "../../assets/allowed-check.svg"
import locationIcon from "../../assets/location.svg"
import downloadIcon from "../../assets/download-icon.svg"
import homePageVideo from "../../assets/homePageVideo.mp4"

function Permission({
   permissionsGranted,
   isInstalled,
   onInstallClick,
   isCameraPermitted,
   handleCameraPermission,
   handlePermissionsCanvasClose,
   setUserPos
}) {
   // const [isCameraPermitted, setIsCameraPermitted] = useState(isCameraPermitted);
   const [isNotificationsPermitted, setIsNotificationsPermitted] = useState(permissionsGranted.notification ? true : false)
   const [isLocationPermitted, setIsLocationPermitted] = useState(permissionsGranted.location ? true : false)

   useEffect(() => {
      if (permissionsGranted.location) {
         // askLocationPermission()
         setIsLocationPermitted(true)
      } else {
         setIsLocationPermitted(false)
      }
   }, [permissionsGranted])
   const askCameraPermission = () => {
      handleCameraPermission()
   }

   const askLocationPermission = () => {
      if (navigator.geolocation) {
         try {
            navigator.geolocation.watchPosition(
               (pos) => {
                  let currPos = {
                     latitude: pos.coords.latitude,
                     longitude: pos.coords.longitude
                  }

                  if (setUserPos) {
                     setUserPos(currPos)
                  }

                  window.sessionStorage.setItem("MyEatsUserPosition", JSON.stringify(currPos))

                  setIsLocationPermitted(true)

                  if (isCameraPermitted) {
                     handlePermissionsCanvasClose()
                     window.location.reload()
                  }
               },
               (err) => {
                  setIsLocationPermitted(false)
                  if (err.code === 1) {
                     alert("Location permission denied. Please enable it in your settings.")
                  }
               },
               { enableHighAccuracy: true }
            )
         } catch (error) {
            console.error("Safari Geolocation error:", error)
         }
      } else {
         console.error("Geolocation is not supported by this browser.")
      }
   }

   // const askNotificationPermission = () => {
   //    let isPermitted = false
   //    console.log("called")
   //    try {
   //       OneSignal.init({
   //          appId: import.meta.env.VITE_ONESIGNAL_APP_ID
   //       }).then((res) => {
   //          isPermitted = true
   //          console.log(res)
   //          console.log("noti", isPermitted)
   //          setIsNotificationsPermitted(true)

   //          if (isCameraPermitted && isLocationPermitted && isPermitted) {
   //             handlePermissionsCanvasClose();
   //             window.location.reload();
   //          }
   //          OneSignal.User.PushSubscription.addEventListener("change", function (event) {
   //             if (event.current.id) {
   //                window.sessionStorage.setItem(`sub_id`, JSON.stringify(event.current.id))
   //             }
   //          })
   //       })
   //    } catch (error) {
   //       console.log(error)
   //    }
   // }

   return (
      <div className="permit-canvass" style={{ zIndex: "99999" }}>
         <div className="text-center">
            <video autoPlay={true} height="auto" width="100%" loop={true} muted={true} playsInline={true}>
               <source src={homePageVideo} type="video/mp4" />
               <p>Your browser doesn't support HTML video. Here is a</p>
            </video>
         </div>

         <h4 className="fw-semibold  m-4">
            We need your permission to start accepting your order—please allow it from the browser popup after clicking on Allow button below.
         </h4>

         <div className="permission-btn-grp m-4  justify-content-space-around px-3 d-flex flex-column">

            <div className="d-flex align-items-center justify-content-between mt-t-1 gap-2">
               <div className="d-flex  gap-2 ">
                  {" "}
                  <img className="mb-auto" src={locationIcon} alt="" />
                  <div className="permission-btn-des ">
                     <h5 className="fw-semibold">Location</h5>
                     <p className="text-light">To verify that you are physically available on the restaurant.</p>
                  </div>
               </div>

               {isLocationPermitted ? (
                  <button className="btn rounded-3 py-2 px-4" style={{ backgroundColor: "#D0D0D0" }} disabled={true}>
                     <img src={allowedCheck} alt="" />
                  </button>
               ) : (
                  <button className="btn btn-primary text-white rounded-3 py-2 px-4" onClick={askLocationPermission}>
                     Allow
                  </button>
               )}
            </div>
         </div>
         <hr style={{ border: "1px solid #EAEAEA" }} />
         {isInstalled ? null : (
            <div className="d-grid mx-4 h-100" style={{ marginTop: "auto" }}>
               <p className="text-light permission-bottom-para">
                  Get the full MyEatsapp experience—download our mobile app for seamless ordering and exclusive offers!
               </p>
               <button className="btn text-white btn-primary d-flex justify-content-between w-100 rounded-3  px-3 py-3" onClick={onInstallClick}>
                  <h5 className="m-0 fw-semibold">Install MyEatsApp to discover more</h5>
                  <img src={downloadIcon} alt="" />
               </button>
            </div>
         )}

         <div className="d-flex justify-content-between text-light mt-3 mx-4 mb-4">
            <div className="small">© 2024 A2D Eats Pvt. Ltd.</div>
            <a className="small" href="https://a2deats.com/privacy-policy/" target="_blank">Privacy Policy</a>
            <a className="small" href="https://a2deats.com/terms-and-conditions/" target="_blank">Term & Conditions</a>
         </div>
      </div>
   )
}

export default Permission
