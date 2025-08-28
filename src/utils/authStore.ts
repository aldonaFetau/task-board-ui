export const tokenStore = {
  get: () => localStorage.getItem('token'),
  set: (t: string | null) => {
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
  },
};
export const userStore = {
  get: () => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },
  set: (u: any | null) => {
    if (u) localStorage.setItem("user", JSON.stringify(u));
    else localStorage.removeItem("user");
  },
};
