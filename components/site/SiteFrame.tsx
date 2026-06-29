import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/** Shared chrome (nav + footer) wrapping every public page. */
export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
