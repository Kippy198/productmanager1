import mongoose from "mongoose";
import { ProductType } from "../type/product";

export interface ProductDocument extends Document {
  name: string;
  description: string;
  category: "T-Shirt" | "Mug" | "Hoodie" | "Phone Case";
  price: number;
  stockQuantity: number;
  imageUrl: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema (
    {
        name: {
            type: String, 
            required : true,
            unique: true,
        },
        description : {
            type: String,
            required : true,
        },
        category: {
            type: String,
            required : true,
            enum: ["T-Shirt","Mug","Hoodie","Phone Case"]
        },
        price: {
            type: Number,
            required : true,
        },
        stockQuantity : {
            type: Number,
            required: true,
        },
        imageUrl : {
            type: String,
            required: true,
        },
        status : {
            type: String,
            enum: ["active", "inactive"]
        }
    },
    {
        timestamps: true,
    }
);

ProductSchema.index({name: "text"});

export default mongoose.models.Product || mongoose.model<ProductDocument>("Product", ProductSchema);