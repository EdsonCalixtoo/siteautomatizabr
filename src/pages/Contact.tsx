import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Headphones } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

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

    setFormData({ ...formData, phone: formattedPhone });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Olá! Meu nome é ${formData.name}.%0A%0A${formData.message}%0A%0AContato: ${formData.phone}%0AEmail: ${formData.email}`;
    window.open(`https://wa.me/5519989429972?text=${message}`, "_blank");
  };

  return (
    <Layout>
      {/* Header */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-cyan-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900">
              Entre em Contato
            </h1>
            <p className="text-xl text-gray-600">
              Estamos prontos para atender você e tirar todas as suas dúvidas
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
                  Canais de Atendimento
                </h2>
                <p className="text-gray-600">
                  Entre em contato através de um dos nossos canais de atendimento. 
                  Teremos prazer em ajudá-lo!
                </p>
              </div>

              <div className="space-y-4">
                <a 
                  href="https://wa.me/5519989429972" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-primary/20"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-600/50">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-lg">WhatsApp</h3>
                    <p className="text-primary font-semibold">(19) 98942-9972</p>
                    <p className="text-muted-foreground text-sm mt-1">Resposta rápida</p>
                  </div>
                </a>

                <a 
                  href="tel:+5519989429972"
                  className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-primary/20"
                >
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-lg">Telefone</h3>
                    <p className="text-primary font-semibold">(19) 98942-9972</p>
                    <p className="text-muted-foreground text-sm mt-1">Ligue agora</p>
                  </div>
                </a>

                <a 
                  href="mailto:contato@grupoautomatiza.com.br"
                  className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-primary/20"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-lg">E-mail</h3>
                    <p className="text-primary font-semibold">contato@grupoautomatiza.com.br</p>
                    <p className="text-muted-foreground text-sm mt-1">Respondemos em até 24h</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-card border border-border">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-lg">Localização</h3>
                    <p className="text-muted-foreground">Campinas - SP, Brasil</p>
                    <p className="text-muted-foreground text-sm mt-1">Atendemos todo o Brasil</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-card border border-border">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-lg">Horário de Atendimento</h3>
                    <p className="text-muted-foreground">Segunda a Sexta: 8h às 18h</p>
                    <p className="text-muted-foreground">Sábado: 8h às 12h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Envie uma Mensagem
              </h2>
              <p className="text-muted-foreground mb-6">
                Preencha o formulário e entraremos em contato
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="(19) 99691-2323"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mensagem
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Descreva como podemos ajudá-lo..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" variant="hero" size="xl" className="w-full group">
                  Enviar via WhatsApp
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Ao enviar, você será redirecionado para o WhatsApp
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
