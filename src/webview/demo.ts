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
  projects.push({
    id: "copilot-cli",
    name: "Copilot CLI",
    kind: "cli",
    folderCount: 0,
    createdAt: now - 30 * 86400000,
  });
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
  // Copilot CLI session-state entries: per-model-request deltas recorded when a
  // session ends, so they carry no durationMs and aggregate many requests.
  const cliCalls: Array<[number, number, string, string, number]> = [
    [1, 14, "demo-1", "claude-sonnet-4.6", 9],
    [3, 11, "copilot-cli", "claude-sonnet-4.6", 14],
    [5, 16, "copilot-cli", "gpt-5.4", 6],
  ];
  for (const [daysAgo, hour, projectId, model, requests] of cliCalls) {
    const timestamp = now - daysAgo * 86400000 - hour * 3600000;
    const input = 42000 + requests * 3100;
    calls.push({
      id: `demo-cli-${daysAgo}`,
      projectId,
      timestamp,
      model,
      sessionId: `cli-session-${daysAgo}`,
      source: "cli",
      input,
      output: 2400 + requests * 260,
      cacheRead: Math.floor(input * 0.55),
      cacheWrite: Math.floor(input * 0.08),
      requests,
      failed: false,
    });
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
