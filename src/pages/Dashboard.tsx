import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Edit, 
  Trash2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Eye,
  Filter,
  Ticket,
  Copy,
  Check,
  User,
  Plus,
  Zap,
  Download,
  Truck,
  RefreshCw,
  CreditCard,
  History,
  Info,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useProducts } from "@/contexts/ProductContext";
import { useSellers, type Seller } from "@/contexts/SellerContext";
import { ProductForm } from "@/components/ProductForm";
import { CouponForm } from "@/components/CouponForm";
import { SellerForm } from "@/components/SellerForm";
import { SupabaseDiagnostic } from "@/components/SupabaseDiagnostic";
import { SupabaseConnectionAlert } from "@/components/SupabaseConnectionAlert";
import { getSellerForCategory } from "@/data/sellers";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { CATEGORY_LABELS } from "@/data/categories";
import { listOrders, updateOrderStatus as updateOrderInSupabase, deleteOrder as deleteOrderInSupabase, syncOrderWithMercadoPago, listOrderLogs } from "@/lib/orderService";

interface Order {
  id: string;
  date: string;
  items: Array<{ id: string; name: string; quantity: number; price: number; category?: string }>;
  total: number;
  paymentMethod: string;
  status: "pendente" | "aguardando" | "aguardando_pagamento" | "pago" | "confirmado" | "enviado" | "entregue" | "cancelado" | "recusado";
  customer: { name: string; email: string; phone: string; cpf_cnpj?: string };
  cartao_final?: string;
  seller?: string;
  ano_veiculo?: string;
  address?: {
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    city: string;
    estado: string;
    complemento?: string;
  };
  mp_payment_id?: string;
  shippingMethod?: "entrega" | "retirada";
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products" | "coupons" | "sellers" | "categories" | "diagnostico" | "financeiro">("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<{ [key: string]: string }>({});
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };


  const { 
    products, coupons, categories, subcategories, 
    deleteProduct, deleteCoupon, 
    addCategory, deleteCategory, updateCategory,
    addSubcategory, deleteSubcategory, updateSubcategory
  } = useProducts();
  const { sellers, deleteSeller } = useSellers();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await listOrders();
        
        const mappedOrders = data.map((order: any) => ({
          id: String(order.id),
          date: order.data_criacao || new Date().toISOString(),
          customer: {
            name: order.cliente_nome,
            email: order.cliente_email,
            phone: order.cliente_telefone,
            cpf_cnpj: order.cliente_cpf_cnpj
          },
          cartao_final: order.cartao_final,
          items: Array.isArray(order.itens) ? order.itens : [],
          total: order.total,
          subtotal: order.subtotal,
          frete: order.frete,
          desconto: order.desconto,
          paymentMethod: order.metodo_pagamento,
          status: order.status,
          ano_veiculo: order.ano_veiculo,
          shippingMethod: order.tipo_entrega || "entrega",
          mp_payment_id: order.mp_payment_id,
          cpfCnpj: order.cliente_cpf_cnpj,
          address: order.endereco ? {
            cep: order.endereco.cep,
            rua: order.endereco.rua,
            numero: order.endereco.numero,
            bairro: order.endereco.bairro,
            city: order.endereco.cidade,
            estado: order.endereco.estado,
            complemento: order.endereco.complemento
          } : undefined
        }));
        
        setOrders(mappedOrders);

        const statusMap: { [key: string]: string } = {};
        mappedOrders.forEach((order: Order) => {
          statusMap[order.id] = order.status;
        });
        setSelectedOrderStatus(statusMap);
      } catch (err) {
        console.error("Erro ao carregar pedidos do Supabase:", err);
        // Fallback para localStorage opcional se desejar
      }
    };

    // Carregar pedidos na primeira vez
    loadOrders();

    // Listener para detectar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "orders") {
        loadOrders();
      }
    };

    // Listener para mudanças na mesma aba usando custom event
    const handleOrdersUpdate = () => {
      loadOrders();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("ordersUpdated", handleOrdersUpdate);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("ordersUpdated", handleOrdersUpdate);
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
        setSelectedOrderStatus((prev) => ({ ...prev, [orderId]: newStatus }));
        
        const updated = orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as any } : order
        );
        setOrders(updated);
        
        // Atualizar no Supabase
        await updateOrderInSupabase(orderId, newStatus as any);
        toast.success("Status atualizado no banco de dados!");
    } catch (err) {
        console.error("Erro ao atualizar status:", err);
        toast.error("Falha ao sincronizar status com o servidor.");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Tem certeza que deseja deletar este pedido? Esta ação não pode ser desfeita.")) {
      try {
        // Deletar no Supabase
        await deleteOrderInSupabase(orderId);
        
        // Atualizar estado local
        const updated = orders.filter((order) => order.id !== orderId);
        setOrders(updated);
        
        // Limpar do localStorage por garantia (legado)
        const saved = localStorage.getItem("orders");
        if (saved) {
            const parsed = JSON.parse(saved);
            const filtered = parsed.filter((o: any) => String(o.id) !== orderId);
            localStorage.setItem("orders", JSON.stringify(filtered));
        }

        toast.success("Pedido deletado com sucesso!");
        
        // Disparar evento para atualizar gráfico
        window.dispatchEvent(new Event("ordersUpdated"));
      } catch (err: any) {
        console.error("Erro ao deletar pedido:", err);
        toast.error("Erro ao deletar: " + err.message);
      }
    }
  };

  const handleSyncOrder = async (orderId: string, initialMpPaymentId?: string) => {
    setIsSyncing(orderId);
    let mpPaymentId = initialMpPaymentId;

    try {
      if (!mpPaymentId) {
        const logs = await listOrderLogs(orderId);
        if (logs && logs.length > 0 && logs[0].mp_payment_id) {
          mpPaymentId = logs[0].mp_payment_id;
        }
      }

      if (!mpPaymentId) {
        toast.info("Pedido sem pagamento gerado. Marcando como cancelado...");
        await updateOrderInSupabase(orderId, "cancelado");
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "cancelado" as any } : o));
        setSelectedOrderStatus(prev => ({ ...prev, [orderId]: "cancelado" }));
        setIsSyncing(null);
        return;
      }

      const result = await syncOrderWithMercadoPago(orderId, mpPaymentId);
      
      let finalStatus = result.status;
      if (result.mpStatus === 'pending' || result.mpStatus === 'in_process') {
        finalStatus = 'cancelado';
        await updateOrderInSupabase(orderId, "cancelado");
      }

      // Atualizar estado local
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: finalStatus as any } : o
      ));
      setSelectedOrderStatus(prev => ({ ...prev, [orderId]: finalStatus }));
      
      if (finalStatus === 'cancelado') {
        toast.success("Pedido pendente foi marcado como Cancelado.");
      } else {
        toast.success(`Sincronizado! Status MP: ${result.mpStatus} (${result.detail})`);
      }
    } catch (err: any) {
      console.error("Erro ao sincronizar:", err);
      toast.error("Erro ao sincronizar: " + err.message);
    } finally {
      setIsSyncing(null);
    }
  };

  const handleSyncAllOrders = async () => {
    // Busca todos os pedidos que estão em um status pendente, independente de terem mp_payment_id ainda
    const allPendingOrders = orders.filter(o => 
      o.status === "aguardando" || o.status === "aguardando_pagamento" || o.status === "pendente"
    );

    if (allPendingOrders.length === 0) {
      toast.info("Não há pedidos pendentes para sincronizar.");
      return;
    }

    setIsSyncing("all");
    let syncedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    toast.promise(
      (async () => {
        for (const order of allPendingOrders) {
          try {
            let mpId = order.mp_payment_id;

            // Se não tem ID salvo no pedido, tentar buscar do log de pagamentos
            if (!mpId) {
              const logs = await listOrderLogs(order.id);
              if (logs && logs.length > 0 && logs[0].mp_payment_id) {
                mpId = logs[0].mp_payment_id;
              }
            }

            if (mpId) {
              const result = await syncOrderWithMercadoPago(order.id, mpId);
              if (result.mpStatus === 'pending' || result.mpStatus === 'in_process') {
                await updateOrderInSupabase(order.id, "cancelado");
              }
              syncedCount++;
            } else {
              // Se não tem ID, consideramos abandono e cancelamos
              await updateOrderInSupabase(order.id, "cancelado");
              skippedCount++; // Usando skippedCount para contar os cancelados sem ID
            }
          } catch (err) {
            console.error(`Erro ao sincronizar pedido ${order.id}:`, err);
            errorCount++;
          }
        }
        
        // Recarregar todos os pedidos após o loop
        const data = await listOrders();
        setOrders(data.map((order: any) => ({
          id: order.id,
          customer: {
            name: order.cliente_nome,
            email: order.cliente_email,
            phone: order.cliente_telefone,
            cpf_cnpj: order.cliente_cpf_cnpj,
          },
          date: order.data_criacao,
          total: order.total,
          items: order.itens,
          paymentMethod: order.metodo_pagamento,
          status: order.status,
          ano_veiculo: order.ano_veiculo,
          shippingMethod: order.tipo_entrega || "entrega",
          mp_payment_id: order.mp_payment_id,
          address: order.endereco ? {
            cep: order.endereco.cep,
            rua: order.endereco.rua,
            numero: order.endereco.numero,
            bairro: order.endereco.bairro,
            city: order.endereco.cidade,
            estado: order.endereco.estado,
            complemento: order.endereco.complemento
          } : undefined
        })));
        
        setIsSyncing(null);
        if (errorCount > 0) throw new Error(`${errorCount} erros durante a sincronização.`);
        
        return { syncedCount, skippedCount };
      })(),
      {
        loading: 'Sincronizando todos os pedidos pendentes...',
        success: ({ syncedCount, skippedCount }) => {
          if (skippedCount > 0 && syncedCount === 0) {
             return `${skippedCount} pedido(s) sem pagamento foram cancelados.`;
          }
          if (skippedCount > 0) {
             return `${syncedCount} sincronizados. ${skippedCount} sem pgto cancelados.`;
          }
          return `${syncedCount} pedidos processados com sucesso!`;
        },
        error: (err) => `Erro: ${err.message}. ${syncedCount} pedidos foram atualizados.`,
      }
    );
  };

  const [showDownloadModal, setShowDownloadModal] = useState<string | null>(null);

  // Função para gerar HTML formatado do documento
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
      <p>${type === "financeiro" ? "Relatório Financeiro Completo" : "Documento de Produção"}</p>
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
          <div class="info-item">
            <label>Ano do Veículo</label>
            <value>${order.ano_veiculo || "Não informado"}</value>
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

  // Função antiga removida - será substituída por openOrderDocument
  const downloadOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setShowDownloadModal(orderId);
    }
  };

  // Dados para gráficos
  // Função para calcular dados do gráfico dos últimos 6 meses
  const generateChartData = () => {
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const now = new Date();
    const last6Months = [];

    // Gerar array com últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      last6Months.push({
        monthYear,
        name: monthNames[date.getMonth()],
        vendas: 0,
        pedidos: 0,
      });
    }

    // Agrupar pedidos por mês
    orders.forEach((order) => {
      const orderDate = new Date(order.date);
      // Validar se a data é válida
      if (!isNaN(orderDate.getTime())) {
        const orderMonthYear = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
        const monthData = last6Months.find((m) => m.monthYear === orderMonthYear);

        if (monthData) {
          monthData.vendas += order.total;
          monthData.pedidos += 1;
        }
      }
    });

    // Remover propriedade monthYear antes de retornar
    return last6Months.map(({ monthYear, ...rest }) => rest);
  };

  const chartData = generateChartData();

  // Calcular estatísticas
  const stats = {
    totalOrders: orders.length,
    totalSales: orders.filter(o => o.status === "pago" || o.status === "confirmado" || o.status === "enviado" || o.status === "entregue").reduce((sum, order) => sum + order.total, 0),
    totalPotential: orders.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter((o) => o.status === "pendente" || o.status === "aguardando" || o.status === "aguardando_pagamento").length,
    paidOrders: orders.filter((o) => o.status === "pago" || o.status === "confirmado").length,
    shippedOrders: orders.filter((o) => o.status === "enviado").length,
    deliveredOrders: orders.filter((o) => o.status === "entregue").length,
  };

  const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
    <div className={`bg-gradient-to-br ${color} text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4" />
            {trend}
          </div>
        )}
      </div>
      <p className="text-white/80 text-sm font-medium mb-2">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: { [key: string]: { bg: string; text: string; label: string; icon: any } } = {
      pendente: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pendente", icon: <Clock className="w-4 h-4" /> },
      aguardando: { bg: "bg-amber-100", text: "text-amber-800", label: "Aguardando Pagamento", icon: <Clock className="w-4 h-4" /> },
      aguardando_pagamento: { bg: "bg-amber-100", text: "text-amber-800", label: "Aguardando Pagamento", icon: <Clock className="w-4 h-4" /> },
      pago: { bg: "bg-green-100", text: "text-green-800", label: "Pagamento Aprovado", icon: <CheckCircle2 className="w-4 h-4" /> },
      confirmado: { bg: "bg-blue-100", text: "text-blue-800", label: "Em Produção", icon: <Package className="w-4 h-4" /> },
      enviado: { bg: "bg-purple-100", text: "text-purple-800", label: "Enviado", icon: <Truck className="w-4 h-4" /> },
      entregue: { bg: "bg-green-100", text: "text-green-800", label: "Entregue", icon: <CheckCircle2 className="w-4 h-4" /> },
      cancelado: { bg: "bg-red-100", text: "text-red-800", label: "Cancelado", icon: <AlertCircle className="w-4 h-4" /> },
      recusado: { bg: "bg-rose-100", text: "text-rose-800", label: "Pagamento Recusado", icon: <AlertCircle className="w-4 h-4" /> },
    };

    const color = colors[status] || colors.pendente;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${color.bg} ${color.text}`}>
        {color.icon}
        {color.label}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-sans text-slate-200">
      <SupabaseConnectionAlert />

      {/* Sidebar Navigation */}
      <div className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col flex-shrink-0 z-40 shadow-2xl">
        <div className="p-6 flex items-center gap-4 border-b border-slate-800 bg-slate-900/50">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden shadow-inner flex-shrink-0">
            <img src="/mascote automatiza.png" alt="Mascote" className="w-full h-full object-cover scale-125 transform" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-xl font-black text-white truncate">Dashboard</h1>
            <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider truncate">Admin Panel</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Menu Principal</p>
          {[
            { id: "overview", label: "Visão Geral", icon: BarChart3 },
            { id: "orders", label: "Pedidos", icon: ShoppingCart },
            { id: "products", label: "Produtos", icon: Package },
            { id: "categories", label: "Categorias", icon: Filter }, 
            { id: "coupons", label: "Cupons", icon: Ticket },
            { id: "sellers", label: "Vendedores", icon: Users },
            { id: "financeiro", label: "Financeiro", icon: DollarSign },
            { id: "diagnostico", label: "Diagnóstico", icon: Zap },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === id
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-5 h-5 ${activeTab === id ? "text-white" : "text-slate-500"}`} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <Link to="/" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all duration-300 font-medium border border-slate-700">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Loja
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-900 custom-scrollbar relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-slate-900 to-blue-900/10 pointer-events-none" />
        <div className="p-8 max-w-7xl mx-auto relative z-10">

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={ShoppingCart}
                label="Total de Pedidos"
                value={stats.totalOrders}
                color="from-blue-600 to-green-600"
                trend="+12%"
              />
              <StatCard
                icon={DollarSign}
                label="Vendas Totais"
                value={formatCurrency(stats.totalSales)}
                color="from-green-600 to-emerald-600"
                trend="+8%"
              />
              <StatCard
                icon={Clock}
                label="Pedidos Pendentes"
                value={stats.pendingOrders}
                color="from-yellow-600 to-orange-600"
                trend={stats.pendingOrders}
              />
              <StatCard
                icon={CheckCircle2}
                label="Entregues"
                value={stats.deliveredOrders}
                color="from-purple-600 to-pink-600"
                trend="+15%"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Line Chart */}
              <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white text-xl font-bold">Vendas Últimos 6 Meses</h3>
                  <button className="p-2 hover:bg-white/20 rounded-lg transition-all">
                    <Filter className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.5rem" }} />
                    <Legend />
                    <Line type="monotone" dataKey="vendas" stroke="#06b6d4" strokeWidth={3} dot={{ fill: "#06b6d4", r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Info Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-white text-lg font-bold mb-4">Resumo</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-gray-300">Ticket Médio</span>
                      <span className="text-white font-bold text-lg">{formatCurrency(stats.totalSales / (stats.totalOrders || 1))}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-gray-300">Taxa de Entrega</span>
                      <span className="text-green-400 font-bold text-lg">{stats.totalOrders > 0 ? ((stats.deliveredOrders / stats.totalOrders) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-gray-300">Clientes Ativos</span>
                      <span className="text-yellow-400 font-bold text-lg">{new Set(orders.map(o => o.customer.email)).size}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-xl font-bold flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  Últimos Pedidos
                </h3>
                <button 
                  onClick={() => setActiveTab("orders")}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ver Todos
                </button>
              </div>
              
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-400 text-lg">Nenhum pedido ainda</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-4 text-gray-300 font-semibold">ID</th>
                        <th className="text-left px-4 py-4 text-gray-300 font-semibold">Cliente</th>
                        <th className="text-left px-4 py-4 text-gray-300 font-semibold">Data</th>
                        <th className="text-left px-4 py-4 text-gray-300 font-semibold">Total</th>
                        <th className="text-left px-4 py-4 text-gray-300 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-4 text-yellow-400 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                          <td className="px-4 py-4 text-white">{order.customer.name}</td>
                          <td className="px-4 py-4 text-gray-400">{new Date(order.date).toLocaleDateString("pt-BR")}</td>
                          <td className="px-4 py-4 text-green-400 font-bold">{formatCurrency(order.total)}</td>
                          <td className="px-4 py-4"><StatusBadge status={order.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Header com Filtros e Ações em Lote */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-3">
                    <ShoppingCart className="w-8 h-8 text-green-400" />
                    Gerenciamento de Pedidos
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Total de {orders.length} pedidos encontrados</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Buscar por ID ou nome..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-green-500/50 outline-none transition-all"
                    />
                  </div>
                  
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-2.5 outline-none focus:border-green-500/50 transition-all cursor-pointer"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="pendente">Pendentes</option>
                    <option value="pago">Pagos</option>
                    <option value="confirmado">Em Produção</option>
                    <option value="enviado">Enviados</option>
                    <option value="entregue">Entregues</option>
                    <option value="cancelado">Cancelados</option>
                  </select>

                  <button
                    onClick={handleSyncAllOrders}
                    disabled={isSyncing === "all"}
                    className={`flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 ${isSyncing === "all" ? "animate-pulse" : ""}`}
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing === "all" ? "animate-spin" : ""}`} />
                    Sync Pendentes
                  </button>
                </div>
              </div>
            </div>

            {/* Listagem de Pedidos */}
            <div className="space-y-4">
              {orders
                .filter(order => {
                  const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                     order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = statusFilter === "todos" || order.status === statusFilter;
                  return matchesSearch && matchesStatus;
                })
                .length === 0 ? (
                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-20 text-center border border-white/10">
                    <ShoppingCart className="w-20 h-20 text-gray-600 mx-auto mb-6 opacity-30" />
                    <h3 className="text-xl font-bold text-gray-400">Nenhum pedido encontrado</h3>
                    <p className="text-gray-500 mt-2">Tente ajustar seus filtros ou busca</p>
                  </div>
                ) : (
                  orders
                    .filter(order => {
                      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesStatus = statusFilter === "todos" || order.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((order) => (
                      <div 
                        key={order.id}
                        className={`group bg-white/5 backdrop-blur-xl rounded-2xl border transition-all duration-300 overflow-hidden ${
                          expandedOrders.has(order.id) 
                            ? "border-green-500/50 shadow-2xl shadow-green-500/5" 
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        {/* Linha Resumo (Sempre Visível) */}
                        <div 
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="flex flex-col lg:flex-row lg:items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              expandedOrders.has(order.id) ? "bg-green-500 text-slate-900" : "bg-white/10 text-gray-400"
                            }`}>
                              <Package className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-bold text-lg">#{order.id.slice(0, 8)}</span>
                                {order.ano_veiculo && (
                                  <span className="text-[10px] font-black px-2 py-0.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-full uppercase">
                                    {order.ano_veiculo}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm font-medium">{order.customer.name}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 lg:mx-12">
                            <div>
                              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">DATA</p>
                              <p className="text-gray-300 text-sm font-semibold">{new Date(order.date).toLocaleDateString("pt-BR")}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">TOTAL</p>
                              <p className="text-green-400 text-sm font-black">{formatCurrency(order.total)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">PAGAMENTO</p>
                              <p className="text-gray-300 text-sm font-semibold uppercase">{order.paymentMethod}</p>
                            </div>
                            <div className="flex items-center">
                              <StatusBadge status={selectedOrderStatus[order.id] || order.status} />
                            </div>
                          </div>

                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleSyncOrder(order.id, order.mp_payment_id)}
                              disabled={isSyncing === order.id}
                              className={`p-2.5 rounded-xl border border-white/10 hover:bg-green-500/20 hover:border-green-500/30 text-green-400 transition-all ${isSyncing === order.id ? 'opacity-50' : ''}`}
                              title="Sincronizar MP"
                            >
                              <RefreshCw className={`w-4 h-4 ${isSyncing === order.id ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                              onClick={() => downloadOrder(order.id)}
                              className="p-2.5 rounded-xl border border-white/10 hover:bg-blue-500/20 hover:border-blue-500/30 text-blue-400 transition-all"
                              title="Imprimir"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-2.5 rounded-xl border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-red-400 transition-all"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className={`ml-2 p-1 rounded-full transition-transform duration-300 ${expandedOrders.has(order.id) ? "rotate-180 text-green-400" : "text-gray-600"}`}>
                              <ArrowRight className="w-5 h-5 rotate-90" />
                            </div>
                          </div>
                        </div>

                        {/* Detalhes Expandidos */}
                        {expandedOrders.has(order.id) && (
                          <div className="px-5 pb-6 border-t border-white/5 bg-white/[0.02] animate-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
                              {/* Coluna 1: Itens */}
                              <div className="xl:col-span-2 space-y-4">
                                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                  <Package className="w-4 h-4" /> Itens do Pedido
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {order.items.map((item, idx) => {
                                    const seller = getSellerForCategory(item.category || "");
                                    return (
                                      <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-start justify-between group/item hover:border-white/20 transition-all">
                                        <div>
                                          <p className="text-white font-bold text-sm">{item.name}</p>
                                          <p className="text-gray-500 text-xs mt-1">{item.quantity}x {formatCurrency(item.price)}</p>
                                          {seller && (
                                            <div className="mt-3 flex items-center gap-2">
                                              <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-bold">
                                                {seller.avatar.charAt(0)}
                                              </div>
                                              <span className="text-[10px] text-purple-300 font-semibold">{seller.name}</span>
                                            </div>
                                          )}
                                        </div>
                                        <p className="text-green-400 font-bold text-sm">{formatCurrency(item.price * item.quantity)}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                                
                                {/* Status Change em Detalhes */}
                                <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                  <span className="text-gray-400 text-xs font-bold whitespace-nowrap">ALTERAR STATUS:</span>
                                  <div className="flex flex-wrap gap-2">
                                    {['pendente', 'pago', 'confirmado', 'enviado', 'entregue', 'cancelado'].map((status) => (
                                      <button
                                        key={status}
                                        onClick={() => handleStatusChange(order.id, status)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                          (selectedOrderStatus[order.id] || order.status) === status
                                            ? "bg-green-500 text-slate-900"
                                            : "bg-white/10 text-gray-400 hover:bg-white/20"
                                        }`}
                                      >
                                        {status}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Coluna 2: Informações do Cliente e Entrega */}
                              <div className="space-y-6">
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Cliente
                                  </h4>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-gray-500 text-[10px] uppercase font-bold">Nome Completo</p>
                                      <p className="text-white text-sm font-semibold">{order.customer.name}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-[10px] uppercase font-bold">E-mail</p>
                                      <p className="text-white text-sm font-semibold truncate">{order.customer.email}</p>
                                    </div>
                                    <div className="flex justify-between">
                                      <div>
                                        <p className="text-gray-500 text-[10px] uppercase font-bold">Telefone</p>
                                        <p className="text-white text-sm font-semibold">{order.customer.phone}</p>
                                      </div>
                                      {order.customer.cpf_cnpj && (
                                        <div>
                                          <p className="text-gray-500 text-[10px] uppercase font-bold">CPF/CNPJ</p>
                                          <p className="text-white text-sm font-semibold">{order.customer.cpf_cnpj}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Truck className="w-4 h-4" /> Logística
                                  </h4>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-gray-500 text-[10px] uppercase font-bold">Método</p>
                                      <p className="text-yellow-400 text-sm font-bold flex items-center gap-2">
                                        {order.shippingMethod === "retirada" ? "🏪 RETIRADA NO LOCAL" : "🚚 ENTREGA TRANSPORTADORA"}
                                      </p>
                                    </div>
                                    {order.address && (
                                      <div>
                                        <p className="text-gray-500 text-[10px] uppercase font-bold">Endereço de Entrega</p>
                                        <p className="text-white text-xs font-medium leading-relaxed mt-1">
                                          {order.address.rua}, {order.address.numero}<br/>
                                          {order.address.bairro} - {order.address.city}/{order.address.estado}<br/>
                                          CEP: {order.address.cep}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                )}
            </div>
          </div>
        )}
        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Package className="w-6 h-6" />
                Gerenciar Produtos ({products.length})
              </h2>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                + Novo Produto
              </Button>
            </div>

            {products.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/10 shadow-lg">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">Nenhum produto cadastrado</h3>
                <p className="text-gray-400 mb-6">Comece criando seu primeiro produto</p>
                <Button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductForm(true);
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  + Criar Produto
                </Button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-4 text-gray-300 font-semibold">Nome</th>
                      <th className="text-left px-4 py-4 text-gray-300 font-semibold">Categoria</th>
                      <th className="text-left px-4 py-4 text-gray-300 font-semibold">Preço</th>
                      <th className="text-left px-4 py-4 text-gray-300 font-semibold">Estoque</th>
                      <th className="text-left px-4 py-4 text-gray-300 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-4 text-white font-semibold max-w-xs truncate">
                          {product.name}
                        </td>
                        <td className="px-4 py-4 text-gray-400">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white">
                              {CATEGORY_LABELS[product.category] || product.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {product.subcategory}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-bold text-green-400">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              product.stock > 0
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {product.stock} unidades
                          </span>
                        </td>
                        <td className="px-4 py-4 flex gap-2">
                          <button
                            onClick={() => {
                              const { id, createdAt, sku, ...rest } = (product as any);
                              setEditingProduct({
                                ...rest,
                                name: `${product.name} (Cópia)`,
                                status: "ativo",
                              } as any);
                              setShowProductForm(true);
                            }}
                            className="p-2 hover:bg-purple-500/20 rounded-lg transition-all border border-white/10 hover:border-purple-500/30"
                            title="Duplicar produto"
                          >
                            <Copy className="w-5 h-5 text-purple-400" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(product as any);
                              setShowProductForm(true);
                            }}
                            className="p-2 hover:bg-green-500/20 rounded-lg transition-all border border-white/10 hover:border-green-500/30"
                          >
                            <Edit className="w-5 h-5 text-yellow-400" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-all border border-white/10 hover:border-red-500/30"
                          >
                            <Trash2 className="w-5 h-5 text-red-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Sellers Tab */}
        {activeTab === "sellers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6" />
                Gerenciar Vendedores ({sellers.length})
              </h2>
              <Button
                onClick={() => {
                  setEditingSeller(null);
                  setShowSellerForm(true);
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Vendedor
              </Button>
            </div>

            {sellers.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/10 shadow-lg">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Nenhum vendedor cadastrado
                </h3>
                <p className="text-gray-400 mb-6">Crie vendedores para gerenciar suas categorias de produtos</p>
                <Button
                  onClick={() => {
                    setEditingSeller(null);
                    setShowSellerForm(true);
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Criar Vendedor
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sellers.map((seller) => {
                  // Calcular vendas por vendedor (por ITEM)
                  let sellerItemsCount = 0;
                  let sellerSales = 0;
                  let ordersWithSeller = new Set<string>();

                  orders.forEach((order) => {
                    order.items.forEach((item) => {
                      const itemSeller = getSellerForCategory(item.category || "");
                      if (itemSeller?.id === seller.id) {
                        sellerItemsCount++;
                        sellerSales += item.price * item.quantity;
                        ordersWithSeller.add(order.id);
                      }
                    });
                  });

                  const sellerOrdersCount = ordersWithSeller.size;
                  const commission = (sellerSales * seller.commissionRate) / 100;

                  return (
                    <div
                      key={seller.id}
                      className="group bg-gradient-to-br from-white/15 via-white/5 to-white/10 backdrop-blur-xl rounded-3xl border-2 border-white/10 hover:border-purple-500/40 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-[1.02]"
                    >
                      {/* Header */}
                      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-slate-800/40 to-transparent flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/40 to-pink-500/40 flex items-center justify-center border-2 border-purple-500/40 backdrop-blur-sm font-bold text-white text-xl">
                            {seller.avatar}
                          </div>
                          <div>
                            <h3 className="font-black text-white text-lg">{seller.name}</h3>
                            <p className="text-gray-400 text-sm">{seller.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingSeller(seller);
                              setShowSellerForm(true);
                            }}
                            className="p-2 hover:bg-blue-500/20 rounded-lg transition-all text-blue-400 hover:text-blue-300"
                            title="Editar vendedor"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja deletar ${seller.name}?`)) {
                                deleteSeller(seller.id);
                              }
                            }}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-400 hover:text-red-300"
                            title="Deletar vendedor"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Conteúdo */}
                      <div className="p-6 space-y-5">
                        {/* Categorias */}
                        <div>
                          <p className="text-gray-400 text-xs font-bold uppercase mb-3">Categorias</p>
                          <div className="flex flex-wrap gap-2">
                            {seller.categories.map((category, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Estatísticas */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                            <p className="text-gray-500 text-xs font-bold mb-1">Pedidos</p>
                            <p className="text-white font-black text-xl">{sellerOrdersCount}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                            <p className="text-gray-500 text-xs font-bold mb-1">Itens</p>
                            <p className="text-yellow-400 font-black text-lg">{sellerItemsCount}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                            <p className="text-gray-500 text-xs font-bold mb-1">Vendas</p>
                            <p className="text-green-400 font-black text-lg">{formatCurrency(sellerSales)}</p>
                          </div>
                        </div>

                        {/* Contato e Comissão */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <p className="text-gray-400 text-xs font-bold uppercase mb-3">Contato</p>
                          <p className="text-white text-sm font-semibold mb-3">{seller.phone}</p>
                          <div className="pt-3 border-t border-white/10 space-y-2">
                            <p className="text-gray-500 text-xs font-bold uppercase">Comissão</p>
                            <p className="text-yellow-400 font-black text-lg">{seller.commissionRate}%</p>
                            <p className="text-white/70 text-sm">A receber: <span className="text-yellow-300 font-black">{formatCurrency(commission)}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                  <Filter className="w-8 h-8 text-cyan-400" />
                  Categorias e Subcategorias
                </h2>
                <p className="text-slate-400 mt-2">Gerencie a árvore de categorias da sua loja.</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    const name = prompt("Nome da Categoria (Ex: 🏆 Kit Completo)");
                    const key = prompt("Chave/ID da Categoria (Ex: completo)");
                    if (name && key) {
                      addCategory({ name, key });
                    }
                  }}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-900/50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Categoria Pai
                </Button>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="p-6">
                <div className="space-y-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
                      <div className="p-4 flex flex-wrap items-center justify-between gap-4 bg-slate-800/20">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-cyan-900/30 rounded-lg flex items-center justify-center border border-cyan-500/20 text-cyan-400 font-bold">
                            {cat.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                            <p className="text-slate-500 text-xs font-mono">key: {cat.key}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const name = prompt(`Nova Subcategoria para ${cat.name}:`);
                              if (name) {
                                addSubcategory({ name, categoryId: cat.id });
                              }
                            }}
                            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                          >
                            + Subcategoria
                          </Button>
                          <button 
                            onClick={() => deleteCategory(cat.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                            title="Deletar Categoria Pai"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Subcategorias Relacionadas */}
                      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
                        {subcategories.filter(s => s.categoryId === cat.id).length === 0 ? (
                          <p className="text-slate-500 text-sm italic">Nenhuma subcategoria vinculada.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {subcategories.filter(s => s.categoryId === cat.id).map(sub => (
                              <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                                <span className="text-slate-300 text-sm font-medium">{sub.name}</span>
                                <button 
                                  onClick={() => deleteSubcategory(sub.id)}
                                  className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 flex gap-3 items-start">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="text-cyan-300 text-sm">
                <strong>Dica:</strong> As categorias e subcategorias são usadas dinamicamente para gerar o menu de filtros da loja. Use nomes curtos e amigáveis (Ex: "Kit Completo").
              </p>
            </div>
          </div>
        )}

        {/* Financeiro Tab */}
        {activeTab === "financeiro" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-white flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-400" />
                Relatório Financeiro
              </h2>
              <div className="flex gap-3">
                <Button variant="outline" className="border-white/10 text-white bg-white/5">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </div>

            {/* Stats Grid Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-3xl p-8 border border-green-500/30 backdrop-blur-xl">
                <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-2">Faturamento Aprovado</p>
                <p className="text-4xl font-black text-white">{formatCurrency(stats.totalSales)}</p>
                <div className="mt-4 flex items-center gap-2 text-green-400 text-sm font-bold">
                  <TrendingUp className="w-4 h-4" />
                  +12.5% vs mês passado
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-3xl p-8 border border-yellow-500/30 backdrop-blur-xl">
                <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2">Potencial de Vendas (Pendente)</p>
                <p className="text-4xl font-black text-white">{formatCurrency(stats.totalPotential - stats.totalSales)}</p>
                <p className="mt-4 text-yellow-500/70 text-sm font-medium">
                  {stats.pendingOrders} pedidos aguardando pagamento
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-3xl p-8 border border-blue-500/30 backdrop-blur-xl">
                <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-2">Ticket Médio</p>
                <p className="text-4xl font-black text-white">
                  {formatCurrency(stats.totalSales / (orders.filter(o => o.status === 'pago').length || 1))}
                </p>
                <p className="mt-4 text-blue-500/70 text-sm font-medium">Baseado em pedidos pagos</p>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                <h3 className="text-white font-bold text-xl mb-6">Conversão de Pagamentos</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">PIX</span>
                      <span className="text-white font-bold">
                        {orders.filter(o => o.paymentMethod === 'pix' && o.status === 'pago').length} de {orders.filter(o => o.paymentMethod === 'pix').length}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-1000" 
                        style={{ width: `${(orders.filter(o => o.paymentMethod === 'pix' && o.status === 'pago').length / (orders.filter(o => o.paymentMethod === 'pix').length || 1)) * 100}%` }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Cartão de Crédito</span>
                      <span className="text-white font-bold">
                        {orders.filter(o => o.paymentMethod === 'cartao' && o.status === 'pago').length} de {orders.filter(o => o.paymentMethod === 'cartao').length}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-1000" 
                        style={{ width: `${(orders.filter(o => o.paymentMethod === 'cartao' && o.status === 'pago').length / (orders.filter(o => o.paymentMethod === 'cartao').length || 1)) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                  <h4 className="text-green-400 font-bold mb-2">💡 Dica Estratégica</h4>
                  <p className="text-green-300/80 text-sm">
                    Pedidos PIX pendentes costumam ser pagos em até 24h. Use o botão <strong>Sincronizar MP</strong> para atualizar o status instantaneamente se o cliente confirmar o pagamento.
                  </p>
                </div>
              </div>

              {/* Tabela de Receita por Categoria */}
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                <h3 className="text-white font-bold text-xl mb-6">Receita por Categoria</h3>
                <div className="space-y-4">
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                    const totalCat = orders
                      .filter(o => o.status === 'pago')
                      .reduce((sum, o) => {
                        const itemTotal = o.items
                          .filter(i => i.category === key)
                          .reduce((iSum, i) => iSum + (i.price * i.quantity), 0);
                        return sum + itemTotal;
                      }, 0);
                    
                    if (totalCat === 0) return null;

                    return (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-gray-300 font-medium">{label}</span>
                        <span className="text-white font-black">{formatCurrency(totalCat)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagnostic Tab */}
        {activeTab === "diagnostico" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Diagnóstico do Sistema</h2>
            </div>

            <SupabaseDiagnostic />

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 space-y-3">
              <h3 className="text-white font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                Informações Importantes
              </h3>
              <ul className="text-blue-300 text-sm space-y-2 list-disc list-inside">
                <li>As tabelas do Supabase precisam ser criadas antes de salvar dados</li>
                <li>Use o arquivo <code className="bg-black/30 px-1 rounded">SUPABASE_SETUP.sql</code> para criar as tabelas</li>
                <li>Você precisa estar logado para salvar produtos</li>
                <li>Os produtos são salvos com seu ID de usuário para segurança</li>
                <li>O localStorage funciona como backup se o Supabase não estiver disponível</li>
              </ul>
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Ticket className="w-6 h-6" />
                Gerenciar Cupons ({coupons.length})
              </h2>
              <Button
                onClick={() => {
                  setEditingCoupon(null);
                  setShowCouponForm(true);
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                + Novo Cupom
              </Button>
            </div>

            {coupons.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/10 shadow-lg">
                <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Nenhum cupom cadastrado
                </h3>
                <p className="text-gray-400 mb-6">Crie cupons de desconto para seus clientes</p>
                <Button
                  onClick={() => {
                    setEditingCoupon(null);
                    setShowCouponForm(true);
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  + Criar Cupom
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <code className="text-2xl font-bold text-yellow-400 font-mono">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(coupon.code);
                              setCopiedCoupon(coupon.id);
                              setTimeout(() => setCopiedCoupon(null), 2000);
                            }}
                            className="p-2 hover:bg-green-500/20 rounded-lg transition-all"
                          >
                            {copiedCoupon === coupon.id ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <p className="text-gray-300 mb-3">{coupon.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Desconto</p>
                            <p className="text-green-400 font-bold">
                              {coupon.discountType === "percentage"
                                ? `${coupon.discountValue}%`
                                : `R$ ${coupon.discountValue.toFixed(2)}`}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Uso</p>
                            <p className="text-white font-bold">
                              {coupon.currentUses} / {coupon.maxUses}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Expira em</p>
                            <p className="text-white font-bold">
                              {new Date(coupon.expiryDate).toLocaleDateString(
                                "pt-BR"
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Status</p>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                coupon.active
                                  ? "bg-green-500/20 text-green-300"
                                  : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {coupon.active ? "✓ Ativo" : "✗ Inativo"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCoupon(coupon as any);
                            setShowCouponForm(true);
                          }}
                          className="p-2 hover:bg-green-500/20 rounded-lg transition-all border border-white/10 hover:border-green-500/30"
                        >
                          <Edit className="w-5 h-5 text-yellow-400" />
                        </button>
                        <button
                          onClick={() => deleteCoupon(coupon.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-all border border-white/10 hover:border-red-500/30"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {showCouponForm && (
        <CouponForm
          coupon={editingCoupon}
          onClose={() => {
            setShowCouponForm(false);
            setEditingCoupon(null);
          }}
        />
      )}

      {showSellerForm && (
        <SellerForm
          seller={editingSeller}
          onClose={() => {
            setShowSellerForm(false);
            setEditingSeller(null);
          }}
        />
      )}

      {/* Modal de Seleção de Tipo de Documento */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <span>📄</span> Escolha o Tipo de Documento
              </h3>
              <p className="text-green-100 text-sm mt-1">Qual documento deseja gerar?</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Opção Financeira */}
              <button
                onClick={() => {
                  const order = orders.find(o => o.id === showDownloadModal);
                  if (order) openOrderDocument(order, "financeiro");
                }}
                className="w-full p-4 rounded-xl border border-white/20 hover:border-yellow-400/50 hover:bg-green-500/10 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">💰</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white group-hover:text-cyan-300 transition">Documento Financeiro</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      Relatório completo com preços, subtotais e total do pedido. Para setor financeiro.
                    </p>
                  </div>
                  <div className="text-xl text-yellow-400 opacity-0 group-hover:opacity-100 transition">→</div>
                </div>
              </button>

              {/* Opção de Produção */}
              <button
                onClick={() => {
                  const order = orders.find(o => o.id === showDownloadModal);
                  if (order) openOrderDocument(order, "producao");
                }}
                className="w-full p-4 rounded-xl border border-white/20 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">⚙️</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white group-hover:text-blue-300 transition">Documento de Produção</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      Apenas nomes dos produtos e quantidades. Para equipe de produção.
                    </p>
                  </div>
                  <div className="text-xl text-blue-400 opacity-0 group-hover:opacity-100 transition">→</div>
                </div>
              </button>

              {/* Botão Cancelar */}
              <button
                onClick={() => setShowDownloadModal(null)}
                className="w-full mt-4 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 border border-white/10"
              >
                ❌ Cancelar
              </button>
            </div>

            <div className="px-6 py-3 bg-black/20 border-t border-white/10 text-center text-xs text-slate-400">
              O documento abrirá em uma nova aba para visualização ou impressão em PDF
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Dashboard;
