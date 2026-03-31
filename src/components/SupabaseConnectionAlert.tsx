import { useState, useEffect } from "react";
import { AlertCircle, X, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function SupabaseConnectionAlert() {
  const [isConnected, setIsConnected] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Tenta conectar ao Supabase
        const { data, error } = await supabase
          .from("products")
          .select("count")
          .limit(1);

        if (error) {
          setIsConnected(false);
          // Identifica o tipo de erro
          if (error.code === "PGRST116" || error.message.includes("does not exist")) {
            setErrorMessage(
              "⚠️ As tabelas do banco de dados não foram criadas. Acesse a aba 'Diagnóstico' para corrigir."
            );
          } else if (error.code === "42P01") {
            setErrorMessage(
              "❌ Tabela 'products' não existe no Supabase. Execute o arquivo SUPABASE_SETUP.sql"
            );
          } else if (!user) {
            setErrorMessage(
              "🔓 Faça login para sincronizar com Supabase. Seus dados estão salvos localmente."
            );
          } else {
            setErrorMessage(`❌ Erro na conexão: ${error.message}`);
          }
        } else {
          setIsConnected(true);
          setErrorMessage("");
        }
      } catch (err: any) {
        setIsConnected(false);
        setErrorMessage("❌ Erro ao conectar com Supabase");
      } finally {
        setLoading(false);
      }
    };

    // Verifica a cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    checkConnection();

    return () => clearInterval(interval);
  }, [user]);

  if (loading || dismissed || isConnected) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 z-50 animate-in slide-in-from-top">
      <div className="bg-gradient-to-r from-yellow-900/80 to-orange-900/80 backdrop-blur-xl rounded-2xl border-2 border-yellow-500/40 p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-yellow-300 mb-1">Problema na Sincronização</h3>
            <p className="text-yellow-100 text-sm">{errorMessage}</p>
            <p className="text-yellow-200 text-xs mt-2">
              💾 Seus dados estão salvos localmente. Clique em "Diagnóstico" no menu.
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-yellow-400 hover:text-yellow-300 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
