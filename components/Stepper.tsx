"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDonationStore } from "@/lib/donationStore";

const Stepper = ({ currentStep = 0 }: { currentStep: number }) => {
  const t = useTranslations("Donate");
  const submitSuccess = useDonationStore((state) => state.submitSuccess);
  const steps = [
    t("stepper.chooseShelter"),
    t("stepper.personalInfo"),
    t("stepper.confirm"),
  ];
  return (
    <div className="flex items-center justify-between gap-3 py-6 text-sm text-muted-foreground">
      {steps.map((label, index) => {
        const isDone = index < currentStep || (index === currentStep && submitSuccess);
        const isActive = index === currentStep && !submitSuccess;
        return (
          <div key={label} className="flex flex-1 items-center gap-3">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isDone
                    ? "bg-white border border-border"
                    : "border border-border text-muted-foreground"
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5 text-primary" /> : index + 1}
              </span>
              <span
                className={cn(
                  "whitespace-normal text-xs sm:text-sm leading-tight",
                  isActive ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span className="hidden h-px w-10 bg-border sm:block" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;