import React from 'react';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DataGrid = ({ 
  rows, 
  columns, 
  onEdit, 
  onDelete, 
  loading = false,
  ...props 
}) => {
  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <>
        <Tooltip title="Edit">
          <IconButton onClick={() => onEdit(params.row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => onDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
    ),
  };

  const allColumns = [...columns, actionColumn];

  return (
    <MuiDataGrid
      rows={rows}
      columns={allColumns}
      loading={loading}
      autoHeight
      disableSelectionOnClick
      {...props}
    />
  );
};

export default DataGrid; 