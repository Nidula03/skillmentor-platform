import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

export default function Layout() {
  return (
    <section className="min-h-screen flex flex-col">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </section>
  );
}
