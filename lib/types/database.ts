export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Group {
  id: string
  name: string
  description?: string
  avatar_url?: string
  cover_url?: string
  zones?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: "admin" | "member"
  joined_at: string
}

export interface Post {
  id: string
  group_id: string
  content: string
  image_url?: string
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
}

export interface Story {
  id: string
  group_id: string
  image_url: string
  expires_at: string
  created_at: string
}

export interface Event {
  id: string
  group_id: string
  title: string
  description?: string
  flyer_url?: string
  event_date: string
  location?: string
  location_link?: string
  ticket_link?: string
  visibility: "open" | "request"
  created_at: string
  updated_at: string
}

export interface Community {
  id: string
  name: string
  description?: string
  avatar_url?: string
  created_by: string
  created_at: string
}

export interface Message {
  id: string
  sender_group_id: string
  recipient_group_id?: string
  community_id?: string
  content: string
  created_at: string
}

export interface Note {
  id: string
  group_id: string
  content: string
  expires_at: string
  created_at: string
}

export interface Notification {
  id: string
  recipient_group_id: string
  sender_group_id?: string
  type: "like" | "comment" | "connection_request" | "follow" | "community_created" | "event_published"
  content: string
  post_id?: string
  event_id?: string
  community_id?: string
  read: boolean
  created_at: string
}
