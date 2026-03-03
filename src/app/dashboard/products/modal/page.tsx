"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/lib/useToast";
import Button from "@/src/component/ui/button";
import FormInput from "@/src/component/ui/input";
type FormValues = {
    name: string;
    description?: string;
    category: "T-Shirt" | "Mug" | "Hoodie" | "Phone Case" | "";
    price: number;
    stockQuantity: number;
    imageUrl: string;
    status: "active" | "inactive";
}


export default function CreatModal() {
    const { register, handleSubmit, formState: {errors, isSubmitting}, watch }  = useForm<FormValues>({
        defaultValues: {
            status: "active"
        }
    }) 
    const router = useRouter();
    const { success, error: errorToast } = useToast();
    const price = watch("price");
    const stockQuantity = watch("stockQuantity");

    const onSubmit = async (data: FormValues) => {
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to create product");
            }

            success("Product created successfully!");
            setTimeout(() => {
                router.push("/dashboard/products");
                router.refresh();
            }, 1000);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to create product";
            errorToast(errorMsg);
        }
    };

    const getInputClass = (hasError: boolean) => {
        return `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            hasError 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300'
        }`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Create New Product</h2>
                    <p className="text-gray-600 text-sm sm:text-base">Fill in the details below to add a new product</p>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sm:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name */}
                        <FormInput
                            label="Product Name"
                            required
                            placeholder="Enter product name"
                            error={errors.name?.message}
                            helperText="2-100 characters"
                            {...register("name", {
                                required: "Product name is required",
                                minLength: {
                                value: 2,
                                message: "Product name must be at least 2 characters"
                                },
                                maxLength: {
                                value: 100,
                                message: "Product name must be less than 100 characters"
                                }
                            })}
                        />

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea 
                                placeholder="Enter product description" 
                                {...register("description", {
                                    minLength: {
                                        value: 10,
                                        message: "Description must be at least 10 characters"
                                    },
                                    maxLength: {
                                        value: 1000,
                                        message: "Description must be less than 1000 characters"
                                    }
                                })}
                                className={`${getInputClass(!!errors.description)} resize-none`}
                                rows={4}
                            ></textarea>
                            {errors.description && <p className="text-red-600 text-sm mt-1 font-medium">{errors.description.message}</p>}
                            <p className="text-xs text-gray-500 mt-1">Optional: 10-1000 characters</p>
                        </div>

                        {/* Category & Price */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    {...register("category", {
                                        required: "Please select a category"
                                    })} 
                                    className={getInputClass(!!errors.category)}
                                >
                                    <option value="">Select a category</option>
                                    <option value="T-Shirt">T-Shirt</option>
                                    <option value="Mug">Mug</option>
                                    <option value="Hoodie">Hoodie</option>
                                    <option value="Phone Case">Phone Case</option>
                                </select>
                                {errors.category && <p className="text-red-600 text-sm mt-1 font-medium">{errors.category.message}</p>}
                            </div>

                            <FormInput
                                label="Price"
                                required
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                error={errors.price?.message}
                                helperText={
                                    price !== undefined ? `${Number(price).toFixed(2)}` : undefined
                                }
                                {...register("price", {
                                    required: "Price is required",
                                    min: {
                                    value: 0,
                                    message: "Price must be greater than or equal to 0"
                                    },
                                    max: {
                                    value: 1000000,
                                    message: "Price is too high"
                                    }
                                })}
                            />
                        </div>

                        {/* Stock & Image */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <FormInput 
                                label="Stock Quantity"
                                required
                                type="number" 
                                placeholder="0" 
                                {...register("stockQuantity", {
                                    required: "Stock quantity is required",
                                    min: {
                                        value: 0,
                                        message: "Stock must be 0 or greater"
                                    },
                                    max: {
                                        value: 1000000,
                                        message: "Stock quantity is too high"
                                    }
                                })}
                                helperText = {
                                    stockQuantity !== undefined
                                                    ? `Units available : ${stockQuantity}`
                                                    : undefined
                                }
                                error={errors.stockQuantity?.message}
                            />

                            <FormInput
                                label="Image URL"
                                required
                                placeholder="https://example.com/image.jpg"
                                error={errors.imageUrl?.message}
                                {...register("imageUrl", {
                                    required: "Image URL is required",
                                    pattern: {
                                    value: /^https?:\/\/.+/,
                                    message: "Please enter a valid URL starting with http:// or https://"
                                    }
                                })}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select 
                                {...register("status")}
                                className={getInputClass(false)}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Active products are visible to customers</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                variable="primary"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : "Save Product"}
                            </Button>
                            <Button 
                                type="button" 
                                onClick={() => router.push("/dashboard/products")}
                                variable="cancel"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
