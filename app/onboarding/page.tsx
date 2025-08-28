"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { User } from "@/lib/types/database"
import { Users, Plus } from "lucide-react"

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [step, setStep] = useState<"welcome" | "create-group" | "join-group">("welcome")
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [groupZones, setGroupZones] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push("/auth/login")
        return
      }

      // Get user profile
      const { data: userProfile } = await supabase.from("users").select("*").eq("id", authUser.id).single()

      if (userProfile) {
        setUser(userProfile)
      }
    }

    checkUser()
  }, [router])

  const handleCreateGroup = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      // Create group
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: groupName,
          description: groupDescription,
          zones: groupZones,
          created_by: user.id,
        })
        .select()
        .single()

      if (groupError) throw groupError

      // Add user as admin member
      const { error: memberError } = await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: user.id,
        role: "admin",
      })

      if (memberError) throw memberError

      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al crear el grupo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinGroup = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      // Find group by name or ID (simplified - in real app would use proper join codes)
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("*")
        .ilike("name", `%${joinCode}%`)
        .single()

      if (groupError) throw new Error("Grupo no encontrado")

      // Add user as member
      const { error: memberError } = await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: user.id,
        role: "member",
      })

      if (memberError) throw memberError

      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al unirse al grupo")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {step === "welcome" && (
          <>
            <CardHeader className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">¡Bienvenido a Tangle!</div>
              <CardTitle className="text-xl">Hola, {user.full_name}</CardTitle>
              <CardDescription>Para comenzar, necesitas crear un grupo o unirte a uno existente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setStep("create-group")} className="w-full" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Crear mi grupo
              </Button>
              <Button onClick={() => setStep("join-group")} variant="outline" className="w-full" size="lg">
                <Users className="w-5 h-5 mr-2" />
                Unirme a un grupo
              </Button>
            </CardContent>
          </>
        )}

        {step === "create-group" && (
          <>
            <CardHeader>
              <CardTitle>Crear tu grupo</CardTitle>
              <CardDescription>Define la identidad de tu grupo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Nombre del grupo</Label>
                <Input
                  id="groupName"
                  placeholder="Los Aventureros"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupZones">Zonas/Ubicación</Label>
                <Input
                  id="groupZones"
                  placeholder="Buenos Aires, Palermo"
                  value={groupZones}
                  onChange={(e) => setGroupZones(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupDescription">Descripción</Label>
                <Textarea
                  id="groupDescription"
                  placeholder="Describe a tu grupo..."
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("welcome")} className="flex-1">
                  Volver
                </Button>
                <Button onClick={handleCreateGroup} disabled={!groupName || isLoading} className="flex-1">
                  {isLoading ? "Creando..." : "Crear grupo"}
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === "join-group" && (
          <>
            <CardHeader>
              <CardTitle>Unirse a un grupo</CardTitle>
              <CardDescription>Busca el grupo al que quieres unirte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="joinCode">Nombre del grupo</Label>
                <Input
                  id="joinCode"
                  placeholder="Buscar por nombre..."
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("welcome")} className="flex-1">
                  Volver
                </Button>
                <Button onClick={handleJoinGroup} disabled={!joinCode || isLoading} className="flex-1">
                  {isLoading ? "Buscando..." : "Unirse"}
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
