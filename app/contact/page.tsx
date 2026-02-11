"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <FaArrowLeft className="h-3.5 w-3.5" />
        Späť
      </Link>

      <div className="mt-6 space-y-6">
        <h1 className="text-3xl font-semibold text-foreground">Kontakt</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
          <div className="space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FaEnvelope className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">Email</p>
            <p className="text-xs text-muted-foreground">
              Our friendly team is here to help.
            </p>
            <a
              href="mailto:hello@goodrequest.com"
              className="text-sm text-primary hover:underline"
            >
              hello@goodrequest.com
            </a>
          </div>
          <div className="space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FaMapMarkerAlt className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">Office</p>
            <p className="text-xs text-muted-foreground">
              Come say hello at our office HQ.
            </p>
            <p className="text-sm text-primary">
              Obchodná 3D, 010 08 Žilina, Slovakia
            </p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FaPhoneAlt className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">Phone</p>
            <p className="text-xs text-muted-foreground">Mon–Fri from 8am to 5pm.</p>
            <a href="tel:+421911750750" className="text-sm text-primary hover:underline">
              +421 911 750 750
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <Image
            src="/contactDog.jpg"
            alt="Contact dog"
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
