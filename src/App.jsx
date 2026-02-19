import React, { useState } from 'react'
import PdfDropZone from './components/PdfDropZone'
import './App.css'

const ZONE_LABELS = ['Document A', 'Document B', 'Document C', 'Document D']

function App() {
  const [pdfs, setPdfs] = useState([null, null, null, null])

  const handlePdfLoaded = (index, file) => {
    setPdfs((prev) => {
      const updated = [...prev]
      updated[index] = file
      return updated
    })
  }

  const handleClear = (index) => {
    setPdfs((prev) => {
      const updated = [...prev]
      updated[index] = null
      return updated
    })
  }

  const loadedCount = pdfs.filter(Boolean).length

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📄 PDF Comparison Tool</h1>
          <p className="subtitle">Drop up to 4 PDF files to compare them side by side</p>
          {loadedCount > 0 && (
            <span className="badge">{loadedCount} / 4 loaded</span>
          )}
        </div>
      </header>

      <main className="comparison-grid">
        {ZONE_LABELS.map((label, index) => (
          <PdfDropZone
            key={index}
            label={label}
            file={pdfs[index]}
            onFileLoaded={(file) => handlePdfLoaded(index, file)}
            onClear={() => handleClear(index)}
          />
        ))}
      </main>

      <footer className="app-footer">
        <p>Drag & drop PDF files into any zone above · Files are processed locally in your browser</p>
      </footer>
    </div>
  )
}

export default App
