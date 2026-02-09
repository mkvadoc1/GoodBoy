"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LocaleClient = () => {
  const router = useRouter();

  useEffect(() => {
    const browserLocale = navigator.language.slice(0, 2);
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("GOODBOY_LOCALE="))
      ?.split("=")[1];

    if (cookieLocale !== browserLocale) {
      document.cookie = `GOODBOY_LOCALE=${browserLocale}; path=/`;
      router.refresh();
    }
  }, [router]);

  return null;
};

export default LocaleClient;
