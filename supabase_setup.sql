-- Copy and Paste this entire script into the Supabase SQL Editor and click "Run"

-- 1. Create the sites (hotspots & gems) table
CREATE TABLE sites (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'hotspot' or 'gem'
    max_capacity INTEGER,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION
);

-- 2. Create the active_nudges table (Realtime enabled)
CREATE TABLE active_nudges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotspot_id TEXT REFERENCES sites(id),
    suggested_gem_id TEXT REFERENCES sites(id),
    is_active BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Supabase Realtime functionality on the active_nudges table
-- This allows our React frontend to listen to instant changes
ALTER PUBLICATION supabase_realtime ADD TABLE active_nudges;

-- 4. Insert initial dataset (3 Hotspots and 2 Hidden Gems)
INSERT INTO sites (id, name, type, max_capacity, lat, lng) VALUES 
('Calangute Beach', 'Calangute Beach', 'hotspot', 5000, 15.5494, 73.7535),
('Baga Beach', 'Baga Beach', 'hotspot', 4500, 15.5523, 73.7517),
('Dudhsagar Falls', 'Dudhsagar Falls', 'hotspot', 1200, 15.3144, 74.3143),
('Butterfly Beach', 'Butterfly Beach', 'gem', 400, 15.0004, 73.9786),
('Divar Island', 'Divar Island', 'gem', 800, 15.5173, 73.8860);

-- 5. Insert default inactive nudges for each hotspot
INSERT INTO active_nudges (hotspot_id, suggested_gem_id, is_active) VALUES
('Calangute Beach', 'Butterfly Beach', false),
('Baga Beach', 'Divar Island', false),
('Dudhsagar Falls', 'Butterfly Beach', false);
