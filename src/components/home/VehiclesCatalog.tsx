import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import vehicleImage from "/ftproduto.jpeg";
import { BRAND_LOGOS } from "@/data/brandLogos";

interface Vehicle {
  id: string;
  name: string;
  image: string;
  description: string;
  link?: string;
}

const vehicles: Vehicle[] = [
  {
    id: "iveco-daily",
    name: "IVECO DAILY",
    image: vehicleImage,
    description: "Furgão compacto e versátil para entregas urbanas",
    link: "/produtos?vehicle=iveco-daily"
  },
  {
    id: "peugeot-boxer",
    name: "PEUGEOT BOXER",
    image: vehicleImage,
    description: "Van profissional com amplo espaço de carga",
    link: "/produtos?vehicle=peugeot-boxer"
  },
  {
    id: "ford-transit",
    name: "FORD TRANSIT",
    image: vehicleImage,
    description: "Referência em transporte de passageiros",
    link: "/produtos?vehicle=ford-transit"
  },
  {
    id: "citroen-jumper",
    name: "CITROËN JUMPER",
    image: vehicleImage,
    description: "Eficiência e conforto para sua frota",
    link: "/produtos?vehicle=citroen-jumper"
  },
  {
    id: "vw-kombi",
    name: "VOLKSWAGEN KOMBI",
    image: vehicleImage,
    description: "Clássico que nunca sai de moda",
    link: "/produtos?vehicle=vw-kombi"
  },
  {
    id: "kia-besta",
    name: "KIA BESTA",
    image: vehicleImage,
    description: "Confiabilidade asiática em preço acessível",
    link: "/produtos?vehicle=kia-besta"
  },
  {
    id: "mercedes-sprinter",
    name: "MERCEDES SPRINTER",
    image: vehicleImage,
    description: "Luxo e desempenho para transportes premium",
    link: "/produtos?vehicle=mercedes-sprinter"
  },
  {
    id: "fiat-ducato",
    name: "FIAT DUCATO",
    image: vehicleImage,
    description: "Potência e durabilidade italiana",
    link: "/produtos?vehicle=fiat-ducato"
  },
  {
    id: "renault-master",
    name: "RENAULT MASTER",
    image: vehicleImage,
    description: "Líder em transportes comerciais",
    link: "/produtos?vehicle=renault-master"
  },
];

export function VehiclesCatalog() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-50/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Compatível com os principais
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-500">
              Modelos de Vans do Brasil
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Nosso sistema de automação funciona com praticamente todos os modelos de vans comerciais. 
            Confira qual é o seu veículo abaixo.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onMouseEnter={() => setHoveredId(vehicle.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-cyan-200"
            >
              {/* Brand Logo Badge */}
              <div className="absolute top-4 left-4 z-20 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
                <img 
                  src={BRAND_LOGOS[vehicle.name]} 
                  alt={vehicle.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-b from-cyan-600 to-cyan-700">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                
                {/* Placeholder for vehicle image */}
                <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
                  {vehicle.image ? (
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <span>Imagem do {vehicle.name}</span>
                  )}
                </div>

                {/* Badge */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <span className="text-white text-xs font-semibold uppercase tracking-wider">Em Stock</span>
                </div>

                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${hoveredId === vehicle.id ? 'opacity-100' : 'opacity-0'}`} />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                  {vehicle.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {vehicle.description}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <a href={vehicle.link} className="flex-1">
                    <Button 
                      variant="default"
                      className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white group/btn rounded-xl font-semibold"
                    >
                      Ver Detalhes
                    </Button>
                  </a>
                  <button className="p-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Accent line */}
              <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-cyan-400 to-cyan-600 group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Não encontrou seu modelo? Converse conosco!
          </p>
          <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-10 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Falar com Especialista
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
