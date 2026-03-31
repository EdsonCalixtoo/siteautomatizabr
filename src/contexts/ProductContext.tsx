import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { formatPrice } from "@/lib/utils";

// Função para gerar UUID v4
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Função segura para salvar no localStorage
const safeLocalStorageSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error: any) {
    if (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED") {
      console.warn(`⚠️ Limite do LocalStorage atingido ao salvar "${key}". Os dados podem não persistir entre sessões, mas estão salvos na memória atual.`);
    } else {
      console.error(`❌ Erro ao acessar LocalStorage:`, error);
    }
  }
};

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  createdAt: string;
  images?: string[];
  sku?: string;
  weight?: string;
  dimensions?: string;
  warranty?: string;
  material?: string;
  status?: string;
  features?: string[];
  badge?: string;
  shortDescription?: string;
  videoUrl?: string;
  audioUrl?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  active: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  key: string;
  createdAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
}

interface ProductContextType {
  products: Product[];
  coupons: Coupon[];
  categories: Category[];
  subcategories: Subcategory[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, "id" | "createdAt">) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCoupon: (coupon: Omit<Coupon, "id" | "createdAt">) => Promise<void>;
  updateCoupon: (id: string, coupon: Omit<Coupon, "id" | "createdAt">) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  useCoupon: (code: string) => { valid: boolean; discount?: number; message: string };
  // Novas funções para Categorias e Subcategorias
  addCategory: (category: Omit<Category, "id" | "createdAt">) => Promise<void>;
  updateCategory: (id: string, category: Omit<Category, "id" | "createdAt">) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addSubcategory: (subcategory: Omit<Subcategory, "id" | "createdAt">) => Promise<void>;
  updateSubcategory: (id: string, subcategory: Omit<Subcategory, "id" | "createdAt">) => Promise<void>;
  deleteSubcategory: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar produtos do Supabase ou localStorage
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Carregar do Supabase para todos os usuários (logados ou não)
        const { data, error } = await supabase
          .from("products")
          .select("*");

