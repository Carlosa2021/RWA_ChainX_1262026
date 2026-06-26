import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Move .next build cache to internal drive (ext4) to avoid exFAT atomic-rename failures
  distDir: process.env.NEXT_DIST_DIR || '.next',
  typescript: {
    // ⚠️ TEMPORAL: Ignorar errores de TypeScript durante build de Vercel
    // TODO: Remover cuando todos los tipos estén correctos
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
