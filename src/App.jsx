import React, { useState } from 'react'
import PdfDropZone from './components/PdfDropZone'
import { COMPARISON_MODES } from './constants'
import './App.css'

const ZONE_LABELS = ['Document A', 'Document B', 'Document C', 'Document D']

function App() {
  const [pdfs, setPdfs] = useState([null, null, null, null])
  const [comparisonMode, setComparisonMode] = useState('all')

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

  // Determine which zones should be visible based on comparison mode
  const getVisibleIndices = () => {
    switch (comparisonMode) {
      case 'a-b':
        return [0, 1]
      case 'b-c':
        return [1, 2]
      case 'c-d':
        return [2, 3]
      case 'ab-c':
        return [0, 1, 2]
      case 'abc-d':
        return [0, 1, 2, 3]
      default:
        return [0, 1, 2, 3]
    }
  }

  const visibleIndices = getVisibleIndices()

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

      <div className="controls-bar">
        <div className="control-group">
          <label htmlFor="comparison-mode">Comparison Mode:</label>
          <select
            id="comparison-mode"
            value={comparisonMode}
            onChange={(e) => setComparisonMode(e.target.value)}
            className="mode-select"
          >
            {COMPARISON_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <main className={`comparison-grid mode-${comparisonMode}`}>
        {ZONE_LABELS.map((label, index) => (
          <PdfDropZone
            key={index}
            label={label}
            file={pdfs[index]}
            onFileLoaded={(file) => handlePdfLoaded(index, file)}
            onClear={() => handleClear(index)}
            isHidden={!visibleIndices.includes(index)}
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
