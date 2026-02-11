import { z } from "zod";

export type ValidationMessages = {
  firstNameInvalid: string;
  firstNameLettersOnly: string;
  lastNameInvalid: string;
  lastNameLettersOnly: string;
  emailInvalid: string;
  phoneInvalid: string;
  consentRequired: string;
  amountRequired: string;
};

export type PersonalInfoInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountry: "+421" | "+420";
  consent: boolean;
};

export type DonationConfirmInput = PersonalInfoInput & {
  amount: number;
};

export const phoneCountrySchema = z.enum(["+421", "+420"]);

export const createPersonalInfoSchema = (messages: ValidationMessages) =>
  z.object({
    firstName: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || /^[\p{L}\s-]+$/u.test(value),
        {
          message: messages.firstNameLettersOnly,
        }
      )
      .refine(
        (value) => value.length === 0 || (value.length >= 2 && value.length <= 20),
        {
          message: messages.firstNameInvalid,
        }
      ),
    lastName: z
      .string()
      .trim()
      .refine(
        (value) => /^[\p{L}\s-]+$/u.test(value),
        {
          message: messages.lastNameLettersOnly,
        }
      )
      .min(2, { message: messages.lastNameInvalid })
      .max(30, { message: messages.lastNameInvalid }),
    email: z.string().trim().email({ message: messages.emailInvalid }),
    phone: z
      .string()
      .trim()
      .refine((value) => value.replace(/\D/g, "").length === 9, {
        message: messages.phoneInvalid,
      }),
    phoneCountry: phoneCountrySchema,
    consent: z.literal(true, {
      message: messages.consentRequired,
    }),
  });

export const createDonationConfirmSchema = (messages: ValidationMessages) =>
  createPersonalInfoSchema(messages).extend({
    amount: z.coerce
      .number()
      .refine((value) => Number.isFinite(value) && value > 0, {
        message: messages.amountRequired,
      }),
  });
