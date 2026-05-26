-- ============================================================
-- PASO 1: Cambiar el tipo de categories.id a UUID
--
-- REQUISITO: La columna categories.id debe ser uuid con DEFAULT.
-- Si la tabla tiene datos, haz backup primero.
-- Si está vacía (dev), ejecuta el bloque completo.
--
-- El código del frontend ya NO enviará el id al insertar,
-- Supabase lo generará automáticamente.
-- ============================================================

-- Opción A: Tabla vacía o en desarrollo (destructiva)
-- Descomenta y ajusta según tu situación:

-- ALTER TABLE gifts DROP CONSTRAINT IF EXISTS gifts_category_id_fkey;
-- ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_pkey;
-- ALTER TABLE categories DROP COLUMN id;
-- ALTER TABLE categories ADD COLUMN id uuid DEFAULT gen_random_uuid() PRIMARY KEY;
-- ALTER TABLE gifts ADD CONSTRAINT gifts_category_id_fkey
--   FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;

-- Opción B: Si ya creaste la tabla con id uuid (lo más común en Supabase dashboard)
-- Solo asegúrate de que el DEFAULT esté seteado:
-- ALTER TABLE categories ALTER COLUMN id SET DEFAULT gen_random_uuid();


-- ============================================================
-- PASO 2: Activar Row Level Security
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- PASO 3: Políticas para la tabla categories
-- ============================================================

-- Cualquiera puede VER categorías (para las listas compartidas públicas)
CREATE POLICY "categories_select_public"
  ON categories FOR SELECT
  USING (true);

-- Solo el dueño puede INSERTAR
CREATE POLICY "categories_insert_own"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede ACTUALIZAR
CREATE POLICY "categories_update_own"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id);

-- Solo el dueño puede BORRAR
CREATE POLICY "categories_delete_own"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================================
-- PASO 4: Políticas para la tabla gifts
-- ============================================================

-- Cualquiera puede VER regalos (para las listas compartidas públicas)
CREATE POLICY "gifts_select_public"
  ON gifts FOR SELECT
  USING (true);

-- Solo el dueño puede INSERTAR
CREATE POLICY "gifts_insert_own"
  ON gifts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede ACTUALIZAR
CREATE POLICY "gifts_update_own"
  ON gifts FOR UPDATE
  USING (auth.uid() = user_id);

-- Solo el dueño puede BORRAR
CREATE POLICY "gifts_delete_own"
  ON gifts FOR DELETE
  USING (auth.uid() = user_id);
