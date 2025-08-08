import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getCategories, getProducts } from "../lib/api";
import { Category, Product } from "../type";

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  cart: Product[];

  // Products actions
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addToCart: (product: Product) => void;
  reduceProductQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      filteredProducts: [],
      categories: [],
      loading: false,
      error: null,
      cart: [],

      fetchProducts: async () => {
        try {
          set({ loading: true, error: null });
          const products = await getProducts();

          set({
            products,
            filteredProducts: products,
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      fetchCategories: async () => {
        try {
          set({ loading: true, error: null });
          const categories = await getCategories();
          set({ categories, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      addToCart: (product: Product) => {
        set((state) => {
          const existingProduct = state.cart.find((item) => item.id === product.id);
          if (existingProduct) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1, timestamp: Date.now() }] };
        });
      },
      reduceProductQuantity: (productId: number) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
              : item
          ),
        }));
      },
      removeFromCart: (productId: number) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      },

    }),
    {
      name: "products-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
