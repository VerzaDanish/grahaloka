import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const customMessage = body.message || `Update konten via Admin CMS Grahaloka (${new Date().toLocaleString("id-ID")})`;

    // Step 1: Check status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    if (!statusOutput.trim()) {
      return NextResponse.json({
        success: true,
        message: "Tidak ada perubahan baru untuk di-commit.",
        alreadyClean: true,
      });
    }

    // Step 2: git add .
    await execAsync("git add .");

    // Step 3: git commit
    const commitCmd = `git commit -m "${customMessage.replace(/"/g, '\\"')}"`;
    const { stdout: commitOutput } = await execAsync(commitCmd);

    // Step 4: Try git push
    let pushed = false;
    let pushErrorDetails = "";
    try {
      // Get current branch
      const { stdout: branchOut } = await execAsync("git rev-parse --abbrev-ref HEAD");
      const currentBranch = branchOut.trim() || "main";

      // Try push to origin
      const { stdout: pushOut } = await execAsync(`git push origin ${currentBranch}`);
      pushed = true;
      pushErrorDetails = pushOut;
    } catch (pushErr: any) {
      // If default origin failed, try generic git push
      try {
        const { stdout: pushOut2 } = await execAsync("git push");
        pushed = true;
        pushErrorDetails = pushOut2;
      } catch (err2: any) {
        pushErrorDetails = err2.message || pushErr.message || "Remote origin belum dikonfigurasi.";
      }
    }

    return NextResponse.json({
      success: true,
      message: pushed
        ? "✅ Perubahan berhasil di-commit & di-push ke GitHub!"
        : "⚠️ Berhasil di-commit lokal! (Catatan: Push ke GitHub memerlukan `git remote add origin ...`)",
      pushed,
      commitLog: commitOutput.trim(),
      details: pushErrorDetails,
    });
  } catch (error: any) {
    console.error("Git Sync Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menjalankan Git Sync: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}
