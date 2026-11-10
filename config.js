/* Configuração do servidor (Supabase) — usado pelo app (index.html) e pelo painel (admin.html).
   Supabase → Project Settings → API (ou "Connect"):
   - url: o "Project URL" (ex.: https://abcdefgh.supabase.co)
   - key: a chave "publishable" (sb_publishable_...) ou a "anon public" (eyJ...)
   Essa chave pode ficar pública: quem protege os dados são as regras do banco (RLS). */
window.OMNI_CLOUD = {
  url: 'COLE-AQUI-O-PROJECT-URL',
  key: 'COLE-AQUI-A-CHAVE-PUBLISHABLE'
};
