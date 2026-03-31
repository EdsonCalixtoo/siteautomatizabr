import { useState } from "react";

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
}

interface UseViaCEPReturn {
  loading: boolean;
  error: string | null;
  fetchAddress: (cep: string) => Promise<boolean>;
}

export function useViaCEP(): UseViaCEPReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = async (cep: string): Promise<boolean> => {
    // Limpar CEP de caracteres especiais
    const cleanCep = cep.replace(/\D/g, "");

    // Validar se tem 8 dígitos
    if (cleanCep.length !== 8) {
      setError("CEP deve conter 8 dígitos");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

      if (!response.ok) {
        throw new Error("Erro ao buscar CEP");
      }

      const data: ViaCEPResponse = await response.json();

      // Verificar se o CEP é válido
      if (data.erro) {
        setError("CEP não encontrado");
        return false;
      }

      setLoading(false);
      return true;
    } catch (err) {
      setError("Erro ao buscar CEP. Verifique sua conexão.");
      setLoading(false);
      return false;
    }
  };

  return {
    loading,
    error,
    fetchAddress,
  };
}

export async function searchViaCEP(cep: string): Promise<AddressData | null> {
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) {
    return null;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

    if (!response.ok) {
      return null;
    }

    const data: ViaCEPResponse = await response.json();

    if (data.erro) {
      return null;
    }

    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      complement: data.complemento || "",
    };
  } catch (err) {
    return null;
  }
}
