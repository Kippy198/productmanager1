import { UserModel } from './../../../models/User';
import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";

export async function POST( request: Request) {
  try {
    await connectDB();
    const { email, password} = await request.json()
    
    if( !email || !password) 
        return NextResponse.json(
            {message: "Khong tim thay du lieu"},
            {status: 400}
        );

    const user = await UserModel.findOne({email});
    if(!user) {
        return NextResponse.json(
            {message: "Khong tim thay nguoi dung"},
            {status: 401}
        );
    }
    // Đây là khi chỉ co 1 tai khoan admin, sau nay co db user se doi 
    // if(email !== "admin@test.com" || password !== "123456") {
    //     return NextResponse.json(
    //         {message: "Nhap sai tai khoan hoac mat khau admin"},
    //         {status: 401}
    //     )
    // }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return NextResponse.json(
            {message: "Nhap sai mat khau"},
            {status: 401 }
        )
    }
    
    if (!process.env.JWT_SECRET) {
       return NextResponse.json(
            { message: "Server configuration error" },
            { status: 500 }
        )
    }

    const token = jwt.sign(
        {  
            name: user.name
        },
        process.env.JWT_SECRET!,
        {expiresIn: "1d"}
    )
    
    const response = NextResponse.json({message: "Dang nhap thanh cong"});
    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24
    })

    return response;
    
  } catch (error) {
    console.log("Login error: ", error);
    return NextResponse.json(
        {message: "Loi server"},
        {status: 500}
    )
  }  
  
}