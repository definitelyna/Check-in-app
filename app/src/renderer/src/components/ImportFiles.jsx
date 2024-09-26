import Papa from 'papaparse'

const mapDataKeyToDatabaseKey = {
  'STT': '_id',
  'HỌ VÀ TÊN': 'name',
  'ĐỊA CHỈ': 'address',
  'ĐƠN VỊ/ CÔNG TY/ HỘI/ HIỆP HỘI/ CLB': 'group',
  'ĐIỆN THOẠI': 'phoneNumber'
}

export default function ImportFiles(prop) {
  const applyChangeToKeys = (obj) => {
    return Object.keys(obj).reduce((newObj, key) => {
      newObj[mapDataKeyToDatabaseKey[key]] = obj[key]

      return newObj
    }, {})
  }

  const adjustDataToAPI = (thisArrayOfObject) => {
    return thisArrayOfObject.map((eachObj) => applyChangeToKeys(eachObj))
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]

    if (file) {
      Papa.parse(file, {
        header: true, // Set to false if your CSV doesn't have headers
        skipEmptyLines: true,
        complete: async (result) => {
          const adjustedResult = adjustDataToAPI(result.data)
          await prop.postAPI(adjustedResult)
          await prop.updateDatabase()
        },
        error: () => {}
      })
    }

    e.target.value = null
  }

  return (
    <>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </>
  )
}
