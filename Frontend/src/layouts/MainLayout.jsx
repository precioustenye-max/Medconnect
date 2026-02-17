import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const MainLayout = ({ searchTerm, onSearch }) => {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Header */}
      <Header searchTerm={searchTerm} onSearch={onSearch} />

      {/* Page content */}
      <main className="flex-1 pt-10">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default MainLayout;
