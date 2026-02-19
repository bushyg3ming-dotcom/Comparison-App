import React, { useState } from 'react'
import PdfDropZone from './components/PdfDropZone'
import { COMPARISON_MODES, INSURANCE_TYPES } from './constants'
import './App.css'

const ZONE_LABELS = ['Document A', 'Document B', 'Document C', 'Document D']

function App() {
  const [pdfs, setPdfs] = useState([null, null, null, null])
  const [comparisonMode, setComparisonMode] = useState('all')
  const [insuranceType1, setInsuranceType1] = useState('total-cost-car')
  const [insuranceType2, setInsuranceType2] = useState('')
  const [insuranceType3, setInsuranceType3] = useState('')
  const [insuranceType4, setInsuranceType4] = useState('')
  const [insuranceType5, setInsuranceType5] = useState('')
  const [insuranceType6, setInsuranceType6] = useState('')
  const [insuranceType7, setInsuranceType7] = useState('')
  const [insuranceType8, setInsuranceType8] = useState('')
  const [insuranceType9, setInsuranceType9] = useState('')

  const activeInsuranceTypes = [insuranceType1, insuranceType2, insuranceType3, insuranceType4, insuranceType5, insuranceType6, insuranceType7, insuranceType8, insuranceType9].filter(Boolean)

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
        <div className="control-group">
          <label htmlFor="insurance-type-1">Insurance Type 1:</label>
          <select
            id="insurance-type-1"
            value={insuranceType1}
            onChange={(e) => setInsuranceType1(e.target.value)}
            className="mode-select"
          >
            {INSURANCE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="insurance-type-2">Insurance Type 2:</label>
          <select
            id="insurance-type-2"
            value={insuranceType2}
            onChange={(e) => setInsuranceType2(e.target.value)}
            className="mode-select"
          >
            {INSURANCE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="insurance-type-3">Insurance Type 3:</label>
          <select
            id="insurance-type-3"
            value={insuranceType3}
            onChange={(e) => setInsuranceType3(e.target.value)}
            className="mode-select"
          >
            {INSURANCE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
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
            insuranceTypes={activeInsuranceTypes}
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
