import { showError } from "@/lib/alert";
import { getProducts } from "@/services/products.services";
import { useState, useEffect, useCallback } from "react";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      showError(error.response?.data?.msg || "Failed to load data products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    fetchProducts,
  };
}
