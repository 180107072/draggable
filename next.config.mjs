/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,

  webpack: (config, {}) => {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      loader: "threejs-glsl-loader",
    });

    return config;
  },
};
