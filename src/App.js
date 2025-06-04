import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  CssBaseline,
  useMediaQuery,
  Paper,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import DataCard from './components/DataCard';
import './App.css';

// Custom theme colors
const theme = {
  primary: '#2196f3',
  secondary: '#9c27b0',
  background: '#f5f5f5',
  cardBackground: '#ffffff',
  error: '#f44336',
  success: '#4caf50',
  warning: '#ff9800',
};

// Custom gradient background
const gradientBackground = `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`;

function App() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [temperatureTrend, setTemperatureTrend] = useState(0);
  const [humidityTrend, setHumidityTrend] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://192.168.43.113/data');
      const data = await response.json();
      
      if (data.temperature !== undefined && data.humidity !== undefined) {
        setTemperature(data.temperature);
        setHumidity(data.humidity);
        
        // Calculate trends
        setTemperatureTrend(data.temperature - temperature);
        setHumidityTrend(data.humidity - humidity);
        setLastUpdate(new Date());
      } else {
        throw new Error('Données invalides reçues du capteur');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setError('Erreur de connexion au capteur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array since we don't want to recreate interval

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      flexDirection: { xs: 'column', sm: 'row' },
    }}>
      <CssBaseline />
      
      {/* Titre */}
      <Box sx={{ 
        bgcolor: 'primary.main',
        color: 'white',
        p: 3,
        mb: 4,
        boxShadow: 2,
        display: { xs: 'block', sm: 'flex' },
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <Typography variant="h1" component="h1" sx={{ 
          fontSize: { xs: '1.5rem', sm: '2.5rem' },
          fontWeight: 600,
          mb: { xs: 1, sm: 0 },
        }}>
          Surveillance Environnementale
        </Typography>
        <Typography variant="h2" component="h2" sx={{ 
          fontSize: { xs: '1rem', sm: '2rem' },
          fontWeight: 600,
        }}>
          Tableau de bord IoT
        </Typography>
      </Box>

      {/* Barre de navigation */}
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          bgcolor: 'primary.main',
          color: 'white',
          boxShadow: 2,
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 48, sm: 64 } }}>
          <Typography variant="h6" noWrap component="div" sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            color: '#fff',
          }}>
            Moniteur de Température et Humidité
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="inherit" 
              onClick={() => fetchData()}
              startIcon={<RefreshIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              Rafraîchir
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              startIcon={<SettingsIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              Paramètres
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ 
        flexGrow: 1,
        p: { xs: 1, sm: 3 },
        width: '100%',
        pt: { xs: 8, sm: 10 },
        bgcolor: theme.background,
      }}>
        <Container maxWidth="lg" sx={{ 
          px: { xs: 1, sm: 3 },
          maxWidth: { xs: '100%', sm: 'lg' },
        }}>
          {error && (
            <Box sx={{ 
              mb: 3,
              p: 3,
              bgcolor: theme.error,
              color: '#fff',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <InfoIcon sx={{ color: '#fff' }} />
              <Typography variant="body1">{error}</Typography>
            </Box>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <DataCard 
                title="Température" 
                value={loading ? <CircularProgress size={24} /> : temperature} 
                unit="°C" 
                maxValue={50}
                loading={loading}
                trend={temperatureTrend}
                lastUpdate={lastUpdate}
                sx={{ 
                  height: { xs: 'auto', sm: '100%' },
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DataCard 
                title="Humidité" 
                value={loading ? <CircularProgress size={24} /> : humidity} 
                unit="%" 
                maxValue={100}
                loading={loading}
                trend={humidityTrend}
                lastUpdate={lastUpdate}
                sx={{ 
                  height: { xs: 'auto', sm: '100%' },
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
