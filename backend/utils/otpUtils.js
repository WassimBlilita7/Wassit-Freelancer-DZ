// utils/otpUtils.js

// Génère un OTP de 6 chiffres uniquement
export function generateOTP() {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

// Valide l'OTP
export function validateOTP(inputOTP, userOTP, otpExpires) {
  if (Date.now() > otpExpires) {
    return { isValid: false, message: "Le code OTP a expiré" };
  }
  if (inputOTP !== userOTP) {
    return { isValid: false, message: "Code OTP incorrect" };
  }
  return { isValid: true, message: "OTP valide" };
}