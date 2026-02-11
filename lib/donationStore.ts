"use client";

import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

type DonationType = "specific" | "foundation";

type DonationState = {
  step: number;
  stepValid: boolean;
  showErrors: boolean;
  submitAction: (() => void) | null;
  submitSuccess: boolean;
  donationType: DonationType;
  shelterId: number | null;
  amount: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountry: "+421" | "+420";
  consent: boolean;
  additionalContributors: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    phoneCountry: "+421" | "+420";
    consent: boolean;
    isExpanded: boolean;
  }>;
  setStep: (value: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStepValid: (value: boolean) => void;
  setShowErrors: (value: boolean) => void;
  setSubmitAction: (value: (() => void) | null) => void;
  setSubmitSuccess: (value: boolean) => void;
  setDonationType: (value: DonationType) => void;
  setShelterId: (value: number | null) => void;
  setAmount: (value: string) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setPhoneCountry: (value: "+421" | "+420") => void;
  setConsent: (value: boolean) => void;
  addAdditionalContributor: () => void;
  updateAdditionalContributor: (
    index: number,
    value: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      phoneCountry: "+421" | "+420";
      consent: boolean;
      isExpanded: boolean;
    }>
  ) => void;
  removeAdditionalContributor: (index: number) => void;
  toggleAdditionalContributor: (index: number) => void;
};

const donationStore = createStore<DonationState>((set) => ({
  step: 0,
  stepValid: false,
  showErrors: false,
  submitAction: null,
  submitSuccess: false,
  donationType: "foundation",
  shelterId: null,
  amount: "50",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  phoneCountry: "+421",
  consent: false,
  additionalContributors: [],
  setStep: (value) => set({ step: value }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(0, state.step - 1) })),
  setStepValid: (value) =>
    set((state) => (state.stepValid === value ? state : { stepValid: value })),
  setShowErrors: (value) =>
    set((state) => (state.showErrors === value ? state : { showErrors: value })),
  setSubmitAction: (value) =>
    set((state) => (state.submitAction === value ? state : { submitAction: value })),
  setSubmitSuccess: (value) =>
    set((state) => (state.submitSuccess === value ? state : { submitSuccess: value })),
  setDonationType: (value) => set({ donationType: value }),
  setShelterId: (value) => set({ shelterId: value }),
  setAmount: (value) => set({ amount: value }),
  setFirstName: (value) => set({ firstName: value }),
  setLastName: (value) => set({ lastName: value }),
  setEmail: (value) => set({ email: value }),
  setPhone: (value) => set({ phone: value }),
  setPhoneCountry: (value) => set({ phoneCountry: value }),
  setConsent: (value) => set({ consent: value }),
  addAdditionalContributor: () =>
    set((state) => ({
      additionalContributors: [
        ...state.additionalContributors,
        {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          phoneCountry: "+421",
          consent: false,
          isExpanded: true,
        },
      ],
    })),
  updateAdditionalContributor: (index, value) =>
    set((state) => ({
      additionalContributors: state.additionalContributors.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...value } : item
      ),
    })),
  removeAdditionalContributor: (index) =>
    set((state) => ({
      additionalContributors: state.additionalContributors.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    })),
  toggleAdditionalContributor: (index) =>
    set((state) => ({
      additionalContributors: state.additionalContributors.map((item, itemIndex) =>
        itemIndex === index ? { ...item, isExpanded: !item.isExpanded } : item
      ),
    })),
}));

export const useDonationStore = <T = DonationState>(
  selector: (state: DonationState) => T = (state) => state as T
) => useStore(donationStore, selector);
