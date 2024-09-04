import axios from 'axios';

const api = axios.create({
  baseURL: '/api/theme', // 백엔드 기본 URL
});

export const analyzeTheme = async (bucketList) => {
  try {
    const response = await api.post('/analyze', { bucketList });
    return response.data;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
};
