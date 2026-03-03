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