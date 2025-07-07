import React from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Article,
  Schedule,
} from '@mui/icons-material';

const ArticleCard = ({ metadata, onNavigate }) => {
  const { title, description, tags, category, lastUpdated, estimatedReadTime } = metadata;

  const handleClick = () => {
    onNavigate();
  };

  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%',
        width: '100%',
        minWidth: '100%',
        maxWidth: '100%',
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-4px)',
          elevation: 4,
          '& .article-title': {
            color: 'primary.main'
          }
        }
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header with icon and category */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
              <Article />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Chip 
                label={category} 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ mb: 0.5 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {lastUpdated}
              </Typography>
            </Box>
          </Box>

          {/* Title */}
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom 
            className="article-title"
            sx={{ 
              fontWeight: 'bold',
              transition: 'color 0.3s ease',
              flex: '0 0 auto'
            }}
          >
            {title}
          </Typography>

          {/* Description */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              lineHeight: 1.6,
              flex: 1,
              mb: 2,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {description}
          </Typography>

          {/* Tags */}
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            {tags.slice(0, 3).map((tag, index) => (
              <Chip 
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: '20px' }}
              />
            ))}
            {tags.length > 3 && (
              <Chip 
                label={`+${tags.length - 3} more`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: '20px' }}
              />
            )}
          </Stack>

          {/* Footer with read time */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
            <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {estimatedReadTime} read
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ArticleCard;
