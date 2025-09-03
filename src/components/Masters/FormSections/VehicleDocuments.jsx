/**
 * Vehicle Documents Form Section
 * Step 2 for vehicle creation - document uploads
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Upload, 
  Calendar, 
  Shield, 
  FileCheck, 
  Truck,
  X,
  Eye,
  Download
} from 'lucide-react'

const VehicleDocuments = ({ formData, setFormData, errors = {} }) => {
  const [draggedOver, setDraggedOver] = useState(null)

  const updateVehicleData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        [field]: value
      }
    }))
  }

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
        attachment: 'custrecord_tms_vehicle_fit_cert_attach'
      }
    }
  ]

  const handleFileUpload = (field, files) => {
    // Simulate file upload - in real app, this would upload to S3
    const fileList = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      fileName: file.name,
      mimeType: file.type,
      uploadedAt: new Date()
    }))
    
    updateVehicleData(field, fileList)
  }

  const removeFile = (field, index) => {
    const currentFiles = formData.vehicle[field] || []
    const updatedFiles = currentFiles.filter((_, i) => i !== index)
    updateVehicleData(field, updatedFiles)
  }

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Vehicle Documents
        </h3>
        <p className="text-gray-600">
          Upload required documents for vehicle registration
        </p>
      </div>

      {/* Document Sections */}
      <div className="space-y-6">
        {documentSections.map((section) => (
          <DocumentSection
            key={section.id}
            section={section}
            formData={formData}
            updateVehicleData={updateVehicleData}
            onFileUpload={handleFileUpload}
            onFileRemove={removeFile}
            getColorClasses={getColorClasses}
            errors={errors}
            draggedOver={draggedOver}
            setDraggedOver={setDraggedOver}
          />
        ))}
      </div>

      {/* Info Card */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div>
            <h5 className="font-semibold text-yellow-900 mb-1">Document Guidelines</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Accepted formats: PDF, JPG, PNG (Max 5MB per file)</li>
              <li>• RC, Insurance, and PUC are mandatory documents</li>
              <li>• Ensure all documents are clear and readable</li>
              <li>• You can upload multiple files for each document type</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Document Section Component
const DocumentSection = ({ 
  section, 
  formData, 
  updateVehicleData, 
  onFileUpload, 
  onFileRemove, 
  getColorClasses,
  errors,
  draggedOver,
  setDraggedOver
}) => {
  const [isExpanded, setIsExpanded] = useState(section.required)
  
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDraggedOver(section.id)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDraggedOver(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDraggedOver(null)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileUpload(section.fields.attachment, files)
    }
  }

  return (
    <div className={`border-2 rounded-xl transition-all ${
      isExpanded ? `${getColorClasses(section.color)} border-opacity-100` : 'border-gray-200 bg-gray-50'
    }`}>
      {/* Section Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isExpanded ? `bg-${section.color}-100` : 'bg-gray-200'
          }`}>
            {section.icon}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              {section.title}
              {section.required && (
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                  Required
                </span>
              )}
            </h4>
            <p className="text-sm text-gray-600">
              {isExpanded ? 'Click to collapse' : 'Click to expand and add details'}
            </p>
          </div>
        </div>
        
        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4 space-y-4"
        >
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name (Insurance only) */}
            {section.fields.company && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Company
                </label>
                <input
                  type="text"
                  placeholder="Insurance company name"
                  value={formData.vehicle[section.fields.company] || ''}
                  onChange={(e) => updateVehicleData(section.fields.company, e.target.value)}
                  className="w-full px-3 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Number/ID */}
            {section.fields.number && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {section.title} Number
                </label>
                <input
                  type="text"
                  placeholder={`${section.title} number/ID`}
                  value={formData.vehicle[section.fields.number] || ''}
                  onChange={(e) => updateVehicleData(section.fields.number, e.target.value)}
                  className="w-full px-3 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Start Date */}
            {section.fields.startDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={formatDate(formData.vehicle[section.fields.startDate])}
                  onChange={(e) => updateVehicleData(section.fields.startDate, e.target.value)}
                  className="w-full px-3 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* End Date / Valid Upto */}
            {(section.fields.endDate || section.fields.validUpto) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {section.fields.endDate ? 'End Date' : 'Valid Upto'}
                </label>
                <input
                  type="date"
                  value={formatDate(formData.vehicle[section.fields.endDate || section.fields.validUpto])}
                  onChange={(e) => updateVehicleData(section.fields.endDate || section.fields.validUpto, e.target.value)}
                  className="w-full px-3 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="w-4 h-4 inline mr-1" />
              Upload Documents
            </label>
            
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                draggedOver === section.id
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => onFileUpload(section.fields.attachment, e.target.files)}
                className="hidden"
                id={`file-${section.id}`}
              />
              <label
                htmlFor={`file-${section.id}`}
                className="cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, JPG, PNG up to 5MB
                </p>
              </label>
            </div>

            {/* Uploaded Files */}
            {formData.vehicle[section.fields.attachment] && formData.vehicle[section.fields.attachment].length > 0 && (
              <div className="mt-4 space-y-2">
                <h5 className="text-sm font-medium text-gray-700">Uploaded Files:</h5>
                {formData.vehicle[section.fields.attachment].map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.fileName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(file.url)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onFileRemove(section.fields.attachment, index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default VehicleDocuments
