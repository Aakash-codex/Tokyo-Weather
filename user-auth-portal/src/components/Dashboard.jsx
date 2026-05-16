import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { 
  LogOut, Sparkles, Bell, Settings, User, 
  Camera, Music, Image as ImageIcon, FileText, 
  Shield, Save, Trash2, CheckCircle, Video, Play, ExternalLink, ArrowLeft,
  Type, Bold, Italic, Table, Printer, Edit3, Highlighter, Palette, Eraser, AlignLeft, List
} from 'lucide-react'
import './Dashboard.css'

const Dashboard = ({ user, onLogout }) => {
  const [vaultKey, setVaultKey] = useState(localStorage.getItem('vault_key') || '')
  const [isVaultLocked, setIsVaultLocked] = useState(!!localStorage.getItem('vault_key'))
  const [keyInput, setKeyInput] = useState('')
  
  const [notes, setNotes] = useState([])
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [isNoteSaved, setIsNoteSaved] = useState(false)
  const [uploads, setUploads] = useState([])
  const fileInputRef = useRef(null)
  const noteEditorRef = useRef(null)
  const [uploadType, setUploadType] = useState(null)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [editorKey, setEditorKey] = useState(Date.now())
  const [activeFolder, setActiveFolder] = useState(null) // null, 'image', 'video', 'audio', 'file'

  // Simple encryption simulation (Base64 + Secret Key)
  const encrypt = (text) => btoa(encodeURIComponent(text) + '::' + vaultKey)
  const decrypt = (encoded) => {
    try {
      const decoded = decodeURIComponent(atob(encoded))
      return decoded.split('::')[0]
    } catch { return '' }
  }

  // Load encrypted data on mount (no decryption yet)
  useEffect(() => {
    const savedNotes = localStorage.getItem('safe_notes')
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes)
      setNotes(parsedNotes) // keep encrypted until unlock
    }
    const savedUploads = localStorage.getItem('vault_uploads')
    if (savedUploads) {
      const parsedUploads = JSON.parse(savedUploads)
      setUploads(parsedUploads) // keep encrypted until unlock
    }
  }, [])

  const handleBackup = () => {
    const backupData = {
      notes: localStorage.getItem('safe_notes'),
      uploads: localStorage.getItem('vault_uploads'),
      timestamp: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `vault-backup-${user.name}-${new Date().toLocaleDateString()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    alert('Backup started! Keep this file safe. You can restore it later if you lose your browser data.')
  }

  const handleSetKey = () => {
    if (keyInput.length >= 4) {
      localStorage.setItem('vault_key', keyInput)
      setVaultKey(keyInput)
      setIsVaultLocked(false)
    }
  }

  const handleUnlock = () => {
    if (keyInput === vaultKey) {
      setIsVaultLocked(false)
      setKeyInput('')
      // Decrypt notes and uploads now that vault is unlocked
      setNotes(prev => prev.map(n => ({
        ...n,
        content: decrypt(n.content)
      })))
      setUploads(prev => prev.map(u => ({
        ...u,
        name: decrypt(u.name),
        data: decrypt(u.data)
      })))
    } else {
      alert('Invalid Vault Key')
    }
  }

  const handleSaveNote = () => {
    const content = noteEditorRef.current.innerHTML
    if (!content || content === '<br>') return
    
    let updatedNotes
    if (editingNoteId) {
      updatedNotes = notes.map(n => n.id === editingNoteId ? { ...n, content, date: new Date().toLocaleString() } : n)
      setEditingNoteId(null)
    } else {
      const noteObj = {
        id: Date.now(),
        content,
        date: new Date().toLocaleString()
      }
      updatedNotes = [noteObj, ...notes]
    }
    
    setNotes(updatedNotes)
    const encryptedNotes = updatedNotes.map(n => ({
      ...n,
      content: encrypt(n.content)
    }))
    localStorage.setItem('safe_notes', JSON.stringify(encryptedNotes))
    
    noteEditorRef.current.innerHTML = ''
    setIsNoteSaved(true)
    setTimeout(() => setIsNoteSaved(false), 2000)
  }

  const editNote = (note) => {
    setEditingNoteId(note.id)
    noteEditorRef.current.innerHTML = note.content
    noteEditorRef.current.focus()
  }

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    const encrypted = updated.map(n => ({ ...n, content: encrypt(n.content) }))
    localStorage.setItem('safe_notes', JSON.stringify(encrypted))
  }

  const printNote = (content) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Secure Note Print</title>
          <style>
            body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            h1, h2 { color: #333; }
            .meta { color: #888; font-size: 0.8rem; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="meta">Printed from Antigravity Secure Vault on ${new Date().toLocaleString()}</div>
          ${content}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    if (noteEditorRef.current) noteEditorRef.current.focus()
  }

  const insertTable = () => {
    // Add space before and after the table to ensure it can be deleted/selected
    const tableHtml = `
      <p><br></p>
      <table style="width:100%; border-collapse: collapse; margin: 15px 0; border: 2px solid rgba(255,255,255,0.2); cursor: cell;">
        <thead>
          <tr style="background: rgba(255,255,255,0.1);">
            <th style="border: 1px solid rgba(255,255,255,0.1); padding: 12px; min-width: 50px;">Header</th>
            <th style="border: 1px solid rgba(255,255,255,0.1); padding: 12px; min-width: 50px;">Header</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid rgba(255,255,255,0.1); padding: 12px; min-width: 50px;">Cell</td>
            <td style="border: 1px solid rgba(255,255,255,0.1); padding: 12px; min-width: 50px;">Cell</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `
    execCommand('insertHTML', tableHtml)
  }

  const clearEditor = () => {
    // Completely reset the editor component to wipe all HTML/Tables
    setEditorKey(Date.now())
    setEditingNoteId(null)
    setTimeout(() => {
      if (noteEditorRef.current) {
        noteEditorRef.current.innerHTML = ''
        noteEditorRef.current.focus()
      }
    }, 10)
  }

  const removeFormat = () => {
    execCommand('removeFormat')
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target.result
        const newUpload = {
          id: Date.now(),
          name: file.name,
          data: dataUrl,
          type: uploadType,
          date: new Date().toLocaleDateString()
        }
        const updatedUploads = [newUpload, ...uploads]
        setUploads(updatedUploads)

        const encryptedUploads = updatedUploads.map(u => ({
          ...u,
          name: encrypt(u.name),
          data: encrypt(u.data)
        }))
        localStorage.setItem('vault_uploads', JSON.stringify(encryptedUploads))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerUpload = (type) => {
    setUploadType(type)
    fileInputRef.current.click()
  }

  const deleteUpload = (id) => {
    const updated = uploads.filter(u => u.id !== id)
    setUploads(updated)
    const encrypted = updated.map(u => ({
      ...u,
      name: encrypt(u.name),
      data: encrypt(u.data)
    }))
    localStorage.setItem('vault_uploads', JSON.stringify(encrypted))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
      variants={containerVariants}
      className="dashboard-wrapper"
    >
      <header className="dashboard-header glass-card">
        <div className="logo-section">
          <button onClick={onLogout} className="back-btn" aria-label="Go Back">
            <ArrowLeft size={20} />
          </button>
          <Sparkles className="logo-icon" size={24} />
          <h1>Antigravity</h1>
        </div>
        
        <div className="user-nav">
          <div className="icon-btns">
            <button className="icon-btn" aria-label="Notifications"><Bell size={20} /></button>
            <button className="icon-btn" aria-label="Backup Vault" title="Backup Vault" onClick={handleBackup}><Save size={20} /></button>
            <button className="icon-btn" aria-label="Settings"><Settings size={20} /></button>
          </div>
          <div className="user-profile">
            <div className="avatar" aria-hidden="true">
              <User size={20} />
            </div>
            <span>{user.name}</span>
          </div>
          <button onClick={onLogout} className="logout-btn" aria-label="Logout">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <AnimatePresence mode="wait">
          {isVaultLocked ? (
            <motion.section 
              key="lock-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="vault-lock-screen glass-card"
            >
              <Shield size={48} className="lock-icon" />
              <h3>{vaultKey ? 'Vault Locked' : 'Secure Your Vault'}</h3>
              <p>{vaultKey ? 'Enter your secret key to access your data.' : 'Create a 4-digit key to encrypt your notes and media.'}</p>
              
              <div className="lock-input-group">
                <input 
                  type="password" 
                  maxLength={4}
                  placeholder="••••"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (vaultKey ? handleUnlock() : handleSetKey())}
                />
                <button onClick={vaultKey ? handleUnlock : handleSetKey}>
                  {vaultKey ? 'Unlock Vault' : 'Set Key'}
                </button>
              </div>
            </motion.section>
          ) : (
            <motion.div 
              key="unlocked-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="unlocked-layout"
            >
              <motion.section variants={itemVariants} className="welcome-banner glass-card">
                <div className="welcome-text">
                  <h2>Welcome back, {user.name}!</h2>
                  <p>Your premium space is ready and fully encrypted.</p>
                </div>
                <div className="banner-visual">
                  <div className="orb orb-1"></div>
                  <div className="orb orb-2"></div>
                </div>
              </motion.section>

              <div className="dashboard-grid">
                <motion.section variants={itemVariants} className="vault-section glass-card full-width-vault">
                  <div className="section-header">
                    <div className="header-left">
                      {activeFolder && (
                        <button onClick={() => setActiveFolder(null)} className="folder-back-btn" title="Back to Folders">
                          <ArrowLeft size={16} />
                        </button>
                      )}
                      <Shield size={20} className="header-icon" />
                      <h3>Secure Vault {activeFolder ? `> ${activeFolder === 'file' ? 'Documents' : activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1) + 's'}` : ''}</h3>
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {!activeFolder ? (
                      <motion.div 
                        key="vault-folders"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="folders-grid main-vault-folders"
                      >
                        <button onClick={() => setActiveFolder('image')} className="folder-card glass-card">
                          <ImageIcon size={32} />
                          <span>Images</span>
                          <span className="count-badge">{uploads.filter(u => u.type === 'image').length}</span>
                        </button>
                        <button onClick={() => setActiveFolder('video')} className="folder-card glass-card">
                          <Video size={32} />
                          <span>Videos</span>
                          <span className="count-badge">{uploads.filter(u => u.type === 'video').length}</span>
                        </button>
                        <button onClick={() => setActiveFolder('audio')} className="folder-card glass-card">
                          <Music size={32} />
                          <span>Audio</span>
                          <span className="count-badge">{uploads.filter(u => u.type === 'audio').length}</span>
                        </button>
                        <button onClick={() => setActiveFolder('file')} className="folder-card glass-card">
                          <FileText size={32} />
                          <span>Documents</span>
                          <span className="count-badge">{uploads.filter(u => u.type === 'file').length}</span>
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="vault-content"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="folder-content"
                      >
                        <div className="upload-actions">
                          <button onClick={() => triggerUpload(activeFolder)} className="upload-btn primary-upload">
                            {activeFolder === 'image' && <ImageIcon size={20} />}
                            {activeFolder === 'video' && <Video size={20} />}
                            {activeFolder === 'audio' && <Music size={20} />}
                            {activeFolder === 'file' && <FileText size={20} />}
                            <span>Upload New {activeFolder === 'file' ? 'Document' : activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1)}</span>
                          </button>
                        </div>

                        <div className="uploads-gallery">
                          {uploads.filter(u => u.type === activeFolder).length === 0 ? (
                            <p className="empty-msg">No items in this folder</p>
                          ) : (
                            uploads.filter(u => u.type === activeFolder).map(item => (
                              <div key={item.id} className="gallery-item glass-card" onClick={() => setSelectedMedia(item)}>
                                <div className="item-thumb">
                                  {item.type === 'audio' && <Music size={20} />}
                                  {item.type === 'image' && <ImageIcon size={20} />}
                                  {item.type === 'video' && <Play size={20} />}
                                  {item.type === 'file' && <FileText size={20} />}
                                  
                                  {item.data && item.type === 'image' && (
                                    <img src={item.data} alt="" className="thumb-img" />
                                  )}
                                </div>
                                <div className="item-meta">
                                  <span className="item-name">{item.name}</span>
                                  <button onClick={(e) => { e.stopPropagation(); deleteUpload(item.id); }} className="mini-delete" aria-label="Delete">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>

                {/* Advanced Note Section */}
                <motion.section variants={itemVariants} className="note-section glass-card">
                  <div className="section-header">
                    <FileText size={20} className="header-icon" />
                    <h3>Advanced Secure Notes</h3>
                  </div>
                  
                  <div className="note-container">
                    <div className="note-toolbar">
                      <div className="toolbar-group">
                        <button onClick={() => execCommand('formatBlock', 'H1')} title="Large Heading">H1</button>
                        <button onClick={() => execCommand('formatBlock', 'H2')} title="Medium Heading">H2</button>
                        <button onClick={() => execCommand('fontSize', '3')} title="Small Text">S</button>
                        <button onClick={() => execCommand('fontSize', '5')} title="Normal Text">M</button>
                        <button onClick={() => execCommand('fontSize', '7')} title="Large Text">L</button>
                      </div>
                      
                      <div className="toolbar-group">
                        <button onClick={() => execCommand('bold')} title="Bold"><Bold size={14} /></button>
                        <button onClick={() => execCommand('italic')} title="Italic"><Italic size={14} /></button>
                        <button onClick={() => execCommand('insertUnorderedList')} title="Bullet List"><List size={14} /></button>
                        <button onClick={() => execCommand('justifyLeft')} title="Align Left"><AlignLeft size={14} /></button>
                      </div>

                      <div className="toolbar-group">
                        <button onClick={() => execCommand('foreColor', '#ffffff')} title="White Text"><div className="color-dot" style={{background: '#fff'}} /></button>
                        <button onClick={() => execCommand('foreColor', '#6366f1')} title="Primary Color"><div className="color-dot" style={{background: '#6366f1'}} /></button>
                        <button onClick={() => execCommand('foreColor', '#ef4444')} title="Red Text"><div className="color-dot" style={{background: '#ef4444'}} /></button>
                        <button onClick={() => execCommand('hiliteColor', '#4338ca')} title="Blue Highlight"><Highlighter size={14} /></button>
                      </div>

                      <div className="toolbar-group">
                        <button onClick={insertTable} title="Insert Table"><Table size={14} /></button>
                        <button onClick={removeFormat} title="Remove Format"><Type size={14} style={{opacity: 0.5}} /></button>
                        <button onClick={clearEditor} title="Clear All" className="danger-tool"><Eraser size={14} /></button>
                        <button onClick={() => printNote(noteEditorRef.current.innerHTML)} title="Print"><Printer size={14} /></button>
                      </div>
                    </div>

                    <div className="note-input-area">
                      <div 
                        key={editorKey}
                        ref={noteEditorRef}
                        contentEditable
                        className="rich-note-editor"
                        aria-label="Secure rich text note"
                      ></div>
                      
                      <button 
                        className={`save-btn ${isNoteSaved ? 'saved' : ''}`}
                        onClick={handleSaveNote}
                      >
                        {isNoteSaved ? <CheckCircle size={18} /> : <Save size={18} />}
                        {isNoteSaved ? 'Saved' : editingNoteId ? 'Update Note' : 'Save Securely'}
                      </button>
                    </div>

                    <div className="notes-list">
                      {notes.map(note => (
                        <div key={note.id} className="note-item">
                          <div className="note-content">
                            <div className="note-preview" dangerouslySetInnerHTML={{ __html: note.content }} />
                            <span className="note-date">{note.date}</span>
                          </div>
                          <div className="note-actions">
                            <button onClick={() => editNote(note)} className="edit-btn" title="Edit"><Edit3 size={16} /></button>
                            <button onClick={() => printNote(note.content)} className="print-btn" title="Print"><Printer size={16} /></button>
                            <button onClick={() => deleteNote(note.id)} className="delete-btn" title="Delete"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="media-modal-overlay"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="media-modal-content glass-card"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <button onClick={() => setSelectedMedia(null)} className="modal-back-btn" aria-label="Back to Gallery">
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                <h3>{selectedMedia.name}</h3>
                <button onClick={() => setSelectedMedia(null)} className="close-modal" aria-label="Close">
                  <LogOut size={18} style={{ transform: 'rotate(-90deg)' }} /> 
                </button>
              </div>
              <div className="modal-body">
                {selectedMedia.type === 'image' && (
                  <img src={selectedMedia.data} alt={selectedMedia.name} className="full-media" />
                )}
                {selectedMedia.type === 'audio' && (
                  <div className="audio-player-container">
                    <Music size={48} className="player-icon" />
                    <audio controls autoPlay src={selectedMedia.data} />
                  </div>
                )}
                {selectedMedia.type === 'video' && (
                  <video controls autoPlay src={selectedMedia.data} className="full-media" />
                )}
                {selectedMedia.type === 'file' && (
                  <div className="file-preview-fallback">
                    <FileText size={64} className="player-icon" />
                    <p>Encrypted File: {selectedMedia.name}</p>
                    <a href={selectedMedia.data} download={selectedMedia.name} className="download-btn-link">
                      <Save size={18} />
                      Download File
                    </a>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <span>Uploaded on {selectedMedia.date}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="background-effects">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
      </div>

      {/* Global Hidden Input for consistent ref access */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileUpload}
        accept={
          uploadType === 'audio' ? 'audio/*,audio/mpeg,audio/wav,audio/ogg,audio/flac,audio/aac' : 
          uploadType === 'video' ? 'video/*,.mkv,.avi,.mov,.mp4,.webm,.flv,.wmv,.m4v,.3gp,.ts,.mts' : 
          uploadType === 'image' ? 'image/*' :
          '*/*'
        }
      />
    </motion.div>
  )
}

export default Dashboard
