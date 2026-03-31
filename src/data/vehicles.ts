// Dados pré-definidos para seleção de veículos
export const VEHICLE_BRANDS = [
  "Mercedes",
  "Fiat",
  "Renault",
  "Volkswagen",
  "Ford",
  "Citroen",
  "Kia",
] as const;

// Mapeamento de marca para modelo específico
export const BRAND_TO_MODEL: Record<(typeof VEHICLE_BRANDS)[number], string> = {
  "Mercedes": "Sprinter",
  "Fiat": "Ducato",
  "Renault": "Master",
  "Volkswagen": "Kombi",
  "Ford": "Transit",
  "Citroen": "Jumper",
  "Kia": "Besta",
} as const;

// Gerar anos de 2000 até 2026
export const VEHICLE_YEARS = Array.from(
  { length: 27 },
  (_, i) => 2000 + i
) as const;

export type VehicleBrand = (typeof VEHICLE_BRANDS)[number];
export type VehicleYear = (typeof VEHICLE_YEARS)[number];

export interface VehicleSelection {
  brand: VehicleBrand | null;
  model: string | null;
  year: VehicleYear | null;
}
