/**
 * Welcome Overlay Component
 * Initial welcome screen for new users
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  IconButton,
  Fade,
  Backdrop,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  Calculate as CalculateIcon,
  Speed as SpeedIcon,
  Settings as SettingsIcon,
  HighQuality as QualityIcon,
  PlayArrow as StartIcon,
  School as LearnIcon,
} from '@mui/icons-material';
import { useOnboarding } from './OnboardingProvider';

// Feature highlight card
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  count: number;
}

function FeatureCard({ icon, title, description, count }: FeatureCardProps) {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            margin: '0 auto 16px',
          }}
        >
          {icon}
        </Box>
        
        <Typography variant="h6" component="h3" gutterBottom color="primary">
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" mb={2}>
          {description}
        </Typography>
        
        <Typography variant="h4" color="primary" fontWeight="bold">
          {count}
        </Typography>
        
        <Typography variant="caption" color="text.secondary">
          Calculators
        </Typography>
      </CardContent>
    </Card>
  );
}

// Main welcome overlay component
export function WelcomeOverlay() {
  const { state, actions } = useOnboarding();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Don't show if onboarding is disabled or user has seen welcome
  if (!state.userPreferences.showOnboarding || 
      state.completedTours.includes('welcome') ||
      state.skippedTours.includes('welcome')) {
    return null;
  }

  const handleStartTour = () => {
    if (dontShowAgain) {
      actions.updatePreferences({ showOnboarding: false });
    }
    actions.startTour('welcome');
  };

  const handleSkip = () => {
    if (dontShowAgain) {
      actions.updatePreferences({ showOnboarding: false });
    }
    actions.skipTour();
  };

  const handleClose = () => {
    actions.setShowOnboarding(false);
  };

  const features = [
    {
      icon: <CalculateIcon fontSize="large" />,
      title: 'Cost & Pricing',
      description: 'Comprehensive cost analysis and competitive pricing tools',
      count: 6,
    },
    {
      icon: <SpeedIcon fontSize="large" />,
      title: 'Time & Efficiency',
      description: 'Production planning and workflow optimization calculators',
      count: 6,
    },
    {
      icon: <SettingsIcon fontSize="large" />,
      title: 'Technical Parameters',
      description: 'Laser parameter optimization and setting guides',
      count: 8,
    },
    {
      icon: <QualityIcon fontSize="large" />,
      title: 'Quality Control',
      description: 'Quality prediction and defect prevention tools',
      count: 7,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <Backdrop
        open={true}
        sx={{
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      />

      {/* Welcome overlay */}
      <Fade in={true} timeout={500}>
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10000,
            width: isMobile ? '90vw' : '80vw',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <Paper
            elevation={24}
            sx={{
              p: isMobile ? 3 : 4,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            }}
          >
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
              <Box>
                <Typography variant="h3" component="h1" color="primary" gutterBottom>
                  Welcome to Laser Cutting Calculator
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Your professional toolkit for laser cutting optimization
                </Typography>
              </Box>
              <IconButton onClick={handleClose} size="large">
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Introduction */}
            <Typography variant="body1" color="text.primary" mb={4} sx={{ fontSize: '1.1rem' }}>
              Get started with our comprehensive platform featuring <strong>27 professional calculators</strong> 
              designed to optimize your laser cutting operations, reduce costs, and improve quality.
            </Typography>

            {/* Feature grid */}
            <Grid container spacing={3} mb={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <FeatureCard {...feature} />
                </Grid>
              ))}
            </Grid>

            {/* Benefits section */}
            <Box mb={4}>
              <Typography variant="h5" color="primary" gutterBottom>
                What you'll learn:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        mr: 2,
                      }}
                    />
                    <Typography variant="body1">
                      Navigate between calculator categories efficiently
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        mr: 2,
                      }}
                    />
                    <Typography variant="body1">
                      Input parameters and interpret results accurately
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        mr: 2,
                      }}
                    />
                    <Typography variant="body1">
                      Save calculations and manage your project history
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        mr: 2,
                      }}
                    />
                    <Typography variant="body1">
                      Export results in multiple formats (PDF, Excel, CSV)
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        mr: 2,
                      }}
                    />
                    <Typography variant="body1">
                      Use advanced features like parameter optimization
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        mr: 2,
                      }}
                    />
                    <Typography variant="body1">
                      Access help and support resources when needed
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Time estimate */}
            <Box 
              sx={{ 
                backgroundColor: theme.palette.action.hover,
                borderRadius: 2,
                p: 3,
                mb: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                ⏱️ Quick Start Tour
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Takes only <strong>5 minutes</strong> to complete and will help you become productive immediately
              </Typography>
            </Box>

            {/* Controls */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    color="primary"
                  />
                }
                label="Don't show this welcome screen again"
              />

              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  onClick={handleSkip}
                  startIcon={<LearnIcon />}
                  size="large"
                >
                  Skip Tour
                </Button>
                <Button
                  variant="contained"
                  onClick={handleStartTour}
                  startIcon={<StartIcon />}
                  size="large"
                  sx={{ minWidth: 160 }}
                >
                  Start Tour
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </>
  );
}

export default WelcomeOverlay;
