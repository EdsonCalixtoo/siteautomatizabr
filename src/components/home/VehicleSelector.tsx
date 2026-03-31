import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  VEHICLE_BRANDS,
  BRAND_TO_MODEL,
  VEHICLE_YEARS,
  type VehicleSelection,
} from "@/data/vehicles";
import { Search, Zap, Badge, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";

export function VehicleSelector() {
  const [selection, setSelection] = useState<VehicleSelection>({
    brand: null,
    model: null,
    year: null,
  });

  const handleBrandChange = (value: string) => {
    setSelection((prev) => ({
      brand: value as VehicleSelection["brand"],
      model: BRAND_TO_MODEL[value as VehicleSelection["brand"]] || null,
      year: prev.year,
    }));
  };

  const handleModelChange = (value: string) => {
    setSelection((prev) => ({
      ...prev,
      model: value as VehicleSelection["model"],
    }));
  };

  const handleYearChange = (value: string) => {
    setSelection((prev) => ({
      ...prev,
      year: parseInt(value) as VehicleSelection["year"],
    }));
  };

  const handleSearch = () => {
    if (selection.brand && selection.model && selection.year) {
      // Aqui você pode implementar a lógica de busca
      console.log("Buscar produtos para:", selection);
      // Exemplo: navegar para página de produtos com filtros
      // navigate(`/products?brand=${selection.brand}&model=${selection.model}&year=${selection.year}`);
    }
  };

  const isComplete =
    selection.brand && selection.model && selection.year;

  return (
    <div className="w-full max-w-6xl mx-auto mb-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Container */}
      <div className="relative group">
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/40 via-blue-600/40 to-cyan-600/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Premium Content Container */}
        <div className="relative bg-gradient-to-br from-gray-800/40 via-gray-900/60 to-gray-950/80 backdrop-blur-2xl rounded-3xl p-12 border border-gray-700/30 shadow-2xl group-hover:border-cyan-500/50 transition-all duration-500 overflow-hidden">
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl -ml-32 -mb-32 group-hover:scale-150 transition-transform duration-700" />

          {/* Header Section */}
          <div className="mb-14 relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-transparent rounded-full" />
              <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
              <h3 className="text-white text-3xl font-bold bg-gradient-to-r from-cyan-300 via-white to-cyan-300 bg-clip-text text-transparent">
                Encontre a Solução Perfeita
              </h3>
              <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
              <div className="h-1 w-12 bg-gradient-to-l from-cyan-400 to-transparent rounded-full" />
            </div>
            <p className="text-center text-gray-300 text-sm font-medium tracking-wide">Escolha sua marca, modelo e ano para acessar produtos exclusivos</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-2 mb-12 justify-center relative z-10">
            {[
              { step: 1, label: "Marca", active: !!selection.brand },
              { step: 2, label: "Modelo", active: !!selection.model },
              { step: 3, label: "Ano", active: !!selection.year },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`relative ${item.active ? "bg-gradient-to-r from-cyan-500 to-cyan-600" : "bg-gray-700/50"} rounded-full p-2.5 transition-all duration-500 shadow-lg ${item.active ? "shadow-cyan-500/50" : ""}`}>
                  {item.active ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span className="w-5 h-5 flex items-center justify-center text-white text-xs font-bold">{item.step}</span>
                  )}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${item.active ? "text-cyan-400" : "text-gray-500"}`}>
                  {item.label}
                </span>
                {idx < 2 && <div className={`w-8 h-0.5 ${item.active ? "bg-gradient-to-r from-cyan-500 to-transparent" : "bg-gray-700/30"} transition-all duration-500 hidden sm:block`} />}
              </div>
            ))}
          </div>

          {/* Selects Grid with Premium Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10 relative z-10">
            {/* Brand Select Card */}
            <div className="group/card relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/10 rounded-2xl opacity-0 group-hover/card:opacity-100 blur transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-gray-700/40 to-gray-800/40 backdrop-blur-md border border-gray-600/30 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-lg border border-cyan-500/30">
                    <Badge className="w-5 h-5 text-cyan-400" />
                  </div>
                  <label className="text-sm font-bold text-gray-100 uppercase tracking-wider">Marca</label>
                </div>
                <Select value={selection.brand || ""} onValueChange={handleBrandChange}>
                  <SelectTrigger className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-600/50 text-white hover:border-cyan-500/70 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 backdrop-blur-md text-base font-medium">
                    <SelectValue placeholder="Selecione uma marca" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800/95 border-gray-700/50 backdrop-blur-md">
                    {VEHICLE_BRANDS.map((brand) => (
                      <SelectItem
                        key={brand}
                        value={brand}
                        className="text-white focus:bg-gradient-to-r focus:from-cyan-600/50 focus:to-cyan-500/50 hover:bg-cyan-600/30 transition-colors cursor-pointer"
                      >
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Model Select Card */}
            <div className={`group/card relative transition-all duration-300 ${!selection.brand ? "opacity-50" : "opacity-100"}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/10 rounded-2xl opacity-0 group-hover/card:opacity-100 blur transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-gray-700/40 to-gray-800/40 backdrop-blur-md border border-gray-600/30 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-lg border border-cyan-500/30">
                    <Badge className="w-5 h-5 text-cyan-400" />
                  </div>
                  <label className="text-sm font-bold text-gray-100 uppercase tracking-wider">Modelo</label>
                </div>
                <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-600/50 rounded-2xl px-4 py-3 backdrop-blur-md">
                  <p className="text-white font-medium text-base">
                    {selection.model || "Selecione uma marca"}
                  </p>
                </div>
              </div>
            </div>

            {/* Year Select Card */}
            <div className={`group/card relative transition-all duration-300 ${!selection.model ? "opacity-50" : "opacity-100"}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/10 rounded-2xl opacity-0 group-hover/card:opacity-100 blur transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-gray-700/40 to-gray-800/40 backdrop-blur-md border border-gray-600/30 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-lg border border-cyan-500/30">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                  </div>
                  <label className="text-sm font-bold text-gray-100 uppercase tracking-wider">Ano</label>
                </div>
                <Select
                  value={selection.year?.toString() || ""}
                  onValueChange={handleYearChange}
                  disabled={!selection.model}
                >
                  <SelectTrigger className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-600/50 text-white hover:border-cyan-500/70 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md text-base font-medium">
                    <SelectValue placeholder="Selecione um ano" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800/95 border-gray-700/50 backdrop-blur-md">
                    {[...VEHICLE_YEARS].reverse().map((year) => (
                      <SelectItem
                        key={year}
                        value={year.toString()}
                        className="text-white focus:bg-gradient-to-r focus:from-cyan-600/50 focus:to-cyan-500/50 hover:bg-cyan-600/30 transition-colors cursor-pointer"
                      >
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="flex flex-col gap-4 relative z-10">
            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={!isComplete}
              className={`w-full py-7 font-bold text-lg rounded-2xl transition-all duration-500 transform ${
                isComplete
                  ? "bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:from-cyan-600 hover:via-cyan-700 hover:to-cyan-800 text-white shadow-xl hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 active:scale-95"
                  : "bg-gray-700/50 text-gray-400 cursor-not-allowed opacity-50"
              }`}
            >
              <Search className="w-6 h-6 mr-3" />
              Buscar Produtos
              {isComplete && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>

            {/* Display Selected Values with Animation */}
            {isComplete && (
              <div className="px-6 py-4 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-cyan-500/15 border border-cyan-500/40 rounded-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-sm text-gray-200">
                  Você selecionou: <br />
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 text-base">
                    {selection.brand} {selection.model} • {selection.year}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
