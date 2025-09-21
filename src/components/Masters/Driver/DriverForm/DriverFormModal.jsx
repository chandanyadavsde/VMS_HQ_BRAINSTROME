import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, CreditCard, Calendar, Upload, FileText, Save, AlertCircle } from 'lucide-react'

const DriverFormModal = ({
  isOpen,
  onClose,
  driver = null,
  onCreateDriver,
  onUpdateDriver,
  currentTheme = 'teal'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: {
      phone: ''
    },
    identification: {
      licenseNumber: '',
      licenseType: 'Light Motor Vehicle',
      licenseStartDate: '',
      licenseExpiry: '',
      licenseTestStatus: 'passed'
    },
    documents: []
  })

  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const isEditing = !!driver

  // Date validation state
  const [dateValidation, setDateValidation] = useState({
    licenseExpiry: {
      isValid: true,
      error: ''
    }
  })

  // Date validation functions
  const validateLicenseExpiry = (expiryDate, startDate) => {
    if (!expiryDate || !startDate) {
      return { isValid: true, error: '' }
    }

    const start = new Date(startDate)
    const expiry = new Date(expiryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison

    if (expiry < start) {
      return { 
        isValid: false, 
        error: 'License expiry date must be after start date' 
      }
    }

    if (expiry < today) {
      return { 
        isValid: false, 
        error: 'License expiry date cannot be in the past' 
      }
    }

    return { isValid: true, error: '' }
  }

  const isAllValid = () => {
    return dateValidation.licenseExpiry.isValid
  }

  const getAllErrors = () => {
    const errors = []
    if (!dateValidation.licenseExpiry.isValid) {
      errors.push({ field: 'licenseExpiry', error: dateValidation.licenseExpiry.error })
    }
    return errors
  }

  // Initialize form data when driver is provided
  useEffect(() => {
    if (driver) {
      setFormData(driver)
    } else {
      // Reset form for new driver
      setFormData({
        name: '',
        contact: {
          phone: ''
        },
        identification: {
          licenseNumber: '',
          licenseType: 'Light Motor Vehicle',
          licenseStartDate: '',
          licenseExpiry: '',
          licenseTestStatus: 'passed'
        },
        documents: []
      })
    }
    // Clear any errors and success when modal opens
    setError(null)
    setSuccess(false)
    // Reset date validation
    setDateValidation({
      licenseExpiry: {
        isValid: true,
        error: ''
      }
    })
  }, [driver, isOpen])

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }

    // Validate date fields
    if (field === 'identification.licenseExpiry') {
      const validation = validateLicenseExpiry(value, formData.identification.licenseStartDate)
      setDateValidation(prev => ({
        ...prev,
        licenseExpiry: validation
      }))
    } else if (field === 'identification.licenseStartDate') {
      // Re-validate expiry date when start date changes
      const validation = validateLicenseExpiry(formData.identification.licenseExpiry, value)
      setDateValidation(prev => ({
        ...prev,
        licenseExpiry: validation
      }))
    }
  }

  const handleFileUpload = (file) => {
    const newDocument = {
      id: Date.now().toString(),
      fileName: file.name,
      file: file,
      url: URL.createObjectURL(file),
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Uploaded'
    }

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDocument]
    }))
  }

  const handleFileRemove = (documentId) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null) // Clear any previous errors
    setSuccess(false) // Clear any previous success
    
    // Check date validations before submission
    if (!isAllValid()) {
      const errors = getAllErrors()
      setError(`Please fix date validation errors: ${errors.map(e => e.error).join(', ')}`)
      setLoading(false)
      return
    }
    
    try {
      // Clean the form data to only include required fields
      const cleanFormData = {
        name: formData.name,
        contact: {
          phone: formData.contact.phone
        },
        identification: {
          licenseNumber: formData.identification.licenseNumber,
          licenseType: formData.identification.licenseType,
          licenseStartDate: formData.identification.licenseStartDate,
          licenseExpiry: formData.identification.licenseExpiry,
          licenseTestStatus: formData.identification.licenseTestStatus
        },
        documents: formData.documents
      }
      
      console.log('📝 Clean form data being sent:', cleanFormData)
      
      if (isEditing) {
        await onUpdateDriver(driver.id, cleanFormData)
      } else {
        await onCreateDriver(cleanFormData)
      }
      
      // Show success message
      setSuccess(true)
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose()
      }, 1500)
      
    } catch (error) {
      console.error('Error saving driver:', error)
      // Extract error message from API response
      const errorMessage = error.message || 'Failed to create driver. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          className="relative bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {isEditing ? 'Edit Driver' : 'Add New Driver'}
                </h2>
                <p className="text-slate-600">Enter driver information and documents</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-sm font-bold">!</span>
                </div>
                <p className="text-red-800 font-medium">Error</p>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <p className="text-green-800 font-medium">Success!</p>
              </div>
              <p className="text-green-700 mt-1">Driver created successfully. Closing modal...</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Driver Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter driver name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
            />
          </div>
        </div>
            </div>

            {/* License Information */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                License Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    License Number *
                  </label>
                  <input
                    type="text"
                    value={formData.identification.licenseNumber}
                    onChange={(e) => handleInputChange('identification.licenseNumber', e.target.value)}
                    placeholder="e.g., DL123456789"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    License Type *
                  </label>
                  <select
                    value={formData.identification.licenseType}
                    onChange={(e) => handleInputChange('identification.licenseType', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  >
                    <option value="Light Motor Vehicle">Light Motor Vehicle</option>
                    <option value="Heavy Vehicle">Heavy Vehicle</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Commercial Vehicle">Commercial Vehicle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    License Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.identification.licenseStartDate}
                    onChange={(e) => handleInputChange('identification.licenseStartDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    License Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={formData.identification.licenseExpiry}
                    onChange={(e) => handleInputChange('identification.licenseExpiry', e.target.value)}
                    min={formData.identification.licenseStartDate || new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      dateValidation.licenseExpiry.isValid === false 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-slate-300'
                    }`}
                    required
                  />
                  {/* Date validation error */}
                  {dateValidation.licenseExpiry.isValid === false && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{dateValidation.licenseExpiry.error}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    License Test Status *
                  </label>
                  <select
                    value={formData.identification.licenseTestStatus}
                    onChange={(e) => handleInputChange('identification.licenseTestStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  >
                    <option value="passed">Passed</option>
                    <option value="fail">Failed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                License Document
              </h3>
              
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-300 hover:border-orange-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 mb-2">
                  Drag and drop license document here, or{' '}
                  <label className="text-orange-600 cursor-pointer hover:underline">
                    browse files
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-xs text-slate-500">Supports JPG, PNG, PDF files</p>
              </div>

              {/* Uploaded Files */}
              {formData.documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-slate-700">{doc.fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFileRemove(doc.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
        </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
              onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                <Save className="w-4 h-4" />
                {isEditing ? 'Update Driver' : 'Create Driver'}
                  </>
            )}
              </button>
          </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DriverFormModal