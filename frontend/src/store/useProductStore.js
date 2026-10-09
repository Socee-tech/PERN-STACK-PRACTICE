import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

// BASE_URL will be dynamically set based on the environment (development or production)
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "https://pern-stack-practice-rzm0.onrender.com/api";

export const useProductStore = create((set, get) => ({
  // products state
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  // form state
  formData: {
    name: "",
    price: "",
    image: "",
  },

  setFormData: (formData) => set({ formData }),
  resetFormData: () => set({ formData: { name: "", price: "", image: "" } }),

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/products`, formData);
      await get().fetchProducts();
      get().resetFormData();
      toast.success("Product added successfully.");
      //   close the modal after adding the product
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.log("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      set({ loading: false });
    }
  },

  // fetch products from backend
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      set({ products: response.data.data, error: null });
    } catch (err) {
      console.error("Error fetching products:", err);
      if (err.status === 429)
        set({
          error: "Rate limit exceeded. Please try again later.",
          products: [],
        });
      else
        set({
          error: "something went wrong while fetching products.",
          products: [],
        });
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/products/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
      }));
      toast.success("Product deleted successfully.");
    } catch (error) {
      console.log("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/products/${id}`);
      set({
        currentProduct: response.data.data,
        formData: response.data.data, //prefil form with current product data
        error: null,
      });
    } catch (error) {
      console.log("Error fetching product:", error);
      set({
        error: "Failed to fetch product. Please try again.",
        currentProduct: null,
      });
    } finally {
      set({ loading: false });
    }
  },
  
  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const reponse = await axios.put(`${BASE_URL}/products/${id}`, formData);
      set({ currentProduct: reponse.data.data });
      toast.success("Product updated successfully.");
    } catch (error) {
      console.log("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      set({ loading: false });
    }
  },
}));
