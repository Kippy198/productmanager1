import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { PaginationProduct } from "@/src/service/product.service";
import Product from "@/src/models/Product";
import { ProductType, TotalQuery } from "@/src/type/product";


export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const {searchParams} = new URL(req.url);
        const query: Partial<TotalQuery> = {};

        const search = searchParams.get("search");
        if(search) query.search = search;
        
        const category = searchParams.get("category");
        if(category) query.category = category
    
        const sortBy = searchParams.get("sortBy");
        if (sortBy === "price" || sortBy === "createdAt") query.sortBy = sortBy;
        
        const order = searchParams.get("order");
        if (order === "asc" || order === "desc") query.order = order;
        
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
/*Dung searchParam để phân tích url thành các giá trị cho vào query
=> truyền query vào service( PagiantionProduct) để xử lý => có meta + data => API trả json về frontend*/ 
/*Tao patial query để định dạng đúng kiểu type sẽ trả về service */
export async function POST(request:NextRequest) {
    try {
        await connectDB();
        const body: ProductType = await request.json() 
        const {name, description,category,price, status,stockQuantity,imageUrl} = body;
        if(!name || !category || !description || category === undefined || price === undefined || stockQuantity === undefined || !status ||!imageUrl) {
            return NextResponse.json(
                {message: "Missing field"},
                {status: 400}
            )
        }

        if (price < 0 || stockQuantity < 0) {
            return NextResponse.json(
                { message: "Price and Stock must be >= 0" },
                { status: 400 }
            );
        }

        const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*$)/;
        if(!urlPattern.test(imageUrl)){
            return NextResponse.json(
                {message: "Khong dung dinh dang link"},
                {status: 400}
            )
        }
        const product = await Product.create(body);

        return NextResponse.json(product, {status: 201});
    } catch (error) {
        return NextResponse.json(
            {mesage: "Khong tao duoc san pham moi"},
            {status: 500}
        )
    }
}