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
import { createContributorSchema, createPersonalInfoSchema } from "@/lib/validation";
import type { ContributorInput, ValidationMessages } from "@/lib/validation";
import type { ZodFormattedError } from "zod";
import type { PersonalInfoInput } from "@/lib/validation";
import Image from "next/image";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

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
  const t = useTranslations("Donate");
  const tValidation = useTranslations("Validation");
  const {
    setStepValid,
    showErrors,
    setShowErrors,
    additionalContributors,
    addAdditionalContributor,
    updateAdditionalContributor,
    removeAdditionalContributor,
    toggleAdditionalContributor,
  } = useDonationStore();
  const maxAdditionalContributors = 3;
  const canAddContributor = additionalContributors.length < maxAdditionalContributors;
  const validationMessages: ValidationMessages = {
    firstNameInvalid: tValidation("firstNameInvalid"),
    firstNameLettersOnly: tValidation("firstNameLettersOnly"),
    lastNameInvalid: tValidation("lastNameInvalid"),
    lastNameLettersOnly: tValidation("lastNameLettersOnly"),
    emailInvalid: tValidation("emailInvalid"),
    phoneInvalid: tValidation("phoneInvalid"),
    consentRequired: tValidation("consentRequired"),
    amountRequired: tValidation("amountRequired"),
  };
  const validation = createPersonalInfoSchema(validationMessages).safeParse({
    firstName,
    lastName,
    email,
    phone,
    phoneCountry,
    consent,
  });
  const contributorSchema = createContributorSchema(validationMessages);
  const additionalValidations = additionalContributors.map((contributor) =>
    contributorSchema.safeParse(contributor)
  );
  const additionalErrors = additionalValidations.map((result) =>
    result.success ? ({ _errors: [] } as ZodFormattedError<ContributorInput>) : result.error.format()
  );
  const additionalValid = additionalValidations.every((result) => result.success);
  const fieldErrors: ZodFormattedError<PersonalInfoInput> = validation.success
    ? ({ _errors: [] } as ZodFormattedError<PersonalInfoInput>)
    : validation.error.format();
  const canProceed = validation.success && additionalValid;

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
    "+421": {
      flagSrc: "/flags/sk.svg",
      flagAlt: t("personalInfo.countrySkAlt"),
      label: "+421",
    },
    "+420": {
      flagSrc: "/flags/cz.svg",
      flagAlt: t("personalInfo.countryCzAlt"),
      label: "+420",
    },
  };
  const selectedPhoneCountry = phoneCountryMeta[phoneCountry];
  const phoneInvalid = Boolean(fieldErrors.phone?._errors?.length) && showErrors;
  const emailInvalid = Boolean(fieldErrors.email?._errors?.length) && showErrors;
  const lastNameInvalid = Boolean(fieldErrors.lastName?._errors?.length) && showErrors;
  const firstNameInvalid = Boolean(fieldErrors.firstName?._errors?.length) && showErrors;
  const consentInvalid = Boolean(fieldErrors.consent?._errors?.length) && showErrors;
  const firstNameMessage =
    fieldErrors.firstName?._errors?.[0] ?? tValidation("firstNameInvalid");
  const lastNameMessage =
    fieldErrors.lastName?._errors?.[0] ?? tValidation("lastNameInvalid");
  const emailMessage =
    fieldErrors.email?._errors?.[0] ?? tValidation("emailInvalid");
  const phoneMessage =
    fieldErrors.phone?._errors?.[0] ?? tValidation("phoneInvalid");
  const consentMessage =
    fieldErrors.consent?._errors?.[0] ?? tValidation("consentRequired");
  return (
    <section className="w-full max-w-xl mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          {t("personalInfo.title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass(firstNameInvalid)}>
            {t("personalInfo.firstName")}
          </label>
          <Input
            type="text"
            placeholder={t("personalInfo.firstNamePlaceholder")}
            value={firstName}
            onChange={(event) => onFirstNameChange(event.target.value)}
            className={inputClass(firstNameInvalid)}
          />
          {firstNameInvalid && (
            <p className={errorTextClass}>{firstNameMessage}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className={labelClass(lastNameInvalid)}>
            {t("personalInfo.lastName")}
          </label>
          <Input
            type="text"
            placeholder={t("personalInfo.lastNamePlaceholder")}
            value={lastName}
            onChange={(event) => onLastNameChange(event.target.value)}
            className={inputClass(lastNameInvalid)}
          />
          {lastNameInvalid && (
            <p className={errorTextClass}>{lastNameMessage}</p>
          )}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className={labelClass(emailInvalid)}>
            {t("personalInfo.email")}
          </label>
          <Input
            type="email"
            placeholder={t("personalInfo.emailPlaceholder")}
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            className={inputClass(emailInvalid)}
          />
          {emailInvalid && (
            <p className={errorTextClass}>{emailMessage}</p>
          )}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className={labelClass(phoneInvalid)}>
            {t("personalInfo.phone")}
          </label>
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
                placeholder={t("personalInfo.phonePlaceholder")}
                value={phone}
                onChange={(event) => onPhoneChange(event.target.value)}
                className={`${inputClass(phoneInvalid).replace("w-full", "w-full")} pl-14`}
              />
            </div>
          </div>
          {phoneInvalid && (
            <p className={errorTextClass}>{phoneMessage}</p>
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
          {t("personalInfo.consent")}
        </span>
      </label>
      {consentInvalid && (
        <p className={errorTextClass}>{consentMessage}</p>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">
            {t("personalInfo.additionalTitle")}
          </p>
          <div className="flex items-center gap-2">
            {!canAddContributor && (
              <span className="text-xs text-muted-foreground">
                {t("personalInfo.maxContributors", { count: maxAdditionalContributors })}
              </span>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAdditionalContributor}
              disabled={!canAddContributor}
            >
              {t("personalInfo.addContributor")}
            </Button>
          </div>
        </div>

        {additionalContributors.map((contributor, index) => {
          const contributorDisplayName =
            [contributor.firstName, contributor.lastName]
              .filter(Boolean)
              .join(" ")
              .trim() || t("personalInfo.additionalLabel", { index: index + 1 });
          const contributorErrors = additionalErrors[index];
          const contributorFirstNameInvalid =
            Boolean(contributorErrors.firstName?._errors?.length) && showErrors;
          const contributorLastNameInvalid =
            Boolean(contributorErrors.lastName?._errors?.length) && showErrors;
          const contributorEmailInvalid =
            Boolean(contributorErrors.email?._errors?.length) && showErrors;
          const contributorPhoneInvalid =
            Boolean(contributorErrors.phone?._errors?.length) && showErrors;
          const contributorConsentInvalid =
            Boolean(contributorErrors.consent?._errors?.length) && showErrors;
          const contributorHasErrors =
            contributorFirstNameInvalid ||
            contributorLastNameInvalid ||
            contributorEmailInvalid ||
            contributorPhoneInvalid ||
            contributorConsentInvalid;
          const contributorFirstNameMessage =
            contributorErrors.firstName?._errors?.[0] ?? tValidation("firstNameInvalid");
          const contributorLastNameMessage =
            contributorErrors.lastName?._errors?.[0] ?? tValidation("lastNameInvalid");
          const contributorEmailMessage =
            contributorErrors.email?._errors?.[0] ?? tValidation("emailInvalid");
          const contributorPhoneMessage =
            contributorErrors.phone?._errors?.[0] ?? tValidation("phoneInvalid");
          const contributorConsentMessage =
            contributorErrors.consent?._errors?.[0] ?? tValidation("consentRequired");
          const contributorCountry = phoneCountryMeta[contributor.phoneCountry];

          return (
            <div
              key={`contributor-${index}`}
              className={
                "rounded-lg border border-border bg-muted/20 p-4 space-y-4" +
                (!contributor.isExpanded && contributorHasErrors
                  ? " ring-2 ring-destructive"
                  : "")
              }
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {contributorDisplayName}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                      size="icon-sm"
                    onClick={() => toggleAdditionalContributor(index)}
                      aria-label={
                        contributor.isExpanded
                          ? t("personalInfo.collapseContributor")
                          : t("personalInfo.expandContributor")
                      }
                  >
                      {contributor.isExpanded ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                      size="icon-sm"
                    onClick={() => removeAdditionalContributor(index)}
                      aria-label={t("personalInfo.removeContributor")}
                  >
                      <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              {contributor.isExpanded && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className={labelClass(contributorFirstNameInvalid)}>
                        {t("personalInfo.firstName")}
                      </label>
                      <Input
                        type="text"
                        placeholder={t("personalInfo.firstNamePlaceholder")}
                        value={contributor.firstName}
                        onChange={(event) =>
                          updateAdditionalContributor(index, {
                            firstName: event.target.value,
                          })
                        }
                        className={inputClass(contributorFirstNameInvalid)}
                      />
                      {contributorFirstNameInvalid && (
                        <p className={errorTextClass}>{contributorFirstNameMessage}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass(contributorLastNameInvalid)}>
                        {t("personalInfo.lastName")}
                      </label>
                      <Input
                        type="text"
                        placeholder={t("personalInfo.lastNamePlaceholder")}
                        value={contributor.lastName}
                        onChange={(event) =>
                          updateAdditionalContributor(index, {
                            lastName: event.target.value,
                          })
                        }
                        className={inputClass(contributorLastNameInvalid)}
                      />
                      {contributorLastNameInvalid && (
                        <p className={errorTextClass}>{contributorLastNameMessage}</p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className={labelClass(contributorEmailInvalid)}>
                        {t("personalInfo.email")}
                      </label>
                      <Input
                        type="email"
                        placeholder={t("personalInfo.emailPlaceholder")}
                        value={contributor.email}
                        onChange={(event) =>
                          updateAdditionalContributor(index, {
                            email: event.target.value,
                          })
                        }
                        className={inputClass(contributorEmailInvalid)}
                      />
                      {contributorEmailInvalid && (
                        <p className={errorTextClass}>{contributorEmailMessage}</p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className={labelClass(contributorPhoneInvalid)}>
                        {t("personalInfo.phone")}
                      </label>
                      <div className="flex gap-2">
                        <Select
                          value={contributor.phoneCountry}
                          onValueChange={(value) =>
                            updateAdditionalContributor(index, {
                              phoneCountry: value as "+421" | "+420",
                            })
                          }
                        >
                          <SelectTrigger
                            aria-label={contributorCountry.label}
                            className={inputClass(contributorPhoneInvalid).replace(
                              "w-full",
                              "w-16"
                            )}
                          >
                            <span className="sr-only">{contributorCountry.label}</span>
                            <span className="flex items-center justify-center">
                              <Image
                                src={contributorCountry.flagSrc}
                                alt={contributorCountry.flagAlt}
                                width={40}
                                height={40}
                                className="rounded-full"
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
                                  className="rounded-full"
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
                                  className="rounded-full"
                                />
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="relative flex-1">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
                            <span className="inline-flex items-center gap-2">
                              <span>{contributorCountry.label}</span>
                            </span>
                          </span>
                          <Input
                            type="tel"
                            placeholder={t("personalInfo.phonePlaceholder")}
                            value={contributor.phone}
                            onChange={(event) =>
                              updateAdditionalContributor(index, {
                                phone: event.target.value,
                              })
                            }
                            className={`${inputClass(contributorPhoneInvalid).replace("w-full", "w-full")} pl-14`}
                          />
                        </div>
                      </div>
                      {contributorPhoneInvalid && (
                        <p className={errorTextClass}>{contributorPhoneMessage}</p>
                      )}
                    </div>
                  </div>

                  <label
                    className={
                      "flex items-start gap-3 text-xs " +
                      (contributorConsentInvalid
                        ? "text-destructive"
                        : "text-muted-foreground")
                    }
                  >
                    <Checkbox
                      checked={contributor.consent}
                      onCheckedChange={(value) =>
                        updateAdditionalContributor(index, { consent: Boolean(value) })
                      }
                    />
                    <span>{t("personalInfo.additionalConsent")}</span>
                  </label>
                  {contributorConsentInvalid && (
                    <p className={errorTextClass}>{contributorConsentMessage}</p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      
    </section>
  );
};

export default StepPersonalInfo;