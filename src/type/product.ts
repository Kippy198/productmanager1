export interface ProductType {
    _id: string,
    name: string,
    description: string,
    category: "T-Shirt" | "Mug" | "Hoodie" | "Phone Case"
    price: number,
    stockQuantity: number,
    imageUrl: string,
    status:  "active" | "inactive"
}

export interface ProductQuery {
    search?: string,
    category?: string;
    status?: string;
}

export interface SortQuery {
    order?: "asc" | "desc",
    search?: string,
    sortBy?: "price" | "createdAt";
}

export interface PaginationQuery {
    page?: number,
    limit?: number,
}

export interface TotalQuery extends ProductQuery, SortQuery,PaginationQuery {}
