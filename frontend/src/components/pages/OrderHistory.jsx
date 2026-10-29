import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const orders = [
  {
    id: 1,
    orderNumber: "ORD000123",
    outlet: "Mie Gacoan Mojokerto - Pemuda",
    total: 17000,
    totalItems: 2,
    orderType: "DINE_IN",
    paymentMethod: "CASH",
    paymentStatus: "PENDING",
    orderStatus: "PENDING_PAYMENT",
    createdAt: "16 Okt 2026, 22:31",
  },
  {
    id: 2,
    orderNumber: "ORD000124",
    outlet: "Mie Gacoan Mojokerto - Pemuda",
    total: 17000,
    totalItems: 2,
    orderType: "DINE_IN",
    paymentMethod: "CASH",
    paymentStatus: "PENDING",
    orderStatus: "PENDING_PAYMENT",
    createdAt: "16 Okt 2026, 22:30",
  },
  {
    id: 3,
    orderNumber: "ORD000125",
    outlet: "Mie Gacoan - Mojokerto",
    total: 53000,
    totalItems: 3,
    orderType: "TAKE_AWAY",
    paymentMethod: "QRIS",
    paymentStatus: "SUCCESS",
    orderStatus: "COMPLETED",
    createdAt: "2 Agu 2026, 20:34",
  },
];

function getPaymentLabel(order) {
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

function getPaymentColor(order) {
  if (order.paymentStatus === "SUCCESS") {
    return "bg-green-100 text-green-700";
  }

  if (order.paymentStatus === "FAILED" || order.paymentStatus === "EXPIRED") {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-500 text-white";
}

export default function OrderHistory({ onOrderClick, onOrderAgain }) {
  const navigate = useNavigate();
  const completedOrders = orders.filter(
    (order) => order.orderStatus === "COMPLETED",
  );

  const pendingOrders = orders.filter(
    (order) => order.orderStatus !== "COMPLETED",
  );

  function handleOrderClick(order) {
    if (onOrderClick) {
      onOrderClick(order);
    } else {
      console.log("Detail pesanan:", order);
    }
  }

  function handleOrderAgain(order) {
    if (onOrderAgain) {
      onOrderAgain(order);
    } else {
      console.log("Pesan lagi:", order);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-20 flex h-[76px] items-center justify-center border-b border-slate-100 bg-white px-5 shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/menu")}
          aria-label="Kembali"
          className="absolute left-5 flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
        >
          <ArrowLeft size={28} strokeWidth={2} />
        </button>

        <h1 className="text-xl font-bold">Riwayat</h1>
      </header>

      {/* Tabs */}
      {/* <div className="sticky top-[76px] z-10 grid grid-cols-2 border-b border-slate-100 bg-white px-4">
        <button
          type="button"
          onClick={() => setActiveTab("pesan")}
          className={`relative flex h-[76px] items-center justify-center text-lg font-semibold transition ${
            activeTab === "pesan"
              ? "text-indigo-700"
              : "text-gray-500 hover:text-slate-700"
          }`}
        >
          Pesan
          {activeTab === "pesan" && (
            <span className="absolute right-0 bottom-0 left-0 h-[3px] bg-pink-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reservasi")}
          className={`relative flex h-[76px] items-center justify-center text-lg font-semibold transition ${
            activeTab === "reservasi"
              ? "text-indigo-700"
              : "text-gray-500 hover:text-slate-700"
          }`}
        >
          Reservasi
          {activeTab === "reservasi" && (
            <span className="absolute right-0 bottom-0 left-0 h-[3px] bg-pink-500" />
          )}
        </button>
      </div> */}

      {/* Content */}
      <main className="mx-auto max-w-2xl space-y-5 px-4 py-7">
        {orders.length > 0 ? (
          orders.map((order) => {
            const isCompleted = order.orderStatus === "COMPLETED";
            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm"
              >
                {/* Order information */}
                <button
                  type="button"
                  onClick={() => handleOrderClick(order)}
                  className="w-full p-5 text-left transition hover:bg-slate-50/70"
                >
                  <div className="flex items-start gap-3">
                    {/* Outlet logo placeholder */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-950 text-center text-[10px] font-extrabold leading-tight text-white">
                      <span>
                        MIE
                        <br />
                        GACOAN
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      {!isCompleted && (
                        <span
                          className={`mb-2 inline-flex rounded-md px-3 py-1 text-sm font-semibold tracking-wide ${getPaymentColor(
                            order,
                          )}`}
                        >
                          {getPaymentLabel(order)}
                        </span>
                      )}

                      <h2 className="text-[18px] font-bold leading-snug text-slate-800">
                        {order.outlet}
                      </h2>

                      <p className="mt-1 text-base text-slate-800">
                        {formatRupiah(order.total)}{" "}
                        <span className="text-slate-500">
                          ({order.totalItems} item)
                        </span>
                      </p>

                      <p className="mt-1 break-all text-base font-medium text-slate-800">
                        #{order.orderNumber}
                      </p>
                    </div>

                    <ChevronRight
                      size={30}
                      strokeWidth={1.8}
                      className="mt-12 shrink-0 text-black"
                    />
                  </div>
                </button>

                {/* Divider */}
                <div className="mx-5 border-t border-slate-200" />

                {/* Order footer */}
                <div className="flex items-center justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <p className="font-semibold text-amber-600">
                      {order.orderType === "DINE_IN"
                        ? "Makan di tempat"
                        : "Dibawa Pulang"}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {order.createdAt}
                    </p>

                    {!isCompleted && (
                      <p className="mt-1 text-xs text-slate-500">
                        {order.paymentMethod === "CASH"
                          ? "Pembayaran tunai"
                          : "Pembayaran QRIS"}
                      </p>
                    )}
                  </div>

                  {isCompleted && (
                    <button
                      type="button"
                      onClick={() => handleOrderAgain(order)}
                      className="shrink-0 rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-600 active:scale-95"
                    >
                      Pesan Lagi
                    </button>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <EmptyState message="Belum ada riwayat pesanan." />
        )}
      </main>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
        🍜
      </div>

      <p className="font-semibold text-slate-700">{message}</p>

      <p className="mt-2 text-sm text-slate-500">
        Pesanan kamu akan muncul di sini.
      </p>
    </div>
  );
}
