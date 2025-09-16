import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  X, Car, User, Phone, MapPin, Building2, Calendar, FileText, Settings, 
  Edit, Trash2, UserPlus, UserCheck, Shield, Clock, CheckCircle, 
  AlertTriangle, ExternalLink, Image as ImageIcon, Download, Eye, Save, RotateCcw, Loader2, Plus
} from 'lucide-react'

const VehicleDetailsPopup = ({ vehicle, onClose, onVehicleUpdate }) => {
  const [activeTab, setActiveTab] = useState('rc')
  const [selectedImage, setSelectedImage] = useState(null)
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [updateSummary, setUpdateSummary] = useState({
    plant: false,
    dates: false,
    images: false
  })
  const [editData, setEditData] = useState({
    currentPlant: '',
    rcEndDate: '',
    insuranceEndDate: '',
    permitEndDate: '',
    pucEndDate: '',
    fitnessEndDate: '',
    
    // Image management
    imageOperations: {
      rc: {
        toDelete: [],           // Image IDs marked for deletion
        toUpload: [],          // New File objects to upload
        previews: [],          // Preview URLs for new files
        hasChanges: false
      },
      insurance: { toDelete: [], toUpload: [], previews: [], hasChanges: false },
      permit: { toDelete: [], toUpload: [], previews: [], hasChanges: false },
      puc: { toDelete: [], toUpload: [], previews: [], hasChanges: false }
    }
  })

  // Initialize edit data when vehicle changes
  useEffect(() => {
    if (vehicle) {
      console.log('🔄 VehicleDetailsPopup: Vehicle data updated, refreshing edit data:', vehicle)
      setEditData({
        currentPlant: vehicle.currentPlant || '',
        rcEndDate: vehicle.rawData?.custrecord_rc_end_date || '',
        insuranceEndDate: vehicle.rawData?.custrecord_insurance_end_date_ag || '',
        permitEndDate: vehicle.rawData?.custrecord_permit_end_date || '',
        pucEndDate: vehicle.rawData?.custrecord_puc_end_date_ag || '',
        fitnessEndDate: vehicle.rawData?.custrecord_fitness_end_date || '',
        
        // Reset image operations
        imageOperations: {
          rc: { toDelete: [], toUpload: [], previews: [], hasChanges: false },
          insurance: { toDelete: [], toUpload: [], previews: [], hasChanges: false },
          permit: { toDelete: [], toUpload: [], previews: [], hasChanges: false },
          puc: { toDelete: [], toUpload: [], previews: [], hasChanges: false }
        }
      })
      
      // Clear any previous error/success states when vehicle data updates
      setError(null)
      setSuccess(false)
    }
  }, [vehicle])

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      // Cleanup all preview URLs to prevent memory leaks
      Object.values(editData.imageOperations).forEach(operations => {
        operations.previews.forEach(preview => {
          if (preview.url && preview.url.startsWith('blob:')) {
            URL.revokeObjectURL(preview.url)
          }
        })
      })
    }
  }, [editData.imageOperations])

  if (!vehicle) return null

  // Edit mode handlers
  const handleEditMode = () => {
    setIsEditMode(true)
    setError(null)
    setSuccess(false)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setError(null)
    setSuccess(false)
    // Reset edit data to original values
    setEditData({
      currentPlant: vehicle.currentPlant || '',
      rcEndDate: vehicle.rawData?.custrecord_rc_end_date || '',
      insuranceEndDate: vehicle.rawData?.custrecord_insurance_end_date_ag || '',
      permitEndDate: vehicle.rawData?.custrecord_permit_end_date || '',
      pucEndDate: vehicle.rawData?.custrecord_puc_end_date_ag || '',
      fitnessEndDate: vehicle.rawData?.custrecord_fitness_end_date || '',
      
      // Reset image operations and cleanup preview URLs
      imageOperations: {
        rc: { toDelete: [], toUpload: [], previews: [], hasChanges: false },
        insurance: { toDelete: [], toUpload: [], previews: [], hasChanges: false },
        permit: { toDelete: [], toUpload: [], previews: [], hasChanges: false },
        puc: { toDelete: [], toUpload: [], previews: [], hasChanges: false }
      }
    })
    
    // Cleanup any existing preview URLs to prevent memory leaks
    Object.values(editData.imageOperations).forEach(operations => {
      operations.previews.forEach(preview => {
        if (preview.url && preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url)
        }
      })
    })
  }

  // File validation constants
  const FILE_CONSTRAINTS = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf'
    ]
  }

  // Validate individual file
  const validateFile = (file) => {
    const errors = []
    
    if (file.size > FILE_CONSTRAINTS.maxSize) {
      errors.push(`File "${file.name}" is too large (max 5MB)`)
    }
    
    if (!FILE_CONSTRAINTS.allowedTypes.includes(file.type)) {
      errors.push(`File "${file.name}" has invalid type (only images and PDFs allowed)`)
    }
    
    return errors
  }

  // Toggle image for deletion
  const toggleImageForDeletion = (docType, imageId) => {
    setEditData(prev => {
      const currentDeletes = prev.imageOperations[docType].toDelete
      const isMarked = currentDeletes.includes(imageId)
      
      return {
        ...prev,
        imageOperations: {
          ...prev.imageOperations,
          [docType]: {
            ...prev.imageOperations[docType],
            toDelete: isMarked 
              ? currentDeletes.filter(id => id !== imageId)
              : [...currentDeletes, imageId],
            hasChanges: true
          }
        }
      }
    })
  }

  // Check if image is marked for deletion
  const isImageMarkedForDeletion = (docType, imageId) => {
    return editData.imageOperations[docType]?.toDelete.includes(imageId) || false
  }

  // Handle new image uploads
  const handleImageUpload = async (docType, files) => {
    const validFiles = []
    const errors = []
    
    for (let file of Array.from(files)) {
      const fileErrors = validateFile(file)
      if (fileErrors.length > 0) {
        errors.push(...fileErrors)
        continue
      }
      validFiles.push(file)
    }
    
    // Show errors if any
    if (errors.length > 0) {
      setError(errors.join(', '))
      setTimeout(() => setError(null), 5000)
    }
    
    // Create previews for valid files
    const newPreviews = await Promise.all(
      validFiles.map(async file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.type === 'application/pdf' 
          ? '/pdf-icon.png' 
          : URL.createObjectURL(file)
      }))
    )
    
    setEditData(prev => ({
      ...prev,
      imageOperations: {
        ...prev.imageOperations,
        [docType]: {
          ...prev.imageOperations[docType],
          toUpload: [...prev.imageOperations[docType].toUpload, ...validFiles],
          previews: [...prev.imageOperations[docType].previews, ...newPreviews],
          hasChanges: true
        }
      }
    }))
  }

  // Remove new image from upload queue
  const removeNewImage = (docType, index) => {
    setEditData(prev => {
      const newToUpload = [...prev.imageOperations[docType].toUpload]
      const newPreviews = [...prev.imageOperations[docType].previews]
      
      // Revoke object URL to prevent memory leaks
      if (newPreviews[index]?.url.startsWith('blob:')) {
        URL.revokeObjectURL(newPreviews[index].url)
      }
      
      newToUpload.splice(index, 1)
      newPreviews.splice(index, 1)
      
      return {
        ...prev,
        imageOperations: {
          ...prev.imageOperations,
          [docType]: {
            ...prev.imageOperations[docType],
            toUpload: newToUpload,
            previews: newPreviews,
            hasChanges: newToUpload.length > 0 || prev.imageOperations[docType].toDelete.length > 0
          }
        }
      }
    })
  }

  const handleSaveEdit = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Build comprehensive patch data and track changes
      const formData = new FormData()
      let hasChanges = false
      const changesSummary = {
        plant: false,
        dates: false,
        images: false
      }
      
      // 1. Plant changes
      if (editData.currentPlant !== vehicle.currentPlant) {
        formData.append('currentPlant', editData.currentPlant)
        hasChanges = true
        changesSummary.plant = true
      }
      
      // 2. Date changes
      const dateFields = {
        rcEndDate: 'custrecord_rc_end_date',
        insuranceEndDate: 'custrecord_insurance_end_date_ag',
        permitEndDate: 'custrecord_permit_end_date',
        pucEndDate: 'custrecord_puc_end_date_ag',
        fitnessEndDate: 'custrecord_fitness_end_date'
      }
      
      Object.keys(dateFields).forEach(editField => {
        const apiField = dateFields[editField]
        const currentValue = vehicle.rawData?.[apiField]
        if (editData[editField] !== currentValue) {
          formData.append(apiField, editData[editField])
          hasChanges = true
          changesSummary.dates = true
        }
      })
      
      // 3. Image operations
      const imageFieldMap = {
        rc: 'custrecord_rc_doc_attach',
        insurance: 'custrecord_insurance_attachment_ag', 
        permit: 'custrecord_permit_attachment_ag',
        puc: 'custrecord_puc_attachment_ag'
      }
      
      Object.keys(editData.imageOperations).forEach(docType => {
        const operations = editData.imageOperations[docType]
        
        if (operations.hasChanges) {
          hasChanges = true
          changesSummary.images = true
          
          // Images to delete
          if (operations.toDelete.length > 0) {
            formData.append(`delete_${docType}_images`, JSON.stringify(operations.toDelete))
          }
          
          // Images to upload
          operations.toUpload.forEach((file, index) => {
            formData.append(imageFieldMap[docType], file)
          })
        }
      })

      // Skip API call if nothing changed
      if (!hasChanges) {
        setError('No changes to save')
        return
      }

      console.log('🔄 Saving vehicle changes with FormData')
      console.log('📊 FormData contents:')
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`)
        } else {
          console.log(`  ${key}: ${value}`)
        }
      }

      // Call the update function passed from parent
      if (onVehicleUpdate) {
        await onVehicleUpdate(vehicle.vehicleNumber || vehicle.custrecord_vehicle_number, formData)
      }

      setUpdateSummary(changesSummary)
      setSuccess(true)
      setIsEditMode(false)
      
      // Play a subtle success sound (browser's system bell)
      try {
        // Create a short, pleasant audio notification
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
      } catch (e) {
        // Fallback - browser notification sound might not work in all environments
        console.log('🔔 Success! (Audio notification not supported)')
      }
      
      // Auto-hide success message after 5 seconds (longer for more detailed message)
      setTimeout(() => {
        setSuccess(false)
        setUpdateSummary({ plant: false, dates: false, images: false })
      }, 5000)

    } catch (err) {
      setError(err.message || 'Failed to update vehicle')
      console.error('❌ Error saving vehicle:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Helper function to calculate document status
  const getDocumentStatus = (endDate) => {
    if (!endDate) return { status: 'unknown', color: 'gray', text: 'Unknown' }
    
    const today = new Date()
    const expiry = new Date(endDate)
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) {
      return { status: 'expired', color: 'red', text: 'Expired' }
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring', color: 'orange', text: 'Expiring Soon' }
    } else {
      return { status: 'valid', color: 'green', text: 'Valid' }
    }
  }

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      return 'N/A'
    }
  }

  // Get approval status styling
  const getApprovalStatus = (status) => {
    switch (status) {
      case 'approved':
        return { color: 'green', text: 'Approved', icon: CheckCircle }
      case 'pending':
        return { color: 'orange', text: 'Pending', icon: Clock }
      case 'rejected':
        return { color: 'red', text: 'Rejected', icon: AlertTriangle }
      default:
        return { color: 'gray', text: 'Unknown', icon: Clock }
    }
  }

  const approvalStatus = getApprovalStatus(vehicle.rawData?.approved_by_hq)
  const driverApprovalStatus = getApprovalStatus(vehicle.rawData?.assignedDriver?.approved_by_hq)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Content - Much Wider */}
      <motion.div
        className="relative bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-6xl w-full max-h-[95vh] overflow-y-auto border border-orange-200/30 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section - Ultra Compact */}
        <div className="flex items-center justify-between mb-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Car className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 mb-0.5">{vehicle.vehicleNumber}</h2>
              <p className="text-xs text-slate-600 mb-1">{vehicle.rawData?.custrecord_vehicle_name_ag || 'Vehicle'}</p>
              <div className="flex items-center gap-1.5">
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  vehicle.rawData?.custrecord_vehicle_type_ag === 'ODC' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {vehicle.rawData?.custrecord_vehicle_type_ag || 'N/A'}
                </span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  approvalStatus.color === 'green' ? 'bg-green-100 text-green-700' :
                  approvalStatus.color === 'orange' ? 'bg-amber-100 text-amber-700' :
                  approvalStatus.color === 'red' ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  <approvalStatus.icon className="w-2.5 h-2.5 inline mr-0.5" />
                  {approvalStatus.text}
                </span>
                {isEditMode ? (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-2.5 h-2.5 text-slate-600" />
                    <select
                      value={editData.currentPlant}
                      onChange={(e) => handleInputChange('currentPlant', e.target.value)}
                      className="px-1.5 py-0.5 rounded text-xs font-medium bg-white text-slate-800 border border-slate-300 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="pune">Pune</option>
                      <option value="solapur">Solapur</option>
                      <option value="surat">Surat</option>
                      <option value="daman">Daman</option>
                      <option value="free">Free (Not Assigned)</option>
                    </select>
                  </div>
                ) : (
                  <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  <MapPin className="w-2.5 h-2.5 inline mr-0.5" />
                  {vehicle.currentPlant}
                </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Edit Mode Toggle Button */}
            {!isEditMode ? (
            <button
                onClick={handleEditMode}
                className="flex items-center gap-1 px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium text-xs"
            >
              <Edit className="w-2.5 h-2.5" />
              Modify
            </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium text-xs disabled:opacity-50"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium text-xs disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  ) : (
                    <Save className="w-2.5 h-2.5" />
                  )}
                  Save
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-6 mb-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  ✅ Vehicle Updated Successfully!
                </h3>
                <p className="text-green-700 text-sm mb-3">
                  Your changes have been saved and are now live in the system.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {updateSummary.plant && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      🏭 Plant Information ✓
                    </span>
                  )}
                  {updateSummary.dates && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      📅 Document Dates ✓
                    </span>
                  )}
                  {updateSummary.images && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      📎 Document Files ✓
                    </span>
                  )}
                </div>
                
                {/* Auto-dismiss progress bar */}
                <div className="mt-4">
                  <div className="w-full bg-green-200 rounded-full h-1">
                    <motion.div 
                      className="bg-green-500 h-1 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                    />
                  </div>
                  <p className="text-xs text-green-600 mt-1 text-center">
                    Auto-dismissing in 5 seconds...
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSuccess(false)
                  setUpdateSummary({ plant: false, dates: false, images: false })
                }}
                className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          
          {/* Left Column - VEHICLE FOCUSED */}
          <div className="lg:col-span-2 space-y-3">
            
            {/* Vehicle Specifications - Ultra Compact */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center">
                  <Car className="w-3 h-3 text-white" />
                </div>
                Vehicle Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="bg-white rounded p-2 shadow-sm">
                  <label className="text-xs text-slate-600 font-medium">Vehicle Age</label>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{vehicle.rawData?.custrecord_age_of_vehicle || 'N/A'}</p>
                </div>
                <div className="bg-white rounded p-2 shadow-sm">
                  <label className="text-xs text-slate-600 font-medium">Chassis Number</label>
                  <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{vehicle.rawData?.custrecord_chassis_number || 'N/A'}</p>
                </div>
                <div className="bg-white rounded p-2 shadow-sm">
                  <label className="text-xs text-slate-600 font-medium">Engine Number</label>
                  <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{vehicle.rawData?.custrecord_engine_number_ag || 'N/A'}</p>
                </div>
                <div className="bg-white rounded p-2 shadow-sm">
                  <label className="text-xs text-slate-600 font-medium">GPS Tracking</label>
                  <p className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    {vehicle.rawData?.custrecord_vehicle_master_gps_available ? (
                      <><CheckCircle className="w-3 h-3 text-green-600" /> Available</>
                    ) : (
                      <><AlertTriangle className="w-3 h-3 text-amber-600" /> Not Available</>
                    )}
                  </p>
                </div>
                <div className="bg-white rounded p-2 shadow-sm">
                  <label className="text-xs text-slate-600 font-medium">Current Status</label>
                  <p className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    {vehicle.rawData?.inTrip ? (
                      <><Car className="w-3 h-3 text-blue-600" /> In Trip</>
                    ) : (
                      <><MapPin className="w-3 h-3 text-green-600" /> Available</>
                    )}
                  </p>
                </div>
                <div className="bg-white rounded p-2 shadow-sm">
                  <label className="text-xs text-slate-600 font-medium">Current Plant</label>
                  {isEditMode ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-orange-600" />
                      <select
                        value={editData.currentPlant}
                        onChange={(e) => handleInputChange('currentPlant', e.target.value)}
                        className="px-1.5 py-0.5 rounded text-xs font-medium bg-white border border-orange-300 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-slate-800"
                      >
                        <option value="pune">Pune</option>
                        <option value="solapur">Solapur</option>
                        <option value="surat">Surat</option>
                        <option value="daman">Daman</option>
                        <option value="free">Free (Not Assigned)</option>
                      </select>
                    </div>
                  ) : (
                  <p className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-orange-600" />
                    {vehicle.currentPlant}
                  </p>
                  )}
                </div>
              </div>
            </div>

            {/* Ownership & Vendor */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-orange-600" />
                Ownership & Vendor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600">Owner Name</label>
                  <p className="text-xs font-semibold text-slate-800">{vehicle.rawData?.custrecord_owner_name_ag || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-600">Owner Contact</label>
                  <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5" />
                    {vehicle.rawData?.custrecord_owner_no_ag || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-slate-600">Vendor</label>
                  <p className="text-xs font-semibold text-slate-800">{vehicle.vendorName}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-600">Vendor Status</label>
                  <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    {vehicle.rawData?.custrecord_vendor_name_ag?.isInactive ? (
                      <><AlertTriangle className="w-2.5 h-2.5 text-red-600" /> Inactive</>
                    ) : (
                      <><CheckCircle className="w-2.5 h-2.5 text-green-600" /> Active</>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Documents Tabs */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="mb-2">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-orange-600" />
                  Legal Documents
                </h3>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex space-x-0.5 mb-3 bg-slate-200 rounded p-0.5">
                {[
                  { id: 'rc', label: 'RC', icon: FileText },
                  { id: 'insurance', label: 'Insurance', icon: Shield },
                  { id: 'permit', label: 'Permit', icon: Calendar },
                  { id: 'puc', label: 'PUC', icon: CheckCircle }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-1 rounded text-xs font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <tab.icon className="w-2.5 h-2.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-2">
                {activeTab === 'rc' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-600">RC Number</label>
                      <p className="text-xs font-semibold text-slate-800">{vehicle.rawData?.custrecord_rc_no || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-600">Start Date</label>
                      <p className="text-xs font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_rc_start_date)}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-600">End Date {isEditMode && <span className="text-slate-500 font-normal">(Editable)</span>}</label>
                      {isEditMode ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-slate-400" />
                          <input
                            type="date"
                            value={editData.rcEndDate ? editData.rcEndDate.split('T')[0] : ''}
                            onChange={(e) => handleInputChange('rcEndDate', e.target.value)}
                            className="px-1.5 py-0.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-xs font-medium"
                          />
                        </div>
                      ) : (
                        <p className="text-xs font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_rc_end_date)}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-slate-600">Status</label>
                      <p className="text-xs font-semibold text-slate-800">
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          getDocumentStatus(vehicle.rawData?.custrecord_rc_end_date).color === 'green' ? 'bg-green-100 text-green-700' :
                          getDocumentStatus(vehicle.rawData?.custrecord_rc_end_date).color === 'orange' ? 'bg-amber-100 text-amber-700' :
                          getDocumentStatus(vehicle.rawData?.custrecord_rc_end_date).color === 'red' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {getDocumentStatus(vehicle.rawData?.custrecord_rc_end_date).text}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'insurance' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-600">Company</label>
                      <p className="font-semibold text-slate-800">{vehicle.rawData?.custrecord_insurance_company_name_ag || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Policy Number</label>
                      <p className="font-semibold text-slate-800">{vehicle.rawData?.custrecord_insurance_number_ag || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Start Date</label>
                      <p className="font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_insurance_start_date_ag)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">End Date {isEditMode && <span className="text-slate-500 font-normal">(Editable)</span>}</label>
                      {isEditMode ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <input
                            type="date"
                            value={editData.insuranceEndDate ? editData.insuranceEndDate.split('T')[0] : ''}
                            onChange={(e) => handleInputChange('insuranceEndDate', e.target.value)}
                            className="px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-sm font-semibold"
                          />
                        </div>
                      ) : (
                      <p className="font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_insurance_end_date_ag)}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-slate-600">Status</label>
                      <p className="font-semibold text-slate-800">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          getDocumentStatus(vehicle.rawData?.custrecord_insurance_end_date_ag).color === 'green' ? 'bg-green-100 text-green-800' :
                          getDocumentStatus(vehicle.rawData?.custrecord_insurance_end_date_ag).color === 'orange' ? 'bg-orange-100 text-orange-800' :
                          getDocumentStatus(vehicle.rawData?.custrecord_insurance_end_date_ag).color === 'red' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getDocumentStatus(vehicle.rawData?.custrecord_insurance_end_date_ag).text}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'permit' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-600">Permit Number</label>
                      <p className="font-semibold text-slate-800">{vehicle.rawData?.custrecord_permit_number_ag || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Start Date</label>
                      <p className="font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_permit_start_date)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">End Date {isEditMode && <span className="text-slate-500 font-normal">(Editable)</span>}</label>
                      {isEditMode ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <input
                            type="date"
                            value={editData.permitEndDate ? editData.permitEndDate.split('T')[0] : ''}
                            onChange={(e) => handleInputChange('permitEndDate', e.target.value)}
                            className="px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-sm font-semibold"
                          />
                        </div>
                      ) : (
                      <p className="font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_permit_end_date)}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Status</label>
                      <p className="font-semibold text-slate-800">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          getDocumentStatus(vehicle.rawData?.custrecord_permit_end_date).color === 'green' ? 'bg-green-100 text-green-800' :
                          getDocumentStatus(vehicle.rawData?.custrecord_permit_end_date).color === 'orange' ? 'bg-orange-100 text-orange-800' :
                          getDocumentStatus(vehicle.rawData?.custrecord_permit_end_date).color === 'red' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getDocumentStatus(vehicle.rawData?.custrecord_permit_end_date).text}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'puc' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-600">PUC Number</label>
                      <p className="font-semibold text-slate-800">{vehicle.rawData?.custrecord_puc_number || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Start Date</label>
                      <p className="font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_puc_start_date_ag)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">End Date {isEditMode && <span className="text-slate-500 font-normal">(Editable)</span>}</label>
                      {isEditMode ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <input
                            type="date"
                            value={editData.pucEndDate ? editData.pucEndDate.split('T')[0] : ''}
                            onChange={(e) => handleInputChange('pucEndDate', e.target.value)}
                            className="px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-sm font-semibold"
                          />
                        </div>
                      ) : (
                      <p className="font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_puc_end_date_ag)}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Status</label>
                      <p className="font-semibold text-slate-800">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          getDocumentStatus(vehicle.rawData?.custrecord_puc_end_date_ag).color === 'green' ? 'bg-green-100 text-green-800' :
                          getDocumentStatus(vehicle.rawData?.custrecord_puc_end_date_ag).color === 'orange' ? 'bg-orange-100 text-orange-800' :
                          getDocumentStatus(vehicle.rawData?.custrecord_puc_end_date_ag).color === 'red' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getDocumentStatus(vehicle.rawData?.custrecord_puc_end_date_ag).text}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Document Attachments Gallery - Tab Specific */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
                Document Attachments - {activeTab === 'rc' ? 'RC Document' : activeTab === 'insurance' ? 'Insurance' : activeTab === 'permit' ? 'Permit' : 'PUC'}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Show only images for the active tab */}
                {activeTab === 'rc' && vehicle.rawData?.custrecord_rc_doc_attach?.map((doc, index) => {
                  const isMarkedForDeletion = isImageMarkedForDeletion('rc', doc.id || doc.url)
                  return (
                    <div key={index} className="relative group">
                      <div 
                        className={`aspect-square bg-white rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                          isMarkedForDeletion 
                            ? 'border-red-300 opacity-50' 
                            : 'border-slate-200 hover:shadow-lg'
                        }`}
                        onClick={() => !isEditMode && setSelectedImage(doc)}
                      >
                        <img 
                          src={doc.url} 
                          alt={doc.fileName}
                          className={`w-full h-full object-cover transition-transform ${
                            !isEditMode ? 'group-hover:scale-105' : ''
                          }`}
                        />
                        
                        {/* Delete overlay */}
                        {isMarkedForDeletion && (
                          <div className="absolute inset-0 bg-red-500/30 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">WILL DELETE</span>
                          </div>
                        )}
                      </div>
                      
                      {/* X Icon (Edit Mode Only) */}
                      {isEditMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleImageForDeletion('rc', doc.id || doc.url)
                          }}
                          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all z-10 ${
                            isMarkedForDeletion
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-white text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <X className="w-3 h-3 mx-auto" />
                        </button>
                      )}
                      
                      <p className="text-xs text-slate-600 mt-1 truncate">{doc.fileName}</p>
                    </div>
                  )
                })}

                {activeTab === 'insurance' && vehicle.rawData?.custrecord_insurance_attachment_ag?.map((doc, index) => {
                  const isMarkedForDeletion = isImageMarkedForDeletion('insurance', doc.id || doc.url)
                  return (
                    <div key={`insurance-${index}`} className="relative group">
                      <div 
                        className={`aspect-square bg-white rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                          isMarkedForDeletion 
                            ? 'border-red-300 opacity-50' 
                            : 'border-slate-200 hover:shadow-lg'
                        }`}
                        onClick={() => !isEditMode && setSelectedImage(doc)}
                      >
                        <img 
                          src={doc.url} 
                          alt={doc.fileName}
                          className={`w-full h-full object-cover transition-transform ${
                            !isEditMode ? 'group-hover:scale-105' : ''
                          }`}
                        />
                        
                        {/* Delete overlay */}
                        {isMarkedForDeletion && (
                          <div className="absolute inset-0 bg-red-500/30 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">WILL DELETE</span>
                          </div>
                        )}
                      </div>
                      
                      {/* X Icon (Edit Mode Only) */}
                      {isEditMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleImageForDeletion('insurance', doc.id || doc.url)
                          }}
                          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all z-10 ${
                            isMarkedForDeletion
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-white text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <X className="w-3 h-3 mx-auto" />
                        </button>
                      )}
                      
                      <p className="text-xs text-slate-600 mt-1 truncate">{doc.fileName}</p>
                    </div>
                  )
                })}

                {activeTab === 'permit' && vehicle.rawData?.custrecord_permit_attachment_ag?.map((doc, index) => {
                  const isMarkedForDeletion = isImageMarkedForDeletion('permit', doc.id || doc.url)
                  return (
                    <div key={`permit-${index}`} className="relative group">
                      <div 
                        className={`aspect-square bg-white rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                          isMarkedForDeletion 
                            ? 'border-red-300 opacity-50' 
                            : 'border-slate-200 hover:shadow-lg'
                        }`}
                        onClick={() => !isEditMode && setSelectedImage(doc)}
                      >
                        <img 
                          src={doc.url} 
                          alt={doc.fileName}
                          className={`w-full h-full object-cover transition-transform ${
                            !isEditMode ? 'group-hover:scale-105' : ''
                          }`}
                        />
                        
                        {/* Delete overlay */}
                        {isMarkedForDeletion && (
                          <div className="absolute inset-0 bg-red-500/30 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">WILL DELETE</span>
                          </div>
                        )}
                      </div>
                      
                      {/* X Icon (Edit Mode Only) */}
                      {isEditMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleImageForDeletion('permit', doc.id || doc.url)
                          }}
                          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all z-10 ${
                            isMarkedForDeletion
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-white text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <X className="w-3 h-3 mx-auto" />
                        </button>
                      )}
                      
                      <p className="text-xs text-slate-600 mt-1 truncate">{doc.fileName}</p>
                    </div>
                  )
                })}

                {activeTab === 'puc' && vehicle.rawData?.custrecord_puc_attachment_ag?.map((doc, index) => {
                  const isMarkedForDeletion = isImageMarkedForDeletion('puc', doc.id || doc.url)
                  return (
                    <div key={`puc-${index}`} className="relative group">
                      <div 
                        className={`aspect-square bg-white rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                          isMarkedForDeletion 
                            ? 'border-red-300 opacity-50' 
                            : 'border-slate-200 hover:shadow-lg'
                        }`}
                        onClick={() => !isEditMode && setSelectedImage(doc)}
                      >
                        <img 
                          src={doc.url} 
                          alt={doc.fileName}
                          className={`w-full h-full object-cover transition-transform ${
                            !isEditMode ? 'group-hover:scale-105' : ''
                          }`}
                        />
                        
                        {/* Delete overlay */}
                        {isMarkedForDeletion && (
                          <div className="absolute inset-0 bg-red-500/30 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">WILL DELETE</span>
                          </div>
                        )}
                      </div>
                      
                      {/* X Icon (Edit Mode Only) */}
                      {isEditMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleImageForDeletion('puc', doc.id || doc.url)
                          }}
                          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all z-10 ${
                            isMarkedForDeletion
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-white text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <X className="w-3 h-3 mx-auto" />
                        </button>
                      )}
                      
                      <p className="text-xs text-slate-600 mt-1 truncate">{doc.fileName}</p>
                    </div>
                  )
                })}

                {/* New Image Previews (Edit Mode Only) */}
                {isEditMode && editData.imageOperations[activeTab]?.previews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <div className="aspect-square bg-white rounded-lg border-2 border-blue-300 overflow-hidden">
                      {preview.type === 'application/pdf' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-red-50">
                          <FileText className="w-8 h-8 text-red-600 mb-2" />
                          <span className="text-xs text-red-600 font-medium">PDF</span>
                        </div>
                      ) : (
                        <img 
                          src={preview.url} 
                          alt={preview.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
                      NEW
                    </div>
                    
                    <button
                      onClick={() => removeNewImage(activeTab, index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full border-2 border-white shadow-lg hover:bg-blue-600 transition-all z-10"
                    >
                      <X className="w-3 h-3 mx-auto" />
                    </button>
                    
                    <p className="text-xs text-slate-600 mt-1 truncate" title={preview.name}>
                      {preview.name}
                    </p>
                  </div>
                ))}

                {/* Upload Button (Edit Mode Only) */}
                {isEditMode && (
                  <div className="aspect-square border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={(e) => handleImageUpload(activeTab, e.target.files)}
                      className="hidden"
                      id={`upload-${activeTab}`}
                    />
                    <label 
                      htmlFor={`upload-${activeTab}`}
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-slate-500 hover:text-slate-600 p-4"
                    >
                      <Plus className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium text-center">Add Images</span>
                      <span className="text-xs text-center">Up to 5MB each</span>
                      <span className="text-xs text-center mt-1">Images & PDFs</span>
                    </label>
                  </div>
                )}

                {/* Show empty state if no documents for active tab */}
                {((activeTab === 'rc' && (!vehicle.rawData?.custrecord_rc_doc_attach || vehicle.rawData.custrecord_rc_doc_attach.length === 0)) ||
                  (activeTab === 'insurance' && (!vehicle.rawData?.custrecord_insurance_attachment_ag || vehicle.rawData.custrecord_insurance_attachment_ag.length === 0)) ||
                  (activeTab === 'permit' && (!vehicle.rawData?.custrecord_permit_attachment_ag || vehicle.rawData.custrecord_permit_attachment_ag.length === 0)) ||
                  (activeTab === 'puc' && (!vehicle.rawData?.custrecord_puc_attachment_ag || vehicle.rawData.custrecord_puc_attachment_ag.length === 0))) && (
                  <div className="col-span-full text-center py-8">
                    <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">No documents uploaded</p>
                    <p className="text-slate-500 text-sm">Documents will appear here when uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Driver Assignment - Simple Display */}
            {vehicle.rawData?.assignedDriver && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  Assigned Driver
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-600">Name</label>
                    <p className="text-xs font-semibold text-slate-800">
                      {vehicle.rawData?.assignedDriver?.custrecord_driver_name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">Mobile</label>
                    <p className="text-xs font-semibold text-slate-800">
                      {vehicle.rawData?.assignedDriver?.custrecord_driver_mobile_no || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">License</label>
                    <p className="text-xs font-semibold text-slate-800">
                      {vehicle.rawData?.assignedDriver?.custrecord_driving_license_no || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">Category</label>
                    <p className="text-xs font-semibold text-slate-800">
                      {vehicle.rawData?.assignedDriver?.custrecord_license_category_ag || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    vehicle.rawData?.assignedDriver?.approved_by_hq === 'approved' 
                      ? 'bg-green-100 text-green-700' 
                      : vehicle.rawData?.assignedDriver?.approved_by_hq === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {vehicle.rawData?.assignedDriver?.approved_by_hq === 'approved' 
                      ? 'Approved' 
                      : vehicle.rawData?.assignedDriver?.approved_by_hq === 'pending'
                      ? 'Pending Approval'
                      : 'Rejected'
                    }
                  </span>
                </div>
              </div>
            )}

            {/* No Driver Assigned State */}
            {!vehicle.rawData?.assignedDriver && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  Driver Assignment
                </h3>
                <div className="text-center py-2">
                  <User className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-600 font-medium">No driver assigned</p>
                  <p className="text-xs text-slate-500">Available for assignment</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            
            {/* Contact Persons */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-orange-600" />
                Contact Persons
              </h3>
              
              {vehicle.contactPersons && vehicle.contactPersons.length > 0 ? (
                <div className="space-y-2">
                  {vehicle.contactPersons.map((contact, index) => (
                    <div key={contact._id || index} className="bg-white rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{contact.name}</p>
                          <p className="text-sm text-slate-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {contact.phone}
                          </p>
                          <p className="text-xs text-slate-500">
                            Added: {formatDate(contact.addedDate)}
                          </p>
                        </div>
                        {/* No edit/delete buttons - only add functionality available */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No contacts configured</p>
                  <p className="text-slate-500 text-sm">Add emergency contacts for this vehicle</p>
                </div>
              )}
            </div>

            {/* System Information */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-600" />
                System Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600">Created By</label>
                  <p className="font-semibold text-slate-800">{vehicle.createdBy}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Created Date</label>
                  <p className="font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_datecreate_vehicle_master)}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Last Updated</label>
                  <p className="font-semibold text-slate-800">{formatDate(vehicle.rawData?.updatedAt)}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Trip Status</label>
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    {vehicle.rawData?.inTrip ? (
                      <><CheckCircle className="w-4 h-4 text-green-600" /> In Trip</>
                    ) : (
                      <><Clock className="w-4 h-4 text-slate-600" /> Not in Trip</>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Fitness Certificate</label>
                  <p className="font-semibold text-slate-800">
                    Valid until: {formatDate(vehicle.rawData?.custrecord_tms_vehicle_fit_cert_vld_upto)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Lightbox Modal */}
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-800">{selectedImage.fileName}</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="p-4">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.fileName}
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                />
              </div>
              <div className="flex items-center justify-between p-4 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  Uploaded: {formatDate(selectedImage.uploadedAt)}
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default VehicleDetailsPopup