        if (error) {
          console.error("❌ Erro ao carregar produtos do Supabase:");
          console.error("   Código:", error.code);
          console.error("   Mensagem:", error.message);
          console.error("   Hints:", error.hint);
          // Fallback para localStorage
          loadFromLocalStorage();
        } else if (data && Array.isArray(data)) {
          console.log(`✅ ${data.length} produtos carregados do Supabase`);
          const formattedProducts: Product[] = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            category: p.category,
            subcategory: p.subcategory,
            price: p.price,
            image: p.image,
            stock: p.stock,
            createdAt: p.created_at,
            images: p.images,
            sku: p.sku,
            weight: p.weight,
            dimensions: p.dimensions,
            warranty: p.warranty,
            material: p.material,
            status: p.status,
            originalPrice: p.original_price,
            badge: p.badge,
            shortDescription: p.short_description,
            videoUrl: p.video_url,
            audioUrl: p.audio_url,
          }));
          setProducts(formattedProducts);
          // Sincronizar com localStorage (com segurança)
          safeLocalStorageSetItem("products", JSON.stringify(formattedProducts));
        } else {
          // Se não há produtos no Supabase, carrega do localStorage
          console.log("ℹ️ Nenhum produto no Supabase. Tentando localStorage...");
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error("❌ Erro ao carregar produtos:", error);
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      const saved = localStorage.getItem("products");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const safeProducts = Array.isArray(parsed) ? parsed : [];
          console.log(`✅ ${safeProducts.length} produtos carregados do localStorage`);
          setProducts(safeProducts);
        } catch {
          console.error("❌ Erro ao parsear localStorage");
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  // Carregar cupons
  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const { data, error } = await supabase
          .from("coupons")
          .select("*");

        if (error) {
          console.error("❌ Erro ao carregar cupons:", error);
          loadCouponsFromLocalStorage();
        } else if (data && Array.isArray(data)) {
          const formatted: Coupon[] = data.map((c: any) => ({
            id: c.id,
            code: c.code,
            description: c.description,
            discountType: c.discount_type,
            discountValue: c.discount_value,
            maxUses: c.max_uses,
            currentUses: c.current_uses,
            expiryDate: c.expiry_date,
            active: c.active,
            createdAt: c.created_at,
          }));
          setCoupons(formatted);
          safeLocalStorageSetItem("coupons", JSON.stringify(formatted));
        } else {
          loadCouponsFromLocalStorage();
        }
      } catch (error) {
        console.error("❌ Erro ao carregar cupons:", error);
        loadCouponsFromLocalStorage();
      }
    };

    const loadCouponsFromLocalStorage = () => {
      const saved = localStorage.getItem("coupons");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCoupons(Array.isArray(parsed) ? parsed : []);
        } catch {
          setCoupons([]);
        }
      } else {
        setCoupons([]);
      }
    };

    loadCoupons();
  }, []);

  // Carregar categorias e subcategorias
  useEffect(() => {
    const loadCategoriesData = async () => {
      try {
        const { data: catData, error: catError } = await supabase.from("categories").select("*");
        const { data: subData, error: subError } = await supabase.from("subcategories").select("*");

        if (catError) console.error("❌ Erro ao carregar categorias:", catError);
        else if (catData) {
          setCategories(catData.map(c => ({
            id: c.id,
            name: c.name,
            key: c.key,
            createdAt: c.created_at
          })));
        }

        if (subError) console.error("❌ Erro ao carregar subcategorias:", subError);
        else if (subData) {
          setSubcategories(subData.map(s => ({
            id: s.id,
            name: s.name,
            categoryId: s.category_id,
            createdAt: s.created_at
          })));
        }
      } catch (error) {
        console.error("❌ Erro geral ao carregar categorias:", error);
      }
    };

    loadCategoriesData();
  }, []);

  // Adicionar produto
  const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
    try {
      const newProduct: Product = {
        ...product,
        id: generateUUID(),
        createdAt: new Date().toISOString(),
      };

      if (user) {
        // Salvar no Supabase
        const { error } = await supabase.from("products").insert([
          {
            id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description,
            category: newProduct.category,
            subcategory: newProduct.subcategory,
            price: newProduct.price,
            image: newProduct.image,
            images: newProduct.images,
            stock: newProduct.stock,
            sku: newProduct.sku,
            weight: newProduct.weight,
            dimensions: newProduct.dimensions,
            warranty: newProduct.warranty,
            material: newProduct.material,
            status: newProduct.status,
            original_price: newProduct.originalPrice,
            badge: newProduct.badge,
            short_description: newProduct.shortDescription,
            video_url: newProduct.videoUrl,
            audio_url: newProduct.audioUrl,
            user_id: user.id,
          },
        ]);

        if (error) {
          console.error("❌ Erro ao salvar produto no Supabase:");
          console.error("   Código:", error.code);
          console.error("   Mensagem:", error.message);
          console.error("   Detalhes:", error);
        } else {
          console.log("✅ Produto salvo no Supabase com sucesso!");
        }
      }

      // Atualizar estado e localStorage
      const updated = [...products, newProduct];
      setProducts(updated);
      safeLocalStorageSetItem("products", JSON.stringify(updated));
      console.log("✅ Produto criado localmente com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao criar produto:", error);
      throw error;
    }
  };

  // Atualizar produto
  const updateProduct = async (id: string, product: Omit<Product, "id" | "createdAt">) => {
    try {
      if (user) {
        const { error } = await supabase
          .from("products")
          .update({
            name: product.name,
            description: product.description,
            category: product.category,
            subcategory: product.subcategory,
            price: product.price,
            image: product.image,
            images: product.images,
            stock: product.stock,
            sku: product.sku,
            weight: product.weight,
            dimensions: product.dimensions,
            warranty: product.warranty,
            material: product.material,
            status: product.status,
            original_price: product.originalPrice,
            badge: product.badge,
            short_description: product.shortDescription,
            video_url: product.videoUrl,
            audio_url: product.audioUrl,
          })
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          console.error("❌ Erro ao atualizar produto no Supabase:", error);
        }
      }

      const updated = products.map((p) =>
        p.id === id ? { ...p, ...product } : p
      );
      setProducts(updated);
      safeLocalStorageSetItem("products", JSON.stringify(updated));
      console.log("✅ Produto atualizado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao atualizar produto:", error);
      throw error;
    }
  };

  // Deletar produto
  const deleteProduct = async (id: string) => {
    try {
      if (user) {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          console.error("❌ Erro ao deletar produto no Supabase:", error);
        }
      }

      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      safeLocalStorageSetItem("products", JSON.stringify(updated));
      console.log("✅ Produto deletado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao deletar produto:", error);
      throw error;
    }
  };

  // Adicionar cupom
  const addCoupon = async (coupon: Omit<Coupon, "id" | "createdAt">) => {
    try {
      const newCoupon: Coupon = {
        ...coupon,
        id: generateUUID(),
        createdAt: new Date().toISOString(),
      };

      if (user) {
        const { error } = await supabase.from("coupons").insert([
          {
            id: newCoupon.id,
            code: newCoupon.code,
            description: newCoupon.description,
            discount_type: newCoupon.discountType,
            discount_value: newCoupon.discountValue,
            max_uses: newCoupon.maxUses,
            current_uses: newCoupon.currentUses,
            expiry_date: newCoupon.expiryDate,
            active: newCoupon.active,
            user_id: user.id,
          },
        ]);

        if (error) {
          console.error("❌ Erro ao salvar cupom no Supabase:", error);
        }
      }

      const updated = [...coupons, newCoupon];
      setCoupons(updated);
      safeLocalStorageSetItem("coupons", JSON.stringify(updated));
      console.log("✅ Cupom criado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao criar cupom:", error);
      throw error;
    }
  };

  // Atualizar cupom
  const updateCoupon = async (id: string, coupon: Omit<Coupon, "id" | "createdAt">) => {
    try {
      if (user) {
        const { error } = await supabase
          .from("coupons")
          .update({
            code: coupon.code,
            description: coupon.description,
            discount_type: coupon.discountType,
            discount_value: coupon.discountValue,
            max_uses: coupon.maxUses,
            current_uses: coupon.currentUses,
            expiry_date: coupon.expiryDate,
            active: coupon.active,
          })
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          console.error("❌ Erro ao atualizar cupom no Supabase:", error);
        }
      }

      const updated = coupons.map((c) =>
        c.id === id ? { ...c, ...coupon } : c
      );
      setCoupons(updated);
      safeLocalStorageSetItem("coupons", JSON.stringify(updated));
      console.log("✅ Cupom atualizado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao atualizar cupom:", error);
      throw error;
    }
  };

  // Deletar cupom
  const deleteCoupon = async (id: string) => {
    try {
      if (user) {
        const { error } = await supabase
          .from("coupons")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          console.error("❌ Erro ao deletar cupom no Supabase:", error);
        }
      }

      const updated = coupons.filter((c) => c.id !== id);
      setCoupons(updated);
      safeLocalStorageSetItem("coupons", JSON.stringify(updated));
      console.log("✅ Cupom deletado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao deletar cupom:", error);
      throw error;
    }
  };

  // Usar cupom
  const useCoupon = (code: string) => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
      return { valid: false, message: "Cupom não encontrado" };
    }

    if (!coupon.active) {
      return { valid: false, message: "Cupom desativado" };
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: "Cupom expirado" };
    }

    if (coupon.currentUses >= coupon.maxUses) {
      return { valid: false, message: "Cupom atingiu o limite de uso" };
    }

    // Atualizar uso
    updateCoupon(coupon.id, {
      ...coupon,
      currentUses: coupon.currentUses + 1,
    });

    return {
      valid: true,
      discount: coupon.discountValue,
      message: `Cupom aplicado! ${coupon.discountType === "percentage" ? coupon.discountValue + "% de desconto" : "R$ " + formatPrice(coupon.discountValue) + " de desconto"}`,
    };
  };

  // Funções de Gerenciamento de Categorias
  const addCategory = async (category: Omit<Category, "id" | "createdAt">) => {
    try {
      const { data, error } = await supabase.from("categories").insert([{
        name: category.name,
        key: category.key,
        user_id: user?.id
      }]).select();

      if (error) throw error;
      if (data) {
        setCategories([...categories, { ...category, id: data[0].id, createdAt: data[0].created_at }]);
      }
    } catch (error) {
      console.error("❌ Erro ao adicionar categoria:", error);
      throw error;
    }
  };

  const updateCategory = async (id: string, category: Omit<Category, "id" | "createdAt">) => {
    try {
      const { error } = await supabase.from("categories").update({
        name: category.name,
        key: category.key
      }).eq("id", id);

      if (error) throw error;
      setCategories(categories.map(c => c.id === id ? { ...c, ...category } : c));
    } catch (error) {
      console.error("❌ Erro ao atualizar categoria:", error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error("❌ Erro ao deletar categoria:", error);
      throw error;
    }
  };

  const addSubcategory = async (subcategory: Omit<Subcategory, "id" | "createdAt">) => {
    try {
      const { data, error } = await supabase.from("subcategories").insert([{
        name: subcategory.name,
        category_id: subcategory.categoryId,
        user_id: user?.id
      }]).select();

      if (error) throw error;
      if (data) {
        setSubcategories([...subcategories, { ...subcategory, id: data[0].id, createdAt: data[0].created_at }]);
      }
    } catch (error) {
      console.error("❌ Erro ao adicionar subcategoria:", error);
      throw error;
    }
  };

  const updateSubcategory = async (id: string, subcategory: Omit<Subcategory, "id" | "createdAt">) => {
    try {
      const { error } = await supabase.from("subcategories").update({
        name: subcategory.name,
        category_id: subcategory.categoryId
      }).eq("id", id);

      if (error) throw error;
      setSubcategories(subcategories.map(s => s.id === id ? { ...s, ...subcategory } : s));
    } catch (error) {
      console.error("❌ Erro ao atualizar subcategoria:", error);
      throw error;
    }
  };

  const deleteSubcategory = async (id: string) => {
    try {
      const { error } = await supabase.from("subcategories").delete().eq("id", id);
      if (error) throw error;
      setSubcategories(subcategories.filter(s => s.id !== id));
    } catch (error) {
      console.error("❌ Erro ao deletar subcategoria:", error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        coupons,
        categories,
        subcategories,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        useCoupon,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts deve ser usado dentro de ProductProvider");
  }
  return context;
}
