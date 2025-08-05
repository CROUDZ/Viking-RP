import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Sword,
  Target,
  Check,
  ArrowLeft,
  ArrowRight,
  Scroll,
  Info,
  Shield,
  Crown,
  Zap,
  Brain,
  Hammer,
  ChevronRight,
  Star,
} from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Logo from "@/assets/logo/logo_v.webp";
import { m, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Formulaire: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState({
    discordPseudo: "",
    ageIRL: "",
    decouverteViking: "",
    originePersonnage: "",
    ageRP: "",
    nomPersonnage: "",
    metierPrincipal: "",
    taillePersonnage: "",
    histoirePersonnage: "",
    descriptionPhysique: "",
    competences: {
      force: 1,
      robustesse: 1,
      agilite: 1,
      intelligence: 1,
      artisanat: 1,
    },
    apportRoleplay: "",
    projets: "",
    reglementLu: false,
    loreLu: false,
    pseudoParrain: "",
  });

  const [remainingSkillPoints, setRemainingSkillPoints] = useState(10);
  const [characterCounts, setCharacterCounts] = useState({
    histoirePersonnage: 0,
    apportRoleplay: 0,
  });
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const sections = [
    {
      title: "Informations Personnelles",
      icon: <User size={20} />,
      description: "Votre identité et découverte",
    },
    {
      title: "Création de Personnage",
      icon: <Crown size={20} />,
      description: "L'histoire de votre Viking",
    },
    {
      title: "Compétences",
      icon: <Sword size={20} />,
      description: "Répartition des aptitudes",
    },
    {
      title: "Projets & Motivation",
      icon: <Target size={20} />,
      description: "Vos ambitions RP",
    },
    {
      title: "Validation",
      icon: <Check size={20} />,
      description: "Acceptation finale",
    },
  ];

  useEffect(() => {
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return;
    if (!session) {
      router.push("/login");
    }
  }, [session, router, isAuthenticated]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "histoirePersonnage" || name === "apportRoleplay") {
        setCharacterCounts((prev) => ({
          ...prev,
          [name]: value.length,
        }));
      }
    }
  };

  const handleSkillChange = (skill: string, value: number) => {
    const newValue = Math.max(1, Math.min(6, value));
    const oldValue =
      formData.competences[skill as keyof typeof formData.competences];
    const pointDifference = newValue - oldValue;

    if (remainingSkillPoints - pointDifference >= 0) {
      setFormData((prev) => ({
        ...prev,
        competences: {
          ...prev.competences,
          [skill]: newValue,
        },
      }));
      setRemainingSkillPoints((prev) => prev - pointDifference);
    }
  };

  const origines = [
    "Viking",
    "Aldovien",
    "Kuzvar",
    "Librosi",
    "Vladislave",
    "Frisien",
    "Galdien",
  ];

  const metiers = [
    "Ouvrier",
    "Fermier / Eleveur",
    "Couturier / Tanneur",
    "Forgeron",
    "Apothicaire",
    "Garde",
    "Druide",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Vérification côté client des champs obligatoires
    if (!formData.nomPersonnage || !formData.discordPseudo) {
      alert("Veuillez remplir le nom du personnage et le pseudo Discord.");
      return;
    }
    // Ajoute une vérification pour les types attendus
    const payload = {
      ...formData,
      ageIRL: formData.ageIRL ? String(formData.ageIRL) : "",
      ageRP: formData.ageRP ? String(formData.ageRP) : "",
      email: session?.user?.email || "",
      competences: { ...formData.competences },
    };
    try {
      const res = await fetch("/api/formulaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Formulaire envoyé avec succès !");
        // setFormData({ ... }) // reset si besoin
      } else {
        const error = await res.json();
        alert("Erreur: " + (error.error || "Erreur inconnue"));
      }
    } catch {
      alert("Erreur lors de l'envoi du formulaire.");
    }
  };

  const skillDescriptions = {
    force: {
      1: "Faiblesse 2",
      2: "Faiblesse 1",
      3: "Pas d'effet",
      4: "Pas d'effet",
      5: "Pas d'effet",
      6: "Force 1",
    },
    robustesse: {
      1: "7 cœurs",
      2: "8 cœurs",
      3: "9 cœurs",
      4: "10 cœurs",
      5: "11 cœurs",
      6: "12 cœurs",
    },
    agilite: {
      1: "Lenteur",
      2: "Pas d'effet",
      3: "Pas d'effet",
      4: "Pas d'effet",
      5: "Pas d'effet",
      6: "Speed 1",
    },
    intelligence: {
      1: "Personnage ayant des difficultés cognitives",
      2: "Personnage ayant des difficultés mais pouvant exprimer des mots aléatoires",
      3: "Ayant des difficultés mais pouvant s'exprimer normalement",
      4: "Ayant la capacité de tenir une conversation sans difficultés et de faire des calculs modestes",
      5: "Capacité à effectuer des calculs avancés et à lire des textes complexes",
      6: "Personnage doté d'une intelligence supérieure à la moyenne",
    },
    artisanat: {
      1: "L'artisan vient de commencer à apprendre son art",
      2: "L'artisan commence à se sentir plus à l'aise avec ses outils et à comprendre les bases de son art",
      3: "L'artisan a acquis suffisamment d'expérience pour réaliser des objets de qualité moyenne",
      4: "L'artisan maîtrise bien les techniques de base et commence à produire des objets plus complexes",
      5: "L'artisan maîtrise bien les techniques de base et commence à expérimenter avec des techniques plus avancées",
      6: "L'artisan est reconnu pour son savoir-faire et son expertise dans son domaine",
    },
  };

  const skillIcons = {
    force: <Shield className="w-5 h-5 text-white" />,
    robustesse: <Star className="w-5 h-5 text-white" />,
    agilite: <Zap className="w-5 h-5 text-white" />,
    intelligence: <Brain className="w-5 h-5 text-white" />,
    artisanat: <Hammer className="w-5 h-5 text-white" />,
  };

  const skillNames = {
    force: "Force",
    robustesse: "Robustesse",
    agilite: "Agilité",
    intelligence: "Intelligence",
    artisanat: "Artisanat",
  };

  const renderSkillBar = (
    skillKey: keyof typeof formData.competences,
    skillName: string,
  ) => {
    const currentLevel = formData.competences[skillKey];

    // Fonction de toggle au clic
    const handleInfoClick = () => {
      setTooltipVisible((prev) => (prev === skillKey ? null : skillKey));
    };

    return (
      <m.div
        className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20 shadow-2xl hover:border-amber-400/40 transition-all duration-300"
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500/20 to-amber-700/20 rounded-xl border border-amber-400/30">
              {skillIcons[skillKey]}
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">{skillName}</h4>
              <p className="text-sm text-amber-300/70">Niveau {currentLevel}</p>
            </div>
            <m.button
              type="button"
              onClick={handleInfoClick}
              className={`p-1 text-amber-400/60 hover:text-amber-300 transition-colors ${
                tooltipVisible === skillKey ? "bg-slate-800/60 rounded" : ""
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Info size={16} />
            </m.button>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <m.button
              key={level}
              type="button"
              onClick={() => handleSkillChange(skillKey, level)}
              className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                level <= currentLevel
                  ? "bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
              disabled={
                (level > currentLevel && remainingSkillPoints === 0) ||
                (level < currentLevel && currentLevel === 1)
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>

        {/* Level adjustment */}
        <div className="flex gap-3">
          <m.button
            type="button"
            onClick={() => handleSkillChange(skillKey, currentLevel - 1)}
            disabled={currentLevel <= 1}
            className="flex-1 py-2 px-4 bg-gradient-to-br from-red-600/80 to-red-700/80 text-white rounded-xl font-medium hover:from-red-500/80 hover:to-red-600/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            whileHover={{ scale: currentLevel > 1 ? 1.02 : 1 }}
            whileTap={{ scale: currentLevel > 1 ? 0.98 : 1 }}
          >
            -
          </m.button>

          <div className="flex-2 py-2 px-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 text-amber-300 rounded-xl font-bold text-center border border-slate-600/50">
            {currentLevel}/6
          </div>

          <m.button
            type="button"
            onClick={() => handleSkillChange(skillKey, currentLevel + 1)}
            disabled={currentLevel >= 6 || remainingSkillPoints === 0}
            className="flex-1 py-2 px-4 bg-gradient-to-br from-green-600/80 to-green-700/80 text-white rounded-xl font-medium hover:from-green-500/80 hover:to-green-600/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            whileHover={{
              scale: currentLevel < 6 && remainingSkillPoints > 0 ? 1.02 : 1,
            }}
            whileTap={{
              scale: currentLevel < 6 && remainingSkillPoints > 0 ? 0.98 : 1,
            }}
          >
            +
          </m.button>
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {tooltipVisible === skillKey && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-4 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-amber-500/30 rounded-xl shadow-2xl"
            >
              <h5 className="text-amber-400 font-bold mb-2 text-sm">
                Description des niveaux
              </h5>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {Object.entries(skillDescriptions[skillKey]).map(
                  ([level, desc]) => (
                    <div key={level} className="flex gap-2 text-xs">
                      <span className="text-amber-400 font-bold min-w-[20px]">
                        N{level}:
                      </span>
                      <span className="text-gray-300 leading-relaxed">
                        {desc}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    );
  };

  if (isAuthenticated === null) return null;

  if (!session) return null;

  return (
    <>
      <SEO
        title="Formulaire de Candidature - Rejoignez Viking RP"
        description="Postulez pour rejoindre l'aventure Viking RP ! Remplissez notre formulaire de candidature détaillé et devenez membre de notre communauté roleplay viking."
        keywords="candidature viking rp, formulaire inscription, postuler serveur minecraft, rejoindre communauté RP, application viking"
        noindex={true}
      />
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-5 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-700/5" />

        <div className="relative pt-32 pb-16 px-2 sm:px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <m.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <m.div
                className="inline-block mb-8"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src={Logo}
                  alt="Viking RP Logo"
                  width={140}
                  height={140}
                  className="mx-auto drop-shadow-2xl"
                />
              </m.div>

              <m.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent mb-6 leading-[1.3] py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Candidature Viking RP
              </m.h1>

              <m.p
                className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Pour garantir une immersion totale, nous sélectionnons chaque
                joueur individuellement. Remplissez ce formulaire pour tenter de
                rejoindre notre communauté viking.
              </m.p>
            </m.div>

            {/* Progress Bar */}
            <m.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 sm:gap-0">
                <h2 className="text-xl sm:text-2xl font-bold text-amber-400 flex items-center gap-3">
                  <Scroll className="w-6 h-6" />
                  Étape {activeSection + 1} sur {sections.length}
                </h2>
                <div className="text-amber-300 font-medium text-base sm:text-lg">
                  {Math.round(((activeSection + 1) / sections.length) * 100)}%
                  terminé
                </div>
              </div>

              {/* Progress Steps */}
              <div className="relative overflow-x-auto">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 rounded-full -translate-y-1/2" />
                <div
                  className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full -translate-y-1/2 transition-all duration-500"
                  style={{
                    width: `${((activeSection + 1) / sections.length) * 100}%`,
                  }}
                />

                <div className="relative flex justify-between min-w-[400px] sm:min-w-0 py-2">
                  {sections.map((section, index) => (
                    <m.button
                      key={index}
                      onClick={() => setActiveSection(index)}
                      className={`flex flex-col items-center gap-2 group ${
                        index <= activeSection
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                      whileHover={index <= activeSection ? { scale: 1.05 } : {}}
                      whileTap={index <= activeSection ? { scale: 0.95 } : {}}
                    >
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          index === activeSection
                            ? "bg-gradient-to-br from-amber-500 to-amber-600 border-amber-400 text-white shadow-lg shadow-amber-500/30"
                            : index < activeSection
                              ? "bg-gradient-to-br from-green-500 to-green-600 border-green-400 text-white"
                              : "bg-slate-800 border-slate-600 text-slate-400"
                        }`}
                      >
                        {index < activeSection ? (
                          <Check size={20} />
                        ) : (
                          section.icon
                        )}
                      </div>
                      <div className="text-center hidden sm:block">
                        <p
                          className={`text-xs sm:text-sm font-medium transition-colors ${
                            index <= activeSection
                              ? "text-white"
                              : "text-slate-500"
                          }`}
                        >
                          {section.title}
                        </p>
                        <p
                          className={`text-xs transition-colors ${
                            index <= activeSection
                              ? "text-slate-300"
                              : "text-slate-600"
                          }`}
                        >
                          {section.description}
                        </p>
                      </div>
                    </m.button>
                  ))}
                </div>
              </div>
            </m.div>

            {/* Form Container */}
            <m.div
              key={activeSection}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl border border-amber-500/20 shadow-2xl overflow-hidden"
            >
              <div className="p-4 sm:p-8 lg:p-12">
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <AnimatePresence mode="wait">
                    {/* Section 1: Informations personnelles */}
                    {activeSection === 0 && (
                      <m.div
                        key="section-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                      >
                        <div className="text-center mb-8">
                          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                            <User className="w-8 h-8 text-amber-400" />
                            Informations personnelles
                          </h3>
                          <p className="text-slate-300">
                            Commençons par faire connaissance
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <m.div
                            className="space-y-2"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <label className="block text-white font-semibold text-lg">
                              Pseudo Discord *
                            </label>
                            <input
                              type="text"
                              name="discordPseudo"
                              value={formData.discordPseudo}
                              onChange={handleInputChange}
                              required
                              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
                              placeholder="votre_nom#1234"
                            />
                          </m.div>

                          <m.div
                            className="space-y-2"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <label className="block text-white font-semibold text-lg">
                              Âge IRL *
                            </label>
                            <input
                              type="number"
                              name="ageIRL"
                              value={formData.ageIRL}
                              onChange={handleInputChange}
                              required
                              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
                              placeholder="Votre âge réel"
                            />
                          </m.div>
                        </div>

                        <m.div
                          className="space-y-2"
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <label className="block text-white font-semibold text-lg">
                            Comment avez-vous découvert Viking RP ? *
                          </label>
                          <textarea
                            name="decouverteViking"
                            value={formData.decouverteViking}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 resize-none backdrop-blur-sm"
                            placeholder="Comment avez-vous entendu parler de notre serveur ?"
                          />
                        </m.div>
                      </m.div>
                    )}

                    {/* Section 2: Création de personnage */}
                    {activeSection === 1 && (
                      <m.div
                        key="section-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                      >
                        <div className="text-center mb-8">
                          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                            <Crown className="w-8 h-8 text-amber-400" />
                            Création de Personnage
                          </h3>
                          <p className="text-slate-300">
                            Donnez vie à votre Viking
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <m.div
                            className="space-y-2"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <label className="block text-white font-semibold text-lg">
                              Nom du personnage *
                            </label>
                            <input
                              type="text"
                              name="nomPersonnage"
                              value={formData.nomPersonnage}
                              onChange={handleInputChange}
                              required
                              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
                              placeholder="Entrez le nom de votre personnage"
                            />
                          </m.div>

                          <m.div
                            className="space-y-2"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <label className="block text-white font-semibold text-lg">
                              Âge RP (Nous sommes en 1116) *
                            </label>
                            <input
                              type="number"
                              name="ageRP"
                              value={formData.ageRP}
                              onChange={handleInputChange}
                              required
                              min="18"
                              max="80"
                              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
                              placeholder="Âge du personnage (18-80 ans)"
                            />
                          </m.div>

                          <m.div
                            className="space-y-2"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <label className="block text-white font-semibold text-lg">
                              Origine de votre Personnage *
                            </label>
                            <select
                              name="originePersonnage"
                              value={formData.originePersonnage}
                              onChange={handleInputChange}
                              required
                              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
                            >
                              <option value="">Sélectionnez une origine</option>
                              {origines.map((origine) => (
                                <option
                                  key={origine}
                                  value={origine}
                                  className="bg-slate-800"
                                >
                                  {origine}
                                </option>
                              ))}
                            </select>
                          </m.div>

                          <m.div
                            className="space-y-2"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <label className="block text-white font-semibold text-lg">
                              Métier Principal souhaité *
                            </label>
                            <select
                              name="metierPrincipal"
                              value={formData.metierPrincipal}
                              onChange={handleInputChange}
                              required
                              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
                            >
                              <option value="">Sélectionnez un métier</option>
                              {metiers.map((metier) => (
                                <option
                                  key={metier}
                                  value={metier}
                                  className="bg-slate-800"
                                >
                                  {metier}
                                </option>
                              ))}
                            </select>
                            <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-3">
                              <p className="text-sm text-amber-300 flex items-center gap-2">
                                <Info size={16} />
                                Attention : Choisir un métier fermé entraînera
                                un refus immédiat
                              </p>
                            </div>
                          </m.div>

                          <m.div
                            className="space-y-2 lg:col-span-2"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <label className="block text-white font-semibold text-lg">
                              Taille de votre personnage *
                            </label>
                            <input
                              type="text"
                              name="taillePersonnage"
                              value={formData.taillePersonnage}
                              onChange={handleInputChange}
                              required
                              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
                              placeholder="Ex: 1m80"
                            />
                          </m.div>
                        </div>

                        <m.div
                          className="space-y-2"
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <label className="block text-white font-semibold text-lg">
                            Histoire de votre personnage (2000 caractères
                            minimum) *
                          </label>
                          <textarea
                            name="histoirePersonnage"
                            value={formData.histoirePersonnage}
                            onChange={handleInputChange}
                            required
                            minLength={2000}
                            rows={8}
                            className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 resize-none backdrop-blur-sm"
                            placeholder="Décrivez l'histoire et le passé de votre personnage..."
                          />
                          <div className="flex justify-between items-center">
                            <div
                              className={`text-sm font-medium flex items-center gap-2 ${
                                characterCounts.histoirePersonnage >= 2000
                                  ? "text-green-400"
                                  : "text-amber-400"
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  characterCounts.histoirePersonnage >= 2000
                                    ? "bg-green-400"
                                    : "bg-amber-400"
                                }`}
                              />
                              {characterCounts.histoirePersonnage}/2000
                              caractères minimum
                              {characterCounts.histoirePersonnage >= 2000 && (
                                <Check size={16} className="text-green-400" />
                              )}
                            </div>
                          </div>
                        </m.div>

                        <m.div
                          className="space-y-2"
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <label className="block text-white font-semibold text-lg">
                            Description physique de votre personnage *
                          </label>
                          <textarea
                            name="descriptionPhysique"
                            value={formData.descriptionPhysique}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 resize-none backdrop-blur-sm"
                            placeholder="Décrivez l'apparence physique de votre personnage..."
                          />
                        </m.div>
                      </m.div>
                    )}

                    {/* Section 3: Compétences */}
                    {activeSection === 2 && (
                      <m.div
                        key="section-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                      >
                        <div className="text-center mb-8">
                          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                            <Sword className="w-8 h-8 text-amber-400" />
                            Compétences du personnage
                          </h3>
                          <p className="text-slate-300">
                            Répartissez vos points d'aptitudes
                          </p>
                        </div>

                        <m.div
                          className="bg-gradient-to-br from-amber-900/20 to-amber-700/20 border border-amber-500/30 rounded-2xl p-4 sm:p-6 mb-8"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                              <h4 className="text-2xl font-bold text-amber-300 mb-2">
                                Points restants: {remainingSkillPoints}
                              </h4>
                              <p className="text-amber-200/70">
                                Total utilisé: {15 - remainingSkillPoints}/15
                                points
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/20 border-4 border-amber-400/30 flex items-center justify-center">
                                <span className="text-2xl font-bold text-amber-300">
                                  {remainingSkillPoints}
                                </span>
                              </div>
                            </div>
                          </div>
                        </m.div>

                        <div className="bg-slate-800/30 border border-slate-600/30 rounded-2xl p-4 sm:p-6 mb-8">
                          <h4 className="text-amber-300 font-semibold mb-4 flex items-center gap-2 text-lg">
                            <Info className="w-5 h-5" />
                            Instructions de répartition
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                            <div className="flex items-start gap-3">
                              <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                              <span>
                                Répartissez exactement 15 points de compétences
                              </span>
                            </div>
                            <div className="flex items-start gap-3">
                              <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                              <span>
                                Minimum 1 point par compétence, maximum 6
                              </span>
                            </div>
                            <div className="flex items-start gap-3">
                              <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                              <span>
                                Cliquez sur les barres ou utilisez les boutons
                              </span>
                            </div>
                            <div className="flex items-start gap-3">
                              <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                              <span>
                                Survolez l'icône d'info pour voir les effets
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {Object.entries(skillNames).map(
                            ([skillKey, skillName]) =>
                              renderSkillBar(
                                skillKey as keyof typeof formData.competences,
                                skillName,
                              ),
                          )}
                        </div>

                        {remainingSkillPoints === 0 && (
                          <m.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-green-900/20 to-green-700/20 border border-green-500/30 rounded-2xl p-6"
                          >
                            <p className="text-green-300 font-semibold text-center text-lg flex items-center justify-center gap-2">
                              <Check className="w-6 h-6" />
                              Répartition des compétences terminée !
                            </p>
                          </m.div>
                        )}
                      </m.div>
                    )}

                    {/* Section 4: Projets et motivation */}
                    {activeSection === 3 && (
                      <m.div
                        key="section-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                      >
                        <div className="text-center mb-8">
                          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                            <Target className="w-8 h-8 text-amber-400" />
                            Projets et motivation
                          </h3>
                          <p className="text-slate-300">
                            Partagez vos ambitions RP
                          </p>
                        </div>

                        <m.div
                          className="space-y-2"
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <label className="block text-white font-semibold text-lg">
                            Que pensez-vous pouvoir apporter au Roleplay sur le
                            serveur ? Quels sont vos projets ? *
                          </label>
                          <textarea
                            name="apportRoleplay"
                            value={formData.apportRoleplay}
                            onChange={handleInputChange}
                            required
                            rows={8}
                            className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 resize-none backdrop-blur-sm"
                            placeholder="Décrivez vos projets et ce que vous comptez apporter au serveur..."
                          />
                          <div className="text-sm text-slate-400 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            {characterCounts.apportRoleplay} caractères
                          </div>
                        </m.div>
                      </m.div>
                    )}

                    {/* Section 5: Validation */}
                    {activeSection === 4 && (
                      <m.div
                        key="section-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                      >
                        <div className="text-center mb-8">
                          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                            <Check className="w-8 h-8 text-amber-400" />
                            Validation finale
                          </h3>
                          <p className="text-slate-300">
                            Dernières informations et acceptation
                          </p>
                        </div>

                        <m.div
                          className="space-y-2 mb-8"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <label className="block text-white font-semibold text-lg">
                            Pseudo Discord du Parrain
                          </label>
                          <input
                            type="text"
                            name="pseudoParrain"
                            value={formData.pseudoParrain}
                            onChange={handleInputChange}
                            className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
                            placeholder="Laisser vide si aucun parrain"
                          />
                          <p className="text-sm text-slate-400">
                            Optionnel - Si un joueur vous a parrainé, indiquez
                            son pseudo Discord
                          </p>
                        </m.div>

                        <div className="space-y-6">
                          <m.div
                            className="bg-slate-800/30 rounded-2xl p-6 border border-slate-600/30"
                            whileHover={{
                              scale: 1.02,
                              borderColor: "rgb(251 191 36 / 0.3)",
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <label className="flex items-start gap-4 cursor-pointer">
                              <input
                                type="checkbox"
                                name="reglementLu"
                                checked={formData.reglementLu}
                                onChange={handleInputChange}
                                required
                                className="mt-1 w-6 h-6 text-amber-600 bg-slate-800 border-slate-600 rounded-lg focus:ring-amber-500 focus:ring-2 transition-all"
                              />
                              <span className="text-white text-lg">
                                J'ai lu et j'accepte le règlement du serveur *
                              </span>
                            </label>
                          </m.div>

                          <m.div
                            className="bg-slate-800/30 rounded-2xl p-6 border border-slate-600/30"
                            whileHover={{
                              scale: 1.02,
                              borderColor: "rgb(251 191 36 / 0.3)",
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <label className="flex items-start gap-4 cursor-pointer">
                              <input
                                type="checkbox"
                                name="loreLu"
                                checked={formData.loreLu}
                                onChange={handleInputChange}
                                required
                                className="mt-1 w-6 h-6 text-amber-600 bg-slate-800 border-slate-600 rounded-lg focus:ring-amber-500 focus:ring-2 transition-all"
                              />
                              <span className="text-white text-lg">
                                J'ai lu le lore du serveur *
                              </span>
                            </label>
                          </m.div>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-slate-700/50 gap-4">
                    <m.button
                      type="button"
                      onClick={() =>
                        setActiveSection((prev) => Math.max(0, prev - 1))
                      }
                      disabled={activeSection === 0}
                      className="px-8 py-4 bg-gradient-to-br from-slate-700 to-slate-800 text-white font-semibold rounded-2xl hover:from-slate-600 hover:to-slate-700 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg border border-slate-600/50"
                      whileHover={activeSection > 0 ? { scale: 1.05 } : {}}
                      whileTap={activeSection > 0 ? { scale: 0.95 } : {}}
                    >
                      <ArrowLeft size={20} /> Précédent
                    </m.button>

                    {activeSection < sections.length - 1 ? (
                      <m.button
                        type="button"
                        onClick={() =>
                          setActiveSection((prev) =>
                            Math.min(sections.length - 1, prev + 1),
                          )
                        }
                        className="px-8 py-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white font-semibold rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-3 text-lg shadow-lg shadow-amber-500/20 border border-amber-400/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Suivant <ArrowRight size={20} />
                      </m.button>
                    ) : (
                      <m.button
                        type="submit"
                        disabled={remainingSkillPoints !== 0}
                        className="px-8 py-4 bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold rounded-2xl hover:from-green-400 hover:to-green-500 transition-all flex items-center gap-3 shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-lg border border-green-400/30"
                        whileHover={
                          remainingSkillPoints === 0 ? { scale: 1.05 } : {}
                        }
                        whileTap={
                          remainingSkillPoints === 0 ? { scale: 0.95 } : {}
                        }
                      >
                        {remainingSkillPoints !== 0
                          ? `Répartissez tous les points (${remainingSkillPoints} restants)`
                          : "Envoyer la candidature"}
                        <Check size={20} />
                      </m.button>
                    )}
                  </div>
                </form>
              </div>
            </m.div>

            {/* Footer */}
            <m.div
              className="text-center text-slate-500 text-xs sm:text-sm mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              © {new Date().getFullYear()} Viking RP - Tous droits réservés
            </m.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Formulaire;
