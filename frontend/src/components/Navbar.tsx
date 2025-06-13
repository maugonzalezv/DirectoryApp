//Navbar - navigation
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Plus, Users, Heart, BookOpen } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1100,
        top: 0,
        width: '100%'
      }}
    >
      <Toolbar sx={{ 
        width: '100%', 
        maxWidth: 'none',
        px: { xs: 2, sm: 3, md: 4 },
        minHeight: { xs: 56, sm: 64 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <BookOpen size={24} style={{ marginRight: '0.75rem' }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            DirectoryApp
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 0.5, sm: 1 },
          flexWrap: 'wrap'
        }}>
          <Button
            color="inherit"
            startIcon={<Plus size={18} />}
            onClick={() => navigate('/')}
            variant={isActive('/') ? 'outlined' : 'text'}
            size="medium"
            sx={{ 
              color: 'white',
              borderColor: isActive('/') ? 'white' : 'transparent',
              borderWidth: 2,
              fontWeight: 500,
              px: { xs: 1.5, sm: 2 },
              py: 1,
              minWidth: { xs: 'auto', sm: 100 },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderColor: 'white',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Create
          </Button>
          
          <Button
            color="inherit"
            startIcon={<Users size={18} />}
            onClick={() => navigate('/contacts')}
            variant={isActive('/contacts') ? 'outlined' : 'text'}
            size="medium"
            sx={{ 
              color: 'white',
              borderColor: isActive('/contacts') ? 'white' : 'transparent',
              borderWidth: 2,
              fontWeight: 500,
              px: { xs: 1.5, sm: 2 },
              py: 1,
              minWidth: { xs: 'auto', sm: 100 },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderColor: 'white',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Contacts
          </Button>
          
          <Button
            color="inherit"
            startIcon={<Heart size={18} />}
            onClick={() => navigate('/favorites')}
            variant={isActive('/favorites') ? 'outlined' : 'text'}
            size="medium"
            sx={{ 
              color: 'white',
              borderColor: isActive('/favorites') ? 'white' : 'transparent',
              borderWidth: 2,
              fontWeight: 500,
              px: { xs: 1.5, sm: 2 },
              py: 1,
              minWidth: { xs: 'auto', sm: 100 },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderColor: 'white',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Favorites
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 