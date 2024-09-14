import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';



const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'phoneNumber',
    headerName: 'Phone No.',
    width: 150,
    editable: true,
  },

  {
    field: "attended",
    headerName: "Attended ?",
    editable: true,
    type: "boolean"
  },
  {
    field: 'timeEntered',
    headerName: 'Time checked-in',
    width: 130,
    editable: true,
  }
];

const rows = [{
    id: 1,
    name: "Nam Anh",
    phoneNumber: "0332090089",
    attended: false
}];

export default function Database() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      />
    </Box>
  );
}