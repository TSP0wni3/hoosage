import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const key = (sessionId: string) =>
  createHash("sha256").update(sessionId).digest("hex");

export async function registerWindow(
  root: string,
  sessionId: string,
  projectId: string,
) {
  const directory = join(root, "windows");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const file = join(directory, key(sessionId));
  try {
    await writeFile(file, projectId, { flag: "wx", mode: 0o600 });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    if ((await readFile(file, "utf8")) !== projectId) {
      // A reused window must never keep charging its former workspace.
      await writeFile(file, "", { mode: 0o600 });
      throw new Error(
        "This window was registered to another project. Open the project in a new window.",
      );
    }
  }
}

export async function routeWindow(root: string, sessionId: string) {
  if (!sessionId || sessionId.length > 256) return;
  try {
    const projectId = await readFile(
      join(root, "windows", key(sessionId)),
      "utf8",
    );
    if (!/^[a-f0-9]{24}$/.test(projectId)) return;
    return {
      projectId,
      file: join(root, "projects", projectId, "copilot.jsonl"),
    };
  } catch {
    return;
  }
}
