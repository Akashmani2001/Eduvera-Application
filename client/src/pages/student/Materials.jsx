import React, { useEffect, useState } from 'react';
import { materialApi } from '../../api/materialApi';
import { EmptyState } from '../../components/common/EmptyState';
import { FileText, Download, ExternalLink, Search, Filter } from 'lucide-react';

export const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    materialApi.getMaterials()
      .then(res => {
        if (res.success) setMaterials(res.materials);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = materials.filter(m =>
    !search ||
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.courseTitle?.toLowerCase().includes(search.toLowerCase()) ||
    m.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a142f', margin: 0 }}>Study Materials & Resources</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Download revision notes, formula sheets, and worksheets provided by your tutor
          </p>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search notes & topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading study materials...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No study resources found"
          description="Your tutor will upload PDF notes, worksheets, and study guides for your enrolled subjects."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filtered.map(mat => (
            <div key={mat._id || mat.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={24} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#ea580c', textTransform: 'uppercase' }}>
                    {mat.courseTitle}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', color: '#0a142f', margin: '2px 0 0', lineHeight: 1.3 }}>
                    {mat.title}
                  </h3>
                </div>
              </div>

              {mat.description && (
                <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '18px', flex: 1, lineHeight: 1.5 }}>
                  {mat.description}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>File Size: {mat.fileSize || 'PDF Document'}</span>
                <span>Uploaded by {mat.uploaderName || 'Faculty'}</span>
              </div>

              <div style={{ marginTop: '14px' }}>
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-block btn-sm"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Download size={15} />
                  <span>Download / View Resource</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
