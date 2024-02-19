import Navigation from "@/components/site/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}
