"use client";

import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

type DonationType = "specific" | "foundation";

type DonationState = {
  step: number;
  stepValid: boolean;
  showErrors: boolean;
  submitAction: (() => void) | null;
  donationType: DonationType;
  shelterId: number | null;
  amount: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountry: "+421" | "+420";
  consent: boolean;
  setStep: (value: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStepValid: (value: boolean) => void;
  setShowErrors: (value: boolean) => void;
  setSubmitAction: (value: (() => void) | null) => void;
  setDonationType: (value: DonationType) => void;
  setShelterId: (value: number | null) => void;
  setAmount: (value: string) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setPhoneCountry: (value: "+421" | "+420") => void;
  setConsent: (value: boolean) => void;
};

const donationStore = createStore<DonationState>((set) => ({
  step: 0,
  stepValid: false,
  showErrors: false,
  submitAction: null,
  donationType: "foundation",
  shelterId: null,
  amount: "50",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  phoneCountry: "+421",
  consent: false,
  setStep: (value) => set({ step: value }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(0, state.step - 1) })),
  setStepValid: (value) =>
    set((state) => (state.stepValid === value ? state : { stepValid: value })),
  setShowErrors: (value) =>
    set((state) => (state.showErrors === value ? state : { showErrors: value })),
  setSubmitAction: (value) =>
    set((state) => (state.submitAction === value ? state : { submitAction: value })),
  setDonationType: (value) => set({ donationType: value }),
  setShelterId: (value) => set({ shelterId: value }),
  setAmount: (value) => set({ amount: value }),
  setFirstName: (value) => set({ firstName: value }),
  setLastName: (value) => set({ lastName: value }),
  setEmail: (value) => set({ email: value }),
  setPhone: (value) => set({ phone: value }),
  setPhoneCountry: (value) => set({ phoneCountry: value }),
  setConsent: (value) => set({ consent: value }),
}));

export const useDonationStore = <T = DonationState>(
  selector: (state: DonationState) => T = (state) => state as T
) => useStore(donationStore, selector);
