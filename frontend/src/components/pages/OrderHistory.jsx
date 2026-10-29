import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { formatRupiah, getPaymentLabel, getPaymentColor } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";

function OrderHistory() {
  const { orders, orderHistory, loading, error } = useOrders();
  const navigate = useNavigate();

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
      <main className="mx-auto max-w-2xl space-y-4 px-4 py-7">
        {loading ? (
          <p className="py-10 text-center text-slate-500">
            Memuat riwayat pesanan...
          </p>
        ) : error ? (
          <p className="py-10 text-center text-red-500">{error}</p>
        ) : orders.length > 0 ? (
          orders.map((item) => {
            const isCompleted = item.status === "COMPLETED";
            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm"
              >
                {/* Order information */}
                <button
                  type="button"
                  onClick={() => handleOrderClick()}
                  className="w-full px-3 py-4 text-left transition hover:bg-slate-50/70"
                >
                  <div className="flex items-start gap-3">
                    {/* Outlet logo placeholder */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-600/30 border border-amber-600 text-center text-[10px] font-extrabold leading-tight text-amber-600">
                      <span>
                        KOPI.
                        <br />
                        kita
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      {!isCompleted && (
                        <span
                          className={`mb-1 inline-flex rounded-md px-3 py-1 text-xs font-semibold tracking-wide ${getPaymentColor(
                            item,
                          )}`}
                        >
                          {getPaymentLabel(item)}
                        </span>
                      )}
                      <h2 className="text-[16px] font-bold text-slate-800">
                        Kopi Kita - Nusantara
                      </h2>
                      <p className="text-[15px] text-base text-slate-800">
                        {formatRupiah(item.price)}{" "}
                        <span className="text-slate-500">
                          ({item.quantity} item)
                        </span>
                      </p>
                      <p className="text-[15px] break-all text-base text-slate-800">
                        #{item.order.order_number}
                      </p>
                    </div>
                    <ChevronRight
                      size={30}
                      strokeWidth={1.8}
                      className="mt-12 shrink-0 text-black cursor-pointer"
                    />
                  </div>
                </button>

                {/* Divider */}
                <div className="mx-4 border-t border-slate-200" />

                {/* Order footer */}
                <div className="flex items-center justify-between p-4 pt-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-amber-600 text-[15px]">
                      {item.order_type === "DINE-IN"
                        ? "Makan di tempat"
                        : "Dibawa Pulang"}
                    </p>

                    <p className="text-xs text-slate-800">{item.createdAt}</p>

                    {!isCompleted && (
                      <p className="text-xs text-slate-500">
                        {item.payment_method === "CASH"
                          ? "Pembayaran tunai"
                          : "Pembayaran QRIS"}
                      </p>
                    )}
                  </div>

                  {isCompleted && (
                    <button
                      type="button"
                      onClick={() => handleOrderAgain()}
                      className="shrink-0 rounded-md bg-amber-600/30 border border-amber-600 px-5 py-1 text-[15px] font-semibold text-slate-800 hover:text-white transition hover:bg-amber-600 active:scale-95 cursor-pointer"
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
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
        🧑‍🍳
      </div>

      <p className="font-semibold text-slate-700">{message}</p>

      <p className="mt-2 text-sm text-slate-500">
        Pesanan kamu akan muncul di sini.
      </p>
    </div>
  );
}

export default OrderHistory;
