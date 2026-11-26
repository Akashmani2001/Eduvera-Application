import React, { useEffect, useState } from 'react';
import { materialApi } from '../../api/materialApi';
import { courseApi } from '../../api/courseApi';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { FileText, Plus, Trash2, Download, Upload } from 'lucide-react';

export const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    fileType: 'pdf',
    visibility: 'enrolled'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [formStatus, setFormStatus] = useState({ loading: false, error: null });

  const fetchData = () => {
    setLoading(true);
    Promise.all([materialApi.getMaterials(), courseApi.getCourses()])
      .then(([mRes, cRes]) => {
        if (mRes.success) setMaterials(mRes.materials);
        if (cRes.success) {
          setCourses(cRes.courses);
          if (cRes.courses.length > 0 && !formData.courseId) {
            setFormData(prev => ({ ...prev, courseId: cRes.courses[0]._id || cRes.courses[0].id }));
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => {
    setFormData({
      courseId: courses[0]?._id || courses[0]?.id || '',
      title: '',
      description: '',
      fileType: 'pdf',
      visibility: 'enrolled'
    });
    setSelectedFile(null);
    setFormStatus({ loading: false, error: null });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: null });

    const data = new FormData();
    data.append('courseId', formData.courseId);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('fileType', formData.fileType);
    data.append('visibility', formData.visibility);
    if (selectedFile) {
      data.append('file', selectedFile);
    }

    try {
      await materialApi.createMaterial(data);
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormStatus({ loading: false, error: err.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this learning resource?')) return;
    try {
      await materialApi.deleteMaterial(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a142f', margin: 0 }}>Learning Materials & Notes</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Upload PDF formula sheets, practice worksheets, and reference guides
          </p>
        </div>
        <button onClick={openModal} className="btn btn-primary btn-sm">
          <Upload size={16} />
          <span>Upload Study Material</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading resources...
        </div>
      ) : materials.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No materials uploaded"
          description="Upload notes, assignments, or presentations for your students."
          actionLabel="Upload First Material"
          onAction={openModal}
        />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Resource Title</th>
                <th>Course Batch</th>
                <th>Type & Size</th>
                <th>Visibility</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map(mat => (
                <tr key={mat._id || mat.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0a142f' }}>{mat.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{mat.fileName}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#ea580c' }}>{mat.courseTitle}</span>
                  </td>
                  <td>
                    <span style={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '0.8rem' }}>
                      {mat.fileType}
                    </span> • {mat.fileSize || 'PDF'}
                  </td>
                  <td>
                    <Badge status={mat.visibility === 'public' ? 'info' : 'success'} text={mat.visibility} />
                  </td>
                  <td style={{ fontSize: '0.84rem' }}>
                    {new Date(mat.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={mat.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 10px' }}
                        title="Download"
                      >
                        <Download size={14} />
                      </a>
                      <button
                        onClick={() => handleDelete(mat._id || mat.id)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 10px', color: '#ef4444', borderColor: '#fca5a5' }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Upload Study Material"
      >
        <form onSubmit={handleSubmit}>
          {formStatus.error && (
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '0.88rem', marginBottom: '16px' }}>
              {formStatus.error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Course Batch *</label>
            <select
              required
              className="form-select"
              value={formData.courseId}
              onChange={e => setFormData({ ...formData, courseId: e.target.value })}
            >
              {courses.map(c => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.title} ({c.level})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Material Title *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Chapter 10 Light Reflection Illustrated Notes"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Topics Covered</label>
            <textarea
              rows={2}
              className="form-textarea"
              placeholder="What students should focus on while reading..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Document Category</label>
              <select
                className="form-select"
                value={formData.fileType}
                onChange={e => setFormData({ ...formData, fileType: e.target.value })}
              >
                <option value="pdf">PDF Document</option>
                <option value="worksheet">Practice Worksheet</option>
                <option value="notes">Revision Notes</option>
                <option value="presentation">Presentation (PPT)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Access Visibility</label>
              <select
                className="form-select"
                value={formData.visibility}
                onChange={e => setFormData({ ...formData, visibility: e.target.value })}
              >
                <option value="enrolled">Enrolled Students Only</option>
                <option value="public">Public / Preview</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Upload File (PDF, DOCX, ZIP)</label>
            <input
              type="file"
              className="form-input"
              onChange={e => setSelectedFile(e.target.files[0])}
            />
            <span className="form-hint">Sample study link will be assigned automatically if no local file selected.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formStatus.loading}
              className="btn btn-primary btn-sm"
            >
              {formStatus.loading ? 'Uploading...' : 'Save & Upload'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
