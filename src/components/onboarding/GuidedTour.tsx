/**
 * Guided Tour Component
 * Interactive tour overlay system for user onboarding
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Fade,
  Backdrop,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  SkipNext as SkipIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import { useOnboarding } from './OnboardingProvider';

// Highlight overlay component
interface HighlightOverlayProps {
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  children: React.ReactNode;
}

function HighlightOverlay({ target, position, children }: HighlightOverlayProps) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});
  const theme = useTheme();

  useEffect(() => {
    const element = document.querySelector(target) as HTMLElement;
    if (element) {
      setTargetElement(element);
      
      // Scroll element into view
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });

      // Calculate overlay position
      const rect = element.getBoundingClientRect();
      const padding = 8;
      
      let overlayPosition: React.CSSProperties = {};
      
      switch (position) {
        case 'top':
          overlayPosition = {
            top: rect.top - 200 - padding,
            left: rect.left + rect.width / 2,
            transform: 'translateX(-50%)',
          };
          break;
        case 'bottom':
          overlayPosition = {
            top: rect.bottom + padding,
            left: rect.left + rect.width / 2,
            transform: 'translateX(-50%)',
          };
          break;
        case 'left':
          overlayPosition = {
            top: rect.top + rect.height / 2,
            left: rect.left - 320 - padding,
            transform: 'translateY(-50%)',
          };
          break;
        case 'right':
          overlayPosition = {
            top: rect.top + rect.height / 2,
            left: rect.right + padding,
            transform: 'translateY(-50%)',
          };
          break;
        case 'center':
        default:
          overlayPosition = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          };
          break;
      }

      setOverlayStyle({
        position: 'fixed',
        zIndex: 9999,
        maxWidth: '300px',
        ...overlayPosition,
      });

      // Add highlight effect to target element
      element.style.position = 'relative';
      element.style.zIndex = '9998';
      element.style.boxShadow = `0 0 0 4px ${theme.palette.primary.main}40, 0 0 20px ${theme.palette.primary.main}60`;
      element.style.borderRadius = '8px';
      element.style.transition = 'all 0.3s ease';

    } else {
      console.warn(`Target element not found: ${target}`);
    }

    return () => {
      // Cleanup highlight effect
      if (element) {
        element.style.position = '';
        element.style.zIndex = '';
        element.style.boxShadow = '';
        element.style.borderRadius = '';
        element.style.transition = '';
      }
    };
  }, [target, position, theme]);

  if (!targetElement) {
    return null;
  }

  return (
    <Box sx={overlayStyle}>
      {children}
    </Box>
  );
}

// Tour step card component
interface TourStepCardProps {
  title: string;
  description: string;
  stepNumber: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoNext: boolean;
  canSkip: boolean;
  isAutoAdvancing: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onClose: () => void;
  onToggleAutoAdvance: () => void;
}

function TourStepCard({
  title,
  description,
  stepNumber,
  totalSteps,
  canGoBack,
  canGoNext,
  canSkip,
  isAutoAdvancing,
  onNext,
  onPrevious,
  onSkip,
  onClose,
  onToggleAutoAdvance,
}: TourStepCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const progress = ((stepNumber + 1) / totalSteps) * 100;

  return (
    <Paper
      elevation={8}
      sx={{
        p: 3,
        maxWidth: isMobile ? '280px' : '320px',
        backgroundColor: theme.palette.background.paper,
        border: `2px solid ${theme.palette.primary.main}`,
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h3" color="primary">
          {title}
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close tour">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Progress */}
      <Box mb={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Step {stepNumber + 1} of {totalSteps}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 6, borderRadius: 3 }}
        />
      </Box>

      {/* Description */}
      <Typography variant="body1" color="text.primary" mb={3}>
        {description}
      </Typography>

      {/* Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" gap={1}>
          {canGoBack && (
            <Button
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={onPrevious}
              variant="outlined"
            >
              Back
            </Button>
          )}
          
          {canSkip && (
            <Button
              size="small"
              startIcon={<SkipIcon />}
              onClick={onSkip}
              variant="text"
              color="secondary"
            >
              Skip
            </Button>
          )}
        </Box>

        <Box display="flex" gap={1} alignItems="center">
          <IconButton
            size="small"
            onClick={onToggleAutoAdvance}
            color={isAutoAdvancing ? 'primary' : 'default'}
            title={isAutoAdvancing ? 'Pause auto-advance' : 'Enable auto-advance'}
          >
            {isAutoAdvancing ? <PauseIcon /> : <PlayIcon />}
          </IconButton>

          {canGoNext && (
            <Button
              size="small"
              endIcon={<ArrowForwardIcon />}
              onClick={onNext}
              variant="contained"
              color="primary"
            >
              {stepNumber + 1 === totalSteps ? 'Finish' : 'Next'}
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

// Main guided tour component
export function GuidedTour() {
  const { state, actions, currentTourData, currentStepData } = useOnboarding();
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme();

  // Auto-advance functionality
  useEffect(() => {
    if (isAutoAdvancing && currentStepData?.duration && state.isActive) {
      autoAdvanceTimer.current = setTimeout(() => {
        actions.nextStep();
      }, currentStepData.duration);
    }

    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
    };
  }, [isAutoAdvancing, currentStepData, state.isActive, actions]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!state.isActive) return;

      switch (event.key) {
        case 'Escape':
          actions.skipTour();
          break;
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          actions.nextStep();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          actions.previousStep();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isActive, actions]);

  const handleToggleAutoAdvance = useCallback(() => {
    setIsAutoAdvancing(prev => !prev);
  }, []);

  // Don't render if tour is not active
  if (!state.isActive || !currentTourData || !currentStepData) {
    return null;
  }

  const canGoBack = state.currentStep > 0;
  const canGoNext = state.currentStep < currentTourData.steps.length - 1 || 
                   state.currentStep === currentTourData.steps.length - 1;
  const canSkip = currentStepData.skippable !== false;

  return (
    <>
      {/* Backdrop */}
      <Backdrop
        open={true}
        sx={{
          zIndex: 9997,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Tour overlay */}
      <Fade in={true} timeout={300}>
        <Box>
          {currentStepData.target ? (
            <HighlightOverlay
              target={currentStepData.target}
              position={currentStepData.position || 'bottom'}
            >
              <TourStepCard
                title={currentStepData.title}
                description={currentStepData.description}
                stepNumber={state.currentStep}
                totalSteps={currentTourData.steps.length}
                canGoBack={canGoBack}
                canGoNext={canGoNext}
                canSkip={canSkip}
                isAutoAdvancing={isAutoAdvancing}
                onNext={actions.nextStep}
                onPrevious={actions.previousStep}
                onSkip={actions.skipStep}
                onClose={actions.skipTour}
                onToggleAutoAdvance={handleToggleAutoAdvance}
              />
            </HighlightOverlay>
          ) : (
            // Center overlay for steps without specific targets
            <Box
              sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
              }}
            >
              <TourStepCard
                title={currentStepData.title}
                description={currentStepData.description}
                stepNumber={state.currentStep}
                totalSteps={currentTourData.steps.length}
                canGoBack={canGoBack}
                canGoNext={canGoNext}
                canSkip={canSkip}
                isAutoAdvancing={isAutoAdvancing}
                onNext={actions.nextStep}
                onPrevious={actions.previousStep}
                onSkip={actions.skipStep}
                onClose={actions.skipTour}
                onToggleAutoAdvance={handleToggleAutoAdvance}
              />
            </Box>
          )}
        </Box>
      </Fade>
    </>
  );
}

export default GuidedTour;
