import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { KidButton } from "@/components/ui/kid-button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-9xl mb-6"
        >
          🌲
        </motion.div>

        <h1 className="text-4xl font-bold text-foreground mb-4">Oops!</h1>

        <p className="text-xl text-muted-foreground mb-8">
          Halaman tidak ditemukan. Kamu tersesat di hutan! 🌿
        </p>

        <Link to="/">
          <KidButton variant="primary" size="lg">
            <Home className="w-6 h-6 mr-2" />
            Kembali ke Rumah
          </KidButton>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
