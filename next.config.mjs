import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  basePath: '/en/latest',
  reactStrictMode: true,
  trailingSlash: true
};

export default withMDX(config);
