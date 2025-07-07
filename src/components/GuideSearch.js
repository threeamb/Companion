import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search,
  FilterList,
  ExpandMore,
} from '@mui/icons-material';

const GuideSearch = ({ guidePages, onFilteredPagesChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Extract all unique tags and categories
  const { allTags, allCategories } = useMemo(() => {
    const tags = new Set();
    const categories = new Set();
    
    guidePages.forEach(page => {
      page.metadata.tags.forEach(tag => tags.add(tag));
      categories.add(page.metadata.category);
    });
    
    return {
      allTags: Array.from(tags).sort(),
      allCategories: Array.from(categories).sort()
    };
  }, [guidePages]);

  // Filter pages based on search criteria
  const filteredPages = useMemo(() => {
    let filtered = guidePages;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(page => 
        page.metadata.title.toLowerCase().includes(term) ||
        page.metadata.description.toLowerCase().includes(term) ||
        page.metadata.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(page =>
        selectedTags.some(tag => page.metadata.tags.includes(tag))
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(page =>
        selectedCategories.includes(page.metadata.category)
      );
    }

    return filtered;
  }, [guidePages, searchTerm, selectedTags, selectedCategories]);

  // Notify parent of filtered results
  React.useEffect(() => {
    onFilteredPagesChange(filteredPages);
  }, [filteredPages, onFilteredPagesChange]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedCategories([]);
  };

  const hasActiveFilters = searchTerm.trim() || selectedTags.length > 0 || selectedCategories.length > 0;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search guides by title, description, or tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {/* Filters */}
      <Accordion elevation={1}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6">
              Filters
              {hasActiveFilters && (
                <Chip 
                  label={`${filteredPages.length} result${filteredPages.length !== 1 ? 's' : ''}`}
                  size="small" 
                  color="primary"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            {/* Category Filters */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Categories
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {allCategories.map(category => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => handleCategoryToggle(category)}
                    color={selectedCategories.includes(category) ? 'primary' : 'default'}
                    variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Stack>
            </Box>

            {/* Tag Filters */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {allTags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagToggle(tag)}
                    color={selectedTags.includes(tag) ? 'secondary' : 'default'}
                    variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Stack>
            </Box>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Box sx={{ pt: 1 }}>
                <Chip
                  label="Clear all filters"
                  onClick={clearFilters}
                  color="error"
                  variant="outlined"
                  size="small"
                />
              </Box>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default GuideSearch;
