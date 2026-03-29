export const ENV = {
  PORT: process.env.PORT || "3000",
  JWT_SECRET: process.env.JWT_SECRET || "JWTCHATTYSHEHAB",
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_USERNAME: process.env.DB_USERNAME || "ahmedessam9608",
  DB_PASSWORD: process.env.DB_PASSWORD || "MpdXi8kWhhkTSiTp",
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb+srv://ahmedessam9608:<db_password>@cluster0.lleswcm.mongodb.net/chatty_db?appName=Cluster0",
  RESEND_API_KEY:
    process.env.RESEND_API_KEY || "re_3KkqrdZR_LHeHjTVef4gTJrmWY2GKyWEE",
  EMAIL_FROM: process.env.EMAIL_FROM || "onboarding@resend.dev",
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  ARCJET_KEY: process.env.ARCJET_KEY,
  ARCJET_ENV: process.env.ARCJET_ENV,
};
