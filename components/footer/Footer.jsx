import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Good boy" width={32} height={32} />
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
              <Link
                className="transition hover:text-foreground"
                href="#contact"
              >
                Kontakt
              </Link>
              <Link
                className="transition hover:text-foreground"
                href="#projects"
              >
                O projekte
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
