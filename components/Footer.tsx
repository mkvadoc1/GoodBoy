import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa";


const Footer = () => {
  const t = useTranslations("Footer");
  return (
    <footer className="w-full border-t pt-4">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Good boy" width={30} height={30} />
            <span className="text-base font-semibold">Good boy</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition hover:text-foreground"
                aria-label="Facebook"
              >
                <FaFacebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition hover:text-foreground"
                aria-label="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
            </div>

            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link className="transition hover:text-foreground" href="/contact">
                {t("contact")}
              </Link>
              <Link
                className="transition hover:text-foreground"
                href="/projects"
              >
                {t("about")}
              </Link>
            </nav>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
