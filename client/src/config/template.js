import axios from 'axios';

export default axios.create({
  baseURL: '/api/json-schemas',
  headers: {
    'content-type': 'application/json',
    Accept: 'application/json'
  }
});
