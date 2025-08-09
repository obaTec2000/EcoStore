import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getCategories, getProducts } from "../lib/api";
import { Category, Product } from "../type";

interface ProductsState {
  page: number;
  limit: number;
  total: number;
  products: Product[];
  filteredProducts: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  cart: Product[];

  // Products actions
  fetchProducts: (page?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  clearCartItem: () => void
  addToCart: (product: Product) => void;
  reduceProductQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      page: 0,
      total: 10,
      limit: 0,
      products: [], // No persistence
      filteredProducts: [], // No persistence
      categories: [], // No persistence
      loading: false,
      error: null,
      cart: [], // Persist cart only

      fetchProducts: async (page = 0) => {
        try {
          set({ loading: true, error: null });
          const limit = 10;
          const skip = page * limit;
          const data = await getProducts(limit, skip);

          if (skip === 0) {
            set({ products: data.products });
          } else {
            set((state) => ({
              products: [...state.products, ...data.products],
            }));
          }
          set({ page, loading: false, total: data.total });
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
          const existingProduct = state.cart.find(
            (item) => item.id === product.id
          );
          if (existingProduct) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: (item.quantity || 1) + 1 }
                  : item
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              { ...product, quantity: 1, timestamp: Date.now() },
            ],
          };
        });
      },

      clearCartItem: () => {
        set((state) => ({
          cart: []
        }))
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
      name: "cart-storage", // Persist only cart
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ cart: state.cart }), // Exclude products & categories from persistence
    }
  )
);
