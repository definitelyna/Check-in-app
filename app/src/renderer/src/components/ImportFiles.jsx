import Papa from 'papaparse'

export default function ImportFiles(prop) {

  function camelize(str) {
    return (
      str.charAt(0).toLowerCase() +
      str
        .slice(1)
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
    )
  }

  const applyChangeToKeys = (obj, changeFunc) => {
    return Object.keys(obj).reduce((newObj, key) => {
      const newKey = changeFunc(key) // Apply the change to the key
      if (key === 'stt') {
        newObj['_id'] = obj[key]
      } else {
        newObj[newKey] = obj[key] // Assign the original value to the new key
      }

      return newObj
    }, {})
  }

  const adjustDataToAPI = (thisArrayOfObject) => {
    return thisArrayOfObject.map((eachObj) => applyChangeToKeys(eachObj, camelize))
  }

  const postAPI = async (data) => {
    try {
      const response = await fetch('https://check-in-app.onrender.com/api/attendees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convert data to JSON string
      })

      // Handle the response
      const result = await response.json() // Parse the response as JSON
      console.log('Success:', result)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]

    if (file) {
      Papa.parse(file, {
        header: true, // Set to false if your CSV doesn't have headers
        skipEmptyLines: true,
        complete: async (result) => {
          const adjustedResult = adjustDataToAPI(result.data)
          await postAPI(adjustedResult)
          await prop.updateDatabase()
        },
        error: () => {}
      })
    }

    e.target.value = null
  }

  return (
    <>
      <input type="file" accept=".csv" onChange={handleFileUpload}/>
    </>
  )
}
