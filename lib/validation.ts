import { z } from "zod";

export const phoneCountrySchema = z.enum(["+421", "+420"]);

export const phoneSchema = z
  .string()
  .trim()
  .refine((value) => value.replace(/\D/g, "").length === 9, {
    message: "Telefónne číslo musí mať 9 číslic.",
  });

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || (value.length >= 2 && value.length <= 20),
      {
        message: "Meno musí mať 2–20 znakov alebo zostať prázdne.",
      }
    ),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "Priezvisko musí mať 2–30 znakov." })
    .max(30, { message: "Priezvisko musí mať 2–30 znakov." }),
  email: z.string().trim().email({ message: "Prosím, zadajte platný e-mail." }),
  phone: phoneSchema,
  phoneCountry: phoneCountrySchema,
  consent: z.literal(true, {
    message: "Prosím, potvrďte súhlas so spracovaním údajov.",
  }),
});

export const donationConfirmSchema = personalInfoSchema.extend({
  amount: z.coerce
    .number()
    .refine((value) => Number.isFinite(value) && value > 0, {
      message: "Zadajte sumu príspevku.",
    }),
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type DonationConfirmInput = z.infer<typeof donationConfirmSchema>;
