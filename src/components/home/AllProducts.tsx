import { VehicleSelector } from "./VehicleSelector";

export function AllProducts() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Vehicle Selector */}
          <VehicleSelector />
        </div>
      </div>
    </section>
  );
}
