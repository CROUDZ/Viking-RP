import { m } from "framer-motion";
import { Compass } from "lucide-react";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0d1525] relative overflow-hidden p-4">
      {/* Brume subtile */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[url('/src/assets/bg/bg-test.09b2c0b6.webp')] bg-cover bg-center blur-3xl z-0"
      />

      {/* Conteneur principal */}
      <m.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        {/* Icône animée */}
        <m.div
          initial={{ rotate: -30, y: 20, opacity: 0 }}
          animate={{ rotate: 0, y: 0, opacity: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 150,
          }}
          className="mb-6 p-5 bg-[#0f172a]/70 backdrop-blur-sm rounded-full border border-[#334155]"
        >
          <Compass size={80} className="text-[#eab308]" />
        </m.div>

        {/* Titre */}
        <m.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-8xl md:text-9xl font-black mb-2 text-[#eab308] font-serif tracking-tighter"
        >
          404
        </m.h1>

        {/* Sous-titre */}
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-[#cbd5e1] mb-6 max-w-md"
        >
          Page égarée dans les brumes du Nord
        </m.p>

        {/* Message d'accent */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-10"
        >
          <div className="inline-block px-4 py-2 bg-[#1e293b]/80 backdrop-blur rounded-lg border border-[#334155]">
            <p className="text-[#eab308] font-medium">
              Seuls les vrais navigateurs retrouvent leur chemin
            </p>
          </div>
        </m.div>

        {/* Bouton CTA */}
        <Link href="/" passHref legacyBehavior>
          <m.a
            whileHover={{
              scale: 1.03,
              backgroundColor: "#eab308",
              color: "#0f172a",
            }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#1e293b]/90 backdrop-blur text-[#eab308] font-semibold shadow-lg border border-[#334155] hover:shadow-[#eab308]/20 hover:shadow-lg transition-all duration-300"
          >
            <span>Retour au port</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
            </svg>
          </m.a>
        </Link>
      </m.div>
    </div>
  );
}
