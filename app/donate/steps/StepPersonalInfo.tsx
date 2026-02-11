"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useDonationStore } from "@/lib/donationStore";
import { personalInfoSchema } from "@/lib/validation";
import type { ZodFormattedError } from "zod";
import type { PersonalInfoInput } from "@/lib/validation";
import Image from "next/image";
import { useEffect } from "react";

type StepPersonalInfoProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountry: "+421" | "+420";
  consent: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPhoneCountryChange: (value: "+421" | "+420") => void;
  onConsentChange: (value: boolean) => void;
};

const StepPersonalInfo = ({
  firstName,
  lastName,
  email,
  phone,
  phoneCountry,
  consent,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
  onPhoneCountryChange,
  onConsentChange,
}: StepPersonalInfoProps) => {
  const { setStepValid, showErrors, setShowErrors } = useDonationStore();
  const validation = personalInfoSchema.safeParse({
    firstName,
    lastName,
    email,
    phone,
    phoneCountry,
    consent,
  });
  const fieldErrors: ZodFormattedError<PersonalInfoInput> = validation.success
    ? ({ _errors: [] } as ZodFormattedError<PersonalInfoInput>)
    : validation.error.format();
  const canProceed = validation.success;

  useEffect(() => {
    setStepValid(canProceed);
    if (canProceed && showErrors) {
      setShowErrors(false);
    }
  }, [canProceed, setStepValid, setShowErrors, showErrors]);
  const errorTextClass = "text-xs text-destructive";
  const labelClass = (invalid: boolean) =>
    `text-xs font-medium ${invalid ? "text-destructive" : "text-muted-foreground"}`;
  const inputClass = (invalid: boolean) =>
    `w-full rounded-md border bg-muted/60 px-3 py-2 text-sm ${
      invalid ? "border-destructive focus-visible:ring-destructive/20" : "border-border"
    }`;
  const phoneCountryMeta: Record<
    "+421" | "+420",
    { flagSrc: string; flagAlt: string; label: string }
  > = {
    "+421": { flagSrc: "/flags/sk.svg", flagAlt: "Slovakia", label: "+421" },
    "+420": { flagSrc: "/flags/cz.svg", flagAlt: "Czechia", label: "+420" },
  };
  const selectedPhoneCountry = phoneCountryMeta[phoneCountry];
  const phoneInvalid = Boolean(fieldErrors.phone?._errors?.length) && showErrors;
  const emailInvalid = Boolean(fieldErrors.email?._errors?.length) && showErrors;
  const lastNameInvalid = Boolean(fieldErrors.lastName?._errors?.length) && showErrors;
  const firstNameInvalid = Boolean(fieldErrors.firstName?._errors?.length) && showErrors;
  const consentInvalid = Boolean(fieldErrors.consent?._errors?.length) && showErrors;
  return (
    <section className="w-full max-w-xl py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Potrebujeme od Vás zopár informácií
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass(firstNameInvalid)}>Meno</label>
          <Input
            type="text"
            placeholder="Zadajte Vaše meno"
            value={firstName}
            onChange={(event) => onFirstNameChange(event.target.value)}
            className={inputClass(firstNameInvalid)}
          />
          {firstNameInvalid && (
            <p className={errorTextClass}>
              Meno musí mať 2–20 znakov alebo zostať prázdne.
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className={labelClass(lastNameInvalid)}>Priezvisko</label>
          <Input
            type="text"
            placeholder="Zadajte Vaše priezvisko"
            value={lastName}
            onChange={(event) => onLastNameChange(event.target.value)}
            className={inputClass(lastNameInvalid)}
          />
          {lastNameInvalid && (
            <p className={errorTextClass}>Priezvisko musí mať 2–30 znakov.</p>
          )}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className={labelClass(emailInvalid)}>E-mail</label>
          <Input
            type="email"
            placeholder="Zadajte Váš e-mail"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            className={inputClass(emailInvalid)}
          />
          {emailInvalid && (
            <p className={errorTextClass}>Prosím, zadajte platný e-mail.</p>
          )}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className={labelClass(phoneInvalid)}>Telefónne číslo</label>
          <div className="flex gap-2">
            <Select
              value={phoneCountry}
              onValueChange={(value) =>
                onPhoneCountryChange(value as "+421" | "+420")
              }
            >
              <SelectTrigger
                aria-label={selectedPhoneCountry.label}
                className={inputClass(phoneInvalid).replace("w-full", "w-16")}
              >
                <span className="sr-only">{selectedPhoneCountry.label}</span>
                <span className="flex items-center justify-center">
                  <Image
                    src={selectedPhoneCountry.flagSrc}
                    alt={selectedPhoneCountry.flagAlt}
                    width={40}
                    height={40}
                    className=" rounded-full "
                  />
                </span>
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={8}
                align="start"
                className="min-w-(--radix-select-trigger-width) max-w-(--radix-select-trigger-width)"
                style={{ width: "var(--radix-select-trigger-width)" }}
              >
                <SelectItem value="+421">
                  <span className="flex items-center gap-2">
                    <Image
                      src={phoneCountryMeta["+421"].flagSrc}
                      alt={phoneCountryMeta["+421"].flagAlt}
                      width={16}
                      height={16}
                      className=" rounded-full"
                    />
                    
                  </span>
                </SelectItem>
                <SelectItem value="+420">
                  <span className="flex items-center gap-2">
                    <Image
                      src={phoneCountryMeta["+420"].flagSrc}
                      alt={phoneCountryMeta["+420"].flagAlt}
                      width={16}
                      height={16}
                      className=" rounded-full"
                    />
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
                <span className="inline-flex items-center gap-2">
                  <span>{selectedPhoneCountry.label}</span>
                </span>
              </span>
              <Input
                type="tel"
                placeholder="Zadajte číslo"
                value={phone}
                onChange={(event) => onPhoneChange(event.target.value)}
                className={`${inputClass(phoneInvalid).replace("w-full", "w-full")} pl-14`}
              />
            </div>
          </div>
          {phoneInvalid && (
            <p className={errorTextClass}>Telefónne číslo musí mať 9 číslic.</p>
          )}
        </div>
      </div>

      <label
        className={
          "flex items-start gap-3 text-xs " +
          (consentInvalid ? "text-destructive" : "text-muted-foreground")
        }
      >
        <Checkbox
          checked={consent}
          onCheckedChange={(value) => onConsentChange(Boolean(value))}
        />
        <span>
          Súhlasím so spracovaním osobných údajov podľa podmienok nadácie.
        </span>
      </label>
      {consentInvalid && (
        <p className={errorTextClass}>
          Prosím, potvrďte súhlas so spracovaním údajov.
        </p>
      )}

      
    </section>
  );
};

export default StepPersonalInfo;