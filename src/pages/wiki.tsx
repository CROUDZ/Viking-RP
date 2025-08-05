import React, { useState, useMemo, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import {
  Search,
  BookOpen,
  Sword,
  MapPin,
  Star,
  Zap,
  ArrowLeft,
  Grid,
  List,
  Filter,
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import SEO from "@/components/SEO";

// Import des images statiquement (Next.js optimise automatiquement)
//import religion from '@/assets/carte/icones-religions-65e34cd789990259600779.webp';
import asatruIcon from "@/assets/carte/icones-asatru-65e34bb5663d6718863350.webp"; // Assuming you have an icon for Asatru
import asatru1 from "@/assets/pages/asatru1-65e099dfb3dd0039640617.webp";
import asatru2 from "@/assets/pages/asatru2-65e099dfb54bb561093805.webp";
import asatru3 from "@/assets/pages/asatru3-65e099dfb5bb5942095478.webp";
import asatru4 from "@/assets/pages/asatru4-65e099dfb620e339008906.webp";
import culteDuMurIcon from "@/assets/carte/icones-culte-du-mur-65e34be404ea8658315222.webp"; // Assuming you have an icon for Culte du Mur
import culteDuMur from "@/assets/pages/culte-du-mur-65e09a2b3e204646029827.webp";
import cultesLibrosIcon from "@/assets/carte/icones-cultes-librosis-65e34bf0a3382232581448.webp";
import cultesLibros from "@/assets/pages/cultes-de-libros-65e09a4fa96ca623672633.webp";
import hazimismeIcon from "@/assets/carte/icones-hazimisme-65e34bccbebc0165847528.webp"; // Assuming you have an icon for Hazimisme
import hazimisme1 from "@/assets/pages/hazimisme1-65e09a19733b0153137574.webp";
import hazimisme2 from "@/assets/pages/hazimisme2-65e09a19747e0099871137.webp";
import hazimisme3 from "@/assets/pages/hazimisme3-65e09a1974e94904514046.webp";
import wegmessismeIcon from "@/assets/carte/icones-wegmessisme-65e34bbe62805080412391.webp"; // Assuming you have an icon for Wegmessisme
import wegmessisme1 from "@/assets/pages/wegmessisme1-65e099fc17966253383344.webp";
import wegmessisme2 from "@/assets/pages/wegmessisme2-65e099fc18d9c672685083.webp";
import wegmessisme3 from "@/assets/pages/wegmessisme23-65e099fc19405494270070.webp";
//import ravengardReligion from '@/assets/pages/ravengard-religion-6762ed918c21b886996775.webp';

//import pays from '@/assets/carte/icones-pays2-65e34ccbb216f354418705.webp';
import frisieIcon from "@/assets/carte/icones-frisie-65e34b60f3490062034260.webp"; // Assuming you have an icon for Frisie
import frisie1 from "@/assets/pages/lore-wiki-frisie1-65e09569e6dbe994488610.webp";
import frisie2 from "@/assets/pages/lore-wiki-frisie2-65e09569e8254203084110.webp";
import frisie3 from "@/assets/pages/lore-wiki-frisie3-65e09569e87de407170472.webp";
import galdieIcon from "@/assets/carte/icones-galdie-65e34b717f200575653236.webp"; // Assuming you have an icon for Galdie
import galdie1 from "@/assets/pages/lore-galdie1-65e095c681add363107260.webp";
import galdie2 from "@/assets/pages/lore-galdie2-65e098af1b842309354968.webp";
import galdie3 from "@/assets/pages/lore-galdie3-65e0991e910f1416081141.webp";
import kuzvarIcon from "@/assets/carte/icones-kuzvar-65e34b836bb1f559379383.webp"; // Assuming you have an icon for Kuzvar
import kuzvar1 from "@/assets/pages/lore-wiki-kuzvar1-65e0961910520940342592.webp";
import kuzvar2 from "@/assets/pages/lore-wiki-kuzvar2-65e0961911a67890088822.webp";
import kuzvar3 from "@/assets/pages/lore-wiki-kuzvar3-65e09619120ce474119810.webp";
import librosIcon from "@/assets/carte/icones-cultes-librosis-65e34bf0a3382232581448.webp"; // Assuming you have an icon for Libros
import libros1 from "@/assets/pages/lore-wiki-libros1-65e09653d3f9b760039055.webp";
import libros2 from "@/assets/pages/lore-wiki-libros2-65e09653d53cf909347855.webp";
import libros3 from "@/assets/pages/lore-wiki-libros3-65e09653d5ac2752016054.webp";
import ravengardIcon from "@/assets/carte/icones-ravengard-65e34b117b6bd088323509.webp"; // Assuming you have an icon for Ravengard
import ravengard1 from "@/assets/pages/lore-wiki-ravengard1-65e09469bcef9953138981.webp";
import ravengard2 from "@/assets/pages/lore-wiki-ravengard2-65e09396088b9832451414.webp";
import ravengard3 from "@/assets/pages/lore-wiki-ravengard3-65e0939608dd6615017668.webp";
import vladislavieIcon from "@/assets/carte/icones-vladislavie-65e34b8edef7f504578504.webp"; // Assuming you have an icon for Vladislavie
import vladislavie1 from "@/assets/pages/lore-wiki-vladislavie1-65e0963673c9c428886303.webp";
import vladislavie2 from "@/assets/pages/lore-wiki-vladislavie2-6762f9b507af1525545209.webp";
import vladislavie3 from "@/assets/pages/lore-wiki-vladislavie3-65e0963675808461015741.webp";

//import gameplay from '@/assets/carte/icones-gameplay-65e353b6aaa41706688320.webp';
import competenceIcon from "@/assets/carte/icones-competences-65e49605684c0246642226.webp"; // Assuming you have an icon for Competences
import competence1 from "@/assets/pages/competence-675860be7f6f2707857216.webp";
import competence2 from "@/assets/pages/competenceswiki2-65e4960569bf2567730131.webp";
import competence4 from "@/assets/pages/competenceswiki4-65e496056a667508359514.webp";
import competence5 from "@/assets/pages/competenceswiki5-65e496056ab97529601745.webp";
import competence6 from "@/assets/pages/competenceswiki6-65e496056b063891590450.webp";
import metierIcon from "@/assets/carte/icones-wiki-6760ac6de1e6b377581643.webp"; // Assuming you have an icon for Metiers
import metiers1 from "@/assets/pages/page1-metiers-6760ace323c23127854591.webp";
import metiers2 from "@/assets/pages/page2-metiers-6760ac6dea996316517952.webp";
import agilite from "@/assets/pages/agilite-6759c72da2159872454166.webp";

import bestiaire from "@/assets/carte/icones-bestiaire-65e88f2b103e9659906867.webp";
import bestiaire1 from "@/assets/pages/bestiaire1-65e88f2b11552749436791.webp";
import bestiaire2 from "@/assets/pages/bestiaire2-65e88f2b11c42346545091.webp";
import bestiaire3 from "@/assets/pages/bestiaire3-65e88f2b122d2063640595.webp";
import bestiaire4 from "@/assets/pages/bestiaire4-65e88f2b128f8848300231.webp";
import bestiaire5 from "@/assets/pages/bestiaire5-65e88f2b12eb8642223452.webp";
import bestiaire6 from "@/assets/pages/bestiaire6-65e88f2b134fb535667619.webp";
import bestiaire7 from "@/assets/pages/bestiaire7-65e88f2b13963609624017.webp";

import cartes from "@/assets/carte/cartes-677e53c6c8dbf242254607.webp";
import danheim from "@/assets/pages/danheim-677e53c6ca0aa600081204.webp";
//import thingraad from '@/assets/pages/thingraad-675879e0c7fa8915672507.webp';

interface WikiPage {
  id: string;
  title: string;
  category: string;
  icon: StaticImageData;
  images: StaticImageData[];
  description: string;
}

const wikiData: WikiPage[] = [
  // Religions
  {
    id: "asatru",
    title: "Ásatrú",
    category: "Religions",
    icon: asatruIcon,
    images: [asatru1, asatru2, asatru3, asatru4],
    description: "Religion nordique traditionnelle des Vikings",
  },
  {
    id: "culte-du-mur",
    title: "Culte du Mur",
    category: "Religions",
    icon: culteDuMurIcon,
    images: [culteDuMur],
    description: "Culte mystérieux centré autour du Grand Mur",
  },
  {
    id: "cultes-libros",
    title: "Cultes de Libros",
    category: "Religions",
    icon: cultesLibrosIcon,
    images: [cultesLibros],
    description: "Cultes religieux de la région de Libros",
  },
  {
    id: "hazimisme",
    title: "Hazimisme",
    category: "Religions",
    icon: hazimismeIcon,
    images: [hazimisme1, hazimisme2, hazimisme3],
    description: "Religion orientale aux traditions mystiques",
  },
  {
    id: "wegmessisme",
    title: "Wegmessisme",
    category: "Religions",
    icon: wegmessismeIcon,
    images: [wegmessisme1, wegmessisme2, wegmessisme3],
    description: "Culte moderne aux influences technologiques",
  },
  /*{
    id: 'ravengard-religion',
    title: 'Religion de Ravengard',
    category: 'Religions',
    images: [ravengardReligion],
    description: 'Croyances religieuses du royaume de Ravengard'
  },*/

  // Pays
  {
    id: "frisie",
    title: "Frisie",
    category: "Pays",
    icon: frisieIcon,
    images: [frisie1, frisie2, frisie3],
    description: "Royaume nordique aux traditions vikings",
  },
  {
    id: "galdie",
    title: "Galdie",
    category: "Pays",
    icon: galdieIcon,
    images: [galdie1, galdie2, galdie3],
    description: "Terre des guerriers et des forgerons",
  },
  {
    id: "kuzvar",
    title: "Kuzvar",
    category: "Pays",
    icon: kuzvarIcon,
    images: [kuzvar1, kuzvar2, kuzvar3],
    description: "Empire oriental aux mystères anciens",
  },
  {
    id: "libros",
    title: "Libros",
    category: "Pays",
    icon: librosIcon,
    images: [libros1, libros2, libros3],
    description: "Royaume des érudits et des bibliothèques",
  },
  {
    id: "ravengard",
    title: "Ravengard",
    category: "Pays",
    icon: ravengardIcon,
    images: [ravengard1, ravengard2, ravengard3],
    description: "Forteresse sombre aux corbeaux légendaires",
  },
  {
    id: "vladislavie",
    title: "Vladislavie",
    category: "Pays",
    icon: vladislavieIcon,
    images: [vladislavie1, vladislavie2, vladislavie3],
    description: "Terres slaves aux traditions ancestrales",
  },

  // Gameplay
  {
    id: "competences",
    title: "Compétences",
    category: "Gameplay",
    icon: competenceIcon,
    images: [
      competence1,
      competence2,
      competence4,
      competence5,
      competence6,
      agilite,
    ],
    description: "Système de compétences et d'aptitudes",
  },
  {
    id: "metiers",
    title: "Métiers",
    category: "Gameplay",
    icon: metierIcon,
    images: [metiers1, metiers2],
    description: "Professions et artisanats disponibles",
  },

  // Bestiaire
  {
    id: "bestiaire",
    title: "Bestiaire",
    category: "Bestiaire",
    icon: bestiaire,
    images: [
      bestiaire1,
      bestiaire2,
      bestiaire3,
      bestiaire4,
      bestiaire5,
      bestiaire6,
      bestiaire7,
    ],
    description: "Créatures et monstres du monde",
  },

  // Cartes spécial
  {
    id: "danheim",
    title: "Danheim",
    category: "Cartes",
    icon: cartes,
    images: [danheim],
    description: "Lieu mystique aux légendes anciennes",
  },
  /*{
    id: 'thingraad',
    title: 'Thingraad',
    category: 'Lore',
    images: [thingraad],
    description: 'Conseil des anciens et assemblée'
  }*/
];

const categoryConfig = {
  Religions: {
    icon: Star,
    gradient: "from-purple-500/20 to-indigo-500/20",
    border: "border-purple-500/30",
    text: "text-purple-400",
  },
  Pays: {
    icon: MapPin,
    gradient: "from-emerald-500/20 to-green-500/20",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
  },
  Gameplay: {
    icon: Zap,
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    text: "text-blue-400",
  },
  Bestiaire: {
    icon: Sword,
    gradient: "from-red-500/20 to-orange-500/20",
    border: "border-red-500/30",
    text: "text-red-400",
  },
  Cartes: {
    icon: BookOpen,
    gradient: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/30",
    text: "text-amber-400",
  },
};

export default function Wiki() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPage, setSelectedPage] = useState<WikiPage | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    // Only runs client-side
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Structured data for Wiki page
  const wikiStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Wiki Viking RP",
    description:
      "Guide complet du serveur Viking RP : religions, pays, gameplay, bestiaire et cartes",
    url: "https://viking-rp.fr/wiki",
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: wikiData.map((page) => ({
        "@type": "Question",
        name: page.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: page.description,
        },
      })),
    },
  };

  const categories = useMemo(() => {
    return Array.from(new Set(wikiData.map((page) => page.category)));
  }, []);

  const filteredPages = useMemo(() => {
    return wikiData.filter((page) => {
      const matchesSearch =
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || page.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const groupedPages = useMemo(() => {
    const grouped: { [key: string]: WikiPage[] } = {};
    filteredPages.forEach((page) => {
      if (!grouped[page.category]) {
        grouped[page.category] = [];
      }
      grouped[page.category].push(page);
    });
    return grouped;
  }, [filteredPages]);

  return (
    <>
      <SEO
        title="Wiki - Guide Complet Viking RP"
        description="Découvrez le guide complet de Viking RP : religions nordiques, pays légendaires, système de gameplay, bestiaire et cartes détaillées. Tout ce qu'il faut savoir pour jouer."
        keywords="wiki viking rp, guide minecraft roleplay, religions nordiques, pays vikings, gameplay RP, bestiaire medieval, cartes minecraft"
        structuredData={wikiStructuredData}
      />
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-b border-slate-700/50 pt-16 pb-8"
        >
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <m.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                    Wiki Viking RP
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Découvrez l'univers riche et immersif de notre serveur
                  roleplay viking
                </p>
              </m.div>

              {selectedPage && (
                <m.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => setSelectedPage(null)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-amber-500/25"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la liste
                </m.button>
              )}
            </div>
          </div>
        </m.div>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {selectedPage ? (
              <m.div
                key="page-detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-5xl mx-auto"
              >
                {/* Page Header */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8 mb-8 shadow-2xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${categoryConfig[selectedPage.category as keyof typeof categoryConfig]?.gradient} ${categoryConfig[selectedPage.category as keyof typeof categoryConfig]?.border} border`}
                    >
                      {(() => {
                        const IconComponent =
                          categoryConfig[
                            selectedPage.category as keyof typeof categoryConfig
                          ]?.icon || BookOpen;
                        return <IconComponent className="w-8 h-8 text-white" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {selectedPage.title}
                      </h1>
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${categoryConfig[selectedPage.category as keyof typeof categoryConfig]?.text} bg-slate-800/50 border ${categoryConfig[selectedPage.category as keyof typeof categoryConfig]?.border}`}
                        >
                          {selectedPage.category}
                        </span>
                        <span className="text-slate-400 text-sm">
                          {selectedPage.images.length} page
                          {selectedPage.images.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {selectedPage.description}
                  </p>
                </div>

                {/* Images Grid */}
                <div className="grid gap-6">
                  {selectedPage.images.map((image, index) => (
                    <m.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all"
                    >
                      <Image
                        src={image}
                        alt={`${selectedPage.title} - Page ${index + 1}`}
                        width={1200}
                        height={800}
                        className="w-full h-auto object-contain bg-slate-900/50"
                        placeholder="blur"
                        priority={index === 0}
                      />
                    </m.div>
                  ))}
                </div>
              </m.div>
            ) : (
              <m.div
                key="wiki-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Search and Filters */}
                <div className="max-w-4xl mx-auto mb-12">
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher dans le wiki..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-lg"
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="sm:hidden flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 transition-all"
                      >
                        <Filter className="w-4 h-4" />
                        Filtres
                      </button>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 border border-slate-600/50">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-amber-500 text-white" : "text-slate-400 hover:text-slate-300"}`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-amber-500 text-white" : "text-slate-400 hover:text-slate-300"}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Category Filters */}
                  <m.div
                    initial={false}
                    animate={{
                      height: showFilters || isWideScreen ? "auto" : 0,
                      opacity: showFilters || isWideScreen ? 1 : 0,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-3 pt-6">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-4 py-2 rounded-xl border font-medium transition-all ${
                          selectedCategory === "all"
                            ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25"
                            : "bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50"
                        }`}
                      >
                        Toutes les catégories
                      </button>
                      {categories.map((category) => {
                        const config =
                          categoryConfig[
                            category as keyof typeof categoryConfig
                          ];
                        const IconComponent = config?.icon || BookOpen;
                        return (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-all ${
                              selectedCategory === category
                                ? `${config?.text} bg-gradient-to-r ${config?.gradient} ${config?.border} shadow-lg`
                                : "bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50"
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  </m.div>
                </div>

                {/* Results */}
                {filteredPages.length === 0 ? (
                  <m.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="text-6xl mb-6">🔍</div>
                    <h3 className="text-2xl font-bold text-slate-400 mb-3">
                      Aucun résultat trouvé
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Essayez de modifier vos critères de recherche ou explorez
                      d'autres catégories.
                    </p>
                  </m.div>
                ) : (
                  <div className="space-y-16">
                    {Object.entries(groupedPages).map(([category, pages]) => {
                      const config =
                        categoryConfig[category as keyof typeof categoryConfig];
                      const IconComponent = config?.icon || BookOpen;

                      return (
                        <m.section
                          key={category}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="flex items-center gap-4 mb-8">
                            <div
                              className={`p-3 rounded-xl bg-gradient-to-br ${config?.gradient} ${config?.border} border shadow-lg`}
                            >
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">
                              {category}
                            </h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent"></div>
                            <span className="text-slate-400 text-sm">
                              {pages.length} élément
                              {pages.length > 1 ? "s" : ""}
                            </span>
                          </div>

                          <div
                            className={
                              viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                : "space-y-4"
                            }
                          >
                            {pages.map((page, index) => (
                              <m.article
                                key={page.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedPage(page)}
                                className={`group cursor-pointer bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 transform hover:-translate-y-1 ${
                                  viewMode === "list" ? "flex items-center" : ""
                                }`}
                              >
                                <div
                                  className={`relative overflow-hidden ${
                                    viewMode === "list"
                                      ? "w-24 h-24 flex-shrink-0"
                                      : "aspect-video"
                                  }`}
                                >
                                  <Image
                                    src={page.icon}
                                    alt={page.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    placeholder="blur"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                  {viewMode === "grid" && (
                                    <div className="absolute bottom-3 left-3 right-3">
                                      <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg">
                                        {page.title}
                                      </h3>
                                    </div>
                                  )}
                                </div>

                                <div className="p-4 sm:p-6 flex-1">
                                  {viewMode === "list" && (
                                    <h3 className="text-xl font-bold text-white mb-2">
                                      {page.title}
                                    </h3>
                                  )}
                                  <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">
                                    {page.description}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span
                                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config?.text} bg-slate-800/50 border ${config?.border}`}
                                    >
                                      <IconComponent className="w-3 h-3" />
                                      {page.category}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                      {page.images.length} page
                                      {page.images.length > 1 ? "s" : ""}
                                    </span>
                                  </div>
                                </div>
                              </m.article>
                            ))}
                          </div>
                        </m.section>
                      );
                    })}
                  </div>
                )}
              </m.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
