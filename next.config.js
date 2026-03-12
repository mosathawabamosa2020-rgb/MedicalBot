const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next-build',
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
}

module.exports = nextConfig
