"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WorkflowNodeData } from "./workflow-data";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

// Phase Node: Larger cards for macro view
export function PhaseNode({ data }: NodeProps<WorkflowNodeData>) {
  const phaseColors = {
    1: "rgb(var(--phase1))",
    2: "rgb(var(--phase2))",
    3: "rgb(var(--phase3))",
    4: "rgb(var(--phase4))",
  };

  const phaseColor = phaseColors[data.phase as keyof typeof phaseColors];
  const phaseVariant = `phase${data.phase}` as "phase1" | "phase2" | "phase3" | "phase4";

  const StatusIcon = () => {
    if (data.status === "completed") return <CheckCircle2 className="w-5 h-5 text-[rgb(var(--success))]" />;
    if (data.status === "active") return <Loader2 className="w-5 h-5 text-[rgb(var(--primary))] animate-spin" />;
    return <Circle className="w-5 h-5 text-[rgb(var(--foreground-secondary))]" />;
  };

  return (
    <div
      className={cn(
        "px-6 py-4 rounded-xl border-2 bg-[rgb(var(--card))] shadow-lg transition-all hover:scale-105 min-w-[250px]",
        data.status === "active" && "glow-blue-strong"
      )}
      style={{
        borderColor: phaseColor,
        background: `linear-gradient(135deg, rgba(${data.phase === 1 ? "37, 99, 235" : data.phase === 2 ? "16, 185, 129" : data.phase === 3 ? "168, 85, 247" : "249, 115, 22"}, 0.05), rgb(var(--card)))`,
      }}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3" style={{ background: phaseColor }} />

      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <StatusIcon />
          <h3 className="font-bold text-lg text-[rgb(var(--foreground))]">{data.label}</h3>
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-sm text-[rgb(var(--foreground-secondary))]">{data.description}</p>
        )}

        {/* Agent count badge */}
        {data.agentCount && (
          <Badge variant={phaseVariant} size="sm">
            {data.agentCount} Agentes
          </Badge>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3" style={{ background: phaseColor }} />
    </div>
  );
}

// Agent Node: Smaller cards for detailed view
export function AgentNode({ data }: NodeProps<WorkflowNodeData>) {
  const phaseColors = {
    1: "rgb(var(--phase1))",
    2: "rgb(var(--phase2))",
    3: "rgb(var(--phase3))",
    4: "rgb(var(--phase4))",
  };

  const phaseColor = phaseColors[data.phase as keyof typeof phaseColors];
  const phaseVariant = `phase${data.phase}` as "phase1" | "phase2" | "phase3" | "phase4";

  const StatusIcon = () => {
    if (data.status === "completed") return <CheckCircle2 className="w-4 h-4 text-[rgb(var(--success))]" />;
    if (data.status === "active") return <Loader2 className="w-4 h-4 text-[rgb(var(--primary))] animate-spin" />;
    return <Circle className="w-4 h-4 text-[rgb(var(--foreground-secondary))]" />;
  };

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border bg-[rgb(var(--card))] shadow-md transition-all hover:scale-105 min-w-[180px]",
        data.status === "active" && "glow-blue"
      )}
      style={{
        borderColor: phaseColor,
      }}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" style={{ background: phaseColor }} />

      <div className="space-y-2">
        {/* Badge */}
        <Badge variant={phaseVariant} size="sm">
          Fase {data.phase}
        </Badge>

        {/* Agent name */}
        <div className="flex items-center gap-2">
          <StatusIcon />
          <h4 className="font-semibold text-sm text-[rgb(var(--foreground))]">{data.label}</h4>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" style={{ background: phaseColor }} />
    </div>
  );
}
