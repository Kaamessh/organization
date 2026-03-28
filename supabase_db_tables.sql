-- AURA CROWD - MASTER DATA SCHEMA
-- Run this in your Supabase SQL Editor to initialize the core tracking tables.

-- 1. The Locations Registry (Stores all 29 Goa Hotspots and Hidden Gems)
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Hotspot', 'Hidden Gem')),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 5000
);

-- 2. The ML Forecast Table (Populated by the Officer Backend running the XGBoost Models)
CREATE TABLE IF NOT EXISTS public.forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
    predicted_visitors INTEGER NOT NULL,
    UNIQUE(location_id, forecast_date, hour)
);

-- 3. Security (Allow public apps to read the data without Auth tokens)
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to locations" ON public.locations FOR SELECT USING (true);

ALTER TABLE public.forecasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to forecasts" ON public.forecasts FOR SELECT USING (true);

-- Insert Demo Data just to ensure the UI has something to read natively
INSERT INTO public.locations (name, type, lat, lng, capacity) VALUES 
('Baga Beach', 'Hotspot', 15.5523, 73.7517, 5000),
('Calangute Beach', 'Hotspot', 15.5494, 73.7626, 6000),
('Divar Island', 'Hidden Gem', 15.5173, 73.8860, 2000),
('Butterfly Beach', 'Hidden Gem', 15.0066, 73.9785, 1000)
ON CONFLICT (name) DO NOTHING;
