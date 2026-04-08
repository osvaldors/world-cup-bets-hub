
-- Update handle_new_user function to automatically create participant and assign role
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
  INSERT INTO public.participants (name, avatar, cup_eliminated)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), 
    '', 
    false
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

-- Migrate existing users if they don't have a participant_id
DO $$
DECLARE
  profile_record RECORD;
  new_part_id UUID;
BEGIN
  FOR profile_record IN 
    SELECT id, user_id, email, display_name FROM public.profiles WHERE participant_id IS NULL
  LOOP
    -- Create participant
    INSERT INTO public.participants (name, avatar, cup_eliminated)
    VALUES (COALESCE(profile_record.display_name, split_part(profile_record.email, '@', 1)), '', false)
    RETURNING id INTO new_part_id;

    -- Update profile
    UPDATE public.profiles SET participant_id = new_part_id WHERE id = profile_record.id;

    -- Assign role if not exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (profile_record.user_id, 'participant')
    ON CONFLICT (user_id, role) DO NOTHING;
  END LOOP;
END;
$$;
