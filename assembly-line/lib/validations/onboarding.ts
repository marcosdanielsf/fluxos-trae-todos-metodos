import { z } from "zod";

// Step 1: Quem é Você?
export const step1Schema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  niche: z.string().min(1, "Selecione seu nicho"),
  yearsOfExperience: z.number().min(0, "Anos de experiência inválido"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  files: z.array(z.any()).optional(),
});

// Step 2: Seu Cliente Ideal
export const step2Schema = z.object({
  clientNiche: z.string().min(1, "Selecione o nicho do cliente"),
  ageRange: z.array(z.string()).min(1, "Selecione pelo menos uma faixa etária"),
  mainPain: z.string().min(10, "Descreva a principal dor do cliente"),
  mainDesire: z.string().min(10, "Descreva o principal desejo do cliente"),
  awarenessLevel: z.string().min(1, "Selecione o nível de consciência"),
});

// Step 3: Sua Oferta Principal
export const step3Schema = z.object({
  offerName: z.string().min(3, "Nome da oferta deve ter pelo menos 3 caracteres"),
  offerType: z.string().min(1, "Selecione o tipo de oferta"),
  price: z.number().min(1, "Preço deve ser maior que 0"),
  mainPromise: z.string().min(10, "Descreva a promessa principal"),
  duration: z.string().min(1, "Informe a duração/entrega"),
  hasGuarantee: z.boolean(),
  guaranteeDetails: z.string().optional(),
});

// Step 4: Objetivo da Campanha
export const step4Schema = z.object({
  campaignType: z.enum(["social_selling", "lead_magnet", "cac_zero"]),
});

// Complete Onboarding Schema
export const onboardingSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
