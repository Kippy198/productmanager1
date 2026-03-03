import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import Product from "@/src/models/Product";
import { ProductType } from "@/src/type/product";

const category: ProductType["category"][] = [
    "Hoodie",
    "Mug",
    "Phone Case",
    "T-Shirt"
];

const status:ProductType["status"][] = [
    "active",
    "inactive",
];

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice() {
    return Math.floor(Math.random() + 100) + 20;
}

function randomStock() {
    return Math.floor(Math.random() * 100);
}

export async function GET() {
    try {
        await connectDB();
        await Product.deleteMany({});
        const products = Array.from({length: 20}).map((_,i) => ({
            name: `Product ${i + 1}`,
            description: `Description for product ${i + 1}`,
            category: randomItem(category),
            price: randomPrice(),
            stockQuantity: randomStock(),
            imageUrl: "https://via.placeholder.com/150",
            status: randomItem(status),
        }));

        await Product.insertMany(products);
        return NextResponse.json({
            message: "Da them 20 product",
            count: products.length
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Them that bai"},
            {status: 500}
        )
    }
}