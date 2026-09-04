import Navbar from './Navbar';
import Footer from './Footer';
import ChatWidget from '../chat/ChatWidget';

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col relative">
    <Navbar />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
    <ChatWidget />
  </div>
);

export default Layout;
