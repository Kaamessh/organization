import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import AdminLayout from '../components/AdminLayout';
import {
  Radio, Trash2, MapPin, Clock, Eye, AlertTriangle, Wifi
} from 'lucide-react';

export default function GroundIntelPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newPostAlert, setNewPostAlert] = useState(false);
  const channelRef = useRef(null);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setPosts(data);
    } catch (e) {
      console.error('Posts fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (!error) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        setDeleteConfirm(null);
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Supabase Realtime listener — new tourist post pops up instantly
    channelRef.current = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        setPosts(prev => [payload.new, ...prev]);
        setNewPostAlert(true);
        setTimeout(() => setNewPostAlert(false), 4000);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, (payload) => {
        setPosts(prev => prev.filter(p => p.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, []);

  const formatTime = (ts) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <AdminLayout>
      <div className="page-container">
        {/* PAGE HEADER */}
        <div className="page-header">
          <div className="page-title-group">
            <div className="page-icon-badge"><Radio size={20} color="var(--accent-brand)" /></div>
            <div>
              <h1 className="page-title">Live Ground Intel</h1>
              <p className="page-sub">Real-time tourist field reports — {posts.length} active dispatches</p>
            </div>
          </div>
          <div className="realtime-badge">
            <Wifi size={14} className="pulse-dot" /> REALTIME ACTIVE
          </div>
        </div>

        {/* NEW POST ALERT */}
        {newPostAlert && (
          <div className="new-post-alert">
            <AlertTriangle size={16} /> NEW FIELD REPORT RECEIVED
          </div>
        )}

        {/* CONTENT */}
        {loading ? (
          <div className="loading-state">
            <Radio size={40} color="var(--accent-brand)" style={{ animation: 'spin 1.5s linear infinite' }} />
            <p>Scanning ground channels...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <Eye size={48} color="var(--text-muted)" />
            <h3>No Field Reports</h3>
            <p>Tourist uploads will appear here in real-time once travelers start reporting.</p>
          </div>
        ) : (
          <div className="intel-masonry">
            {posts.map((post) => (
              <div key={post.id} className="intel-card">
                {/* Media */}
                {post.media_url && (
                  <div className="intel-media">
                    {post.media_url.toLowerCase().endsWith('.mp4') ? (
                      <video src={post.media_url} controls className="intel-img" />
                    ) : (
                      <img src={post.media_url} alt="Field report" className="intel-img" />
                    )}
                    <div className="intel-media-overlay">
                      <span className="intel-tag">FIELD REPORT</span>
                    </div>
                  </div>
                )}

                {/* Card Body */}
                <div className="intel-body">
                  <div className="intel-meta">
                    <div className="intel-avatar">{post.user_name?.[0]?.toUpperCase() || '?'}</div>
                    <div>
                      <div className="intel-author">{post.user_name || 'Anonymous'}</div>
                      <div className="intel-time"><Clock size={11} /> {formatTime(post.created_at)}</div>
                    </div>
                  </div>

                  {post.location_name && (
                    <div className="intel-location">
                      <MapPin size={12} color="var(--accent-brand)" /> {post.location_name}
                    </div>
                  )}

                  {post.caption && (
                    <p className="intel-caption">{post.caption}</p>
                  )}

                  {/* Admin Controls */}
                  <div className="intel-actions">
                    {deleteConfirm === post.id ? (
                      <div className="delete-confirm">
                        <span>Confirm delete?</span>
                        <button onClick={() => handleDelete(post.id)} className="btn-confirm-del">Delete</button>
                        <button onClick={() => setDeleteConfirm(null)} className="btn-cancel-del">Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="btn-delete-post"
                        title="Remove this field report"
                      >
                        <Trash2 size={14} /> Remove Report
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
