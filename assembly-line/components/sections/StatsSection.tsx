"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { TrendingUp, Clock, DollarSign, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  color: string;
}

function AnimatedCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      }
    });
  }, [springValue, decimals, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

function StatCard({ icon, label, value, suffix, prefix, decimals, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card variant="gradient" className="relative overflow-hidden group hover:scale-105 transition-transform">
        {/* Background gradient accent */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `radial-gradient(circle at top right, ${color}20, transparent 70%)`,
          }}
        />

        <div className="relative z-10 space-y-3">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${color}30, ${color}10)`,
            }}
          >
            <div style={{ color }}>{icon}</div>
          </div>

          {/* Value */}
          <div>
            <div className="text-4xl font-bold text-[rgb(var(--foreground))]">
              <AnimatedCounter value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
            </div>
            <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">{label}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Resultados em Tempo Recorde
          </h2>
          <p className="text-lg text-[rgb(var(--foreground-secondary))] max-w-2xl mx-auto">
            Nossa Assembly Line de IA trabalha 24/7 para entregar campanhas completas em minutos, não meses.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Assets Criados"
            value={750}
            suffix="+"
            color="rgb(var(--phase1))"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Tempo Total"
            value={35}
            suffix=" min"
            color="rgb(var(--phase2))"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Custo por Campanha"
            value={1.75}
            prefix="$"
            decimals={2}
            color="rgb(var(--phase3))"
          />
          <StatCard
            icon={<Target className="w-6 h-6" />}
            label="Ticket Médio"
            value={45}
            prefix="R$"
            suffix="k"
            color="rgb(var(--phase4))"
          />
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-[rgb(var(--foreground-secondary))]">
            Dados baseados em médias de projetos reais processados pela Assembly Line
          </p>
        </motion.div>
      </div>
    </section>
  );
}
