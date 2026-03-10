import Product from "../models/Product";
import { SortOrder } from "mongoose";
import { TotalQuery,ProductQuery, SortQuery } from "../type/product";

type SortType = Record<string, SortOrder | {$meta: "textScore"}>


export function Filter(query: ProductQuery) {
    const {search, category, status } = query;
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
    const {order = "asc",search,sortBy} = query;/* neu ko co order thi default la asc*/
    const sortOrder = order === "asc" ? 1 : -1 ;
    const sort: SortType = {};
    if(search && search.trim().length > 0){
        sort.score = {$meta: "textScore"};
    }
    if(sortBy) {
        sort[sortBy] = sortOrder/*sort[price] = sortBy => {price : -1} => tang dan*/
    }
    sort.createdAt = 1;
    return sort

}

export async function PaginationProduct(query: Partial<TotalQuery>) /* nhận query từ api để xử lý*/
{
    const {page, limit ,search} = query

    const currentPage = query.page ?Number(page) : 1;
    const limitPage = query.limit ?Number(limit) : 0;
    const skip = (currentPage - 1) * limitPage;

    const filter = Filter(query);
    const sort = Sort(query);

    const projection = search && search.trim().length > 0 
                ? {score : {$meta: "textScore"}}
                : {}
    let queryBuilder = Product.find(filter, projection).sort(sort);
    
    if(limitPage > 0) {
        queryBuilder = queryBuilder.skip(skip).limit(limitPage)
    }                   

    const products = await queryBuilder.lean(); /*trả về plain object*/
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