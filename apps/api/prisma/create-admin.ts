import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "info@starkite.tech";
  const password = "STR-90366#in-nam";
  const name = "Platform Admin";

  console.log("🔐  Creating admin account for", email, "...");

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "admin",
      name
    },
    create: {
      email,
      name,
      role: "admin",
      passwordHash,
      staff: {
        create: { roleTitle: "Academy Administrator" }
      }
    },
    include: { staff: true }
  });

  console.log("✅  Admin account ready:");
  console.log("    Email :", user.email);
  console.log("    Name  :", user.name);
  console.log("    Role  :", user.role);
  console.log("    ID    :", user.id);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
