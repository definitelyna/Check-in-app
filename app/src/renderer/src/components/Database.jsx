import Box from '@mui/material/Box'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { useState, useEffect } from 'react'
import style from './Database.module.css'
import ImportFiles from './ImportFiles'
import DeleteDatabase from './DeleteDatabase'

const columns = [
  { field: '_id', type: 'number', headerName: 'STT', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true
  },
  {
    field: 'address',
    headerName: 'Address',
    width: 150,
    editable: true
  },
  {
    field: 'phoneNumber',
    headerName: 'Phone No.',
    width: 150,
    editable: true,
    type: 'String'
  },

  {
    field: 'size',
    headerName: 'Size',
    editable: true,
    type: 'String'
  },

  {
    field: 'attended',
    headerName: 'Attended ?',
    editable: true,
    type: 'boolean'
  },
  {
    field: 'timeEntered',
    headerName: 'Time checked-in',
    width: 130,
    editable: true
  }
]

export default function Database() {
  const [rows, setRows] = useState([])

  // function sortArrayOfObjectByProperty(arr, property) {
  //   const sortedArray = arr.sort((a, b) => {
  //     if (a[property] < b[property]) {
  //       return -1
  //     }
  //     if (a[property] > b[property]) {
  //       return 1
  //     }
  //     return 0 // if equal
  //   })
  //   return sortedArray
  // }

  const getAPI = async () => {
    try {
      const response = await fetch('https://check-in-app.onrender.com/api/attendees')
      // Handle the response
      const result = await response.json() // Parse the response as JSON
      console.log('Success:', result)

      setRows(result)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    fetch('https://check-in-app.onrender.com/api/attendees') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => setRows(data))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowClassName={(params) => (params.row.attended ? style.highlightedRow : '')} // Apply class based on boolean value
        getRowId={(row) => row._id}
        disableRowSelectionOnClick
        pageSize={5}
        rowsPerPageOptions={[400]}
        initialState={{
          sorting: {
            sortModel: [{ field: '_id', sort: 'asc' }]
          }
        }}
        sx={{
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
            outline: 'none'
          },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
            outline: 'none'
          },
          [`& .${gridClasses.columnHeader}:hover`]: {}
        }}
      />

      <div className={style.operationWrap}>
        <ImportFiles updateDatabase={() => getAPI()} />
        <DeleteDatabase updateDatabase={() => getAPI()} />
        <pre>{JSON.stringify(rows, null, 2)}</pre>
      </div>
    </Box>
  )
}
