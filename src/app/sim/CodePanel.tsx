// Renders a JSON / HTTP artifact with lightweight token coloring.
function colorize(line: string) {
  // keys "foo":
  const parts: React.ReactNode[] = [];
  const keyMatch = line.match(/^(\s*)"([^"]+)"(\s*:)/);
  if (keyMatch) {
    const rest = line.slice(keyMatch[0].length);
    parts.push(<span key="k">{keyMatch[1]}<span style={{ color: "var(--ryobi-green)" }}>"{keyMatch[2]}"</span>{keyMatch[3]}</span>);
    parts.push(<span key="v" style={{ color: "#c7cabf" }}>{rest}</span>);
    return parts;
  }
  if (/^(POST|GET|PUT)\s/.test(line.trim())) {
    return <span style={{ color: "var(--ryobi-green-bright)", fontWeight: 600 }}>{line}</span>;
  }
  return <span style={{ color: "#c7cabf" }}>{line}</span>;
}

export function CodePanel({ title, badge, code }: { title: string; badge: string; code: string }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border" style={{ borderColor: "rgba(255,255,255,0.12)", background: "var(--ryobi-black)" }}>
      <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--ryobi-green)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "#fff" }}>{title}</span>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)" }}>{badge}</span>
      </div>
      <pre className="flex-1 overflow-auto p-4" style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>
        {code.split("\n").map((line, i) => (
          <div key={i} className="logline" style={{ animationDelay: Math.min(i * 22, 700) + "ms", whiteSpace: "pre" }}>
            {colorize(line)}
          </div>
        ))}
      </pre>
    </div>
  );
}
