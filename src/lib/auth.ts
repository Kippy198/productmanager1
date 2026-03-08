import { LoginType, RegisterType  } from "../type/auth";
import { ApiResponse } from "../type/api";
import { UserType } from "../type/user";

export async function login(data: LoginType): Promise<UserType> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result: ApiResponse<UserType> = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Đăng nhập thất bại");
  }

  return result.data;
}

export async function logout(): Promise<void> {
  const res = await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Đăng xuất thất bại");
  }
}

export async function register(data: RegisterType): Promise<UserType> {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result: ApiResponse<UserType> = await res.json() ;

  if (!res.ok) {
    throw new Error(result.message || "Đăng ký thất bại");
  }

  return result.data;
}