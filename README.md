
# Product Management System
Dự án quản lý sản phẩm 
Fullstack Product Management System tạo ra bằng Next.js App Router.
Cho phép người dùng đăng nhập , đăng ký, đăng xuất và quản lý cũng như thao tác với sản phẩm 
## Demo
-Live URL: https:/productmanager1-rfyce9rzr-krappykings-projects.vercel.app/
- Demo Credentials:
  - Email: admin@bestcustom.co
  - Password: Admin@123
## Tech Stack
-Next.js ( 16 ) App Router
-TypeScript
-MongoDB
-TailwindCSS
-ReactComponent
-Jwt Authentication

## Setup Instructions
1. Clone repo https://github.com/Kippy198/ProductManager -> -cd productmanager
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Update environment variables
5. Run: `npm run dev`

## Features
- User Register, Login, Logout
- Protected DashBoard
- JWT Authentication
- API route with Next.js
- MONGODB Database Integration

## Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
## Run Locally
-npm run dev
##Project Structure
/src
    /app
        /api
            /dashboard
            /login
            /logout
            /products
            /register
            /seed
            /user
        /auth
            /login
                /page.tsx
            /register
                /page.tsx
        /dashboard
            /dashboard
                /page.tsx
            /products
                /[id]
                    /page.tsx
                /modal
                    /page.tsx
            /layout.tsx
            /page.tsx
            /provider ( Toast )
    /component
        /layout
            /Header
            /Sidebar
        /ui     
            /button.tsx
            /card.tsx
            /input.tsx
    /lib
        /auth.ts
        /mongodb.ts
        /useToast.ts
    /models 
        /Product.ts
        /user.ts
    /service
        /productservice.ts
    type 
        /api
        /auth
        /products
        /user    
## Challenges & Solutions
1. Ứng dụng TypeScripts vào để tạo hợp đồng dữ liệu : cách giải quyết là đọc thêm tài liệu và chỉnh sửa theo đúng hướng dẫn ( hiểu rằng tytpescript sẽ rằng buộc kiểu dữ liệu và ngăn chặn sai từ complie-time)
2. Sử dụng những lib của NextJs để hoàn thiện dự án đúng
-> Cần thời gian để nghiên cứu và làm( rất đa dạng và áp dụng cho nhiều trường hợp)
3. Nghiên cứu hoạt động của JWT lẫn cookies trong việc xử lý đăng nhập 
-> Phân tích đúng chức năng của mỗi phần 
## Author
Đỗ Thành Đạt
Github: https://github.com/Kippy198





