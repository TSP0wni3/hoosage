export interface Project {
  id: string;
  name: string;
  kind: "folder" | "workspace";
  folderCount: number;
  createdAt: number;
}

// This allowlist is the entire persisted/exported usage model. No prompts or code.
export interface UsageCall {
  id: string;
  projectId: string;
  timestamp: number;
  model: string;
  sessionId?: string;
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  nanoAiu?: number;
  durationMs: number;
  failed: boolean;
}

export type TrackingStatus =
  "off" | "waiting" | "active" | "blocked" | "reload";
export interface Snapshot {
  projects: Project[];
  calls: UsageCall[];
  currentProjectId?: string;
  status: TrackingStatus;
  statusDetail: string;
  updatedAt: number;
  skippedLines: number;
  errors: string[];
  demo?: boolean;
}

export interface Totals {
  calls: number;
  input: number;
  output: number;
  tokens: number;
  cacheRead: number;
  sessions: number;
  missingUsage: number;
  failed: number;
  avgDurationMs: number;
}
