"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, X } from "lucide-react"
import { toast } from "sonner"

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "post" | "story" | "event"
  groupId: string
  onSuccess?: () => void
}

export function UploadDialog({ open, onOpenChange, type, groupId, onSuccess }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [location, setLocation] = useState("")
  const [locationLink, setLocationLink] = useState("")
  const [ticketLink, setTicketLink] = useState("")
  const [visibility, setVisibility] = useState("open")
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = null
      if (file) {
        imageUrl = await uploadFile(file)
      }

      let endpoint = ""
      let payload = {}

      switch (type) {
        case "post":
          endpoint = "/api/posts"
          payload = { content, image_url: imageUrl, group_id: groupId }
          break
        case "story":
          endpoint = "/api/stories"
          if (!imageUrl) {
            throw new Error("Image is required for stories")
          }
          payload = { image_url: imageUrl, group_id: groupId }
          break
        case "event":
          endpoint = "/api/events"
          payload = {
            title,
            description,
            event_date: eventDate,
            location,
            location_link: locationLink,
            ticket_link: ticketLink,
            flyer_url: imageUrl,
            visibility,
            group_id: groupId,
          }
          break
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to create content")
      }

      toast.success(`${type === "post" ? "Publicación" : type === "story" ? "Historia" : "Evento"} creado exitosamente`)
      onOpenChange(false)
      onSuccess?.()

      // Reset form
      setFile(null)
      setContent("")
      setTitle("")
      setDescription("")
      setEventDate("")
      setLocation("")
      setLocationLink("")
      setTicketLink("")
      setVisibility("open")
      setPreviewUrl(null)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Error al crear el contenido")
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreviewUrl(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {type === "post" && "Crear Publicación"}
            {type === "story" && "Subir Historia"}
            {type === "event" && "Crear Evento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>{type === "story" ? "Imagen (requerida)" : "Imagen"}</Label>
            {!file ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Haz clic para subir una imagen</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl! || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Post Content */}
          {type === "post" && (
            <div className="space-y-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="¿Qué está pasando?"
                rows={3}
              />
            </div>
          )}

          {/* Event Fields */}
          {type === "event" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-date">Fecha y Hora *</Label>
                <Input
                  id="event-date"
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Dirección del evento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location-link">Link de Google Maps</Label>
                <Input
                  id="location-link"
                  value={locationLink}
                  onChange={(e) => setLocationLink(e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket-link">Link de Tickets</Label>
                <Input
                  id="ticket-link"
                  value={ticketLink}
                  onChange={(e) => setTicketLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility">Visibilidad</Label>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Abierto (todos pueden ver)</SelectItem>
                    <SelectItem value="request">Con solicitud (info sensible oculta)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={uploading || (type === "story" && !file) || (type === "event" && (!title || !eventDate))}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                "Publicar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
