import React, { useState, useRef, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

function PdfDropZone({ label, file, onFileLoaded, onClear, isHidden = false }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const containerRef = useRef(null)

  const processFile = useCallback((f) => {
    if (!f) return
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are supported.')
      return
    }
    setError(null)
    setCurrentPage(1)
    setNumPages(null)
    onFileLoaded(f)
  }, [onFileLoaded])

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    processFile(droppedFile)
  }

  const handleFileInput = (e) => {
    processFile(e.target.files[0])
  }

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const goToPrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1))
  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, numPages))

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 3.0))
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5))
  const resetZoom = () => setScale(1.0)

  const handleClear = () => {
    setNumPages(null)
    setCurrentPage(1)
    setScale(1.0)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    onClear()
  }

  return (
    <div
      className={`pdf-zone ${isDragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''} ${isHidden ? 'hidden-zone' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      ref={containerRef}
    >
      {/* Zone Header */}
      <div className="zone-header">
        <span className="zone-label">{label}</span>
        {file && (
          <div className="zone-actions">
            <span className="file-name" title={file.name}>{file.name}</span>
            <button className="btn-icon btn-clear" onClick={handleClear} title="Remove PDF">
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Drop Area / PDF Viewer */}
      {!file ? (
        <div
          className="drop-area"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="drop-icon">
            {isDragOver ? '📂' : '📄'}
          </div>
          <p className="drop-text">
            {isDragOver ? 'Release to load PDF' : 'Drag & drop a PDF here'}
          </p>
          <p className="drop-subtext">or click to browse</p>
          {error && <p className="drop-error">{error}</p>}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden-input"
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <div className="pdf-viewer">
          {/* Toolbar */}
          <div className="pdf-toolbar">
            <div className="toolbar-group">
              <button className="btn-tool" onClick={goToPrevPage} disabled={currentPage <= 1} title="Previous page">‹</button>
              <span className="page-info">
                {currentPage} / {numPages ?? '…'}
              </span>
              <button className="btn-tool" onClick={goToNextPage} disabled={currentPage >= numPages} title="Next page">›</button>
            </div>
            <div className="toolbar-group">
              <button className="btn-tool" onClick={zoomOut} disabled={scale <= 0.5} title="Zoom out">−</button>
              <button className="btn-tool zoom-reset" onClick={resetZoom} title="Reset zoom">{Math.round(scale * 100)}%</button>
              <button className="btn-tool" onClick={zoomIn} disabled={scale >= 3.0} title="Zoom in">+</button>
            </div>
          </div>

          {/* PDF Document */}
          <div className="pdf-scroll-area">
            <Document
              file={file}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={() => setError('Failed to load PDF.')}
              loading={<div className="pdf-loading"><div className="spinner"></div><p>Loading…</p></div>}
              error={<div className="pdf-error">⚠️ Failed to load PDF</div>}
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                loading={<div className="page-loading"><div className="spinner"></div></div>}
              />
            </Document>
          </div>
        </div>
      )}
    </div>
  )
}

export default PdfDropZone
