export { cn } from "cn";

export function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getPaymentLabel(order) {
  if (order.paymentStatus === "SUCCESS") {
    return "Sudah Dibayar";
  }

  if (order.paymentStatus === "FAILED") {
    return "Pembayaran Gagal";
  }

  if (order.paymentStatus === "EXPIRED") {
    return "Kedaluwarsa";
  }

  if (order.paymentMethod === "CASH") {
    return "Belum Dibayar";
  }

  return "Menunggu Pembayaran";
}

export function getPaymentColor(order) {
  if (order.paymentStatus === "SUCCESS") {
    return "bg-green-100 text-green-700";
  }

  if (order.paymentStatus === "FAILED" || order.paymentStatus === "EXPIRED") {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-700 text-white";
}
