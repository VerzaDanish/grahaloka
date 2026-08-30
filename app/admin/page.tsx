"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  Upload,
  Globe,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Copy,
  LogOut,
  Sparkles,
  Layout,
  ExternalLink,
  Save,
  Image as ImageIcon,
  Check,
  Search,
  Eye,
  RefreshCw,
  Sliders,
  Layers,
} from "lucide-react";
import { resizeImageFile } from "@/lib/image-resizer";

interface Article {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  published: boolean;
}

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription: string;
  keywords?: string;
  headerImage: string;
  content: string;
  published: boolean;
  updatedAt: string;
}

interface SiteContent {
  hero: {
    badge: string;
    title: string;
    description: string;
    ctaText: string;
    secondaryCtaText?: string;
    heroImage?: string;
  };
  heroCards?: Array<{
    tag: string;
    title: string;
    desc: string;
  }>;
  trust?: {
    badge?: string;
    title?: string;
    description?: string;
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    stat1?: string;
    stat1Label?: string;
    stat1Desc?: string;
    stat2?: string;
    stat2Label?: string;
    stat2Desc?: string;
    stat3?: string;
    stat3Label?: string;
    stat3Desc?: string;
    stat4?: string;
    stat4Label?: string;
    stat4Desc?: string;
  };
  servicesHeader?: {
    badge?: string;
    title?: string;
    description?: string;
  };
  services?: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    deliverables: string;
  }>;
  comparison?: {
    title?: string;
    description?: string;
    renderImage?: string;
    buildImage?: string;
  };
  workflow?: {
    badge?: string;
    title?: string;
    description?: string;
    steps?: Array<{
      num: string;
      title: string;
      desc: string;
    }>;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    hours: string;
    copyright?: string;
  };
}

interface GitStatus {
  hasUncommittedChanges: boolean;
  changedFilesCount: number;
  files: { status: string; file: string }[];
  gitCommand: string;
  commitMessage: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"articles" | "pages" | "homepage" | "git">("articles");
  
  // Data States
  const [articles, setArticles] = useState<Article[]>([]);
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [syncingGit, setSyncingGit] = useState(false);
  const [autoPushOnSave, setAutoPushOnSave] = useState(true);

  // Search & Filter
  const [articleSearch, setArticleSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Loading & Toast States
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [copiedGit, setCopiedGit] = useState(false);

  // 1-Click Git Sync & Push Handler
  const handleGitSync = async (msg?: string) => {
    setSyncingGit(true);
    try {
      const res = await fetch("/api/admin/git-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchGitStatus();
      } else {
        showToast(data.message || "Gagal melakukan sync Git", "error");
      }
    } catch (err: unknown) {
      showToast("Gagal melakukan sync Git ke server", "error");
    } finally {
      setSyncingGit(false);
    }
  };

  // Article Form State
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [artTitle, setArtTitle] = useState("");
  const [artSlug, setArtSlug] = useState("");
  const [artMetaTitle, setArtMetaTitle] = useState("");
  const [artMetaDesc, setArtMetaDesc] = useState("");
  const [artKeywords, setArtKeywords] = useState("");
  const [artExcerpt, setArtExcerpt] = useState("");
  const [artContent, setArtContent] = useState("");
  const [artCover, setArtCover] = useState("");
  const [artCategory, setArtCategory] = useState("Konstruksi");
  const [artAuthor, setArtAuthor] = useState("Tim Arsitek Grahaloka");
  const [artPublished, setArtPublished] = useState(true);
  const [imageResizingInfo, setImageResizingInfo] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Page Form State
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageMetaTitle, setPageMetaTitle] = useState("");
  const [pageMeta, setPageMeta] = useState("");
  const [pageKeywords, setPageKeywords] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [pageHeaderImage, setPageHeaderImage] = useState("");
  const [pagePublished, setPagePublished] = useState(true);

