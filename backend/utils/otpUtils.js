import otpGenerator from "otp-generator";

// Générer un OTP
export const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
};

// Valider un OTP
export const validateOTP = (userOTP, storedOTP, otpExpires) => {
  if (userOTP !== storedOTP) {
    return { isValid: false, message: "Code OTP invalide" };
  }
  if (Date.now() > otpExpires) {
    return { isValid: false, message: "Code OTP expiré" };
  }
  return { isValid: true, message: "Code OTP valide" };
};