import { BrowserRouter, Route, Routes } from "react-router";
import { ThemeProvider } from "./components/ui/ThemeProvider";

import Home from "./routes/Home";
import DesignShowcase from "./routes/design/DesignShowcase";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/design" element={<DesignShowcase />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}