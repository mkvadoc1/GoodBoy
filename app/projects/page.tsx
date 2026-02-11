"use client";

import Footer from "@/components/Footer";
import { useSheltersResults } from "@/lib/queries";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { useTranslations } from "next-intl";

export default function ProjectsPage() {
  const t = useTranslations("Projects");
  const tCommon = useTranslations("Common");
  const { data } = useSheltersResults();

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
        <p className="text-sm text-muted-foreground">{t("intro")}</p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-background p-6 text-center">
            <p className="text-3xl font-semibold text-primary">
              {data?.contribution ?? 0} €
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("totalContribution")}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background p-6 text-center">
            <p className="text-3xl font-semibold text-primary">
              {data?.contributors ?? 0}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{t("contributors")}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{t("outro")}</p>
      </div>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
}
