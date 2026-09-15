import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://bloomdate-alma15-d.netlify.app";
const title = "Mis XV de Alma · 12 de diciembre";
const description = "Con mucha alegría quiero invitarte a compartir conmigo una noche inolvidable. Abrí la invitación y acompañame a celebrar mis XV 💗";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  openGraph: { title, description, url: "/", siteName: "Mis XV de Alma", type: "website", locale: "es_AR", images: [{ url: "/alma/whatsapp-preview.png", width: 1733, height: 908, alt: "Mis XV de Alma — 12 de diciembre" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/alma/whatsapp-preview.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
