import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, User, LogOut, Eye, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";

interface Order {
  id: string;
  date: string;
  items: Array<{ id: string; name: string; quantity: number; price: number; category?: string }>;
  total: number;
  paymentMethod: string;
  status: "pendente" | "confirmado" | "enviado" | "entregue" | "cancelado";
  customer: { name: string; email: string; phone: string };
}

interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pendente":
      return "bg-amber-500/20 text-amber-500 border border-amber-500/30";
    case "pago":
    case "confirmado":
      return "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30";
    case "enviado":
      return "bg-blue-500/20 text-blue-500 border border-blue-500/30";
    case "entregue":
      return "bg-green-500/20 text-green-500 border border-green-500/30";
    case "cancelado":
      return "bg-red-500/20 text-red-500 border border-red-500/30";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pendente":
      return "🕐 Aguardando Pagamento";
    case "pago":
    case "confirmado":
      return "✅ Pagamento Aprovado";
    case "enviado":
      return "📦 Produto Enviado";
    case "entregue":
      return "🎉 Entregue";
    case "cancelado":
      return "❌ Cancelado";
    default:
      return status;
  }
};

export default function CustomerArea() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado do cliente - começa vazio e carrega do localStorage
  const [customer, setCustomer] = useState<CustomerProfile>({
    name: "",
    email: user?.email || "",
    phone: "",
    cpf: "",
  });

  const [editData, setEditData] = useState<CustomerProfile>({
    name: "",
    email: user?.email || "",
    phone: "",
    cpf: "",
  });

  // Carregar dados salvos no localStorage na primeira vez
  useEffect(() => {
    const saved = localStorage.getItem(`customer_${user?.id}`);
    if (saved) {
      const data = JSON.parse(saved);
      setCustomer(data);
      setEditData(data);
    } else {
      // Se não houver dados, usar apenas o email do usuário autenticado
      setCustomer({
        name: "",
        email: user?.email || "",
        phone: "",
        cpf: "",
      });
      setEditData({
        name: "",
        email: user?.email || "",
        phone: "",
        cpf: "",
      });
    }
  }, [user]);

  // Carregar pedidos do localStorage
  const [orders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [showDownloadModal, setShowDownloadModal] = useState<string | null>(null);

  const handleLogout = async () => {
    // Logout será tratado pelo AuthButton
    navigate("/");
  };

  // Formatar telefone com máscara (XX) 9XXXX-XXXX ou (XX) XXXX-XXXX
  const handlePhoneChange = (value: string) => {
    const cleanPhone = value.replace(/\D/g, "");

    let formattedPhone = "";

    if (cleanPhone.length > 0) {
      if (cleanPhone.length <= 2) {
        // Apenas códígigo de área: (XX
        formattedPhone = `(${cleanPhone}`;
      } else if (cleanPhone.length <= 7) {
        // Até 7 dígitos: (XX) 9XXXX ou (XX) XXXX
        const areaCode = cleanPhone.substring(0, 2);
        const firstPart = cleanPhone.substring(2, 7);
        formattedPhone = `(${areaCode}) ${firstPart}`;
      } else {
        // Mais de 7 dígitos: (XX) 9XXXX-XXXX ou (XX) XXXX-XXXX
        const areaCode = cleanPhone.substring(0, 2);
        const firstPart = cleanPhone.substring(2, 7);
        const secondPart = cleanPhone.substring(7, 11);
        formattedPhone = `(${areaCode}) ${firstPart}-${secondPart}`;
      }
    }

    setEditData({ ...editData, phone: formattedPhone });
  };

  const handleSaveProfile = () => {
    // Validar campos obrigatórios
    if (!editData.name.trim()) {
      alert("Por favor, preencha o nome completo!");
      return;
    }
    if (!editData.phone.trim()) {
      alert("Por favor, preencha o telefone!");
      return;
    }
    if (!editData.cpf.trim()) {
      alert("Por favor, preencha o CPF!");
      return;
    }

    // Salvar no localStorage
    setCustomer(editData);
    localStorage.setItem(`customer_${user?.id}`, JSON.stringify(editData));
    setIsEditing(false);
    alert("Perfil atualizado com sucesso!");
  };

  // Gerar HTML do documento do pedido
  const generateOrderHTML = (order: Order, type: "financeiro" | "producao") => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pedido ${order.id.slice(0, 8)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .logo {
      font-size: 48px;
      margin-bottom: 15px;
      display: inline-block;
    }
    
    .content {
      padding: 40px;
    }
    
    .badge-container {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    
    .badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .badge-order {
      background: #e0f2fe;
      color: #0369a1;
    }
    
    .badge-status {
      background: #dcfce7;
      color: #166534;
    }
    
    .badge-type {
      background: #fef3c7;
      color: #92400e;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #f0f0f0;
    }
    
    .info-section h3 {
      color: #06b6d4;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 15px;
      letter-spacing: 0.5px;
    }
    
    .info-item {
      margin-bottom: 12px;
    }
    
    .info-item label {
      display: block;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 4px;
      font-weight: 600;
    }
    
    .info-item value {
      display: block;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }
    
    .items-section {
      margin-bottom: 40px;
    }
    
    .items-section h3 {
      color: #06b6d4;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 20px;
      letter-spacing: 0.5px;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    .items-table thead {
      background: #f8f8f8;
      border-bottom: 2px solid #e0e0e0;
    }
    
    .items-table th {
      padding: 12px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #333;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .items-table td {
      padding: 15px 12px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
      color: #333;
    }
    
    .items-table tbody tr:hover {
      background: #f9f9f9;
    }
    
    .summary {
      background: linear-gradient(135deg, #f0f9ff 0%, #ecf0ff 100%);
      border-left: 4px solid #06b6d4;
      padding: 20px;
      border-radius: 8px;
      text-align: right;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
    }
    
    .summary-item label {
      color: #666;
      font-weight: 500;
    }
    
    .summary-item value {
      color: #333;
      font-weight: 600;
    }
    
    .summary-item.total {
      border-top: 2px solid #06b6d4;
      padding-top: 12px;
      margin-top: 12px;
      font-size: 18px;
    }
    
    .summary-item.total value {
      color: #06b6d4;
      font-weight: 700;
    }
    
    .footer {
      padding: 20px 40px;
      background: #f8f8f8;
      border-top: 2px solid #f0f0f0;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
        border-radius: 0;
      }
    }
    
    @media (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
      
      .items-table {
        font-size: 12px;
      }
      
      .items-table th,
      .items-table td {
        padding: 8px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">📦</div>
      <h1>Detalhes do Pedido</h1>
      <p>${type === "financeiro" ? "Nota Fiscal Eletrônica" : "Documento de Produção"}</p>
    </div>
    
    <div class="content">
      <div class="badge-container">
        <div class="badge badge-order">Pedido #${order.id.slice(0, 8)}</div>
        <div class="badge badge-status">${order.status.toUpperCase()}</div>
        <div class="badge badge-type">${type === "financeiro" ? "Financeiro" : "Produção"}</div>
      </div>
      
      <div class="info-grid">
        <div class="info-section">
          <h3>Informações do Cliente</h3>
          <div class="info-item">
            <label>Nome</label>
            <value>${order.customer.name}</value>
          </div>
          <div class="info-item">
            <label>Email</label>
            <value>${order.customer.email}</value>
          </div>
          <div class="info-item">
            <label>Telefone</label>
            <value>${order.customer.phone}</value>
          </div>
        </div>
        
        <div class="info-section">
          <h3>Detalhes do Pedido</h3>
          <div class="info-item">
            <label>Data do Pedido</label>
            <value>${new Date(order.date).toLocaleDateString("pt-BR")}</value>
          </div>
          <div class="info-item">
            <label>Horário</label>
            <value>${new Date(order.date).toLocaleTimeString("pt-BR")}</value>
          </div>
          <div class="info-item">
            <label>Método de Pagamento</label>
            <value>${order.paymentMethod === "pix" ? "🔐 PIX" : "💳 Cartão"}</value>
          </div>
        </div>
      </div>
      
      <div class="items-section">
        <h3>Produtos do Pedido</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              ${type === "financeiro" ? "<th>Preço Unit.</th><th>Subtotal</th>" : ""}
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item, idx) => `
              <tr>
                <td><strong>${idx + 1}. ${item.name}</strong></td>
                <td>${item.category || "Sem categoria"}</td>
                <td>${item.quantity}x</td>
                ${type === "financeiro" ? `
                  <td>${formatCurrency(item.price)}</td>
                  <td><strong>${formatCurrency(item.price * item.quantity)}</strong></td>
                ` : ""}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      
      ${type === "financeiro" ? `
        <div class="summary">
          <div class="summary-item">
            <label>Total de Itens:</label>
            <value>${order.items.length} produto${order.items.length > 1 ? "s" : ""}</value>
          </div>
          <div class="summary-item total">
            <label>VALOR TOTAL:</label>
            <value>${formatCurrency(order.total)}</value>
          </div>
        </div>
      ` : ""}
    </div>
    
    <div class="footer">
      <p>Documento gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
    </div>
  </div>
  
  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
    `;
    return htmlContent;
  };

  // Função para abrir documento em nova aba
  const openOrderDocument = (order: Order, type: "financeiro" | "producao") => {
    const html = generateOrderHTML(order, type);
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    }
    setShowDownloadModal(null);
  };

  // Calcular gasto total
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <Layout>
      <section className="pt-28 pb-20 bg-gradient-to-br from-slate-50 to-white min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-gray-900">Minha Conta</h1>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg sticky top-24">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="font-bold text-gray-900">
                    {customer.name || "Usuário"}
                  </h2>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                  {!customer.name && (
                    <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded">
                      ⚠️ Preencha seu perfil
                    </p>
                  )}
                </div>

                <div className="space-y-2 border-t border-gray-200 pt-6">
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-3 ${
                      activeTab === "orders"
                        ? "bg-cyan-100 text-cyan-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    Meus Pedidos
                  </button>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-3 ${
                      activeTab === "profile"
                        ? "bg-cyan-100 text-cyan-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <User className="w-5 h-5" />
                    Perfil
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {/* Meus Pedidos */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg">
                      <p className="text-sm text-gray-600 mb-1">Total de Pedidos</p>
                      <p className="text-3xl font-bold text-cyan-600">
                        {orders.length}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg">
                      <p className="text-sm text-gray-600 mb-1">Gasto Total</p>
                      <p className="text-3xl font-bold text-cyan-600">
                        {formatCurrency(totalSpent)}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg">
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <p className="text-sm font-bold text-cyan-600">
                        {customer.name ? "✅ Perfil Completo" : "⚠️ Perfil Incompleto"}
                      </p>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center shadow-lg">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Nenhum pedido ainda
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Você ainda não realizou nenhuma compra. Visite nossa loja
                        agora!
                      </p>
                      <Link to="/produtos">
                        <Button className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-8 py-3 rounded-xl">
                          Ir para Loja
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">
                                {order.id}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {new Date(order.date).toLocaleDateString("pt-BR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-cyan-600">
                                  {formatCurrency(order.total)}
                                </p>
                              </div>
                              <span
                                className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusLabel(order.status)}
                              </span>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between text-sm"
                                >
                                  <div className="flex gap-2">
                                    <span className="text-gray-600">
                                      {item.quantity}x
                                    </span>
                                    <span className="text-gray-900 font-semibold">
                                      {item.name}
                                    </span>
                                  </div>
                                  <span className="text-gray-900 font-semibold">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 font-semibold transition-colors">
                              <Eye className="w-4 h-4" />
                              Ver Detalhes
                            </button>
                            <button 
                              onClick={() => setShowDownloadModal(order.id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-green-300 text-green-700 hover:bg-green-50 font-semibold transition-colors">
                              <Download className="w-4 h-4" />
                              Baixar NF-e
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Perfil */}
              {activeTab === "profile" && (
                <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Informações Pessoais
                  </h2>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Nome Completo
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            placeholder="Digite seu nome"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-600 focus:outline-none"
                          />
                        ) : (
                          <div className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 font-semibold">
                            {customer.name || "Não preenchido"}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Email
                        </label>
                        <div className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 font-semibold cursor-not-allowed">
                          {customer.email}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Email não pode ser alterado</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Telefone
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) =>
                              handlePhoneChange(e.target.value)
                            }
                            placeholder="(19) 99691-2323"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-600 focus:outline-none"
                          />
                        ) : (
                          <div className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 font-semibold">
                            {customer.phone || "Não preenchido"}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          CPF
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.cpf}
                            onChange={(e) =>
                              setEditData({ ...editData, cpf: e.target.value })
                            }
                            placeholder="000.000.000-00"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-600 focus:outline-none"
                          />
                        ) : (
                          <div className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 font-semibold">
                            {customer.cpf || "Não preenchido"}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex gap-3">
                        {!isEditing ? (
                          <Button
                            onClick={() => {
                              setIsEditing(true);
                              setEditData(customer);
                            }}
                            className="border-cyan-600 text-cyan-600 hover:bg-cyan-50"
                            variant="outline"
                          >
                            ✏️ Editar Perfil
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={handleSaveProfile}
                              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white"
                            >
                              ✅ Salvar Alterações
                            </Button>
                            <Button
                              onClick={() => {
                                setIsEditing(false);
                                setEditData(customer);
                              }}
                              variant="outline"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              ❌ Cancelar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Download de Documento */}
        {showDownloadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full shadow-2xl">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <span>📄</span> Escolha o Documento
                </h3>
                <p className="text-green-100 text-sm mt-1">Qual documento deseja baixar?</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Opção Nota Fiscal */}
                <button
                  onClick={() => {
                    const order = orders.find(o => o.id === showDownloadModal);
                    if (order) openOrderDocument(order, "financeiro");
                  }}
                  className="w-full p-4 rounded-xl border border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">💰</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-green-700 transition">Nota Fiscal Eletrônica</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Documento completo com todos os valores e impostos.
                      </p>
                    </div>
                    <div className="text-xl text-green-600 opacity-0 group-hover:opacity-100 transition">→</div>
                  </div>
                </button>

                {/* Opção Simples */}
                <button
                  onClick={() => {
                    const order = orders.find(o => o.id === showDownloadModal);
                    if (order) openOrderDocument(order, "producao");
                  }}
                  className="w-full p-4 rounded-xl border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📋</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition">Recibo de Pedido</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Lista simples de produtos e quantidades do pedido.
                      </p>
                    </div>
                    <div className="text-xl text-blue-600 opacity-0 group-hover:opacity-100 transition">→</div>
                  </div>
                </button>

                {/* Botão Cancelar */}
                <button
                  onClick={() => setShowDownloadModal(null)}
                  className="w-full mt-4 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium transition-all duration-300"
                >
                  ❌ Cancelar
                </button>
              </div>

              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-600">
                O documento abrirá em uma nova aba para visualização ou impressão
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
