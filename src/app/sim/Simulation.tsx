import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw, ChevronRight, Pause } from "lucide-react";
import { PipelineNodes } from "./PipelineNodes";
import { CodePanel } from "./CodePanel";
import { BriefCard } from "./BriefCard";
import { LogConsole, type LogLine } from "./LogConsole";
import { steps, stageOrder } from "./pipeline";

const LINE_MS = 380;
const ADVANCE_MS = 850;

export function Simulation() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const logId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Stream the active stage's log lines, then auto-advance if running.
  useEffect(() => {
    if (activeIndex < 0) return;
    const stage = stageOrder[activeIndex];
    const lines = steps[stage].log;
    clearTimers();

    lines.forEach((text, i) => {
      const t = setTimeout(() => {
        setLogs((prev) => [...prev, { id: logId.current++, stage, text }]);
      }, i * LINE_MS);
      timers.current.push(t);
    });

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // Auto-advance is driven separately so it always sees fresh `running`.
  useEffect(() => {
    if (!running || activeIndex < 0) return;
    const stage = stageOrder[activeIndex];
    const total = steps[stage].log.length * LINE_MS + ADVANCE_MS;
    const t = setTimeout(() => {
      setActiveIndex((idx) => {
        if (idx >= stageOrder.length - 1) {
          setRunning(false);
          return idx;
        }
        return idx + 1;
      });
    }, total);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, activeIndex]);

  const run = useCallback(() => {
    clearTimers();
    logId.current = 0;
    setLogs([]);
    setActiveIndex(0);
    setRunning(true);
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    logId.current = 0;
    setLogs([]);
    setRunning(false);
    setActiveIndex(-1);
  }, []);

  const step = useCallback(() => {
    setRunning(false);
    setActiveIndex((idx) => (idx < stageOrder.length - 1 ? idx + 1 : idx));
  }, []);

  const jump = useCallback((i: number) => {
    setRunning(false);
    clearTimers();
    setActiveIndex(i);
  }, []);

  useEffect(() => () => clearTimers(), []);

  const current = activeIndex >= 0 ? steps[stageOrder[activeIndex]] : null;
  const atEnd = activeIndex >= stageOrder.length - 1;

  return (
    <div className="flex flex-col gap-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={running ? () => setRunning(false) : run}
          className="flex items-center gap-2 rounded-md px-4 py-2.5 transition-opacity hover:opacity-90"
          style={{ background: "var(--ryobi-green)", color: "#fff", fontSize: 14, fontWeight: 600 }}
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? "Pause" : activeIndex < 0 ? "Run pipeline" : atEnd ? "Run again" : "Resume"}
        </button>
        <button
          onClick={step}
          disabled={running || atEnd}
          className="flex items-center gap-2 rounded-md border px-4 py-2.5 transition-colors hover:bg-muted disabled:opacity-40"
          style={{ borderColor: "var(--border)", fontSize: 14 }}
        >
          Step <ChevronRight size={16} />
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-md border px-4 py-2.5 transition-colors hover:bg-muted"
          style={{ borderColor: "var(--border)", fontSize: 14 }}
        >
          <RotateCcw size={15} /> Reset
        </button>
        <div className="ml-auto text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
          {activeIndex < 0 ? "stage 0 / 5" : `stage ${activeIndex + 1} / 5`}
        </div>
      </div>

      {/* Pipeline nodes */}
      <PipelineNodes activeIndex={activeIndex} onJump={jump} />

      {/* Stage caption */}
      <div className="rounded-md border p-4" style={{ borderColor: "var(--border)", background: current ? "var(--accent)" : "transparent" }}>
        {current ? (
          <div key={activeIndex} className="reveal">
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>{current.heading}</div>
            <p className="mt-1 text-muted-foreground" style={{ fontSize: 14, lineHeight: 1.55 }}>{current.caption}</p>
          </div>
        ) : (
          <p className="text-muted-foreground" style={{ fontSize: 14 }}>
            Press <strong style={{ color: "var(--foreground)" }}>Run pipeline</strong> to watch the orchestrator pull Sprout Social data, package it for Claude, then repackage Claude's reasoning into a brief for RYOBI's marketing team.
          </p>
        )}
      </div>

      {/* Artifact + log */}
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]" style={{ minHeight: 440 }}>
        <div key={activeIndex} className="reveal" style={{ minHeight: 440 }}>
          {!current ? (
            <PlaceholderPanel />
          ) : current.artifact.kind === "brief" ? (
            <BriefCard />
          ) : current.artifact.kind === "json" ? (
            <CodePanel title={current.artifact.title} badge={current.artifact.badge} code={current.artifact.code} />
          ) : null}
        </div>
        <LogConsole logs={logs} running={running} />
      </div>
    </div>
  );
}

function PlaceholderPanel() {
  return (
    <div className="flex h-full min-h-[440px] flex-col items-center justify-center rounded-md border border-dashed" style={{ borderColor: "var(--border)" }}>
      <div className="text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>payload viewer</div>
      <div className="mt-1 text-muted-foreground" style={{ fontSize: 13 }}>the artifact at each stage renders here</div>
    </div>
  );
}
