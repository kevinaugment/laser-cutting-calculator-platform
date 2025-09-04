/**
 * Help Button Component
 * Quick access to help and onboarding features
 */

import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Help as HelpIcon,
  School as TourIcon,
  MenuBook as DocsIcon,
  QuestionAnswer as FAQIcon,
  Feedback as FeedbackIcon,
  Refresh as RestartIcon,
  PlayArrow as StartIcon,
} from '@mui/icons-material';
import { useOnboarding, getNextRecommendedTour } from './OnboardingProvider';
import { HelpCenter } from './HelpCenter';

interface HelpButtonProps {
  showBadge?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function HelpButton({ showBadge = true, size = 'medium' }: HelpButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const { state, actions } = useOnboarding();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStartTour = (tourId: string) => {
    actions.startTour(tourId);
    handleClose();
  };

  const handleRestartOnboarding = () => {
    actions.resetAllTours();
    actions.startTour('welcome');
    handleClose();
  };

  const handleOpenHelpCenter = () => {
    setShowHelpCenter(true);
    handleClose();
  };

  // Get next recommended tour
  const nextTour = getNextRecommendedTour(state.completedTours);
  
  // Show badge if there are uncompleted tours or if user hasn't seen onboarding
  const shouldShowBadge = showBadge && (
    state.completedTours.length === 0 || 
    (nextTour && !state.skippedTours.includes(nextTour.id))
  );

  return (
    <>
      <Tooltip title="Help & Tours">
        <IconButton
          onClick={handleClick}
          size={size}
          color="inherit"
          data-testid="help-button"
          aria-label="Help and tutorials"
        >
          <Badge color="primary" variant="dot" invisible={!shouldShowBadge}>
            <HelpIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 8,
          sx: {
            minWidth: 220,
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Help Center */}
        <MenuItem onClick={handleOpenHelpCenter}>
          <ListItemIcon>
            <DocsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help Center</ListItemText>
        </MenuItem>

        <Divider />

        {/* Welcome Tour */}
        <MenuItem 
          onClick={() => handleStartTour('welcome')}
          disabled={state.isActive}
        >
          <ListItemIcon>
            <StartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Welcome Tour
            {state.completedTours.includes('welcome') && ' ✓'}
          </ListItemText>
        </MenuItem>

        {/* Next Recommended Tour */}
        {nextTour && (
          <MenuItem 
            onClick={() => handleStartTour(nextTour.id)}
            disabled={state.isActive}
          >
            <ListItemIcon>
              <TourIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {nextTour.name}
              <Badge color="primary" variant="dot" sx={{ ml: 1 }} />
            </ListItemText>
          </MenuItem>
        )}

        {/* Calculator Category Tours */}
        {state.completedTours.includes('welcome') && (
          <>
            <MenuItem 
              onClick={() => handleStartTour('cost-category')}
              disabled={state.isActive}
            >
              <ListItemIcon>
                <TourIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                Cost Calculators Tour
                {state.completedTours.includes('cost-category') && ' ✓'}
              </ListItemText>
            </MenuItem>

            <MenuItem 
              onClick={() => handleStartTour('first-calculator')}
              disabled={state.isActive}
            >
              <ListItemIcon>
                <TourIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                Using Calculators
                {state.completedTours.includes('first-calculator') && ' ✓'}
              </ListItemText>
            </MenuItem>
          </>
        )}

        {/* Advanced Features Tour */}
        {state.completedTours.includes('welcome') && 
         state.completedTours.includes('first-calculator') && (
          <MenuItem 
            onClick={() => handleStartTour('advanced-features')}
            disabled={state.isActive}
          >
            <ListItemIcon>
              <TourIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              Advanced Features
              {state.completedTours.includes('advanced-features') && ' ✓'}
            </ListItemText>
          </MenuItem>
        )}

        <Divider />

        {/* Restart Onboarding */}
        <MenuItem 
          onClick={handleRestartOnboarding}
          disabled={state.isActive}
        >
          <ListItemIcon>
            <RestartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Restart Onboarding</ListItemText>
        </MenuItem>

        <Divider />

        {/* FAQ */}
        <MenuItem onClick={handleOpenHelpCenter}>
          <ListItemIcon>
            <FAQIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>FAQ</ListItemText>
        </MenuItem>

        {/* Feedback */}
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <FeedbackIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Give Feedback</ListItemText>
        </MenuItem>
      </Menu>

      {/* Help Center Dialog */}
      <HelpCenter 
        open={showHelpCenter} 
        onClose={() => setShowHelpCenter(false)} 
      />
    </>
  );
}

export default HelpButton;
