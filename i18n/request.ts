import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
    const cookiesLocale = (await cookies()).get("GOODBOY_LOCALE")?.value || "en";
    const locale = cookiesLocale;

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    }
})