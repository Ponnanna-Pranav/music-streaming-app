import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#121212",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: "24px",
          paddingBottom: "120px",
          backgroundColor: "#121212",
        }}
      >
        {children}
      </main>


    </div>
  );
};

export default MainLayout;
