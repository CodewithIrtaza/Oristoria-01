import { BrowserRouter, Route, Routes } from "react-router";
import { ThemeProvider } from "./components/ui/ThemeProvider";

import Home from "./routes/Home";
import DesignShowcase from "./routes/design/DesignShowcase";
import { WorkspaceStep } from "./routes/onboarding/WorkspaceStep";
import { FirstQuestionStep } from "./routes/onboarding/FirstQuestionStep";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/design" element={<DesignShowcase />} />
      <Route path="/onboarding/workspace" element={<WorkspaceStep />} />
      <Route path="/onboarding/first-question" element={<FirstQuestionStep />} />
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