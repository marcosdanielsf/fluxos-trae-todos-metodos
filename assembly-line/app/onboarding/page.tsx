"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  type Step1FormData,
  type Step2FormData,
  type Step3FormData,
  type Step4FormData,
} from "@/lib/validations/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { MessageSquare, Magnet, TrendingUp, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProject } from "@/contexts/ProjectContext";
import { saveProject } from "@/lib/services/projects";

type FormData = Step1FormData | Step2FormData | Step3FormData | Step4FormData;

export default function OnboardingPage() {
  const router = useRouter();
  const { setOnboardingData } = useProject();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = async (data: FormData) => {
    setFormData({ ...formData, [`step${currentStep}`]: data });

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit final form - SAVE TO CONTEXT
      setIsLoading(true);

      const completeData = { ...formData, [`step${currentStep}`]: data };
      console.log("Complete form data:", completeData);

      // Consolidate all data into OnboardingData format
      const onboardingData = {
        // Step 1
        fullName: completeData.step1?.fullName || "",
        niche: completeData.step1?.niche || "",
        yearsOfExperience: completeData.step1?.yearsOfExperience || 0,
        description: completeData.step1?.description || "",
        files: completeData.step1?.files || [],

        // Step 2
        clientName: completeData.step2?.clientNiche || "",
        clientAge: completeData.step2?.ageRange?.join(", ") || "",
        clientGender: "",
        clientPain: completeData.step2?.mainPain || "",
        clientDesire: completeData.step2?.mainDesire || "",

        // Step 3
        offerName: completeData.step3?.offerName || "",
        offerPrice: completeData.step3?.price?.toString() || "0",
        offerDescription: completeData.step3?.mainPromise || "",
        guaranteeType: completeData.step3?.hasGuarantee
          ? completeData.step3?.guaranteeDetails || "Sim"
          : "Não",

        // Step 4
        funnelType: completeData.step4?.campaignType || "social_selling",
      };

      // Save to context (which saves to localStorage)
      setOnboardingData(onboardingData);

      // Save project to Supabase
      try {
        const projectId = await saveProject({
          name: `${onboardingData.offerName} - ${onboardingData.clientName}`,
          niche: onboardingData.niche,
          description: onboardingData.description,
          clientName: onboardingData.clientName,
          currentPhase: 1,
          status: "em-andamento",
          totalCost: 0,
        });

        console.log("✅ Projeto salvo no Supabase com ID:", projectId);

        // Store project ID in context for later use
        localStorage.setItem("currentProjectId", projectId);
      } catch (error) {
        console.error("❌ Erro ao salvar projeto no Supabase:", error);
        // Continue anyway - data is saved in context/localStorage
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("✅ Dados salvos no contexto:", onboardingData);
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(var(--background))] to-[rgb(var(--background-secondary))] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-[rgb(var(--foreground-secondary))]">
              Etapa {currentStep} de {totalSteps}
            </h2>
            <span className="text-sm font-medium text-[rgb(var(--foreground-secondary))]">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Step Content */}
        {currentStep === 1 && <Step1 onNext={handleNext} onBack={handleBack} initialData={formData.step1} />}
        {currentStep === 2 && <Step2 onNext={handleNext} onBack={handleBack} initialData={formData.step2} />}
        {currentStep === 3 && <Step3 onNext={handleNext} onBack={handleBack} initialData={formData.step3} />}
        {currentStep === 4 && (
          <Step4 onNext={handleNext} onBack={handleBack} initialData={formData.step4} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}

// STEP 1: Quem é Você?
function Step1({
  onNext,
  onBack,
  initialData,
}: {
  onNext: (data: Step1FormData) => void;
  onBack: () => void;
  initialData?: Step1FormData;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: initialData,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Vamos começar pelo básico</CardTitle>
        <CardDescription className="text-base">
          Conte-nos sobre você e sua experiência
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nome completo *</label>
            <Input
              {...register("fullName")}
              placeholder="Seu nome completo"
              error={errors.fullName?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nicho/Área de atuação *</label>
            <Select {...register("niche")} error={errors.niche?.message}>
              <option value="">Selecione...</option>
              <option value="marketing">Marketing Digital</option>
              <option value="coach">Coach</option>
              <option value="consultor">Consultor</option>
              <option value="infoprodutor">Infoprodutor</option>
              <option value="ecommerce">E-commerce</option>
              <option value="servicos">Serviços</option>
              <option value="outro">Outro</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Anos de experiência *</label>
            <Input
              {...register("yearsOfExperience", { valueAsNumber: true })}
              type="number"
              min="0"
              placeholder="0"
              error={errors.yearsOfExperience?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Breve descrição *</label>
            <Textarea
              {...register("description")}
              rows={3}
              placeholder="Conte um pouco sobre sua trajetória e o que você faz..."
              error={errors.description?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Upload de materiais (opcional)
            </label>
            <FileUpload
              onFilesChange={(files) => setValue("files", files)}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onBack} disabled>
              Voltar
            </Button>
            <Button type="submit" className="flex-1">
              Próximo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// STEP 2: Seu Cliente Ideal
function Step2({
  onNext,
  onBack,
  initialData,
}: {
  onNext: (data: Step2FormData) => void;
  onBack: () => void;
  initialData?: Step2FormData;
}) {
  const [selectedAges, setSelectedAges] = useState<string[]>(initialData?.ageRange || []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: initialData,
  });

  const ageRanges = ["18-24", "25-34", "35-44", "45-54", "55+"];

  const toggleAgeRange = (age: string) => {
    const newAges = selectedAges.includes(age)
      ? selectedAges.filter((a) => a !== age)
      : [...selectedAges, age];
    setSelectedAges(newAges);
    setValue("ageRange", newAges);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Quem você ajuda?</CardTitle>
        <CardDescription className="text-base">
          Defina seu cliente ideal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nicho do cliente *</label>
            <Input
              {...register("clientNiche")}
              placeholder="Ex: Médicos, Coaches, E-commerces..."
              error={errors.clientNiche?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Faixa etária *</label>
            <div className="flex flex-wrap gap-2">
              {ageRanges.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => toggleAgeRange(age)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedAges.includes(age)
                      ? "bg-[rgb(var(--primary))] border-[rgb(var(--primary))] text-white"
                      : "border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]"
                  }`}
                >
                  {age} anos
                </button>
              ))}
            </div>
            {errors.ageRange && (
              <p className="mt-1 text-xs text-[rgb(var(--error))]">
                {errors.ageRange.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Principal dor/problema *</label>
            <Textarea
              {...register("mainPain")}
              rows={3}
              placeholder="Qual é o maior problema que seu cliente enfrenta?"
              error={errors.mainPain?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Principal desejo/objetivo *</label>
            <Textarea
              {...register("mainDesire")}
              rows={3}
              placeholder="O que seu cliente realmente deseja alcançar?"
              error={errors.mainDesire?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nível de consciência *</label>
            <Select {...register("awarenessLevel")} error={errors.awarenessLevel?.message}>
              <option value="">Selecione...</option>
              <option value="inconsciente">Inconsciente</option>
              <option value="problema">Consciente do Problema</option>
              <option value="solucao">Consciente da Solução</option>
              <option value="comparando">Comparando</option>
              <option value="pronto">Pronto para Comprar</option>
            </Select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Voltar
            </Button>
            <Button type="submit" className="flex-1">
              Próximo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// STEP 3: Sua Oferta Principal
function Step3({
  onNext,
  onBack,
  initialData,
}: {
  onNext: (data: Step3FormData) => void;
  onBack: () => void;
  initialData?: Step3FormData;
}) {
  const [hasGuarantee, setHasGuarantee] = useState(initialData?.hasGuarantee || false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: initialData,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">O que você vende?</CardTitle>
        <CardDescription className="text-base">
          Defina sua oferta principal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nome da oferta *</label>
            <Input
              {...register("offerName")}
              placeholder="Ex: Mentoria Premium"
              error={errors.offerName?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipo de oferta *</label>
            <Select {...register("offerType")} error={errors.offerType?.message}>
              <option value="">Selecione...</option>
              <option value="mentoria_individual">Mentoria Individual</option>
              <option value="mentoria_grupo">Mentoria em Grupo</option>
              <option value="curso">Curso</option>
              <option value="servico">Serviço</option>
              <option value="consultoria">Consultoria</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preço (R$) *</label>
            <Input
              {...register("price", { valueAsNumber: true })}
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              error={errors.price?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Promessa principal *</label>
            <Textarea
              {...register("mainPromise")}
              rows={2}
              placeholder="Ex: Sair do zero para R$50k/mês"
              error={errors.mainPromise?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duração/Entrega *</label>
            <Input
              {...register("duration")}
              placeholder="Ex: 6 meses, 12 semanas..."
              error={errors.duration?.message}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("hasGuarantee")}
                onChange={(e) => {
                  setHasGuarantee(e.target.checked);
                  setValue("hasGuarantee", e.target.checked);
                }}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">Possui garantia?</span>
            </label>
          </div>

          {hasGuarantee && (
            <div>
              <label className="block text-sm font-medium mb-2">Detalhes da garantia</label>
              <Textarea
                {...register("guaranteeDetails")}
                rows={2}
                placeholder="Ex: Garantia incondicional de 30 dias"
              />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Voltar
            </Button>
            <Button type="submit" className="flex-1">
              Próximo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// STEP 4: Objetivo da Campanha
function Step4({
  onNext,
  onBack,
  initialData,
  isLoading,
}: {
  onNext: (data: Step4FormData) => void;
  onBack: () => void;
  initialData?: Step4FormData;
  isLoading: boolean;
}) {
  const [selected, setSelected] = useState<string>(initialData?.campaignType || "");

  const {
    handleSubmit,
    setValue,
  } = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: initialData,
  });

  const campaigns = [
    {
      id: "social_selling",
      title: "Social Selling",
      description: "Vendas no 1:1 através de conversas",
      icon: MessageSquare,
      badge: "Recomendado para Iniciantes",
      badgeVariant: "success" as const,
    },
    {
      id: "lead_magnet",
      title: "Funil Iscador",
      description: "Captação massiva de leads qualificados",
      icon: Magnet,
      badge: "Alto Volume",
      badgeVariant: "info" as const,
    },
    {
      id: "cac_zero",
      title: "Funil CAC ZERO",
      description: "Lista de clientes a custo zero",
      icon: TrendingUp,
      badge: "Escalável",
      badgeVariant: "warning" as const,
    },
  ];

  const handleSelect = (id: string) => {
    setSelected(id);
    setValue("campaignType", id as any);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Qual funil vamos criar primeiro?</CardTitle>
        <CardDescription className="text-base">
          Escolha o objetivo da sua campanha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {campaigns.map((campaign) => {
              const Icon = campaign.icon;
              return (
                <button
                  key={campaign.id}
                  type="button"
                  onClick={() => handleSelect(campaign.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left hover:scale-105 ${
                    selected === campaign.id
                      ? "border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/5 shadow-lg"
                      : "border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/50"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-[rgb(var(--card))] rounded-lg">
                        <Icon className="h-6 w-6 text-[rgb(var(--primary))]" />
                      </div>
                      {selected === campaign.id && (
                        <div className="w-6 h-6 bg-[rgb(var(--primary))] rounded-full flex items-center justify-center">
                          <ChevronRight className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{campaign.title}</h3>
                      <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                        {campaign.description}
                      </p>
                    </div>
                    <Badge variant={campaign.badgeVariant} size="sm">
                      {campaign.badge}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Voltar
            </Button>
            <Button
              type="submit"
              className="flex-1 animate-pulse"
              size="lg"
              loading={isLoading}
              disabled={!selected}
            >
              Iniciar Projeto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
