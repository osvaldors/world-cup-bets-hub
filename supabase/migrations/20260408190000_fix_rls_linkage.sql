
-- Fix RLS linkage for bets and special_bets to use participant_id link in profiles instead of name matching
-- This prevents issues when names are changed.

-- Update bets policies
DROP POLICY IF EXISTS "Participants can manage own bets" ON public.bets;

CREATE POLICY "Participants can manage own bets"
  ON public.bets FOR ALL
  USING (
    participant_id IN (
      SELECT participant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    participant_id IN (
      SELECT participant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- Update special_bets policies
DROP POLICY IF EXISTS "Participants can manage own special_bets" ON public.special_bets;

CREATE POLICY "Participants can manage own special_bets"
  ON public.special_bets FOR ALL
  USING (
    participant_id IN (
      SELECT participant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    participant_id IN (
      SELECT participant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- Ensure profiles can be updated by the owner (it already is, but just in case)
-- Also ensure participants can be read by everyone
