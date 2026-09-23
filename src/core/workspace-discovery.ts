import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { folderPathHash } from "./cli";
import type { Project } from "./types";

/** One VS Code folder window this profile has previously opened, recovered
 * from this profile's own `workspaceStorage` records (not a live VS Code
 * API: there is no public API listing folders that are not currently open). */
export interface KnownFolder {
  id: string;
  name: string;
  pathHash: string;
  lastUsedAt: number;
}

/** Reads every `workspaceStorage/<hash>/workspace.json` next to this
 * extension's own `globalStorage` directory and returns the local, single
 * folder ("file://") workspaces recorded there. Multi-root workspace files
 * and remote ("vscode-remote://", "wsl+", etc.) folders are skipped: their
 * project identity depends on data (workspace-file contents, remote-host
 * routing) this best-effort, read-only scan does not have. Never touches
 * usage content; only VS Code's own recorded folder path and mtime. */
export async function discoverKnownFolders(
  globalStorageFsPath: string,
): Promise<KnownFolder[]> {
  // globalStorageFsPath is ".../User/globalStorage/openhoo.hoosage"; its
  // sibling "workspaceStorage" holds one directory per known window.
  const userDir = dirname(dirname(globalStorageFsPath));
  const storageDir = join(userDir, "workspaceStorage");
  let entries: string[];
  try {
    entries = await readdir(storageDir);
  } catch {
    return [];
  }
  const results: KnownFolder[] = [];
  await Promise.all(
    entries.map(async (entry) => {
      try {
        const metaPath = join(storageDir, entry, "workspace.json");
        const raw = JSON.parse(await readFile(metaPath, "utf8"));
        const folderUri: unknown = raw?.folder;
        if (typeof folderUri !== "string" || !folderUri.startsWith("file://"))
          return;
        const fsPath = fileURLToPath(folderUri);
        const id = createHash("sha256")
          .update(folderUri)
          .digest("hex")
          .slice(0, 24);
        const folderStat = await stat(fsPath);
        if (!folderStat.isDirectory()) return;
        const { mtimeMs } = await stat(metaPath);
        results.push({
          id,
          name: basename(fsPath),
          pathHash: folderPathHash(fsPath),
          lastUsedAt: mtimeMs,
        });
      } catch {
        /* A single unreadable or malformed entry never blocks the rest. */
      }
    }),
  );
  return results;
}

/** Builds a placeholder project record for a folder that was previously
 * opened but has no history yet. `createdAt` uses the folder's last known
 * activity so it does not look freshly created in the dashboard. */
export function placeholderProject(folder: KnownFolder): Project {
  return {
    id: folder.id,
    name: folder.name,
    kind: "folder",
    folderCount: 1,
    createdAt: folder.lastUsedAt,
    pathHashes: [folder.pathHash],
  };
}
