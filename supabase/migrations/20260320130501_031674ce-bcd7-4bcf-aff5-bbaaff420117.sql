
-- Table for special bets (champion + top scorer predictions per participant)
CREATE TABLE public.special_bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  champion_team_id text REFERENCES public.teams(id),
  top_scorer_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(participant_id)
);

ALTER TABLE public.special_bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public all special_bets" ON public.special_bets FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public read special_bets" ON public.special_bets FOR SELECT TO public USING (true);

-- Table for actual results (single row: who won the cup, who's top scorer)
CREATE TABLE public.special_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  champion_team_id text REFERENCES public.teams(id),
  top_scorer_name text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.special_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public all special_results" ON public.special_results FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public read special_results" ON public.special_results FOR SELECT TO public USING (true);
