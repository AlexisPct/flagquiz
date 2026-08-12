import { v4 as uuidv4 } from 'uuid';

const TOKEN_KEY = 'geoquiz_device_token';
const USERNAME_KEY = 'geoquiz_username';

export const getOrCreateDeviceToken = (): string => {
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = uuidv4();
    localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
};

export const getStoredUsername = (): string => {
  return localStorage.getItem(USERNAME_KEY) || 'Explorateur Anonyme';
};

export const setStoredUsername = (username: string): void => {
  localStorage.setItem(USERNAME_KEY, username.trim());
};