import { Layout } from "@/components/layout/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 mt-20">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8 text-center">
            Política de Privacidade da Grupo Automatizza
          </h1>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Bem-vindo à Grupo Automatizza, inscrita no CNPJ 13.559.664/0001-37, com sede na Rua Doutor Elton Cesar, 910 - Chacaras Campos dos Amarais - Campinas - SP. Nosso compromisso é com a integridade e a segurança dos dados pessoais dos nossos usuários e clientes. Esta Política de Privacidade aplica-se a todas as interações digitais realizadas em nosso site <a href="https://grupoautomatiza.com.br/" className="text-blue-600 hover:underline">https://grupoautomatiza.com.br/</a>, serviços associados, aplicativos móveis e outras plataformas digitais sob nosso controle.
            </p>

            <p>
              Ao acessar e utilizar nossas plataformas, você reconhece e concorda com as práticas descritas nesta política. Nós tratamos a proteção de seus dados pessoais com a máxima seriedade e nos comprometemos a processá-los de forma responsável, transparente e segura.
            </p>

            <h2 className="text-2xl font-heading font-bold text-gray-900 mt-10 mb-4">Definições</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>“Dados Pessoais”</strong> são informações que identificam ou podem identificar uma pessoa natural.</li>
              <li><strong>“Dados Pessoais Sensíveis”</strong> são informações que revelam características pessoais íntimas, como origem racial, convicções religiosas, opiniões políticas, dados genéticos ou biométricos.</li>
              <li><strong>“Tratamento de Dados Pessoais”</strong> abrange qualquer operação com Dados Pessoais, como coleta, registro, armazenamento, uso, compartilhamento ou destruição.</li>
              <li><strong>“Leis de Proteção de Dados”</strong> são todas as leis que regulamentam o Tratamento de Dados Pessoais, incluindo a LGPD (Lei Geral de Proteção de Dados Pessoais, Lei nº 13.709/18).</li>
            </ul>

            <h2 className="text-2xl font-heading font-bold text-gray-900 mt-10 mb-4">Dados Coletados e Motivos da Coleta</h2>
            <p>Nós coletamos e processamos os seguintes tipos de dados pessoais:</p>
            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>Informações Fornecidas por Você:</strong> Isso inclui, mas não se limita a, nome, sobrenome, endereço de e-mail, endereço físico, informações de pagamento e quaisquer outras informações que você optar por fornecer ao criar uma conta, fazer uma compra ou interagir com nossos serviços de atendimento ao cliente.
              </li>
              <li>
                <strong>Informações Coletadas Automaticamente:</strong> Quando você visita nosso site, coletamos automaticamente informações sobre seu dispositivo e sua interação com nosso site. Isso pode incluir dados como seu endereço IP, tipo de navegador, detalhes do dispositivo, fuso horário, páginas visitadas, produtos visualizados, sites ou termos de busca que o direcionaram ao nosso site, e informações sobre como você interage com nosso site.
              </li>
            </ul>

            <h2 className="text-2xl font-heading font-bold text-gray-900 mt-10 mb-4">Uso de Cookies e Tecnologias de Rastreamento</h2>
            <p>
              A Grupo Automatizza utiliza cookies, que são pequenos arquivos de texto armazenados no seu dispositivo, e outras tecnologias de rastreamento para melhorar a experiência do usuário em nosso site <a href="https://grupoautomatiza.com.br/" className="text-blue-600 hover:underline">https://grupoautomatiza.com.br/</a>, entender como nossos serviços são utilizados e otimizar nossas estratégias de marketing.
            </p>

            <h3 className="text-xl font-heading font-bold text-gray-900 mt-8 mb-4">Tipos de Cookies Utilizados:</h3>
            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>Cookies Essenciais:</strong> Essenciais para o funcionamento do site, permitindo que você navegue e use suas funcionalidades. Sem esses cookies, serviços como carrinho de compras e processamento de pagamento não podem ser fornecidos.
              </li>
              <li>
                <strong>Cookies de Desempenho e Analíticos:</strong> Coletam informações sobre como os visitantes usam o nosso site, quais páginas são visitadas com mais frequência e se eles recebem mensagens de erro. Esses cookies são usados apenas para melhorar o desempenho e a experiência do usuário no site.
              </li>
              <li>
                <strong>Cookies de Funcionalidade:</strong> Permitem que o site lembre de escolhas que você faz (como seu nome de usuário, idioma ou a região em que você está) e forneça recursos aprimorados e mais pessoais.
              </li>
              <li>
                <strong>Cookies de Publicidade e Redes Sociais:</strong> Usados para oferecer anúncios mais relevantes para você e seus interesses. Eles também são usados para limitar o número de vezes que você vê um anúncio, bem como ajudar a medir a eficácia das campanhas publicitárias.
              </li>
            </ul>

            <h2 className="text-2xl font-heading font-bold text-gray-900 mt-10 mb-4">Finalidades do Processamento de Dados</h2>
            <p>Os dados coletados são utilizados para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar, operar e melhorar nossos serviços e ofertas;</li>
              <li>Processar suas transações e enviar notificações relacionadas a suas compras;</li>
              <li>Personalizar sua experiência de usuário e recomendar conteúdos relevantes.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
