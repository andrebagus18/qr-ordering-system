const CashierStatus = ({ status }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    success: "bg-green-100 text-green-700",
    processing: "bg-blue-100 text-blue-700",
  };

  const labels = {
    pending: "Menunggu Pembayaran",
    success: "Lunas",
    processing: "Sedang Diproses",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

export default CashierStatus;
