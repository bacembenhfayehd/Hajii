import Chat from "@/components/chat/Chat";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AuthLayout({ children }) {
  return (
    <>
      <Navbar/>
      {children}
      <Chat/>
      <Footer/>
    </>
  );
}