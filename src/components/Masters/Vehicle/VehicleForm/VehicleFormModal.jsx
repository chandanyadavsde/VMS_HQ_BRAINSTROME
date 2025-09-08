import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Car, User, Calendar, FileText, Upload, CheckCircle } from 'lucide-react'
import VehicleService from '../../../../services/VehicleService.js'

const VehicleFormModal = ({
  isOpen,
  onClose,
  onCreateVehicle 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Required Fields
    custrecord_vehicle_number: '',
    custrecord_vehicle_type_ag: '',
    custrecord_driving_license_no: '',
    
    // Basic Information
    custrecord_vehicle_name_ag: '',
    custrecord_age_of_vehicle: '',
    custrecord_engine_number_ag: '',
    custrecord_chassis_number: '',
    
    // RC Certificate
    custrecord_rc_no: '',
    custrecord_rc_start_date: '',
    custrecord_rc_end_date: '',
    
    // Vendor & Owner
    custrecord_vendor_name_ag: '',
    custrecord_owner_name_ag: '',
    custrecord_owner_no_ag: '',
    
    // Insurance
    custrecord_insurance_company_name_ag: '',
    custrecord_insurance_number_ag: '',
    custrecord_insurance_start_date_ag: '',
    custrecord_insurance_end_date_ag: '',
    
    // PUC
    custrecord_puc_number: '',
    custrecord_puc_start_date_ag: '',
    custrecord_puc_end_date_ag: '',
    
    // Permit
    custrecord_permit_number_ag: '',
    custrecord_permit_start_date: '',
    custrecord_permit_end_date: '',
    
    // Fitness
    custrecord_tms_vehicle_fit_cert_vld_upto: '',
    
    // System Fields
    custrecord_vehicle_master_gps_available: false,
    currentPlant: '',
    custrecord_create_by: 'shekhar.deshmukh',
    
    
    // File Uploads
    custrecord_rc_doc_attach: [],
    custrecord_insurance_attachment_ag: [],
    custrecord_permit_attachment_ag: [],
    custrecord_puc_attachment_ag: [],
    custrecord_tms_vehicle_fit_cert_attach: []
  })

  const vehicleTypes = [
    { value: 'ODC', label: 'ODC' },
    { value: 'Lattice Tower', label: 'Lattice Tower' }
  ]

  const plants = [
    { value: 'pune', label: 'Pune' },
    { value: 'solapur', label: 'Solapur' },
    { value: 'surat', label: 'Surat' },
    { value: 'free', label: 'Free' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (field, files) => {
    const fileList = Array.from(files)
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ...fileList]
    }))
  }

  const removeFile = (field, fileIndex) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, index) => index !== fileIndex)
    }))
  }


  const fillTestData = () => {
    setFormData({
      custrecord_vehicle_number: 'MH14XX4448',
      custrecord_vehicle_type_ag: 'ODC',
      custrecord_driving_license_no: 'DL123456789',
      custrecord_vehicle_name_ag: 'Ashok Leyland 2000',
      custrecord_age_of_vehicle: '5 Years',
      custrecord_engine_number_ag: 'EN-987654',
      custrecord_chassis_number: 'CH-123456',
      custrecord_rc_no: 'RC-778899',
      custrecord_rc_start_date: '2023-03-01',
      custrecord_rc_end_date: '2025-06-01',
      custrecord_vendor_name_ag: 'ABC Logistics',
      custrecord_owner_name_ag: 'Ramesh',
      custrecord_owner_no_ag: '+91-9876543210',
      custrecord_insurance_company_name_ag: 'SBI Lombard',
      custrecord_insurance_number_ag: 'INS-552233',
      custrecord_insurance_start_date_ag: '2024-02-01',
      custrecord_insurance_end_date_ag: '2029-02-14',
      custrecord_puc_number: 'PUC-112233',
      custrecord_puc_start_date_ag: '2025-06-01',
      custrecord_puc_end_date_ag: '2025-12-01',
      custrecord_permit_number_ag: 'PERMIT1234',
      custrecord_permit_start_date: '2025-06-01',
      custrecord_permit_end_date: '2025-12-01',
      custrecord_tms_vehicle_fit_cert_vld_upto: '2027-05-31',
      custrecord_vehicle_master_gps_available: true,
      currentPlant: 'solapur',
      custrecord_create_by: 'shekhar.deshmukh',
      custrecord_rc_doc_attach: [],
      custrecord_insurance_attachment_ag: [],
      custrecord_permit_attachment_ag: [],
      custrecord_puc_attachment_ag: [],
      custrecord_tms_vehicle_fit_cert_attach: []
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      console.log('🚗 Submitting vehicle data:', formData)
      const response = await VehicleService.createVehicle(formData)
      console.log('✅ Vehicle created successfully:', response)
      
      // Reset form
      setFormData({
        custrecord_vehicle_number: '',
        custrecord_vehicle_type_ag: '',
        custrecord_driving_license_no: '',
        custrecord_vehicle_name_ag: '',
        custrecord_age_of_vehicle: '',
        custrecord_engine_number_ag: '',
        custrecord_chassis_number: '',
        custrecord_rc_no: '',
        custrecord_rc_start_date: '',
        custrecord_rc_end_date: '',
        custrecord_vendor_name_ag: '',
        custrecord_owner_name_ag: '',
        custrecord_owner_no_ag: '',
        custrecord_insurance_company_name_ag: '',
        custrecord_insurance_number_ag: '',
        custrecord_insurance_start_date_ag: '',
        custrecord_insurance_end_date_ag: '',
        custrecord_puc_number: '',
        custrecord_puc_start_date_ag: '',
        custrecord_puc_end_date_ag: '',
        custrecord_permit_number_ag: '',
        custrecord_permit_start_date: '',
        custrecord_permit_end_date: '',
        custrecord_tms_vehicle_fit_cert_vld_upto: '',
        custrecord_vehicle_master_gps_available: false,
        currentPlant: '',
        custrecord_create_by: 'shekhar.deshmukh',
        custrecord_rc_doc_attach: [],
        custrecord_insurance_attachment_ag: [],
        custrecord_permit_attachment_ag: [],
        custrecord_puc_attachment_ag: [],
        custrecord_tms_vehicle_fit_cert_attach: []
      })
      
      onClose()
    } catch (error) {
      console.error('❌ Error creating vehicle:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="bg-orange-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="w-6 h-6" />
              <h2 className="text-xl font-bold">Create New Vehicle</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fillTestData}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                Fill Test Data
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-orange-500" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Number *
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_vehicle_number}
                      onChange={(e) => handleInputChange('custrecord_vehicle_number', e.target.value)}
                      placeholder="e.g., MH14XX4448"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Type *
                    </label>
                    <select
                      value={formData.custrecord_vehicle_type_ag}
                      onChange={(e) => handleInputChange('custrecord_vehicle_type_ag', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="">Select Type</option>
                      {vehicleTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Driver License Number *
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_driving_license_no}
                      onChange={(e) => handleInputChange('custrecord_driving_license_no', e.target.value)}
                      placeholder="e.g., DL123456789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Name
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_vehicle_name_ag}
                      onChange={(e) => handleInputChange('custrecord_vehicle_name_ag', e.target.value)}
                      placeholder="e.g., Ashok Leyland 2000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age of Vehicle
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_age_of_vehicle}
                      onChange={(e) => handleInputChange('custrecord_age_of_vehicle', e.target.value)}
                      placeholder="e.g., 5 Years"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Engine Number
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_engine_number_ag}
                      onChange={(e) => handleInputChange('custrecord_engine_number_ag', e.target.value)}
                      placeholder="e.g., EN-987654"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chassis Number
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_chassis_number}
                      onChange={(e) => handleInputChange('custrecord_chassis_number', e.target.value)}
                      placeholder="e.g., CH-123456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plant Assignment
                    </label>
                    <select
                      value={formData.currentPlant}
                      onChange={(e) => handleInputChange('currentPlant', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Plant</option>
                      {plants.map(plant => (
                        <option key={plant.value} value={plant.value}>{plant.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* RC Certificate */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  RC Certificate
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RC Number
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_rc_no}
                      onChange={(e) => handleInputChange('custrecord_rc_no', e.target.value)}
                      placeholder="e.g., RC-778899"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RC Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.custrecord_rc_start_date}
                      onChange={(e) => handleInputChange('custrecord_rc_start_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RC End Date
                    </label>
                    <input
                      type="date"
                      value={formData.custrecord_rc_end_date}
                      onChange={(e) => handleInputChange('custrecord_rc_end_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Vendor & Owner */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Vendor & Owner Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor Name
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_vendor_name_ag}
                      onChange={(e) => handleInputChange('custrecord_vendor_name_ag', e.target.value)}
                      placeholder="e.g., ABC Logistics"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_owner_name_ag}
                      onChange={(e) => handleInputChange('custrecord_owner_name_ag', e.target.value)}
                      placeholder="e.g., Ramesh"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Phone
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_owner_no_ag}
                      onChange={(e) => handleInputChange('custrecord_owner_no_ag', e.target.value)}
                      placeholder="e.g., +91-9876543210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Insurance */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  Insurance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Company
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_insurance_company_name_ag}
                      onChange={(e) => handleInputChange('custrecord_insurance_company_name_ag', e.target.value)}
                      placeholder="e.g., SBI Lombard"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Number
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_insurance_number_ag}
                      onChange={(e) => handleInputChange('custrecord_insurance_number_ag', e.target.value)}
                      placeholder="e.g., INS-552233"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.custrecord_insurance_start_date_ag}
                      onChange={(e) => handleInputChange('custrecord_insurance_start_date_ag', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance End Date
                    </label>
                    <input
                      type="date"
                      value={formData.custrecord_insurance_end_date_ag}
                      onChange={(e) => handleInputChange('custrecord_insurance_end_date_ag', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* PUC */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  PUC (Pollution Under Control)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PUC Number
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_puc_number}
                      onChange={(e) => handleInputChange('custrecord_puc_number', e.target.value)}
                      placeholder="e.g., PUC-112233"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PUC Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.custrecord_puc_start_date_ag}
                      onChange={(e) => handleInputChange('custrecord_puc_start_date_ag', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PUC End Date
                    </label>
                    <input
                      type="date"
                      value={formData.custrecord_puc_end_date_ag}
                      onChange={(e) => handleInputChange('custrecord_puc_end_date_ag', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Permit */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  Permit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Permit Number
                    </label>
                    <input
                      type="text"
                      value={formData.custrecord_permit_number_ag}
                      onChange={(e) => handleInputChange('custrecord_permit_number_ag', e.target.value)}
                      placeholder="e.g., PERMIT1234"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Permit Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.custrecord_permit_start_date}
                      onChange={(e) => handleInputChange('custrecord_permit_start_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
          </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Permit End Date
                    </label>
                    <input
                      type="date"
                      value={formData.custrecord_permit_end_date}
                      onChange={(e) => handleInputChange('custrecord_permit_end_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Fitness Certificate */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  Fitness Certificate
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fitness Certificate Validity
                    </label>
                    <input
                      type="date"
                      value={formData.custrecord_tms_vehicle_fit_cert_vld_upto}
                      onChange={(e) => handleInputChange('custrecord_tms_vehicle_fit_cert_vld_upto', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.custrecord_vehicle_master_gps_available}
                        onChange={(e) => handleInputChange('custrecord_vehicle_master_gps_available', e.target.checked)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium text-gray-700">GPS Available</span>
                    </label>
                  </div>
          </div>
        </div>


              {/* File Uploads */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-orange-500" />
                  Document Attachments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* RC Documents */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RC Documents
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange('custrecord_rc_doc_attach', e.target.files)}
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      multiple
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    {formData.custrecord_rc_doc_attach.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formData.custrecord_rc_doc_attach.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                            <span className="truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile('custrecord_rc_doc_attach', index)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
        </div>

                  {/* Insurance Documents */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Insurance Documents
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange('custrecord_insurance_attachment_ag', e.target.files)}
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      multiple
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    {formData.custrecord_insurance_attachment_ag.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formData.custrecord_insurance_attachment_ag.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                            <span className="truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile('custrecord_insurance_attachment_ag', index)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Permit Documents */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permit Documents
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange('custrecord_permit_attachment_ag', e.target.files)}
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      multiple
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    {formData.custrecord_permit_attachment_ag.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formData.custrecord_permit_attachment_ag.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                            <span className="truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile('custrecord_permit_attachment_ag', index)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* PUC Documents */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PUC Documents
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange('custrecord_puc_attachment_ag', e.target.files)}
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      multiple
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    {formData.custrecord_puc_attachment_ag.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formData.custrecord_puc_attachment_ag.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                            <span className="truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile('custrecord_puc_attachment_ag', index)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fitness Documents */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fitness Documents
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange('custrecord_tms_vehicle_fit_cert_attach', e.target.files)}
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      multiple
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    {formData.custrecord_tms_vehicle_fit_cert_attach.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formData.custrecord_tms_vehicle_fit_cert_attach.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                            <span className="truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile('custrecord_tms_vehicle_fit_cert_attach', index)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
            )}
          </div>
        </div>
      </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Create Vehicle
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default VehicleFormModal