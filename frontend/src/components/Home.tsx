//Home - create form
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  Paper, TextField, Button, Typography, Box, 
  Alert, Snackbar
} from '@mui/material';
import { UserPlus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createContact, clearError } from '../store/contactsSlice';

interface ContactForm {
  nombre: string;
  apellido: string;
  telefono: string;
  correo_electronico: string;
  calle: string;
  ciudad: string;
  estado: string;
  empresa: string;
  cargo: string;
  notas: string;
  fecha_cumpleanos: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.contacts);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  //submit form
  const onSubmit = async (data: ContactForm) => {
    try {
      console.log('Sending data:', data);
      
      const result = await dispatch(createContact(data));
      
      if (createContact.fulfilled.match(result)) {
        console.log('Contact created:', result.payload);
        reset();
        setShowSuccess(true);
      } else if (createContact.rejected.match(result)) {
        setShowError(true);
      }
      
    } catch (error: any) {
      console.error('Error creating contact:', error);
      setShowError(true);
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh',
      p: { xs: 2, sm: 3, md: 4 },
      backgroundColor: '#f8fafc'
    }}>
      {/* Welcome Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            paddingTop: '20px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Contact Directory
        </Typography>
       
      </Box>

      {/* Contact Form */}
      <Paper sx={{ 
        p: { xs: 3, sm: 4, md: 5 }, 
        borderRadius: 2, 
        boxShadow: 3,
        maxWidth: 1400,
        mx: 'auto',
        width: '100%'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <UserPlus size={32} style={{ color: '#2563eb', marginRight: '16px' }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Create New Contact
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: 4,
            mb: 4
          }}>
            {/* First Name */}
            <TextField
              fullWidth
              label="First Name *"
              {...register('nombre', { required: 'First name is required' })}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { height: 56 } }}
            />

            {/* Last Name */}
            <TextField
              fullWidth
              label="Last Name *"
              {...register('apellido', { required: 'Last name is required' })}
              error={!!errors.apellido}
              helperText={errors.apellido?.message}
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { height: 56 } }}
            />

            {/* Phone */}
            <TextField
              fullWidth
              label="Phone Number"
              {...register('telefono')}
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { height: 56 } }}
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              {...register('correo_electronico', {
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email format'
                }
              })}
              error={!!errors.correo_electronico}
              helperText={errors.correo_electronico?.message}
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { height: 56 } }}
            />

            {/* Company */}
            <TextField
              fullWidth
              label="Company"
              {...register('empresa')}
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { height: 56 } }}
            />

            {/* Job Title */}
            <TextField
              fullWidth
              label="Job Title"
              {...register('cargo')}
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { height: 56 } }}
            />

            {/* Street Address */}
            <TextField
              fullWidth
              label="Street Address"
              {...register('calle')}
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { height: 56 } }}
            />

            {/* City */}
            <TextField
              fullWidth
              label="City"
              {...register('ciudad')}
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { height: 56 } }}
            />

            {/* State */}
            <TextField
              fullWidth
              label="State/Province"
              {...register('estado')}
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { height: 56 } }}
            />

            {/* Birthday */}
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              {...register('fecha_cumpleanos')}
              InputLabelProps={{ shrink: true }}
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { height: 56 } }}
            />
          </Box>

          {/* Notes */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={4}
              {...register('notas')}
              placeholder="Add any additional notes..."
              disabled={loading}
            />
          </Box>

          {/* Submit Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center',
            pt: 3,
            flexWrap: 'wrap'
          }}>
            <Button 
              variant="contained" 
              type="submit"
              disabled={loading}
              size="large"
              sx={{ 
                minWidth: 200,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              {loading ? 'Creating...' : 'Create Contact'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/contacts')}
              size="large"
              sx={{ 
                minWidth: 200,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              View All Contacts
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Success Notification */}
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={4000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity="success" 
          onClose={() => setShowSuccess(false)}
          variant="filled"
        >
          Contact created successfully!
        </Alert>
      </Snackbar>

      {/* Error Notification */}
      <Snackbar 
        open={showError || !!error} 
        autoHideDuration={6000} 
        onClose={() => {
          setShowError(false);
          dispatch(clearError());
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity="error" 
          onClose={() => {
            setShowError(false);
            dispatch(clearError());
          }}
          variant="filled"
        >
          {error || 'Error creating contact. Please check if the server is running.'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home; 