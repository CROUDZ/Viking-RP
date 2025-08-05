import { m } from "framer-motion";
import { Shield, AlertTriangle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo/logo_v.webp";

interface AccessDeniedProps {
  message?: string;
  showHomeButton?: boolean;
}

export default function AccessDenied({
  message = "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
  showHomeButton = true,
}: AccessDeniedProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-gray-900/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-8 bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700 relative z-10"
      >
        {/* Logo */}
        <m.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex justify-center"
        >
          <Image
            src={Logo}
            alt="VikingRP Logo"
            width={80}
            height={80}
            className="opacity-80"
          />
        </m.div>

        {/* Access Denied Icon */}
        <m.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative">
            <Shield className="w-20 h-20 text-red-400" />
            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </m.div>

        {/* Title */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">Accès Refusé</h1>
          <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
        </m.div>

        {/* Additional Info */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm"
        >
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle size={16} className="mr-2" />
            <span className="font-medium">Zone Réservée</span>
          </div>
          <p className="text-xs text-red-300">
            Cette page est réservée aux administrateurs du serveur Viking RP.
          </p>
        </m.div>

        {/* Actions */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-3"
        >
          {showHomeButton && (
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-semibold transition-all duration-200"
            >
              <Home size={18} />
              Retour à l'accueil
            </Link>
          )}

          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <ArrowLeft size={18} />
            Page précédente
          </button>
        </m.div>

        {/* Contact Info */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-xs text-gray-500"
        >
          Si vous pensez qu'il s'agit d'une erreur, contactez un administrateur.
        </m.div>
      </m.div>
    </div>
  );
}
