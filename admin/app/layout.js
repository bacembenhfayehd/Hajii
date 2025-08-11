import Navbar from "@/components/Navbar";
import "./globals.css";
import SideBar from "@/components/Sidebar";
import { AdminContextProvider } from "@/context/AdminContext";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="flex w-full'">
          <SideBar />
          <AdminContextProvider>
          {children}
           <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4aed88',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ff4b4b',
              },
            },
          }}
        />
          </AdminContextProvider>
        </div>
      </body>
    </html>
  );
}
