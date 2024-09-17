import Box from '@mui/material/Box'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { useState, useEffect } from 'react'
import style from './Database.module.css'
import ImportFiles from './ImportFiles'
import DeleteDatabase from './DeleteDatabase'
import { styled } from '@mui/system'
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup'
import { useGridApiRef, GridToolbar } from '@mui/x-data-grid'

function QRCode(props) {
  const [anchor, setAnchor] = useState(null)

  const handlePopupClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget)
  }

  const open = Boolean(anchor)
  const id = open ? 'simple-popup' : undefined

  return (
    <div>
      <Button aria-describedby={id} type="button" onClick={handlePopupClick}>
        Show
      </Button>
      <BasePopup id={id} open={open} anchor={anchor}>
        <PopupBody>
          <img src={props.value} />
        </PopupBody>
      </BasePopup>
    </div>
  )
}

const columns = [
  { field: '_id', type: 'number', headerName: 'STT' },
  {
    field: 'name',
    headerName: 'Name',
    editable: true
  },
  {
    field: 'address',
    headerName: 'Address',
    editable: true
  },
  {
    field: 'phoneNumber',
    headerName: 'Phone No.',
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
    editable: true
  },
  {
    field: 'qrCode',
    headerName: 'QR Code',
    renderCell: QRCode
  }
]

export default function Database() {
  const [rows, setRows] = useState([])
  const apiRef = useGridApiRef()
  const [isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {
    setIsLoading(true)
    fetch('https://check-in-app.onrender.com/api/attendees') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => setRows(data))
      .then(() => {
        apiRef.current.autosizeColumns()
        setIsLoading(false)
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  const handleOnCellEditStop = (e) => {}

  return (
    <Box sx={{ height: '90vh', width: '90%', marginInline: 'auto' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowClassName={(params) => (params.row.attended ? style.highlightedRow : '')} // Apply class based on boolean value
        getRowId={(row) => row._id}
        apiRef={apiRef}
        disableRowSelectionOnClick
        disableColumnSorting
        pageSize={5}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
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
        onCellEditStop={handleOnCellEditStop}
      />

      <div className={style.operationWrap}>
        {rows != [] ? (
          <ImportFiles updateDatabase={() => getAPI()} postAPI={() => postAPI()} />
        ) : (
          <div></div>
        )}
        <DeleteDatabase updateDatabase={() => getAPI()} />
      </div>
    </Box>
  )
}

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025'
}

const blue = {
  200: '#99CCFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0066CC'
}

const PopupBody = styled('div')(
  ({ theme }) => `
  width: max-content;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  box-shadow: ${
    theme.palette.mode === 'dark' ? `0px 4px 8px rgb(0 0 0 / 0.7)` : `0px 4px 8px rgb(0 0 0 / 0.1)`
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
`
)

const Button = styled('button')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: ${grey[900]};
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid ${grey[700]};

  &:hover {
    background-color: ${blue[600]};
  }

  &:active {
    background-color: ${blue[700]};
    box-shadow: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
    outline: none;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
    &:hover {
      background-color: ${blue[500]};
    }
  }
`
)
