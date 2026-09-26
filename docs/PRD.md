"""# QR Ordering System — PRD

## 1. Overview

QR Ordering System adalah aplikasi pemesanan makanan/snack berbasis QR Code untuk mempermudah proses pemesanan di outlet.

Customer dapat memesan tanpa login melalui QR Code yang tersedia di meja. Admin/Kasir menangani order dan pembayaran, sedangkan proses pesanan dilakukan melalui area Kitchen di dalam Management Outlet.

## 2. Problem

Proses pemesanan saat ini masih menggunakan kertas. Kasir menerima pesanan secara manual dan proses tersebut membutuhkan komunikasi/perpindahan antara customer, kasir, dan kitchen.

Sistem ini dibuat untuk mengurangi proses manual dan membuat alur order lebih terstruktur.

## 3. Goal

- Customer dapat melihat menu dan membuat pesanan dari meja.
- Mendukung Dine In dan Take Away.
- Kasir dapat memantau order dan mengonfirmasi pembayaran.
- Kitchen hanya memproses order yang sudah dibayar.
- Admin/Kasir dapat mengubah status ketersediaan menu menjadi tersedia/habis.
- Customer dapat melihat status pesanannya.

## 4. Users

### Customer

Customer tidak perlu login.

Customer dapat:

- Membuka menu melalui QR.
- Untuk Dine In, meja ditentukan dari QR.
- Mengisi nama.
- Memilih produk.
- Membuat order.
- Melihat status order.

### Admin / Kasir

Admin/Kasir wajib login dan diarahkan ke Management Outlet.

Admin/Kasir dapat:

- Melihat order.
- Melihat detail order.
- Mengonfirmasi pembayaran.
- Mengelola menu.
- Mengubah status produk tersedia/habis.
- Membuka tampilan Kitchen.

Kitchen tidak memiliki login/role sendiri dan menjadi bagian dari Management Outlet.

## 5. Order Types

### Dine In

Customer melakukan scan QR yang berada di meja.

QR mengidentifikasi meja secara otomatis.

Customer kemudian mengisi nama dan melakukan pemesanan.

### Take Away

Customer memilih Take Away, mengisi nama, lalu melakukan pemesanan tanpa meja.

## 6. Core Order Flow

mermaid
flowchart TD
A[Customer] --> B{Order Type}
B -->|Dine In| C[Scan QR]
C --> D[Table Identified]
B -->|Take Away| E[No Table]
D --> F[Input Customer Name]
E --> F
F --> G[View Menu]
G --> H[Add Products to Cart]
H --> I[Create Order]
I --> J[PENDING_PAYMENT]
J --> K[QRIS Payment]
K --> L{Payment Success?}
L -->|No| J
L -->|Yes| M[PROCESSING]
M --> N[Kitchen]
N --> O[READY]
O --> P[COMPLETED]

## 7. Order Status

- PENDING_PAYMENT — order dibuat tetapi pembayaran belum berhasil.
- PROCESSING — pembayaran berhasil dan pesanan sedang dibuat.
- READY — pesanan sudah selesai dibuat.
- COMPLETED — pesanan selesai/diterima customer.
- CANCELLED — pesanan dibatalkan.

## 8. Business Rules

### Payment Gate

Order yang belum dibayar tidak boleh diproses oleh Kitchen.

text
PENDING_PAYMENT
↓
Customer pays via QRIS
↓
Payment Gateway confirms payment
↓
Payment SUCCESS
↓
Order becomes PROCESSING
↓
Kitchen can process

### Product Availability

Admin/Kasir dapat mengubah produk menjadi:

- AVAILABLE
- UNAVAILABLE

Jika produk UNAVAILABLE, customer tidak dapat membuat order untuk produk tersebut.

Availability harus tetap divalidasi oleh backend ketika order dibuat.

### Price and Total

Customer/frontend tidak dipercaya untuk menentukan harga atau total.

Backend mengambil harga produk dari database dan menghitung subtotal serta total order.

### Table

Untuk Dine In, meja ditentukan berdasarkan QR Code.

Customer tidak dapat memilih atau mengubah table_id secara bebas dari frontend.

### Customer Authentication

Customer tidak perlu login.

### Staff Authentication

Admin/Kasir wajib login.

## 9. Basic Security

- Backend melakukan validation terhadap seluruh input.
- Customer tidak dapat mengubah status pembayaran menjadi PAID.
- Customer tidak dapat mengubah harga atau total order.
- Kitchen hanya dapat memproses order dengan status PAID.
- Endpoint penting menggunakan rate limiting dasar.
- Authorization staff dilakukan berdasarkan role ADMIN/CASHIER bila diperlukan.

Security dibuat sederhana dan sesuai kebutuhan MVP, tanpa menambahkan mekanisme yang belum diperlukan.

## 10. MVP Scope

### Included

- Customer mobile-first menu.
- QR meja.
- Customer name.
- Dine In.
- Take Away.
- Product/category management sederhana.
- Cart.
- Create order.
- Order status.
- Cashier dashboard.
- Payment confirmation.
- Kitchen view di Management Outlet.
- Product availability.

### Not Included Initially

- Customer account/login.
- Payment gateway.
- Inventory management kompleks.
- Loyalty system.
- Multi-outlet.
- Advanced reporting.
- Customer permission system.
- Separate Kitchen login.
  """
