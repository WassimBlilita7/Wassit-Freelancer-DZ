import { Controller, UseFormReturn } from "react-hook-form";
import { ProfileFormData } from "../../schemas/profileSchema";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { FaUser, FaBriefcase, FaGlobe, FaEdit } from "react-icons/fa";
import { JSX } from "react";

interface FieldConfig {
  name: keyof ProfileFormData;
  label: string;
  placeholder: string;
  icon: JSX.Element;
  required?: boolean;
  type?: "text" | "textarea";
}

const profileFieldsConfig: FieldConfig[] = [
  {
    name: "firstName",
    label: "Prénom",
    placeholder: "Entrez votre prénom",
    icon: <FaUser className="text-[var(--profile-header-start)]" />,
    required: true,
  },
  {
    name: "lastName",
    label: "Nom",
    placeholder: "Entrez votre nom",
    icon: <FaUser className="text-[var(--profile-header-start)]" />,
    required: true,
  },
  {
    name: "bio",
    label: "Bio",
    placeholder: "Décrivez-vous en quelques mots...",
    icon: <FaEdit className="text-[var(--profile-header-start)]" />,
    type: "textarea",
  },
  {
    name: "companyName",
    label: "Nom de l'entreprise",
    placeholder: "Entrez le nom de votre entreprise",
    icon: <FaBriefcase className="text-[var(--profile-header-start)]" />,
  },
  {
    name: "webSite",
    label: "Site web",
    placeholder: "Entrez l’URL de votre site",
    icon: <FaGlobe className="text-[var(--profile-header-start)]" />,
  },
];

interface ProfileFieldsProps {
  form: UseFormReturn<ProfileFormData>;
  submitting: boolean;
}

export const ProfileFields = ({ form, submitting }: ProfileFieldsProps) => {
  const { theme } = useTheme();
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      {profileFieldsConfig.map((field, index) => (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <label className="flex items-center text-lg font-medium" style={{ color: "var(--text)" }}>
            {field.icon}
            <span className="ml-2">{field.label}</span>
            {field.required && <span className="text-[var(--error)] ml-1">*</span>}
          </label>
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              field.type === "textarea" ? (
                <textarea
                  {...controllerField}
                  placeholder={field.placeholder}
                  className={`w-full mt-2 p-3 rounded-lg border-2 ${errors[field.name] ? "border-[var(--error)]" : "border-[var(--muted)]/50"} focus:border-[var(--profile-header-start)] focus:ring-2 focus:ring-[var(--profile-header-start)]/30 transition-all h-32 resize-none`}
                  style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                  disabled={submitting}
                />
              ) : (
                <input
                  {...controllerField}
                  placeholder={field.placeholder}
                  className={`w-full mt-2 p-3 rounded-lg border-2 ${errors[field.name] ? "border-[var(--error)]" : "border-[var(--muted)]/50"} focus:border-[var(--profile-header-start)] focus:ring-2 focus:ring-[var(--profile-header-start)]/30 transition-all`}
                  style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                  disabled={submitting}
                />
              )
            )}
          />
          {errors[field.name] && <p className="text-[var(--error)] text-sm mt-1">{errors[field.name]?.message}</p>}
        </motion.div>
      ))}
    </div>
  );
};