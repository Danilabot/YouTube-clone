// Базовый URL для API — берется из переменной окружения, fallback на localhost для разработки
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
