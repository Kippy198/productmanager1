import { UserModel } from '@/src/models/User';
import  bcrypt  from 'bcrypt';
import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";

export async function GET() {
    await connectDB()

    const existing = await UserModel.findOne({email: "admin@test.com"})
    if(existing) {
        return NextResponse.json(
            {
                message: "User da ton tai"
            }
        )
    }

    const hashedPass = await bcrypt.hash("123456", 10)

    await UserModel.create({
        email: "admin@test.com",
        password: hashedPass,
    })

    return NextResponse.json(
        {message : "Tao tai khoan thanh cong",}
    )
}