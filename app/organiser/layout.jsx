import "../globals.css";

export const metadata = {
  title: "NeoFairs",
  description: "NeoFairs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
