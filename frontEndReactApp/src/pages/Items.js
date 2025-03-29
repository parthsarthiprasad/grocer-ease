import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { itemAPI } from '../services/api';
import DataGrid from '../components/DataGrid';
import FormDialog from '../components/FormDialog';

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    aisle: '',
    shop: '',
  });

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'aisle', headerName: 'Aisle', width: 150 },
    { field: 'shop', headerName: 'Shop', width: 200 },
  ];

  const formFields = [
    { name: 'name', label: 'Name', required: true },
    { name: 'description', label: 'Description', multiline: true, rows: 2 },
    { name: 'price', label: 'Price', type: 'number', required: true },
    { name: 'quantity', label: 'Quantity', type: 'number', required: true },
    { name: 'category', label: 'Category', required: true },
    { name: 'aisle', label: 'Aisle', required: true },
    { name: 'shop', label: 'Shop', required: true },
  ];

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenDialog = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormValues(item);
    } else {
      setSelectedItem(null);
      setFormValues({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        aisle: '',
        shop: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setFormValues({
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      aisle: '',
      shop: '',
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
      if (selectedItem) {
        await itemAPI.update(selectedItem._id, formValues);
      } else {
        await itemAPI.create(formValues);
      }
      handleCloseDialog();
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemAPI.delete(item._id);
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Items</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Item
        </Button>
      </Box>

      <DataGrid
        rows={items}
        columns={columns}
        loading={loading}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      <FormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={selectedItem ? 'Edit Item' : 'Add Item'}
        fields={formFields}
        values={formValues}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        submitLabel={selectedItem ? 'Update' : 'Create'}
      />
    </Box>
  );
};

export default Items; 