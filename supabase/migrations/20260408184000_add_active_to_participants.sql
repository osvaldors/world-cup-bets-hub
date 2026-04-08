
-- Add active column to participants table
ALTER TABLE public.participants ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;

-- Update the handle_new_user trigger to include active: true (though it's default)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_participant_id UUID;
BEGIN
  -- 1. Create participant record
  INSERT INTO public.participants (name, avatar, cup_eliminated, active)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), 
    '', 
    false,
    true
  )
  RETURNING id INTO new_participant_id;

  -- 2. Create profile record linked to participant
  INSERT INTO public.profiles (user_id, email, display_name, participant_id)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), 
    new_participant_id
  );

  -- 3. Assign 'participant' role to the new user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'participant');

  RETURN NEW;
END;
$$;