  // Show Toast Notification
  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch Git Status
  const fetchGitStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/git-status");
      const data = await res.json();
      if (data.success) {
        setGitStatus(data);
      }
    } catch (e) {
      console.error("Gagal mengambil status Git", e);
    }
  }, []);

  // Fetch All Initial Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [artRes, pageRes, contentRes] = await Promise.all([
        fetch("/api/admin/articles"),
        fetch("/api/admin/pages"),
        fetch("/api/admin/content"),
      ]);

      const artData = await artRes.json();
      const pageData = await pageRes.json();
      const contentData = await contentRes.json();

      if (artData.success) setArticles(artData.data || []);
      if (pageData.success) setPages(pageData.data || []);
      if (contentData.success) setSiteContent(contentData.data);

      await fetchGitStatus();
    } catch (err) {
      showToast("Gagal memuat data", "error");
    } finally {
      setLoading(false);
    }
  }, [fetchGitStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Logout Handler
  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  // Auto Generate Slug
  const handleTitleChange = (val: string) => {
    setArtTitle(val);
    if (!editingArticle) {
      setArtSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handlePageTitleChange = (val: string) => {
    setPageTitle(val);
    if (!editingPage) {
      setPageSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  // Image Upload with Client-Side Auto Resize
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "article" | "page" | "hero" | "trust1" | "trust2" | "trust3" | "trust4" | "compRender" | "compBuild" | "service0" | "service1" | "service2" | "service3"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImageResizingInfo("Mengompres & mengubah ukuran gambar...");

    try {
      const origSize = (file.size / (1024 * 1024)).toFixed(2);
      // Auto resize image to max 1200px width/height and webp quality 82%
      const resized = await resizeImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 });
      const newSize = (resized.file.size / 1024).toFixed(1);

      setImageResizingInfo(`Ditingkatkan: ${origSize}MB ➔ ${newSize}KB (Auto-Resized 1200px WebP)`);

      // Upload resized file to server
      const formData = new FormData();
      formData.append("file", resized.file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        if (target === "article") setArtCover(data.url);
        if (target === "page") setPageHeaderImage(data.url);
        if (target === "hero" && siteContent) {
          setSiteContent({
            ...siteContent,
            hero: { ...siteContent.hero, heroImage: data.url },
          });
        }
        if (target.startsWith("trust") && siteContent) {
          const key = target as "trust1" | "trust2" | "trust3" | "trust4";
          const imgKey = key === "trust1" ? "image1" : key === "trust2" ? "image2" : key === "trust3" ? "image3" : "image4";
          setSiteContent({
            ...siteContent,
            trust: {
              ...siteContent.trust,
              [imgKey]: data.url,
            },
          });
        }
        if (target === "compRender" && siteContent) {
          setSiteContent({
            ...siteContent,
            comparison: { ...siteContent.comparison, renderImage: data.url },
          });
        }
        if (target === "compBuild" && siteContent) {
          setSiteContent({
            ...siteContent,
            comparison: { ...siteContent.comparison, buildImage: data.url },
          });
        }
        if (target.startsWith("service") && siteContent && siteContent.services) {
          const idx = parseInt(target.replace("service", ""), 10);
          const updatedServices = [...siteContent.services];
          if (updatedServices[idx]) {
            updatedServices[idx] = { ...updatedServices[idx], image: data.url };
            setSiteContent({
              ...siteContent,
              services: updatedServices,
            });
          }
        }
        showToast("Gambar ter-resize dan diunggah dengan sukses!");
        fetchGitStatus();
      } else {
        showToast(data.message || "Gagal mengunggah gambar", "error");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan upload";
      showToast(msg, "error");
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Article (Create or Update)
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    const payload = {
      id: editingArticle ? editingArticle.id : undefined,
      title: artTitle,
      slug: artSlug || artTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      metaTitle: artMetaTitle || artTitle,
      metaDescription: artMetaDesc || artExcerpt,
      keywords: artKeywords,
      excerpt: artExcerpt,
      content: artContent,
      coverImage: artCover || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      category: artCategory,
      author: artAuthor,
      published: artPublished,
    };

    try {
      const res = await fetch("/api/admin/articles", {
        method: editingArticle ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingArticle ? "Artikel berhasil diubah!" : "Artikel baru berhasil dibuat!");
        setIsArticleModalOpen(false);
        resetArticleForm();
        await fetchData();
        if (autoPushOnSave) {
          handleGitSync(`Update artikel "${artTitle}" via Admin CMS`);
        }
      } else {
        showToast(data.message || "Gagal menyimpan artikel", "error");
      }
    } catch {
      showToast("Kesalahan koneksi", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;

    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Artikel berhasil dihapus");
        await fetchData();
        if (autoPushOnSave) {
          handleGitSync("Hapus artikel via Admin CMS");
        }
      } else {
        showToast(data.message || "Gagal menghapus artikel", "error");
      }
    } catch {
      showToast("Gagal menghapus artikel", "error");
    }
  };

  // Edit Article Trigger
  const openEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArtTitle(art.title);
    setArtSlug(art.slug);
    setArtMetaTitle(art.metaTitle || art.title);
    setArtMetaDesc(art.metaDescription || art.excerpt);
    setArtKeywords(art.keywords || "");
    setArtExcerpt(art.excerpt);
    setArtContent(art.content);
    setArtCover(art.coverImage);
    setArtCategory(art.category);
    setArtAuthor(art.author);
    setArtPublished(art.published);
    setImageResizingInfo(null);
    setIsArticleModalOpen(true);
  };

  const resetArticleForm = () => {
    setEditingArticle(null);
    setArtTitle("");
    setArtSlug("");
    setArtMetaTitle("");
    setArtMetaDesc("");
    setArtKeywords("");
    setArtExcerpt("");
    setArtContent("");
    setArtCover("");
    setArtCategory("Konstruksi");
    setArtAuthor("Tim Arsitek Grahaloka");
    setArtPublished(true);
    setImageResizingInfo(null);
  };

  // Save Custom Page
  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    const payload = {
      id: editingPage ? editingPage.id : undefined,
      title: pageTitle,
      slug: pageSlug || pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      metaTitle: pageMetaTitle || pageTitle,
      metaDescription: pageMeta,
      keywords: pageKeywords,
      headerImage: pageHeaderImage,
      content: pageContent,
      published: pagePublished,
    };

    try {
      const res = await fetch("/api/admin/pages", {
        method: editingPage ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingPage ? "Halaman berhasil diperbarui!" : "Halaman baru berhasil dibuat!");
        setIsPageModalOpen(false);
        resetPageForm();
        await fetchData();
        if (autoPushOnSave) {
          handleGitSync(`Update halaman "${pageTitle}" via Admin CMS`);
        }
      } else {
        showToast(data.message || "Gagal menyimpan halaman", "error");
      }
    } catch {
      showToast("Kesalahan koneksi", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  // Delete Custom Page
  const handleDeletePage = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus halaman ini?")) return;

    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Halaman berhasil dihapus");
        await fetchData();
        if (autoPushOnSave) {
          handleGitSync("Hapus halaman via Admin CMS");
        }
      } else {
        showToast(data.message || "Gagal menghapus", "error");
      }
    } catch {
      showToast("Gagal menghapus halaman", "error");
    }
  };

  const openEditPage = (p: CustomPage) => {
    setEditingPage(p);
    setPageTitle(p.title);
    setPageSlug(p.slug);
    setPageMetaTitle(p.metaTitle || p.title);
    setPageMeta(p.metaDescription);
    setPageKeywords(p.keywords || "");
    setPageHeaderImage(p.headerImage);
    setPageContent(p.content);
    setPagePublished(p.published);
    setIsPageModalOpen(true);
  };

  const resetPageForm = () => {
    setEditingPage(null);
    setPageTitle("");
    setPageSlug("");
    setPageMetaTitle("");
    setPageMeta("");
    setPageKeywords("");
    setPageHeaderImage("");
    setPageContent("");
    setPagePublished(true);
  };

  // Save Homepage Content
  const handleSaveSiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteContent) return;

    setSaveLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteContent),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Konten halaman utama berhasil disimpan!");
        await fetchData();
        if (autoPushOnSave) {
          handleGitSync("Update konten Halaman Utama via Admin CMS");
        }
      } else {
        showToast(data.message || "Gagal menyimpan konten", "error");
      }
    } catch {
      showToast("Gagal menyimpan konten halaman utama", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  // Copy Git Command
  const copyGitCommand = () => {
    if (!gitStatus) return;
    navigator.clipboard.writeText(gitStatus.gitCommand);
    setCopiedGit(true);
    showToast("Perintah Git berhasil disalin ke clipboard!");
    setTimeout(() => setCopiedGit(false), 3000);
  };

  // Filter Articles
  const filteredArticles = articles.filter((art) => {
    const matchSearch =
      art.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      art.category.toLowerCase().includes(articleSearch.toLowerCase());
    const matchCat = selectedCategory === "Semua" || art.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#141311] text-[#EFEBE4] selection:bg-[#C9A36A] selection:text-[#141311] font-sans pb-16">
      {/* Toast Banner */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium flex items-center gap-2.5 transition-all duration-300 animate-bounce ${
            toastMessage.type === "success"
              ? "bg-[#1E2B21] border-[#3F6649] text-[#BEE8C6]"
              : "bg-red-950 border-red-800 text-red-200"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-[#4ADE80]" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400" />
          )}
          {toastMessage.text}
        </div>
      )}

      {/* Header Admin Navbar */}
      <header className="sticky top-0 z-40 bg-[#1C1A17]/90 backdrop-blur-md border-b border-[#332F2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A36A] text-[#141311] flex items-center justify-center font-bold font-serif text-xl shadow-md">
              G
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-[#F5F0E8] tracking-wide flex items-center gap-2">
                Grahaloka Admin Panel
                <span className="text-[10px] uppercase font-sans tracking-wider bg-[#C9A36A]/20 text-[#DBC095] px-2 py-0.5 rounded border border-[#C9A36A]/30">
                  CMS v2.0
                </span>
              </h1>
              <p className="text-xs text-[#998F82]">Kelola Konten, Artikel & Halaman Website</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2B2723] hover:bg-[#38332E] text-xs text-[#D5C7B3] border border-[#403B35] transition"
            >
              <Globe className="w-3.5 h-3.5 text-[#C9A36A]" /> Lihat Website
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-xs text-red-300 border border-red-800/40 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Git Uncommitted Status Top Banner Notifier */}
      {gitStatus && gitStatus.hasUncommittedChanges && (
        <div className="bg-gradient-to-r from-amber-950/90 via-[#2A1F12] to-amber-950/90 border-b border-amber-800/60 px-4 py-3 text-amber-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span>
                <strong className="font-semibold text-amber-300">
                  Notifikasi Update: Ada {gitStatus.changedFilesCount} perubahan belum di-commit!
                </strong>{" "}
                (Setiap kali Anda mengedit teks/gambar, commit & push agar situs live terupdate).
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab("git")}
                className="px-2.5 py-1 rounded bg-amber-900/80 hover:bg-amber-800 border border-amber-700/80 text-amber-100 font-medium transition cursor-pointer"
              >
                Lihat Detail Git
              </button>
              <button
                onClick={copyGitCommand}
                className="px-3 py-1 rounded bg-[#C9A36A] hover:bg-[#DBC095] text-[#141311] font-semibold flex items-center gap-1 transition cursor-pointer shadow"
              >
                {copiedGit ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedGit ? "Disalin!" : "Salin Perintah Push"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Sticky Uncommitted Changes & 1-Click Push Alert Banner */}
        {gitStatus && gitStatus.hasUncommittedChanges && (
          <div className="bg-amber-950/60 border border-amber-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/30">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-amber-200">
                  Terdapat {gitStatus.changedFilesCount} Perubahan File Belum Di-Push ke GitHub
                </h4>
                <p className="text-xs text-amber-300/80 mt-0.5">
                  Klik tombol di samping untuk otomatis commit & push langsung dari website tanpa perlu buka terminal!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <label className="flex items-center gap-2 text-xs text-amber-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoPushOnSave}
                  onChange={(e) => setAutoPushOnSave(e.target.checked)}
                  className="rounded accent-[#C9A36A]"
                />
                Auto Push
              </label>

              <button
                onClick={() => handleGitSync()}
                disabled={syncingGit}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${syncingGit ? "animate-spin" : ""}`} />
                <span>{syncingGit ? "Mengunggah..." : "⚡ Push ke GitHub Sekarang"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#332F2A] pb-4">
          <button
            onClick={() => setActiveTab("articles")}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition cursor-pointer ${
              activeTab === "articles"
                ? "bg-[#C9A36A] text-[#141311] shadow-lg shadow-[#C9A36A]/10 font-semibold"
                : "bg-[#211E1B] text-[#A89F91] hover:bg-[#2C2824] hover:text-[#F5F0E8] border border-[#332F2A]"
            }`}
          >
            <FileText className="w-4 h-4" /> Artikel & Blog ({articles.length})
          </button>

          <button
            onClick={() => setActiveTab("pages")}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition cursor-pointer ${
              activeTab === "pages"
                ? "bg-[#C9A36A] text-[#141311] shadow-lg shadow-[#C9A36A]/10 font-semibold"
                : "bg-[#211E1B] text-[#A89F91] hover:bg-[#2C2824] hover:text-[#F5F0E8] border border-[#332F2A]"
            }`}
          >
            <Layout className="w-4 h-4" /> Halaman Baru / Custom ({pages.length})
          </button>

          <button
            onClick={() => setActiveTab("homepage")}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition cursor-pointer ${
              activeTab === "homepage"
                ? "bg-[#C9A36A] text-[#141311] shadow-lg shadow-[#C9A36A]/10 font-semibold"
                : "bg-[#211E1B] text-[#A89F91] hover:bg-[#2C2824] hover:text-[#F5F0E8] border border-[#332F2A]"
            }`}
          >
            <Sliders className="w-4 h-4" /> Editor Halaman Utama
          </button>

          <button
            onClick={() => setActiveTab("git")}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition cursor-pointer relative ${
              activeTab === "git"
                ? "bg-[#C9A36A] text-[#141311] shadow-lg shadow-[#C9A36A]/10 font-semibold"
                : "bg-[#211E1B] text-[#A89F91] hover:bg-[#2C2824] hover:text-[#F5F0E8] border border-[#332F2A]"
            }`}
          >
            <GitCommit className="w-4 h-4" /> Git & Status Deploy
            {gitStatus && gitStatus.hasUncommittedChanges && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 text-center text-[#998F82] flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#C9A36A]" />
            <p className="text-sm">Memuat data admin...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: MANAJEMEN ARTIKEL */}
            {activeTab === "articles" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1C1A17] p-5 rounded-2xl border border-[#332F2A]">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-[#F5F0E8]">Daftar Artikel Website</h2>
                    <p className="text-xs text-[#998F82] mt-0.5">
                      Kelola tulisan, panduan, dan postingan artikel blog Grahaloka
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      resetArticleForm();
                      setIsArticleModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A36A] to-[#B38B52] hover:from-[#DBC095] hover:to-[#C9A36A] text-[#141311] font-semibold text-sm flex items-center gap-2 transition cursor-pointer shadow-lg shadow-[#C9A36A]/10"
                  >
                    <Plus className="w-4 h-4" /> Tambah Artikel Baru
                  </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#787065]" />
                    <input
                      type="text"
                      placeholder="Cari judul artikel..."
                      value={articleSearch}
                      onChange={(e) => setArticleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] placeholder-[#787065] focus:outline-none focus:border-[#C9A36A]"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {["Semua", "Konstruksi", "Desain Interior", "Arsitektur", "Tips & Trik"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                          selectedCategory === cat
                            ? "bg-[#C9A36A]/20 text-[#DBC095] border border-[#C9A36A]/40"
                            : "bg-[#1C1A17] text-[#8C8275] border border-[#332F2A] hover:text-[#D5C7B3]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Articles Table Grid */}
                {filteredArticles.length === 0 ? (
                  <div className="bg-[#1C1A17] border border-[#332F2A] rounded-2xl p-12 text-center text-[#8C8275]">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#C9A36A]" />
                    <p className="font-semibold text-base text-[#D5C7B3]">Belum ada artikel ditemukan</p>
                    <p className="text-xs mt-1">Klik tombol &ldquo;Tambah Artikel Baru&rdquo; untuk membuat postingan pertama Anda.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((art) => (
                      <div
                        key={art.id}
                        className="bg-[#1C1A17] border border-[#332F2A] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#4D453E] transition group shadow-md"
                      >
                        <div>
                          <div className="relative h-44 w-full bg-[#292622] overflow-hidden">
                            {/* eslint-disable-next-html-element-suppression */}
                            <img
                              src={art.coverImage}
                              alt={art.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop";
                              }}
                            />
                            <div className="absolute top-3 left-3 bg-[#141311]/80 backdrop-blur-md border border-[#403B35] px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#DBC095]">
                              {art.category}
                            </div>
                            <div className="absolute top-3 right-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  art.published
                                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                                    : "bg-amber-950/80 text-amber-300 border border-amber-800"
                                }`}
                              >
                                {art.published ? "Published" : "Draft"}
                              </span>
                            </div>
                          </div>

                          <div className="p-5">
                            <div className="text-[11px] text-[#8C8275] mb-2">
                              {art.date} • {art.readTime}
                            </div>
                            <h3 className="font-serif font-bold text-lg text-[#F5F0E8] line-clamp-2 mb-2 leading-snug">
                              {art.title}
                            </h3>
                            <p className="text-xs text-[#A89F91] line-clamp-3 leading-relaxed">{art.excerpt}</p>
                          </div>
                        </div>

                        <div className="p-5 pt-0 border-t border-[#292622] mt-4 flex items-center justify-between gap-2">
                          <a
                            href={`/artikel/${art.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#C9A36A] hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> Lihat Artikel
                          </a>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditArticle(art)}
                              className="p-2 rounded-lg bg-[#292622] hover:bg-[#38332E] text-[#D5C7B3] border border-[#403B35] transition cursor-pointer"
                              title="Edit Artikel"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 transition cursor-pointer"
                              title="Hapus Artikel"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MANAJEMEN HALAMAN BARU (CUSTOM PAGES) */}
            {activeTab === "pages" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1C1A17] p-5 rounded-2xl border border-[#332F2A]">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-[#F5F0E8]">Pembuat Halaman Baru (Custom Pages)</h2>
                    <p className="text-xs text-[#998F82] mt-0.5">
                      Buat halaman statis/landing baru tanpa mengode file Next.js (URL: /p/[slug])
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      resetPageForm();
                      setIsPageModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A36A] to-[#B38B52] hover:from-[#DBC095] hover:to-[#C9A36A] text-[#141311] font-semibold text-sm flex items-center gap-2 transition cursor-pointer shadow-lg shadow-[#C9A36A]/10"
                  >
                    <Plus className="w-4 h-4" /> Buat Halaman Baru
                  </button>
                </div>

                {pages.length === 0 ? (
                  <div className="bg-[#1C1A17] border border-[#332F2A] rounded-2xl p-12 text-center text-[#8C8275]">
                    <Layout className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#C9A36A]" />
                    <p className="font-semibold text-base text-[#D5C7B3]">Belum ada halaman kustom</p>
                    <p className="text-xs mt-1">Buat halaman baru seperti Promo, Syarat Ketentuan, atau Layanan Khusus.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pages.map((p) => (
                      <div
                        key={p.id}
                        className="bg-[#1C1A17] border border-[#332F2A] rounded-2xl p-6 flex flex-col justify-between hover:border-[#4D453E] transition"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="text-[11px] font-mono text-[#C9A36A] bg-[#C9A36A]/10 px-2.5 py-1 rounded border border-[#C9A36A]/20">
                              /p/{p.slug}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                p.published
                                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                                  : "bg-amber-950/80 text-amber-300 border border-amber-800"
                              }`}
                            >
                              {p.published ? "Aktif" : "Draft"}
                            </span>
                          </div>

                          <h3 className="font-serif font-bold text-xl text-[#F5F0E8] mb-2">{p.title}</h3>
                          <p className="text-xs text-[#A89F91] line-clamp-2 mb-4">{p.metaDescription}</p>
                        </div>

                        <div className="pt-4 border-t border-[#2A2723] flex items-center justify-between">
                          <a
                            href={`/p/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#C9A36A] hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Buka Halaman
                          </a>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditPage(p)}
                              className="p-2 rounded-lg bg-[#292622] hover:bg-[#38332E] text-[#D5C7B3] border border-[#403B35] transition cursor-pointer"
                              title="Edit Halaman"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePage(p.id)}
                              className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 transition cursor-pointer"
                              title="Hapus Halaman"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: EDITOR HALAMAN UTAMA */}
            {activeTab === "homepage" && siteContent && (
              <form onSubmit={handleSaveSiteContent} className="space-y-8">
                {/* Hero Section Edit */}
                <div className="bg-[#1C1A17] border border-[#332F2A] rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-2 text-[#C9A36A] border-b border-[#2D2A26] pb-3">
                    <Sparkles className="w-5 h-5" />
                    <h2 className="font-serif font-bold text-lg text-[#F5F0E8]">Edit Hero Banner (Teks & Gambar Utama Beranda)</h2>
                  </div>

                  {/* Upload Gambar Hero */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">
                      Gambar Visual Utama Hero (Auto-Resize Enabled)
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch gap-3">
                      <input
                        type="text"
                        value={siteContent.hero.heroImage || ""}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            hero: { ...siteContent.hero, heroImage: e.target.value },
                          })
                        }
                        placeholder="URL gambar hero banner..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                      />
                      <label className="px-4 py-2.5 rounded-xl bg-[#2D2824] hover:bg-[#3B3530] border border-[#453F39] text-xs font-semibold text-[#D5C7B3] flex items-center justify-center gap-2 cursor-pointer transition">
                        <Upload className="w-4 h-4 text-[#C9A36A]" /> Unggah Gambar Hero
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "hero")}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {siteContent.hero.heroImage && (
                      <div className="mt-3 relative h-36 w-full rounded-xl overflow-hidden border border-[#332F2A]">
                        {/* eslint-disable-next-html-element-suppression */}
                        <img src={siteContent.hero.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">
                        Badge Teks (Atas Judul)
                      </label>
                      <input
                        type="text"
                        value={siteContent.hero.badge}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            hero: { ...siteContent.hero, badge: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">
                        Teks Tombol Utama (CTA)
                      </label>
                      <input
                        type="text"
                        value={siteContent.hero.ctaText}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            hero: { ...siteContent.hero, ctaText: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">
                      Judul Utama Hero (H1)
                    </label>
                    <input
                      type="text"
                      value={siteContent.hero.title}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, title: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">
                      Deskripsi Ringkas Hero
                    </label>
                    <textarea
                      rows={3}
                      value={siteContent.hero.description}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, description: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* 4 Hero Sub-ribbon Cards Edit */}
                  <div className="pt-3 border-t border-[#2D2A26] space-y-3">
                    <label className="block text-xs font-bold text-[#C9A36A] uppercase tracking-wider">
                      Edit 4 Kartu Layanan Pita Hero (Sub-Ribbon Cards)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(siteContent.heroCards || [
                        { tag: "01 • Design", title: "Interior & Exterior", desc: "Custom spatial planning & exterior facade styling." },
                        { tag: "02 • Visualization", title: "3D Architecture", desc: "Ultra photorealistic 8K renders & VR walkthroughs." },
                        { tag: "03 • Technical", title: "Drafter & BIM", desc: "Architectural CAD blueprints & MEP drafting." },
                        { tag: "04 • Execution", title: "General Contractor", desc: "Turnkey construction build & structural engineering." },
                      ]).map((card, idx) => (
                        <div key={idx} className="bg-[#24211D] p-3 rounded-xl border border-[#332F2A] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-[#C9A36A]">Kartu 0{idx + 1}</span>
                            <input
                              type="text"
                              value={card.tag}
                              onChange={(e) => {
                                const newCards = [...(siteContent.heroCards || [])];
                                newCards[idx] = { ...newCards[idx], tag: e.target.value };
                                setSiteContent({ ...siteContent, heroCards: newCards });
                              }}
                              className="w-28 px-2 py-0.5 rounded bg-[#191715] text-[10px] text-[#D5C7B3] border border-[#38332E]"
                            />
                          </div>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const newCards = [...(siteContent.heroCards || [])];
                              newCards[idx] = { ...newCards[idx], title: e.target.value };
                              setSiteContent({ ...siteContent, heroCards: newCards });
                            }}
                            placeholder="Judul kartu..."
                            className="w-full px-2.5 py-1 rounded-lg bg-[#191715] border border-[#3D3833] text-xs text-[#F5F0E8] font-bold"
                          />
                          <input
                            type="text"
                            value={card.desc}
                            onChange={(e) => {
                              const newCards = [...(siteContent.heroCards || [])];
                              newCards[idx] = { ...newCards[idx], desc: e.target.value };
                              setSiteContent({ ...siteContent, heroCards: newCards });
                            }}
                            placeholder="Deskripsi ringkas kartu..."
                            className="w-full px-2.5 py-1 rounded-lg bg-[#191715] border border-[#3D3833] text-[11px] text-[#D5C7B3]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trust Grid Section Edit */}
                <div className="bg-[#1C1A17] border border-[#332F2A] rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-2 text-[#C9A36A] border-b border-[#2D2A26] pb-3">
                    <ImageIcon className="w-5 h-5" />
                    <h2 className="font-serif font-bold text-lg text-[#F5F0E8]">Edit Gambar & Statistik Beranda (Trust Grid)</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">Judul Seksi</label>
                      <input
                        type="text"
                        value={siteContent.trust?.title || "Built On Trust"}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            trust: { ...siteContent.trust, title: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">Deskripsi Seksi</label>
                      <input
                        type="text"
                        value={siteContent.trust?.description || ""}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            trust: { ...siteContent.trust, description: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 4 Images Upload Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {[
                      { key: "trust1" as const, label: "Gambar Grid 1 (Interior)", img: siteContent.trust?.image1 },
                      { key: "trust2" as const, label: "Gambar Grid 2 (CAD/BIM)", img: siteContent.trust?.image2 },
                      { key: "trust3" as const, label: "Gambar Grid 3 (Joinery)", img: siteContent.trust?.image3 },
                      { key: "trust4" as const, label: "Gambar Grid 4 (Construction)", img: siteContent.trust?.image4 },
                    ].map((item, idx) => (
                      <div key={item.key} className="bg-[#24211D] p-3.5 rounded-xl border border-[#332F2A] space-y-2">
                        <label className="block text-xs font-semibold text-[#D5C7B3]">{item.label}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.img || ""}
                            onChange={(e) => {
                              const imgProp = idx === 0 ? "image1" : idx === 1 ? "image2" : idx === 2 ? "image3" : "image4";
                              setSiteContent({
                                ...siteContent,
                                trust: { ...siteContent.trust, [imgProp]: e.target.value },
                              });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-[#191715] border border-[#3D3833] text-xs text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                          />
                          <label className="px-3 py-1.5 rounded-lg bg-[#38332E] hover:bg-[#48423B] text-[11px] font-semibold text-[#D5C7B3] cursor-pointer shrink-0 transition">
                            Unggah
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, item.key)}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {item.img && (
                          <div className="h-20 w-full rounded-lg overflow-hidden border border-[#332F2A]">
                            {/* eslint-disable-next-html-element-suppression */}
                            <img src={item.img} alt="Grid preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3D Render vs Build Comparison Section Edit */}
                <div className="bg-[#1C1A17] border border-[#332F2A] rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-2 text-[#C9A36A] border-b border-[#2D2A26] pb-3">
                    <Sliders className="w-5 h-5" />
                    <h2 className="font-serif font-bold text-lg text-[#F5F0E8]">Edit Seksi Komparasi Slider (3D Render vs Hasil Jadi)</h2>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">Judul Komparasi</label>
                    <input
                      type="text"
                      value={siteContent.comparison?.title || "3D Render vs Finished Built"}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          comparison: { ...siteContent.comparison, title: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">Deskripsi Komparasi</label>
                    <textarea
                      rows={2}
                      value={siteContent.comparison?.description || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          comparison: { ...siteContent.comparison, description: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Render Image */}
                    <div className="bg-[#24211D] p-4 rounded-xl border border-[#332F2A] space-y-3">
                      <label className="block text-xs font-semibold text-[#D5C7B3]">Gambar 1: 3D Render (Sebelah Kiri Slider)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={siteContent.comparison?.renderImage || ""}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              comparison: { ...siteContent.comparison, renderImage: e.target.value },
                            })
                          }
                          className="flex-1 px-3 py-2 rounded-lg bg-[#191715] border border-[#3D3833] text-xs text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                        />
                        <label className="px-3 py-2 rounded-lg bg-[#38332E] hover:bg-[#48423B] text-xs font-semibold text-[#D5C7B3] cursor-pointer shrink-0 transition">
                          Unggah Render
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "compRender")}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {siteContent.comparison?.renderImage && (
                        <div className="h-28 w-full rounded-lg overflow-hidden border border-[#332F2A]">
                          {/* eslint-disable-next-html-element-suppression */}
                          <img src={siteContent.comparison.renderImage} alt="Render preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    {/* Build Image */}
                    <div className="bg-[#24211D] p-4 rounded-xl border border-[#332F2A] space-y-3">
                      <label className="block text-xs font-semibold text-[#D5C7B3]">Gambar 2: Hasil Jadi Konstruksi (Sebelah Kanan Slider)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={siteContent.comparison?.buildImage || ""}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              comparison: { ...siteContent.comparison, buildImage: e.target.value },
                            })
                          }
                          className="flex-1 px-3 py-2 rounded-lg bg-[#191715] border border-[#3D3833] text-xs text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                        />
                        <label className="px-3 py-2 rounded-lg bg-[#38332E] hover:bg-[#48423B] text-xs font-semibold text-[#D5C7B3] cursor-pointer shrink-0 transition">
                          Unggah Hasil
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "compBuild")}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {siteContent.comparison?.buildImage && (
                        <div className="h-28 w-full rounded-lg overflow-hidden border border-[#332F2A]">
                          {/* eslint-disable-next-html-element-suppression */}
                          <img src={siteContent.comparison.buildImage} alt="Build preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Workflow Section Edit */}
                <div className="bg-[#1C1A17] border border-[#332F2A] rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-2 text-[#C9A36A] border-b border-[#2D2A26] pb-3">
                    <CheckCircle2 className="w-5 h-5" />
                    <h2 className="font-serif font-bold text-lg text-[#F5F0E8]">Edit Seksi & 5 Kartu Langkah Kerja (5-Step Execution Workflow)</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">Badge Workflow</label>
                      <input
                        type="text"
                        value={siteContent.workflow?.badge || "Methodology"}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            workflow: { ...siteContent.workflow, badge: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">Judul Utama Seksi Workflow</label>
                      <input
                        type="text"
                        value={siteContent.workflow?.title || "How We Execute"}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            workflow: { ...siteContent.workflow, title: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">Deskripsi Seksi Workflow</label>
                    <input
                      type="text"
                      value={siteContent.workflow?.description || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          workflow: { ...siteContent.workflow, description: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                    />
                  </div>

                  {/* 5 Workflow Cards */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-[#C9A36A] uppercase tracking-wider">
                      Edit 5 Kartu Tahapan Pengerjaan
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(siteContent.workflow?.steps || [
                        { num: "01", title: "Discovery & Briefing", desc: "Initial site inspection and spatial requirements analysis." },
                        { num: "02", title: "2D CAD Drafting & BIM", desc: "Creating architectural blueprints and MEP schematics." },
                        { num: "03", title: "3D Render & VR Simulation", desc: "Photorealistic 8K visualizations and 360 VR walkthroughs." },
                        { num: "04", title: "Procurement & Contracting", desc: "Fixed-price Bill of Quantities (BoQ) & material sourcing." },
                        { num: "05", title: "Construction & Handover", desc: "On-site civil engineering build and final key handover." },
                      ]).map((step, idx) => (
                        <div key={idx} className="bg-[#24211D] p-3 rounded-xl border border-[#332F2A] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#C9A36A]">Langkah {step.num || `0${idx + 1}`}</span>
                          </div>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => {
                              const newSteps = [...(siteContent.workflow?.steps || [])];
                              newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                              setSiteContent({
                                ...siteContent,
                                workflow: { ...siteContent.workflow, steps: newSteps },
                              });
                            }}
                            placeholder="Judul langkah..."
                            className="w-full px-2.5 py-1 rounded-lg bg-[#191715] border border-[#3D3833] text-xs text-[#F5F0E8] font-bold"
                          />
                          <textarea
                            rows={2}
                            value={step.desc}
                            onChange={(e) => {
                              const newSteps = [...(siteContent.workflow?.steps || [])];
                              newSteps[idx] = { ...newSteps[idx], desc: e.target.value };
                              setSiteContent({
                                ...siteContent,
                                workflow: { ...siteContent.workflow, steps: newSteps },
                              });
                            }}
                            placeholder="Deskripsi langkah..."
                            className="w-full px-2.5 py-1 rounded-lg bg-[#191715] border border-[#3D3833] text-[11px] text-[#D5C7B3]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Core Services Section Edit */}
                <div className="bg-[#1C1A17] border border-[#332F2A] rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-2 text-[#C9A36A] border-b border-[#2D2A26] pb-3">
                    <Layers className="w-5 h-5" />
                    <h2 className="font-serif font-bold text-lg text-[#F5F0E8]">Edit Seksi Layanan Utama (Our Core Services)</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">Badge Layanan</label>
                      <input
                        type="text"
                        value={siteContent.servicesHeader?.badge || "Comprehensive Disciplines"}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            servicesHeader: { ...siteContent.servicesHeader, badge: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">Judul Utama Seksi Layanan</label>
                      <input
                        type="text"
                        value={siteContent.servicesHeader?.title || "Our Core Services"}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            servicesHeader: { ...siteContent.servicesHeader, title: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 4 Service Items */}
                  <div className="space-y-4 pt-2">
                    {(siteContent.services || []).map((srv, idx) => (
                      <div key={srv.id || idx} className="bg-[#24211D] p-4 rounded-xl border border-[#332F2A] space-y-3">
                        <h4 className="text-xs font-bold text-[#C9A36A]">Layanan 0{idx + 1}: {srv.title}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-[#A89F91] mb-1">Nama Layanan</label>
                            <input
                              type="text"
                              value={srv.title}
                              onChange={(e) => {
                                const newSrvs = [...(siteContent.services || [])];
                                newSrvs[idx] = { ...newSrvs[idx], title: e.target.value };
                                setSiteContent({ ...siteContent, services: newSrvs });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-[#191715] border border-[#3D3833] text-xs text-[#F5F0E8]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-[#A89F91] mb-1">Sub-Judul</label>
                            <input
                              type="text"
                              value={srv.subtitle}
                              onChange={(e) => {
                                const newSrvs = [...(siteContent.services || [])];
                                newSrvs[idx] = { ...newSrvs[idx], subtitle: e.target.value };
                                setSiteContent({ ...siteContent, services: newSrvs });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-[#191715] border border-[#3D3833] text-xs text-[#F5F0E8]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#A89F91] mb-1">Gambar Layanan (Auto-Resize)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={srv.image || ""}
                              onChange={(e) => {
                                const newSrvs = [...(siteContent.services || [])];
                                newSrvs[idx] = { ...newSrvs[idx], image: e.target.value };
                                setSiteContent({ ...siteContent, services: newSrvs });
                              }}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-[#191715] border border-[#3D3833] text-xs text-[#F5F0E8]"
                            />
                            <label className="px-3 py-1.5 rounded-lg bg-[#38332E] hover:bg-[#48423B] text-xs font-semibold text-[#D5C7B3] cursor-pointer shrink-0 transition">
                              Unggah Gambar
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, `service${idx}` as any)}
                                className="hidden"
                              />
                            </label>
                          </div>
                          {srv.image && (
                            <div className="mt-2 h-20 w-full rounded-lg overflow-hidden border border-[#332F2A]">
                              {/* eslint-disable-next-html-element-suppression */}
                              <img src={srv.image} alt="Service preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#A89F91] mb-1">Deskripsi Lengkap</label>
                          <textarea
                            rows={2}
                            value={srv.description}
                            onChange={(e) => {
                              const newSrvs = [...(siteContent.services || [])];
                              newSrvs[idx] = { ...newSrvs[idx], description: e.target.value };
                              setSiteContent({ ...siteContent, services: newSrvs });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#191715] border border-[#3D3833] text-xs text-[#F5F0E8]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Edit */}
                <div className="bg-[#1C1A17] border border-[#332F2A] rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-2 text-[#C9A36A] border-b border-[#2D2A26] pb-3">
                    <Globe className="w-5 h-5" />
                    <h2 className="font-serif font-bold text-lg text-[#F5F0E8]">Edit Informasi Kontak & Footer</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">
                        Nomor Telepon
                      </label>
                      <input
                        type="text"
                        value={siteContent.contact.phone}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            contact: { ...siteContent.contact, phone: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">
                        WhatsApp (Format 628...)
                      </label>
                      <input
                        type="text"
                        value={siteContent.contact.whatsapp}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            contact: { ...siteContent.contact, whatsapp: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">Email</label>
                      <input
                        type="email"
                        value={siteContent.contact.email}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            contact: { ...siteContent.contact, email: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">
                        Jam Operasional
                      </label>
                      <input
                        type="text"
                        value={siteContent.contact.hours}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            contact: { ...siteContent.contact, hours: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">
                      Alamat Kantor
                    </label>
                    <input
                      type="text"
                      value={siteContent.contact.address}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          contact: { ...siteContent.contact, address: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1.5">
                      Teks Copyright Footer
                    </label>
                    <input
                      type="text"
                      value={siteContent.contact.copyright || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          contact: { ...siteContent.contact, copyright: e.target.value },
                        })
                      }
                      placeholder="© 2026 GRAHALOKA Architecture & Build Inc. All rights reserved."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A36A] to-[#B38B52] hover:from-[#DBC095] hover:to-[#C9A36A] text-[#141311] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#C9A36A]/10 transition cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> {saveLoading ? "Simpan Perubahan..." : "Simpan Konten Halaman Utama"}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 4: STATUS GIT & COMMIT HELPER */}
            {activeTab === "git" && (
              <div className="space-y-6">
                <div className="bg-[#1C1A17] border border-[#332F2A] rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-[#2D2A26] pb-4">
                    <div>
                      <h2 className="font-serif font-bold text-xl text-[#F5F0E8] flex items-center gap-2">
                        <GitCommit className="w-6 h-6 text-[#C9A36A]" /> Status Repository & Commit Notifier
                      </h2>
                      <p className="text-xs text-[#998F82] mt-1">
                        Memantau file yang baru saja diupdate via Admin untuk persiapan commit & push ke server
                      </p>
                    </div>
                    <button
                      onClick={fetchGitStatus}
                      className="px-3 py-1.5 rounded-lg bg-[#292622] hover:bg-[#38332E] text-xs text-[#D5C7B3] border border-[#403B35] flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
                    </button>
                  </div>

                  {gitStatus ? (
                    <div className="space-y-5">
                      <div
                        className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          gitStatus.hasUncommittedChanges
                            ? "bg-amber-950/40 border-amber-800/80 text-amber-200"
                            : "bg-emerald-950/40 border-emerald-800/80 text-emerald-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {gitStatus.hasUncommittedChanges ? (
                            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                          )}
                          <div>
                            <div className="font-bold text-base">
                              {gitStatus.hasUncommittedChanges
                                ? `Terdapat ${gitStatus.changedFilesCount} file yang belum di-commit`
                                : "Semua perubahan tersimpan & aman (Clean Repository)"}
                            </div>
                            <div className="text-xs opacity-80 mt-0.5">
                              {gitStatus.hasUncommittedChanges
                                ? "Klik tombol 'Push ke GitHub Sekarang' di bawah untuk otomatis upload tanpa perlu buka terminal!"
                                : "Tidak ada file lokal yang perlu di-push saat ini."}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleGitSync()}
                          disabled={syncingGit || !gitStatus.hasUncommittedChanges}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${syncingGit ? "animate-spin" : ""}`} />
                          <span>{syncingGit ? "Mengunggah..." : "⚡ Push ke GitHub Sekarang"}</span>
                        </button>
                      </div>

                      {/* Auto Sync Settings Switch */}
                      <div className="bg-[#24211D] p-4 rounded-xl border border-[#332F2A] flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-[#F5F0E8]">Otomatis Sync & Push Setiap Kali Simpan Konten</div>
                          <div className="text-[11px] text-[#A89F91]">
                            Setiap Anda menambah/edit artikel, halaman, atau gambar beranda, sistem akan langsung commit & push ke GitHub di background.
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={autoPushOnSave}
                            onChange={(e) => setAutoPushOnSave(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#38332E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A36A]"></div>
                        </label>
                      </div>

                      {/* Changed Files List */}
                      {gitStatus.files.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase text-[#A89F91] mb-2.5">
                            Daftar File Yang Diubah / Ditambah:
                          </h4>
                          <div className="bg-[#141311] border border-[#2D2A26] rounded-xl p-3 font-mono text-xs max-h-48 overflow-y-auto space-y-1.5">
                            {gitStatus.files.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-[#D5C7B3]">
                                <span className="text-[#C9A36A] font-bold">{item.status}</span>
                                <span className="truncate">{item.file}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommended Command Box */}
                      <div className="bg-[#141311] border border-[#3D3833] rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#C9A36A]">Perintah Commit & Push Otomatis:</span>
                          <button
                            onClick={copyGitCommand}
                            className="px-3 py-1 rounded bg-[#C9A36A] hover:bg-[#DBC095] text-[#141311] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                          >
                            {copiedGit ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedGit ? "Berhasil Disalin!" : "Salin Perintah"}
                          </button>
                        </div>
                        <pre className="p-3 bg-[#0A0A09] border border-[#25221F] rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto selection:bg-emerald-900 selection:text-white">
                          {gitStatus.gitCommand}
                        </pre>
                      </div>

                      {/* Instructions */}
                      <div className="bg-[#211E1B] p-4 rounded-xl border border-[#332F2A] text-xs text-[#A89F91] space-y-2">
                        <p className="font-semibold text-[#D5C7B3]">ℹ️ Cara Upload Perubahan ke Hosting/GitHub:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Buka Terminal di komputer Anda (atauVS Code Terminal).</li>
                          <li>Tekan tombol **&ldquo;Salin Perintah&rdquo;** di atas.</li>
                          <li>Paste ke Terminal dan tekan Enter. Perubahan artikel & gambar akan langsung terupload ke repositori Anda!</li>
                        </ol>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#8C8275]">Gagal memuat status Git.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL EDIT / TAMBAH ARTIKEL */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#090807]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1C1A17] border border-[#38332E] w-full max-w-3xl rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#2D2A26] pb-4">
              <h2 className="font-serif font-bold text-xl text-[#F5F0E8]">
                {editingArticle ? "Edit Artikel" : "Tambah Artikel Baru"}
              </h2>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="text-[#998F82] hover:text-[#F5F0E8] text-sm font-semibold cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1">Judul Artikel</label>
                  <input
                    type="text"
                    required
                    value={artTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Contoh: Tips Memilih Material Rumah..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1">
                    Slug URL (otomatis)
                  </label>
                  <input
                    type="text"
                    required
                    value={artSlug}
                    onChange={(e) => setArtSlug(e.target.value)}
                    placeholder="tips-memilih-material-rumah"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1">Kategori</label>
                  <select
                    value={artCategory}
                    onChange={(e) => setArtCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                  >
                    <option value="Konstruksi">Konstruksi</option>
                    <option value="Desain Interior">Desain Interior</option>
                    <option value="Arsitektur">Arsitektur</option>
                    <option value="Tips & Trik">Tips & Trik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1">Penulis</label>
                  <input
                    type="text"
                    value={artAuthor}
                    onChange={(e) => setArtAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1">Status Publikasi</label>
                  <select
                    value={artPublished ? "true" : "false"}
                    onChange={(e) => setArtPublished(e.target.value === "true")}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none font-semibold text-[#C9A36A]"
                  >
                    <option value="true">Published (Tampil)</option>
                    <option value="false">Draft (Tersembunyi)</option>
                  </select>
                </div>
              </div>

              {/* Upload Gambar dengan Auto-Resize Notifier */}
              <div>
                <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1">
                  Gambar Sampul / Cover (Auto-Resize Enabled)
                </label>
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <input
                    type="text"
                    value={artCover}
                    onChange={(e) => setArtCover(e.target.value)}
                    placeholder="URL gambar atau unggah file..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-[#2D2824] hover:bg-[#3B3530] border border-[#453F39] text-xs font-semibold text-[#D5C7B3] flex items-center justify-center gap-2 cursor-pointer transition">
                    <Upload className="w-4 h-4 text-[#C9A36A]" />
                    {uploadingImage ? "Mengunggah..." : "Unggah & Auto-Resize"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "article")}
                      className="hidden"
                    />
                  </label>
                </div>

                {imageResizingInfo && (
                  <p className="text-[11px] text-[#4ADE80] mt-1.5 flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3 text-[#4ADE80]" /> {imageResizingInfo}
                  </p>
                )}

                {artCover && (
                  <div className="mt-2 relative h-32 w-full rounded-xl overflow-hidden border border-[#332F2A]">
                    {/* eslint-disable-next-html-element-suppression */}
                    <img src={artCover} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Section SEO Metadata */}
              <div className="bg-[#24211D] border border-[#3A352F] p-4 rounded-xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A36A] flex items-center gap-1.5">
                  🔍 Pengaturan SEO (Google Search Engine)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#A89F91] mb-1">
                      Judul SEO (Meta Title)
                    </label>
                    <input
                      type="text"
                      value={artMetaTitle}
                      onChange={(e) => setArtMetaTitle(e.target.value)}
                      placeholder="Judul khusus untuk Google (opsional)..."
                      className="w-full px-3.5 py-2 rounded-lg bg-[#191715] border border-[#332F2A] text-xs text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A89F91] mb-1">
                      Kata Kunci SEO (Keywords)
                    </label>
                    <input
                      type="text"
                      value={artKeywords}
                      onChange={(e) => setArtKeywords(e.target.value)}
                      placeholder="Contoh: arsitektur, rumah tropis, kontraktor bali"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#191715] border border-[#332F2A] text-xs text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A89F91] mb-1">
                    Deskripsi SEO (Meta Description)
                  </label>
                  <textarea
                    rows={2}
                    value={artMetaDesc}
                    onChange={(e) => setArtMetaDesc(e.target.value)}
                    placeholder="Deskripsi singkat yang tampil pada hasil pencarian Google..."
                    className="w-full px-3.5 py-2 rounded-lg bg-[#191715] border border-[#332F2A] text-xs text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1">
                  Ringkasan Singkat (Excerpt Preview)
                </label>
                <textarea
                  rows={2}
                  value={artExcerpt}
                  onChange={(e) => setArtExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu artikel..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1">
                  Isi Konten Lengkap Artikel (Format Teks / Markdown)
                </label>
                <textarea
                  rows={8}
                  required
                  value={artContent}
                  onChange={(e) => setArtContent(e.target.value)}
                  placeholder="Tulis artikel Anda di sini..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2D2A26]">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#211E1B] hover:bg-[#2C2824] text-xs font-semibold text-[#A89F91] transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#C9A36A] hover:bg-[#DBC095] text-[#141311] text-xs font-bold transition cursor-pointer shadow disabled:opacity-50"
                >
                  {saveLoading ? "Menyimpan..." : "Simpan Artikel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT / BUAT HALAMAN BARU */}
      {isPageModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#090807]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1C1A17] border border-[#38332E] w-full max-w-3xl rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#2D2A26] pb-4">
              <h2 className="font-serif font-bold text-xl text-[#F5F0E8]">
                {editingPage ? "Edit Halaman Custom" : "Buat Halaman Custom Baru"}
              </h2>
              <button
                onClick={() => setIsPageModalOpen(false)}
                className="text-[#998F82] hover:text-[#F5F0E8] text-sm font-semibold cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1">Judul Halaman</label>
                  <input
                    type="text"
                    required
                    value={pageTitle}
                    onChange={(e) => handlePageTitleChange(e.target.value)}
                    placeholder="Contoh: Tentang Kami / Syarat & Ketentuan"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1">
                    URL Slug (/p/[slug])
                  </label>
                  <input
                    type="text"
                    required
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value)}
                    placeholder="tentang-kami"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none font-mono text-[#C9A36A]"
                  />
                </div>
              </div>

              {/* Section SEO Page */}
              <div className="bg-[#24211D] border border-[#3A352F] p-4 rounded-xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A36A] flex items-center gap-1.5">
                  🔍 Pengaturan SEO Halaman (Meta Title, Description & Keywords)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#A89F91] mb-1">
                      Judul SEO (Meta Title)
                    </label>
                    <input
                      type="text"
                      value={pageMetaTitle}
                      onChange={(e) => setPageMetaTitle(e.target.value)}
                      placeholder="Judul SEO untuk Google..."
                      className="w-full px-3.5 py-2 rounded-lg bg-[#191715] border border-[#332F2A] text-xs text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A89F91] mb-1">
                      Kata Kunci SEO (Keywords)
                    </label>
                    <input
                      type="text"
                      value={pageKeywords}
                      onChange={(e) => setPageKeywords(e.target.value)}
                      placeholder="Contoh: profil grahaloka, kontraktor bali"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#191715] border border-[#332F2A] text-xs text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A89F91] mb-1">
                    Deskripsi SEO (Meta Description)
                  </label>
                  <textarea
                    rows={2}
                    value={pageMeta}
                    onChange={(e) => setPageMeta(e.target.value)}
                    placeholder="Ringkasan halaman untuk hasil pencarian Google..."
                    className="w-full px-3.5 py-2 rounded-lg bg-[#191715] border border-[#332F2A] text-xs text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1">Gambar Header (Opsional)</label>
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <input
                    type="text"
                    value={pageHeaderImage}
                    onChange={(e) => setPageHeaderImage(e.target.value)}
                    placeholder="URL gambar banner..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-[#2D2824] hover:bg-[#3B3530] border border-[#453F39] text-xs font-semibold text-[#D5C7B3] flex items-center justify-center gap-2 cursor-pointer transition">
                    <ImageIcon className="w-4 h-4 text-[#C9A36A]" /> Unggah Header
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "page")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#A89F91] mb-1">
                  Isi Konten Halaman Baru
                </label>
                <textarea
                  rows={9}
                  required
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  placeholder="Tulis isi konten halaman baru di sini..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#211E1B] border border-[#332F2A] text-sm text-[#F5F0E8] focus:border-[#C9A36A] focus:outline-none font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2D2A26]">
                <button
                  type="button"
                  onClick={() => setIsPageModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#211E1B] hover:bg-[#2C2824] text-xs font-semibold text-[#A89F91] transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#C9A36A] hover:bg-[#DBC095] text-[#141311] text-xs font-bold transition cursor-pointer shadow disabled:opacity-50"
                >
                  {saveLoading ? "Menyimpan..." : "Simpan Halaman Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
