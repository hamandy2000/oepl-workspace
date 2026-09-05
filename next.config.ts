/** Next.js 설정 — Turbopack root, 프록시 요청 본문 크기 */

import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    proxyClientMaxBodySize: "30mb",
  },
};

export default nextConfig;
