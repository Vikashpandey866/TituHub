import { DM_Sans, Syne } from "next/font/google";
import "@/styles/globals.css";
import { AppProviders } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import Modals from "@/components/layout/Modals";
import Toast from "@/components/ui/Toast";
import TituBot from "@/components/features/TituBot";
import FloatingActions from "@/components/layout/FloatingActions";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export const metadata = {
  metadataBase: new URL("https://tituhub.com"),
  title: {
    default: "TituHub | Premium Restaurant, Fashion & PrintHub Platform",
    template: "%s | TituHub"
  },
  description: "TituHub is a premium multi-business ecommerce platform for restaurant ordering, fashion shopping, PrintHub services, checkout, orders and admin operations.",
  keywords: ["TituHub", "premium ecommerce", "restaurant ordering", "fashion ecommerce", "PrintHub", "food ordering", "print services"],
  applicationName: "TituHub",
  openGraph: {
    title: "TituHub",
    description: "Restaurant, fashion and PrintHub services in one premium commerce platform.",
    type: "website"
  }
};

export const viewport = {
  themeColor: "#FF6B00"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <AppProviders>
          <Navbar />
          <main className="min-h-screen pb-28 pt-16 lg:pb-0">{children}</main>
          <Footer />
          <CartDrawer />
          <Modals />
          <Toast />
          <TituBot />
          <FloatingActions />
          <MobileBottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
