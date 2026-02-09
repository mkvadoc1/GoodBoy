import NextIntlPlugin  from "next-intl/plugin";

const withNextIntl = NextIntlPlugin();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
