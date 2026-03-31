import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Zap, ShieldCheck, Truck, Award } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Máscara de CPF: 000.000.000-00
  const handleCpfChange = (value: string) => {
    const clean = value.replace(/\D/g, "");
    let masked = clean;
    if (clean.length > 3) masked = clean.substring(0, 3) + "." + clean.substring(3);
    if (clean.length > 6) masked = masked.substring(0, 7) + "." + masked.substring(7);
    if (clean.length > 9) masked = masked.substring(0, 11) + "-" + masked.substring(11);
    setCpf(masked.substring(0, 14));
  };

  // Máscara de Telefone: (00) 00000-0000
  const handlePhoneChange = (value: string) => {
    const clean = value.replace(/\D/g, "");
    let masked = clean;
    if (clean.length > 0) masked = "(" + clean;
    if (clean.length > 2) masked = "(" + clean.substring(0, 2) + ") " + clean.substring(2);
    if (clean.length > 7) masked = masked.substring(0, 10) + "-" + masked.substring(10);
    setPhone(masked.substring(0, 15));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      navigate("/minha-conta");
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isLogin) {
      if (!name || !phone || !cpf) {
        setError("Por favor, preencha todos os campos obrigatórios");
        setLoading(false);
        return;
      }
    }

    const { error } = await signUp(email, password, { name, phone, cpf });
    if (error) {
      setError(error.message);
    } else {
      setError("✅ Verifique seu email para confirmar sua conta!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos de fundo decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Container Principal */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Lado Esquerdo - Informações */}
        <div className="hidden lg:flex flex-col justify-center items-start">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Bem-vindo à Automatiza
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Acesse sua conta para gerenciar pedidos, acompanhar envios e aproveitar ofertas exclusivas.
            </p>

            {/* Cards de Benefícios */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-cyan-100/50 hover:border-cyan-300/50 transition-all hover:shadow-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Segurança</h3>
                  <p className="text-sm text-gray-600">Dados protegidos com criptografia</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100/50 hover:border-blue-300/50 transition-all hover:shadow-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Frete Rápido</h3>
                  <p className="text-sm text-gray-600">Entrega em todo Brasil</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-100/50 hover:border-purple-300/50 transition-all hover:shadow-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Garantia</h3>
                  <p className="text-sm text-gray-600">Proteção de até 24 meses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="flex flex-col justify-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isLogin ? "Faça Login" : "Criar Conta"}
                </h2>
              </div>
              <p className="text-gray-600">
                {isLogin
                  ? "Entre com suas credenciais para acessar sua conta"
                  : "Preencha os dados abaixo para criar sua conta"}
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-5">
              {error && (
                <Alert variant={error.includes("✅") ? "default" : "destructive"} className="border-2">
                  <AlertDescription className={error.includes("✅") ? "text-green-700" : ""}>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Nome Completo (Apenas Cadastro) */}
              {!isLogin && (
                <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <Label htmlFor="name" className="text-gray-700 font-semibold">
                    Nome Completo
                  </Label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="João Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10 h-11 border-gray-300 border-2 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg transition-all"
                    />
                  </div>
                </div>
              )}

              {/* CPF e Telefone (Apenas Cadastro - Lado a Lado) */}
              {!isLogin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-semibold">
                      Telefone
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(00) 00000-0000"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-10 h-11 border-gray-300 border-2 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-gray-700 font-semibold">
                      CPF
                    </Label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="cpf"
                        type="text"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={(e) => handleCpfChange(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-10 h-11 border-gray-300 border-2 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-10 h-11 border-gray-300 border-2 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg transition-all"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-semibold">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-10 h-11 border-gray-300 border-2 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg transition-all"
                  />
                </div>
              </div>

              {/* Botão Principal */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-base mt-6"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLogin ? "Entrando..." : "Criando conta..."}
                  </div>
                ) : (
                  <>{isLogin ? "Entrar" : "Criar Conta"}</>
                )}
              </Button>

              {/* Alternador */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Não tem conta?" : "Já tem conta?"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setEmail("");
                    setPassword("");
                  }}
                  className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 underline transition-colors"
                >
                  {isLogin ? "Cadastre-se" : "Faça login"}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Ao criar uma conta ou fazer login, você concorda com nossos{" "}
                <a href="/termos-garantia" className="text-cyan-600 hover:underline">
                  Termos de Serviço
                </a>
              </p>
            </div>
          </div>

          {/* Botão Voltar */}
          <button
            onClick={() => navigate("/")}
            className="mt-6 text-center text-gray-600 hover:text-gray-900 font-medium transition-colors hover:underline"
          >
            ← Voltar para a página inicial
          </button>
        </div>
      </div>
    </div>
  );
}
