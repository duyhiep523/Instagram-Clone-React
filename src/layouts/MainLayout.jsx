import Sidebar from "../components/Sidebar/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1 }}>{children}</main>
      
    </div>
  );
};
