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
  Download,
  AlertCircle,
  Link
} from 'lucide-react'
import VehicleService from '../../services/VehicleService.js'
import DriverService from '../../services/DriverService.js'
import useDateValidation from '../../hooks/useDateValidation.js'

const VehicleDriverFormModal = ({
  isOpen,
  onClose,
  onCreateVehicle,
  onCreateDriver,
  currentTheme = 'teal'
}) => {
  // Date validation hook for vehicle documents
  const {
    dateValidation,
    updateStartDate,
    updateEndDate,
    getMinEndDate,
    isAllValid,
    getAllErrors,
    resetAllValidations
  } = useDateValidation()

  // Driver date validation state
  const [driverDateValidation, setDriverDateValidation] = useState({
    licenseExpiry: {
      isValid: true,
      error: ''
    }
  })

  const [formData, setFormData] = useState({
    // Vehicle Information
    vehicle: {
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
    },
    // Driver Information
    driver: {
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
    }
  })

  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset form for new vehicle + driver
      setFormData({
        vehicle: {
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
        },
        driver: {
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
        }
      })
      setCurrentStep(1)
      setError(null)
      setSuccess(false)
      resetAllValidations()
      setDriverDateValidation({
        licenseExpiry: {
          isValid: true,
          error: ''
        }
      })
    }
  }, [isOpen])

  const handleInputChange = (section, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [parent]: {
            ...prev[section][parent],
            [child]: value
          }
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }))
    }
  }

  // Handle vehicle date changes with validation
  const handleVehicleDateChange = (field, value, documentType) => {
    handleInputChange('vehicle', field, value)

    // Update validation based on field type
    if (field.includes('_start_date')) {
      updateStartDate(documentType, value)
    } else if (field.includes('_end_date')) {
      updateEndDate(documentType, value)
    }
  }

  // Handle driver date changes with validation
  const handleDriverDateChange = (field, value) => {
    handleInputChange('driver', field, value)

    // Validate driver license dates
    if (field === 'identification.licenseExpiry') {
      const validation = validateDriverLicenseExpiry(value, formData.driver.identification.licenseStartDate)
      setDriverDateValidation(prev => ({
        ...prev,
        licenseExpiry: validation
      }))
    } else if (field === 'identification.licenseStartDate') {
      // Re-validate expiry date when start date changes
      const validation = validateDriverLicenseExpiry(formData.driver.identification.licenseExpiry, value)
      setDriverDateValidation(prev => ({
        ...prev,
        licenseExpiry: validation
      }))
    }
  }

  // Driver license validation function
  const validateDriverLicenseExpiry = (expiryDate, startDate) => {
    if (!expiryDate || !startDate) {
      return { isValid: true, error: '' }
    }

    const start = new Date(startDate)
    const expiry = new Date(expiryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

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

  const handleFileUpload = (section, field, file) => {
    const existingFiles = Array.isArray(formData[section][field]) ? formData[section][field] : []
    const newFiles = [...existingFiles, file]
    
    handleInputChange(section, field, newFiles)
  }

  const handleFileRemove = (section, field, fileIndex) => {
    const existingFiles = Array.isArray(formData[section][field]) ? formData[section][field] : []
    const newFiles = existingFiles.filter((_, index) => index !== fileIndex)
    
    handleInputChange(section, field, newFiles)
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

  const handleDrop = (e, section, field) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive('')
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(section, field, e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e, section, field) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(section, field, e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    // Check all validations before submission
    if (!isAllValid() || !driverDateValidation.licenseExpiry.isValid) {
      const vehicleErrors = getAllErrors()
      const driverErrors = !driverDateValidation.licenseExpiry.isValid ? 
        [{ field: 'licenseExpiry', error: driverDateValidation.licenseExpiry.error }] : []
      const allErrors = [...vehicleErrors, ...driverErrors]
      setError(`Please fix validation errors: ${allErrors.map(e => e.error).join(', ')}`)
      setLoading(false)
      return
    }
    
    try {
      console.log('📝 Submitting vehicle + driver form data:', formData)
      
      // Create vehicle first
      const vehicleResponse = await VehicleService.createVehicle(formData.vehicle)
      console.log('✅ Vehicle created:', vehicleResponse)
      
      // Create driver
      const driverResponse = await DriverService.createDriver(formData.driver)
      console.log('✅ Driver created:', driverResponse)
      
      // Call parent callbacks if provided
      if (onCreateVehicle) {
        onCreateVehicle(vehicleResponse)
      }
      if (onCreateDriver) {
        onCreateDriver(driverResponse)
      }
      
      // Show success message
      setSuccess(true)
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose()
      }, 2000)
      
    } catch (error) {
      console.error('Error creating vehicle + driver:', error)
      const errorMessage = error.message || 'Failed to create vehicle and driver. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
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
          className="relative bg-white rounded-xl p-6 max-w-7xl w-full max-h-[95vh] overflow-y-auto border border-slate-200 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Link className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Add Vehicle + Driver
                </h2>
                <p className="text-slate-600">Create both vehicle and driver in one flow</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4">
              {[
                { step: 1, title: 'Vehicle Info', icon: <Car className="w-4 h-4" /> },
                { step: 2, title: 'Driver Info', icon: <User className="w-4 h-4" /> },
                { step: 3, title: 'Documents', icon: <FileText className="w-4 h-4" /> }
              ].map((step) => (
                <div key={step.step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step.step 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep >= step.step ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {step.step < 3 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      currentStep > step.step ? 'bg-purple-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
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
              <p className="text-green-700 mt-1">Vehicle and driver created successfully. Closing modal...</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Vehicle Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
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
                        value={formData.vehicle.custrecord_vehicle_number}
                        onChange={(e) => handleInputChange('vehicle', 'custrecord_vehicle_number', e.target.value.toUpperCase())}
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
                        value={formData.vehicle.custrecord_vehicle_type_ag}
                        onChange={(e) => handleInputChange('vehicle', 'custrecord_vehicle_type_ag', e.target.value)}
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
                        value={formData.vehicle.custrecord_vehicle_name_ag}
                        onChange={(e) => handleInputChange('vehicle', 'custrecord_vehicle_name_ag', e.target.value)}
                        placeholder="e.g., Tata 407, Mahindra Bolero"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Current Plant
                      </label>
                      <select
                        value={formData.vehicle.currentPlant}
                        onChange={(e) => handleInputChange('vehicle', 'currentPlant', e.target.value)}
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
              </motion.div>
            )}

            {/* Step 2: Driver Information */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-orange-500" />
                    Driver Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Driver Name *
                      </label>
                      <input
                        type="text"
                        value={formData.driver.name}
                        onChange={(e) => handleInputChange('driver', 'name', e.target.value)}
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
                        value={formData.driver.contact.phone}
                        onChange={(e) => handleInputChange('driver', 'contact.phone', e.target.value)}
                        placeholder="Enter mobile number"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        License Number *
                      </label>
                      <input
                        type="text"
                        value={formData.driver.identification.licenseNumber}
                        onChange={(e) => handleInputChange('driver', 'identification.licenseNumber', e.target.value)}
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
                        value={formData.driver.identification.licenseType}
                        onChange={(e) => handleInputChange('driver', 'identification.licenseType', e.target.value)}
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
                        value={formData.driver.identification.licenseStartDate}
                        onChange={(e) => handleDriverDateChange('identification.licenseStartDate', e.target.value)}
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
                        value={formData.driver.identification.licenseExpiry}
                        onChange={(e) => handleDriverDateChange('identification.licenseExpiry', e.target.value)}
                        min={formData.driver.identification.licenseStartDate || new Date().toISOString().split('T')[0]}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                          driverDateValidation.licenseExpiry.isValid === false 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-slate-300'
                        }`}
                        required
                      />
                      {driverDateValidation.licenseExpiry.isValid === false && (
                        <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{driverDateValidation.licenseExpiry.error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
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
                              value={formData.vehicle[section.fields.number] || ''}
                              onChange={(e) => handleInputChange('vehicle', section.fields.number, e.target.value)}
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
                              value={formData.vehicle[section.fields.company] || ''}
                              onChange={(e) => handleInputChange('vehicle', section.fields.company, e.target.value)}
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
                                value={formData.vehicle[section.fields.startDate] || ''}
                                onChange={(e) => handleVehicleDateChange(section.fields.startDate, e.target.value, section.id)}
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
                                value={formData.vehicle[section.fields.endDate] || ''}
                                onChange={(e) => handleVehicleDateChange(section.fields.endDate, e.target.value, section.id)}
                                min={getMinEndDate(section.id) || ''}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm ${
                                  dateValidation[section.id]?.isValid === false 
                                    ? 'border-red-300 bg-red-50' 
                                    : 'border-slate-300'
                                }`}
                              />
                              {dateValidation[section.id]?.isValid === false && (
                                <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>{dateValidation[section.id].error}</span>
                                </div>
                              )}
                            </div>
                          )}
                          {section.fields.validUpto && (
                            <div className="col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Valid Upto
                              </label>
                              <input
                                type="date"
                                value={formData.vehicle[section.fields.validUpto] || ''}
                                onChange={(e) => handleInputChange('vehicle', section.fields.validUpto, e.target.value)}
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
                          onDrop={(e) => handleDrop(e, 'vehicle', section.fields.attachment)}
                        >
                          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-600 text-sm mb-1">
                            Drop files here or{' '}
                            <label className="text-orange-600 cursor-pointer hover:underline">
                              browse
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileInput(e, 'vehicle', section.fields.attachment)}
                                className="hidden"
                                multiple
                              />
                            </label>
                          </p>
                          <p className="text-xs text-slate-500">JPG, PNG, PDF</p>
                        </div>

                        {/* Uploaded Files */}
                        {Array.isArray(formData.vehicle[section.fields.attachment]) && formData.vehicle[section.fields.attachment].length > 0 && (
                          <div className="mt-2 space-y-1">
                            {formData.vehicle[section.fields.attachment].map((file, index) => (
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
                                  onClick={() => handleFileRemove('vehicle', section.fields.attachment, index)}
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
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t border-slate-200">
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
              
              <div className="flex gap-3">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:bg-purple-300 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Create Vehicle + Driver
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default VehicleDriverFormModal
