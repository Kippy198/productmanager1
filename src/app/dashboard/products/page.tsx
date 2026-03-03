"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/src/type/product";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/lib/useToast";
import Button from "@/src/component/ui/button";
import FormInput from "@/src/component/ui/input";
interface MetaType {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<MetaType | null>(null);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("desc");
  const router = useRouter();
  const { success, error: errorToast } = useToast();


  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts(page);
    }, 400);
    return () => clearTimeout(timeout);
  }, [page, search, category, sortBy, order]);
  
  useEffect(() => {
    setPage(1);
  }, [search, category, sortBy, order]);
    
  const fetchProducts = async(pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", pageNum.toString());
      params.append("limit", "10");
     
      if (search.trim() !== "") {
        params.append("search", search.trim());
      }

      if (category !== "") {
        params.append("category", category);
      }

      if (sortBy !== "") {
        params.append("sortBy", sortBy);
      }
      
      if (order !== "") {
        params.append("order", order);
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      
      setProducts(data.data);
      setMeta(data.meta);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load products";
      setError(errorMsg);
      errorToast(errorMsg);
    }
    finally {
      setLoading(false);
    }
  }

  const deleteAsync = async(productId: string) => {
    setDeleting(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      success("Product deleted successfully!");
      fetchProducts(page);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete product";
      errorToast(errorMsg);
    }
    finally {
      setDeleting(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage and view all your products</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* Search */}
            <FormInput 
              label="Search"
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white font-medium text-black"
              >
                <option value="">All Categories</option>
                <option value="T-Shirt">T-Shirt</option>
                <option value="Mug">Mug</option>
                <option value="Hoodie">Hoodie</option>
                <option value="Phone Case">Phone Case</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort by field"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white font-medium text-black"
              >
                <option value="">Newest</option>
                <option value="price">Price</option>
                <option value="createdAt">Created Date</option>
              </select>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                aria-label="Sort order ascending or descending"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white font-medium text-black"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => router.push("/dashboard/products/modal")}
          variable="primary"
        >
          + Add Product
        </Button>


        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 font-medium text-sm sm:text-base">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 sm:p-12 text-center">
            <p className="text-gray-600 text-lg font-medium">No products found</p>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">Start by adding your first product</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-200">
            <table className="w-full min-w-max">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">Image</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">Price</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">Stock</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 sm:px-6 py-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md border border-gray-200"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-gray-900 font-medium text-sm sm:text-base">{product.name}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">{product.category}</td>
                    <td className="px-4 sm:px-6 py-4 font-semibold text-gray-900 text-sm sm:text-base">${product.price}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">{product.stockQuantity}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <Button 
                          onClick={() => router.push(`/dashboard/products/${product._id}`)}
                          variable="info"  
                        >
                          View
                        </Button>
                        <Button 
                          onClick={() => router.push(`/dashboard/products/${product._id}`)}
                          variable="warning"  
                        >
                          Edit
                        </Button>
                        <Button 
                          onClick={() => {
                            if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
                              deleteAsync(product._id);
                            }
                          }}
                          disabled={deleting === product._id}
                          variable="danger">
                          {deleting === product._id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {meta && meta.totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center mt-8 gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>

            <div className="flex gap-1 flex-wrap justify-center">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isVisible =
                  pageNum <= 2 ||
                  pageNum >= meta.totalPages - 1 ||
                  Math.abs(pageNum - page) <= 1;

                if (!isVisible && pageNum !== 3 && pageNum !== meta.totalPages - 2) {
                  return null;
                }

                if (
                  pageNum === 3 &&
                  page > 4 &&
                  meta.totalPages > 6
                ) {
                  return (
                    <span key="ellipsis-left" className="px-2 py-2 text-gray-500">
                      ...
                    </span>
                  );
                }

                if (
                  pageNum === meta.totalPages - 2 &&
                  page < meta.totalPages - 3 &&
                  meta.totalPages > 6
                ) {
                  return (
                    <span key="ellipsis-right" className="px-2 py-2 text-gray-500">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === meta.totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
}