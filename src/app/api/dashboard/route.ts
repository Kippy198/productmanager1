import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import Product from "@/src/models/Product";

export async function GET() {
    await connectDB();
    const totalProducts = await Product.countDocuments();
    const totalActive = await Product.countDocuments({status: "active"});
    const totalOutOfStock = await Product.countDocuments({stockQuantity: 0})
    const productByCategory = await Product.aggregate([
        {
            $group: {
                _id:"$category",
                count: {$sum: 1}
            }
        }
    ])

    return NextResponse.json({
        totalActive,
        totalProducts,
        totalOutOfStock,
        productByCategory,
    })
}