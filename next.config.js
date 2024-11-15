/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: "/api/:path*", // 모든 API 경로에 대해 CORS 헤더 설정
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" }, // 모든 도메인 허용
            { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS" },
            { key: "Access-Control-Allow-Headers", value: "X-Requested-With, Content-Type, Authorization" },
          ],
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  