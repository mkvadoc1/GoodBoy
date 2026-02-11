"use client";

import { useShelters } from "@/lib/queries";
import { useContribute } from "@/lib/queries";
import { useDonationStore } from "@/lib/donationStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import type { ApiError, ContributeResponse } from "@/lib/api";
import { createContributorSchema, createDonationConfirmSchema } from "@/lib/validation";
import type { ValidationMessages } from "@/lib/validation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type StepConfirmProps = {
  donationType: "specific" | "foundation";
  shelterId: number | null;
  amount: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountry: "+421" | "+420";
  consent: boolean;
};

const StepConfirm = ({
  donationType,
  shelterId,
  amount,
  firstName,
  lastName,
  email,
  phone,
  phoneCountry,
  consent,
}: StepConfirmProps) => {
  const t = useTranslations("Donate");
  const tValidation = useTranslations("Validation");
  const { data: sheltersData } = useShelters();
  const contributeMutation = useContribute();
  const {
    setStepValid,
    showErrors,
    setShowErrors,
    setSubmitAction,
    setSubmitSuccess,
    additionalContributors,
  } = useDonationStore();

  const value = Number(amount || 0);
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
  const validation = createDonationConfirmSchema(validationMessages).safeParse({
    firstName,
    lastName,
    email,
    phone,
    phoneCountry,
    consent,
    amount,
  });
  const contributorSchema = createContributorSchema(validationMessages);
  const additionalValidations = additionalContributors.map((contributor) =>
    contributorSchema.safeParse(contributor)
  );
  const additionalValid = additionalValidations.every((result) => result.success);
  const canSubmit = validation.success && additionalValid;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) {
      setShowErrors(true);
      return;
    }
    setSubmitSuccess(false);
    const contributorsToSend = [
      {
        firstName: firstName || undefined,
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone ? `${phoneCountry} ${phone}` : null,
      },
      ...additionalContributors.map((contributor) => ({
        firstName: contributor.firstName ? contributor.firstName.trim() : undefined,
        lastName: contributor.lastName.trim(),
        email: contributor.email.trim(),
        phone: contributor.phone
          ? `${contributor.phoneCountry} ${contributor.phone}`
          : null,
      })),
    ];

    try {
      for (const contributor of contributorsToSend) {
        await contributeMutation.mutateAsync({
          contributors: [contributor],
          shelterID: donationType === "specific" ? shelterId ?? null : null,
          value,
        });
      }
    } catch {
      return;
    }
  }, [
    canSubmit,
    contributeMutation,
    donationType,
    email,
    firstName,
    lastName,
    phone,
    phoneCountry,
    shelterId,
    value,
    setShowErrors,
    additionalContributors,
    setSubmitSuccess,
  ]);

  const submitRef = useRef<() => void>(() => {});
  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);

  useEffect(() => {
    setSubmitAction(() => submitRef.current());
  }, [setSubmitAction]);

  useEffect(() => {
    setStepValid(canSubmit);
    if (canSubmit && showErrors) {
      setShowErrors(false);
    }
  }, [canSubmit, setStepValid, setShowErrors, showErrors]);
  const shelterName = sheltersData?.shelters.find((s) => s.id === shelterId)?.name;
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const additionalFullNames = additionalContributors.map((contributor) =>
    [contributor.firstName, contributor.lastName].filter(Boolean).join(" ").trim()
  );
  const [expandedAdditional, setExpandedAdditional] = useState<Record<number, boolean>>({});
  const toggleAdditionalDetails = (index: number) => {
    setExpandedAdditional((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const responseMessages = contributeMutation.data?.messages ?? [];
  const responseErrorMessages = responseMessages.filter((message) => message.type === "ERROR");
  const responseSuccessMessages = responseMessages.filter(
    (message) => message.type === "SUCCESS"
  );
  const apiError = contributeMutation.error as ApiError<ContributeResponse> | null;
  const apiErrorMessages = apiError?.data?.messages ?? [];
  const showSuccess = contributeMutation.isSuccess && responseErrorMessages.length === 0;
  const showError = contributeMutation.isError || responseErrorMessages.length > 0;
  useEffect(() => {
    setSubmitSuccess(showSuccess);
  }, [setSubmitSuccess, showSuccess]);
  const successMessage =
    responseSuccessMessages[0]?.message ??
    responseMessages[0]?.message ??
    t("confirm.successFallback");
  const errorMessage =
    responseErrorMessages[0]?.message ??
    apiErrorMessages.find((message) => message.type === "ERROR")?.message ??
    (contributeMutation.error?.message &&
    contributeMutation.error?.message !== "Failed to fetch"
      ? contributeMutation.error?.message
      : undefined) ??
    t("confirm.errorFallback");
  return (
    <section className="w-full max-w-xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          {t("confirm.title")}
        </h1>
        {showErrors && !canSubmit && (
          <Alert variant="destructive">
            <AlertTitle>{t("confirm.incompleteTitle")}</AlertTitle>
            <AlertDescription>
              {t("confirm.incompleteDescription")}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-6 text-sm">
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground">
            {t("confirm.summary")}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t("confirm.helpType")}
              </span>
              <span className="font-medium">
                {donationType === "foundation"
                  ? t("confirm.helpTypeFoundation")
                  : t("confirm.helpTypeSpecific")}
              </span>
            </div>
            {donationType === "specific" && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("confirm.shelter")}</span>
                <span className="font-medium">{shelterName ?? "-"}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("confirm.amount")}</span>
              <span className="font-medium">{value} €</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground">
            {t("confirm.personalTitle")}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("confirm.nameLabel")}</span>
            <span className="font-medium">{fullName || "-"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("confirm.emailLabel")}</span>
            <span className="font-medium">{email || "-"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("confirm.phoneLabel")}</span>
            <span className="font-medium">
              {phone ? `${phoneCountry} ${phone}` : "-"}
            </span>
          </div>
          {additionalContributors.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-muted-foreground">
                {t("confirm.additionalContributors")}
              </p>
              {additionalContributors.map((contributor, index) => (
                <div key={`additional-${index}`} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {t("confirm.additionalLabel", { index: index + 1 })}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">
                        {additionalFullNames[index] || "-"}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => toggleAdditionalDetails(index)}
                      >
                        {expandedAdditional[index]
                          ? t("confirm.collapseDetails")
                          : t("confirm.expandDetails")}
                      </Button>
                    </div>
                  </div>
                  {expandedAdditional[index] && (
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>{t("confirm.emailLabel")}</span>
                        <span className="text-foreground">
                          {contributor.email || "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{t("confirm.phoneLabel")}</span>
                        <span className="text-foreground">
                          {contributor.phone
                            ? `${contributor.phoneCountry} ${contributor.phone}`
                            : "-"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border" />

        {showSuccess && (
          <Alert className="border-emerald-200 bg-emerald-50/60 text-emerald-700">
            <AlertTitle className="flex items-center gap-2 text-emerald-800">
              <FaCircleCheck className="size-4" />
              {t("confirm.successTitle")}
            </AlertTitle>
            <AlertDescription className="text-emerald-700">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
        {showError && (
          <Alert className="border-rose-200 bg-rose-50/70 text-rose-700">
            <AlertTitle className="flex items-center gap-2 text-rose-800">
              <FaCircleExclamation className="size-4" />
              {t("confirm.errorTitle")}
            </AlertTitle>
            <AlertDescription className="text-rose-700">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {showErrors && !canSubmit && (
        <p className="text-sm text-red-600">
          {t("confirm.checkErrors")}
        </p>
      )}
    </section>
  );
};

export default StepConfirm;