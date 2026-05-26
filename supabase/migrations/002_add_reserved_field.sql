-- ============================================================
-- PASO 1: Agregar columna reserved a gifts
-- ============================================================

ALTER TABLE gifts ADD COLUMN IF NOT EXISTS reserved boolean DEFAULT false;


-- ============================================================
-- PASO 2: Función RPC para reservar un regalo
--
-- Por qué es necesaria: las políticas RLS solo permiten UPDATE
-- al dueño del regalo (auth.uid() = user_id). Los visitantes
-- (incluso anónimos) necesitan poder marcar reserved = true.
-- SECURITY DEFINER ejecuta la función con permisos del creador,
-- saltando RLS de forma controlada y solo para esta operación.
-- ============================================================

CREATE OR REPLACE FUNCTION reserve_gift(gift_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE gifts SET reserved = true WHERE id = gift_id;
$$;

-- Permite ejecutarla a usuarios anónimos y autenticados
GRANT EXECUTE ON FUNCTION reserve_gift(uuid) TO anon, authenticated;


-- ============================================================
-- NOTA: Si tu columna gifts.id es de tipo text (no uuid),
-- cambia el parámetro de la función a text:
--
-- CREATE OR REPLACE FUNCTION reserve_gift(gift_id text) ...
--   UPDATE gifts SET reserved = true WHERE id = gift_id;
-- ============================================================
