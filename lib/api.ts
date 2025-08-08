import { Category, Product } from "../type";

const API_URL = "https://dummyjson.com";

// Get all Products
const getProducts = async (limit: number, skip: number): Promise<{products:Product[], total: number}> => {
  try {
    const response = await fetch(`${API_URL}/products?limit=${limit}&skip=${skip}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;  
  } catch (error) {
    console.log("Network response was not ok", error);
    throw error;
  }
};
// Get single product

export const getProduct = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    throw error;
  }
};
// Get all categories
const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/products/categories`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.log("Network response was not ok", error);
    throw error;
  }
};

export { getCategories, getProducts };

