import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout } = await execAsync("git status --porcelain", {
      cwd: process.cwd(),
    });

    const lines = stdout
      .trim()
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const changedFiles = lines.map((line) => {
      // status codes e.g. "M data/articles.json" or "?? public/uploads/xyz.webp"
      const status = line.substring(0, 2).trim();
      const file = line.substring(2).trim();
      return { status, file };
    });

    const hasChanges = changedFiles.length > 0;
    const timeStr = new Date().toLocaleString("id-ID");
    const defaultMsg = `Update konten via Admin CMS Grahaloka (${timeStr})`;
    const commandText = `git add . && git commit -m "${defaultMsg}" && git push origin main`;

    return NextResponse.json({
      success: true,
      hasUncommittedChanges: hasChanges,
      changedFilesCount: changedFiles.length,
      files: changedFiles,
      gitCommand: commandText,
      commitMessage: defaultMsg,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Tidak dapat memeriksa status git";
    return NextResponse.json({
      success: false,
      hasUncommittedChanges: false,
      changedFilesCount: 0,
      files: [],
      gitCommand: 'git add . && git commit -m "Update content" && git push',
      error: message,
    });
  }
}
