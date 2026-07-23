import { useEffect, useRef } from "react";
import type { StageId } from "./pipeline";
import { stages } from "./pipeline";

export interface LogLine {
  id: number;
  stage: StageId;
  text: string;
}

const stageShort: Record<StageId, string> = Object.fromEntries(
  stages.map((s) => [s.id, s.short])
) as Record<StageId, string>;

export function LogConsole({ logs, running }: { logs: LogLine[]; running: boolean }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [logs.length]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: "var(--border)" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.06em" }}>orchestrator.log</span>
        <span className="flex items-center gap-1.5 text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
          <span className="h-2 w-2 rounded-full" style={{ background: running ? "var(--ryobi-green)" : "var(--muted-foreground)", animation: running ? "reveal 0.8s ease-in-out infinite alternate" : "none" }} />
          {running ? "running" : "idle"}
        </span>
      </div>
      <div className="flex-1 overflow-auto p-4" style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.7 }}>
        {logs.length === 0 ? (
          <span className="text-muted-foreground">$ awaiting run…</span>
        ) : (
          logs.map((l) => (
            <div key={l.id} className="logline flex gap-2">
              <span style={{ color: "var(--muted-foreground)", flexShrink: 0 }}>[{stageShort[l.stage]}]</span>
              <span style={{ color: l.text.startsWith("✓") ? "var(--ryobi-green)" : l.text.startsWith("○") ? "var(--muted-foreground)" : "var(--foreground)" }}>
                {l.text}
              </span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
