import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { aisleAPI } from '../services/api';
import DataGrid from '../components/DataGrid';
import FormDialog from '../components/FormDialog';

const Aisles = () => {
  const [aisles, setAisles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAisle, setSelectedAisle] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
  });

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'category', headerName: 'Category', width: 200 },
  ];

  const formFields = [
    { name: 'name', label: 'Name', required: true },
    { name: 'description', label: 'Description', multiline: true, rows: 2 },
    { name: 'location', label: 'Location', required: true },
    { name: 'category', label: 'Category', required: true },
  ];

  const fetchAisles = async () => {
    try {
      setLoading(true);
      const response = await aisleAPI.getAll();
      setAisles(response.data);
    } catch (error) {
      console.error('Error fetching aisles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAisles();
  }, []);

  const handleOpenDialog = (aisle = null) => {
    if (aisle) {
      setSelectedAisle(aisle);
      setFormValues(aisle);
    } else {
      setSelectedAisle(null);
      setFormValues({
        name: '',
        description: '',
        location: '',
        category: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAisle(null);
    setFormValues({
      name: '',
      description: '',
      location: '',
      category: '',
    });
  };

  const handleInputChange = (name, value) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedAisle) {
        await aisleAPI.update(selectedAisle._id, formValues);
      } else {
        await aisleAPI.create(formValues);
      }
      handleCloseDialog();
      fetchAisles();
    } catch (error) {
      console.error('Error saving aisle:', error);
    }
  };

  const handleDelete = async (aisle) => {
    if (window.confirm('Are you sure you want to delete this aisle?')) {
      try {
        await aisleAPI.delete(aisle._id);
        fetchAisles();
      } catch (error) {
        console.error('Error deleting aisle:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Aisles</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Aisle
        </Button>
      </Box>

      <DataGrid
        rows={aisles}
        columns={columns}
        loading={loading}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      <FormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={selectedAisle ? 'Edit Aisle' : 'Add Aisle'}
        fields={formFields}
        values={formValues}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        submitLabel={selectedAisle ? 'Update' : 'Create'}
      />
    </Box>
  );
};

export default Aisles; 