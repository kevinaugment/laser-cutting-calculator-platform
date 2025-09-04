import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Rating,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Slider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import {
  BugReport,
  Lightbulb,
  ThumbUp,
  ThumbDown,
  Star,
  Send,
  Screenshot,
  Mic,
  VideoCall
} from '@mui/icons-material';

interface FeedbackData {
  type: 'bug' | 'feature' | 'usability' | 'performance' | 'general';
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  rating: number;
  usabilityScore: number;
  taskCompletion: boolean;
  timeToComplete?: number;
  difficulty: number;
  satisfaction: number;
  wouldRecommend: boolean;
  browserInfo: string;
  deviceInfo: string;
  screenshot?: File;
  userProfile: {
    experience: string;
    role: string;
    industry: string;
  };
}

interface UATFeedbackSystemProps {
  calculatorName?: string;
  taskId?: string;
  onFeedbackSubmit?: (feedback: FeedbackData) => void;
}

export const UATFeedbackSystem: React.FC<UATFeedbackSystemProps> = ({
  calculatorName,
  taskId,
  onFeedbackSubmit
}) => {
  const [open, setOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackData['type']>('general');
  const [formData, setFormData] = useState<Partial<FeedbackData>>({
    type: 'general',
    severity: 'medium',
    rating: 5,
    usabilityScore: 5,
    taskCompletion: true,
    difficulty: 3,
    satisfaction: 5,
    wouldRecommend: true,
    browserInfo: navigator.userAgent,
    deviceInfo: `${navigator.platform} - ${screen.width}x${screen.height}`,
    userProfile: {
      experience: '',
      role: '',
      industry: ''
    }
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(4);

  // Auto-collect context information
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      category: calculatorName || 'General Platform',
      browserInfo: navigator.userAgent,
      deviceInfo: `${navigator.platform} - ${screen.width}x${screen.height}`
    }));
  }, [calculatorName]);

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('userProfile.')) {
      const profileField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        userProfile: {
          ...prev.userProfile!,
          [profileField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleScreenshot = async () => {
    try {
      // In a real implementation, this would capture a screenshot
      // For now, we'll simulate the functionality
      console.log('Screenshot functionality would be implemented here');
      alert('Screenshot captured! (This is a simulation)');
    } catch (error) {
      console.error('Screenshot failed:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const completeData: FeedbackData = {
        ...formData,
        timestamp: new Date().toISOString(),
        taskId,
        calculatorName
      } as FeedbackData;

      // In a real implementation, this would send to backend
      console.log('Submitting feedback:', completeData);
      
      if (onFeedbackSubmit) {
        onFeedbackSubmit(completeData);
      }

      setShowSuccess(true);
      setOpen(false);
      
      // Reset form
      setFormData({
        type: 'general',
        severity: 'medium',
        rating: 5,
        usabilityScore: 5,
        taskCompletion: true,
        difficulty: 3,
        satisfaction: 5,
        wouldRecommend: true,
        browserInfo: navigator.userAgent,
        deviceInfo: `${navigator.platform} - ${screen.width}x${screen.height}`,
        userProfile: {
          experience: '',
          role: '',
          industry: ''
        }
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Feedback Type & Basic Information
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Feedback Type</InputLabel>
              <Select
                value={feedbackType}
                onChange={(e) => {
                  setFeedbackType(e.target.value as FeedbackData['type']);
                  handleInputChange('type', e.target.value);
                }}
              >
                <MenuItem value="bug">🐛 Bug Report</MenuItem>
                <MenuItem value="feature">💡 Feature Request</MenuItem>
                <MenuItem value="usability">👤 Usability Issue</MenuItem>
                <MenuItem value="performance">⚡ Performance Issue</MenuItem>
                <MenuItem value="general">💬 General Feedback</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              margin="normal"
              multiline
              rows={4}
              required
            />

            {(feedbackType === 'bug' || feedbackType === 'usability') && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Severity</InputLabel>
                <Select
                  value={formData.severity}
                  onChange={(e) => handleInputChange('severity', e.target.value)}
                >
                  <MenuItem value="low">Low - Minor issue</MenuItem>
                  <MenuItem value="medium">Medium - Moderate impact</MenuItem>
                  <MenuItem value="high">High - Significant impact</MenuItem>
                  <MenuItem value="critical">Critical - Blocks usage</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Detailed Information
            </Typography>

            {feedbackType === 'bug' && (
              <>
                <TextField
                  fullWidth
                  label="Steps to Reproduce"
                  value={formData.stepsToReproduce || ''}
                  onChange={(e) => handleInputChange('stepsToReproduce', e.target.value)}
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="1. Go to...\n2. Click on...\n3. Enter..."
                />

                <TextField
                  fullWidth
                  label="Expected Behavior"
                  value={formData.expectedBehavior || ''}
                  onChange={(e) => handleInputChange('expectedBehavior', e.target.value)}
                  margin="normal"
                  multiline
                  rows={2}
                />

                <TextField
                  fullWidth
                  label="Actual Behavior"
                  value={formData.actualBehavior || ''}
                  onChange={(e) => handleInputChange('actualBehavior', e.target.value)}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </>
            )}

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Screenshot />}
                onClick={handleScreenshot}
                sx={{ mr: 1 }}
              >
                Capture Screenshot
              </Button>
              <Button
                variant="outlined"
                startIcon={<Mic />}
                sx={{ mr: 1 }}
              >
                Record Audio
              </Button>
              <Button
                variant="outlined"
                startIcon={<VideoCall />}
              >
                Record Screen
              </Button>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              User Experience Evaluation
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography component="legend">Overall Rating</Typography>
              <Rating
                value={formData.rating}
                onChange={(_, value) => handleInputChange('rating', value || 0)}
                size="large"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography component="legend">Usability Score (1-10)</Typography>
              <Slider
                value={formData.usabilityScore}
                onChange={(_, value) => handleInputChange('usabilityScore', value)}
                min={1}
                max={10}
                marks
                valueLabelDisplay="on"
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.taskCompletion}
                  onChange={(e) => handleInputChange('taskCompletion', e.target.checked)}
                />
              }
              label="I was able to complete my intended task"
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography component="legend">Task Difficulty (1-5)</Typography>
              <RadioGroup
                row
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', parseInt(e.target.value))}
              >
                <FormControlLabel value={1} control={<Radio />} label="Very Easy" />
                <FormControlLabel value={2} control={<Radio />} label="Easy" />
                <FormControlLabel value={3} control={<Radio />} label="Moderate" />
                <FormControlLabel value={4} control={<Radio />} label="Hard" />
                <FormControlLabel value={5} control={<Radio />} label="Very Hard" />
              </RadioGroup>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography component="legend">Satisfaction Level</Typography>
              <Rating
                value={formData.satisfaction}
                onChange={(_, value) => handleInputChange('satisfaction', value || 0)}
                size="large"
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.wouldRecommend}
                  onChange={(e) => handleInputChange('wouldRecommend', e.target.checked)}
                />
              }
              label="I would recommend this platform to colleagues"
            />
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              User Profile Information
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Experience Level</InputLabel>
              <Select
                value={formData.userProfile?.experience || ''}
                onChange={(e) => handleInputChange('userProfile.experience', e.target.value)}
              >
                <MenuItem value="beginner">Beginner (0-1 years)</MenuItem>
                <MenuItem value="intermediate">Intermediate (2-5 years)</MenuItem>
                <MenuItem value="advanced">Advanced (5-10 years)</MenuItem>
                <MenuItem value="expert">Expert (10+ years)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.userProfile?.role || ''}
                onChange={(e) => handleInputChange('userProfile.role', e.target.value)}
              >
                <MenuItem value="operator">Machine Operator</MenuItem>
                <MenuItem value="engineer">Engineer</MenuItem>
                <MenuItem value="manager">Production Manager</MenuItem>
                <MenuItem value="owner">Business Owner</MenuItem>
                <MenuItem value="programmer">Programmer/Setup</MenuItem>
                <MenuItem value="sales">Sales/Estimating</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Industry</InputLabel>
              <Select
                value={formData.userProfile?.industry || ''}
                onChange={(e) => handleInputChange('userProfile.industry', e.target.value)}
              >
                <MenuItem value="automotive">Automotive</MenuItem>
                <MenuItem value="aerospace">Aerospace</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="medical">Medical Devices</MenuItem>
                <MenuItem value="architecture">Architecture/Construction</MenuItem>
                <MenuItem value="signage">Signage/Display</MenuItem>
                <MenuItem value="general">General Manufacturing</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" gutterBottom>
                Technical Information (Auto-collected)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browser: {formData.browserInfo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Device: {formData.deviceInfo}
              </Typography>
              {calculatorName && (
                <Typography variant="body2" color="text.secondary">
                  Calculator: {calculatorName}
                </Typography>
              )}
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          startIcon={<Send />}
          sx={{
            borderRadius: '25px',
            px: 3,
            py: 1.5,
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6
            }
          }}
        >
          Provide Feedback
        </Button>
      </Box>

      {/* Feedback Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '600px' }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">
              UAT Feedback - Step {currentStep} of {totalSteps}
            </Typography>
            <Chip
              label={`${calculatorName || 'Platform'} Testing`}
              color="primary"
              variant="outlined"
            />
          </Box>
        </DialogTitle>

        <DialogContent>
          {renderStepContent()}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              variant="contained"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!formData.title || !formData.description}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!formData.title || !formData.description}
              startIcon={<Send />}
            >
              Submit Feedback
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Success Notification */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Thank you for your feedback! Your input helps us improve the platform.
        </Alert>
      </Snackbar>
    </>
  );
};

export default UATFeedbackSystem;
