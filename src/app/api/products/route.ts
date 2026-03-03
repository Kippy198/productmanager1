import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { PaginationProduct } from "@/src/service/product.service";
import Product from "@/src/models/Product";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const {searchParams} = new URL(req.url);

        const query: any = {};
        
        const search = searchParams.get("search");
        if (search) query.search = search;
        
        const category = searchParams.get("category");
        if (category) query.category = category;
        
        const minPrice = searchParams.get("minPrice");
        if (minPrice) query.minPrice = Number(minPrice);
        
        const maxPrice = searchParams.get("maxPrice");
        if (maxPrice) query.maxPrice = Number(maxPrice);
        
        const sortBy = searchParams.get("sortBy");
        if (sortBy) query.sortBy = sortBy;
        
        const order = searchParams.get("order");
        if (order) query.order = order;
        
        const page = searchParams.get("page");
        if (page) query.page = Number(page);
        
        const limit = searchParams.get("limit");
        if (limit) query.limit = Number(limit);

        const result = await PaginationProduct(query);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            {message: "Loi khong lay dc url"},
            {status: 500}
        )
    }
}

export async function POST(request:NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        const {name,description,category,price, stockQuantity,imageUrl, status} = body;
        if (!name || !category || price === undefined || stockQuantity === undefined || !imageUrl) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        if (price < 0 || stockQuantity < 0) {
            return NextResponse.json(
                { message: "Price and Stock must be >= 0" },
                { status: 400 }
            );
        }
        const urlPattern = /^(https?:\/\/[^/s$.?#].[^\s]*$)/;
        if(!urlPattern.test(imageUrl)){
            return NextResponse.json(
                {message: "Khong dung dinh dang link"},
                {status: 500}
            )
        }
        const product = await Product.create({
            name,
            description,
            category,
            price,
            stockQuantity,
            imageUrl,
            status,
        });

        return NextResponse.json(product, {status: 201});
    } catch (error) {
        return NextResponse.json(
            {mesage: "Khong tao duoc san pham moi"},
            {status: 500}
        )
    }
}