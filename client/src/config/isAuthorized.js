import axios from 'axios';

export default async () => {
  const results = await axios.get('/auth/current_user');

  console.log('results', results);

  if (results.status === 200 && results.data.user) {
    return results.data.user;
  }

  return false;
};
