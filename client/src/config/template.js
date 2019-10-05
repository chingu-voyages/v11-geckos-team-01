import axios from 'axios';

export default axios.create({
  baseURL: '/api/templates',
  headers: {
    'content-type': 'application/json',
    Accept: 'application/json'
  }
});
