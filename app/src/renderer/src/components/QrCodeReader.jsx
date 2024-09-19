import { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'
import style from "./QrCodeReader.module.css"
import dayjs from 'dayjs'


export default function QrCodeReader(prop) {
  const [hasCameraAccess, setHasCameraAccess] = useState(false)
  useEffect(() => {
    navigator.permissions.query({ name: 'camera' }).then((permissionStatus) => {
      if (permissionStatus.state === 'granted') {
        console.log('Camera access already granted.')
        setHasCameraAccess(true)
      } else if (permissionStatus.state === 'prompt') {
        console.log('Requesting camera access.')
        setHasCameraAccess(false)
      } else {
        console.log('Camera access denied.')
        setHasCameraAccess(false)
      }

      permissionStatus.onchange = () => {
        console.log('Permission status changed:', permissionStatus.state)
      }
    })
  }, [])

  const tickAttendance = (checkInID) => {
    const currentTime = dayjs().format('HH:mm');

    prop.setRows((prevArray) =>
      prevArray.map((obj) => {
        if (obj._id == checkInID) {
          const updatedObj = {
            ...obj,
            hasArrived: true, // Adjust value based on referenceProperty
            arrivalTime: currentTime
          }

          prop.updateAPI(updatedObj) // Uncomment when you want to call the API to update the backend
          return updatedObj
        }
        return obj // Return the object unchanged if the ID doesn't match
      })
    )

    // Use a callback here to ensure we get the latest state after setRows
  }

  const handleScan = (data) => {
    if (data) {
      const checkInID = data.text.split('Attendee')[1]
      prop.setWebCamResult(checkInID)
      tickAttendance(checkInID)
    }
  }

  return (
    <>
      <h1>QR Code Scanner</h1>
      {hasCameraAccess && (
        <QrReader onResult={handleScan} facingMode="environment" classNam={style.qrReaderWrap} />
      )}
    </>
  )
}
