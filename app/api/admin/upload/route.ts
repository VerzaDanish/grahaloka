import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Pastikan folder public/uploads/ ada
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Bersihkan nama file
    const sanitizeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
    const uniqueName = `${Date.now()}-${sanitizeName}`;
    const filePath = path.join(uploadDir, uniqueName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueName,
      sizeBytes: buffer.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengunggah file";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
