DROP POLICY IF EXISTS "Authenticated insert notification (server-side)" ON public.notifications;

CREATE POLICY "User inserts own notification"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());