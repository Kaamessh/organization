import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AdminLayout from '../components/AdminLayout';
import { Database, MapPin, Plus, Edit3, Trash2, Check, X, Search } from 'lucide-react';

const DEFAULT_LOCATIONS = [
  { name: "Calangute Beach", type: "Hotspot", capacity: 6000 },
  { name: "Baga Beach", type: "Hotspot", capacity: 5000 },
  { name: "Anjuna Beach", type: "Hotspot", capacity: 4500 },
  { name: "Dudhsagar Falls", type: "Hotspot", capacity: 2000 },
  { name: "Basilica of Bom Jesus", type: "Hotspot", capacity: 3000 },
  { name: "Fort Aguada & Lighthouse", type: "Hotspot", capacity: 2500 },
  { name: "Palolem Beach", type: "Hotspot", capacity: 4000 },
  { name: "Morjim and Ashwem Beaches", type: "Hotspot", capacity: 3500 },
  { name: "Dona Paula", type: "Hotspot", capacity: 2000 },
  { name: "Mandovi River cruise", type: "Hotspot", capacity: 1500 },
  { name: "Chapora Fort", type: "Hotspot", capacity: 2000 },
  { name: "Se Cathedral", type: "Hotspot", capacity: 2500 },
  { name: "Vagator Beach", type: "Hotspot", capacity: 4000 },
  { name: "Butterfly Beach Goa", type: "Hidden Gem", capacity: 500 },
  { name: "Galgibaga Beach", type: "Hidden Gem", capacity: 500 },
  { name: "Divar Island", type: "Hidden Gem", capacity: 800 },
  { name: "Cabo de Rama Fort", type: "Hidden Gem", capacity: 600 },
  { name: "Netravali Bubbling Lake", type: "Hidden Gem", capacity: 300 },
  { name: "Harvalem Waterfalls", type: "Hidden Gem", capacity: 400 },
  { name: "Chorla Ghat", type: "Hidden Gem", capacity: 800 },
  { name: "Cola Beach", type: "Hidden Gem", capacity: 500 },
  { name: "Fontainhas", type: "Hidden Gem", capacity: 1000 },
  { name: "Kadamba Shri Mahadeva Temple", type: "Hidden Gem", capacity: 300 },
  { name: "Kakolem Beach", type: "Hidden Gem", capacity: 400 },
  { name: "Tambdi Surla Temple & Falls", type: "Hidden Gem", capacity: 300 },
  { name: "Agonda Beach", type: "Hidden Gem", capacity: 1000 },
  { name: "Colva Beach", type: "Hidden Gem", capacity: 1500 },
  { name: "Sada Waterfalls", type: "Hidden Gem", capacity: 400 },
  { name: "Spice farms near Ponda", type: "Hidden Gem", capacity: 800 },
];

