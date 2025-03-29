import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { shopAPI } from '../services/api';
import DataGrid from '../components/DataGrid';
import FormDialog from '../components/FormDialog';

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    openingHours: '',
    description: '',
  });

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'address', headerName: 'Address', width: 300 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'openingHours', headerName: 'Opening Hours', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
  ];

  const formFields = [
    { name: 'name', label: 'Name', required: true },
    { name: 'address', label: 'Address', required: true },
    { name: 'phone', label: 'Phone', required: true },
    { name: 'email', label: 'Email', required: true },
    { name: 'openingHours', label: 'Opening Hours', required: true },
    { name: 'description', label: 'Description', multiline: true, rows: 3 },
  ];

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await shopAPI.getAll();
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleOpenDialog = (shop = null) => {
    if (shop) {
      setSelectedShop(shop);
      setFormValues(shop);
    } else {
      setSelectedShop(null);
      setFormValues({
        name: '',
        address: '',
        phone: '',
        email: '',
        openingHours: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedShop(null);
    setFormValues({
      name: '',
      address: '',
      phone: '',
      email: '',
      openingHours: '',
      description: '',
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
      if (selectedShop) {
        await shopAPI.update(selectedShop._id, formValues);
      } else {
        await shopAPI.create(formValues);
      }
      handleCloseDialog();
      fetchShops();
    } catch (error) {
      console.error('Error saving shop:', error);
    }
  };

  const handleDelete = async (shop) => {
    if (window.confirm('Are you sure you want to delete this shop?')) {
      try {
        await shopAPI.delete(shop._id);
        fetchShops();
      } catch (error) {
        console.error('Error deleting shop:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Shops</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Shop
        </Button>
      </Box>

      <DataGrid
        rows={shops}
        columns={columns}
        loading={loading}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      <FormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={selectedShop ? 'Edit Shop' : 'Add Shop'}
        fields={formFields}
        values={formValues}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        submitLabel={selectedShop ? 'Update' : 'Create'}
      />
    </Box>
  );
};

export default Shops; 