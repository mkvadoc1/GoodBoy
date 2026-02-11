"use client";

import Stepper from "@/components/Stepper";
import StepChooseType from "./steps/StepChooseType";
import StepPersonalInfo from "./steps/StepPersonalInfo";
import StepConfirm from "./steps/StepConfirm";
import { useDonationStore } from "@/lib/donationStore";

export function DonateController() {
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
