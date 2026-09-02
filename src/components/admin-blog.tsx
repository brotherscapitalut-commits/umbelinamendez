import { useEffect, useState } from "react";
import {
  getAllAdminPosts,
  savePost,
  deletePost,
  batchSchedulePosts,
} from "@/lib/blog-store";
import type { BlogPost, BlogContentBlock } from "@/lib/blog";

export function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [loading, setLoading] = useState(false);
  const [batchInterval, setBatchInterval] = useState(7);
  const [selectedForBatch, setSelectedForBatch] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    const data = await getAllAdminPosts();
    setPosts(data);
    setLoading(false);
  }

  function handleCreate() {
    const defaultDate = new Date();
    defaultDate.setMinutes(defaultDate.getMinutes() - defaultDate.getTimezoneOffset());

    setEditingPost({
      slug: "",
      title: "",
      meta_title: "",
      meta_description: "",
      hero_image: "",
      excerpt: "",
      category: "Dermatologia",
      keywords: [],
      readingMinutes: 5,
      content: [{ heading: "Novo Tópico", paragraphs: [""] }],
      published_at: defaultDate.toISOString().slice(0, 16),
      cadence_interval_days: 7,
      status: "draft",
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPost) return;

    // Convert date string if it comes from datetime-local
    let finalPost = { ...editingPost };
    if (finalPost.published_at && finalPost.published_at.length === 16) {
      finalPost.published_at = new Date(finalPost.published_at).toISOString();
    }

    setLoading(true);
    await savePost(finalPost);
    setEditingPost(null);
    await loadPosts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar este post?")) return;
    setLoading(true);
    await deletePost(id);
    await loadPosts();
  }

  async function handleBatchSchedule() {
    const toSchedule = posts.filter(p => selectedForBatch.has(p.id!));
    if (toSchedule.length === 0) {
      alert("Selecione pelo menos um post na lista para agendamento em lote.");
      return;
    }

    if (!confirm(`Agendar ${toSchedule.length} posts com intervalo de ${batchInterval} dias?`)) return;

    setLoading(true);
    await batchSchedulePosts(toSchedule, batchInterval);
    setSelectedForBatch(new Set());
    await loadPosts();
  }

  function toggleSelection(id: string) {
    const next = new Set(selectedForBatch);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedForBatch(next);
  }

  if (editingPost) {
    return (
      <div className="space-y-6 animate-[fadeIn_.2s_ease-out]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl font-bold text-[#2D2322]">
            {editingPost.id ? "Editar Post" : "Novo Post"}
          </h2>
          <button
            onClick={() => setEditingPost(null)}
            className="text-xs text-[#6E5A56] hover:text-[#8C4E43] underline underline-offset-4"
          >
            Voltar para lista
          </button>
        </div>

        <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-8">
          {/* Coluna Esquerda: Dados Básicos e Conteúdo */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl border border-[#E8D8D0] bg-white shadow-sm space-y-4">
              <h3 className="font-semibold text-[#2D2322] border-b border-[#F2E7E1] pb-3 mb-4">Informações Básicas</h3>
              
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold mb-1">Título do Post (H1)</label>
                <input
                  required
                  type="text"
                  value={editingPost.title || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#2D2322] outline-none focus:ring-2 focus:ring-[#8C4E43]/60"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold mb-1">Slug da URL</label>
                <input
                  required
                  type="text"
                  value={editingPost.slug || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  className="w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#2D2322] outline-none focus:ring-2 focus:ring-[#8C4E43]/60"
                  placeholder="ex: como-funciona-o-pos-operatorio"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold mb-1">URL da Imagem Hero</label>
                <input
                  type="text"
                  value={editingPost.hero_image || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, hero_image: e.target.value })}
                  className="w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#2D2322] outline-none focus:ring-2 focus:ring-[#8C4E43]/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold mb-1">Categoria</label>
                  <input
                    type="text"
                    value={editingPost.category || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#2D2322] outline-none focus:ring-2 focus:ring-[#8C4E43]/60"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold mb-1">Tempo Leitura (min)</label>
                  <input
                    type="number"
                    value={editingPost.readingMinutes || 5}
                    onChange={(e) => setEditingPost({ ...editingPost, readingMinutes: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#2D2322] outline-none focus:ring-2 focus:ring-[#8C4E43]/60"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-[#E8D8D0] bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#F2E7E1] pb-3 mb-4">
                <h3 className="font-semibold text-[#2D2322]">Conteúdo Estruturado (JSON)</h3>
              </div>
              <textarea
                value={JSON.stringify(editingPost.content || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setEditingPost({ ...editingPost, content: parsed });
                  } catch (err) {
                    // Ignora erro de sintaxe durante a digitação
                  }
                }}
                className="w-full h-64 rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#2D2322] outline-none focus:ring-2 focus:ring-[#8C4E43]/60 font-mono"
              />
              <p className="text-[10px] text-amber-600">Formato: array de objetos com heading (opcional) e paragraphs (array de strings).</p>
            </div>
          </div>

          {/* Coluna Direita: SEO e Publicação */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl border border-[#E8D8D0] bg-[#FDFBF9] shadow-sm space-y-4 border-l-4 border-l-[#8C4E43]">
              <h3 className="font-semibold text-[#2D2322] border-b border-[#F2E7E1] pb-3 mb-4 flex items-center gap-2">
                🔍 Otimização SEO
              </h3>

              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold">Meta Title</label>
                  <span className={`text-[10px] font-bold ${editingPost.meta_title?.length && editingPost.meta_title.length > 60 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {editingPost.meta_title?.length || 0}/60
                  </span>
                </div>
                <input
                  type="text"
                  value={editingPost.meta_title || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, meta_title: e.target.value })}
                  className="w-full rounded-xl border border-[#E8D8D0] bg-white px-4 py-2.5 text-xs text-[#2D2322] outline-none focus:ring-2 focus:ring-[#8C4E43]/60"
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold">Meta Description & Excerpt</label>
                  <span className={`text-[10px] font-bold ${editingPost.meta_description?.length && editingPost.meta_description.length > 160 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {editingPost.meta_description?.length || 0}/160
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={editingPost.meta_description || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, meta_description: e.target.value, excerpt: e.target.value })}
                  className="w-full rounded-xl border border-[#E8D8D0] bg-white px-4 py-2.5 text-xs text-[#2D2322] outline-none focus:ring-2 focus:ring-[#8C4E43]/60"
                />
              </div>

              {/* Preview Google */}
              <div className="mt-4 p-4 rounded-xl bg-white border border-[#E8D8D0] shadow-sm">
                <div className="text-[10px] text-[#6E5A56] mb-2 font-bold uppercase tracking-wider">Preview Google</div>
                <div className="text-xs text-[#202124] flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-stone-200"></div>
                  <div>
                    <div className="font-semibold leading-tight">Dra. Umbelina Mendez</div>
                    <div className="text-[#5f6368] text-[10px] leading-tight">https://www.umbelinamendez.com.br › blog › {editingPost.slug}</div>
                  </div>
                </div>
                <div className="text-[#1a0dab] text-lg font-medium hover:underline cursor-pointer truncate">
                  {editingPost.meta_title || "Título da Página"}
                </div>
                <div className="text-[#4d5156] text-xs line-clamp-2 mt-1">
                  {editingPost.meta_description || "Descrição que aparecerá nos resultados de busca do Google."}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-[#E8D8D0] bg-white shadow-sm space-y-4">
              <h3 className="font-semibold text-[#2D2322] border-b border-[#F2E7E1] pb-3 mb-4">Publicação e Status</h3>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold mb-1">Status</label>
                <select
                  value={editingPost.status || "draft"}
                  onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as any })}
                  className="w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#2D2322] outline-none"
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Arquivado</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold mb-1">Data de Publicação</label>
                <input
                  type="datetime-local"
                  value={
                    editingPost.published_at && editingPost.published_at.length > 16 
                      ? editingPost.published_at.slice(0, 16) 
                      : (editingPost.published_at || "")
                  }
                  onChange={(e) => setEditingPost({ ...editingPost, published_at: e.target.value })}
                  className="w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#2D2322] outline-none focus:ring-2 focus:ring-[#8C4E43]/60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#8C4E43] text-white py-3.5 text-sm font-semibold hover:bg-[#8C4E43] shadow-md transition disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar Artigo"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-[fadeIn_.2s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#2D2322]">
            Blog CMS & SEO
          </h2>
          <p className="text-xs text-[#6E5A56] mt-1 leading-relaxed">
            Gerencie publicações, cadência de postagens e tags de otimização para motores de busca.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="rounded-full bg-[#8C4E43] text-white px-5 py-2 text-xs font-semibold hover:bg-[#8C4E43] shadow-sm transition"
        >
          + Novo Artigo
        </button>
      </div>

      {/* Cadência em Lote */}
      <div className="p-5 rounded-3xl bg-white border border-[#E8D8D0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold">Agendamento em Lote</div>
          <div className="text-xs text-[#6E5A56] mt-1">Selecione artigos abaixo e defina a cadência de publicação.</div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-[#2D2322]">Intervalo:</label>
          <select 
            value={batchInterval}
            onChange={(e) => setBatchInterval(Number(e.target.value))}
            className="rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-3 py-1.5 text-xs outline-none"
          >
            <option value={1}>1 Dia (Diário)</option>
            <option value={7}>7 Dias (Semanal)</option>
            <option value={15}>15 Dias (Quinzenal)</option>
            <option value={30}>30 Dias (Mensal)</option>
          </select>
          <button
            onClick={handleBatchSchedule}
            disabled={selectedForBatch.size === 0 || loading}
            className="rounded-full bg-stone-800 text-white px-4 py-1.5 text-xs font-semibold hover:bg-stone-700 disabled:opacity-40 transition"
          >
            Agendar ({selectedForBatch.size})
          </button>
        </div>
      </div>

      {/* Lista de Artigos */}
      <div className="rounded-3xl border border-[#E8D8D0] bg-white overflow-hidden shadow-sm">
        {loading && posts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6E5A56]">Carregando posts...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6E5A56]">Nenhum artigo encontrado.</div>
        ) : (
          <table className="w-full text-left text-xs text-[#2D2322]">
            <thead className="bg-[#FDFBF9] border-b border-[#E8D8D0] text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold">
              <tr>
                <th className="py-3 px-4 w-10">Sel</th>
                <th className="py-3 px-4">Artigo</th>
                <th className="py-3 px-4">Status / Data</th>
                <th className="py-3 px-4">SEO / Categoria</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2E7E1]">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-[#FDFBF9] transition">
                  <td className="py-3 px-4">
                    <input 
                      type="checkbox" 
                      checked={selectedForBatch.has(post.id!)} 
                      onChange={() => toggleSelection(post.id!)}
                      className="rounded border-[#E8D8D0]"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-sm">{post.title}</div>
                    <div className="text-[10px] text-[#6E5A56]">/{post.slug}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      post.status === 'published' ? 'bg-emerald-50 text-emerald-700' :
                      post.status === 'draft' ? 'bg-amber-50 text-amber-700' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {post.status}
                    </span>
                    <div className="text-[10px] text-[#6E5A56] mt-1">
                      {new Date(post.published_at).toLocaleDateString("pt-BR")}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{post.category}</div>
                    <div className="text-[10px] text-[#6E5A56] truncate max-w-[150px]">{post.meta_title}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => setEditingPost(post)}
                      className="text-[#8C4E43] hover:underline font-semibold mr-3"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id!)}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
