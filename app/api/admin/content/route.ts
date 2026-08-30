import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const contentFilePath = path.join(process.cwd(), "data", "site-content.json");

async function readContent() {
  try {
    const data = await fs.readFile(contentFilePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      hero: {
        badge: "Jasa Kontraktor & Arsitek 3D Terpercaya",
        title: "Mewujudkan Hunian Impian dengan Presisi & Garansi Kualitas",
        description: "Layanan lengkap mulai dari desain arsitektur 3D, gambar kerja drafter, hingga konstruksi bangunan dengan tim berpengalaman.",
        ctaText: "Konsultasi Gratis Sekarang",
        secondaryCtaText: "Lihat Portofolio Proyek"
      },
      contact: {
        phone: "+62 812-3456-7890",
        whatsapp: "6281234567890",
        email: "halo@grahaloka.com",
        address: "Jl. Graha Utama No. 88, Jakarta Selatan, Indonesia",
        hours: "Senin - Sabtu: 08:00 - 17:00 WIB"
      }
    };
  }
}

async function writeContent(content: unknown) {
  const dir = path.dirname(contentFilePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2), "utf-8");
}

export async function GET() {
  const content = await readContent();
  return NextResponse.json({ success: true, data: content });
}

export async function PUT(request: Request) {
  try {
    const newContent = await request.json();
    await writeContent(newContent);
    return NextResponse.json({ success: true, data: newContent });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memperbarui konten";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
