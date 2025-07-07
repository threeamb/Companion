// Dynamic guide pages loader
// This file automatically imports all guide pages and their metadata

import StoreManDuty, { storeManDutyMetadata } from './storemanduty';
// import SecurityProtocols, { securityProtocolsMetadata } from './securityprotocols';
// import EmployeeOnboarding, { employeeOnboardingMetadata } from './employeeonboarding';

// Add new guide pages here as you create them
// Example:
// import NewGuidePage, { newGuidePageMetadata } from './newguidepage';

export const guidePages = [
  {
    component: StoreManDuty,
    metadata: storeManDutyMetadata,
    path: '/guide/store-manager-duty'
  },
  // Add new pages here:
  // {
  //   component: NewGuidePage,
  //   metadata: newGuidePageMetadata,
  //   path: '/guide/new-guide-page'
  // }
];

export const getGuidePageByPath = (path) => {
  return guidePages.find(page => page.path === path);
};

export const getAllGuidePages = () => {
  return guidePages;
};

export const searchGuidePages = (query) => {
  if (!query) return guidePages;
  
  const lowerQuery = query.toLowerCase();
  return guidePages.filter(page => {
    const { title, description, tags, category } = page.metadata;
    
    return (
      title.toLowerCase().includes(lowerQuery) ||
      description.toLowerCase().includes(lowerQuery) ||
      category.toLowerCase().includes(lowerQuery) ||
      tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  });
};
