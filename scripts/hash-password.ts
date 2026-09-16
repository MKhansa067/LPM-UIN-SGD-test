import bcrypt from "bcryptjs";

const password = process.argv[2] || "admin123";

async function main() {
  const hash = await bcrypt.hash(password, 12);
  console.log(`\nPassword: ${password}`);
  console.log(`Bcrypt Hash: ${hash}\n`);
}

main();
