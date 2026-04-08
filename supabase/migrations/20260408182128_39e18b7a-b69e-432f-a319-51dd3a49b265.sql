
-- Update UEFA Path D → Czechia (Group A)
UPDATE public.teams SET name = 'Tchéquia', flag = '🇨🇿' WHERE id = 'ue_d';

-- Update UEFA Path A → Bosnia and Herzegovina (Group B)
UPDATE public.teams SET name = 'Bósnia e Herzegovina', flag = '🇧🇦' WHERE id = 'ue_a';

-- Update UEFA Path C → Turkiye (Group D)
UPDATE public.teams SET name = 'Turquia', flag = '🇹🇷' WHERE id = 'ue_c';

-- Update UEFA Path B → Sweden (Group F)
UPDATE public.teams SET name = 'Suécia', flag = '🇸🇪' WHERE id = 'ue_b';

-- Update IC Path 2 → Iraq (Group I)
UPDATE public.teams SET name = 'Iraque', flag = '🇮🇶' WHERE id = 'ic_2';

-- Update IC Path 1 → DR Congo (Group K)
UPDATE public.teams SET name = 'RD Congo', flag = '🇨🇩' WHERE id = 'ic_1';
