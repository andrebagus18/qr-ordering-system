const CashierStatus = ({ status }) => {
  const styles = {
    PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
    SUCCESS: "bg-green-100 text-green-700",
    PROCESSING: "bg-blue-100 text-blue-700",
  };

  const labels = {
    PENDING_PAYMENT: "Pending",
    SUCCESS: "Lunas",
    PROCESSING: "Proses",
  };

  return (
    <span
      className={`rounded-sm p-1 sm:px-2 text-xs sm:text-sm font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

export default CashierStatus;
