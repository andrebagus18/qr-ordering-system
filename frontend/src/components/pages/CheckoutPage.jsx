import { ArrowLeft, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Price from "../atoms/Price";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { usePayment } from "../hooks/usePayments";

const CheckoutPage = () => {
  const { loading: loadingOrder, handleSubmit: submitOrder } = useOrders();
  const { loading: loadingPayment, create: submitPayment } = usePayment();
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const location = useLocation();
  const { cartItems = [], orderType = "" } = location.state || {};
  const navigate = useNavigate();
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const handleSubmit = async () => {
    try {
      const orderResponse = await submitOrder({
        cartItems,
        customerName,
        orderType,
      });
      console.log("order berhasil", orderResponse);
      const paymentResponse = await submitPayment({
        order_id: orderResponse.data.id,
        payment_method: paymentMethod,
      });
      console.log("payment berhasil", paymentResponse);
      navigate("/payments", {
        state: {
          order: orderResponse,
          payment: paymentResponse.data,
          paymentMethod,
        },
      });
    } catch (error) {
      console.error("checkout gagal", error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/menu")}>
            <ArrowLeft />
          </Button>
          <h1 className="text-lg font-bold">Checkout</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5 pb-32">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pesanan Kamu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.name}</p>

                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × Rp{" "}
                    {Number(item.price).toLocaleString("id-ID")}
                  </p>
                </div>

                <Price value={item.price * item.quantity} />
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-medium">Total</span>
              <Price value={total} />
            </div>
          </CardContent>
        </Card>

        {/* Order Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tipe Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border bg-muted/30 px-4 py-3">
              <p className="text-sm text-muted-foreground">Tipe pesanan</p>
              <p className="mt-1 font-semibold">
                {orderType === "DINE-IN" ? "Dine In" : "Take Away"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Customer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="customer-name">Nama</Label>
            <Input
              id="customer-name"
              placeholder="Masukkan nama kamu"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metode Pembayaran</CardTitle>
          </CardHeader>

          <CardContent>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="gap-3"
            >
              {/* QRIS */}
              <label
                htmlFor="qris"
                className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition hover:bg-muted/50"
              >
                <RadioGroupItem value="QRIS" id="qris" />
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <CreditCard className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">QRIS</p>
                  <p className="text-sm text-muted-foreground">
                    Bayar menggunakan QRIS
                  </p>
                </div>
              </label>
              {/* CASH */}
              <label
                htmlFor="cash"
                className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition hover:bg-muted/50"
              >
                <RadioGroupItem value="CASH" id="cash" />
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Banknote className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Cash</p>
                  <p className="text-sm text-muted-foreground">
                    Bayar langsung di kasir
                  </p>
                </div>
              </label>
            </RadioGroup>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Checkout */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Total Pembayaran</p>
            <Price value={total} />
          </div>
          <Button
            className="h-12 px-6"
            disabled={
              !customerName || !paymentMethod || loadingOrder || loadingPayment
            }
            onClick={handleSubmit}
          >
            {loadingOrder || loadingPayment
              ? "Membuat pesanan"
              : "Buat Pesanan"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
