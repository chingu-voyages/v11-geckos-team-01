import axios from 'axios';

export default axios.create({
  baseURL: '/auth',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})