import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const oldSupabase = createClient(
  'https://hrrkcdqxjectjahdeymt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhycmtjZHF4amVjdGphaGRleW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTgyNTgsImV4cCI6MjA4ODE5NDI1OH0.HzslG8b1WDvuZrMYFjcH2Vc3dniw48f0iY3Pk6ZhbHI'
);

async function run() {
  console.log('Buscando produtos do banco antigo...');
  const { data: p, error } = await oldSupabase.from('products').select('*');
  
  if (error) {
    console.error('Erro ao buscar:', error);
    return;
  }

  console.log(`Processando ${p.length} produtos...`);
  const stream = fs.createWriteStream('migracao_com_fotos.sql');
  
  stream.write('DELETE FROM public.products;\n');
  
  for (const prod of p) {
    const name = (prod.name || '').replace(/'/g, "''");
    const desc = (prod.description || '').replace(/'/g, "''");
    const cat = (prod.category || '');
    const sub = (prod.subcategory || '');
    const img = (prod.image || '');
    
    // Incluir campos de vídeos e descrição curta que identificamos no banco anterior
    const shortDesc = (prod.short_description || '').replace(/'/g, "''");
    const videoUrl = (prod.video_url || '');
    
    const sql = `INSERT INTO public.products (id, name, description, category, subcategory, price, image, stock, status, short_description, video_url) VALUES ('${prod.id}', '${name}', '${desc}', '${cat}', '${sub}', ${prod.price || 0}, '${img}', ${prod.stock || 0}, 'ativo', '${shortDesc}', '${videoUrl}') ON CONFLICT (id) DO NOTHING;\n`;
    stream.write(sql);
  }
  
  stream.end();
  console.log('✅ SUCESSO! O arquivo "migracao_com_fotos.sql" foi criado.');
  console.log('Abra o arquivo, copie o conteúdo e cole no SQL Editor do Supabase.');
}

run();
