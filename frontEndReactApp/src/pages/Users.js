import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { userAPI } from '../services/api';
import DataGrid from '../components/DataGrid';
import FormDialog from '../components/FormDialog';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'address', headerName: 'Address', width: 300 },
  ];

  const formFields = [
    { name: 'name', label: 'Name', required: true },
    { name: 'email', label: 'Email', required: true },
    { name: 'phone', label: 'Phone', required: true },
    { name: 'address', label: 'Address', required: true },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormValues(user);
    } else {
      setSelectedUser(null);
      setFormValues({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormValues({
      name: '',
      email: '',
      phone: '',
      address: '',
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
      if (selectedUser) {
        await userAPI.update(selectedUser._id, formValues);
      } else {
        await userAPI.create(formValues);
      }
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(user._id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </Box>

      <DataGrid
        rows={users}
        columns={columns}
        loading={loading}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      <FormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={selectedUser ? 'Edit User' : 'Add User'}
        fields={formFields}
        values={formValues}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        submitLabel={selectedUser ? 'Update' : 'Create'}
      />
    </Box>
  );
};

export default Users; 