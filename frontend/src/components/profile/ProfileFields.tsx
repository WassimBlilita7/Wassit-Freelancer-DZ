import { Controller, UseFormReturn } from "react-hook-form";
import { ProfileFormData } from "../../schemas/profileSchema";
import { motion } from "framer-motion";
import { FaUser, FaBriefcase, FaGlobe, FaEdit, FaGithub, FaLinkedin, FaTools } from "react-icons/fa";
import { JSX } from "react";
import { SkillsInput } from "../ui/SkillsInput";

interface FieldConfig {
  name: keyof ProfileFormData;
  label: string;
  placeholder: string;
  icon: JSX.Element;
  required?: boolean;
  type?: "text" | "textarea" | "skills";
  freelancerOnly?: boolean;
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
    name: "skills",
    label: "Compétences",
    placeholder: "Ajoutez vos compétences...",
    icon: <FaTools className="text-[var(--profile-header-start)]" />,
    type: "skills",
    required: true,
    freelancerOnly: true,
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
    placeholder: "Entrez l'URL de votre site",
    icon: <FaGlobe className="text-[var(--profile-header-start)]" />,
  },
  {
    name: "github",
    label: "GitHub",
    placeholder: "Entrez l'URL de votre profil GitHub",
    icon: <FaGithub className="text-[var(--profile-header-start)]" />,
    freelancerOnly: true,
  },
  {
    name: "linkedIn",
    label: "LinkedIn",
    placeholder: "Entrez l'URL de votre profil LinkedIn",
    icon: <FaLinkedin className="text-[var(--profile-header-start)]" />,
    freelancerOnly: true,
  },
];

interface ProfileFieldsProps {
  form: UseFormReturn<ProfileFormData>;
  submitting: boolean;
  isFreelancer: boolean;
}

export const ProfileFields = ({ form, submitting, isFreelancer }: ProfileFieldsProps) => {
  const { control, formState: { errors } } = form;

  const filteredFields = profileFieldsConfig.filter(field => !field.freelancerOnly || isFreelancer);

  return (
    <div className="space-y-6">
      {filteredFields.map((field, index) => (
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
            defaultValue=""
            render={({ field: controllerField }) => {
              if (field.type === "textarea") {
                return (
                  <textarea
                    {...controllerField}
                    placeholder={field.placeholder}
                    className={`w-full mt-2 p-3 rounded-lg border-2 ${errors[field.name] ? "border-[var(--error)]" : "border-[var(--profile-input-border)]"} focus:border-[var(--profile-input-focus)] focus:ring-2 focus:ring-[var(--profile-input-focus)]/30 transition-all h-32 resize-none`}
                    style={{ 
                      backgroundColor: "var(--profile-input-bg)", 
                      color: "var(--text)" 
                    }}
                    disabled={submitting}
                  />
                );
              } else if (field.type === "skills") {
                return (
                  <div className="mt-2">
                    <SkillsInput
                      skills={Array.isArray(controllerField.value) ? controllerField.value : []}
                      onChange={controllerField.onChange}
                      disabled={submitting}
                    />
                  </div>
                );
              } else {
                return (
                  <input
                    {...controllerField}
                    placeholder={field.placeholder}
                    className={`w-full mt-2 p-3 rounded-lg border-2 ${errors[field.name] ? "border-[var(--error)]" : "border-[var(--profile-input-border)]"} focus:border-[var(--profile-input-focus)] focus:ring-2 focus:ring-[var(--profile-input-focus)]/30 transition-all`}
                    style={{ 
                      backgroundColor: "var(--profile-input-bg)", 
                      color: "var(--text)" 
                    }}
                    disabled={submitting}
                  />
                );
              }
            }}
          />
          {errors[field.name] && (
            <p className="text-[var(--error)] text-sm mt-1">{errors[field.name]?.message}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
};