"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const tCommon = useTranslations("Common");
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <FaArrowLeft className="h-3.5 w-3.5" />
        {tCommon("back")}
      </Link>

      <div className="mt-6 space-y-6">
        <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
          <div className="space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FaEnvelope className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">{t("emailTitle")}</p>
            <p className="text-xs text-muted-foreground">{t("emailDescription")}</p>
            <a
              href="mailto:hello@goodrequest.com"
              className="text-sm text-primary hover:underline"
            >
              {t("emailAddress")}
            </a>
          </div>
          <div className="space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FaMapMarkerAlt className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">{t("officeTitle")}</p>
            <p className="text-xs text-muted-foreground">{t("officeDescription")}</p>
            <p className="text-sm text-primary">{t("officeAddress")}</p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FaPhoneAlt className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">{t("phoneTitle")}</p>
            <p className="text-xs text-muted-foreground">{t("phoneDescription")}</p>
            <a href="tel:+421911750750" className="text-sm text-primary hover:underline">
              {t("phoneNumber")}
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <Image
            src="/contactDog.jpg"
            alt={t("imageAlt")}
            width={1200}
            height={520}
            className="h-70 w-full rounded-xl object-cover"
          />
        </div>
        
      </div>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
}
