import bcrypt from "bcryptjs"

async function generateHash() {
  const password = "NSMancrol25@"
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  console.log("Password:", password)
  console.log("Hash:", hash)
  console.log("\nSQL to update admin user:")
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE dni = '39488736';`)

  // Verify the hash works
  const isValid = await bcrypt.compare(password, hash)
  console.log("\nHash verification:", isValid ? "SUCCESS ✓" : "FAILED ✗")
}

generateHash()
