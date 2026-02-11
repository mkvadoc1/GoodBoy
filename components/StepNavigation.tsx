"use client";

import { Button } from "@/components/ui/button";
import { useDonationStore } from "@/lib/donationStore";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useTranslations } from "next-intl";

type StepNavigationProps = {
  onNext?: () => void;
  onBack?: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
};

const StepNavigation = ({
  onNext,
  onBack,
  backDisabled,
  nextDisabled,
  nextLabel,
  backLabel,
}: StepNavigationProps) => {
  const t = useTranslations("Donate");
  const { step, nextStep, prevStep, stepValid, setShowErrors, submitAction } = useDonationStore();
  const handleBack = onBack ?? prevStep;
  const defaultNextLabel =
    step === 2 ? t("navigation.submit") : t("navigation.next");
  const resolvedBackLabel = backLabel ?? t("navigation.back");
  const handleNext = onNext ?? (() => {
    if (step === 2) {
      submitAction?.();
      if (!stepValid) {
        setShowErrors(true);
      }
      return;
    }
    if (!stepValid) {
      setShowErrors(true);
      return;
    }
    nextStep();
  });
  const isBackDisabled = backDisabled ?? step === 0;
  const isNextDisabled = nextDisabled ?? false;

  return (
    <div className="flex items-center justify-between pt-2">
      <Button variant="secondary" size="lg" disabled={isBackDisabled} onClick={handleBack}>
        <FaArrowLeft />
        {resolvedBackLabel}
      </Button>
      <Button size="lg" onClick={handleNext} disabled={isNextDisabled}>
        {nextLabel ?? defaultNextLabel}
        <FaArrowRight />
      </Button>
    </div>
  );
};

export default StepNavigation;