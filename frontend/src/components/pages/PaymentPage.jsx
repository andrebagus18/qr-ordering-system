import { useLocation, useNavigate } from "react-router-dom";
import { Banknote, CheckCircle2, CreditCard, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Price from "../atoms/Price";
import { usePayment } from "../hooks/usePayments";
import { useEffect, useState } from "react";

const PaymentPage = () => {
  const { getStatus } = usePayment();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    order = null,
    payment = null,
    paymentMethod = "",
  } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState(
    payment?.status ?? "PENDING",
  );
  const [copied, setCopied] = useState(false);
  const isQRIS = paymentMethod === "QRIS";
  const isPaid = paymentStatus === "SUCCESS";
  const handleQR = async () => {
    if (!payment?.qr_code) return;
    await navigator.clipboard.writeText(payment.qr_code);
    setCopied(true);
  };
  useEffect(() => {
    if (!isQRIS || !payment?.payment?.id || paymentStatus === "SUCCESS") {
      return;
    }
    let active = true;
    const check = async () => {
      try {
        const result = await getStatus(payment.payment.id);
        if (active) {
          setPaymentStatus(result.status);
        }
      } catch (error) {
        console.error("Gagal mengecek status pembayaran", error);
      }
    };
    check();
    const timer = setInterval(check, 3000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [isQRIS, payment?.payment?.id, paymentStatus, getStatus]);

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
  if (isPaid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center px-6 py-10 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="size-9 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Pembayaran Berhasil!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Pembayaran kamu telah dikonfirmasi. Pesanan sedang diproses.
            </p>
            <div className="mt-6 w-full rounded-xl bg-muted p-4 text-left">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Nomor Pesanan</span>
                <span className="font-semibold">{order.order_number}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Nama Pemesan
                </span>
                <span className="font-semibold capitalize">
                  {order.customer_name}
                </span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <Price value={order.total_amount} />
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Status Pembayaran
                </span>
                <span className="font-semibold text-green-500">
                  {paymentStatus}
                </span>
              </div>
            </div>
            <Button
              className="mt-6 h-12 w-full"
              onClick={() => navigate("/menu", { replace: true })}
            >
              Kembali ke Menu
            </Button>
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
            {order.customer_name}
          </span>
          <p className="mt-1 text-sm text-muted-foreground">
            Order #{order.order_number}
          </p>
        </div>

        {/* Total */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              <Price value={order.total_amount} />
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
                {payment?.qr_code && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleQR}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 size-4" />
                        URL Berhasil Disalin
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 size-4" />
                        Copy URL QR
                      </>
                    )}
                  </Button>
                )}
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
