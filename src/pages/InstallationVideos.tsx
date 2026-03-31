import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Play, Video, Wrench, Check } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
  category: string;
}

const videos: VideoItem[] = [
  {
    id: "v1",
    title: "VÍDEO DEMONSTRATIVO – Automatizador de Porta",
    youtubeId: "U7ooQjUCNn0",
    category: "Instalação"
  }
];

const categories = ["Todos", "Instalação"];

export default function InstallationVideos() {
  const [selectedCategory, setSelectedCategory] = React.useState("Todos");
  const filteredVideos = selectedCategory === "Todos" ? videos : videos.filter(v => v.category === selectedCategory);

  return (
    <Layout>
      {/* Header */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-red-50 via-red-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-float" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto space-y-4 animate-slide-up">
            <div className="inline-flex items-center justify-center gap-2 text-red-600 font-semibold text-sm uppercase tracking-wider bg-red-100/50 px-4 py-2 rounded-full border border-red-200">
              <Play className="w-4 h-4" />
              Aprenda Passo a Passo
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900">
              Vídeos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">Instalação</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl">
              Assista aos tutoriais completos e aprenda como instalar corretamente seu produto Automatiza
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">Filtrar por Categoria</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Videos Grid */}
          <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <Video className="w-8 h-8 text-red-600" />
              {selectedCategory === "Todos" ? "Todos os Vídeos" : `Categoria: ${selectedCategory}`}
              <span className="text-lg font-normal text-gray-500">({filteredVideos.length})</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-red-300 transform hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        <Wrench className="w-3 h-3" />
                        {video.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-heading text-lg font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {video.title}
                    </h3>
                    
                    <a
                      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      <Play className="w-4 h-4" />
                      Assistir no YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-300 transition-colors animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Assista com Atenção</h3>
                  <p className="text-blue-800 text-sm">Reproduza os vídeos em HD e pause quando necessário para acompanhar cada passo</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-cyan-50 border border-cyan-200 hover:border-cyan-300 transition-colors animate-slide-up" style={{ animationDelay: '250ms' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-900 mb-2">Tenha as Ferramentas</h3>
                  <p className="text-cyan-800 text-sm">Prepare todas as ferramentas e peças necessárias antes de iniciar a instalação</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-purple-50 border border-purple-200 hover:border-purple-300 transition-colors animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">Dúvidas?</h3>
                  <p className="text-purple-800 text-sm">Entre em contato conosco se tiver dúvidas durante o processo de instalação</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
