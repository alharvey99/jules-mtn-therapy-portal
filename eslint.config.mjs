import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    rules: {
      "no-unused-vars": "off"
    }
  }
];

export default config;
