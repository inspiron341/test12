import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// Read the Docs serves at /<language>/<version>/ (e.g. /en/latest/)
// Set via environment variable during RTD build
const basePath = process.env.RTD_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
};

export default withMDX(config);
