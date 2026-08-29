import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  // Configura CORS se necessário (opcional)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Chave base onde salvaremos a configuração de SEO
  const KV_KEY = "umbelina_seo_config_v1";

  if (req.method === "GET") {
    try {
      const data = await kv.get(KV_KEY);
      return res.status(200).json(data || {});
    } catch (error) {
      console.error("Erro ao ler do Vercel KV:", error);
      // Fallback local se o KV não estiver configurado
      return res.status(200).json({});
    }
  }

  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      // Validação simples (MVP) para evitar acesso público de escrita
      if (auth !== `Bearer ${process.env.ADMIN_TOKEN || 'umbelina2026'}`) {
        return res.status(401).json({ error: "Não autorizado." });
      }
      
      const payload = req.body;
      await kv.set(KV_KEY, payload);
      
      return res.status(200).json({ success: true, message: "Configuração salva com sucesso." });
    } catch (error) {
      console.error("Erro ao escrever no Vercel KV:", error);
      return res.status(500).json({ error: "Erro interno ao salvar configurações." });
    }
  }

  res.status(405).json({ error: "Método não permitido." });
}
