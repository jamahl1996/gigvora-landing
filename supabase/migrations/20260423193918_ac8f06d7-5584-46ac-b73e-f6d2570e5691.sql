CREATE OR REPLACE FUNCTION public.audit_logs_hash_chain()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_prev text;
BEGIN
  SELECT row_hash INTO v_prev
  FROM public.audit_logs
  ORDER BY created_at DESC, id DESC
  LIMIT 1;

  NEW.prev_hash := v_prev;
  NEW.row_hash := encode(
    extensions.digest(
      coalesce(v_prev,'') ||
      NEW.id::text ||
      coalesce(NEW.actor_id::text,'') ||
      NEW.action ||
      coalesce(NEW.target_table,'') ||
      coalesce(NEW.target_id,'') ||
      coalesce(NEW.before_data::text,'') ||
      coalesce(NEW.after_data::text,'') ||
      NEW.created_at::text,
      'sha256'::text
    ),
    'hex'
  );
  RETURN NEW;
END;
$$;