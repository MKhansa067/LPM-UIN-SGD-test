import crypto from "crypto";

const secret = crypto.randomBytes(32).toString("hex");
console.log("\nGenerated NEXTAUTH_SECRET:");
console.log(secret);
console.log("\nMasukkan secret ini ke file .env.local atau .env.production!\n");
