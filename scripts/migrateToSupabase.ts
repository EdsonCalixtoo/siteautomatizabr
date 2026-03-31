// Script para migrar produtos do localStorage para Supabase
// Execute esto no console do navegador após estar logado

async function migrateProductsToSupabase() {
  // @ts-ignore
  const { supabase } = await import('/src/lib/supabase.ts');
  
  // Pegar produtos do localStorage
  const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
  
  if (localProducts.length === 0) {
    console.log('❌ Nenhum produto encontrado no localStorage');
    return;
  }

  console.log(`📋 Encontrados ${localProducts.length} produtos para migrar...`);

  // Obter usuário autenticado
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('❌ Nenhum usuário autenticado!');
    return;
  }

  console.log(`👤 Migrando para usuário: ${user.email}`);

  let successCount = 0;
  let errorCount = 0;

  // Migrar cada produto
  for (const product of localProducts) {
    try {
      const { error } = await supabase.from('products').insert([
        {
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          subcategory: product.subcategory,
          price: product.price,
          image: product.image,
          images: product.images || [product.image].filter(Boolean),
          stock: product.stock,
          sku: product.sku,
          weight: product.weight,
          dimensions: product.dimensions,
          warranty: product.warranty,
          material: product.material,
          status: product.status || 'ativo',
          user_id: user.id,
        }
      ]);

      if (error) {
        console.error(`❌ Erro ao migrar "${product.name}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Migrado: ${product.name}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Erro ao processar "${product.name}":`, err);
      errorCount++;
    }
  }

  console.log('\n===========================================');
  console.log(`📊 Resultado da Migração:`);
  console.log(`✅ Sucesso: ${successCount}/${localProducts.length}`);
  console.log(`❌ Erros: ${errorCount}/${localProducts.length}`);
  console.log('===========================================\n');

  if (successCount > 0) {
    console.log('🔄 Atualizando página em 2 segundos...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}

// Copie este script, abra o console (F12), cole e execute:
// migrateProductsToSupabase()

export default migrateProductsToSupabase;
