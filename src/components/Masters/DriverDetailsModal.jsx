import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, User, Phone, FileText, Calendar, Car, UserCheck, Edit, Eye, Upload, Save, RotateCcw, Loader2 } from 'lucide-react'
import DriverService from '../../services/DriverService'

const DriverDetailsModal = ({ driver, onClose, onDriverUpdate }) => {
  if (!driver) return null

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false)
  const [editData, setEditData] = useState({
    phone: '',
    licenseExpiry: '',
    newImage: null,
    previewUrl: null
  })
  const [showImageControls, setShowImageControls] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Initialize edit data when driver changes
  useEffect(() => {
    if (driver) {
      setEditData({
        phone: driver.contact?.phone || '',
        licenseExpiry: driver.identification?.licenseExpiry || '',
        newImage: null,
        previewUrl: null
      })
    }
  }, [driver])

  const isLicenseExpired = new Date(driver.identification?.licenseExpiry) < new Date()
  const isLicenseExpiringSoon = new Date(driver.identification?.licenseExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  // Edit mode handlers
  const handleEditMode = () => {
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditData({
      phone: driver.contact?.phone || '',
      licenseExpiry: driver.identification?.licenseExpiry || '',
      newImage: null,
      previewUrl: null
    })
  }

  const handleSaveEdit = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      console.log('💾 Saving driver edit:', editData)
      
      // Prepare update data
      const updateData = {
        phone: editData.phone,
        licenseExpiry: editData.licenseExpiry,
        newImage: editData.newImage
      }
      
      console.log('📝 Update data being sent:', updateData)
      console.log('📝 newImage:', editData.newImage)
      console.log('📝 newImage type:', typeof editData.newImage)
      console.log('📝 newImage instanceof File:', editData.newImage instanceof File)
      
      // Call API to update driver
      const response = await DriverService.updateDriver(driver.id, updateData)
      
      if (response && response.driver) {
        console.log('✅ Driver updated successfully:', response)
        
        // Show success message
        setSuccess(true)
        
        // Update the driver data in parent component
        if (onDriverUpdate) {
          onDriverUpdate(response.driver)
        }
        
        // Close edit mode after a short delay
        setTimeout(() => {
          setIsEditMode(false)
          setSuccess(false)
        }, 2000)
      }
    } catch (error) {
      console.error('❌ Error updating driver:', error)
      setError(error.message || 'Failed to update driver. Please try again.')
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

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file)
      setEditData(prev => ({
        ...prev,
        newImage: file,
        previewUrl: previewUrl
      }))
    }
  }

  const handleRemoveImage = () => {
    setEditData(prev => ({
      ...prev,
      newImage: null,
      previewUrl: null
    }))
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  return (
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

      {/* Modal Content */}
      <motion.div
        className={`relative bg-white rounded-lg max-w-4xl w-full max-h-[95vh] border shadow-2xl transition-colors flex flex-col ${
          isEditMode 
            ? 'border-orange-200' 
            : 'border-slate-200'
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-800">{driver.name}</h2>
                {isEditMode && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                    Editing...
                  </span>
                )}
              </div>
              <p className="text-slate-600">
                {isEditMode ? 'Edit Driver Information' : 'Driver Details'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <button
                onClick={handleEditMode}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium shadow-sm"
              >
                <Edit className="w-4 h-4" />
                Modify
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6">
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
            <p className="text-green-700 mt-1">Driver updated successfully!</p>
          </div>
        )}

        {/* License Status Badge */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            isLicenseExpired 
              ? 'bg-red-100 text-red-800'
              : isLicenseExpiringSoon
              ? 'bg-orange-100 text-orange-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {isLicenseExpired ? 'License Expired' : isLicenseExpiringSoon ? 'License Expiring Soon' : 'License Valid'}
          </span>
        </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            {/* Driver Information */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                Driver Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Full Name:</span>
                  <span className="text-slate-800 font-medium">{driver.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Contact Number:</span>
                  {isEditMode ? (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="px-3 py-1 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                        placeholder="Enter phone number"
                      />
                    </div>
                  ) : (
                    <span className="text-slate-800 font-medium flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {driver.contact?.phone || 'N/A'}
                    </span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Number:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {driver.identification?.licenseNumber || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Type:</span>
                  <span className="text-slate-800 font-medium">
                    {driver.identification?.licenseType || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Start Date:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {driver.identification?.licenseStart || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Expiry:</span>
                  {isEditMode ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={editData.licenseExpiry}
                        onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                        className="px-3 py-1 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                      />
                    </div>
                  ) : (
                    <span className={`font-medium flex items-center gap-1 ${
                      isLicenseExpired ? 'text-red-600' : isLicenseExpiringSoon ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      <Calendar className="w-4 h-4" />
                      {driver.identification?.licenseExpiry || 'N/A'}
                    </span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Test Status:</span>
                  <span className={`font-medium ${
                    driver.rawData?.custrecord_driving_lca_test === 'passed' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {driver.rawData?.custrecord_driving_lca_test || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Created By:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <UserCheck className="w-4 h-4" />
                    {driver.rawData?.custrecord_create_by_driver_master || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - License Document and Vehicle Assignment */}
          <div className="space-y-6">
            {/* License Photo */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-600" />
                License Document
                {isEditMode && (
                  <span className="text-sm text-orange-600 font-normal">(Click to edit)</span>
                )}
              </h3>
              <div 
                className="flex items-center justify-center p-8 bg-white rounded-lg border border-slate-200 relative"
                onMouseEnter={() => setShowImageControls(true)}
                onMouseLeave={() => setShowImageControls(false)}
              >
                {(editData.previewUrl || (driver.rawData?.custrecord_driving_license_attachment && driver.rawData.custrecord_driving_license_attachment.length > 0)) ? (
                  <div className="text-center relative">
                    <div className="w-32 h-24 mx-auto mb-4 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden relative">
                      <img 
                        src={editData.previewUrl || driver.rawData.custrecord_driving_license_attachment[0]} 
                        alt="Driving License Document"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      
                      {/* Image Edit Controls */}
                      {isEditMode && (showImageControls || editData.newImage) && (
                        <div className="absolute top-1 right-1 flex gap-1">
                          <button
                            onClick={handleRemoveImage}
                            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                            title="Remove Image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <label className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg cursor-pointer">
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileInput}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm">
                      {editData.newImage ? 'New License Document (Preview)' : 'Driving License Document'}
                    </p>
                    {!isEditMode && (
                      <button 
                        onClick={() => window.open(driver.rawData.custrecord_driving_license_attachment[0], '_blank')}
                        className="mt-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        View Full Image
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    {isEditMode ? (
                      <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 hover:border-orange-400 transition-colors">
                        <Upload className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                        <p className="text-slate-600 text-sm mb-2">Upload License Document</p>
                        <label className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors text-sm font-medium cursor-pointer">
                          Choose File
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInput}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <>
                        <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-slate-100 flex items-center justify-center">
                          <FileText className="w-12 h-12 text-slate-400" />
                        </div>
                        <p className="text-slate-600 text-sm">No License Document Available</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Assignment */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-orange-600" />
                Vehicle Assignment
              </h3>
              <div className="space-y-3">
                {driver.assignedVehicles && driver.assignedVehicles.length > 0 ? (
                  driver.assignedVehicles.map((vehicle, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600">Vehicle {index + 1}:</span>
                        <span className="text-slate-800 font-medium flex items-center gap-1">
                          <Car className="w-4 h-4" />
                          {vehicle.vehicleNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Vehicle Type:</span>
                        <span className="text-slate-800 font-medium">{vehicle.vehicleType || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Plant:</span>
                        <span className="text-slate-800 font-medium">{vehicle.plant || 'N/A'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <Car className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>No vehicles assigned</p>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>
        </div>

        {/* Sticky Action Buttons - Only show Save/Cancel in edit mode */}
        {isEditMode && (
          <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 mt-auto">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg transition-colors font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default DriverDetailsModal
