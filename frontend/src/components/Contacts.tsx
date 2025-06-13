import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container, Typography, Button, Box, Card, CardContent, CardActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Chip, Pagination, Alert
} from '@mui/material';
import { Users, UserPlus, Plus, Search, Edit2, Trash2, Heart, Phone, Mail, MapPin, Building } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchContacts, updateContact, deleteContact,
  setSearchTerm, setSortBy, setSortOrder, setCurrentPage, toggleFavorite
} from '../store/contactsSlice';
import type { Contact } from '../store/contactsSlice';

const Contacts: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Redux state
  const { contacts, favorites, loading, error, searchTerm, sortBy, sortOrder, currentPage } = useAppSelector(state => state.contacts);

  // Local state
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editForm, setEditForm] = useState<Contact | null>(null);

  const itemsPerPage = 9;

  // URL parameter sync function
  const updateURLParams = useCallback((params: { search?: string; page?: number; sortBy?: string; sortOrder?: string }) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (params.search !== undefined) {
      if (params.search) {
        newSearchParams.set('search', params.search);
      } else {
        newSearchParams.delete('search');
      }
    }
    
    if (params.page !== undefined) {
      if (params.page > 1) {
        newSearchParams.set('page', params.page.toString());
      } else {
        newSearchParams.delete('page');
      }
    }
    
    if (params.sortBy !== undefined) {
      if (params.sortBy !== 'nombre') {
        newSearchParams.set('sortBy', params.sortBy);
      } else {
        newSearchParams.delete('sortBy');
      }
    }
    
    if (params.sortOrder !== undefined) {
      if (params.sortOrder !== 'asc') {
        newSearchParams.set('sortOrder', params.sortOrder);
      } else {
        newSearchParams.delete('sortOrder');
      }
    }
    
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  // Initialize from URL params on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlPage = parseInt(searchParams.get('page') || '1');
    const urlSortBy = searchParams.get('sortBy') || 'nombre';
    const urlSortOrder = searchParams.get('sortOrder') || 'asc';

    if (urlSearch !== searchTerm) {
      dispatch(setSearchTerm(urlSearch));
    }
    if (urlPage !== currentPage) {
      dispatch(setCurrentPage(urlPage));
    }
    if (urlSortBy !== sortBy) {
      dispatch(setSortBy(urlSortBy));
    }
    if (urlSortOrder !== sortOrder) {
      dispatch(setSortOrder(urlSortOrder as 'asc' | 'desc'));
    }
  }, []); // Solo ejecutar al montar el componente

  // GET contacts
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  // Search and sorting with memoization
  const filteredContacts = useMemo(() => {
    let filtered = contacts.filter(contact => 
      contact.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.telefono.includes(searchTerm) ||
      contact.correo_electronico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Contact]?.toString().toLowerCase() || '';
      let bValue = b[sortBy as keyof Contact]?.toString().toLowerCase() || '';
      
      if (sortOrder === 'desc') {
        [aValue, bValue] = [bValue, aValue];
      }
      
      return aValue.localeCompare(bValue);
    });

    return filtered;
  }, [contacts, searchTerm, sortBy, sortOrder]);

  // Adjust current page if necessary
  useEffect(() => {
    if (currentPage !== 1 && filteredContacts.length > 0 && filteredContacts.length <= (currentPage - 1) * itemsPerPage) {
      dispatch(setCurrentPage(1));
      updateURLParams({ search: searchTerm, page: 1, sortBy, sortOrder });
    }
  }, [filteredContacts.length, currentPage, itemsPerPage, dispatch, updateURLParams, searchTerm, sortBy, sortOrder]);

  // Pagination
  const paginatedContacts = useMemo(() => {
    return filteredContacts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredContacts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  // PATCH contact
  const handleEdit = async () => {
    if (!editForm) return;
    try {
      await dispatch(updateContact(editForm));
      setEditDialog(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // DELETE contact
  const handleDelete = async () => {
    if (!selectedContact) return;
    try {
      await dispatch(deleteContact(selectedContact.id));
      setDeleteDialog(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openEdit = (contact: Contact) => {
    setEditForm({ ...contact });
    setEditDialog(true);
  };

  const openDelete = (contact: Contact) => {
    setSelectedContact(contact);
    setDeleteDialog(true);
  };

  // Functions to handle changes with URL sync
  const handleSearchChange = useCallback((search: string) => {
    dispatch(setSearchTerm(search));
    dispatch(setCurrentPage(1)); // Reset to page 1 when searching
    updateURLParams({ search, page: 1, sortBy, sortOrder });
  }, [dispatch, updateURLParams, sortBy, sortOrder]);

  const handleSortByChange = useCallback((newSortBy: string) => {
    dispatch(setSortBy(newSortBy));
    updateURLParams({ search: searchTerm, page: currentPage, sortBy: newSortBy, sortOrder });
  }, [dispatch, updateURLParams, searchTerm, currentPage, sortOrder]);

  const handleSortOrderChange = useCallback((newSortOrder: 'asc' | 'desc') => {
    dispatch(setSortOrder(newSortOrder));
    updateURLParams({ search: searchTerm, page: currentPage, sortBy, sortOrder: newSortOrder });
  }, [dispatch, updateURLParams, searchTerm, currentPage, sortBy]);

  const handlePageChange = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
    updateURLParams({ search: searchTerm, page, sortBy, sortOrder });
  }, [dispatch, updateURLParams, searchTerm, sortBy, sortOrder]);

  const clearFilters = useCallback(() => {
    dispatch(setSearchTerm(''));
    dispatch(setSortBy('nombre'));
    dispatch(setSortOrder('asc'));
    dispatch(setCurrentPage(1));
    updateURLParams({ search: '', page: 1, sortBy: 'nombre', sortOrder: 'asc' });
  }, [dispatch, updateURLParams]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box className="loading">
          <div className="spinner" />
          <Typography sx={{ ml: 2 }}>Loading contacts...</Typography>
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
            <Users size={32} style={{ color: '#2563eb' }} />
            <Typography variant="h1">
              Contact Directory
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<UserPlus size={20} />}
            onClick={() => navigate('/')}
            size="large"
            sx={{ minWidth: 180 }}
          >
            Add New Contact
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {contacts.length === 0 ? (
          <Card className="empty-state">
            <CardContent sx={{ py: 8 }}>
              <UserPlus size={80} className="empty-state-icon" />
              <Typography variant="h3" className="empty-state-title">
                No contacts yet
              </Typography>
              <Typography className="empty-state-description">
                Start building your contact directory by adding your first contact
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/')}
                size="large"
              >
                Create First Contact
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Search and Filters */}
            <Paper className="search-filters">
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                alignItems: 'center',
                p: 3
              }}>
                <TextField
                  label="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  InputProps={{
                    startAdornment: <Search size={20} style={{ marginRight: '0.5rem', color: '#64748b' }} />
                  }}
                  variant="outlined"
                  sx={{ minWidth: 300 }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort by"
                    onChange={(e) => handleSortByChange(e.target.value)}
                  >
                    <MenuItem value="nombre">First Name</MenuItem>
                    <MenuItem value="apellido">Last Name</MenuItem>
                    <MenuItem value="empresa">Company</MenuItem>
                    <MenuItem value="telefono">Phone</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Order</InputLabel>
                  <Select
                    value={sortOrder}
                    label="Order"
                    onChange={(e) => handleSortOrderChange(e.target.value as 'asc' | 'desc')}
                  >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="body2" color="textSecondary">
                  {filteredContacts.length} contacts found
                </Typography>
                {(searchTerm || sortBy !== 'nombre' || sortOrder !== 'asc') && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>
            </Paper>

            {/* No Results */}
            {filteredContacts.length === 0 ? (
              <Card className="empty-state">
                <CardContent sx={{ py: 6 }}>
                  <Search size={64} className="empty-state-icon" />
                  <Typography variant="h4" className="empty-state-title">
                    No contacts found
                  </Typography>
                  <Typography className="empty-state-description">
                    Try adjusting your search or filter criteria
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Contacts Grid */}
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)'
                  },
                  gap: 3,
                  mb: 4
                }}>
                  {paginatedContacts.map((contact) => (
                    <Card key={contact.id} className="contact-card">
                                              <CardContent sx={{ pb: 1 }}>
                          {/* Contact Header */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" component="h3">
                                {contact.nombre} {contact.apellido}
                              </Typography>
                              {contact.empresa && (
                                <Typography variant="body2" color="textSecondary">
                                  {contact.empresa}
                                </Typography>
                              )}
                            </Box>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(toggleFavorite(contact.id));
                              }}
                              sx={{
                                color: favorites.includes(contact.id) ? '#dc2626' : '#64748b',
                                '&:hover': {
                                  color: '#dc2626',
                                  backgroundColor: 'rgba(220, 38, 38, 0.1)'
                                }
                              }}
                            >
                              <Heart 
                                size={18} 
                                fill={favorites.includes(contact.id) ? '#dc2626' : 'none'}
                              />
                            </IconButton>
                          </Box>

                        {/* Contact Info */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone size={16} style={{ color: '#64748b' }} />
                            <Typography variant="body2">{contact.telefono}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Mail size={16} style={{ color: '#64748b' }} />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {contact.correo_electronico}
                            </Typography>
                          </Box>
                          {(contact.ciudad || contact.estado) && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <MapPin size={16} style={{ color: '#64748b' }} />
                              <Typography variant="body2">
                                {[contact.ciudad, contact.estado].filter(Boolean).join(', ')}
                              </Typography>
                            </Box>
                          )}
                          {contact.cargo && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Building size={16} style={{ color: '#64748b' }} />
                              <Typography variant="body2">{contact.cargo}</Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Tags */}
                        <Box sx={{ mt: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {favorites.includes(contact.id) && (
                            <Chip 
                              label="Favorite" 
                              size="small" 
                              color="error"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </CardContent>

                      <CardActions sx={{ px: 2, py: 1 }}>
                        <Button
                          size="small"
                          onClick={() => navigate(`/contacts/${contact.id}`)}
                          sx={{ mr: 'auto' }}
                        >
                          View Details
                        </Button>
                        <IconButton 
                          size="small" 
                          onClick={() => openEdit(contact)}
                          sx={{ color: '#2563eb' }}
                        >
                          <Edit2 size={16} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => openDelete(contact)}
                          sx={{ color: '#dc2626' }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, page) => handlePageChange(page)}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}

        {/* Edit Dialog */}
        <Dialog 
          open={editDialog} 
          onClose={() => setEditDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogContent>
            {editForm && (
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2,
                mt: 1
              }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={editForm.apellido}
                  onChange={(e) => setEditForm({...editForm, apellido: e.target.value})}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={editForm.telefono}
                  onChange={(e) => setEditForm({...editForm, telefono: e.target.value})}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editForm.correo_electronico}
                  onChange={(e) => setEditForm({...editForm, correo_electronico: e.target.value})}
                />
                <TextField
                  fullWidth
                  label="Street Address"
                  value={editForm.calle}
                  onChange={(e) => setEditForm({...editForm, calle: e.target.value})}
                  sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleEdit}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog 
          open={deleteDialog} 
          onClose={() => setDeleteDialog(false)}
        >
          <DialogTitle>Delete Contact</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete {selectedContact?.nombre} {selectedContact?.apellido}? 
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Contacts; 