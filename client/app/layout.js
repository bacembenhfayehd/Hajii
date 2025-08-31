import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import Chat from "@/components/chat/Chat";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export const metadata = {
  title: "Haji cosmétique"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Material Symbols pour les icônes */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded"
          rel="stylesheet"
        />
      </head>
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <AppContextProvider>
          <Toaster />
          {children}
          <Chat />
        </AppContextProvider>
      </body>
    </html>
  );
}
