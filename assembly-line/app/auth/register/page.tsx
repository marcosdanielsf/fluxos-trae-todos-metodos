"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Bot, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    // Simular chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Register data:", data);
    setIsLoading(false);
    // Redirecionar para onboarding
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[rgb(var(--background))] to-[rgb(var(--background-secondary))] p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-xl">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] bg-clip-text text-transparent">
              Assembly Line
            </h1>
          </div>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Crie sua conta</CardTitle>
            <CardDescription className="text-base">
              Transforme seu negócio em uma máquina de marketing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Input */}
              <div>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="seu@email.com"
                  icon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha (mínimo 6 caracteres)"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--foreground))] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.confirmPassword?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--foreground))] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
              >
                Criar Conta
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[rgb(var(--border))]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[rgb(var(--card))] px-2 text-[rgb(var(--foreground-secondary))]">
                    ou
                  </span>
                </div>
              </div>

              {/* Google Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-[rgb(var(--foreground-secondary))] mt-6">
                Já tem uma conta?{" "}
                <Link
                  href="/auth/login"
                  className="text-[rgb(var(--primary))] hover:underline font-medium"
                >
                  Faça login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
