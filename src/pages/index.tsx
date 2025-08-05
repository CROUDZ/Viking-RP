"use client";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { Swords, Shield, Users, Zap } from "lucide-react";

import YoutubeSvg from "@/assets/svg/youtube.svg";
import DiscordSvg from "@/assets/svg/discord.svg";
import TiktokSvg from "@/assets/svg/tiktok.svg";
import XSvg from "@/assets/svg/X.svg";

import Logo from "@/assets/logo/logo_v.webp";

// Structured data for homepage
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Viking RP",
  url: "https://viking-rp.fr",
  logo: "https://viking-rp.fr/icon.webp",
  description:
    "Serveur Minecraft roleplay viking immersif avec une communauté française active",
  sameAs: [
    "https://discord.gg/viking-rp",
    "https://www.youtube.com/@viking-rp",
    "https://www.tiktok.com/@viking-rp",
  ],
  founder: {
    "@type": "Organization",
    name: "Viking RP Team",
  },
  areaServed: "France",
  serviceType: "Gaming Community",
};

export default function Home() {
  return (
    <>
      <SEO
        title="Accueil - Serveur Minecraft Roleplay Viking"
        description="Rejoignez Viking RP, le serveur Minecraft roleplay viking le plus immersif de France. Explorez les terres nordiques, incarnez un guerrier viking et vivez des aventures épiques dans un monde médiéval authentique."
        keywords="minecraft roleplay, serveur viking, RP français, jeu de rôle médiéval, communauté minecraft, serveur français, adventure viking, nordic roleplay"
        structuredData={structuredData}
      />
      <Header />
      <main className="relative min-h-screen overflow-hidden">
        {/* Video Background with enhanced overlay */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-110 object-cover"
            src="/bg.webm"
            autoPlay
            muted
            loop
            playsInline
          />
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/20 via-transparent to-amber-950/20"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center space-y-8 sm:space-y-12">
              {/* Logo and Title Section */}
              <div className="space-y-6 animate-fade-in flex justify-center">
                <Image
                  src={Logo}
                  alt="Viking RP Logo"
                  width={256}
                  height={256}
                  className=""
                />
              </div>

              {/* Description */}
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-delay">
                <p className="text-lg sm:text-xl lg:text-2xl text-slate-200 leading-relaxed font-light">
                  Plongez dans l'univers épique des Vikings avec notre serveur
                  Roleplay dédié.
                </p>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
                  Explorez des terres vastes et mystérieuses, commercez avec
                  d'autres joueurs, et forgez votre propre destin en tant que
                  fier Viking.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto animate-fade-in-delay-2">
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-800/60 transition-all duration-300">
                  <Shield className="w-8 h-8 text-amber-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-white font-semibold mb-2">
                    Immersion Totale
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Roleplay authentique dans l'univers Viking
                  </p>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-800/60 transition-all duration-300">
                  <Users className="w-8 h-8 text-amber-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-white font-semibold mb-2">
                    Communauté Active
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Joueurs passionnés et événements réguliers
                  </p>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-800/60 transition-all duration-300">
                  <Zap className="w-8 h-8 text-amber-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-white font-semibold mb-2">
                    Expérience Unique
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Mécaniques innovantes et monde vivant
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-delay-3">
                <Link
                  href="/formulaire"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full sm:w-auto"
                >
                  <div className="relative px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl border border-amber-400/50 hover:from-amber-400 hover:to-amber-500 transition-all duration-300 transform hover:scale-105">
                    <span className="flex items-center justify-center gap-3 text-lg font-bold text-white">
                      <Shield className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      Nous Rejoindre
                    </span>
                  </div>
                </Link>

                <Link
                  href="/wiki"
                  className="group relative w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-slate-600/50 hover:border-slate-400 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Swords className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    En Savoir Plus
                  </span>
                </Link>
              </div>

              {/* Bottom text */}
              <div className="text-slate-400 animate-fade-in-delay-3">
                <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Que vous soyez un guerrier intrépide ou un commerçant rusé,
                  notre serveur offre une expérience immersive unique.
                </p>
              </div>
            </div>
          </div>

          {/* Social Media Footer */}
          <div className="pb-8 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-center items-center space-x-6">
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-4">Suivez-nous</p>
                  <div className="flex gap-4 justify-center">
                    <Link
                      href="https://www.youtube.com/@VikingRoleplay"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-3 bg-slate-800/30 backdrop-blur-sm rounded-full border border-slate-600/30 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300 transform hover:scale-110"
                    >
                      <YoutubeSvg className="w-6 h-6 text-slate-300 group-hover:text-red-400 transition-colors duration-300" />
                      <div className="absolute inset-0 rounded-full bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                    </Link>

                    <Link
                      href="https://discord.gg/viking-rp-maintenance-535476824734564372"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-3 bg-slate-800/30 backdrop-blur-sm rounded-full border border-slate-600/30 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300 transform hover:scale-110"
                    >
                      <DiscordSvg className="w-6 h-6 text-slate-300 group-hover:text-indigo-400 transition-colors duration-300" />
                      <div className="absolute inset-0 rounded-full bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                    </Link>

                    <Link
                      href="https://www.tiktok.com/@vikingroleplay"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-3 bg-slate-800/30 backdrop-blur-sm rounded-full border border-slate-600/30 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300 transform hover:scale-110"
                    >
                      <TiktokSvg className="w-6 h-6 text-slate-300 group-hover:text-pink-400 transition-colors duration-300" />
                      <div className="absolute inset-0 rounded-full bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                    </Link>

                    <Link
                      href="https://twitter.com/VikingRoleplay"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-3 bg-slate-800/30 backdrop-blur-sm rounded-full border border-slate-600/30 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 transform hover:scale-110"
                    >
                      <XSvg className="w-6 h-6 text-slate-300 group-hover:text-blue-400 transition-colors duration-300" />
                      <div className="absolute inset-0 rounded-full bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
