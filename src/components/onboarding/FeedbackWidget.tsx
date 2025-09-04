/**
 * Feedback Widget Component
 * Collects user feedback and suggestions
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Rating,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Snackbar,
  Alert,
  Slide,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  Close as CloseIcon,
  Send as SendIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  BugReport as BugIcon,
  Lightbulb as IdeaIcon,
  Star as StarIcon,
} from '@mui/icons-material';

// Feedback type
interface FeedbackData {
  type: 'bug' | 'feature' | 'improvement' | 'general';
  rating: number;
  title: string;
  description: string;
  category: string;
  email?: string;
  userAgent: string;
  url: string;
  timestamp: number;
}

// Feedback categories
const feedbackCategories = [
  'User Interface',
  'Calculator Accuracy',
  'Performance',
  'Mobile Experience',
  'Documentation',
  'Feature Request',
  'Other',
];

// Quick feedback options
const quickFeedbackOptions = [
  { label: 'Love it!', icon: '😍', rating: 5 },
  { label: 'Good', icon: '👍', rating: 4 },
  { label: 'Okay', icon: '😐', rating: 3 },
  { label: 'Poor', icon: '👎', rating: 2 },
  { label: 'Terrible', icon: '😞', rating: 1 },
];

// Floating feedback button
interface FeedbackButtonProps {
  onClick: () => void;
}

function FeedbackButton({ onClick }: FeedbackButtonProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Fab
      color="primary"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: isMobile ? 16 : 24,
        right: isMobile ? 16 : 24,
        zIndex: 1000,
      }}
      aria-label="Give feedback"
    >
      <FeedbackIcon />
    </Fab>
  );
}

// Main feedback widget
interface FeedbackWidgetProps {
  calculatorId?: string;
  context?: string;
}

export function FeedbackWidget({ calculatorId, context }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'quick' | 'detailed'>('quick');
  const [feedbackData, setFeedbackData] = useState<Partial<FeedbackData>>({
    type: 'general',
    rating: 0,
    title: '',
    description: '',
    category: 'General',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = () => {
    setIsOpen(true);
    setStep('quick');
    setFeedbackData({
      type: 'general',
      rating: 0,
      title: '',
      description: '',
      category: 'General',
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep('quick');
  };

  const handleQuickFeedback = (rating: number) => {
    setFeedbackData(prev => ({ ...prev, rating }));
    if (rating >= 4) {
      // High rating - submit directly
      submitFeedback({ ...feedbackData, rating, type: 'general', title: 'Quick feedback' });
    } else {
      // Low rating - ask for details
      setStep('detailed');
    }
  };

  const handleDetailedSubmit = () => {
    if (!feedbackData.title || !feedbackData.description) {
      return;
    }
    submitFeedback(feedbackData as FeedbackData);
  };

  const submitFeedback = async (data: Partial<FeedbackData>) => {
    setIsSubmitting(true);

    try {
      const feedbackPayload: FeedbackData = {
        ...data,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
      } as FeedbackData;

      // Add context information
      if (calculatorId) {
        feedbackPayload.title = `[${calculatorId}] ${feedbackPayload.title}`;
      }
      if (context) {
        feedbackPayload.description = `Context: ${context}\n\n${feedbackPayload.description}`;
      }

      // In a real app, this would send to your feedback API
      console.log('Feedback submitted:', feedbackPayload);
      
      // Store locally for now
      const existingFeedback = JSON.parse(localStorage.getItem('user-feedback') || '[]');
      existingFeedback.push(feedbackPayload);
      localStorage.setItem('user-feedback', JSON.stringify(existingFeedback));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setShowSuccess(true);
      handleClose();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating feedback button */}
      <FeedbackButton onClick={handleOpen} />

      {/* Feedback dialog */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              {step === 'quick' ? 'How was your experience?' : 'Tell us more'}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {step === 'quick' ? (
            // Quick feedback step
            <Box textAlign="center">
              <Typography variant="body1" color="text.secondary" mb={3}>
                Your feedback helps us improve the platform
              </Typography>

              <Box display="flex" justifyContent="center" gap={2} mb={3}>
                {quickFeedbackOptions.map((option) => (
                  <Button
                    key={option.rating}
                    variant="outlined"
                    onClick={() => handleQuickFeedback(option.rating)}
                    sx={{
                      minWidth: 80,
                      height: 80,
                      flexDirection: 'column',
                      gap: 1,
                      fontSize: '1.5rem',
                    }}
                  >
                    <span>{option.icon}</span>
                    <Typography variant="caption">{option.label}</Typography>
                  </Button>
                ))}
              </Box>

              <Typography variant="body2" color="text.secondary">
                Or click below for detailed feedback
              </Typography>

              <Button
                variant="text"
                onClick={() => setStep('detailed')}
                sx={{ mt: 2 }}
              >
                Give detailed feedback
              </Button>
            </Box>
          ) : (
            // Detailed feedback step
            <Box>
              {/* Feedback type */}
              <FormControl component="fieldset" fullWidth margin="normal">
                <FormLabel component="legend">Feedback Type</FormLabel>
                <RadioGroup
                  row
                  value={feedbackData.type}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <FormControlLabel
                    value="bug"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <BugIcon fontSize="small" />
                        Bug Report
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="feature"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <IdeaIcon fontSize="small" />
                        Feature Request
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="improvement"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <ThumbUpIcon fontSize="small" />
                        Improvement
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="general"
                    control={<Radio />}
                    label="General"
                  />
                </RadioGroup>
              </FormControl>

              {/* Rating */}
              <Box mb={3}>
                <Typography component="legend" gutterBottom>
                  Overall Rating
                </Typography>
                <Rating
                  value={feedbackData.rating}
                  onChange={(_, value) => setFeedbackData(prev => ({ ...prev, rating: value || 0 }))}
                  size="large"
                />
              </Box>

              {/* Category */}
              <FormControl fullWidth margin="normal">
                <Typography variant="body2" gutterBottom>
                  Category
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {feedbackCategories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      clickable
                      color={feedbackData.category === category ? 'primary' : 'default'}
                      onClick={() => setFeedbackData(prev => ({ ...prev, category }))}
                    />
                  ))}
                </Box>
              </FormControl>

              {/* Title */}
              <TextField
                fullWidth
                label="Title"
                value={feedbackData.title}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, title: e.target.value }))}
                margin="normal"
                required
                placeholder="Brief summary of your feedback"
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                value={feedbackData.description}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, description: e.target.value }))}
                margin="normal"
                required
                multiline
                rows={4}
                placeholder="Please provide detailed information about your feedback"
              />

              {/* Email (optional) */}
              <TextField
                fullWidth
                label="Email (optional)"
                type="email"
                value={feedbackData.email || ''}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, email: e.target.value }))}
                margin="normal"
                placeholder="We'll only use this to follow up on your feedback"
              />
            </Box>
          )}
        </DialogContent>

        {step === 'detailed' && (
          <DialogActions>
            <Button onClick={() => setStep('quick')}>
              Back
            </Button>
            <Button
              onClick={handleDetailedSubmit}
              variant="contained"
              disabled={!feedbackData.title || !feedbackData.description || isSubmitting}
              startIcon={<SendIcon />}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Success notification */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          variant="filled"
        >
          Thank you for your feedback! We'll review it and get back to you if needed.
        </Alert>
      </Snackbar>
    </>
  );
}

export default FeedbackWidget;
