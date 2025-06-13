//ContactDetail - individual view
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Card, CardContent, Typography, Button, Box, 
  Chip, Divider, IconButton, Alert
} from '@mui/material';
import { 
  User, Phone, Mail, MapPin, Building, Briefcase, 
  Calendar, FileText, ArrowLeft, Heart
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchContactById, 
  toggleFavorite
} from '../store/contactsSlice';

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedContact: contact, loading, error, favorites } = useAppSelector((state) => state.contacts);

  //GET contact by ID
  useEffect(() => {
    if (id) {
      dispatch(fetchContactById(parseInt(id)));
    }
  }, [id, dispatch]);

  const handleToggleFavorite = () => {
    if (!contact) return;
    dispatch(toggleFavorite(contact.id));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box className="loading">
          <div className="spinner" />
          <Typography sx={{ ml: 2 }}>Loading contact...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !contact) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Contact not found or an error occurred while loading.
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate('/contacts')}
        >
          Back to Contacts
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box className="fade-in">
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate('/contacts')}
          >
            Back to Contacts
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={handleToggleFavorite}
              title={favorites.includes(contact.id) ? 'Remove from favorites' : 'Add to favorites'}
              sx={{ 
                color: favorites.includes(contact.id) ? '#dc2626' : '#64748b',
                '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.1)' }
              }}
            >
              <Heart 
                size={24} 
                fill={favorites.includes(contact.id) ? '#dc2626' : 'none'}
              />
            </IconButton>
            
          </Box>
        </Box>

        {/* Contact Card */}
        <Card className="card" sx={{ overflow: 'visible' }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header with Name */}
            <Box className="card-header" sx={{ mb: 4 }}>
              <User size={48} style={{ color: '#2563eb' }} />
              <Box>
                <Typography variant="h1" sx={{ fontSize: '2.5rem', mb: 1 }}>
                  {contact.nombre} {contact.apellido}
                </Typography>
                {contact.cargo && contact.empresa && (
                  <Typography variant="h6" color="text.secondary">
                    {contact.cargo} at {contact.empresa}
                  </Typography>
                )}
                {favorites.includes(contact.id) && (
                  <Chip 
                    label="Favorite" 
                    size="small" 
                    color="error" 
                    icon={<Heart size={16} />} 
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Contact Information Grid */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: 4 
            }}>
              {/* Contact Methods */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 3 
                }}>
                  <Phone size={20} />
                  Contact Information
                </Typography>
                
                <Box sx={{ space: 3 }}>
                  {contact.telefono && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Phone size={18} style={{ color: '#64748b' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body1">
                          {contact.telefono}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {contact.correo_electronico && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Mail size={18} style={{ color: '#64748b' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">
                          {contact.correo_electronico}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {(contact.calle || contact.ciudad || contact.estado) && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <MapPin size={18} style={{ color: '#64748b', marginTop: '2px' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Address
                        </Typography>
                        <Typography variant="body1">
                          {[contact.calle, contact.ciudad, contact.estado]
                            .filter(Boolean)
                            .join(', ')}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Professional Information */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 3 
                }}>
                  <Briefcase size={20} />
                  Professional Details
                </Typography>
                
                <Box sx={{ space: 3 }}>
                  {contact.empresa && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Building size={18} style={{ color: '#64748b' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Company
                        </Typography>
                        <Typography variant="body1">
                          {contact.empresa}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {contact.cargo && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Briefcase size={18} style={{ color: '#64748b' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Job Title
                        </Typography>
                        <Typography variant="body1">
                          {contact.cargo}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {contact.fecha_cumpleanos && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Calendar size={18} style={{ color: '#64748b' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Date of Birth
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(contact.fecha_cumpleanos)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Notes Section */}
            {contact.notas && (
              <>
                <Divider sx={{ my: 4 }} />
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 3 
                  }}>
                    <FileText size={20} />
                    Notes
                  </Typography>
                  <Card variant="outlined" sx={{ p: 3, backgroundColor: '#f8fafc' }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {contact.notas}
                    </Typography>
                  </Card>
                </Box>
              </>
            )}

            {/* Action Buttons */}
            <Divider sx={{ my: 5 }} />
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end',
              flexWrap: 'wrap'
            }}>

            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ContactDetail; 