"use client";

import Stepper from "@/components/Stepper";
import StepChooseType from "./steps/StepChooseType";
import StepPersonalInfo from "./steps/StepPersonalInfo";
import StepConfirm from "./steps/StepConfirm";
import { useDonationStore } from "@/lib/donationStore";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export function DonateController() {
  const t = useTranslations("Donate");
  const {
    step,
    setStep,
    donationType,
    shelterId,
    amount,
    firstName,
    lastName,
    email,
    phone,
    phoneCountry,
    consent,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setPhoneCountry,
    setConsent,
  } = useDonationStore();

  useEffect(() => {
    const stepTitleKey =
      step === 0
        ? "seo.step1Title"
        : step === 1
        ? "seo.step2Title"
        : "seo.step3Title";
    const stepDescriptionKey =
      step === 0
        ? "seo.step1Description"
        : step === 1
        ? "seo.step2Description"
        : "seo.step3Description";
    const title = t(stepTitleKey);
    const description = t(stepDescriptionKey);
    const ogImage = "/logo.svg";

    document.title = title;

    const upsertMeta = (selector: string, attrs: Record<string, string>) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        Object.entries(attrs).forEach(([key, value]) => {
          element?.setAttribute(key, value);
        });
        document.head.appendChild(element);
      } else {
        Object.entries(attrs).forEach(([key, value]) => {
          element?.setAttribute(key, value);
        });
      }
    };

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: ogImage });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: ogImage });
  }, [step, t]);

  return (
    <div className="flex flex-col gap-6 pt-2">
      <Stepper currentStep={step} />

      {step === 0 && <StepChooseType />}
      {step === 1 && (
        <StepPersonalInfo
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          phoneCountry={phoneCountry}
          consent={consent}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onPhoneCountryChange={setPhoneCountry}
          onConsentChange={setConsent}
        />
      )}
      {step === 2 && (
        <StepConfirm
          donationType={donationType}
          shelterId={shelterId}
          amount={amount}
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          phoneCountry={phoneCountry}
          consent={consent}
        />
      )}
    </div>
  );
}
