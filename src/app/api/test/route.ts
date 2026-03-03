import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";

export async function GET() {
    await connectDB();
    return NextResponse.json({ message : "DB connected"});
}