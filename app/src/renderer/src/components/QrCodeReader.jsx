import { useEffect } from 'react'
import dayjs from 'dayjs'

export default function QrCodeReader(prop) {
  const handleEnterPressed = (data) => {
    const checkInID = data.split('attendee')[1]
    prop.setIdJustCheckedIn(checkInID)
    tickAttendance(checkInID)
  }

  function matchWord(referenceString) {
    let currentWord = ''

    setInterval(() => {
      currentWord = ''
    }, 1000)

    return function (inputChar) {
      currentWord += inputChar

      // Check if the current input matches the start of the reference string
      if (currentWord.length < referenceString.length) {
        if (referenceString.startsWith(currentWord)) {
          console.log(`Building word: ${currentWord}`)
        } else {
          console.log(`No match. Resetting...`)
          currentWord = '' // Reset if there's no match
        }
      } else {
        console.log(currentWord)
        if (currentWord.includes('Enter')) {
          const removedEnterWord = currentWord.replace('Enter', '')

          console.log(`Code: ${removedEnterWord}`)
          handleEnterPressed(removedEnterWord)
          currentWord = '' // Reset after a match
        }
      }
    }
  }

  const referenceString = 'checkinattendee'
  const checkWord = matchWord(referenceString)

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyPressed = event.key
      checkWord(keyPressed)
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const tickAttendance = (checkInID) => {
    const currentTime = dayjs().format('HH:mm')

    prop.setRows((prevArray) =>
      prevArray.map((obj) => {
        if (obj._id == checkInID) {
          const updatedObj = {
            ...obj,
            hasArrived: true, // Adjust value based on referenceProperty
            arrivalTime: currentTime
          }

          // console.log(updatedObj)
          prop.updateAPI(updatedObj)
          return updatedObj
        }
        return obj // Return the object unchanged if the ID doesn't match
      })
    )

    // Use a callback here to ensure we get the latest state after setRows
  }

  return (
    <>

    </>
  )
}
