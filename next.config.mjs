import path from 'path';

/**
 * @type {import('next/dist/server/config').NextConfig}
 */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // Add a new rule for handling .node files
        config.module.rules.push({
            test: /\.node$/,
            use: 'file-loader', // Use file-loader to handle binary files
        });

        // Return the updated webpack config
        return config;
    },
    images: {
        domains: ['shapes.neofairs.com'],
    },
};

export default nextConfig;
