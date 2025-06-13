//Favorites - favorites list
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, IconButton, Typography, Box,
  Card, CardContent
} from '@mui/material';
import { Heart, Eye, Edit3, Users, UserMinus, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchContacts, 
  toggleFavorite
} from '../store/contactsSlice';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { contacts, favorites, loading } = useAppSelector((state) => state.contacts);

  // Get favorite contacts using memoization
  const favoriteContacts = useMemo(() => {
    return contacts.filter(contact => favorites.includes(contact.id));
  }, [contacts, favorites]);

  //GET contacts if not loaded
  useEffect(() => {
    if (contacts.length === 0) {
      dispatch(fetchContacts());
    }
  }, [dispatch, contacts.length]);

  const removeFavorite = (id: number) => {
    dispatch(toggleFavorite(id));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box className="loading">
          <div className="spinner" />
          <Typography sx={{ ml: 2 }}>Loading favorites...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box className="fade-in">
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Heart size={32} style={{ color: '#dc2626' }} />
            <Typography variant="h1">
              Favorite Contacts
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate('/contacts')}
          >
            Back to All Contacts
          </Button>
        </Box>

        {/* Empty State */}
        {favoriteContacts.length === 0 ? (
          <Card className="empty-state">
            <CardContent sx={{ py: 8 }}>
              <Heart size={80} className="empty-state-icon" style={{ color: '#dc2626' }} />
              <Typography variant="h3" className="empty-state-title">
                No favorite contacts yet
              </Typography>
              <Typography className="empty-state-description">
                Start adding contacts to your favorites by clicking the heart icon
              </Typography>
              <Button
                variant="contained"
                startIcon={<Users size={20} />}
                onClick={() => navigate('/contacts')}
                size="large"
              >
                Browse All Contacts
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                You have {favoriteContacts.length} favorite contact{favoriteContacts.length !== 1 ? 's' : ''}
              </Typography>
            </Box>

            {/* Favorites Table */}
            <TableContainer component={Paper} className="table-container">
              <Table className="table">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>First Name</strong></TableCell>
                    <TableCell><strong>Last Name</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Company</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {favoriteContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>{contact.nombre}</TableCell>
                      <TableCell>{contact.apellido}</TableCell>
                      <TableCell>{contact.telefono || '-'}</TableCell>
                      <TableCell>{contact.correo_electronico || '-'}</TableCell>
                      <TableCell>{contact.empresa || '-'}</TableCell>
                      <TableCell align="center">
                        <Box className="action-buttons">
                          <IconButton 
                            className="action-btn"
                            onClick={() => navigate(`/contacts/${contact.id}`)}
                            title="View details"
                          >
                            <Eye size={18} />
                          </IconButton>
                          <IconButton 
                            className="action-btn"
                            onClick={() => navigate('/contacts')}
                            title="Edit contact"
                          >
                            <Edit3 size={18} />
                          </IconButton>
                          <IconButton 
                            className="action-btn"
                            onClick={() => removeFavorite(contact.id)}
                            title="Remove from favorites"
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                                color: '#dc2626'
                              }
                            }}
                          >
                            <UserMinus size={18} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Quick Actions */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 2, 
              mt: 4 
            }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/contacts')}
                startIcon={<Users size={18} />}
              >
                View All Contacts
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                startIcon={<Heart size={18} />}
              >
                Add New Contact
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Favorites; 