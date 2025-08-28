-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_followers ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Groups policies (members can view, admins can update)
CREATE POLICY "groups_select_members" ON public.groups FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.group_members WHERE group_id = groups.id AND user_id = auth.uid()));

CREATE POLICY "groups_insert_authenticated" ON public.groups FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "groups_update_admin" ON public.groups FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.group_members WHERE group_id = groups.id AND user_id = auth.uid() AND role = 'admin'));

-- Group members policies
CREATE POLICY "group_members_select_members" ON public.group_members FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid()));

CREATE POLICY "group_members_insert_admin" ON public.group_members FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.group_members WHERE group_id = group_members.group_id AND user_id = auth.uid() AND role = 'admin'));

-- Posts policies (group members can view and create)
CREATE POLICY "posts_select_members" ON public.posts FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.group_members WHERE group_id = posts.group_id AND user_id = auth.uid()));

CREATE POLICY "posts_insert_members" ON public.posts FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.group_members WHERE group_id = posts.group_id AND user_id = auth.uid()));

-- Stories policies (similar to posts)
CREATE POLICY "stories_select_members" ON public.stories FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.group_members WHERE group_id = stories.group_id AND user_id = auth.uid()));

CREATE POLICY "stories_insert_members" ON public.stories FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.group_members WHERE group_id = stories.group_id AND user_id = auth.uid()));

-- Events policies
CREATE POLICY "events_select_all" ON public.events FOR SELECT USING (true); -- Events are discoverable
CREATE POLICY "events_insert_members" ON public.events FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.group_members WHERE group_id = events.group_id AND user_id = auth.uid()));

-- Likes policies
CREATE POLICY "likes_select_all" ON public.likes FOR SELECT USING (true);
CREATE POLICY "likes_insert_members" ON public.likes FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.group_members WHERE group_id = likes.group_id AND user_id = auth.uid()));

-- Comments policies
CREATE POLICY "comments_select_all" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_members" ON public.comments FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.group_members WHERE group_id = comments.group_id AND user_id = auth.uid()));

-- Messages policies (only involved groups can see)
CREATE POLICY "messages_select_involved" ON public.messages FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM public.group_members WHERE group_id = messages.sender_group_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.group_members WHERE group_id = messages.recipient_group_id AND user_id = auth.uid()) OR
    (messages.community_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.community_members cm 
      JOIN public.group_members gm ON cm.group_id = gm.group_id 
      WHERE cm.community_id = messages.community_id AND gm.user_id = auth.uid()
    ))
  );

-- Notes policies
CREATE POLICY "notes_select_all" ON public.notes FOR SELECT USING (expires_at > NOW());
CREATE POLICY "notes_insert_members" ON public.notes FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.group_members WHERE group_id = notes.group_id AND user_id = auth.uid()));

-- Notifications policies
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.group_members WHERE group_id = notifications.recipient_group_id AND user_id = auth.uid()));
