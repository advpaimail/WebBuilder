-- Роль anon для PostgREST (пустой POSTGREST_API_KEY = роль anon)
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF; END $$;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon;
-- Явно для таблицы User (имя с большой буквы)
GRANT SELECT, INSERT, UPDATE, DELETE ON public."User" TO anon;

-- Перезагрузка схемы PostgREST (иначе 404 на /User после миграций)
NOTIFY pgrst, 'reload schema';

-- При следующих миграциях PostgREST будет перезагружать схему сам
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_event_trigger WHERE evtname = 'pgrst_watch') THEN
    CREATE OR REPLACE FUNCTION pgrst_watch() RETURNS event_trigger LANGUAGE plpgsql AS $$
    BEGIN
      NOTIFY pgrst, 'reload schema';
    END;
    $$;
    CREATE EVENT TRIGGER pgrst_watch ON ddl_command_end EXECUTE PROCEDURE pgrst_watch();
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;
