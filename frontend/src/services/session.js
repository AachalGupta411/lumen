const SESSION_KEY = 'lumen.sessionId';
const TOKEN_KEY = 'lumen.token';
const USER_KEY = 'lumen.user';

const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );

export const getSessionId = () => {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

export const clearSessionId = () => localStorage.removeItem(SESSION_KEY);

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};
export const setStoredUser = (u) => localStorage.setItem(USER_KEY, JSON.stringify(u));
export const clearStoredUser = () => localStorage.removeItem(USER_KEY);
