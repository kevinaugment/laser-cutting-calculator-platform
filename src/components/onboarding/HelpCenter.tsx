/**
 * Help Center Component
 * Comprehensive help and documentation system
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  QuestionAnswer as FAQIcon,
  VideoLibrary as VideoIcon,
  MenuBook as GuideIcon,
  BugReport as BugIcon,
  Lightbulb as TipIcon,
  Close as CloseIcon,
  PlayCircle as PlayIcon,
} from '@mui/icons-material';

// Help article interface
interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: 'getting-started' | 'calculators' | 'features' | 'troubleshooting' | 'advanced';
  tags: string[];
  searchTerms: string[];
}

// FAQ item interface
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

// Video tutorial interface
interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
  url: string;
}

// Sample help content
const helpArticles: HelpArticle[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with Laser Cutting Calculator',
    content: 'Welcome to the Laser Cutting Calculator platform! This guide will help you get started with your first calculation...',
    category: 'getting-started',
    tags: ['beginner', 'introduction', 'first-time'],
    searchTerms: ['start', 'begin', 'new', 'first', 'introduction'],
  },
  {
    id: 'cost-calculator-guide',
    title: 'How to Use the Cost Calculator',
    content: 'The Laser Cutting Cost Calculator helps you determine accurate costs for your projects. Here\'s how to use it effectively...',
    category: 'calculators',
    tags: ['cost', 'pricing', 'calculator'],
    searchTerms: ['cost', 'price', 'money', 'budget', 'expense'],
  },
  {
    id: 'unit-conversion',
    title: 'Understanding Unit Conversion',
    content: 'Our platform supports both metric and imperial units. Learn how to switch between units and ensure accurate calculations...',
    category: 'features',
    tags: ['units', 'conversion', 'metric', 'imperial'],
    searchTerms: ['units', 'metric', 'imperial', 'mm', 'inches', 'conversion'],
  },
  {
    id: 'export-results',
    title: 'Exporting Your Results',
    content: 'Learn how to export your calculation results in various formats including PDF, Excel, and CSV...',
    category: 'features',
    tags: ['export', 'pdf', 'excel', 'csv'],
    searchTerms: ['export', 'download', 'save', 'pdf', 'excel', 'csv'],
  },
  {
    id: 'troubleshooting-calculations',
    title: 'Troubleshooting Common Issues',
    content: 'Having trouble with calculations? Here are solutions to the most common issues users encounter...',
    category: 'troubleshooting',
    tags: ['troubleshooting', 'problems', 'errors'],
    searchTerms: ['problem', 'error', 'issue', 'trouble', 'help', 'fix'],
  },
];

const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How accurate are the calculations?',
    answer: 'Our calculations are based on industry-standard formulas and real-world data. They provide professional-grade accuracy suitable for commercial use.',
    category: 'General',
    tags: ['accuracy', 'precision', 'reliability'],
  },
  {
    id: 'faq-2',
    question: 'Can I save my calculations?',
    answer: 'Yes! All calculations are automatically saved to your browser\'s local storage. You can also export them in various formats.',
    category: 'Features',
    tags: ['save', 'storage', 'history'],
  },
  {
    id: 'faq-3',
    question: 'Is the platform free to use?',
    answer: 'The basic features are free to use. Premium features like advanced analytics and team collaboration require a subscription.',
    category: 'Pricing',
    tags: ['free', 'pricing', 'subscription'],
  },
  {
    id: 'faq-4',
    question: 'Does it work on mobile devices?',
    answer: 'Absolutely! The platform is fully responsive and optimized for mobile devices, tablets, and desktops.',
    category: 'Technical',
    tags: ['mobile', 'responsive', 'compatibility'],
  },
];

const videoTutorials: VideoTutorial[] = [
  {
    id: 'video-1',
    title: 'Platform Overview',
    description: 'A comprehensive overview of all platform features and capabilities',
    duration: '5:30',
    thumbnail: '/images/video-thumbnails/overview.jpg',
    category: 'Getting Started',
    url: '#',
  },
  {
    id: 'video-2',
    title: 'Cost Calculator Deep Dive',
    description: 'Learn how to use the cost calculator for accurate project pricing',
    duration: '8:15',
    thumbnail: '/images/video-thumbnails/cost-calculator.jpg',
    category: 'Calculators',
    url: '#',
  },
  {
    id: 'video-3',
    title: 'Advanced Features',
    description: 'Explore advanced features like parameter optimization and comparison mode',
    duration: '12:45',
    thumbnail: '/images/video-thumbnails/advanced.jpg',
    category: 'Advanced',
    url: '#',
  },
];

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Help Center component
interface HelpCenterProps {
  open: boolean;
  onClose: () => void;
}

export function HelpCenter({ open, onClose }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<string | false>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Filter content based on search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery) return helpArticles;
    
    const query = searchQuery.toLowerCase();
    return helpArticles.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query)) ||
      article.searchTerms.some(term => term.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const filteredFAQs = useMemo(() => {
    if (!searchQuery) return faqItems;
    
    const query = searchQuery.toLowerCase();
    return faqItems.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const filteredVideos = useMemo(() => {
    if (!searchQuery) return videoTutorials;
    
    const query = searchQuery.toLowerCase();
    return videoTutorials.filter(video =>
      video.title.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query) ||
      video.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: '900px',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h5" color="primary">
            Help Center
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Search */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            placeholder="Search help articles, FAQs, and tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
          >
            <Tab icon={<GuideIcon />} label="Articles" />
            <Tab icon={<FAQIcon />} label="FAQ" />
            <Tab icon={<VideoIcon />} label="Videos" />
            <Tab icon={<TipIcon />} label="Tips" />
          </Tabs>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {/* Articles Tab */}
          <TabPanel value={selectedTab} index={0}>
            <Box sx={{ px: 3 }}>
              {filteredArticles.length === 0 ? (
                <Typography color="text.secondary" textAlign="center">
                  No articles found matching your search.
                </Typography>
              ) : (
                <List>
                  {filteredArticles.map((article) => (
                    <ListItem key={article.id} divider>
                      <ListItemIcon>
                        <HelpIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={article.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {article.content.substring(0, 150)}...
                            </Typography>
                            <Box display="flex" gap={1} flexWrap="wrap">
                              {article.tags.map((tag) => (
                                <Chip key={tag} label={tag} size="small" variant="outlined" />
                              ))}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </TabPanel>

          {/* FAQ Tab */}
          <TabPanel value={selectedTab} index={1}>
            <Box sx={{ px: 3 }}>
              {filteredFAQs.length === 0 ? (
                <Typography color="text.secondary" textAlign="center">
                  No FAQs found matching your search.
                </Typography>
              ) : (
                filteredFAQs.map((faq) => (
                  <Accordion
                    key={faq.id}
                    expanded={expandedFAQ === faq.id}
                    onChange={(_, isExpanded) => setExpandedFAQ(isExpanded ? faq.id : false)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {faq.answer}
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip label={faq.category} size="small" color="primary" />
                        {faq.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </Box>
          </TabPanel>

          {/* Videos Tab */}
          <TabPanel value={selectedTab} index={2}>
            <Box sx={{ px: 3 }}>
              {filteredVideos.length === 0 ? (
                <Typography color="text.secondary" textAlign="center">
                  No videos found matching your search.
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {filteredVideos.map((video) => (
                    <Grid item xs={12} md={6} key={video.id}>
                      <Card>
                        <Box
                          sx={{
                            position: 'relative',
                            paddingTop: '56.25%', // 16:9 aspect ratio
                            backgroundColor: theme.palette.grey[200],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <PlayIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              bottom: 8,
                              right: 8,
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              color: 'white',
                              px: 1,
                              borderRadius: 1,
                            }}
                          >
                            {video.duration}
                          </Typography>
                        </Box>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {video.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {video.description}
                          </Typography>
                          <Chip label={video.category} size="small" color="primary" />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </TabPanel>

          {/* Tips Tab */}
          <TabPanel value={selectedTab} index={3}>
            <Box sx={{ px: 3 }}>
              <Typography variant="h6" gutterBottom>
                Pro Tips for Better Results
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TipIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Double-check your units"
                    secondary="Always verify that you're using the correct units (metric vs imperial) for consistent results."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TipIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Save frequently used parameters"
                    secondary="Create presets for material types and settings you use often to speed up future calculations."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TipIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Use the comparison feature"
                    secondary="Compare different scenarios side-by-side to make informed decisions about parameters and costs."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TipIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Export for documentation"
                    secondary="Export your calculations as PDF reports for client presentations and project documentation."
                  />
                </ListItem>
              </List>
            </Box>
          </TabPanel>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            borderTop: 1,
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Still need help? Contact our support team
          </Typography>
          <Button variant="outlined" startIcon={<BugIcon />}>
            Report an Issue
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default HelpCenter;
