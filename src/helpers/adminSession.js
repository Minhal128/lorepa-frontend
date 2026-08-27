import axios from 'axios';

// Admin-only endpoints require this header. One axios default beats threading it
// through every admin page - a page reload wipes it, so Layout re-applies it.
export const applyAdminKey = (key) => {
  if (key) axios.defaults.headers.common['x-admin-key'] = key;
  else delete axios.defaults.headers.common['x-admin-key'];
};

export const clearAdminSession = () => {
  localStorage.removeItem('adminLoggedIn');
  localStorage.removeItem('adminSessionExpiry');
  localStorage.removeItem('adminKey');
  applyAdminKey(null);
};
