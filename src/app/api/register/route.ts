import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import User from '@/src/models/User';
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã được sử dụng" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Đăng ký thành công, vui lòng đăng nhập" },
      { status: 201 }
    );
    
  } catch (error) {
    console.log("Register error: ", error);
    return NextResponse.json(
      { message: "Lỗi server" },
      { status: 500 }
    );
  }
}