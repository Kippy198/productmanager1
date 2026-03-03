import  bcrypt  from 'bcrypt';
import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import User from "@/src/models/User";

export async function GET() {
    await connectDB()

    const existing = await User.findOne({email: "admin@test.com"})
    if(existing) {
        return NextResponse.json(
            {
                message: "User da ton tai"
            }
        )
    }

    const hashedPass = await bcrypt.hash("123456", 10)

    await User.create({
        email: "admin@test.com",
        password: hashedPass,
    })

    return NextResponse.json(
        {message : "Tao tai khoan thanh cong",}
    )
}