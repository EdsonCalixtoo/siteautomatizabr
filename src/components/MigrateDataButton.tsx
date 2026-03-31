import { useState } from "react";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface MigrationStatus {
  success: number;
  error: number;
  total: number;
  isRunning: boolean;
}

export function MigrateDataButton() {
  const { user } = useAuth();
  const [status, setStatus] = useState<MigrationStatus>({
    success: 0,
    error: 0,
    total: 0,
    isRunning: false,
  });
  const [showResult, setShowResult] = useState(false);

  const migrateProducts = async () => {
    if (!user) {
      alert("Você precisa estar logado para migrar dados");
      return;
    }

    const localProducts = JSON.parse(localStorage.getItem("products") || "[]");

    if (localProducts.length === 0) {
      alert("Nenhum produto encontrado no localStorage");
      return;
    }

    setStatus({
      success: 0,
      error: 0,
      total: localProducts.length,
      isRunning: true,
    });

    setShowResult(true);

    let successCount = 0;
    let errorCount = 0;

    for (const product of localProducts) {
      try {
        const { error } = await supabase.from("products").insert([
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
            status: product.status || "ativo",
            user_id: user.id,
          },
        ]);

        if (error) {
          console.error(`Erro ao migrar "${product.name}":`, error.message);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error(`Erro ao processar "${product.name}":`, err);
        errorCount++;
      }

      // Atualizar status em tempo real
      setStatus((prev) => ({
        ...prev,
        success: successCount,
        error: errorCount,
      }));
    }

    setStatus((prev) => ({
      ...prev,
      isRunning: false,
    }));

    if (successCount > 0) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  if (!showResult) {
    return (
      <Button
        onClick={migrateProducts}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Migrar Dados para Supabase
      </Button>
    );
  }

  if (status.isRunning) {
    return (
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="animate-spin">
            <AlertCircle className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-blue-300 font-semibold">
            Migrando {status.success + status.error} de {status.total} produtos...
          </p>
        </div>
        <div className="w-full bg-blue-900/30 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((status.success + status.error) / status.total) * 100}%`,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-400" />
        <p className="text-green-300 font-semibold">Migração Concluída!</p>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="bg-green-500/10 rounded-lg p-2">
          <p className="text-green-300 font-bold">{status.success}</p>
          <p className="text-green-400 text-xs">Sucesso</p>
        </div>
        <div className={`rounded-lg p-2 ${status.error > 0 ? "bg-red-500/10" : "bg-gray-500/10"}`}>
          <p className={`font-bold ${status.error > 0 ? "text-red-300" : "text-gray-300"}`}>
            {status.error}
          </p>
          <p className={`text-xs ${status.error > 0 ? "text-red-400" : "text-gray-400"}`}>
            Erros
          </p>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-2">
          <p className="text-blue-300 font-bold">{status.total}</p>
          <p className="text-blue-400 text-xs">Total</p>
        </div>
      </div>
      {status.error === 0 && (
        <p className="text-green-300 text-sm">
          ✅ Todos os produtos foram migrados com sucesso!
        </p>
      )}
    </div>
  );
}
