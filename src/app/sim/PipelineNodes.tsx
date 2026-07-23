import { Database, Boxes, Sparkles, Send, Users, Check } from "lucide-react";
import { stages, stageOrder, type StageId } from "./pipeline";

const icons: Record<StageId, React.ComponentType<{ size?: number }>> = {
  sprout: Database,
  package: Boxes,
  claude: Sparkles,
  deliver: Send,
  team: Users,
};

export function PipelineNodes({
  activeIndex,
  onJump,
}: {
  activeIndex: number;
  onJump: (i: number) => void;
}) {
  return (
    <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
      {stages.map((s, i) => {
        const Icon = icons[s.id];
        const active = i === activeIndex;
        const done = i < activeIndex;
        const isOrch = s.side === "orchestrator";
        return (
          <div key={s.id} className="flex flex-1 items-center gap-1" style={{ minWidth: 132 }}>
            <button
              onClick={() => onJump(i)}
              className="group relative flex w-full flex-col gap-2 rounded-md border p-3 text-left transition-all"
              style={{
                borderColor: active ? "var(--ryobi-green)" : done ? "rgba(75,166,42,0.35)" : "var(--border)",
                background: active ? "var(--accent)" : "transparent",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-sm transition-colors"
                  style={{
                    background: active || done ? "var(--ryobi-green)" : "var(--muted)",
                    color: active || done ? "#fff" : "var(--muted-foreground)",
                  }}
                >
                  {done ? <Check size={16} /> : <Icon size={16} />}
                </span>
                {isOrch && (
                  <span
                    className="rounded-full px-2 py-0.5"
                    style={{ background: "var(--ryobi-black)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em" }}
                  >
                    ORCH
                  </span>
                )}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.08em", color: active ? "var(--ryobi-green)" : "var(--muted-foreground)" }}>
                  {String(i + 1).padStart(2, "0")} · {s.short}
                </div>
                <div className="mt-0.5" style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.15 }}>{s.label}</div>
                <div className="text-muted-foreground" style={{ fontSize: 11.5 }}>{s.actor}</div>
              </div>
              {active && (
                <span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full" style={{ background: "var(--ryobi-green)" }} />
              )}
            </button>
            {i < stageOrder.length - 1 && (
              <svg width="18" height="10" viewBox="0 0 18 10" className="shrink-0">
                <line
                  x1="0" y1="5" x2="18" y2="5"
                  stroke={i < activeIndex ? "var(--ryobi-green)" : "var(--border)"}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  style={i === activeIndex - 0 && i < activeIndex ? undefined : i === activeIndex ? { animation: "dashflow 0.6s linear infinite", stroke: "var(--ryobi-green)" } : undefined}
                />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}
