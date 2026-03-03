"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProductType } from "@/src/type/product";
import Button from "@/src/component/ui/button";
import FormInput from "@/src/component/ui/input";
import { Form } from "react-hook-form";
export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ProductType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) {
        router.push("/dashboard/products");
        return;
      }
      const data = await res.json();
      setProduct(data.data);
      setEditForm(data.data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết sản phẩm:", error);
      router.push("/dashboard/products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      deleteProduct();
    }
  };

  const deleteProduct = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Xóa sản phẩm thành công");
        router.push("/dashboard/products");
        router.refresh();
      } else {
        alert("Lỗi xóa sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      alert("Lỗi xóa sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        const data = await res.json();
        setProduct(data.data);
        setIsEditing(false);
        alert("Cập nhật sản phẩm thành công");
        router.refresh();
      } else {
        alert("Lỗi cập nhật sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      alert("Lỗi cập nhật sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải chi tiết sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg font-medium">Không tìm thấy sản phẩm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Chi tiết sản phẩm</h1>
            <p className="text-gray-600">Xem và quản lý thông tin sản phẩm</p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/products")}
            variable="cancel"
          >
            ← Quay lại
          </Button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="flex items-center justify-center">
              <div className="rounded-lg overflow-hidden shadow-md w-full max-w-md aspect-square flex items-center justify-center bg-gray-100 border-2 border-gray-200">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/400?text=Product+Image";
                  }}
                />
              </div>
            </div>

            {/* Details Section */}
            <div>
              {!isEditing ? (
                <>
                  {/* View Mode */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tên sản phẩm
                      </label>
                      <p className="text-2xl font-bold text-gray-900">{product.name}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mô tả
                      </label>
                      <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Danh mục
                        </label>
                        <p className="text-gray-900 font-medium">{product.category}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Giá
                        </label>
                        <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số lượng trong kho
                        </label>
                        <p className="text-lg font-semibold text-gray-900">{product.stockQuantity}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Trạng thái
                        </label>
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {product.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        URL hình ảnh
                      </label>
                      <p className="text-gray-600 text-sm break-all">{product.imageUrl}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => setIsEditing(true)}
                        variable="warning"
                      >
                         Chỉnh sửa
                      </Button>
                      <Button
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        variable = "warning"
                      >
                         Xóa sản phẩm
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Edit Mode */}
                  <div className="space-y-6">
                    <FormInput 
                        label="Tên sản phẩm"
                        type="text"
                        placeholder="Nhập tên sản phẩm"
                        value={editForm?.name || ""}
                        onChange={(e) =>
                          setEditForm(editForm ? { ...editForm, name: e.target.value } : null)
                        }
                    />

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mô tả
                      </label>
                      <textarea
                        placeholder="Nhập mô tả sản phẩm"
                        value={editForm?.description || ""}
                        onChange={(e) =>
                          setEditForm(editForm ? { ...editForm, description: e.target.value } : null)
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Danh mục
                        </label>
                        <select
                          value={editForm?.category || ""}
                          onChange={(e) =>
                            setEditForm(
                              editForm
                                ? {
                                    ...editForm,
                                    category: e.target.value as "T-Shirt" | "Mug" | "Hoodie" | "Phone Case",
                                  }
                                : null
                            )
                          }
                          aria-label="Chọn danh mục sản phẩm"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="T-Shirt">T-Shirt</option>
                          <option value="Mug">Mug</option>
                          <option value="Hoodie">Hoodie</option>
                          <option value="Phone Case">Phone Case</option>
                        </select>
                      </div>

                      <FormInput 
                        label="Giá"
                        type="number"
                        step="0.01"
                        placeholder="Nhập giá sản phẩm"
                        value={editForm?.price || ""}
                        onChange={(e) =>
                          setEditForm(
                            editForm ? { ...editForm, price: parseFloat(e.target.value) } : null
                          )
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormInput 
                          label="Số lượng trong kho"
                           type="number"
                          placeholder="Nhập số lượng"
                          value={editForm?.stockQuantity || ""}
                          onChange={(e) =>
                            setEditForm(
                              editForm ? { ...editForm, stockQuantity: parseInt(e.target.value) } : null
                            )
                          }
                      />

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Trạng thái
                        </label>
                        <select
                          value={editForm?.status || ""}
                          onChange={(e) =>
                            setEditForm(
                              editForm
                                ? {
                                    ...editForm,
                                    status: e.target.value as "active" | "inactive",
                                  }
                                : null
                            )
                          }
                          aria-label="Chọn trạng thái sản phẩm"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="active">Hoạt động</option>
                          <option value="inactive">Không hoạt động</option>
                        </select>
                      </div>
                    </div>

                    <FormInput 
                        label="URL hình ảnh"
                        type="text"
                        placeholder="Nhập URL hình ảnh"
                        value={editForm?.imageUrl || ""}
                        onChange={(e) =>
                          setEditForm(editForm ? { ...editForm, imageUrl: e.target.value } : null)
                        }
                    />
                    {/* Edit Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <Button
                        onClick={handleSaveEdit}
                        disabled={isSubmitting}
                        variable="success"
                      >
                         Lưu
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                        variable="danger"
                      >
                         Hủy
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
