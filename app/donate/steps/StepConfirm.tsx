"use client";

import { useShelters } from "@/lib/queries";
import { useContribute } from "@/lib/queries";
import { useDonationStore } from "@/lib/donationStore";
import { useCallback, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import type { ApiError, ContributeResponse } from "@/lib/api";
import { donationConfirmSchema } from "@/lib/validation";

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
  const { data: sheltersData } = useShelters();
  const contributeMutation = useContribute();
  const { setStepValid, showErrors, setShowErrors, setSubmitAction } = useDonationStore();

  const value = Number(amount || 0);
  const validation = donationConfirmSchema.safeParse({
    firstName,
    lastName,
    email,
    phone,
    phoneCountry,
    consent,
    amount,
  });
  const canSubmit = validation.success;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) {
      setShowErrors(true);
      return;
    }
    contributeMutation.mutate({
      contributors: [
        {
          firstName: firstName || undefined,
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone ? `${phoneCountry} ${phone}` : null,
        },
      ],
      shelterID: donationType === "specific" ? shelterId ?? null : null,
      value,
    });
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
  const responseMessages = contributeMutation.data?.messages ?? [];
  const responseErrorMessages = responseMessages.filter((message) => message.type === "ERROR");
  const responseSuccessMessages = responseMessages.filter(
    (message) => message.type === "SUCCESS"
  );
  const apiError = contributeMutation.error as ApiError<ContributeResponse> | null;
  const apiErrorMessages = apiError?.data?.messages ?? [];
  const showSuccess = contributeMutation.isSuccess && responseErrorMessages.length === 0;
  const showError = contributeMutation.isError || responseErrorMessages.length > 0;
  const successMessage =
    responseSuccessMessages[0]?.message ??
    responseMessages[0]?.message ??
    "Príspevok bol úspešne odoslaný.";
  const errorMessage =
    responseErrorMessages[0]?.message ??
    apiErrorMessages.find((message) => message.type === "ERROR")?.message ??
    (contributeMutation.error?.message &&
    contributeMutation.error?.message !== "Failed to fetch"
      ? contributeMutation.error?.message
      : undefined) ??
    "Odoslanie sa nepodarilo. Skúste to prosím znova.";
  return (
    <section className="w-full max-w-xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Skontrolujte si zadané údaje
        </h1>
        {showErrors && !canSubmit && (
          <Alert variant="destructive">
            <AlertTitle>Formulár nie je kompletný</AlertTitle>
            <AlertDescription>
              Skontrolujte priezvisko, e-mail, telefón, súhlas a sumu príspevku.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-6 text-sm">
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground">Zhrnutie</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Forma pomoci</span>
              <span className="font-medium">
                {donationType === "foundation"
                  ? "Finančný príspevok celej nadácii"
                  : "Finančný príspevok konkrétnemu útulku"}
              </span>
            </div>
            {donationType === "specific" && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Útulok</span>
                <span className="font-medium">{shelterName ?? "-"}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Suma príspevku</span>
              <span className="font-medium">{value} €</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground">Meno a priezvisko</p>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Meno a priezvisko</span>
            <span className="font-medium">{fullName || "-"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">E-mail</span>
            <span className="font-medium">{email || "-"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Telefónne číslo</span>
            <span className="font-medium">
              {phone ? `${phoneCountry} ${phone}` : "-"}
            </span>
          </div>
        </div>

        <div className="border-t border-border" />

        <label className="flex items-center gap-3 text-xs text-muted-foreground">
          <Checkbox checked={consent} />
          <span>Súhlasím so spracovaním mojich osobných údajov</span>
        </label>
        {showSuccess && (
          <Alert className="border-emerald-200 bg-emerald-50/60 text-emerald-700">
            <AlertTitle className="flex items-center gap-2 text-emerald-800">
              <FaCircleCheck className="size-4" />
              Ďakujeme!
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
              Odoslanie zlyhalo
            </AlertTitle>
            <AlertDescription className="text-rose-700">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {showErrors && !canSubmit && (
        <p className="text-sm text-red-600">
          Prosím, skontrolujte povinné údaje a sumu príspevku.
        </p>
      )}
      {showErrors && !consent && (
        <p className="text-sm text-red-600">
          Prosím, potvrďte súhlas so spracovaním osobných údajov.
        </p>
      )}
    </section>
  );
};

export default StepConfirm;