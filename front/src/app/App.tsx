import { Route, Routes } from "react-router";
import { Home } from "../pages/home/Home";
import { CatalogsList } from "../pages/catalog/Catalogs-list";
import { CatalogCreate } from "../pages/catalog/catalogCreate/catalogCreate";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalog" element={<CatalogsList />}></Route>
      <Route path="/create" element={<CatalogCreate />}></Route>
    </Routes>
  );
}

export default App;
