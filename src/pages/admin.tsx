import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { m, AnimatePresence } from "framer-motion";
import { Users, Shield, Activity, Home, Scroll } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import SEO from "@/components/SEO";
import StatCard from "@/components/admin/StatCard";
import UserTable from "@/components/admin/UserTable";
import Loading from "@/components/Loading";
import AccessDenied from "@/components/AccessDenied";
import Logo from "@/assets/logo/logo_v.webp";
import { isAdmin } from "@/lib/permissions";

interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalModerators: number;
  recentUsers: number;
  activeSessions: number;
}

interface LatestUser {
  id: string;
  name: string | null;
  email: string | null;
  minecraftPseudo: string | null;
  role: string;
  createdAt: string;
}

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  minecraftPseudo: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    sessions: number;
  };
}

interface UsersPagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface FormulaireData {
  id: string;
  discordPseudo: string;
  email: string;
  ageIRL: number;
  decouverteViking: string;
  originePersonnage: string;
  ageRP: number;
  nomPersonnage: string;
  metierPrincipal: string;
  taillePersonnage: string;
  histoirePersonnage: string;
  descriptionPhysique: string;
  competences: {
    force: number;
    robustesse: number;
    agilite: number;
    intelligence: number;
    artisanat: number;
  };
  apportRoleplay: string;
  projets: string;
  reglementLu: boolean;
  loreLu: boolean;
  pseudoParrain?: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [latestUsers, setLatestUsers] = useState<LatestUser[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [usersPagination, setUsersPagination] = useState<UsersPagination>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [formulaires, setFormulaires] = useState<FormulaireData[]>([]);

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "formulaires"
  >("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [formulairesLoading, setFormulairesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Vérification des permissions
  useEffect(() => {
    console.log("Checking permissions");
    if (status === "loading") return;

    // On ne redirige plus, on laisse le composant AccessDenied gérer l'affichage
    setIsLoading(false);
    console.log("User is admin, loading stats and users");
  }, [session, status, router]);

  // Chargement des statistiques
  useEffect(() => {
    if (!session || !isAdmin(session.user?.role)) return;

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des statistiques");

        const data = await response.json();
        setStats(data.stats);
        setLatestUsers(data.latestUsers);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [session]);

  // Chargement des utilisateurs
  const fetchUsers = useCallback(
    async (page = 1) => {
      setUsersLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          search: searchQuery,
        });

        const response = await fetch(`/api/admin/users?${params}`);
        if (!response.ok)
          throw new Error("Erreur lors du chargement des utilisateurs");

        const data = await response.json();
        setUsers(data.users);
        setUsersPagination(data.pagination);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setUsersLoading(false);
      }
    },
    [searchQuery],
  );