export default function LocationDatabasePage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editCap, setEditCap] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newLoc, setNewLoc] = useState({ name: '', type: 'Hotspot', capacity: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase.from('locations').select('*').order('name');
      if (!error && data && data.length > 0) {
        setLocations(data);
      } else {
        // Fallback to default list
        setLocations(DEFAULT_LOCATIONS.map((l, i) => ({ ...l, id: `local-${i}`, status: 'active' })));
      }
    } catch (e) {
      setLocations(DEFAULT_LOCATIONS.map((l, i) => ({ ...l, id: `local-${i}`, status: 'active' })));
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchLocations(); }, []);

  const handleSaveCapacity = async (loc) => {
    const cap = parseInt(editCap);
    if (!cap || cap < 1) return;
    if (!loc.id.toString().startsWith('local')) {
      await supabase.from('locations').update({ capacity: cap }).eq('id', loc.id);
    }
    setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, capacity: cap } : l));
    setEditingId(null);
  };

  const handleDelete = async (loc) => {
    if (!loc.id.toString().startsWith('local')) {
      await supabase.from('locations').delete().eq('id', loc.id);
    }
    setLocations(prev => prev.filter(l => l.id !== loc.id));
    setDeleteConfirm(null);
  };

  const handleAddLocation = async () => {
    if (!newLoc.name || !newLoc.capacity) return;
    const cap = parseInt(newLoc.capacity);
    const newEntry = { ...newLoc, capacity: cap, id: `local-${Date.now()}`, status: 'active' };
    try {
      const { data } = await supabase.from('locations').insert({ name: newLoc.name, type: newLoc.type, capacity: cap }).select().single();
      if (data) newEntry.id = data.id;
    } catch (e) { /* use local id */ }
    setLocations(prev => [...prev, newEntry]);
    setNewLoc({ name: '', type: 'Hotspot', capacity: '' });
    setShowAdd(false);
  };

  const filtered = locations.filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.type?.toLowerCase().includes(search.toLowerCase())
  );

  const hotspotCount = locations.filter(l => l.type === 'Hotspot').length;
  const gemCount = locations.filter(l => l.type === 'Hidden Gem').length;

  return (
    <AdminLayout>
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="page-title-group">
            <div className="page-icon-badge"><Database size={20} color="var(--accent-brand)" /></div>
            <div>
              <h1 className="page-title">Location Database</h1>
              <p className="page-sub">{locations.length} locations · {hotspotCount} hotspots · {gemCount} hidden gems</p>
            </div>
          </div>
          <button className="btn-add-loc" onClick={() => setShowAdd(p => !p)}>
            <Plus size={16} /> Add Location
          </button>
        </div>

        {/* Stats Row */}
        <div className="loc-stats-row">
          <div className="loc-stat-card"><div className="lst-val">{locations.length}</div><div className="lst-label">Total Locations</div></div>
          <div className="loc-stat-card"><div className="lst-val" style={{ color: 'var(--accent-red)' }}>{hotspotCount}</div><div className="lst-label">Hotspots</div></div>
          <div className="loc-stat-card"><div className="lst-val" style={{ color: 'var(--accent-green)' }}>{gemCount}</div><div className="lst-label">Hidden Gems</div></div>
          <div className="loc-stat-card"><div className="lst-val">{locations.reduce((s, l) => s + (l.capacity || 0), 0).toLocaleString()}</div><div className="lst-label">Total Capacity</div></div>
        </div>

        {/* Add Location Form */}
        {showAdd && (
          <div className="add-loc-form">
            <h4>New Location Entry</h4>
            <div className="add-loc-fields">
              <input value={newLoc.name} onChange={e => setNewLoc(p => ({ ...p, name: e.target.value }))} placeholder="Location Name" className="ent-input" />
              <select value={newLoc.type} onChange={e => setNewLoc(p => ({ ...p, type: e.target.value }))} className="ent-input">
                <option value="Hotspot">Hotspot</option>
                <option value="Hidden Gem">Hidden Gem</option>
              </select>
              <input type="number" value={newLoc.capacity} onChange={e => setNewLoc(p => ({ ...p, capacity: e.target.value }))} placeholder="Max Capacity" className="ent-input" />
              <button onClick={handleAddLocation} className="btn-confirm-edit"><Check size={16} /> Add</button>
              <button onClick={() => setShowAdd(false)} className="btn-cancel-edit"><X size={16} /></button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="loc-search-bar">
          <Search size={16} color="var(--text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search locations..." className="loc-search-input" />
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-state"><p>Loading location matrix...</p></div>
        ) : (
          <div className="loc-table-wrap">
            <table className="loc-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Location Name</th>
                  <th>Type</th>
                  <th>Max Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((loc, i) => (
                  <tr key={loc.id} className="loc-row">
                    <td className="loc-num">{i + 1}</td>
                    <td>
                      <div className="loc-name-cell">
                        <MapPin size={14} color={loc.type === 'Hotspot' ? 'var(--accent-red)' : 'var(--accent-green)'} />
                        <span>{loc.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`type-badge ${loc.type === 'Hotspot' ? 'badge-hotspot' : 'badge-gem'}`}>
                        {loc.type}
                      </span>
                    </td>
                    <td>
                      {editingId === loc.id ? (
                        <div className="inline-edit">
                          <input type="number" value={editCap} onChange={e => setEditCap(e.target.value)} className="cap-input" autoFocus />
                          <button onClick={() => handleSaveCapacity(loc)} className="btn-confirm-edit"><Check size={14} /></button>
                          <button onClick={() => setEditingId(null)} className="btn-cancel-edit"><X size={14} /></button>
                        </div>
                      ) : (
                        <span className="cap-value">{(loc.capacity || 0).toLocaleString()}</span>
                      )}
                    </td>
                    <td>
                      <span className="status-dot active">● Active</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button onClick={() => { setEditingId(loc.id); setEditCap(loc.capacity); }} className="btn-edit-row" title="Edit Capacity">
                          <Edit3 size={14} />
                        </button>
                        {deleteConfirm === loc.id ? (
                          <>
                            <button onClick={() => handleDelete(loc)} className="btn-del-confirm">Delete</button>
                            <button onClick={() => setDeleteConfirm(null)} className="btn-cancel-del">Cancel</button>
                          </>
                        ) : (
                          <button onClick={() => setDeleteConfirm(loc.id)} className="btn-del-row" title="Delete Location">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
