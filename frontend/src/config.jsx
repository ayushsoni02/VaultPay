// export const BACKEND_URL = "https://vaultpay-production.up.railway.app/";
// export const BACKEND_URL = "http://localhost:3000";

const isDev = import.meta.env.MODE === 'development';

export const BACKEND_URL = isDev
    ? "http://localhost:3000"
    : "https://vaultpay-production.up.railway.app/";

export const FRONTEND_URL = isDev
    ? "http://localhost:5173"
    : "https://vaultpay-ten.vercel.app/";