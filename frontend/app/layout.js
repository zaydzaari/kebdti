import "@fontsource-variable/readex-pro";
import "@fontsource-variable/bricolage-grotesque";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/screens.css";
import "./styles/live.css";

export const metadata = {
  title: "Kebdti · A little closer",
  icons: {icon: "/brand/kebdti-mark.svg", apple: "/brand/kebdti-icon-180.png"},
  description: "Family voice notes, translated between Darija and the languages your family speaks.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4efe7" },
    { media: "(prefers-color-scheme: dark)", color: "#12100e" },
  ],
};

// Applies the saved theme before paint, so there's no light/dark flash.
const themeScript = `try{var t=localStorage.getItem('kebdti-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
