import { CheckCircle } from "lucide-react";

const QrisSection = () => {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <CheckCircle size={20} className="text-green-600" />

        <h2 className="text-lg font-semibold text-gray-800">
          Pembayaran QRIS Berhasil
        </h2>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-600">
          Pembayaran QRIS yang berhasil akan otomatis dikonfirmasi oleh sistem.
        </p>

        <p className="mt-2 text-sm font-medium text-green-600">
          Tidak memerlukan konfirmasi manual dari kasir.
        </p>
      </div>
    </section>
  );
};

export default QrisSection;
