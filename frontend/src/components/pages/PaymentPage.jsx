import { useLocation } from "react-router-dom";
import { Banknote, CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Price from "../atoms/Price";

const PaymentPage = () => {
  const location = useLocation();
  const {
    order = null,
    payment = null,
    paymentMethod = "",
  } = location.state || {};
  const isQRIS = paymentMethod === "QRIS";

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Data pesanan tidak ditemukan.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-6">
      <div className="mx-auto max-w-md space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Pembayaran</h1>
          <span className="mt-1 text-md font-bold text-muted-foreground capitalize">
            {order.data.customer_name}
          </span>
          <p className="mt-1 text-sm text-muted-foreground">
            Order #{order.data.order_number}
          </p>
        </div>

        {/* Total */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              <Price value={order.data.total_amount} />
            </p>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isQRIS ? (
                <CreditCard className="size-5" />
              ) : (
                <Banknote className="size-5" />
              )}
              {isQRIS ? "Pembayaran QRIS" : "Pembayaran CASH"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isQRIS ? (
              <>
                <div className="flex justify-center rounded-xl border bg-white p-6">
                  {payment?.qr_code ? (
                    <img
                      src={payment.qr_code}
                      alt="QRIS"
                      className="size-56 object-contain"
                    />
                  ) : (
                    <div className="flex aspect-square w-56 items-center justify-center rounded-lg border-2 border-dashed">
                      <span className="text-sm text-muted-foreground">
                        QR Code belum tersedia
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Scan QRIS menggunakan aplikasi pembayaran Anda.
                </p>
              </>
            ) : (
              <div className="rounded-xl bg-muted p-5 text-center">
                <Banknote className="mx-auto mb-3 size-10" />

                <h3 className="font-semibold">Bayar di Kasir</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Silakan lakukan pembayaran secara tunai kepada kasir.
                </p>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="flex items-center gap-1 text-sm font-medium">
                <CheckCircle2 className="size-4" />
                Menunggu Pembayaran
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Action */}
        <Button className="h-12 w-full">Saya Sudah Bayar</Button>
      </div>
    </div>
  );
};

export default PaymentPage;
