import SummaryCard from "../molecules/SummaryCard";
import { Wallet, ShoppingBag, QrCodeIcon, Clock } from "lucide-react";

const SummarySection = ({ summary, loading }) => {
  if (loading) {
    return <p>Memuat dashboard...</p>;
  }
  if (!summary) {
    return <p>Gagal memuat data.</p>;
  }
  const cards = [
    {
      title: "Total Cash",
      value: summary.cashPayments,
      icon: Wallet,
    },
    {
      title: "Total Qris",
      value: summary.qrisPayments,
      icon: QrCodeIcon,
    },
    {
      title: "Total Orders",
      value: summary.total_orders,
      icon: ShoppingBag,
    },
    {
      title: "Order Process",
      value: summary.processing_orders,
      icon: Clock,
    },
  ];

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((item) => (
        <SummaryCard key={item.title} {...item} />
      ))}
    </section>
  );
};

export default SummarySection;
