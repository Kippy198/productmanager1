
#Project Name 
Dự án quản lý sản phẩm 
Fullstack Product Management System tạo ra bằng Next.js App Router.
Cho phép người dùng đăng nhập , đăng ký, đăng xuất và quản lý cũng như thao tác với sản phẩm 
## Demo
https:/productmanager1-rfyce9rzr-krappykings-projects.vercel.app/
##Tech Stack
-Next.js ( 16 ) App Router
-TypeScript
-MongoDB
-TailwindCSS
-ReactComponent
-Jwt Authentication

##Features
- User Register, Login, Logout
-Protected DashBoard
-JWT Authentication
-API route with Next.js
-MONGODB Database Integration

##Install dependencies: 
-git clone : https://github.com/Kippy198/ProductManager 
- cd productmanager
-npm install
-create a `.env.local` file : 
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key

##Run Locally
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
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##Author

Đỗ Thành Đạt
Github: https://github.com/Kippy198


