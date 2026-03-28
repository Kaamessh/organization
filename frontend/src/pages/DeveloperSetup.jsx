import React from 'react';

export default function DeveloperSetup() {
  return (
    <div style={{ padding: '3rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>AURA Engine Setup Documentation</h1>
      <p style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '3rem' }}>
        Copy and paste the codes below into your respective external systems to configure the backend AI pipeline.
      </p>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>1. Hugging Face `app.py`</h2>
        <p>This is the FastAPI microservice that hosts the `.pkl` files.</p>
        <pre style={{ background: '#0f172a', color: '#f8fafc', padding: '1.5rem', borderRadius: '12px', overflowX: 'auto' }}>
{`from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="AURA Crowd Engine API")
loaded_models = {}

def get_models(site_id):
    safe_name = site_id.replace(" ", "_").replace("/", "_")
    if site_id not in loaded_models:
        prophet = joblib.load(f"prophet_model_{safe_name}.pkl")
        xgb = joblib.load(f"xgboost_model_{safe_name}.pkl")
        loaded_models[site_id] = {'prophet': prophet, 'xgb': xgb}
    return loaded_models[site_id]
`}
        </pre>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>2. Supabase SQL Schema</h2>
        <p>Run this directly in the Supabase SQL Editor to configure your persistent database.</p>
        <pre style={{ background: '#0f172a', color: '#f8fafc', padding: '1.5rem', borderRadius: '12px', overflowX: 'auto' }}>
{`CREATE TABLE sites (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    max_capacity INTEGER,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION
);

CREATE TABLE active_nudges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotspot_id TEXT REFERENCES sites(id),
    suggested_gem_id TEXT REFERENCES sites(id),
    is_active BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on WebSockets for real-time nudges
ALTER PUBLICATION supabase_realtime ADD TABLE active_nudges;
`}
        </pre>
      </div>
    </div>
  );
}
