import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WorldMapPage from "./pages/WorldMapPage";
import ForestAreaPage from "./pages/ForestAreaPage";
import RiverAreaPage from "./pages/RiverAreaPage";
import VillageAreaPage from "./pages/VillageAreaPage";
import CityAreaPage from "./pages/CityAreaPage";
import OceanAreaPage from "./pages/OceanAreaPage";
import ParentModePage from "./pages/ParentModePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/world" element={<WorldMapPage />} />
          <Route path="/area/forest" element={<ForestAreaPage />} />
          <Route path="/area/river" element={<RiverAreaPage />} />
          <Route path="/area/village" element={<VillageAreaPage />} />
          <Route path="/area/city" element={<CityAreaPage />} />
          <Route path="/area/ocean" element={<OceanAreaPage />} />
          <Route path="/parent" element={<ParentModePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
