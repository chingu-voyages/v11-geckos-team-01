import axios from 'axios';

export default async () => {
  const results = await axios.get('/auth/current_user');

  if (results.ok) {
    return results.data;
  }

  return false;
};
