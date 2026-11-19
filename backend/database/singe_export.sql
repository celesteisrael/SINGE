-- ==========================================
-- SINGE DATABASE EXPORT (SQL)
-- Data: 2026-11-19 11:51:36
-- Total de tabelas: 35
-- ==========================================

-- ------------------------------------------
-- Estrutura da tabela: migrations
-- ------------------------------------------
CREATE TABLE "migrations" ("id" integer primary key autoincrement not null, "migration" varchar not null, "batch" integer not null);

-- Dados da tabela migrations (41 registos):
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('1', '0001_01_01_000000_create_users_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('2', '0001_01_01_000001_create_cache_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('3', '0001_01_01_000002_create_jobs_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('4', '2026_10_21_154304_create_personal_access_tokens_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('5', '2026_10_21_154803_create_perfils_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('6', '2026_10_21_154810_create_prioridades_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('7', '2026_10_21_154817_create_tipo_ocorrencias_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('8', '2026_10_21_154823_create_tipo_equipas_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('9', '2026_10_21_155738_create_equipas_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('10', '2026_10_21_160024_add_perfil_and_equipa_to_users_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('11', '2026_10_21_160408_create_ocorrencias_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('12', '2026_10_21_160814_create_missaos_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('13', '2026_10_21_160815_create_historico_ocorrencias_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('14', '2026_10_31_144012_create_evidencias_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('15', '2026_10_31_144333_create_fator_prioridades_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('16', '2026_10_31_144701_create_avaliacao_prioridades_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('17', '2026_10_31_144827_create_detalhe_avaliacaos_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('18', '2026_10_31_145933_add_coordenador_id_to_missoes_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('19', '2026_11_06_120001_create_provincias_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('20', '2026_11_06_120005_create_distritos_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('21', '2026_11_06_120010_create_municipios_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('22', '2026_11_06_120015_create_postos_administrativos_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('23', '2026_11_06_120020_create_bairros_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('24', '2026_11_06_120025_create_quarteiroes_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('25', '2026_11_06_120030_create_localizacoes_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('26', '2026_11_06_120035_create_documentos_identificacao_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('27', '2026_11_06_120040_create_verificacoes_identidade_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('28', '2026_11_06_120045_create_validacoes_ocorrencia_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('29', '2026_11_06_120050_add_localizacao_to_users_and_ocorrencias_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('30', '2026_11_06_120055_create_notificacoes_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('31', '2026_11_06_120060_backfill_user_profile_and_location_fields', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('32', '2026_11_08_120100_add_peso_aplicado_to_detalhes_avaliacao_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('33', '2026_11_08_120110_add_utilizador_solicitante_to_verificacoes_identidade_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('34', '2026_11_09_120000_ensure_coordenador_id_on_missoes_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('35', '2026_11_11_121000_make_ocorrencias_prioridade_nullable', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('36', '2026_11_11_140000_add_operational_occurrence_metadata', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('37', '2026_11_11_140100_add_mission_objectives_and_history', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('38', '2026_11_11_140200_add_priority_evaluation_snapshots', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('39', '2026_11_11_140300_create_public_alerts', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('40', '2026_11_12_100000_add_account_active_status_to_users', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('41', '2026_11_13_090000_create_identity_verification_history_table', '1');

-- ------------------------------------------
-- Estrutura da tabela: cache
-- ------------------------------------------
CREATE TABLE "cache" ("key" varchar not null, "value" text not null, "expiration" integer not null, primary key ("key"));

-- ------------------------------------------
-- Estrutura da tabela: cache_locks
-- ------------------------------------------
CREATE TABLE "cache_locks" ("key" varchar not null, "owner" varchar not null, "expiration" integer not null, primary key ("key"));

-- ------------------------------------------
-- Estrutura da tabela: jobs
-- ------------------------------------------
CREATE TABLE "jobs" ("id" integer primary key autoincrement not null, "queue" varchar not null, "payload" text not null, "attempts" integer not null, "reserved_at" integer, "available_at" integer not null, "created_at" integer not null);

-- ------------------------------------------
-- Estrutura da tabela: job_batches
-- ------------------------------------------
CREATE TABLE "job_batches" ("id" varchar not null, "name" varchar not null, "total_jobs" integer not null, "pending_jobs" integer not null, "failed_jobs" integer not null, "failed_job_ids" text not null, "options" text, "cancelled_at" integer, "created_at" integer not null, "finished_at" integer, primary key ("id"));

-- ------------------------------------------
-- Estrutura da tabela: failed_jobs
-- ------------------------------------------
CREATE TABLE "failed_jobs" ("id" integer primary key autoincrement not null, "uuid" varchar not null, "connection" varchar not null, "queue" varchar not null, "payload" text not null, "exception" text not null, "failed_at" datetime not null default CURRENT_TIMESTAMP);

-- ------------------------------------------
-- Estrutura da tabela: personal_access_tokens
-- ------------------------------------------
CREATE TABLE "personal_access_tokens" ("id" integer primary key autoincrement not null, "tokenable_type" varchar not null, "tokenable_id" integer not null, "name" text not null, "token" varchar not null, "abilities" text, "last_used_at" datetime, "expires_at" datetime, "created_at" datetime, "updated_at" datetime);

-- Dados da tabela personal_access_tokens (4 registos):
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('1', 'App\Models\User', '3', 'singe-api', 'f24ce5d5a5149157cc717f03d692b165aa461242f66ed8f5afdae5c0e7428c73', '["*"]', NULL, NULL, '2026-11-19 11:39:15', '2026-11-19 11:39:15');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('2', 'App\Models\User', '3', 'singe-api', 'ca46b78f7717c8da25b053a0914f3e6927477fa86a2469d96ea389012d6f59a3', '["*"]', '2026-11-19 11:39:45', NULL, '2026-11-19 11:39:44', '2026-11-19 11:39:45');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('3', 'App\Models\User', '1', 'singe-api', 'c64b59015f48f399f5e5735ae093126690dd2e521212178e601bc060bbc03bdd', '["*"]', '2026-11-19 11:42:22', NULL, '2026-11-19 11:42:21', '2026-11-19 11:42:22');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('4', 'App\Models\User', '3', 'singe-api', 'ce766f960eedb3f848f8500f678cca59ab1ef0d51495e8e57a3f1dda503bb61a', '["*"]', '2026-11-19 11:44:06', NULL, '2026-11-19 11:43:40', '2026-11-19 11:44:06');

-- ------------------------------------------
-- Estrutura da tabela: perfis
-- ------------------------------------------
CREATE TABLE "perfis" ("id" integer primary key autoincrement not null, "nome" varchar not null, "descricao" text, "created_at" datetime, "updated_at" datetime);

-- Dados da tabela perfis (5 registos):
INSERT INTO "perfis" ("id", "nome", "descricao", "created_at", "updated_at") VALUES ('1', 'Administrador', 'Gestão e configuração do sistema.', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "perfis" ("id", "nome", "descricao", "created_at", "updated_at") VALUES ('2', 'Operador', 'Registo e acompanhamento de ocorrências.', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "perfis" ("id", "nome", "descricao", "created_at", "updated_at") VALUES ('3', 'Coordenador', 'Coordenação das equipas e missões.', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "perfis" ("id", "nome", "descricao", "created_at", "updated_at") VALUES ('4', 'Agente', 'Participação nas operações de resposta.', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "perfis" ("id", "nome", "descricao", "created_at", "updated_at") VALUES ('5', 'Cidadão', 'Registo de ocorrências e submissão de evidências.', '2026-11-19 11:34:19', '2026-11-19 11:34:19');

-- ------------------------------------------
-- Estrutura da tabela: prioridades
-- ------------------------------------------
CREATE TABLE "prioridades" ("id" integer primary key autoincrement not null, "nome" varchar not null, "descricao" text, "nivel" integer not null, "created_at" datetime, "updated_at" datetime);

-- Dados da tabela prioridades (4 registos):
INSERT INTO "prioridades" ("id", "nome", "descricao", "nivel", "created_at", "updated_at") VALUES ('1', 'Crítica', 'Emergência com necessidade de resposta imediata.', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "prioridades" ("id", "nome", "descricao", "nivel", "created_at", "updated_at") VALUES ('2', 'Alta', 'Emergência que exige resposta prioritária.', '2', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "prioridades" ("id", "nome", "descricao", "nivel", "created_at", "updated_at") VALUES ('3', 'Média', 'Emergência que requer resposta programada.', '3', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "prioridades" ("id", "nome", "descricao", "nivel", "created_at", "updated_at") VALUES ('4', 'Baixa', 'Ocorrência sem necessidade de resposta urgente.', '4', '2026-11-19 11:34:19', '2026-11-19 11:34:19');

-- ------------------------------------------
-- Estrutura da tabela: tipos_ocorrencia
-- ------------------------------------------
CREATE TABLE "tipos_ocorrencia" ("id" integer primary key autoincrement not null, "nome" varchar not null, "descricao" text, "ativo" tinyint(1) not null default '1', "created_at" datetime, "updated_at" datetime);

-- Dados da tabela tipos_ocorrencia (6 registos):
INSERT INTO "tipos_ocorrencia" ("id", "nome", "descricao", "ativo", "created_at", "updated_at") VALUES ('1', 'Incêndio', 'Incêndios urbanos, florestais ou industriais.', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "tipos_ocorrencia" ("id", "nome", "descricao", "ativo", "created_at", "updated_at") VALUES ('2', 'Acidente rodoviário', 'Acidentes envolvendo veículos e pessoas.', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "tipos_ocorrencia" ("id", "nome", "descricao", "ativo", "created_at", "updated_at") VALUES ('3', 'Inundação', 'Inundações e situações de alagamento.', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "tipos_ocorrencia" ("id", "nome", "descricao", "ativo", "created_at", "updated_at") VALUES ('4', 'Emergência médica', 'Situações que exigem assistência médica urgente.', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "tipos_ocorrencia" ("id", "nome", "descricao", "ativo", "created_at", "updated_at") VALUES ('5', 'Deslizamento de terra', 'Deslizamentos e movimentos de terras.', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "tipos_ocorrencia" ("id", "nome", "descricao", "ativo", "created_at", "updated_at") VALUES ('6', 'Ciclone', 'Ciclones tropicais e fenómenos meteorológicos severos.', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');

-- ------------------------------------------
-- Estrutura da tabela: tipos_equipa
-- ------------------------------------------
CREATE TABLE "tipos_equipa" ("id" integer primary key autoincrement not null, "nome" varchar not null, "descricao" text, "ativo" tinyint(1) not null default '1', "created_at" datetime, "updated_at" datetime);

-- Dados da tabela tipos_equipa (5 registos):
INSERT INTO "tipos_equipa" ("id", "nome", "descricao", "ativo", "created_at", "updated_at") VALUES ('1', 'Bombeiros', 'Combate a incêndios e operações de salvamento.', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "tipos_equipa" ("id", "nome", "descricao", "ativo", "created_at", "updated_at") VALUES ('2', 'Saúde', 'Assistência médica e transporte de vítimas.', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "tipos_equipa" ("id", "nome", "descricao", "ativo", "created_at", "updated_at") VALUES ('3', 'Resgate', 'Operações de busca e salvamento.', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "tipos_equipa" ("id", "nome", "descricao", "ativo", "created_at", "updated_at") VALUES ('4', 'Polícia', 'Segurança e controlo das áreas de emergência.', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "tipos_equipa" ("id", "nome", "descricao", "ativo", "created_at", "updated_at") VALUES ('5', 'Proteção Civil', 'Coordenação e apoio em situações de emergência.', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');

-- ------------------------------------------
-- Estrutura da tabela: equipas
-- ------------------------------------------
CREATE TABLE "equipas" ("id" integer primary key autoincrement not null, "nome" varchar not null, "tipo_equipa_id" integer not null, "estado" varchar check ("estado" in ('disponivel', 'em_missao', 'indisponivel')) not null default 'disponivel', "descricao" text, "created_at" datetime, "updated_at" datetime, foreign key("tipo_equipa_id") references "tipos_equipa"("id") on delete restrict);

-- Dados da tabela equipas (3 registos):
INSERT INTO "equipas" ("id", "nome", "tipo_equipa_id", "estado", "descricao", "created_at", "updated_at") VALUES ('1', 'Equipa Resgate Maputo', '3', 'em_missao', 'Equipa institucional para cenários de demonstração.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "equipas" ("id", "nome", "tipo_equipa_id", "estado", "descricao", "created_at", "updated_at") VALUES ('2', 'Equipa Saúde Beira', '2', 'disponivel', 'Equipa institucional para cenários de demonstração.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "equipas" ("id", "nome", "tipo_equipa_id", "estado", "descricao", "created_at", "updated_at") VALUES ('3', 'Equipa Protecção Civil Nampula', '5', 'disponivel', 'Equipa institucional para cenários de demonstração.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');

-- ------------------------------------------
-- Estrutura da tabela: historico_ocorrencias
-- ------------------------------------------
CREATE TABLE "historico_ocorrencias" ("id" integer primary key autoincrement not null, "ocorrencia_id" integer not null, "utilizador_id" integer, "estado_anterior" varchar, "estado_novo" varchar not null, "observacoes" text, "created_at" datetime, "updated_at" datetime, foreign key("ocorrencia_id") references "ocorrencias"("id") on delete restrict, foreign key("utilizador_id") references "users"("id") on delete set null);

-- Dados da tabela historico_ocorrencias (6 registos):
INSERT INTO "historico_ocorrencias" ("id", "ocorrencia_id", "utilizador_id", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('1', '1', '5', NULL, 'registada', 'Estado inicial do registo de demonstração.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "historico_ocorrencias" ("id", "ocorrencia_id", "utilizador_id", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('2', '2', '3', NULL, 'em_avaliacao', 'Estado inicial do registo de demonstração.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "historico_ocorrencias" ("id", "ocorrencia_id", "utilizador_id", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('3', '3', '3', NULL, 'em_atendimento', 'Estado inicial do registo de demonstração.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "historico_ocorrencias" ("id", "ocorrencia_id", "utilizador_id", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('4', '4', '3', NULL, 'em_atendimento', 'Estado inicial do registo de demonstração.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "historico_ocorrencias" ("id", "ocorrencia_id", "utilizador_id", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('5', '5', '3', NULL, 'em_avaliacao', 'Estado inicial do registo de demonstração.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "historico_ocorrencias" ("id", "ocorrencia_id", "utilizador_id", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('6', '6', '3', NULL, 'resolvida', 'Estado inicial do registo de demonstração.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');

-- ------------------------------------------
-- Estrutura da tabela: evidencias
-- ------------------------------------------
CREATE TABLE "evidencias" ("id" integer primary key autoincrement not null, "ocorrencia_id" integer not null, "utilizador_id" integer not null, "nome_ficheiro" varchar not null, "caminho_ficheiro" varchar not null, "tipo_mime" varchar not null, "tamanho_bytes" integer not null, "descricao" text, "created_at" datetime, "updated_at" datetime, foreign key("ocorrencia_id") references "ocorrencias"("id") on delete restrict, foreign key("utilizador_id") references "users"("id") on delete restrict);

-- Dados da tabela evidencias (6 registos):
INSERT INTO "evidencias" ("id", "ocorrencia_id", "utilizador_id", "nome_ficheiro", "caminho_ficheiro", "tipo_mime", "tamanho_bytes", "descricao", "created_at", "updated_at") VALUES ('1', '1', '5', 'relatorio-demo-ocorrencia-1.pdf', 'evidencias/demo-occurrence-1.pdf', 'application/pdf', '616', 'Relatório PDF sintético, criado exclusivamente para demonstração do SINGE.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "evidencias" ("id", "ocorrencia_id", "utilizador_id", "nome_ficheiro", "caminho_ficheiro", "tipo_mime", "tamanho_bytes", "descricao", "created_at", "updated_at") VALUES ('2', '2', '3', 'relatorio-demo-ocorrencia-2.pdf', 'evidencias/demo-occurrence-2.pdf', 'application/pdf', '616', 'Relatório PDF sintético, criado exclusivamente para demonstração do SINGE.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "evidencias" ("id", "ocorrencia_id", "utilizador_id", "nome_ficheiro", "caminho_ficheiro", "tipo_mime", "tamanho_bytes", "descricao", "created_at", "updated_at") VALUES ('3', '3', '3', 'relatorio-demo-ocorrencia-3.pdf', 'evidencias/demo-occurrence-3.pdf', 'application/pdf', '616', 'Relatório PDF sintético, criado exclusivamente para demonstração do SINGE.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "evidencias" ("id", "ocorrencia_id", "utilizador_id", "nome_ficheiro", "caminho_ficheiro", "tipo_mime", "tamanho_bytes", "descricao", "created_at", "updated_at") VALUES ('4', '4', '3', 'relatorio-demo-ocorrencia-4.pdf', 'evidencias/demo-occurrence-4.pdf', 'application/pdf', '616', 'Relatório PDF sintético, criado exclusivamente para demonstração do SINGE.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "evidencias" ("id", "ocorrencia_id", "utilizador_id", "nome_ficheiro", "caminho_ficheiro", "tipo_mime", "tamanho_bytes", "descricao", "created_at", "updated_at") VALUES ('5', '5', '3', 'relatorio-demo-ocorrencia-5.pdf', 'evidencias/demo-occurrence-5.pdf', 'application/pdf', '616', 'Relatório PDF sintético, criado exclusivamente para demonstração do SINGE.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "evidencias" ("id", "ocorrencia_id", "utilizador_id", "nome_ficheiro", "caminho_ficheiro", "tipo_mime", "tamanho_bytes", "descricao", "created_at", "updated_at") VALUES ('6', '6', '3', 'relatorio-demo-ocorrencia-6.pdf', 'evidencias/demo-occurrence-6.pdf', 'application/pdf', '616', 'Relatório PDF sintético, criado exclusivamente para demonstração do SINGE.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');

-- ------------------------------------------
-- Estrutura da tabela: fatores_prioridade
-- ------------------------------------------
CREATE TABLE "fatores_prioridade" ("id" integer primary key autoincrement not null, "nome" varchar not null, "descricao" text, "peso" numeric not null, "ativo" tinyint(1) not null default '1', "created_at" datetime, "updated_at" datetime);

-- Dados da tabela fatores_prioridade (5 registos):
INSERT INTO "fatores_prioridade" ("id", "nome", "descricao", "peso", "ativo", "created_at", "updated_at") VALUES ('1', 'Gravidade', 'Severidade do evento e risco para a vida.', '0.3', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "fatores_prioridade" ("id", "nome", "descricao", "peso", "ativo", "created_at", "updated_at") VALUES ('2', 'Pessoas afectadas', 'Número estimado de pessoas em risco.', '0.25', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "fatores_prioridade" ("id", "nome", "descricao", "peso", "ativo", "created_at", "updated_at") VALUES ('3', 'Vulnerabilidade', 'Presença de pessoas vulneráveis e condições especiais.', '0.2', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "fatores_prioridade" ("id", "nome", "descricao", "peso", "ativo", "created_at", "updated_at") VALUES ('4', 'Localização', 'Acessibilidade e proximidade das equipas.', '0.15', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "fatores_prioridade" ("id", "nome", "descricao", "peso", "ativo", "created_at", "updated_at") VALUES ('5', 'Escassez de recursos', 'Disponibilidade dos recursos necessários para resposta.', '0.1', '1', '2026-11-19 11:34:19', '2026-11-19 11:34:19');

-- ------------------------------------------
-- Estrutura da tabela: avaliacoes_prioridade
-- ------------------------------------------
CREATE TABLE "avaliacoes_prioridade" ("id" integer primary key autoincrement not null, "ocorrencia_id" integer not null, "utilizador_id" integer not null, "prioridade_id" integer not null, "pontuacao_total" numeric not null, "justificacao" text, "created_at" datetime, "updated_at" datetime, foreign key("ocorrencia_id") references "ocorrencias"("id") on delete restrict, foreign key("utilizador_id") references "users"("id") on delete restrict, foreign key("prioridade_id") references "prioridades"("id") on delete restrict);

-- Dados da tabela avaliacoes_prioridade (5 registos):
INSERT INTO "avaliacoes_prioridade" ("id", "ocorrencia_id", "utilizador_id", "prioridade_id", "pontuacao_total", "justificacao", "created_at", "updated_at") VALUES ('1', '1', '2', '4', '1', 'Avaliação de demonstração baseada nos cinco factores oficiais.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "avaliacoes_prioridade" ("id", "ocorrencia_id", "utilizador_id", "prioridade_id", "pontuacao_total", "justificacao", "created_at", "updated_at") VALUES ('2', '2', '2', '3', '4', 'Avaliação de demonstração baseada nos cinco factores oficiais.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "avaliacoes_prioridade" ("id", "ocorrencia_id", "utilizador_id", "prioridade_id", "pontuacao_total", "justificacao", "created_at", "updated_at") VALUES ('3', '3', '2', '2', '6', 'Avaliação de demonstração baseada nos cinco factores oficiais.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "avaliacoes_prioridade" ("id", "ocorrencia_id", "utilizador_id", "prioridade_id", "pontuacao_total", "justificacao", "created_at", "updated_at") VALUES ('4', '4', '2', '1', '9', 'Avaliação de demonstração baseada nos cinco factores oficiais.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "avaliacoes_prioridade" ("id", "ocorrencia_id", "utilizador_id", "prioridade_id", "pontuacao_total", "justificacao", "created_at", "updated_at") VALUES ('5', '6', '2', '3', '4', 'Avaliação de demonstração baseada nos cinco factores oficiais.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');

-- ------------------------------------------
-- Estrutura da tabela: detalhes_avaliacao
-- ------------------------------------------
CREATE TABLE "detalhes_avaliacao" ("id" integer primary key autoincrement not null, "avaliacao_prioridade_id" integer not null, "fator_prioridade_id" integer not null, "pontuacao" numeric not null, "observacao" text, "created_at" datetime, "updated_at" datetime, "peso_aplicado" numeric, "fator_nome_snapshot" varchar, "fator_descricao_snapshot" text, "contribuicao_ponderada" numeric, foreign key("avaliacao_prioridade_id") references "avaliacoes_prioridade"("id") on delete restrict, foreign key("fator_prioridade_id") references "fatores_prioridade"("id") on delete restrict);

-- Dados da tabela detalhes_avaliacao (25 registos):
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('1', '1', '1', '1', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.3', 'Gravidade', 'Severidade do evento e risco para a vida.', '0.3');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('2', '1', '2', '1', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.25', 'Pessoas afectadas', 'Número estimado de pessoas em risco.', '0.25');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('3', '1', '3', '1', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.2', 'Vulnerabilidade', 'Presença de pessoas vulneráveis e condições especiais.', '0.2');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('4', '1', '4', '1', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.15', 'Localização', 'Acessibilidade e proximidade das equipas.', '0.15');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('5', '1', '5', '1', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.1', 'Escassez de recursos', 'Disponibilidade dos recursos necessários para resposta.', '0.1');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('6', '2', '1', '4', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.3', 'Gravidade', 'Severidade do evento e risco para a vida.', '1.2');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('7', '2', '2', '4', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.25', 'Pessoas afectadas', 'Número estimado de pessoas em risco.', '1');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('8', '2', '3', '4', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.2', 'Vulnerabilidade', 'Presença de pessoas vulneráveis e condições especiais.', '0.8');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('9', '2', '4', '4', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.15', 'Localização', 'Acessibilidade e proximidade das equipas.', '0.6');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('10', '2', '5', '4', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.1', 'Escassez de recursos', 'Disponibilidade dos recursos necessários para resposta.', '0.4');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('11', '3', '1', '6', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.3', 'Gravidade', 'Severidade do evento e risco para a vida.', '1.8');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('12', '3', '2', '6', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.25', 'Pessoas afectadas', 'Número estimado de pessoas em risco.', '1.5');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('13', '3', '3', '6', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.2', 'Vulnerabilidade', 'Presença de pessoas vulneráveis e condições especiais.', '1.2');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('14', '3', '4', '6', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.15', 'Localização', 'Acessibilidade e proximidade das equipas.', '0.9');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('15', '3', '5', '6', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.1', 'Escassez de recursos', 'Disponibilidade dos recursos necessários para resposta.', '0.6');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('16', '4', '1', '9', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.3', 'Gravidade', 'Severidade do evento e risco para a vida.', '2.7');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('17', '4', '2', '9', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.25', 'Pessoas afectadas', 'Número estimado de pessoas em risco.', '2.25');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('18', '4', '3', '9', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.2', 'Vulnerabilidade', 'Presença de pessoas vulneráveis e condições especiais.', '1.8');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('19', '4', '4', '9', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.15', 'Localização', 'Acessibilidade e proximidade das equipas.', '1.35');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('20', '4', '5', '9', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.1', 'Escassez de recursos', 'Disponibilidade dos recursos necessários para resposta.', '0.9');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('21', '5', '1', '4', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.3', 'Gravidade', 'Severidade do evento e risco para a vida.', '1.2');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('22', '5', '2', '4', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.25', 'Pessoas afectadas', 'Número estimado de pessoas em risco.', '1');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('23', '5', '3', '4', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.2', 'Vulnerabilidade', 'Presença de pessoas vulneráveis e condições especiais.', '0.8');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('24', '5', '4', '4', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.15', 'Localização', 'Acessibilidade e proximidade das equipas.', '0.6');
INSERT INTO "detalhes_avaliacao" ("id", "avaliacao_prioridade_id", "fator_prioridade_id", "pontuacao", "observacao", "created_at", "updated_at", "peso_aplicado", "fator_nome_snapshot", "fator_descricao_snapshot", "contribuicao_ponderada") VALUES ('25', '5', '5', '4', 'Valor demonstrativo coerente com a classificação de prioridade.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '0.1', 'Escassez de recursos', 'Disponibilidade dos recursos necessários para resposta.', '0.4');

-- ------------------------------------------
-- Estrutura da tabela: provincias
-- ------------------------------------------
CREATE TABLE "provincias" ("id" integer primary key autoincrement not null, "nome" varchar not null, "codigo" varchar, "created_at" datetime, "updated_at" datetime);

-- Dados da tabela provincias (4 registos):
INSERT INTO "provincias" ("id", "nome", "codigo", "created_at", "updated_at") VALUES ('1', 'Maputo Cidade', 'MPM', '2026-11-19 11:34:18', '2026-11-19 11:34:18');
INSERT INTO "provincias" ("id", "nome", "codigo", "created_at", "updated_at") VALUES ('2', 'Sofala', 'SFL', '2026-11-19 11:34:18', '2026-11-19 11:34:18');
INSERT INTO "provincias" ("id", "nome", "codigo", "created_at", "updated_at") VALUES ('3', 'Nampula', 'NPL', '2026-11-19 11:34:18', '2026-11-19 11:34:18');
INSERT INTO "provincias" ("id", "nome", "codigo", "created_at", "updated_at") VALUES ('4', 'Cabo Delgado', 'CDG', '2026-11-19 11:34:18', '2026-11-19 11:34:18');

-- ------------------------------------------
-- Estrutura da tabela: distritos
-- ------------------------------------------
CREATE TABLE "distritos" ("id" integer primary key autoincrement not null, "provincia_id" integer not null, "nome" varchar not null, "codigo" varchar, "created_at" datetime, "updated_at" datetime, foreign key("provincia_id") references "provincias"("id") on delete restrict);

-- Dados da tabela distritos (4 registos):
INSERT INTO "distritos" ("id", "provincia_id", "nome", "codigo", "created_at", "updated_at") VALUES ('1', '1', 'KaMpfumu', NULL, '2026-11-19 11:34:18', '2026-11-19 11:34:18');
INSERT INTO "distritos" ("id", "provincia_id", "nome", "codigo", "created_at", "updated_at") VALUES ('2', '2', 'Beira', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "distritos" ("id", "provincia_id", "nome", "codigo", "created_at", "updated_at") VALUES ('3', '3', 'Nampula', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "distritos" ("id", "provincia_id", "nome", "codigo", "created_at", "updated_at") VALUES ('4', '4', 'Pemba', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');

-- ------------------------------------------
-- Estrutura da tabela: municipios
-- ------------------------------------------
CREATE TABLE "municipios" ("id" integer primary key autoincrement not null, "distrito_id" integer not null, "nome" varchar not null, "codigo" varchar, "created_at" datetime, "updated_at" datetime, foreign key("distrito_id") references "distritos"("id") on delete restrict);

-- Dados da tabela municipios (4 registos):
INSERT INTO "municipios" ("id", "distrito_id", "nome", "codigo", "created_at", "updated_at") VALUES ('1', '1', 'KaMpfumu', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "municipios" ("id", "distrito_id", "nome", "codigo", "created_at", "updated_at") VALUES ('2', '2', 'Beira', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "municipios" ("id", "distrito_id", "nome", "codigo", "created_at", "updated_at") VALUES ('3', '3', 'Nampula', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "municipios" ("id", "distrito_id", "nome", "codigo", "created_at", "updated_at") VALUES ('4', '4', 'Pemba', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');

-- ------------------------------------------
-- Estrutura da tabela: postos_administrativos
-- ------------------------------------------
CREATE TABLE "postos_administrativos" ("id" integer primary key autoincrement not null, "distrito_id" integer not null, "nome" varchar not null, "codigo" varchar, "created_at" datetime, "updated_at" datetime, foreign key("distrito_id") references "distritos"("id") on delete restrict);

-- Dados da tabela postos_administrativos (4 registos):
INSERT INTO "postos_administrativos" ("id", "distrito_id", "nome", "codigo", "created_at", "updated_at") VALUES ('1', '1', 'KaMpfumu', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "postos_administrativos" ("id", "distrito_id", "nome", "codigo", "created_at", "updated_at") VALUES ('2', '2', 'Chiveve', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "postos_administrativos" ("id", "distrito_id", "nome", "codigo", "created_at", "updated_at") VALUES ('3', '3', 'Napipine', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "postos_administrativos" ("id", "distrito_id", "nome", "codigo", "created_at", "updated_at") VALUES ('4', '4', 'Paquitequete', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');

-- ------------------------------------------
-- Estrutura da tabela: bairros
-- ------------------------------------------
CREATE TABLE "bairros" ("id" integer primary key autoincrement not null, "municipio_id" integer, "posto_administrativo_id" integer, "nome" varchar not null, "codigo" varchar, "created_at" datetime, "updated_at" datetime, foreign key("municipio_id") references "municipios"("id") on delete set null, foreign key("posto_administrativo_id") references "postos_administrativos"("id") on delete set null);

-- Dados da tabela bairros (4 registos):
INSERT INTO "bairros" ("id", "municipio_id", "posto_administrativo_id", "nome", "codigo", "created_at", "updated_at") VALUES ('1', '1', '1', 'Polana Cimento A', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "bairros" ("id", "municipio_id", "posto_administrativo_id", "nome", "codigo", "created_at", "updated_at") VALUES ('2', '2', '2', 'Macurungo', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "bairros" ("id", "municipio_id", "posto_administrativo_id", "nome", "codigo", "created_at", "updated_at") VALUES ('3', '3', '3', 'Namicopo', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "bairros" ("id", "municipio_id", "posto_administrativo_id", "nome", "codigo", "created_at", "updated_at") VALUES ('4', '4', '4', 'Cariacó', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19');

-- ------------------------------------------
-- Estrutura da tabela: quarteiroes
-- ------------------------------------------
CREATE TABLE "quarteiroes" ("id" integer primary key autoincrement not null, "bairro_id" integer not null, "nome" varchar not null, "descricao" text, "created_at" datetime, "updated_at" datetime, foreign key("bairro_id") references "bairros"("id") on delete cascade);

-- Dados da tabela quarteiroes (4 registos):
INSERT INTO "quarteiroes" ("id", "bairro_id", "nome", "descricao", "created_at", "updated_at") VALUES ('1', '1', 'Quarteirão 12', 'Quarteirão de referência para dados de demonstração.', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "quarteiroes" ("id", "bairro_id", "nome", "descricao", "created_at", "updated_at") VALUES ('2', '2', 'Quarteirão 4', 'Quarteirão de referência para dados de demonstração.', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "quarteiroes" ("id", "bairro_id", "nome", "descricao", "created_at", "updated_at") VALUES ('3', '3', 'Quarteirão A', 'Quarteirão de referência para dados de demonstração.', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "quarteiroes" ("id", "bairro_id", "nome", "descricao", "created_at", "updated_at") VALUES ('4', '4', 'Quarteirão 3', 'Quarteirão de referência para dados de demonstração.', '2026-11-19 11:34:19', '2026-11-19 11:34:19');

-- ------------------------------------------
-- Estrutura da tabela: localizacoes
-- ------------------------------------------
CREATE TABLE "localizacoes" ("id" integer primary key autoincrement not null, "provincia_id" integer not null, "distrito_id" integer not null, "municipio_id" integer, "posto_administrativo_id" integer, "bairro_id" integer, "quarteirao_id" integer, "endereco_referencia" text, "latitude" numeric, "longitude" numeric, "created_at" datetime, "updated_at" datetime, foreign key("provincia_id") references "provincias"("id") on delete restrict, foreign key("distrito_id") references "distritos"("id") on delete restrict, foreign key("municipio_id") references "municipios"("id") on delete set null, foreign key("posto_administrativo_id") references "postos_administrativos"("id") on delete set null, foreign key("bairro_id") references "bairros"("id") on delete set null, foreign key("quarteirao_id") references "quarteiroes"("id") on delete set null);

-- Dados da tabela localizacoes (4 registos):
INSERT INTO "localizacoes" ("id", "provincia_id", "distrito_id", "municipio_id", "posto_administrativo_id", "bairro_id", "quarteirao_id", "endereco_referencia", "latitude", "longitude", "created_at", "updated_at") VALUES ('1', '1', '1', '1', '1', '1', '1', 'Zona urbana de Maputo', '-25.9692', '32.5732', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "localizacoes" ("id", "provincia_id", "distrito_id", "municipio_id", "posto_administrativo_id", "bairro_id", "quarteirao_id", "endereco_referencia", "latitude", "longitude", "created_at", "updated_at") VALUES ('2', '2', '2', '2', '2', '2', '2', 'Macurungo, Beira', '-19.8436', '34.8389', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "localizacoes" ("id", "provincia_id", "distrito_id", "municipio_id", "posto_administrativo_id", "bairro_id", "quarteirao_id", "endereco_referencia", "latitude", "longitude", "created_at", "updated_at") VALUES ('3', '3', '3', '3', '3', '3', '3', 'Namicopo, Nampula', '-15.1165', '39.2663', '2026-11-19 11:34:19', '2026-11-19 11:34:19');
INSERT INTO "localizacoes" ("id", "provincia_id", "distrito_id", "municipio_id", "posto_administrativo_id", "bairro_id", "quarteirao_id", "endereco_referencia", "latitude", "longitude", "created_at", "updated_at") VALUES ('4', '4', '4', '4', '4', '4', '4', 'Cariacó, Pemba', '-12.973', '40.5178', '2026-11-19 11:34:19', '2026-11-19 11:34:19');

-- ------------------------------------------
-- Estrutura da tabela: documentos_identificacao
-- ------------------------------------------
CREATE TABLE "documentos_identificacao" ("id" integer primary key autoincrement not null, "utilizador_id" integer not null, "tipo_documento" varchar not null, "numero_documento" varchar not null, "nome_documento" varchar, "data_nascimento" date, "data_emissao" date, "data_validade" date, "caminho_documento" varchar, "estado_verificacao" varchar not null default 'PENDENTE', "created_at" datetime, "updated_at" datetime, foreign key("utilizador_id") references "users"("id") on delete restrict);

-- Dados da tabela documentos_identificacao (2 registos):
INSERT INTO "documentos_identificacao" ("id", "utilizador_id", "tipo_documento", "numero_documento", "nome_documento", "data_nascimento", "data_emissao", "data_validade", "caminho_documento", "estado_verificacao", "created_at", "updated_at") VALUES ('1', '5', 'BI-DEMO', 'DEMO-BI-CIDADAO-001', 'SINGE Demo Cidadão', '1990-01-01 00:00:00', '2024-01-01 00:00:00', '2034-01-01 00:00:00', 'documentos-identificacao/demo-bi-cidadao-001.pdf', 'PENDENTE', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "documentos_identificacao" ("id", "utilizador_id", "tipo_documento", "numero_documento", "nome_documento", "data_nascimento", "data_emissao", "data_validade", "caminho_documento", "estado_verificacao", "created_at", "updated_at") VALUES ('2', '3', 'BI-DEMO', 'DEMO-BI-OPERADOR-001', 'SINGE Demo Operador', '1990-01-01 00:00:00', '2024-01-01 00:00:00', '2034-01-01 00:00:00', 'documentos-identificacao/demo-bi-operador-001.pdf', 'APROVADA', '2026-11-19 11:34:24', '2026-11-19 11:34:24');

-- ------------------------------------------
-- Estrutura da tabela: validacoes_ocorrencia
-- ------------------------------------------
CREATE TABLE "validacoes_ocorrencia" ("id" integer primary key autoincrement not null, "ocorrencia_id" integer not null, "utilizador_id" integer, "estado" varchar not null default 'PENDENTE', "observacoes" text, "motivo" text, "data_validacao" datetime, "created_at" datetime, "updated_at" datetime, foreign key("ocorrencia_id") references "ocorrencias"("id") on delete restrict, foreign key("utilizador_id") references "users"("id") on delete set null);

-- Dados da tabela validacoes_ocorrencia (4 registos):
INSERT INTO "validacoes_ocorrencia" ("id", "ocorrencia_id", "utilizador_id", "estado", "observacoes", "motivo", "data_validacao", "created_at", "updated_at") VALUES ('1', '3', '2', 'VALIDADA', 'Ocorrência confirmada para resposta operacional.', NULL, '2026-11-19 11:34:22', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "validacoes_ocorrencia" ("id", "ocorrencia_id", "utilizador_id", "estado", "observacoes", "motivo", "data_validacao", "created_at", "updated_at") VALUES ('2', '4', '2', 'VALIDADA', 'Ocorrência confirmada para resposta operacional.', NULL, '2026-11-19 11:34:22', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "validacoes_ocorrencia" ("id", "ocorrencia_id", "utilizador_id", "estado", "observacoes", "motivo", "data_validacao", "created_at", "updated_at") VALUES ('3', '1', '3', 'NAO_CONFIRMADA', NULL, 'Registo exclusivamente demonstrativo para o painel.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "validacoes_ocorrencia" ("id", "ocorrencia_id", "utilizador_id", "estado", "observacoes", "motivo", "data_validacao", "created_at", "updated_at") VALUES ('4', '2', '3', 'REJEITADA', NULL, 'Registo exclusivamente demonstrativo para o painel.', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '2026-11-19 11:34:22');

-- ------------------------------------------
-- Estrutura da tabela: users
-- ------------------------------------------
CREATE TABLE "users" ("id" integer primary key autoincrement not null, "name" varchar not null, "email" varchar not null, "email_verified_at" datetime, "password" varchar not null, "remember_token" varchar, "created_at" datetime, "updated_at" datetime, "perfil_id" integer, "equipa_id" integer, "localizacao_id" integer, "activo" tinyint(1) not null default '1', foreign key("equipa_id") references "equipas"("id") on delete set null on update no action, foreign key("perfil_id") references "perfis"("id") on delete set null on update no action, foreign key("localizacao_id") references "localizacoes"("id") on delete set null);

-- Dados da tabela users (8 registos):
INSERT INTO "users" ("id", "name", "email", "email_verified_at", "password", "remember_token", "created_at", "updated_at", "perfil_id", "equipa_id", "localizacao_id", "activo") VALUES ('1', 'SINGE Demo Administrador', 'admin@singe.test', '2026-11-19 11:34:19', '$2y$12$s.9czjrYi8Nl5F3naafr0OPJA/5L7nEsBfIGJ0mM/llBdmUO48Jgi', NULL, '2026-11-19 11:34:19', '2026-11-19 11:34:19', '1', NULL, NULL, '1');
INSERT INTO "users" ("id", "name", "email", "email_verified_at", "password", "remember_token", "created_at", "updated_at", "perfil_id", "equipa_id", "localizacao_id", "activo") VALUES ('2', 'SINGE Demo Coordenador', 'coord@singe.test', '2026-11-19 11:34:20', '$2y$12$1QujzRnjlbwJskKra95hm.JWUZE7LkMvG79F0C/Iy9gT1II.Sc/YO', NULL, '2026-11-19 11:34:20', '2026-11-19 11:34:22', '3', NULL, '1', '1');
INSERT INTO "users" ("id", "name", "email", "email_verified_at", "password", "remember_token", "created_at", "updated_at", "perfil_id", "equipa_id", "localizacao_id", "activo") VALUES ('3', 'SINGE Demo Operador', 'operador@singe.test', '2026-11-19 11:34:20', '$2y$12$UIpb.J8.eUPHJp.sfWQz6u1l0sGSGtBFr8xFUnG76F8nm77p7do7m', NULL, '2026-11-19 11:34:20', '2026-11-19 11:34:22', '2', NULL, '2', '1');
INSERT INTO "users" ("id", "name", "email", "email_verified_at", "password", "remember_token", "created_at", "updated_at", "perfil_id", "equipa_id", "localizacao_id", "activo") VALUES ('4', 'SINGE Demo Agente', 'agente@singe.test', '2026-11-19 11:34:20', '$2y$12$jNsud9PzRHz6bVE1F4r9yeSusPdeDadSbt4NXtLkVSrspSb1ijrXy', NULL, '2026-11-19 11:34:20', '2026-11-19 11:34:22', '4', '1', '2', '1');
INSERT INTO "users" ("id", "name", "email", "email_verified_at", "password", "remember_token", "created_at", "updated_at", "perfil_id", "equipa_id", "localizacao_id", "activo") VALUES ('5', 'SINGE Demo Cidadão', 'cidadao@singe.test', '2026-11-19 11:34:21', '$2y$12$A42ccrZ.2pP9/k0VsJzc0ufSkCqgsLaAyjwoR9oGUVJZzv0XhWdE.', NULL, '2026-11-19 11:34:21', '2026-11-19 11:34:22', '5', NULL, '1', '1');
INSERT INTO "users" ("id", "name", "email", "email_verified_at", "password", "remember_token", "created_at", "updated_at", "perfil_id", "equipa_id", "localizacao_id", "activo") VALUES ('6', 'SINGE Demo Agente resgate', 'agente.resgate@singe.test', '2026-11-19 11:34:21', '$2y$12$vgHtAmuSXCVbBVZJ.6pSVuZbxVZSl6nPrbaMWBu4/6ywqeicmwbPi', NULL, '2026-11-19 11:34:21', '2026-11-19 11:34:22', '4', '1', '2', '1');
INSERT INTO "users" ("id", "name", "email", "email_verified_at", "password", "remember_token", "created_at", "updated_at", "perfil_id", "equipa_id", "localizacao_id", "activo") VALUES ('7', 'SINGE Demo Agente saude', 'agente.saude@singe.test', '2026-11-19 11:34:21', '$2y$12$hjrm3QJVPNMjR6wIh0jQD.T9qU42rgi7cF7mzxjffoI7kBFnFHd6W', NULL, '2026-11-19 11:34:21', '2026-11-19 11:34:22', '4', '2', '3', '1');
INSERT INTO "users" ("id", "name", "email", "email_verified_at", "password", "remember_token", "created_at", "updated_at", "perfil_id", "equipa_id", "localizacao_id", "activo") VALUES ('8', 'SINGE Demo Agente logistica', 'agente.logistica@singe.test', '2026-11-19 11:34:21', '$2y$12$.riQ5O.3GdL8FgDCDGjEWOPb5ExXhqYPn3IWPNOhSoRLgxUqq5UKm', NULL, '2026-11-19 11:34:21', '2026-11-19 11:34:22', '4', '3', '4', '1');

-- ------------------------------------------
-- Estrutura da tabela: notificacoes
-- ------------------------------------------
CREATE TABLE "notificacoes" ("id" integer primary key autoincrement not null, "utilizador_id" integer not null, "titulo" varchar not null, "mensagem" text not null, "tipo" varchar not null, "ocorrencia_id" integer, "missao_id" integer, "lida" tinyint(1) not null default '0', "data_leitura" datetime, "created_at" datetime, "updated_at" datetime, foreign key("utilizador_id") references "users"("id") on delete restrict, foreign key("ocorrencia_id") references "ocorrencias"("id") on delete set null, foreign key("missao_id") references "missoes"("id") on delete set null);

-- Dados da tabela notificacoes (8 registos):
INSERT INTO "notificacoes" ("id", "utilizador_id", "titulo", "mensagem", "tipo", "ocorrencia_id", "missao_id", "lida", "data_leitura", "created_at", "updated_at") VALUES ('1', '1', 'SINGE — actualização de demonstração', 'Esta notificação privada demonstra a caixa de entrada do perfil autenticado.', 'sistema', NULL, NULL, '0', NULL, '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "notificacoes" ("id", "utilizador_id", "titulo", "mensagem", "tipo", "ocorrencia_id", "missao_id", "lida", "data_leitura", "created_at", "updated_at") VALUES ('2', '8', 'SINGE — actualização de demonstração', 'Esta notificação privada demonstra a caixa de entrada do perfil autenticado.', 'sistema', NULL, NULL, '0', NULL, '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "notificacoes" ("id", "utilizador_id", "titulo", "mensagem", "tipo", "ocorrencia_id", "missao_id", "lida", "data_leitura", "created_at", "updated_at") VALUES ('3', '6', 'SINGE — actualização de demonstração', 'Consulte a missão da sua equipa e reporte o progresso através do painel operacional.', 'missao', NULL, '1', '0', NULL, '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "notificacoes" ("id", "utilizador_id", "titulo", "mensagem", "tipo", "ocorrencia_id", "missao_id", "lida", "data_leitura", "created_at", "updated_at") VALUES ('4', '7', 'SINGE — actualização de demonstração', 'Esta notificação privada demonstra a caixa de entrada do perfil autenticado.', 'sistema', NULL, NULL, '0', NULL, '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "notificacoes" ("id", "utilizador_id", "titulo", "mensagem", "tipo", "ocorrencia_id", "missao_id", "lida", "data_leitura", "created_at", "updated_at") VALUES ('5', '4', 'SINGE — actualização de demonstração', 'Esta notificação privada demonstra a caixa de entrada do perfil autenticado.', 'sistema', NULL, NULL, '0', NULL, '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "notificacoes" ("id", "utilizador_id", "titulo", "mensagem", "tipo", "ocorrencia_id", "missao_id", "lida", "data_leitura", "created_at", "updated_at") VALUES ('6', '5', 'SINGE — actualização de demonstração', 'Esta notificação privada demonstra a caixa de entrada do perfil autenticado.', 'sistema', '1', NULL, '0', NULL, '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "notificacoes" ("id", "utilizador_id", "titulo", "mensagem", "tipo", "ocorrencia_id", "missao_id", "lida", "data_leitura", "created_at", "updated_at") VALUES ('7', '2', 'SINGE — actualização de demonstração', 'Esta notificação privada demonstra a caixa de entrada do perfil autenticado.', 'sistema', NULL, NULL, '0', NULL, '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "notificacoes" ("id", "utilizador_id", "titulo", "mensagem", "tipo", "ocorrencia_id", "missao_id", "lida", "data_leitura", "created_at", "updated_at") VALUES ('8', '3', 'SINGE — actualização de demonstração', 'Esta notificação privada demonstra a caixa de entrada do perfil autenticado.', 'sistema', NULL, NULL, '0', NULL, '2026-11-19 11:34:24', '2026-11-19 11:34:24');

-- ------------------------------------------
-- Estrutura da tabela: verificacoes_identidade
-- ------------------------------------------
CREATE TABLE "verificacoes_identidade" ("id" integer primary key autoincrement not null, "documento_identificacao_id" integer not null, "utilizador_verificador_id" integer, "estado" varchar not null default ('PENDENTE'), "observacoes" text, "motivo_rejeicao" text, "data_verificacao" datetime, "created_at" datetime, "updated_at" datetime, "utilizador_solicitante_id" integer, foreign key("utilizador_verificador_id") references "users"("id") on delete set null on update no action, foreign key("documento_identificacao_id") references "documentos_identificacao"("id") on delete restrict on update no action, foreign key("utilizador_solicitante_id") references "users"("id") on delete restrict);

-- Dados da tabela verificacoes_identidade (2 registos):
INSERT INTO "verificacoes_identidade" ("id", "documento_identificacao_id", "utilizador_verificador_id", "estado", "observacoes", "motivo_rejeicao", "data_verificacao", "created_at", "updated_at", "utilizador_solicitante_id") VALUES ('1', '1', NULL, 'PENDENTE', 'Registo sintético para testar a verificação de identidade.', NULL, NULL, '2026-11-19 11:34:24', '2026-11-19 11:34:24', '5');
INSERT INTO "verificacoes_identidade" ("id", "documento_identificacao_id", "utilizador_verificador_id", "estado", "observacoes", "motivo_rejeicao", "data_verificacao", "created_at", "updated_at", "utilizador_solicitante_id") VALUES ('2', '2', '1', 'APROVADA', 'Registo sintético para testar a verificação de identidade.', NULL, '2026-11-18 11:34:24', '2026-11-19 11:34:24', '2026-11-19 11:34:24', '3');

-- ------------------------------------------
-- Estrutura da tabela: missoes
-- ------------------------------------------
CREATE TABLE "missoes" ("id" integer primary key autoincrement not null, "ocorrencia_id" integer not null, "equipa_id" integer not null, "estado" varchar not null default ('atribuida'), "data_atribuicao" datetime not null, "data_inicio" datetime, "data_conclusao" datetime, "observacoes" text, "created_at" datetime, "updated_at" datetime, "coordenador_id" integer, "objectivos" text, "instrucoes" text, "data_prevista_conclusao" datetime, foreign key("equipa_id") references "equipas"("id") on delete restrict on update no action, foreign key("ocorrencia_id") references "ocorrencias"("id") on delete restrict on update no action, foreign key("coordenador_id") references "users"("id") on delete restrict);

-- Dados da tabela missoes (2 registos):
INSERT INTO "missoes" ("id", "ocorrencia_id", "equipa_id", "estado", "data_atribuicao", "data_inicio", "data_conclusao", "observacoes", "created_at", "updated_at", "coordenador_id", "objectivos", "instrucoes", "data_prevista_conclusao") VALUES ('1', '3', '1', 'em_execucao', '2026-11-19 07:34:22', '2026-11-19 11:34:22', NULL, NULL, '2026-11-19 11:34:22', '2026-11-19 11:34:22', '2', 'Prestar assistência, avaliar riscos e reportar a situação ao centro de coordenação.', 'Manter comunicação com o coordenador e respeitar os procedimentos de segurança.', '2026-11-19 19:34:22');
INSERT INTO "missoes" ("id", "ocorrencia_id", "equipa_id", "estado", "data_atribuicao", "data_inicio", "data_conclusao", "observacoes", "created_at", "updated_at", "coordenador_id", "objectivos", "instrucoes", "data_prevista_conclusao") VALUES ('2', '4', '2', 'concluida', '2026-11-19 07:34:22', '2026-11-19 11:34:22', '2026-11-19 11:34:22', NULL, '2026-11-19 11:34:22', '2026-11-19 11:34:22', '2', 'Prestar assistência, avaliar riscos e reportar a situação ao centro de coordenação.', 'Manter comunicação com o coordenador e respeitar os procedimentos de segurança.', '2026-11-19 19:34:22');

-- ------------------------------------------
-- Estrutura da tabela: ocorrencias
-- ------------------------------------------
CREATE TABLE "ocorrencias" ("id" integer primary key autoincrement not null, "titulo" varchar not null, "descricao" text not null, "localizacao" varchar not null, "latitude" numeric, "longitude" numeric, "tipo_ocorrencia_id" integer not null, "prioridade_id" integer, "utilizador_id" integer not null, "estado" varchar not null default ('registada'), "created_at" datetime, "updated_at" datetime, "localizacao_id" integer, "origem" varchar not null default 'cidadao', "comunicante_nome" varchar, "comunicante_contacto" varchar, "data_ocorrencia" datetime, foreign key("localizacao_id") references "localizacoes"("id") on delete set null on update no action, foreign key("tipo_ocorrencia_id") references "tipos_ocorrencia"("id") on delete restrict on update no action, foreign key("prioridade_id") references "prioridades"("id") on delete restrict on update no action, foreign key("utilizador_id") references "users"("id") on delete restrict on update no action);

-- Dados da tabela ocorrencias (6 registos):
INSERT INTO "ocorrencias" ("id", "titulo", "descricao", "localizacao", "latitude", "longitude", "tipo_ocorrencia_id", "prioridade_id", "utilizador_id", "estado", "created_at", "updated_at", "localizacao_id", "origem", "comunicante_nome", "comunicante_contacto", "data_ocorrencia") VALUES ('1', 'Cheias na zona baixa de Maputo', 'Registada por cidadão após chuva intensa.', 'Maputo, Moçambique', '-25.9692', '32.5732', '3', '4', '5', 'registada', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '1', 'cidadao', NULL, NULL, '2026-11-18 11:34:22');
INSERT INTO "ocorrencias" ("id", "titulo", "descricao", "localizacao", "latitude", "longitude", "tipo_ocorrencia_id", "prioridade_id", "utilizador_id", "estado", "created_at", "updated_at", "localizacao_id", "origem", "comunicante_nome", "comunicante_contacto", "data_ocorrencia") VALUES ('2', 'Incêndio habitacional na Beira', 'Fogo numa habitação com necessidade de avaliação.', 'Beira, Sofala', '-19.8436', '34.8389', '1', '3', '3', 'em_avaliacao', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '2', 'observacao_directa', NULL, NULL, '2026-11-15 11:34:22');
INSERT INTO "ocorrencias" ("id", "titulo", "descricao", "localizacao", "latitude", "longitude", "tipo_ocorrencia_id", "prioridade_id", "utilizador_id", "estado", "created_at", "updated_at", "localizacao_id", "origem", "comunicante_nome", "comunicante_contacto", "data_ocorrencia") VALUES ('3', 'Acidente rodoviário na EN1', 'Colisão com vítimas e necessidade de resgate.', 'EN1, Sofala', '-19.8436', '34.8389', '2', '2', '3', 'em_atendimento', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '2', 'telefone', NULL, NULL, '2026-11-13 11:34:22');
INSERT INTO "ocorrencias" ("id", "titulo", "descricao", "localizacao", "latitude", "longitude", "tipo_ocorrencia_id", "prioridade_id", "utilizador_id", "estado", "created_at", "updated_at", "localizacao_id", "origem", "comunicante_nome", "comunicante_contacto", "data_ocorrencia") VALUES ('4', 'Emergência médica em Nampula', 'Várias pessoas necessitam de triagem médica urgente.', 'Nampula, Moçambique', '-15.1165', '39.2663', '4', '1', '3', 'em_atendimento', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '3', 'instituicao', NULL, NULL, '2026-11-10 11:34:22');
INSERT INTO "ocorrencias" ("id", "titulo", "descricao", "localizacao", "latitude", "longitude", "tipo_ocorrencia_id", "prioridade_id", "utilizador_id", "estado", "created_at", "updated_at", "localizacao_id", "origem", "comunicante_nome", "comunicante_contacto", "data_ocorrencia") VALUES ('5', 'Ciclone costeiro em Pemba', 'Aviso preventivo de ventos fortes e precipitação na zona costeira.', 'EN1, Sofala', '-12.973', '40.5178', '6', NULL, '3', 'em_avaliacao', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '4', 'instituicao', NULL, NULL, '2026-11-07 11:34:22');
INSERT INTO "ocorrencias" ("id", "titulo", "descricao", "localizacao", "latitude", "longitude", "tipo_ocorrencia_id", "prioridade_id", "utilizador_id", "estado", "created_at", "updated_at", "localizacao_id", "origem", "comunicante_nome", "comunicante_contacto", "data_ocorrencia") VALUES ('6', 'Deslizamento de terra em Nampula', 'Movimento de terras bloqueou parcialmente uma via local.', 'Nampula, Moçambique', '-15.1165', '39.2663', '5', '3', '3', 'resolvida', '2026-11-19 11:34:22', '2026-11-19 11:34:22', '3', 'observacao_directa', NULL, NULL, '2026-11-15 11:34:22');

-- ------------------------------------------
-- Estrutura da tabela: historico_missoes
-- ------------------------------------------
CREATE TABLE "historico_missoes" ("id" integer primary key autoincrement not null, "missao_id" integer not null, "utilizador_id" integer not null, "operacao" varchar not null, "estado_anterior" varchar, "estado_novo" varchar, "observacoes" text, "created_at" datetime, "updated_at" datetime, foreign key("missao_id") references "missoes"("id") on delete restrict, foreign key("utilizador_id") references "users"("id") on delete restrict);

-- Dados da tabela historico_missoes (9 registos):
INSERT INTO "historico_missoes" ("id", "missao_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('1', '1', '2', 'criada', NULL, 'atribuida', NULL, '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "historico_missoes" ("id", "missao_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('2', '1', '2', 'estado_alterado', 'atribuida', 'em_deslocacao', NULL, '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "historico_missoes" ("id", "missao_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('3', '1', '2', 'estado_alterado', 'em_deslocacao', 'em_execucao', NULL, '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "historico_missoes" ("id", "missao_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('4', '1', '2', 'demonstracao_validada', NULL, 'em_execucao', 'Dados de demonstração gerados pelo seeder idempotente.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "historico_missoes" ("id", "missao_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('5', '2', '2', 'criada', NULL, 'atribuida', NULL, '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "historico_missoes" ("id", "missao_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('6', '2', '2', 'estado_alterado', 'atribuida', 'em_deslocacao', NULL, '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "historico_missoes" ("id", "missao_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('7', '2', '2', 'estado_alterado', 'em_deslocacao', 'em_execucao', NULL, '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "historico_missoes" ("id", "missao_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('8', '2', '2', 'estado_alterado', 'em_execucao', 'concluida', NULL, '2026-11-19 11:34:22', '2026-11-19 11:34:22');
INSERT INTO "historico_missoes" ("id", "missao_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('9', '2', '2', 'demonstracao_validada', NULL, 'concluida', 'Dados de demonstração gerados pelo seeder idempotente.', '2026-11-19 11:34:22', '2026-11-19 11:34:22');

-- ------------------------------------------
-- Estrutura da tabela: alertas_publicos
-- ------------------------------------------
CREATE TABLE "alertas_publicos" ("id" integer primary key autoincrement not null, "titulo" varchar not null, "descricao" text not null, "tipo_perigo" varchar not null, "severidade" varchar not null, "localizacao_id" integer, "area_geografica" varchar, "data_publicacao" datetime, "valido_desde" datetime not null, "valido_ate" datetime not null, "fonte" varchar not null, "utilizador_id" integer not null, "estado" varchar not null default 'rascunho', "recomendacoes" text not null, "created_at" datetime, "updated_at" datetime, foreign key("localizacao_id") references "localizacoes"("id") on delete restrict, foreign key("utilizador_id") references "users"("id") on delete restrict);

-- Dados da tabela alertas_publicos (3 registos):
INSERT INTO "alertas_publicos" ("id", "titulo", "descricao", "tipo_perigo", "severidade", "localizacao_id", "area_geografica", "data_publicacao", "valido_desde", "valido_ate", "fonte", "utilizador_id", "estado", "recomendacoes", "created_at", "updated_at") VALUES ('1', 'Aviso de chuva intensa na região sul', 'Alerta sintético de demonstração para validação do fluxo público de avisos.', 'Chuvas intensas', 'alta', '2', 'Maputo e Sofala', '2026-11-18 12:34:24', '2026-11-18 11:34:24', '2026-11-22 11:34:24', 'SINGE — demonstração institucional', '2', 'publicado', 'Evite atravessar zonas inundadas e acompanhe as comunicações das autoridades.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "alertas_publicos" ("id", "titulo", "descricao", "tipo_perigo", "severidade", "localizacao_id", "area_geografica", "data_publicacao", "valido_desde", "valido_ate", "fonte", "utilizador_id", "estado", "recomendacoes", "created_at", "updated_at") VALUES ('2', 'Vigilância costeira no Norte', 'Alerta sintético de demonstração para validação do fluxo público de avisos.', 'Ciclone', 'media', '4', 'Cabo Delgado e Nampula', NULL, '2026-11-18 11:34:24', '2026-11-22 11:34:24', 'SINGE — demonstração institucional', '2', 'rascunho', 'Acompanhe os avisos oficiais e prepare um plano familiar de emergência.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "alertas_publicos" ("id", "titulo", "descricao", "tipo_perigo", "severidade", "localizacao_id", "area_geografica", "data_publicacao", "valido_desde", "valido_ate", "fonte", "utilizador_id", "estado", "recomendacoes", "created_at", "updated_at") VALUES ('3', 'Aviso costeiro encerrado de demonstração', 'Alerta sintético de demonstração para validação do fluxo público de avisos.', 'Agitação marítima', 'baixa', '3', 'Nampula', '2026-11-11 12:34:24', '2026-11-11 11:34:24', '2026-11-18 11:34:24', 'SINGE — demonstração institucional', '2', 'encerrado', 'Este aviso de demonstração já terminou.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');

-- ------------------------------------------
-- Estrutura da tabela: historico_alertas_publicos
-- ------------------------------------------
CREATE TABLE "historico_alertas_publicos" ("id" integer primary key autoincrement not null, "alerta_publico_id" integer not null, "utilizador_id" integer not null, "operacao" varchar not null, "estado_anterior" varchar, "estado_novo" varchar, "observacoes" text, "created_at" datetime, "updated_at" datetime, foreign key("alerta_publico_id") references "alertas_publicos"("id") on delete restrict, foreign key("utilizador_id") references "users"("id") on delete restrict);

-- Dados da tabela historico_alertas_publicos (6 registos):
INSERT INTO "historico_alertas_publicos" ("id", "alerta_publico_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('1', '1', '2', 'criado', NULL, 'rascunho', 'Histórico sintético coerente com o estado de demonstração.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "historico_alertas_publicos" ("id", "alerta_publico_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('2', '1', '2', 'publicado', 'rascunho', 'publicado', 'Histórico sintético coerente com o estado de demonstração.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "historico_alertas_publicos" ("id", "alerta_publico_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('3', '2', '2', 'criado', NULL, 'rascunho', 'Histórico sintético coerente com o estado de demonstração.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "historico_alertas_publicos" ("id", "alerta_publico_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('4', '3', '2', 'criado', NULL, 'rascunho', 'Histórico sintético coerente com o estado de demonstração.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "historico_alertas_publicos" ("id", "alerta_publico_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('5', '3', '2', 'publicado', 'rascunho', 'publicado', 'Histórico sintético coerente com o estado de demonstração.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "historico_alertas_publicos" ("id", "alerta_publico_id", "utilizador_id", "operacao", "estado_anterior", "estado_novo", "observacoes", "created_at", "updated_at") VALUES ('6', '3', '2', 'encerrado', 'publicado', 'encerrado', 'Histórico sintético coerente com o estado de demonstração.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');

-- ------------------------------------------
-- Estrutura da tabela: historico_verificacoes_identidade
-- ------------------------------------------
CREATE TABLE "historico_verificacoes_identidade" ("id" integer primary key autoincrement not null, "verificacao_identidade_id" integer not null, "utilizador_id" integer, "estado_anterior" varchar, "estado_novo" varchar not null, "motivo" varchar, "observacoes" text, "created_at" datetime, "updated_at" datetime, foreign key("verificacao_identidade_id") references "verificacoes_identidade"("id") on delete cascade, foreign key("utilizador_id") references "users"("id") on delete set null);

-- Dados da tabela historico_verificacoes_identidade (3 registos):
INSERT INTO "historico_verificacoes_identidade" ("id", "verificacao_identidade_id", "utilizador_id", "estado_anterior", "estado_novo", "motivo", "observacoes", "created_at", "updated_at") VALUES ('1', '1', '5', NULL, 'PENDENTE', NULL, 'Pedido de demonstração submetido.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "historico_verificacoes_identidade" ("id", "verificacao_identidade_id", "utilizador_id", "estado_anterior", "estado_novo", "motivo", "observacoes", "created_at", "updated_at") VALUES ('2', '2', '3', NULL, 'PENDENTE', NULL, 'Pedido de demonstração submetido.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');
INSERT INTO "historico_verificacoes_identidade" ("id", "verificacao_identidade_id", "utilizador_id", "estado_anterior", "estado_novo", "motivo", "observacoes", "created_at", "updated_at") VALUES ('3', '2', '1', 'PENDENTE', 'APROVADA', NULL, 'Verificação de demonstração aprovada.', '2026-11-19 11:34:24', '2026-11-19 11:34:24');

