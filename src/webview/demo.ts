import type { Snapshot, UsageCall, Project } from "../core/types";
import { startOfRange } from "../core/analytics";

/** Explicitly labelled, deterministic sample data. Never enters local storage. */
export function demoSnapshot(now = Date.now()): Snapshot {
  const projects: Project[] = [
    "hoosage",
    "design-system",
    "platform-api",
    "docs",
  ].map((name, i) => ({
    id: `demo-${i}`,
    name,
    kind: "folder",
    folderCount: 1,
    createdAt: now - 30 * 86400000,
  }));
  const models = ["Claude Sonnet 4.6", "GPT-5.4", "Claude Opus 4.7"];
  const calls: UsageCall[] = [];
  let seed = 47;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let d = 0; d < 30; d++) {
    const day = new Date(startOfRange(30, now));
    day.setDate(day.getDate() + d);
    const count = Math.floor(8 + rand() * 22);
    for (let i = 0; i < count; i++) {
      const project = projects[Math.floor(rand() * rand() * 4)]!;
      const timestamp =
        day.getTime() + (8 * 60 + Math.floor(rand() * 540)) * 60_000;
      if (timestamp > now) continue;
      const input = Math.floor(1800 + rand() * 14000);
      calls.push({
        id: `demo-${d}-${i}`,
        projectId: project.id,
        timestamp,
        model: models[Math.floor(rand() * rand() * 3)]!,
        sessionId: `session-${d}-${Math.floor(i / 4)}`,
        input,
        output: Math.floor(100 + rand() * 1800),
        cacheRead: Math.floor(input * rand() * 0.7),
        cacheWrite: 0,
        durationMs: Math.floor(1500 + rand() * 7000),
        failed: rand() > 0.98,
      });
    }
  }
  return {
    projects,
    calls,
    currentProjectId: "demo-0",
    status: "active",
    statusDetail:
      "Sample data — explore the interface. Nothing here is your actual usage.",
    updatedAt: now,
    skippedLines: 0,
    errors: [],
    demo: true,
  };
}
