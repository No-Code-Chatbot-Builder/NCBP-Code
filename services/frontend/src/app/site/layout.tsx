import Footer from "@/components/site/footer";
import Navigation from "@/components/site/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
