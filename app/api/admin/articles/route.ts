import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "articles.json");

async function readArticles() {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeArticles(articles: unknown[]) {
  const dir = path.dirname(dataFilePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(articles, null, 2), "utf-8");
}

// GET: Ambil semua artikel
export async function GET() {
  const articles = await readArticles();
  return NextResponse.json({ success: true, data: articles });
}

// POST: Tambah artikel baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const articles = await readArticles();

    const newArticle = {
      id: "art-" + Date.now(),
      title: body.title || "Artikel Tanpa Judul",
      slug: body.slug || (body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "artikel-" + Date.now()),
      metaTitle: body.metaTitle || body.title || "",
      metaDescription: body.metaDescription || body.excerpt || "",
      keywords: body.keywords || "",
      excerpt: body.excerpt || "",
      content: body.content || "",
      coverImage: body.coverImage || "/uploads/default.jpg",
      category: body.category || "Umum",
      author: body.author || "Admin Grahaloka",
      date: body.date || new Date().toISOString().split("T")[0],
      readTime: body.readTime || "3 menit",
      published: body.published !== undefined ? body.published : true,
    };

    articles.unshift(newArticle);
    await writeArticles(articles);

    return NextResponse.json({ success: true, data: newArticle });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menambah artikel";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// PUT: Edit artikel yang sudah ada
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updatedFields } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID artikel wajib diisi" }, { status: 400 });
    }

    const articles = await readArticles();
    const index = articles.findIndex((a: { id: string }) => a.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: "Artikel tidak ditemukan" }, { status: 404 });
    }

    articles[index] = {
      ...articles[index],
      ...updatedFields,
    };

    await writeArticles(articles);
    return NextResponse.json({ success: true, data: articles[index] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengupdate artikel";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// DELETE: Hapus artikel berdasarkan id (?id=...)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID artikel tidak valid" }, { status: 400 });
    }

    const articles = await readArticles();
    const filtered = articles.filter((a: { id: string }) => a.id !== id);

    await writeArticles(filtered);
    return NextResponse.json({ success: true, message: "Artikel berhasil dihapus" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus artikel";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
