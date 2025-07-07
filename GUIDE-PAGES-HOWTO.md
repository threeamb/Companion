# Adding New Guide Pages

This guide explains how to add new guide pages to the 3AMB Guidebook application.

## Overview

The 3AMB Guidebook uses a dynamic system for guide pages that automatically:
- Lists all guide pages as clickable cards on the home page
- Provides search functionality using tags and metadata
- Handles routing between pages
- Enables filtering by categories and tags

## Step-by-Step Guide

### 1. Create Your Guide Page Component

Create a new file in `src/guidepages/` with a descriptive name (e.g., `equipmentmaintenance.js`):

```javascript
import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  // Add other MUI components as needed
} from '@mui/material';
import {
  // Import relevant Material-UI icons
} from '@mui/icons-material';

const YourGuidePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Your Guide Title
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Brief description of what this guide covers
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="Tag 1" size="small" />
          <Chip label="Tag 2" size="small" />
          <Chip label="Tag 3" size="small" />
        </Stack>
      </Box>

      {/* Your content here */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Section Title
          </Typography>
          <Typography variant="body1" paragraph>
            Your content here...
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

// Export with metadata for dynamic loading
export const yourGuidePageMetadata = {
  id: 'your-guide-page-id',
  title: 'Your Guide Title',
  description: 'Detailed description that will appear on the card and in search results',
  tags: ['tag1', 'tag2', 'tag3', 'searchable keywords'],
  category: 'Your Category', // e.g., 'Operations', 'Security', 'Human Resources', 'Technical'
  lastUpdated: 'Month YYYY',
  estimatedReadTime: 'X min'
};

export default YourGuidePage;
```

### 2. Register Your Guide Page

Edit `src/guidepages/index.js` to include your new guide:

```javascript
// Add your import at the top
import YourGuidePage, { yourGuidePageMetadata } from './yourguidepage';

// Add your page to the guidePages array
export const guidePages = [
  // ... existing pages ...
  {
    component: YourGuidePage,
    metadata: yourGuidePageMetadata,
    path: '/guide/your-guide-page'
  },
];
```

### 3. Metadata Guidelines

#### Required Fields
- **id**: Unique identifier (lowercase, hyphenated)
- **title**: Display title for the guide
- **description**: Brief description for search and cards
- **tags**: Array of searchable keywords
- **category**: High-level category for filtering
- **lastUpdated**: When the guide was last updated
- **estimatedReadTime**: Approximate reading time

#### Tag Best Practices
- Use lowercase for consistency
- Include relevant keywords users might search for
- Think about different ways users might refer to the same concept
- Include both specific and general terms
- Examples: ['security', 'access control', 'passwords', 'authentication', 'login']

#### Category Examples
- **Operations**: Day-to-day operational procedures
- **Security**: Security protocols and procedures
- **Human Resources**: HR policies and procedures
- **Technical**: Technical documentation and guides
- **Compliance**: Regulatory and compliance procedures
- **Training**: Training materials and guides

### 4. Design Guidelines

#### Header Structure
All guide pages should start with:
1. Main title (h3)
2. Brief description (h6, secondary color)
3. Tag chips for visual categorization

#### Content Organization
- Use Material-UI Cards for major sections
- Include appropriate icons from @mui/icons-material
- Use consistent typography hierarchy
- Add alerts for important information

#### Interactive Elements
- Use Lists for step-by-step procedures
- Include Steppers for sequential processes
- Add Alerts for warnings, tips, or important notes
- Use Grids for organizing content layouts

### 5. Testing Your Guide Page

1. Start the development server: `npm start`
2. Navigate to the home page
3. Verify your guide appears as a card
4. Test the search functionality with your tags
5. Test navigation to and from your guide page
6. Verify the breadcrumb navigation works

### 6. Example Categories and Tags

Here are some examples to maintain consistency:

**Operations**
- Tags: operations, procedures, daily tasks, opening, closing, inventory, store management

**Security**
- Tags: security, access control, passwords, authentication, data protection, incident response

**Human Resources**
- Tags: hr, onboarding, training, policies, benefits, performance, recruitment

**Technical**
- Tags: technical, systems, software, troubleshooting, maintenance, setup, configuration

### 7. Content Tips

- Write clear, actionable content
- Include step-by-step instructions where appropriate
- Use consistent formatting and terminology
- Add visual cues with icons and colors
- Consider different user skill levels
- Include contact information for additional help

### 8. Updating Existing Pages

To update an existing guide page:
1. Edit the component file directly
2. Update the `lastUpdated` field in the metadata
3. Add new tags if the content scope has expanded
4. Test the search functionality with new terms

## Advanced Features

### Custom Filtering
The search system automatically handles:
- Text search in titles and descriptions
- Tag-based filtering
- Category-based filtering
- Combined filters

### Responsive Design
All guide pages automatically inherit:
- Mobile-responsive layouts
- Dark/light theme support
- Accessibility features
- Custom font size settings

### PWA Features
Guide pages work seamlessly with:
- Offline access (when cached)
- Install prompts
- Update notifications
- Background sync

## Troubleshooting

**Guide page not appearing:**
- Check that it's properly imported in `index.js`
- Verify the metadata export name matches the import
- Check for console errors

**Search not working:**
- Ensure tags are lowercase strings
- Check that metadata is properly exported
- Verify the description contains searchable terms

**Navigation issues:**
- Verify the path in `index.js` is unique
- Check that the component is properly exported as default

For additional help, contact the development team or refer to the existing guide pages as examples.
