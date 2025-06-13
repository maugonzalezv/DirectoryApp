import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Contact {
  id: number;
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

interface ContactsState {
  contacts: Contact[];
  favorites: number[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  selectedContact: Contact | null;
}

const initialState: ContactsState = {
  contacts: [],
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  loading: false,
  error: null,
  searchTerm: '',
  sortBy: 'nombre',
  sortOrder: 'asc',
  currentPage: 1,
  selectedContact: null,
};

// Async thunks para operaciones con la API
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async () => {
    const response = await axios.get('http://localhost:5000/api/contacts');
    return response.data;
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (id: number) => {
    const response = await axios.get(`http://localhost:5000/api/contacts/${id}`);
    return response.data;
  }
);

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contactData: Omit<Contact, 'id'>) => {
    const response = await axios.post('http://localhost:5000/api/contacts', contactData);
    return response.data;
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async (contact: Contact) => {
    const response = await axios.patch(`http://localhost:5000/api/contacts/${contact.id}`, contact);
    return response.data;
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id: number) => {
    await axios.delete(`http://localhost:5000/api/contacts/${id}`);
    return id;
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(fav => fav !== id);
      } else {
        state.favorites.push(id);
      }
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedContact: (state, action: PayloadAction<Contact | null>) => {
      state.selectedContact = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch contacts';
      })
      
      // Fetch contact by ID
      .addCase(fetchContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedContact = action.payload;
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch contact';
      })
      
      // Create contact
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts.push(action.payload);
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create contact';
      })
      
      // Update contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contacts.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        if (state.selectedContact?.id === action.payload.id) {
          state.selectedContact = action.payload;
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update contact';
      })
      
      // Delete contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = state.contacts.filter(c => c.id !== action.payload);
        state.favorites = state.favorites.filter(fav => fav !== action.payload);
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
        if (state.selectedContact?.id === action.payload) {
          state.selectedContact = null;
        }
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete contact';
      });
  },
});

export const {
  setSearchTerm,
  setSortBy,
  setSortOrder,
  setCurrentPage,
  toggleFavorite,
  clearError,
  setSelectedContact,
} = contactsSlice.actions;

export default contactsSlice.reducer; 