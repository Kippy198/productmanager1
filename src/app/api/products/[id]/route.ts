import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import Product from "@/src/models/Product";
import { Types } from "mongoose";
import { ProductType } from "@/src/type/product";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{id: string}> }
) {
  try {
    await connectDB();
    const {id: productId} = await context.params;

    if(!Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        {message: "Id InValid"},
        {status: 400}
      )
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy chi tiết sản phẩm" },
      { status: 500 }
    );
  }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID không hợp lệ" },
        { status: 400 }
      );
    }

    const body: ProductType = await req.json();
    const { name, description, category, price, stockQuantity, imageUrl, status } = body;

    if (!name || !category || price === undefined || stockQuantity === undefined || !imageUrl || !status) {
      return NextResponse.json(
        { message: "Thiếu các trường bắt buộc" },
        { status: 400 }
      );
    }

    if (price < 0 || stockQuantity < 0) {
      return NextResponse.json(
        { message: "Giá và số lượng phải >= 0" },
        { status: 400 }
      );
    }

    const urlPattern = /^(https?:\/\/[^/s$.?#].[^\s]*$)/;
    if (!urlPattern.test(imageUrl)) {
      return NextResponse.json(
        { message: "Định dạng link không đúng" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      body,
      { new: true ,
        runValidators: true,
      }
    );

    if (!product) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      data: product,
    });
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error);
    return NextResponse.json(
      { message: "Lỗi cập nhật sản phẩm" },
      { status: 500 }
    );
  }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: productId } = await context.params;

    if (!Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "ID không hợp lệ" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      message: "Xóa sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error);
    return NextResponse.json(
      { message: "Lỗi xóa sản phẩm" },
      { status: 500 }
    );
  }
}
