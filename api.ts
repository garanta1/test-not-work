import axios from 'axios';

// В dev мы обычно запускаем фронт на 5173 и API на 8000.
// В production (когда бэкенд раздаёт dist) запросы должны идти на текущий origin.
const API_BASE_URL =
  typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:8000' : '';

const API = axios.create({
  baseURL: API_BASE_URL,
});

export interface ResumeItem {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  skills: string;
  experience: string;
  education: string;
  analysis: string;
  score: number;
  source: string;
}

export const uploadResume = async (file: File): Promise<ResumeItem> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await API.post('/upload', formData);
  return data;
};

export const parseUrl = async (url: string): Promise<ResumeItem> => {
  const formData = new FormData();
  formData.append('url', url);
  const { data } = await API.post('/parse-url', formData);
  return data;
};

export const fetchResumes = async (query = ''): Promise<ResumeItem[]> => {
  const { data } = await API.get('/resumes', { params: { q: query } });
  return data;
};