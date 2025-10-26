"use server"

import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  dni: string
  full_name: string
  created_at: string
  updated_at: string
}

export interface Permission {
  id: string
  user_id: string
  permission_slug: string
  enabled: boolean
}

export async function loginWithDNI(dni: string, password: string) {
  const supabase = await createClient()

  // Get user by DNI
  const { data: user, error: userError } = await supabase.from("users").select("*").eq("dni", dni).single()

  if (userError || !user) {
    return { error: "DNI o contraseña incorrectos" }
  }

  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.password_hash)

  if (!passwordMatch) {
    return { error: "DNI o contraseña incorrectos" }
  }

  // Create a session by signing in with a custom token
  // Since we're using custom auth, we'll store the user ID in a cookie
  return { success: true, user }
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()

  // For now, we'll use a simple approach with cookies
  // In production, you might want to use JWT tokens
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return null
  }

  const { data: user } = await supabase.from("users").select("*").eq("id", authUser.id).single()

  return user
}

export async function getUserPermissions(userId: string): Promise<Permission[]> {
  const supabase = await createClient()

  const { data: permissions } = await supabase.from("user_permissions").select("*").eq("user_id", userId)

  return permissions || []
}

export async function hasPermission(userId: string, permissionSlug: string): Promise<boolean> {
  const permissions = await getUserPermissions(userId)
  const permission = permissions.find((p) => p.permission_slug === permissionSlug)
  return permission?.enabled || false
}
