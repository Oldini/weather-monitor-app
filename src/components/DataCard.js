import React from 'react';
import {
  Card,
  Typography,
  Box,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const DataCard = ({ title, value, unit, maxValue = 100, loading = false, trend = 0, lastUpdate }) => {
  const theme = useTheme();

  const trendColor = () => {
    if (trend === 0) return 'text.secondary';
    return trend > 0 ? 'success.main' : 'error.main';
  };

  const trendIcon = () => {
    if (trend === 0) return null;
    return trend > 0 ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />;
  };

  const valueColor = () => {
    if (value < maxValue * 0.3) return 'success.main';
    if (value > maxValue * 0.7) return 'error.main';
    return 'primary.main';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        p: 2,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h4" color={valueColor()}>
              {loading ? <CircularProgress size={24} /> : value}
            </Typography>
            <Typography variant="h4" color="text.secondary">
              {unit}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            {trendIcon()}
            <Typography variant="body1" color={trendColor()}>
              {trend.toFixed(1)}
            </Typography>
          </Box>
        </Box>
        <Avatar 
          sx={{ 
            bgcolor: valueColor(),
            width: 48,
            height: 48,
          }}
        >
          {value >= 0 ? value.toFixed(0) : '?'}
        </Avatar>
      </Box>
      <Box sx={{ mt: 2 }}>
        <LinearProgress
          variant="determinate"
          value={(value / maxValue) * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            },
          }}
        />
      </Box>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Mis à jour il y a {lastUpdate ? Math.floor((new Date() - lastUpdate) / 1000) + 's' : '...'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Paramètres">
            <IconButton size="small" color="inherit">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Informations">
            <IconButton size="small" color="inherit">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};

export default DataCard;
