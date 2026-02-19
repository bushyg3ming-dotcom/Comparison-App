import React, { useState } from 'react'
import PdfDropZone from './components/PdfDropZone'
import { COMPARISON_MODES, INSURANCE_TYPES, INSURANCE_COUNT_OPTIONS } from './constants'
import './App.css'

const ZONE_LABELS = ['Document A', 'Document B', 'Document C', 'Document D']

function App() {
  const [pdfs, setPdfs] = useState([null, null, null, null])
  const [comparisonMode, setComparisonMode] = useState('all')
  const [insuranceCount, setInsuranceCount] = useState(2)
  const [insuranceTypes, setInsuranceTypes] = useState(['total-cost-car', ''])

  const handleInsuranceCountChange = (e) => {
    const newCount = parseInt(e.target.value)
    setInsuranceCount(newCount)
    setInsuranceTypes((prev) => {
      const updated = [...prev]
      while (updated.length < newCount) {
        updated.push('')
      }
      return updated.slice(0, newCount)
    })
  }

  const handleInsuranceTypeChange = (index, value) => {
    setInsuranceTypes((prev) => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const activeInsuranceTypes = insuranceTypes.filter(Boolean)

  const getResultsText = () => {
    const modeLabel = COMPARISON_MODES.find(m => m.value === comparisonMode)?.label || comparisonMode
    const typesList = activeInsuranceTypes.length > 0 
      ? activeInsuranceTypes.map(t => INSURANCE_TYPES.find(i => i.value === t)?.label || t).join(', ')
      : 'None selected'
    
    return `Comparison Mode: ${modeLabel}\nInsurance Types: ${typesList}`
  }

  const copyResultsToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getResultsText())
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const [copySuccess, setCopySuccess] = useState(false)

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
        <div className="controls-grid">
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
            <label htmlFor="insurance-count">Number of Insurance Types:</label>
            <select
              id="insurance-count"
              value={insuranceCount}
              onChange={handleInsuranceCountChange}
              className="mode-select"
            >
              {INSURANCE_COUNT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="controls-grid insurance-types-grid">
          {insuranceTypes.map((type, index) => (
            <div key={index} className="control-group">
              <label htmlFor={`insurance-type-${index + 1}`}>Insurance Type {index + 1}:</label>
              <select
                id={`insurance-type-${index + 1}`}
                value={type}
                onChange={(e) => handleInsuranceTypeChange(index, e.target.value)}
                className="mode-select"
              >
                {INSURANCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
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
