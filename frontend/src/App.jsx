import Navbar from "./components/Navbar";
import Home from "./pages/Home";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col">
      <Navbar />
      <Home />
    </div>
  );
};

export default App;
