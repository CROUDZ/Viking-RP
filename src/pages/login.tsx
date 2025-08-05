import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { validateMinecraftUsername } from "../lib/minecraft";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from "next/image";
import SEO from "@/components/SEO";
import { useRouter } from "next/router";
import Logo from "@/assets/logo/logo_v.webp"; // Adjust the path as necessary

interface LoginFormData {
  email: string;
  password: string;
  minecraftPseudo: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  minecraftPseudo?: string;
  global?: string;
}

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    minecraftPseudo: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    getSession().then((session) => {
      if (session) {
        router.push("/");
      }
    });
  }, [router]);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengthLevels = [
      { label: "Très faible", color: "bg-red-500" },
      { label: "Faible", color: "bg-orange-500" },
      { label: "Moyen", color: "bg-yellow-500" },
      { label: "Fort", color: "bg-blue-500" },
      { label: "Très fort", color: "bg-green-500" },
    ];

    return {
      score,
      label: strengthLevels[score].label,
      color: strengthLevels[score].color,
    };
  };

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // Validation email
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation mot de passe (seulement minimum 5 caractères)
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 5) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 5 caractères";
    }

    // Validation pseudo Minecraft (seulement pour l'inscription)
    if (isRegistering) {
      if (!formData.minecraftPseudo) {
        newErrors.minecraftPseudo = "Le pseudo Minecraft est requis";
      } else if (!validateMinecraftUsername(formData.minecraftPseudo)) {
        newErrors.minecraftPseudo =
          "Pseudo Minecraft invalide (3-16 caractères, alphanumériques et _ uniquement)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage("");
    setErrors({});

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        minecraftPseudo: formData.minecraftPseudo,
        isRegistering: isRegistering.toString(),
        redirect: false,
      });

      if (result?.error) {
        setErrors({ global: result.error });
      } else if (result?.ok) {
        router.push("/"); // Rediriger vers la page d'accueil après connexion/réussite d'inscription
      }
    } catch {
      setErrors({ global: "Une erreur est survenue" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      <SEO
        title="Connexion - Rejoignez l'aventure Viking"
        description="Connectez-vous à Viking RP pour rejoindre l'aventure viking la plus immersive de Minecraft. Accédez à votre compte et plongez dans l'univers nordique."
        keywords="connexion viking rp, login minecraft roleplay, compte viking, se connecter serveur"
        noindex={true}
      />
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-black to-gray-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700 relative z-10"
        >
          {/* En-tête */}
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-center"
          >
            <Image
              src={Logo}
              alt="VikingRP Logo"
              width={128}
              height={128}
              className="mx-auto mb-4"
            />
            <p className="text-gray-300">
              {isRegistering
                ? "Rejoignez l'aventure"
                : "Connectez-vous à votre compte"}
            </p>
          </m.div>

          {/* Messages */}
          <AnimatePresence>
            {message && (
              <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-green-900/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg"
              >
                {message}
              </m.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {errors.global && (
              <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg"
              >
                {errors.global}
              </m.div>
            )}
          </AnimatePresence>

          <m.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            onSubmit={handleFormSubmit}
            className="space-y-6"
          >
            {/* Toggle Buttons */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex bg-gray-800/50 rounded-lg p-1 mb-6 border border-gray-700"
            >
              <m.button
                type="button"
                onClick={() => setIsRegistering(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  !isRegistering
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                Connexion
              </m.button>
              <m.button
                type="button"
                onClick={() => setIsRegistering(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  isRegistering
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                Inscription
              </m.button>
            </m.div>

            {/* Email Field */}
            <m.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <m.input
                  whileFocus={{ scale: 1.01 }}
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 ${
                    errors.email ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="votre@email.com"
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <m.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.email}
                  </m.p>
                )}
              </AnimatePresence>
            </m.div>

            {/* Password Field */}
            <m.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <m.input
                  whileFocus={{ scale: 1.01 }}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 ${
                    errors.password ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && isRegistering && (
                <m.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3"
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <m.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(calculatePasswordStrength(formData.password).score / 4) * 100}%`,
                        }}
                        transition={{ duration: 0.3 }}
                        className={`h-full rounded-full transition-all ${
                          calculatePasswordStrength(formData.password).color
                        }`}
                      />
                    </div>
                    <span className="text-xs text-gray-400 min-w-[70px]">
                      {calculatePasswordStrength(formData.password).label}
                    </span>
                  </div>
                </m.div>
              )}

              <AnimatePresence>
                {errors.password && (
                  <m.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.password}
                  </m.p>
                )}
              </AnimatePresence>
            </m.div>

            {/* Minecraft Username Field */}
            <AnimatePresence>
              {isRegistering && (
                <m.div
                  initial={{ opacity: 0, height: 0, x: -20 }}
                  animate={{ opacity: 1, height: "auto", x: 0 }}
                  exit={{ opacity: 0, height: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <label
                    htmlFor="minecraftPseudo"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Pseudo Minecraft Java
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <m.input
                      whileFocus={{ scale: 1.01 }}
                      id="minecraftPseudo"
                      name="minecraftPseudo"
                      type="text"
                      value={formData.minecraftPseudo}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 ${
                        errors.minecraftPseudo
                          ? "border-red-500"
                          : "border-gray-600"
                      }`}
                      placeholder="VotrePseudo"
                    />
                  </div>
                  <AnimatePresence>
                    {errors.minecraftPseudo && (
                      <m.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 text-sm text-red-400"
                      >
                        {errors.minecraftPseudo}
                      </m.p>
                    )}
                  </AnimatePresence>
                  <p className="mt-2 text-xs text-gray-400">
                    3-16 caractères, lettres, chiffres et _ uniquement
                  </p>
                </m.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <m.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : null}
              {isLoading
                ? isRegistering
                  ? "Inscription..."
                  : "Connexion..."
                : isRegistering
                  ? "S'inscrire"
                  : "Se connecter"}
            </m.button>
          </m.form>

          {/* Back to Home Link */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors duration-200"
            >
              <ArrowLeft size={16} />
              Retour à l'accueil
            </Link>
          </m.div>
        </m.div>
      </div>
    </>
  );
}
