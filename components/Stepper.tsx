import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = ["Výber útulku", "Osobné údaje", "Potvrdenie"];

const Stepper = ({ currentStep = 0 }: { currentStep: number }) => {
  return (
    <div className="flex flex-wrap items-center py-6 gap-4 text-sm text-muted-foreground">
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isDone = index < currentStep;
        return (
          <div key={label} className="flex items-center gap-3">
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
                "whitespace-nowrap",
                isActive ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
            {index < steps.length - 1 && (
              <span className="hidden h-px w-14 bg-border sm:block" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;