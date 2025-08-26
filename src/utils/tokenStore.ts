export const tokenStore = {
  get: () => localStorage.getItem('token'),
  set: (t: string | null) => {
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
  },
};
