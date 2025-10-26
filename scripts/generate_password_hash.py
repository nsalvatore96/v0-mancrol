"""
Script to generate bcrypt password hash for admin user.
Run this to generate a new password hash if needed.
"""
import bcrypt

password = "NSMancrol25@"
salt = bcrypt.gensalt(rounds=10)
hashed = bcrypt.hashpw(password.encode('utf-8'), salt)

print(f"Password: {password}")
print(f"Hash: {hashed.decode('utf-8')}")
print("\nCopy this hash to scripts/002_seed_admin.sql")
