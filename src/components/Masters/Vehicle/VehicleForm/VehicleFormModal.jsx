import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Car, 
  User, 
  Settings, 
  FileText, 
  Upload, 
  Shield, 
  FileCheck, 
  Truck,
  Hash,
  Building,
  Save,
  Eye,
  Download
} from 'lucide-react'
import VehicleService from '../../../../services/VehicleService.js'

const VehicleFormModal = ({
  isOpen,
  onClose,
  vehicle = null,
  onCreateVehicle,
  onUpdateVehicle,
  currentTheme = 'teal'
}) => {
  const [formData, setFormData] = useState({
    // Basic Information
    custrecord_vehicle_number: '',
    custrecord_vehicle_type_ag: '',
    custrecord_vehicle_name_ag: '',
    currentPlant: '',
    
    // Owner Information
    custrecord_owner_name_ag: '',
    custrecord_owner_no_ag: '',
    
    // Technical Details
    custrecord_chassis_number: '',
    custrecord_engine_number_ag: '',
    custrecord_age_of_vehicle: '',
    custrecord_vehicle_master_gps_available: false,
    
    // RC Document
    custrecord_rc_no: '',
    custrecord_rc_start_date: '',
    custrecord_rc_end_date: '',
    custrecord_rc_doc_attach: [],
    
    // Insurance
    custrecord_insurance_company_name_ag: '',
    custrecord_insurance_number_ag: '',
    custrecord_insurance_start_date_ag: '',
    custrecord_insurance_end_date_ag: '',
    custrecord_insurance_attachment_ag: [],
    
    // Permit
    custrecord_permit_number_ag: '',
    custrecord_permit_start_date: '',
    custrecord_permit_end_date: '',
    custrecord_permit_attachment_ag: [],
    
    // PUC
    custrecord_puc_number: '',
    custrecord_puc_start_date_ag: '',
    custrecord_puc_end_date_ag: '',
    custrecord_puc_attachment_ag: [],
    
    // Fitness Certificate
    custrecord_tms_vehicle_fit_cert_vld_upto: '',
    custrecord_vehicle_fit_cert_attachment_ag: [],
    
    // Additional fields
    custrecord_create_by: 'admin',
    approved_by_hq: 'pending'
  })

  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const isEditing = !!vehicle

  // Initialize form data when vehicle is provided
  useEffect(() => {
    if (vehicle) {
      // Ensure all file fields are arrays
      const vehicleData = {
        ...vehicle,
        custrecord_rc_doc_attach: Array.isArray(vehicle.custrecord_rc_doc_attach) ? vehicle.custrecord_rc_doc_attach : [],
        custrecord_insurance_attachment_ag: Array.isArray(vehicle.custrecord_insurance_attachment_ag) ? vehicle.custrecord_insurance_attachment_ag : [],
        custrecord_permit_attachment_ag: Array.isArray(vehicle.custrecord_permit_attachment_ag) ? vehicle.custrecord_permit_attachment_ag : [],
        custrecord_puc_attachment_ag: Array.isArray(vehicle.custrecord_puc_attachment_ag) ? vehicle.custrecord_puc_attachment_ag : [],
        custrecord_vehicle_fit_cert_attachment_ag: Array.isArray(vehicle.custrecord_vehicle_fit_cert_attachment_ag) ? vehicle.custrecord_vehicle_fit_cert_attachment_ag : []
      }
      setFormData(vehicleData)
    } else {
      // Reset form for new vehicle
      setFormData({
        custrecord_vehicle_number: '',
        custrecord_vehicle_type_ag: '',
        custrecord_vehicle_name_ag: '',
        currentPlant: '',
        custrecord_owner_name_ag: '',
        custrecord_owner_no_ag: '',
        custrecord_chassis_number: '',
        custrecord_engine_number_ag: '',
        custrecord_age_of_vehicle: '',
        custrecord_vehicle_master_gps_available: false,
        custrecord_rc_no: '',
        custrecord_rc_start_date: '',
        custrecord_rc_end_date: '',
        custrecord_rc_doc_attach: [],
        custrecord_insurance_company_name_ag: '',
        custrecord_insurance_number_ag: '',
        custrecord_insurance_start_date_ag: '',
        custrecord_insurance_end_date_ag: '',
        custrecord_insurance_attachment_ag: [],
        custrecord_permit_number_ag: '',
        custrecord_permit_start_date: '',
        custrecord_permit_end_date: '',
        custrecord_permit_attachment_ag: [],
        custrecord_puc_number: '',
        custrecord_puc_start_date_ag: '',
        custrecord_puc_end_date_ag: '',
        custrecord_puc_attachment_ag: [],
        custrecord_tms_vehicle_fit_cert_vld_upto: '',
        custrecord_vehicle_fit_cert_attachment_ag: [],
        custrecord_create_by: 'admin',
        approved_by_hq: 'pending'
      })
    }
    // Clear any errors and success when modal opens
    setError(null)
    setSuccess(false)
  }, [vehicle, isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (field, file) => {
    const existingFiles = Array.isArray(formData[field]) ? formData[field] : []
    const newFiles = [...existingFiles, file]
    
    setFormData(prev => ({
      ...prev,
      [field]: newFiles
    }))
  }

  const handleFileRemove = (field, fileIndex) => {
    const existingFiles = Array.isArray(formData[field]) ? formData[field] : []
    const newFiles = existingFiles.filter((_, index) => index !== fileIndex)
    
    setFormData(prev => ({
      ...prev,
      [field]: newFiles
    }))
  }

  const handleDrag = (e, field) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(field)
    } else if (e.type === "dragleave") {
      setDragActive('')
    }
  }

  const handleDrop = (e, field) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive('')
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(field, e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(field, e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      console.log('📝 Submitting vehicle form data:', formData)
      
      if (isEditing) {
        await onUpdateVehicle(vehicle.id, formData)
      } else {
        const response = await VehicleService.createVehicle(formData)
        // Call the parent's create callback if provided
        if (onCreateVehicle) {
          onCreateVehicle(response)
        }
      }
      
      // Show success message
      setSuccess(true)
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose()
      }, 1500)
      
    } catch (error) {
      console.error('Error saving vehicle:', error)
      const errorMessage = error.message || 'Failed to create vehicle. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Vehicle types and plants
  const vehicleTypes = [
    { value: 'ODC', label: 'ODC (Over Dimensional Cargo)' },
    { value: 'Lattice Tower', label: 'Lattice Tower' }
  ]

  const plants = [
    { value: 'pune', label: 'Pune' },
    { value: 'solapur', label: 'Solapur' },
    { value: 'surat', label: 'Surat' },
    { value: 'daman', label: 'Daman' },
    { value: 'free', label: 'Free (Not Assigned)' }
  ]

  // Document sections configuration
  const documentSections = [
    {
      id: 'rc',
      title: 'Registration Certificate (RC)',
      icon: <FileText className="w-5 h-5" />,
      color: 'blue',
      required: true,
      fields: {
        number: 'custrecord_rc_no',
        startDate: 'custrecord_rc_start_date',
        endDate: 'custrecord_rc_end_date',
        attachment: 'custrecord_rc_doc_attach'
      }
    },
    {
      id: 'insurance',
      title: 'Insurance',
      icon: <Shield className="w-5 h-5" />,
      color: 'green',
      required: true,
      fields: {
        company: 'custrecord_insurance_company_name_ag',
        number: 'custrecord_insurance_number_ag',
        startDate: 'custrecord_insurance_start_date_ag',
        endDate: 'custrecord_insurance_end_date_ag',
        attachment: 'custrecord_insurance_attachment_ag'
      }
    },
    {
      id: 'permit',
      title: 'Permit',
      icon: <FileCheck className="w-5 h-5" />,
      color: 'purple',
      required: false,
      fields: {
        number: 'custrecord_permit_number_ag',
        startDate: 'custrecord_permit_start_date',
        endDate: 'custrecord_permit_end_date',
        attachment: 'custrecord_permit_attachment_ag'
      }
    },
    {
      id: 'puc',
      title: 'Pollution Under Control (PUC)',
      icon: <FileCheck className="w-5 h-5" />,
      color: 'orange',
      required: true,
      fields: {
        number: 'custrecord_puc_number',
        startDate: 'custrecord_puc_start_date_ag',
        endDate: 'custrecord_puc_end_date_ag',
        attachment: 'custrecord_puc_attachment_ag'
      }
    },
    {
      id: 'fitness',
      title: 'Fitness Certificate',
      icon: <Truck className="w-5 h-5" />,
      color: 'indigo',
      required: false,
      fields: {
        validUpto: 'custrecord_tms_vehicle_fit_cert_vld_upto',
        attachment: 'custrecord_vehicle_fit_cert_attachment_ag'
      }
    }
  ]

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
          className="relative bg-white rounded-xl p-6 max-w-6xl w-full max-h-[95vh] overflow-y-auto border border-slate-200 shadow-2xl"
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
                <Car className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h2>
                <p className="text-slate-600">Enter vehicle information and documents</p>
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
              <p className="text-green-700 mt-1">Vehicle {isEditing ? 'updated' : 'created'} successfully. Closing modal...</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-orange-500" />
                Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    value={formData.custrecord_vehicle_number}
                    onChange={(e) => handleInputChange('custrecord_vehicle_number', e.target.value.toUpperCase())}
                    placeholder="e.g., MH12AB1234"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Vehicle Type *
                  </label>
                  <select
                    value={formData.custrecord_vehicle_type_ag}
                    onChange={(e) => handleInputChange('custrecord_vehicle_type_ag', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    {vehicleTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Vehicle Name / Model
                  </label>
                  <input
                    type="text"
                    value={formData.custrecord_vehicle_name_ag}
                    onChange={(e) => handleInputChange('custrecord_vehicle_name_ag', e.target.value)}
                    placeholder="e.g., Tata 407, Mahindra Bolero"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Plant
                  </label>
                  <select
                    value={formData.currentPlant}
                    onChange={(e) => handleInputChange('currentPlant', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="">Select Plant</option>
                    {plants.map(plant => (
                      <option key={plant.value} value={plant.value}>
                        {plant.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" />
                Owner Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={formData.custrecord_owner_name_ag}
                    onChange={(e) => handleInputChange('custrecord_owner_name_ag', e.target.value)}
                    placeholder="Owner's full name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Owner Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.custrecord_owner_no_ag}
                    onChange={(e) => handleInputChange('custrecord_owner_no_ag', e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-500" />
                Technical Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Chassis Number
                  </label>
                  <input
                    type="text"
                    value={formData.custrecord_chassis_number}
                    onChange={(e) => handleInputChange('custrecord_chassis_number', e.target.value.toUpperCase())}
                    placeholder="Vehicle chassis number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Engine Number
                  </label>
                  <input
                    type="text"
                    value={formData.custrecord_engine_number_ag}
                    onChange={(e) => handleInputChange('custrecord_engine_number_ag', e.target.value.toUpperCase())}
                    placeholder="Vehicle engine number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Vehicle Age
                  </label>
                  <input
                    type="text"
                    value={formData.custrecord_age_of_vehicle}
                    onChange={(e) => handleInputChange('custrecord_age_of_vehicle', e.target.value)}
                    placeholder="e.g., 5 years"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    GPS Availability
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gps"
                        checked={formData.custrecord_vehicle_master_gps_available === true}
                        onChange={() => handleInputChange('custrecord_vehicle_master_gps_available', true)}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-slate-700">GPS Available</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gps"
                        checked={formData.custrecord_vehicle_master_gps_available === false}
                        onChange={() => handleInputChange('custrecord_vehicle_master_gps_available', false)}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-slate-700">No GPS</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Vehicle Documents
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {documentSections.map((section) => (
                  <div key={section.id} className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`text-${section.color}-500`}>
                        {section.icon}
                      </div>
                      <h4 className="font-semibold text-slate-800">
                        {section.title}
                        {section.required && <span className="text-red-500 ml-1">*</span>}
                      </h4>
                    </div>
                    
                    {/* Document Number */}
                    {section.fields.number && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {section.title} Number
                        </label>
                        <input
                          type="text"
                          value={formData[section.fields.number] || ''}
                          onChange={(e) => handleInputChange(section.fields.number, e.target.value)}
                          placeholder={`Enter ${section.title.toLowerCase()} number`}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                        />
                      </div>
                    )}
                    
                    {/* Company Name (for insurance) */}
                    {section.fields.company && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Insurance Company
                        </label>
                        <input
                          type="text"
                          value={formData[section.fields.company] || ''}
                          onChange={(e) => handleInputChange(section.fields.company, e.target.value)}
                          placeholder="Enter insurance company name"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                        />
                      </div>
                    )}
                    
                    {/* Date Fields */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {section.fields.startDate && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={formData[section.fields.startDate] || ''}
                            onChange={(e) => handleInputChange(section.fields.startDate, e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                          />
                        </div>
                      )}
                      {section.fields.endDate && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={formData[section.fields.endDate] || ''}
                            onChange={(e) => handleInputChange(section.fields.endDate, e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                          />
                        </div>
                      )}
                      {section.fields.validUpto && (
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Valid Upto
                          </label>
                          <input
                            type="date"
                            value={formData[section.fields.validUpto] || ''}
                            onChange={(e) => handleInputChange(section.fields.validUpto, e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* File Upload */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors ${
                        dragActive === section.fields.attachment
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-slate-300 hover:border-orange-400'
                      }`}
                      onDragEnter={(e) => handleDrag(e, section.fields.attachment)}
                      onDragLeave={(e) => handleDrag(e, section.fields.attachment)}
                      onDragOver={(e) => handleDrag(e, section.fields.attachment)}
                      onDrop={(e) => handleDrop(e, section.fields.attachment)}
                    >
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 text-sm mb-1">
                        Drop files here or{' '}
                        <label className="text-orange-600 cursor-pointer hover:underline">
                          browse
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileInput(e, section.fields.attachment)}
                            className="hidden"
                            multiple
                          />
                        </label>
                      </p>
                      <p className="text-xs text-slate-500">JPG, PNG, PDF</p>
                    </div>
                    
                    {/* Uploaded Files */}
                    {Array.isArray(formData[section.fields.attachment]) && formData[section.fields.attachment].length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formData[section.fields.attachment].map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-slate-50 p-2 rounded border text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-orange-500" />
                              <span className="text-slate-700">
                                {file.name || `File ${index + 1}`}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileRemove(section.fields.attachment, index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                    {isEditing ? 'Update Vehicle' : 'Create Vehicle'}
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

export default VehicleFormModal