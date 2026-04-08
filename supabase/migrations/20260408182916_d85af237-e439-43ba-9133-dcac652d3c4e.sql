
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'participant');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Trigger function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles RLS: users can read all profiles, update only their own
CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- User roles RLS: only admins can manage roles, users can read their own
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Now update existing tables RLS to be role-based
-- BETS: everyone can read, only the linked participant's user can insert/update their own bets
DROP POLICY IF EXISTS "Public all bets" ON public.bets;
DROP POLICY IF EXISTS "Public read bets" ON public.bets;

CREATE POLICY "Anyone can read bets"
  ON public.bets FOR SELECT USING (true);

CREATE POLICY "Admins can manage all bets"
  ON public.bets FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Participants can manage own bets"
  ON public.bets FOR ALL
  USING (
    participant_id IN (
      SELECT p.id FROM public.participants p
      JOIN public.profiles pr ON LOWER(pr.email) = LOWER(p.name)
      WHERE pr.user_id = auth.uid()
    )
  )
  WITH CHECK (
    participant_id IN (
      SELECT p.id FROM public.participants p
      JOIN public.profiles pr ON LOWER(pr.email) = LOWER(p.name)
      WHERE pr.user_id = auth.uid()
    )
  );

-- MATCHES: everyone reads, only admin writes
DROP POLICY IF EXISTS "Public all matches" ON public.matches;
DROP POLICY IF EXISTS "Public read matches" ON public.matches;

CREATE POLICY "Anyone can read matches"
  ON public.matches FOR SELECT USING (true);

CREATE POLICY "Admins can manage matches"
  ON public.matches FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- TEAMS: everyone reads, only admin writes
DROP POLICY IF EXISTS "Public all teams" ON public.teams;
DROP POLICY IF EXISTS "Public read teams" ON public.teams;

CREATE POLICY "Anyone can read teams"
  ON public.teams FOR SELECT USING (true);

CREATE POLICY "Admins can manage teams"
  ON public.teams FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PARTICIPANTS: everyone reads, only admin writes
DROP POLICY IF EXISTS "Public all participants" ON public.participants;
DROP POLICY IF EXISTS "Public read participants" ON public.participants;

CREATE POLICY "Anyone can read participants"
  ON public.participants FOR SELECT USING (true);

CREATE POLICY "Admins can manage participants"
  ON public.participants FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SPECIAL_BETS: everyone reads, participants manage own, admin manages all
DROP POLICY IF EXISTS "Public all special_bets" ON public.special_bets;
DROP POLICY IF EXISTS "Public read special_bets" ON public.special_bets;

CREATE POLICY "Anyone can read special_bets"
  ON public.special_bets FOR SELECT USING (true);

CREATE POLICY "Admins can manage all special_bets"
  ON public.special_bets FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Participants can manage own special_bets"
  ON public.special_bets FOR ALL
  USING (
    participant_id IN (
      SELECT p.id FROM public.participants p
      JOIN public.profiles pr ON LOWER(pr.email) = LOWER(p.name)
      WHERE pr.user_id = auth.uid()
    )
  )
  WITH CHECK (
    participant_id IN (
      SELECT p.id FROM public.participants p
      JOIN public.profiles pr ON LOWER(pr.email) = LOWER(p.name)
      WHERE pr.user_id = auth.uid()
    )
  );

-- SPECIAL_RESULTS: everyone reads, only admin writes
DROP POLICY IF EXISTS "Public all special_results" ON public.special_results;
DROP POLICY IF EXISTS "Public read special_results" ON public.special_results;

CREATE POLICY "Anyone can read special_results"
  ON public.special_results FOR SELECT USING (true);

CREATE POLICY "Admins can manage special_results"
  ON public.special_results FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- CUP_BRACKET_MATCHES: everyone reads, only admin writes
DROP POLICY IF EXISTS "Public all cup_bracket" ON public.cup_bracket_matches;
DROP POLICY IF EXISTS "Public read cup_bracket" ON public.cup_bracket_matches;

CREATE POLICY "Anyone can read cup_bracket"
  ON public.cup_bracket_matches FOR SELECT USING (true);

CREATE POLICY "Admins can manage cup_bracket"
  ON public.cup_bracket_matches FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add participant_id column to profiles for direct linking
ALTER TABLE public.profiles ADD COLUMN participant_id UUID REFERENCES public.participants(id);
