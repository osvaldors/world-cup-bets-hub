
-- MASTER RECOVERY SQL
-- Run this in Supabase SQL Editor to fix missing profiles, participants and roles for all users.

DO $$
DECLARE
    user_record RECORD;
    new_part_id UUID;
    existing_part_id UUID;
BEGIN
    -- Iterate through all users in auth.users
    FOR user_record IN SELECT id, email, raw_user_meta_data FROM auth.users LOOP
        
        -- 1. Ensure profile exists
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = user_record.id) THEN
            INSERT INTO public.profiles (user_id, email, display_name)
            VALUES (user_record.id, user_record.email, COALESCE(user_record.raw_user_meta_data->>'display_name', split_part(user_record.email, '@', 1)));
        END IF;

        -- 2. Ensure participant exists (linked by name/email if not by ID yet)
        SELECT participant_id INTO existing_part_id FROM public.profiles WHERE user_id = user_record.id;
        
        IF existing_part_id IS NULL THEN
            -- Try to find by name matching email
            SELECT id INTO existing_part_id FROM public.participants WHERE LOWER(name) = LOWER(split_part(user_record.email, '@', 1)) LIMIT 1;
            
            IF existing_part_id IS NULL THEN
                -- Create new participant
                INSERT INTO public.participants (name, avatar, active)
                VALUES (COALESCE(user_record.raw_user_meta_data->>'display_name', split_part(user_record.email, '@', 1)), '', true)
                RETURNING id INTO new_part_id;
                existing_part_id := new_part_id;
            END IF;
            
            -- Update profile with the participant_id
            UPDATE public.profiles SET participant_id = existing_part_id WHERE user_id = user_record.id;
        END IF;

        -- 3. Ensure they have the 'participant' role
        IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_record.id AND role = 'participant') THEN
            INSERT INTO public.user_roles (user_id, role) VALUES (user_record.id, 'participant');
        END IF;
        
        -- Special: assign 'admin' to osvaldopix@gmail.com if it's the main user
        IF user_record.email = 'osvaldopix@gmail.com' AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_record.id AND role = 'admin') THEN
            INSERT INTO public.user_roles (user_id, role) VALUES (user_record.id, 'admin');
        END IF;

    END LOOP;
END $$;
