"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Users, Plus, ExternalLink, Edit, Eye, Lock } from "lucide-react"

interface Event {
  id: number
  title: string
  date: string
  time: string
  description: string
  location: string
  ticketLink?: string
  visibility: "open" | "request"
  status: "upcoming" | "past"
  attendees: number
  requests?: number
  createdAt: Date
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Senderismo en Bariloche",
    date: "2024-03-20",
    time: "08:00",
    description: "Caminata grupal por los senderos más hermosos de Bariloche. Incluye almuerzo y guía especializado.",
    location: "Cerro Catedral, Bariloche",
    ticketLink: "https://tickets.example.com/bariloche",
    visibility: "open",
    status: "upcoming",
    attendees: 15,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    title: "Camping Exclusivo en Córdoba",
    date: "2024-03-25",
    time: "18:00",
    description: "Experiencia de camping privada solo para grupos seleccionados. Actividades nocturnas especiales.",
    location: "Villa General Belgrano, Córdoba",
    visibility: "request",
    status: "upcoming",
    attendees: 8,
    requests: 12,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "Escalada en Mendoza",
    date: "2024-02-15",
    time: "09:00",
    description: "Jornada de escalada en roca para grupos experimentados. Equipamiento incluido.",
    location: "Aconcagua, Mendoza",
    visibility: "open",
    status: "past",
    attendees: 12,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    title: "Fogón Nocturno",
    date: "2024-02-10",
    time: "20:00",
    description: "Noche de historias y música alrededor del fuego. Solo grupos de confianza.",
    location: "Cabaña Privada, San Martín de los Andes",
    visibility: "request",
    status: "past",
    attendees: 6,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
]

interface CreateEventForm {
  title: string
  date: string
  time: string
  description: string
  location: string
  ticketLink: string
  visibility: "open" | "request"
}

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEventDetail, setShowEventDetail] = useState<Event | null>(null)
  const [createForm, setCreateForm] = useState<CreateEventForm>({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
    ticketLink: "",
    visibility: "open",
  })

  const upcomingEvents = events.filter((e) => e.status === "upcoming")
  const pastEvents = events.filter((e) => e.status === "past")

  const handleCreateEvent = () => {
    if (createForm.title && createForm.date && createForm.time && createForm.description) {
      const newEvent: Event = {
        id: Date.now(),
        ...createForm,
        status: new Date(createForm.date) > new Date() ? "upcoming" : "past",
        attendees: 0,
        requests: createForm.visibility === "request" ? 0 : undefined,
        createdAt: new Date(),
      }

      setEvents([newEvent, ...events])
      setCreateForm({
        title: "",
        date: "",
        time: "",
        description: "",
        location: "",
        ticketLink: "",
        visibility: "open",
      })
      setShowCreateDialog(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-lg text-balance">{event.title}</h3>
            {event.visibility === "request" ? (
              <Lock className="w-4 h-4 text-amber-500" />
            ) : (
              <Eye className="w-4 h-4 text-green-500" />
            )}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{event.time} hs</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>
                {event.attendees} asistentes
                {event.requests && ` • ${event.requests} solicitudes`}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            event.status === "upcoming" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          }`}
        >
          {event.status === "upcoming" ? "Próximo" : "Finalizado"}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 text-balance line-clamp-2">{event.description}</p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEventDetail(event)}
          className="flex items-center gap-1"
        >
          <Eye className="w-3 h-3" />
          Ver detalles
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
          <Edit className="w-3 h-3" />
          Editar
        </Button>
        {event.ticketLink && (
          <Button size="sm" className="flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            Entradas
          </Button>
        )}
      </div>
    </Card>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Tus Eventos</h1>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Crear evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Evento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título del evento</label>
                  <Input
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    placeholder="Ej: Senderismo en Bariloche"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Fecha</label>
                    <Input
                      type="date"
                      value={createForm.date}
                      onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Hora</label>
                    <Input
                      type="time"
                      value={createForm.time}
                      onChange={(e) => setCreateForm({ ...createForm, time: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <Textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="Describe tu evento..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Ubicación</label>
                  <Input
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                    placeholder="Ej: Cerro Catedral, Bariloche"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Link de entradas (opcional)</label>
                  <Input
                    value={createForm.ticketLink}
                    onChange={(e) => setCreateForm({ ...createForm, ticketLink: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Visibilidad</label>
                  <Select
                    value={createForm.visibility}
                    onValueChange={(value: "open" | "request") => setCreateForm({ ...createForm, visibility: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-green-500" />
                          <div>
                            <div className="font-medium">Abierto</div>
                            <div className="text-xs text-muted-foreground">
                              Cualquiera puede ver toda la información
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="request">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-500" />
                          <div>
                            <div className="font-medium">Con solicitud</div>
                            <div className="text-xs text-muted-foreground">Requiere aprobación para ver detalles</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleCreateEvent}
                    className="flex-1"
                    disabled={!createForm.title || !createForm.date || !createForm.time || !createForm.description}
                  >
                    Crear evento
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-20">
        {events.length > 0 ? (
          <div className="p-4 space-y-6">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Próximos eventos ({upcomingEvents.length})
                </h2>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Eventos pasados ({pastEvents.length})
                </h2>
                <div className="space-y-4">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full pb-20 px-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No has creado eventos aún</h3>
              <p className="text-sm text-muted-foreground mb-6 text-balance">
                Organiza experiencias increíbles para tu grupo y conecta con otros grupos afines
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Crear tu primer evento
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Event Detail Dialog */}
      {showEventDetail && (
        <Dialog open={!!showEventDetail} onOpenChange={() => setShowEventDetail(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {showEventDetail.title}
                {showEventDetail.visibility === "request" ? (
                  <Lock className="w-4 h-4 text-amber-500" />
                ) : (
                  <Eye className="w-4 h-4 text-green-500" />
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {formatDate(showEventDetail.date)} • {showEventDetail.time} hs
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(showEventDetail.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {showEventDetail.location}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {showEventDetail.attendees} asistentes confirmados
                    {showEventDetail.requests && ` • ${showEventDetail.requests} solicitudes pendientes`}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Descripción</h4>
                <p className="text-sm text-muted-foreground text-balance">{showEventDetail.description}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Editar evento
                </Button>
                {showEventDetail.ticketLink && (
                  <Button className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Ver entradas
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
