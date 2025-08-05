import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  ShieldCheck,
  Trash2,
  Calendar,
  Mail,
  Gamepad2,
  MoreVertical,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

interface UserTableProps {
  users: UserData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onUpdateRole: (userId: string, role: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const roleConfig = {
  USER: { label: "Utilisateur", icon: User, color: "text-gray-400" },
  MODERATOR: { label: "Modérateur", icon: Shield, color: "text-blue-400" },
  ADMIN: {
    label: "Administrateur",
    icon: ShieldCheck,
    color: "text-amber-400",
  },
};

export default function UserTable({
  users,
  pagination,
  onUpdateRole,
  onDeleteUser,
  onPageChange,
  onSearch,
  isLoading = false,
}: UserTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionUser, setActionUser] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await onUpdateRole(userId, newRole);
      setActionUser(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        await onDeleteUser(userId);
        setActionUser(null);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700">
      {/* En-tête avec recherche */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            Gestion des utilisateurs
          </h3>
          <div className="text-sm text-gray-400">
            {pagination.totalUsers} utilisateurs au total
          </div>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Rechercher par email, nom ou pseudo..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Minecraft
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Inscrit le
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Sessions
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            <AnimatePresence>
              {users.map((user, index) => {
                const RoleIcon =
                  roleConfig[user.role as keyof typeof roleConfig]?.icon ||
                  User;
                const roleColor =
                  roleConfig[user.role as keyof typeof roleConfig]?.color ||
                  "text-gray-400";
                const roleLabel =
                  roleConfig[user.role as keyof typeof roleConfig]?.label ||
                  user.role;

                return (
                  <m.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {(user.name || user.email || "?")[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.name || "Sans nom"}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center">
                            <Mail size={12} className="mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center ${roleColor}`}>
                        <RoleIcon size={16} className="mr-2" />
                        <span className="text-sm font-medium">{roleLabel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 flex items-center">
                        <Gamepad2 size={14} className="mr-2 text-gray-400" />
                        {user.minecraftPseudo || "Non défini"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 flex items-center">
                        <Calendar size={14} className="mr-2 text-gray-400" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">
                        {user._count.sessions} active
                        {user._count.sessions > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActionUser(
                              actionUser === user.id ? null : user.id,
                            )
                          }
                          className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50"
                        >
                          <MoreVertical size={16} />
                        </button>

                        <AnimatePresence>
                          {actionUser === user.id && (
                            <m.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-10"
                            >
                              <div className="py-2">
                                <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                                  Changer le rôle
                                </div>
                                {Object.entries(roleConfig).map(
                                  ([role, config]) => (
                                    <button
                                      key={role}
                                      onClick={() =>
                                        handleRoleChange(user.id, role)
                                      }
                                      disabled={user.role === role}
                                      className={`w-full px-4 py-2 text-left text-sm flex items-center hover:bg-gray-700/50 transition-colors ${
                                        user.role === role
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }`}
                                    >
                                      <config.icon
                                        size={14}
                                        className={`mr-2 ${config.color}`}
                                      />
                                      {config.label}
                                    </button>
                                  ),
                                )}
                                <div className="border-t border-gray-700 mt-2 pt-2">
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 transition-colors flex items-center"
                                  >
                                    <Trash2 size={14} className="mr-2" />
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                            </m.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </m.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Page {pagination.currentPage} sur {pagination.totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
          >
            <ChevronLeft size={16} className="mr-1" />
            Précédent
          </button>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
          >
            Suivant
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-xl"
          >
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
