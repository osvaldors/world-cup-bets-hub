
INSERT INTO public.teams (id, name, flag, "group") VALUES
('mex', 'México', '🇲🇽', 'A'),('rsa', 'África do Sul', '🇿🇦', 'A'),('kor', 'Coreia do Sul', '🇰🇷', 'A'),('ue_d', 'UEFA Path D', '🏳️', 'A'),
('can', 'Canadá', '🇨🇦', 'B'),('ue_a', 'UEFA Path A', '🏳️', 'B'),('qat', 'Catar', '🇶🇦', 'B'),('sui', 'Suíça', '🇨🇭', 'B'),
('bra', 'Brasil', '🇧🇷', 'C'),('mar', 'Marrocos', '🇲🇦', 'C'),('hai', 'Haiti', '🇭🇹', 'C'),('sco', 'Escócia', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'C'),
('usa', 'EUA', '🇺🇸', 'D'),('par', 'Paraguai', '🇵🇾', 'D'),('aus', 'Austrália', '🇦🇺', 'D'),('ue_c', 'UEFA Path C', '🏳️', 'D'),
('ger', 'Alemanha', '🇩🇪', 'E'),('cur', 'Curaçao', '🇨🇼', 'E'),('civ', 'Costa do Marfim', '🇨🇮', 'E'),('ecu', 'Equador', '🇪🇨', 'E'),
('ned', 'Holanda', '🇳🇱', 'F'),('jpn', 'Japão', '🇯🇵', 'F'),('ue_b', 'UEFA Path B', '🏳️', 'F'),('tun', 'Tunísia', '🇹🇳', 'F'),
('bel', 'Bélgica', '🇧🇪', 'G'),('egy', 'Egito', '🇪🇬', 'G'),('irn', 'Irã', '🇮🇷', 'G'),('nzl', 'Nova Zelândia', '🇳🇿', 'G'),
('esp', 'Espanha', '🇪🇸', 'H'),('cpv', 'Cabo Verde', '🇨🇻', 'H'),('ksa', 'Arábia Saudita', '🇸🇦', 'H'),('uru', 'Uruguai', '🇺🇾', 'H'),
('fra', 'França', '🇫🇷', 'I'),('sen', 'Senegal', '🇸🇳', 'I'),('ic_2', 'IC Path 2', '🏳️', 'I'),('nor', 'Noruega', '🇳🇴', 'I'),
('arg', 'Argentina', '🇦🇷', 'J'),('alg', 'Argélia', '🇩🇿', 'J'),('aut', 'Áustria', '🇦🇹', 'J'),('jor', 'Jordânia', '🇯🇴', 'J'),
('por', 'Portugal', '🇵🇹', 'K'),('ic_1', 'IC Path 1', '🏳️', 'K'),('uzb', 'Uzbequistão', '🇺🇿', 'K'),('col', 'Colômbia', '🇨🇴', 'K'),
('eng', 'Inglaterra', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'L'),('cro', 'Croácia', '🇭🇷', 'L'),('gha', 'Gana', '🇬🇭', 'L'),('pan', 'Panamá', '🇵🇦', 'L')
ON CONFLICT (id) DO NOTHING;
