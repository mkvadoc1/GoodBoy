"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useShelters } from "@/lib/queries";
import { useDonationStore } from "@/lib/donationStore";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

const presetAmounts = [5, 10, 20, 30, 50, 100];

const StepChooseType = () => {
    const t = useTranslations("Donate");
    const { data, isLoading } = useShelters();
    const {
        donationType,
        shelterId,
        amount,
        setDonationType,
        setShelterId,
        setAmount,
        showErrors,
        setShowErrors,
        setStepValid,
    } = useDonationStore();
    const amountValue = Number(amount || 0);
    const isShelterRequired = donationType === "specific";
    const hasShelter = Boolean(shelterId);
    const canProceed = amountValue > 0 && (!isShelterRequired || hasShelter);
    useEffect(() => {
        setStepValid(canProceed);
        if (canProceed && showErrors) {
            setShowErrors(false);
        }
    }, [canProceed, setStepValid, setShowErrors, showErrors]);

    const { control, setValue } = useForm({
        defaultValues: {
            donationType,
            shelterId: shelterId ? String(shelterId) : "",
            amount,
        },
    });

    return (
        <section className="w-full max-w-xl mx-auto py-6 space-y-5">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">
                    {t("chooseType.title")}
                </h1>
            </div>

            <div className="grid grid-cols-2 gap-2 border rounded-lg bg-muted p-1">
                <Button
                    type="button"
                    variant={donationType === "specific" ? "default" : "ghost"}
                    onClick={() => {
                        setDonationType("specific");
                        setValue("donationType", "specific");
                    }}
                >
                    {t("chooseType.specific")}
                </Button>
                <Button
                    type="button"
                    variant={donationType === "foundation" ? "default" : "ghost"}
                    onClick={() => {
                        setDonationType("foundation");
                        setShelterId(null);
                        setValue("donationType", "foundation");
                        setValue("shelterId", "");
                    }}
                >
                    {t("chooseType.foundation")}
                </Button>
            </div>

            <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                    {t("chooseType.aboutProject")}
                </p>
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                        {donationType === "specific"
                            ? t("chooseType.shelterRequired")
                            : t("chooseType.shelterOptional")}
                    </Label>
                    <Controller
                        control={control}
                        name="shelterId"
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setShelterId(value ? Number(value) : null);
                                }}
                                disabled={donationType === "foundation"}
                            >
                                <SelectTrigger className="w-full bg-gray-500/10">
                                    <SelectValue placeholder={t("chooseType.shelterPlaceholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoading && (
                                        <SelectItem value="loading" disabled>
                                            {t("chooseType.loading")}
                                        </SelectItem>
                                    )}
                                    {data?.shelters.map((shelter) => (
                                        <SelectItem key={shelter.id} value={String(shelter.id)}>
                                            {shelter.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />

                </div>
            </div>

            <div className="space-y-3 py-6">
                <p className="text-sm font-semibold text-foreground">
                    {t("chooseType.amountTitle")}
                </p>
                <div className="flex justify-center items-center py-4">
                    <div className="relative">
                        <Controller
                            control={control}
                            name="amount"
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    value={field.value}
                                    onChange={(event) => {
                                        const clean = event.target.value.replace(/\D/g, "");
                                        field.onChange(clean);
                                        setAmount(clean);
                                    }}
                                    className="w-60 h-25 rounded-none border-0 border-b-2 border-primary/80 bg-transparent pr-8 text-center text-gray-500 text-[72px]! font-light leading-none shadow-none focus-visible:ring-0 focus-visible:border-primary caret-primary"
                                />
                            )}
                        />
                        <span className="pointer-events-none absolute bottom-3 right-10 text-[30px]! text-gray-800">
                            €
                        </span>
                    </div>
                </div>

                <div className="flex w-full gap-2">
                    {presetAmounts.map((preset) => (
                        <Button
                            key={preset}
                            type="button"
                            onClick={() => {
                                const value = String(preset);
                                setAmount(value);
                                setValue("amount", value);
                            }}
                            className={cn(
                                "flex-1 rounded-md px-4 py-2 text-sm font-medium",
                                Number(amount) === preset
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-foreground"
                            )}
                        >
                            {preset} €
                        </Button>
                    ))}
                </div>
            </div>

            {showErrors && amountValue <= 0 && (
                <Alert
                    variant="destructive"
                    className="flex items-center justify-between rounded-lg border-destructive/60 bg-destructive/10"
                >
                    <AlertDescription>
                        {t("chooseType.amountError")}
                    </AlertDescription>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                </Alert>
            )}

            {showErrors && isShelterRequired && !hasShelter && (
                <Alert
                    variant="destructive"
                    className="flex items-center justify-between rounded-lg border-destructive/60 bg-destructive/10"
                >
                    <AlertDescription>
                        {t("chooseType.shelterError")}
                    </AlertDescription>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                </Alert>
            )}

        </section>
    );
};

export default StepChooseType;