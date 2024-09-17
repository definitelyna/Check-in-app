import { useEffect } from 'react'
import { QrReader } from 'react-qr-reader'

export default function QrReaderComponent(prop) {
  useEffect(() => {
    navigator.permissions.query({ name: 'camera' }).then((permissionStatus) => {
      if (permissionStatus.state === 'granted') {
        console.log('Camera access already granted.')
      } else if (permissionStatus.state === 'prompt') {
        console.log('Requesting camera access.')
      } else {
        console.log('Camera access denied.')
      }

      permissionStatus.onchange = () => {
        console.log('Permission status changed:', permissionStatus.state)
      }
    })
  }, [])

  const tickAttendance = (checkInID) => {
    prop.setRows((prevArray) =>
      prevArray.map((obj) => {
        if (obj._id == checkInID) {
          const updatedObj = {
            ...obj,
            hasArrived: true // Adjust value based on referenceProperty
          }
          
          prop.updateAPI(updatedObj); // Uncomment when you want to call the API to update the backend
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
    <div>
      <h1>QR Code Scanner</h1>
      <QrReader onResult={handleScan} facingMode="environment" style={{ width: '100%' }} />
    </div>
  )
}
