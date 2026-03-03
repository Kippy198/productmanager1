import Product, { ProductDocument } from "../models/Product";
import { SortOrder } from "mongoose";

type SortType = Record<string, SortOrder | {$meta: "textScore"}>;

interface ProductQuery {
    search?: string,
    category?: string;
    status?: string;
}

interface SortQuery {
    search?: string;
    sortBy?: "price" | "createdAt";
    order?: "asc" | "desc"
}

interface PaginationQuery {
    page?: number,
    limit?: number,
}

export function Filter(query: ProductQuery) {
    const {search, category,status} = query;
    const filter: any = {};

    if(search) {
        filter.$text = {$search: search};
    }

    if(category) {
        filter.category = category;
    }

    if(status) {
        filter.status = status;
    }

    return filter;
}

export function Sort(query: SortQuery): SortType {
    const { search , sortBy , order } = query;
    const sortOrder = order === "asc" ? 1 : -1;
    const sort: SortType = {};

    if(search && search.trim().length > 0) {
        sort.score = { $meta: "textScore"};

        if(sortBy) {
            sort[sortBy] = sortOrder;
        }
        return sort;
    }
    if (sortBy) {
        sort[sortBy] = sortOrder;
        return sort;
    }
    
    sort.createdAt = -1;
    return sort;
}

export async function PaginationProduct(query: ProductQuery & SortQuery & PaginationQuery) 
{
    const {
        page,
        limit,
        search,
    } = query;

    const currentPage = page? Number(page): 1;
    const limitPage =limit? Number(limit): 0;
    const skip = (currentPage - 1) * limitPage;

    const filter = Filter(query);
    const sort = Sort(query);

    const projection =
    search && search.trim().length > 0
      ? { score: { $meta: "textScore" } }
      : {};
    
    let queryBuilder = Product.find(filter, projection).sort(sort);

    if (limitPage > 0) {
        queryBuilder = queryBuilder.skip(skip).limit(limitPage);
    }

    const products = await queryBuilder.lean();
    const total = await Product.countDocuments(filter);
    const totalPages = limitPage > 0 
        ? Math.ceil(total / limitPage) 
        : 1;

    return {
        data: products,
        meta: {
            page: currentPage,
            limit: limitPage,
            total,
            totalPages,
        },
    };
}