"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Users, UserPlus, Calendar, Star, Check, X } from "lucide-react"

interface Activity {
  id: number
  type: "like" | "comment" | "connection_request" | "new_follower" | "new_community" | "new_event"
  fromGroup: string
  fromGroupAvatar: string
  content: string
  timestamp: Date
  postImage?: string
  isRead: boolean
  isPending?: boolean
}

const mockActivities: Activity[] = [
  {
    id: 1,
    type: "like",
    fromGroup: "Foodies Unidos",
    fromGroupAvatar: "/placeholder.svg?key=foodies",
    content: "le gustó tu publicación sobre el senderismo en Bariloche",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    postImage: "/placeholder.svg?key=post1",
    isRead: false,
  },
  {
    id: 2,
    type: "comment",
    fromGroup: "Aventureros del Sur",
    fromGroupAvatar: "/placeholder.svg?key=aventureros",
    content: 'comentó: "¡Qué vista increíble! Nosotros también queremos ir"',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    postImage: "/placeholder.svg?key=post2",
    isRead: false,
  },
  {
    id: 3,
    type: "connection_request",
    fromGroup: "Escaladores Extremos",
    fromGroupAvatar: "/placeholder.svg?key=escaladores",
    content: "quiere conectar con tu grupo",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: false,
    isPending: true,
  },
  {
    id: 4,
    type: "new_follower",
    fromGroup: "Runners Nocturnos",
    fromGroupAvatar: "/placeholder.svg?key=runners",
    content: "comenzó a seguir a tu grupo",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
  },
  {
    id: 5,
    type: "new_community",
    fromGroup: "Fotógrafos Urbanos",
    fromGroupAvatar: "/placeholder.svg?key=fotografos",
    content: "creó la comunidad 'Capturando la Ciudad'",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
  },
  {
    id: 6,
    type: "new_event",
    fromGroup: "Músicos Callejeros",
    fromGroupAvatar: "/placeholder.svg?key=musicos",
    content: "publicó el evento 'Jam Session en el Parque'",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
  },
  {
    id: 7,
    type: "like",
    fromGroup: "Chefs Caseros",
    fromGroupAvatar: "/placeholder.svg?key=chefs",
    content: "le gustó tu publicación sobre la cena grupal",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    postImage: "/placeholder.svg?key=post3",
    isRead: true,
  },
  {
    id: 8,
    type: "connection_request",
    fromGroup: "Viajeros Mochileros",
    fromGroupAvatar: "/placeholder.svg?key=viajeros",
    content: "quiere conectar con tu grupo",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    isRead: true,
    isPending: false,
  },
]

export function ActivitySection() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities)

  const handleConnectionRequest = (activityId: number, action: "accept" | "reject") => {
    setActivities((prev) =>
      prev.map((activity) => (activity.id === activityId ? { ...activity, isPending: false, isRead: true } : activity)),
    )
  }

  const markAsRead = (activityId: number) => {
    setActivities((prev) =>
      prev.map((activity) => (activity.id === activityId ? { ...activity, isRead: true } : activity)),
    )
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500" />
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case "connection_request":
        return <Users className="w-5 h-5 text-primary" />
      case "new_follower":
        return <UserPlus className="w-5 h-5 text-green-500" />
      case "new_community":
        return <Star className="w-5 h-5 text-accent" />
      case "new_event":
        return <Calendar className="w-5 h-5 text-orange-500" />
      default:
        return <Users className="w-5 h-5 text-muted-foreground" />
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return "hace unos minutos"
    if (hours < 24) return `hace ${hours}h`
    if (days === 1) return "ayer"
    if (days < 7) return `hace ${days} días`
    return `hace ${Math.floor(days / 7)} semana${Math.floor(days / 7) > 1 ? "s" : ""}`
  }

  const groupActivitiesByTime = (activities: Activity[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const groups = {
      today: activities.filter((a) => a.timestamp >= today),
      thisWeek: activities.filter((a) => a.timestamp >= weekAgo && a.timestamp < today),
      older: activities.filter((a) => a.timestamp < weekAgo),
    }

    return groups
  }

  const groupedActivities = groupActivitiesByTime(activities)
  const unreadCount = activities.filter((a) => !a.isRead).length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Actividad</h1>
          {unreadCount > 0 && (
            <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {unreadCount} nuevas
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-20">
        {activities.length > 0 ? (
          <div className="p-4 space-y-6">
            {/* Today */}
            {groupedActivities.today.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-foreground">Hoy</h2>
                <div className="space-y-3">
                  {groupedActivities.today.map((activity) => (
                    <Card
                      key={activity.id}
                      className={`p-4 transition-colors ${!activity.isRead ? "bg-primary/5 border-primary/20" : ""}`}
                      onClick={() => !activity.isRead && markAsRead(activity.id)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Group Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 flex-shrink-0">
                          <img
                            src={activity.fromGroupAvatar || "/placeholder.svg"}
                            alt={activity.fromGroup}
                            className="w-full h-full rounded-full object-cover bg-background"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-semibold">{activity.fromGroup}</span>{" "}
                                <span className="text-muted-foreground">{activity.content}</span>
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {getActivityIcon(activity.type)}
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(activity.timestamp)}
                                </span>
                                {!activity.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                              </div>
                            </div>

                            {/* Post Image */}
                            {activity.postImage && (
                              <img
                                src={activity.postImage || "/placeholder.svg"}
                                alt="Post"
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                          </div>

                          {/* Connection Request Actions */}
                          {activity.type === "connection_request" && activity.isPending && (
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleConnectionRequest(activity.id, "accept")
                                }}
                                className="flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Aceptar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleConnectionRequest(activity.id, "reject")
                                }}
                                className="flex items-center gap-1"
                              >
                                <X className="w-3 h-3" />
                                Rechazar
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* This Week */}
            {groupedActivities.thisWeek.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-foreground">Esta semana</h2>
                <div className="space-y-3">
                  {groupedActivities.thisWeek.map((activity) => (
                    <Card key={activity.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 flex-shrink-0">
                          <img
                            src={activity.fromGroupAvatar || "/placeholder.svg"}
                            alt={activity.fromGroup}
                            className="w-full h-full rounded-full object-cover bg-background"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-semibold">{activity.fromGroup}</span>{" "}
                                <span className="text-muted-foreground">{activity.content}</span>
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {getActivityIcon(activity.type)}
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(activity.timestamp)}
                                </span>
                              </div>
                            </div>
                            {activity.postImage && (
                              <img
                                src={activity.postImage || "/placeholder.svg"}
                                alt="Post"
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Older */}
            {groupedActivities.older.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-foreground">Más antiguo</h2>
                <div className="space-y-3">
                  {groupedActivities.older.map((activity) => (
                    <Card key={activity.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 flex-shrink-0">
                          <img
                            src={activity.fromGroupAvatar || "/placeholder.svg"}
                            alt={activity.fromGroup}
                            className="w-full h-full rounded-full object-cover bg-background"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-semibold">{activity.fromGroup}</span>{" "}
                                <span className="text-muted-foreground">{activity.content}</span>
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {getActivityIcon(activity.type)}
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(activity.timestamp)}
                                </span>
                              </div>
                            </div>
                            {activity.postImage && (
                              <img
                                src={activity.postImage || "/placeholder.svg"}
                                alt="Post"
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full pb-20 px-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Star className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No hay actividad reciente</h3>
              <p className="text-sm text-muted-foreground text-balance">
                Cuando otros grupos interactúen con tu contenido, verás las notificaciones aquí
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
