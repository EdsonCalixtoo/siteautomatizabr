import { useState, useEffect } from "react";
import { AlertCircle, Check, X, Loader, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface DiagnosticResult {
  name: string;
  status: "success" | "error" | "loading" | "pending";
  message: string;
}

export function SupabaseDiagnostic() {
  const { user } = useAuth();
  const [results, setResults] = useState<DiagnosticResult[]>([
    { name: "Conexão com Supabase", status: "pending", message: "" },
    { name: "Autenticação", status: "pending", message: "" },
    { name: "Tabela Products", status: "pending", message: "" },
    { name: "Tabela Coupons", status: "pending", message: "" },
    { name: "Tabela Orders", status: "pending", message: "" },
    { name: "Tabela Sellers", status: "pending", message: "" },
    { name: "Políticas RLS", status: "pending", message: "" },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const newResults = [...results];

    // 1. Teste de Conexão
    try {
      const { data, error } = await supabase.from("products").select("count").limit(1);
      if (error?.code === "PGRST116") {
        // Tabela não existe, mas conectou
        newResults[0] = { name: "Conexão com Supabase", status: "success", message: "✅ Conectado" };
      } else if (error) {
        newResults[0] = { name: "Conexão com Supabase", status: "error", message: `❌ ${error.message}` };
      } else {
        newResults[0] = { name: "Conexão com Supabase", status: "success", message: "✅ Conectado" };
      }
    } catch (err) {
      newResults[0] = { name: "Conexão com Supabase", status: "error", message: `❌ ${String(err)}` };
    }
    setResults([...newResults]);

    // 2. Teste de Autenticação
    if (user) {
      newResults[1] = { 
        name: "Autenticação", 
        status: "success", 
        message: `✅ Logado como ${user.email}` 
      };
    } else {
      newResults[1] = { 
        name: "Autenticação", 
        status: "error", 
        message: "❌ Nenhum usuário logado" 
      };
    }
    setResults([...newResults]);

    // 3-6. Teste de Tabelas
    const tables = ["products", "coupons", "orders", "sellers"];
    for (let i = 0; i < tables.length; i++) {
      const tableName = tables[i];
      try {
        const { data, error } = await supabase.from(tableName).select("*").limit(0);
        if (error?.code === "PGRST116") {
          newResults[i + 2] = {
            name: `Tabela ${tableName}`,
            status: "error",
            message: `❌ Tabela não existe. Execute o SQL do SUPABASE_SETUP.sql`,
          };
        } else if (error) {
          newResults[i + 2] = {
            name: `Tabela ${tableName}`,
            status: "error",
            message: `❌ ${error.message}`,
          };
        } else {
          newResults[i + 2] = {
            name: `Tabela ${tableName}`,
            status: "success",
            message: `✅ Tabela existe`,
          };
        }
      } catch (err) {
        newResults[i + 2] = {
          name: `Tabela ${tableName}`,
          status: "error",
          message: `❌ ${String(err)}`,
        };
      }
      setResults([...newResults]);
    }

    // 7. Teste de RLS
    try {
      if (user) {
        const { data, error } = await supabase
          .from("products")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        if (error?.code === "PGRST116") {
          newResults[6] = {
            name: "Políticas RLS",
            status: "error",
            message: "❌ Tabela não existe ainda",
          };
        } else if (error) {
          newResults[6] = {
            name: "Políticas RLS",
            status: "error",
            message: `❌ ${error.message}`,
          };
        } else {
          newResults[6] = {
            name: "Políticas RLS",
            status: "success",
            message: "✅ RLS funcionando corretamente",
          };
        }
      } else {
        newResults[6] = {
          name: "Políticas RLS",
          status: "error",
          message: "❌ Precisa estar logado para testar",
        };
      }
    } catch (err) {
      newResults[6] = {
        name: "Políticas RLS",
        status: "error",
        message: `❌ ${String(err)}`,
      };
    }

    setResults([...newResults]);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, [user]);

  const allSuccess = results.every((r) => r.status === "success");
  const hasErrors = results.some((r) => r.status === "error");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Diagnóstico Supabase</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-cyan-400 hover:text-cyan-300 underline text-sm"
        >
          {showDetails ? "Ocultar" : "Detalhes"}
        </button>
      </div>

      {/* Status Geral */}
      <div
        className={`rounded-xl p-4 border-2 ${
          allSuccess
            ? "bg-green-500/10 border-green-500/30"
            : hasErrors
              ? "bg-red-500/10 border-red-500/30"
              : "bg-blue-500/10 border-blue-500/30"
        }`}
      >
        <div className="flex items-center gap-3">
          {allSuccess ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : hasErrors ? (
            <X className="w-5 h-5 text-red-400" />
          ) : (
            <Loader className="w-5 h-5 text-blue-400 animate-spin" />
          )}
          <div>
            <p
              className={`font-bold ${
                allSuccess ? "text-green-300" : hasErrors ? "text-red-300" : "text-blue-300"
              }`}
            >
              {allSuccess
                ? "✅ Tudo está funcionando!"
                : hasErrors
                  ? "❌ Há erros a resolver"
                  : "🔄 Verificando..."}
            </p>
            {hasErrors && (
              <p className="text-red-400 text-sm mt-1">
                Clique em "Próximos Passos" abaixo para resolver
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Resultados */}
      <div className="space-y-2">
        {results.map((result, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="flex items-center gap-3">
              {result.status === "success" ? (
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              ) : result.status === "error" ? (
                <X className="w-4 h-4 text-red-400 flex-shrink-0" />
              ) : result.status === "loading" ? (
                <Loader className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-500 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{result.name}</p>
                {showDetails && (
                  <p className={`text-xs mt-1 ${
                    result.status === "success"
                      ? "text-green-400"
                      : result.status === "error"
                        ? "text-red-400"
                        : "text-gray-400"
                  }`}>
                    {result.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-2 pt-4 border-t border-white/10">
        <Button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
          Re-verificar
        </Button>
      </div>

      {/* Próximos Passos */}
      {hasErrors && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <p className="text-yellow-300 font-semibold">Próximos Passos:</p>
          </div>
          <ol className="list-decimal list-inside text-yellow-300 text-sm space-y-2">
            <li>Abra o arquivo <code className="bg-black/20 px-2 py-1 rounded">SUPABASE_SETUP.sql</code></li>
            <li>Vá para <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-200">Supabase Console</a></li>
            <li>Clique em <strong>SQL Editor</strong> → <strong>New Query</strong></li>
            <li>Cole TODO o conteúdo do arquivo SQL</li>
            <li>Clique em <strong>RUN</strong></li>
            <li>Volte aqui e clique em <strong>Re-verificar</strong></li>
          </ol>
        </div>
      )}

      {/* Info de Debug */}
      {showDetails && user && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
          <p className="text-blue-300 text-xs font-mono break-all">
            <strong>User ID:</strong> {user.id}
          </p>
          <p className="text-blue-300 text-xs font-mono break-all">
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}
    </div>
  );
}
