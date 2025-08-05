import React, { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  Book,
  FileText,
  Heart,
  Users,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  LogIn,
  LogOut,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { isAdmin } from "@/lib/permissions";
import { createPortal } from "react-dom";

import logo from "@/assets/logo/logo.webp";
import steveAvatar from "@/assets/Steve.webp";

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => setPlayerCount(data.onlinePlayers))
      .catch(() => setPlayerCount(0));
  }, []);

  const closeMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    closeMenus();
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        const dropdownElement = document.getElementById("user-dropdown");
        if (
          dropdownElement &&
          !dropdownElement.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      }
    };

    const handleScroll = () => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    const handleResize = () => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDropdownOpen]);

  const navItems = [
    {
      href: "/wiki",
      label: "Wiki",
      icon: Book,
      external: false,
    },
    {
      href: "/formulaire",
      label: "Candidatures",
      icon: FileText,
      external: false,
    },
    {
      href: "https://fr.tipeee.com/vikingroleplay",
      label: "Soutenir",
      icon: Heart,
      external: true,
      highlight: true,
    },
  ];

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg transition-all duration-500 ease-out">
      {/* Gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="flex items-center justify-between h-16 lg:h-20 overflow-visible">
          {/* Logo Section */}
          <Link
            href="/"
            onClick={closeMenus}
            className="group"
            aria-label="Accueil VikingRP"
          >
            <m.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 relative"
            >
              <div className="relative">
                <Image
                  src={logo}
                  alt="Logo VikingRP Accueil"
                  width={56}
                  height={56}
                  className="w-14 h-14 lg:w-16 lg:h-16 object-contain transition-all duration-300 group-hover:drop-shadow-lg"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-accent-gold via-yellow-400 to-accent-bronze bg-clip-text text-transparent">
                  VikingRP
                </h1>
                <p className="text-xs text-text-muted -mt-1">
                  Serveur Roleplay
                </p>
              </div>
            </m.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <m.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="group relative"
                    aria-label={`Lien vers ${item.label}`}
                  >
                    <m.div
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                        item.highlight
                          ? "bg-gradient-to-r from-accent-gold to-yellow-500 text-slate-900 shadow-lg shadow-accent-gold/25 hover:shadow-accent-gold/40 hover:from-yellow-400 hover:to-accent-gold"
                          : "text-text-secondary hover:text-text-primary hover:bg-slate-800/60 backdrop-blur-sm border border-transparent hover:border-slate-700/50"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={
                          item.highlight
                            ? ""
                            : "group-hover:text-accent-gold transition-colors duration-300"
                        }
                      />
                      <span className="text-sm lg:text-base">{item.label}</span>
                      {item.external && (
                        <>
                          <ExternalLink size={14} className="opacity-60" />
                          <span className="sr-only">{`Lien externe vers ${item.label}`}</span>
                        </>
                      )}
                    </m.div>
                  </Link>
                </m.div>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 overflow-visible">
            {/* Server Status - Desktop */}
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="hidden lg:flex items-center gap-3 bg-slate-800/60 backdrop-blur-sm hover:bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/50 hover:border-success-dark/50 transition-all duration-300 group"
            >
              <div className="relative">
                <Users
                  className="text-success-dark group-hover:text-green-400 transition-colors duration-300"
                  size={18}
                />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-success-dark rounded-full animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-primary font-semibold text-sm">
                  {playerCount}
                </span>
                <span className="text-text-muted text-sm">joueurs</span>
              </div>
            </m.div>

            {/* User Authentication */}
            {status === "loading" ? (
              <div className="w-10 h-10 rounded-xl bg-slate-800 animate-pulse" />
            ) : session ? (
              <>
                <m.button
                  ref={buttonRef}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleDropdown}
                  className="flex items-center gap-3 bg-gradient-to-r from-slate-800/80 to-slate-900/80 hover:from-slate-700/80 hover:to-slate-800/80 px-4 py-2.5 rounded-xl border border-accent-gold transition-all duration-300 backdrop-blur-sm group"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-label="Menu utilisateur connecté"
                >
                  <div className="relative">
                    <Image
                      src={steveAvatar}
                      alt="Avatar utilisateur connecté"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-lg"
                    />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-dark rounded-full border-2 border-slate-900" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-text-primary font-medium text-sm leading-tight">
                      {session.user?.name || "Utilisateur"}
                    </div>
                    <div className="text-accent-gold text-xs opacity-80">
                      Connecté
                    </div>
                  </div>
                  <ChevronDown
                    className={`text-accent-gold transition-all duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </m.button>

                {/* Portal Dropdown */}
                {typeof window !== "undefined" &&
                  isDropdownOpen &&
                  createPortal(
                    <AnimatePresence>
                      <m.div
                        id="user-dropdown"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed w-64 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/25"
                        style={{
                          top: dropdownPosition.top,
                          right: dropdownPosition.right,
                          zIndex: 9999999,
                        }}
                      >
                        <div className="p-1">
                          <div className="px-4 py-4 border-b border-slate-700/50">
                            <div className="flex items-center gap-3">
                              <Image
                                src={steveAvatar}
                                alt="Avatar"
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-lg border border-accent-gold"
                              />
                              <div>
                                <div className="text-text-primary font-semibold text-sm">
                                  {session.user?.name}
                                </div>
                                <div className="text-text-muted text-xs">
                                  {session.user?.email}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-2 space-y-1">
                            {/* Admin Panel Link - Only for admins */}
                            {isAdmin(session?.user?.role) && (
                              <Link
                                href="/admin"
                                onClick={closeMenus}
                                className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:text-text-primary hover:bg-amber-900/20 hover:border-amber-500/20 border border-transparent rounded-xl transition-all duration-200 group"
                                aria-label="Lien vers le panneau d'administration"
                              >
                                <Shield
                                  size={18}
                                  className="group-hover:text-amber-400 transition-colors duration-200"
                                />
                                <span className="font-medium">
                                  Administration
                                </span>
                              </Link>
                            )}

                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
                              aria-label="Déconnexion"
                            >
                              <LogOut
                                size={18}
                                className="group-hover:scale-110 transition-transform duration-200"
                              />
                              <span className="font-medium">Déconnexion</span>
                            </button>
                          </div>
                        </div>
                      </m.div>
                    </AnimatePresence>,
                    document.body,
                  )}
              </>
            ) : (
              <m.a
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/login"
                aria-label="Lien vers la page de connexion"
                className="flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-accent-gold/10 to-yellow-500/10 hover:from-accent-gold/20 hover:to-yellow-500/20 text-accent-gold hover:text-yellow-400 border border-accent-gold rounded-xl transition-all duration-300 font-medium backdrop-blur-sm group"
              >
                <LogIn
                  size={18}
                  className="group-hover:translate-x-0.5 transition-transform duration-200"
                />
                <span className="hidden sm:inline text-sm">Connexion</span>
              </m.a>
            )}

            {/* Mobile Menu Button */}
            <m.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 text-text-secondary hover:text-text-primary hover:bg-slate-800/60 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-700/50"
              aria-expanded={isMobileMenuOpen}
              aria-label="Menu de navigation"
            >
              <m.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </m.div>
            </m.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden border-t border-slate-700/50 mt-4 backdrop-blur-xl"
            >
              <div className="py-6 space-y-3">
                {/* Mobile Server Status */}
                <m.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Shield className="text-accent-gold" size={20} />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-success-dark rounded-full animate-pulse" />
                    </div>
                    <span className="text-text-primary font-semibold">
                      Serveur Viking
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-success-dark font-bold">
                      {playerCount}
                    </span>
                    <span className="text-text-muted text-sm">en ligne</span>
                  </div>
                </m.div>

                {/* Mobile Navigation Items */}
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <m.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + 1) * 0.1 + 0.1 }}
                    >
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        onClick={closeMenus}
                        className="group block"
                        aria-label={`Lien vers ${item.label}`}
                      >
                        <div
                          className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                            item.highlight
                              ? "bg-gradient-to-r from-accent-gold to-yellow-500 text-slate-900 shadow-lg shadow-accent-gold/20"
                              : "text-text-secondary hover:text-text-primary hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50"
                          }`}
                        >
                          <Icon
                            size={22}
                            className={
                              item.highlight
                                ? ""
                                : "group-hover:text-accent-gold transition-colors duration-300"
                            }
                          />
                          <span className="font-medium text-base">
                            {item.label}
                          </span>
                          {item.external && (
                            <>
                              <ExternalLink
                                size={16}
                                className="opacity-60 ml-auto"
                              />
                              <span className="sr-only">{`Lien externe vers ${item.label}`}</span>
                            </>
                          )}
                        </div>
                      </Link>
                    </m.div>
                  );
                })}

                {/* Mobile Auth */}
                {!session && (
                  <m.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 1) * 0.1 + 0.1 }}
                    className="pt-4 border-t border-slate-700/50"
                  >
                    <Link
                      href="/login"
                      onClick={closeMenus}
                      className="flex items-center gap-4 w-full p-4 text-accent-gold hover:text-yellow-400 hover:bg-accent-gold/10 rounded-xl transition-all duration-300 border border-accent-gold group"
                      aria-label="Lien vers la page de connexion"
                    >
                      <LogIn
                        size={22}
                        className="group-hover:translate-x-1 transition-transform duration-200"
                      />
                      <span className="font-medium text-base">Connexion</span>
                    </Link>
                  </m.div>
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

Header.displayName = "Header";

export default Header;
