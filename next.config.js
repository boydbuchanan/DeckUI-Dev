/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false,
    // output: 'standalone',
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      });
      return config;
    },
    transpilePackages: ["@deckai/deck-ui", "@deckai/icons"],
  };
  