  // Chargement des formulaires
  const fetchFormulaires = useCallback(async () => {
    setFormulairesLoading(true);
    try {
      const response = await fetch("/api/formulaire");
      if (!response.ok)
        throw new Error("Erreur lors du chargement des formulaires");
      const data = await response.json();
      setFormulaires(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setFormulairesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !isAdmin(session.user?.role)) return;
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "formulaires") {
      fetchFormulaires();
    }
  }, [session, activeTab, searchQuery, fetchUsers, fetchFormulaires]);

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role }),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la mise à jour du rôle");

      // Recharger les utilisateurs
      await fetchUsers(usersPagination.currentPage);

      // Recharger les stats si nécessaire
      if (activeTab === "dashboard") {
        const statsResponse = await fetch("/api/admin/stats");
        if (statsResponse.ok) {
          const data = await statsResponse.json();
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour du rôle");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      // Recharger les utilisateurs
      await fetchUsers(usersPagination.currentPage);

      // Recharger les stats
      if (activeTab === "dashboard") {
        const statsResponse = await fetch("/api/admin/stats");
        if (statsResponse.ok) {
          const data = await statsResponse.json();
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleDeleteFormulaire = async (id: string) => {
    if (!window.confirm("Supprimer ce formulaire ?")) return;
    try {
      const response = await fetch(`/api/formulaire?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      await fetchFormulaires();
    } catch {
      alert("Erreur lors de la suppression du formulaire");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (!session) {
    return null; // Redirection en cours
  }

  if (!isAdmin(session.user?.role)) {
    return (
      <>
        <SEO
          title="Accès Refusé - Administration Viking RP"
          description="Accès refusé à la page d'administration. Droits administrateur requis."
          noindex={true}
        />
        <AccessDenied message="Vous devez être administrateur pour accéder au panneau d'administration." />
      </>
    );
  }

  return (
    <>
      <SEO
        title="Administration - Panneau de contrôle Viking RP"
        description="Panneau d'administration pour la gestion du serveur Viking RP. Accès réservé aux administrateurs."
        keywords="admin viking rp, administration minecraft, gestion serveur"
        noindex={true}
      />

      <div className="min-h-screen bg-black">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-black to-gray-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Navigation */}
          <nav className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Image
                    src={Logo}
                    alt="VikingRP Logo"
                    width={40}
                    height={40}
                    className="mr-3"
                  />
                  <span className="text-xl font-bold text-white">
                    Admin Panel
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {(session.user.name ||
                          session.user.email ||
                          "?")[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white text-sm">
                      {session.user.name || session.user.email}
                    </span>
                  </div>

                  <Link
                    href="/"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <Home size={16} />
                    Accueil
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 mb-8 border border-gray-700 w-fit">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Activity size={16} />
                Tableau de bord
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "users"
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Users size={16} />
                Utilisateurs
              </button>
              <button
                onClick={() => setActiveTab("formulaires")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "formulaires"
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Scroll size={16} />
                Formulaires
              </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <m.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8 pb-8"
                >
                  {stats && (
                    <>
                      {/* Statistics Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                          title="Utilisateurs Total"
                          value={stats.totalUsers}
                          icon={Users}
                          description="Tous les comptes créés"
                          color="blue"
                        />
                        <StatCard
                          title="Administrateurs"
                          value={stats.totalAdmins}
                          icon={Shield}
                          description="Comptes administrateurs"
                          color="amber"
                        />
                        <StatCard
                          title="Modérateurs"
                          value={stats.totalModerators}
                          icon={Shield}
                          description="Comptes modérateurs"
                          color="purple"
                        />
                        <StatCard
                          title="Sessions Actives"
                          value={stats.activeSessions}
                          icon={Activity}
                          description="Utilisateurs connectés"
                          color="green"
                        />
                      </div>

                      {/* Latest Users */}
                      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-6">
                          Derniers utilisateurs inscrits
                        </h3>
                        <div className="space-y-4">
                          {latestUsers.map((user, index) => (
                            <m.div
                              key={user.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
                            >
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">
                                    {(user.name ||
                                      user.email ||
                                      "?")[0].toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-white">
                                    {user.name || "Sans nom"}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-300">
                                  {user.minecraftPseudo || "Sans pseudo"}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {new Date(user.createdAt).toLocaleDateString(
                                    "fr-FR",
                                  )}
                                </div>
                              </div>
                            </m.div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </m.div>
              )}

              {activeTab === "users" && (
                <m.div
                  key="users"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="pb-8"
                >
                  <UserTable
                    users={users}
                    pagination={usersPagination}
                    onUpdateRole={handleUpdateRole}
                    onDeleteUser={handleDeleteUser}
                    onPageChange={handlePageChange}
                    onSearch={handleSearch}
                    isLoading={usersLoading}
                  />
                </m.div>
              )}

              {activeTab === "formulaires" && (
                <m.div
                  key="formulaires"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="pb-8"
                >
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Tous les formulaires de candidature
                  </h3>
                  {formulairesLoading ? (
                    <Loading />
                  ) : (
                    <div className="space-y-4">
                      {formulaires.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-400 bg-gray-900/50 rounded-xl border border-gray-700">
                          Aucun formulaire trouvé.
                        </div>
                      ) : (
                        formulaires.map((f) => (
                          <AccordionFormulaire
                            key={f.id}
                            formulaire={f}
                            onDelete={handleDeleteFormulaire}
                          />
                        ))
                      )}
                    </div>
                  )}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

function AccordionFormulaire({
  formulaire,
  onDelete,
}: {
  formulaire: FormulaireData;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-900/60 border border-gray-700 rounded-xl shadow-lg">
      <button
        className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <span className="font-semibold text-white text-lg">
            {formulaire.nomPersonnage}
          </span>
          <span className="ml-3 text-gray-400">{formulaire.discordPseudo}</span>
          <span className="ml-3 text-gray-400">{formulaire.email}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            {new Date(formulaire.createdAt).toLocaleDateString("fr-FR")}
          </span>
          <span
            className={`transition-transform ${
              open ? "rotate-90" : ""
            } text-gray-300`}
          >
            ▶
          </span>
        </div>
      </button>
      {open && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <FormField label="Âge IRL" value={formulaire.ageIRL} />
            <FormField
              label="Découverte Viking"
              value={formulaire.decouverteViking}
            />
            <FormField
              label="Origine Personnage"
              value={formulaire.originePersonnage}
            />
            <FormField label="Âge RP" value={formulaire.ageRP} />
            <FormField
              label="Métier Principal"
              value={formulaire.metierPrincipal}
            />
            <FormField
              label="Taille Personnage"
              value={formulaire.taillePersonnage}
            />
            <FormField
              label="Histoire Personnage"
              value={formulaire.histoirePersonnage}
            />
            <FormField
              label="Description Physique"
              value={formulaire.descriptionPhysique}
            />
            <FormField
              label="Compétences"
              value={
                Array.isArray(formulaire.competences)
                  ? formulaire.competences.join(", ")
                  : typeof formulaire.competences === "object"
                    ? JSON.stringify(formulaire.competences)
                    : String(formulaire.competences)
              }
            />
            <FormField
              label="Apport Roleplay"
              value={formulaire.apportRoleplay}
            />
            <FormField label="Projets" value={formulaire.projets} />
            <FormField
              label="Règlement Lu"
              value={formulaire.reglementLu ? "Oui" : "Non"}
            />
            <FormField
              label="Lore Lu"
              value={formulaire.loreLu ? "Oui" : "Non"}
            />
            <FormField
              label="Pseudo Parrain"
              value={formulaire.pseudoParrain || "-"}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onDelete(formulaire.id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="mb-2">
      <span className="font-medium text-gray-300">{label} : </span>
      <span className="text-white break-words">{value}</span>
    </div>
  );
}
