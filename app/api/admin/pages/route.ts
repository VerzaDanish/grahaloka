import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const pagesFilePath = path.join(process.cwd(), "data", "pages.json");

async function readPages() {
  try {
    const data = await fs.readFile(pagesFilePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writePages(pages: unknown[]) {
  const dir = path.dirname(pagesFilePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(pagesFilePath, JSON.stringify(pages, null, 2), "utf-8");
}

export async function GET() {
  const pages = await readPages();
  return NextResponse.json({ success: true, data: pages });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pages = await readPages();

    const newPage = {
      id: "page-" + Date.now(),
      title: body.title || "Halaman Baru",
      slug: body.slug || (body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "halaman-" + Date.now()),
      metaTitle: body.metaTitle || body.title || "",
      metaDescription: body.metaDescription || "",
      keywords: body.keywords || "",
      headerImage: body.headerImage || "",
      content: body.content || "",
      published: body.published !== undefined ? body.published : true,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    pages.push(newPage);
    await writePages(pages);

    return NextResponse.json({ success: true, data: newPage });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal membuat halaman baru";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updatedFields } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID halaman wajib diisi" }, { status: 400 });
    }

    const pages = await readPages();
    const index = pages.findIndex((p: { id: string }) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: "Halaman tidak ditemukan" }, { status: 404 });
    }

    pages[index] = {
      ...pages[index],
      ...updatedFields,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    await writePages(pages);
    return NextResponse.json({ success: true, data: pages[index] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengupdate halaman";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID halaman tidak valid" }, { status: 400 });
    }

    const pages = await readPages();
    const filtered = pages.filter((p: { id: string }) => p.id !== id);

    await writePages(filtered);
    return NextResponse.json({ success: true, message: "Halaman berhasil dihapus" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus halaman";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
