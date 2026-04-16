/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Se genera automáticamente en cada build/deploy
    // No necesitas setear nada en Vercel — esto se ejecuta al compilar
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date().toISOString(),
  },
};

module.exports = nextConfig;
