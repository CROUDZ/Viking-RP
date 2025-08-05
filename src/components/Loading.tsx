import { m } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0d1525] relative overflow-hidden p-4">
      {/* Brume subtile en arrière-plan */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[url('/src/assets/bg/bg-test.09b2c0b6.webp')] bg-cover bg-center blur-3xl z-0"
      />

      {/* Contenu principal */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center max-w-md"
      >
        {/* Icône de chargement animée */}
        <m.div
          animate={{
            rotate: 360,
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          className="mb-8 p-5 bg-[#0f172a]/70 backdrop-blur-sm rounded-full border border-[#334155]"
        >
          <Loader2 size={60} className="text-[#eab308]" />
        </m.div>

        {/* Titre */}
        <m.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-3 text-[#eab308] font-serif tracking-tight"
        >
          Chargement en cours
        </m.h1>

        {/* Message */}
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-[#cbd5e1] mb-6"
        >
          Préparation de votre expérience...
        </m.p>

        {/* Barre de progression */}
        <m.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="h-1.5 w-full bg-[#334155] rounded-full overflow-hidden"
        >
          <div className="h-full bg-[#eab308] rounded-full" />
        </m.div>

        {/* Message secondaire animé */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            delay: 1,
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="mt-8"
        >
          <p className="text-sm text-[#94a3b8]">Merci de votre patience</p>
        </m.div>
      </m.div>
    </div>
  );
}
