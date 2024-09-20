import Box from '@mui/material/Box'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { useState, useEffect } from 'react'
import style from './Database.module.css'
import ImportFiles from './ImportFiles'
import DeleteDatabase from './DeleteDatabase'
import { styled } from '@mui/system'
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup'
import { useGridApiRef, GridToolbar } from '@mui/x-data-grid'
import QrCodeReader from './QrCodeReader'
import { ClickAwayListener } from '@mui/material'
import dayjs from 'dayjs'
import NotiModal from './NotiModal'

function QRCode(prop) {
  const [anchor, setAnchor] = useState(null)
  const [open, setOpen] = useState(false)

  const handlePopupClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget)
    setOpen((prev) => !prev)
  }

  const handleClickAway = () => {
    setOpen(false)
  }

  const id = open ? 'simple-popup' : undefined

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <Button aria-describedby={id} type="button" onClick={handlePopupClick}>
          Mở
        </Button>
        <BasePopup id={id} open={open} anchor={anchor}>
          <PopupBody>
            <img src={prop.value} />
          </PopupBody>
        </BasePopup>
      </div>
    </ClickAwayListener>
  )
}

const columns = [
  { field: '_id', type: 'number', headerName: 'STT' },
  {
    field: 'name',
    headerName: 'Tên',
    editable: false
  },
  {
    field: 'address',
    headerName: 'Địa chỉ',
    editable: false
  },
  {
    field: 'phoneNumber',
    headerName: 'SĐT',
    editable: false,
    type: 'String'
  },

  {
    field: 'size',
    headerName: 'Size',
    editable: false,
    type: 'String'
  },

  {
    field: 'hasArrived',
    headerName: 'Đá đến?',
    editable: true,
    default: false,
    type: 'boolean'
  },
  {
    field: 'arrivalTime',
    headerName: 'Giờ check-in',
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
  const [idJustCheckedIn, setIdJustCheckedIn] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notiOpen, setNotiOpen] = useState(false)

  const getAPI = async () => {
    try {
      const response = await fetch('https://check-in-app.onrender.com/api/attendees')
      // Handle the response
      const result = await response.json() // Parse the response as JSON
      console.log('Retrieved data success:', result)

      setRows(result)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const postAPI = async (data) => {
    console.log(data)
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
      console.log('Posted successfully:', result)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateAPI = async (data) => {
    console.log(data)
    try {
      const response = await fetch('https://check-in-app.onrender.com/api/attendees', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convert data to JSON string
      })

      // Handle the response
      const result = await response.json() // Parse the response as JSON
      console.log('Updated successfully:', result)
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

  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      fetch('https://check-in-app.onrender.com/api/attendees') // Replace with your API endpoint
        .then((response) => response.json())
        .then((data) => setRows(data))
        .then(() => {
          apiRef.current.autosizeColumns()
          setIsLoading(false)
        })
        .catch((error) => console.error('Error fetching data:', error))
    }, 5000)

    //Clearing the interval
    return () => clearInterval(interval)
  }, [rows])

  useEffect(() => {setNotiOpen(true)}, [idJustCheckedIn])

  const handleProcessRowUpdate = async (updatedRow, oldRow) => {
    let newUpdatedRow = updatedRow
    if (oldRow.hasArrived && !updatedRow.hasArrived) {
      newUpdatedRow = { ...updatedRow, arrivalTime: '' }
    } else if (!oldRow.hasArrived && updatedRow.hasArrived) {
      const currentTime = dayjs().format('HH:mm')
      newUpdatedRow = { ...updatedRow, arrivalTime: currentTime }
    }
    console.log(newUpdatedRow)

    try {
      // Send the updated row data in the POST request
      await updateAPI(newUpdatedRow) // Call the postAPI function with the updated row

      // Return the updated row so the DataGrid knows the update was successful
      return newUpdatedRow
    } catch (error) {
      console.error('Error updating row:', error)

      // If the API request fails, return the old row to revert the changes
      return oldRow
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <NotiModal open={notiOpen} setOpen={setNotiOpen} />
      <div style={{ height: '90vh', width: '90vw', marginInline: 'auto' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowClassName={(params) => (params.row.hasArrived ? style.highlightedRow : '')}
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
          processRowUpdate={handleProcessRowUpdate} // Use the updated row update handler
          sx={{
            [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
              outline: 'none'
            },
            [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
              outline: 'none'
            },

            [`& .${gridClasses.row}:hover`]: {
              backgroundColor: 'none'
            }
          }}
        />
        <div className={style.operationWrap}>
          {JSON.stringify(rows) == '[]' ? (
            <ImportFiles updateDatabase={() => getAPI()} postAPI={(value) => postAPI(value)} />
          ) : (
            <div></div>
          )}
          <DeleteDatabase updateDatabase={() => getAPI()} />
        </div>
        <QrCodeReader
          setIdJustCheckedIn={setIdJustCheckedIn}
          setRows={(param) => setRows(param)}
          rows={rows}
          updateAPI={updateAPI}
        />
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
