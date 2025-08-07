import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, User, CheckSquare, FileText, MapPin, Clock, AlertCircle, CheckCircle, XCircle, Truck, UserCheck, ClipboardCheck, Calendar, Image, FileText as DocumentIcon } from 'lucide-react'
import { getThemeColors } from '../utils/theme.js'

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg ${
        type === 'success' 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.3 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center gap-3">
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <XCircle className="w-5 h-5" />
        )}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}



// API Configuration
const API_BASE_URL = "http://localhost:5000/vms/vehicle/plant"

const ApprovalCard = ({ selectedPlant = 'all', currentTheme = 'teal' }) => {
  const [activeSection, setActiveSection] = useState(null)
  const [activeVehicle, setActiveVehicle] = useState(null)
  const [reviewMessage, setReviewMessage] = useState('')
  const [showPendingModal, setShowPendingModal] = useState(false)
  const [showApprovedModal, setShowApprovedModal] = useState(false)
  const [showRejectedModal, setShowRejectedModal] = useState(false)
  
  // Custom confirmation modal state
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [confirmationData, setConfirmationData] = useState(null)
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('')
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  
  // API-driven state
  const [pendingVehicles, setPendingVehicles] = useState([])
  const [approvedVehicles, setApprovedVehicles] = useState([])
  const [rejectedVehicles, setRejectedVehicles] = useState([])
  const [loading, setLoading] = useState({ pending: false, approved: false, rejected: false })
  const [error, setError] = useState({ pending: false, approved: false, rejected: false })
  
  const themeColors = getThemeColors(currentTheme)

  // Track driver approval status for fallback data
  const [driverApprovalStatus, setDriverApprovalStatus] = useState({})

  // Update driver approval status
  const updateDriverApprovalStatus = (driverId, status) => {
    setDriverApprovalStatus(prev => ({
      ...prev,
      [driverId]: status
    }))
  }

  // Get driver approval status for fallback data
  const getDriverApprovalStatus = (driverId) => {
    return driverApprovalStatus[driverId] || 'pending'
  }

  // Helper function to show toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
  }

  // Helper function to hide toast
  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' })
  }

  // API Service Functions
  const fetchVehicles = async (plant, status, page = 1, limit = 10) => {
    try {
      console.log(`Fetching ${status} vehicles for plant: ${plant}`)
      const response = await fetch(`${API_BASE_URL}/${plant}?status=${status}&page=${page}&limit=${limit}&includeDriver=true`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log(`Received ${status} data:`, data)
      return data
    } catch (error) {
      console.error(`Error fetching ${status} vehicles:`, error)
      throw error
    }
  }

  const fetchSectionData = async (status, plant = 'all') => {
    setLoading(prev => ({ ...prev, [status]: true }))
    setError(prev => ({ ...prev, [status]: false }))
    
    try {
      const data = await fetchVehicles(plant, status, 1, 10)
      const vehicles = data.vehicles || []
      
      switch (status) {
        case 'pending':
          setPendingVehicles(vehicles)
          break
        case 'approved':
          setApprovedVehicles(vehicles)
          break
        case 'rejected':
          setRejectedVehicles(vehicles)
          break
      }
    } catch (error) {
      setError(prev => ({ ...prev, [status]: true }))
      console.error(`Error fetching ${status} vehicles:`, error)
      
      // Add fallback data for testing
      const fallbackData = [
        {
          _id: `fallback-${status}-1`,
          custrecord_vehicle_number: `TEST-${status.toUpperCase()}-001`,
          currentPlant: plant,
          custrecord_vehicle_type_ag: 'Test Vehicle',
          custrecord_age_of_vehicle: '2 Years',
          custrecord_owner_name_ag: 'Test Owner',
          custrecord_owner_no_ag: '+91-9876543210',
          custrecord_chassis_number: 'CH-TEST-001',
          custrecord_engine_number_ag: 'EN-TEST-001',
          custrecord_rc_no: 'RC-TEST-001',
          custrecord_rc_start_date: '2023-01-01T00:00:00.000Z',
          custrecord_insurance_company_name_ag: 'Test Insurance',
          custrecord_insurance_number_ag: 'INS-TEST-001',
          custrecord_insurance_start_date_ag: '2024-01-01T00:00:00.000Z',
          custrecord_insurance_end_date_ag: '2029-01-01T00:00:00.000Z',
          custrecord_permit_start_date: '2024-06-01T00:00:00.000Z',
          custrecord_permit_end_date: '2024-12-31T00:00:00.000Z',
          custrecord_puc_number: 'PUC-TEST-001',
          custrecord_puc_start_date_ag: '2024-06-01T00:00:00.000Z',
          custrecord_puc_end_date_ag: '2024-12-31T00:00:00.000Z',
          custrecord_tms_vehicle_fit_cert_vld_upto: '2026-12-31T00:00:00.000Z',
          custrecord_vehicle_master_gps_available: true,
          custrecord_vendor_name_ag: { name: 'Test Vendor' },
          custrecord_create_by: 'test.user',
          custrecord_rc_doc_attach: [],
          custrecord_insurance_attachment_ag: [],
          custrecord_permit_attachment_ag: [],
          custrecord_puc_attachment_ag: [],
          custrecord_tms_vehicle_fit_cert_attach: [],
          assignedDriver: status === 'pending' ? {
            _id: "688b34f72c9c1645efc75b97",
            approved_by_hq: getDriverApprovalStatus("688b34f72c9c1645efc75b97"),
            custrecord_driver_name: "bunty singh",
            custrecord_driving_license_no: "LC1234754",
            custrecord_driving_license_s_date: "2022-07-31",
            custrecord_driver_license_e_date: "2028-07-31",
            custrecord_driving_license_attachment: [
              "https://vms-media-handle.s3.ap-south-1.amazonaws.com/vehicle_attachments/1753953527404-Screenshot (3).png"
            ],
            custrecord_license_category_ag: "Light Motor Vehicle",
            custrecord_driver_mobile_no: "1111111154",
            custrecord_create_by_driver_master: "shekhar.seshmukh",
            custrecord_driving_lca_test: "passed",
            fcm_token: "cHdpbmzAToaxhtZPdIpeEh:APA91bHIrLZ5v9gWgEx3W5pQfzE9C1YvK53Y1fXXOWLLEP1tW2P-vdJnHtV5T-t1l7zBwZqsT-9-vDcliqOAIKDKsiHoKkgVMCRzgqA5oxD1nLBwwiDcID4",
            createdAt: "2025-07-31T09:18:47.617Z",
            updatedAt: "2025-07-31T09:18:47.617Z"
          } : null,
          checklist: status === 'pending' ? {
            checklistItems: [
              {
                question: 'Safety equipment check',
                answer: 'Yes',
                comment: 'All equipment present'
              },
              {
                question: 'Overall condition check',
                answer: 'Yes',
                comment: 'Good condition'
              }
            ],
            date: '2025-07-23T10:20:33.388068',
            filledAt: '2025-07-23T04:52:46.821Z',
            filledBy: 'test.user',
            name: 'Test Checklist'
          } : null,
          approved_by_hq: status
        }
      ]
      
      switch (status) {
        case 'pending':
          setPendingVehicles(fallbackData)
          break
        case 'approved':
          setApprovedVehicles(fallbackData)
          break
        case 'rejected':
          setRejectedVehicles(fallbackData)
          break
      }
    } finally {
      setLoading(prev => ({ ...prev, [status]: false }))
    }
  }

  // Load data on component mount and when plant changes
  useEffect(() => {
    console.log('ApprovalCard: Loading data for plant:', selectedPlant)
    fetchSectionData('pending', selectedPlant)
    fetchSectionData('approved', selectedPlant)
    fetchSectionData('rejected', selectedPlant)
  }, [selectedPlant])

  // Helper function to render attachments
  const renderAttachments = (attachments, documentType) => {
    if (!attachments || attachments.length === 0) {
      return (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-sm">No attachments available</p>
        </div>
      )
    }

    return (
      <div className="mt-3">
        <label className="text-gray-700 text-sm font-medium">Attachments</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
          {attachments.map((doc, index) => {
            const isImage = doc.mimeType?.startsWith('image/')
            const isPDF = doc.mimeType === 'application/pdf'
            
            return (
              <div key={index} className="border border-orange-200/30 rounded-lg p-3 bg-white/60 backdrop-blur-sm shadow-sm">
                {isImage ? (
                  <div className="space-y-2">
                    <img 
                      src={doc.url} 
                      alt={doc.fileName}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-orange-200/20"
                      onClick={() => window.open(doc.url, '_blank')}
                    />
                    <p className="text-gray-700 text-xs truncate font-medium">{doc.fileName}</p>
                  </div>
                ) : isPDF ? (
                  <div className="space-y-2">
                    <div className="w-full h-32 bg-red-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-100 transition-colors border border-red-200"
                         onClick={() => window.open(doc.url, '_blank')}>
                      <div className="text-center">
                        <FileText className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <p className="text-red-600 text-xs font-medium">PDF Document</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-xs truncate font-medium">{doc.fileName}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-full h-32 bg-blue-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200"
                         onClick={() => window.open(doc.url, '_blank')}>
                      <div className="text-center">
                        <DocumentIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-blue-600 text-xs font-medium">Document</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-xs truncate font-medium">{doc.fileName}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Helper function to check if vehicle approval is allowed
  const isVehicleApprovalAllowed = (vehicle) => {
    // If no driver assigned, don't allow vehicle approval
    if (!vehicle.assignedDriver) return false
    
    // If driver is approved, allow vehicle approval
    if (vehicle.assignedDriver.approved_by_hq === 'approved') return true
    
    // If driver is pending or rejected, don't allow vehicle approval
    return false
  }

  // Helper function to get driver icon colors based on approval status
  const getDriverIconColor = (vehicle) => {
    if (!vehicle.assignedDriver) {
      return {
        icon: 'text-gray-400',
        background: 'bg-gray-500/20'
      }
    }
    
    switch (vehicle.assignedDriver.approved_by_hq) {
      case 'approved':
        return {
          icon: 'text-green-400',
          background: 'bg-green-500/20'
        }
      case 'rejected':
        return {
          icon: 'text-red-400',
          background: 'bg-red-500/20'
        }
      case 'pending':
      default:
        return {
          icon: 'text-yellow-400',
          background: 'bg-yellow-500/20'
        }
    }
  }

  // Helper function to get driver status text
  const getDriverStatusText = (vehicle) => {
    if (!vehicle.assignedDriver) {
      return 'Not Available'
    }
    
    switch (vehicle.assignedDriver.approved_by_hq) {
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      case 'pending':
      default:
        return 'Pending'
    }
  }

  // Helper function to get approval button state
  const getApprovalButtonState = (vehicle, section) => {
    if (section === 'vehicle') {
      return {
        disabled: !isVehicleApprovalAllowed(vehicle),
        message: !isVehicleApprovalAllowed(vehicle) 
          ? (vehicle.assignedDriver ? 'Driver must be approved first' : 'No driver assigned')
          : 'Approve Vehicle Details'
      }
    }
    return {
      disabled: false,
      message: section === 'driver' ? 'Approve Driver Details' : 'Approve'
    }
  }

  // Helper function to get status background color
  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-200'
      case 'approved':
        return 'bg-green-500/20 text-green-200'
      case 'rejected':
        return 'bg-red-500/20 text-red-200'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  // Helper function to render a single card
  const renderCard = (vehicle, index, sectionType) => (
    <motion.div key={vehicle._id || `${sectionType}-${index}`}
      className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 cursor-pointer overflow-hidden border border-orange-200/30 shadow-lg hover:shadow-xl"
      whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Enhanced Texture Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-transparent to-green-50/40 opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/20 via-transparent to-purple-50/20 opacity-40"></div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></div>
              <h3 className="text-lg font-bold text-gray-900">{vehicle.custrecord_vehicle_number}</h3>
            </div>
            <p className="text-xs text-gray-600 flex items-center gap-1.5">
              <span className="w-0.5 h-0.5 rounded-full bg-gray-400"></span>
              {vehicle.custrecord_vehicle_type_ag} • {vehicle.currentPlant}
            </p>
          </div>
          
          {/* Compact Status Badge */}
          <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${
            sectionType === 'pending' ? 'bg-orange-100 text-orange-800 border border-orange-300 shadow-orange-100' :
            sectionType === 'approved' ? 'bg-green-100 text-green-800 border border-green-300 shadow-green-100' :
            'bg-red-100 text-red-800 border border-red-300 shadow-red-100'
          }`}>
            <div className="flex items-center gap-1">
              <div className={`w-1 h-1 rounded-full ${
                sectionType === 'pending' ? 'bg-orange-500' :
                sectionType === 'approved' ? 'bg-green-500' :
                'bg-red-500'
              }`}></div>
            {vehicle.approved_by_hq || sectionType}
            </div>
          </div>
        </div>

        {/* Compact Sub-Cards Grid */}
        <div className="grid grid-cols-1 gap-3 flex-1">
          {/* Vehicle Details Sub-Card */}
          <motion.div
            className={`relative p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-blue-200/30 cursor-pointer shadow-sm ${
              vehicle.custrecord_vehicle_number ? 'hover:bg-white hover:shadow-md hover:border-blue-300' : 'bg-gray-100/50'
            }`}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 12px 24px rgba(0,0,0,0.1)"
            }}
            onClick={() => {
              setActiveVehicle(vehicle._id || `${sectionType}-${index}`)
              setActiveSection('vehicle')
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/20 shadow-sm">
                <div className="text-blue-600">
                  <Truck className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-gray-900 font-semibold text-sm mb-0.5">Vehicle Details</h4>
                <p className="text-gray-600 text-xs">{vehicle.custrecord_vehicle_number}</p>
              </div>
              <div className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-medium">Available</div>
            </div>
          </motion.div>

          {/* Driver Details Sub-Card */}
          <motion.div
            className={`relative p-3 rounded-xl bg-white/90 backdrop-blur-sm border cursor-pointer shadow-sm ${
              vehicle.assignedDriver ? 'hover:bg-white hover:shadow-md' : 'bg-gray-100/50'
            } ${
              (() => {
                const driverStatus = getDriverStatusText(vehicle)
                const isApproved = driverStatus === 'Approved'
                const isRejected = driverStatus === 'Rejected'
                const isPending = driverStatus === 'Pending'
                
                return isApproved ? 'border-green-200/30 hover:border-green-300' :
                       isRejected ? 'border-red-200/30 hover:border-red-300' :
                       isPending ? 'border-orange-200/30 hover:border-orange-300' :
                       'border-gray-200/30'
              })()
            }`}
            whileHover={vehicle.assignedDriver ? { 
              scale: 1.02,
              boxShadow: "0 12px 24px rgba(0,0,0,0.1)"
            } : {}}
            onClick={() => {
              if (vehicle.assignedDriver) {
                setActiveVehicle(vehicle._id || `${sectionType}-${index}`)
                setActiveSection('driver')
              }
            }}
          >
            <div className="flex items-center gap-2.5">
              {(() => {
                const driverStatus = getDriverStatusText(vehicle)
                const isApproved = driverStatus === 'Approved'
                const isRejected = driverStatus === 'Rejected'
                const isPending = driverStatus === 'Pending'
                
                return (
                  <>
                    <div className={`p-2 rounded-xl shadow-sm ${
                      isApproved ? 'bg-green-500/20' :
                      isRejected ? 'bg-red-500/20' :
                      isPending ? 'bg-orange-500/20' :
                      'bg-gray-500/20'
                    }`}>
                      <div className={`${
                        isApproved ? 'text-green-600' :
                        isRejected ? 'text-red-600' :
                        isPending ? 'text-orange-600' :
                        'text-gray-400'
                      }`}>
                        <User className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-semibold text-sm mb-0.5">Driver Details</h4>
                      <p className="text-gray-600 text-xs">
                        {vehicle.assignedDriver ? vehicle.assignedDriver.custrecord_driver_name : 'No Driver Available'}
                      </p>
                    </div>
                    <div className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                      isApproved ? 'bg-green-50 text-green-700 border border-green-200' :
                      isRejected ? 'bg-red-50 text-red-700 border border-red-200' :
                      isPending ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                      'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}>
                      {driverStatus}
                    </div>
                  </>
                )
              })()}
            </div>
          </motion.div>

          {/* Checklist Sub-Card */}
          <motion.div
            className={`relative p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-purple-200/30 cursor-pointer shadow-sm ${
              vehicle.checklist && vehicle.checklist.checklistItems ? 'hover:bg-white hover:shadow-md hover:border-purple-300' : 'bg-gray-100/50'
            }`}
            whileHover={vehicle.checklist && vehicle.checklist.checklistItems ? { 
              scale: 1.02,
              boxShadow: "0 12px 24px rgba(0,0,0,0.1)"
            } : {}}
            onClick={() => {
              if (vehicle.checklist && vehicle.checklist.checklistItems) {
                setActiveVehicle(vehicle._id || `${sectionType}-${index}`)
                setActiveSection('checklist')
              }
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl shadow-sm ${
                vehicle.checklist && vehicle.checklist.checklistItems ? 'bg-purple-500/20' : 'bg-gray-500/20'
              }`}>
                <div className={vehicle.checklist && vehicle.checklist.checklistItems ? 'text-purple-600' : 'text-gray-400'}>
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-gray-900 font-semibold text-sm mb-0.5">Checklist</h4>
                <p className="text-gray-600 text-xs">
                  {vehicle.checklist && vehicle.checklist.checklistItems ? 'Checklist Completed' : 'No Checklist Done'}
                </p>
              </div>
              <div className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                vehicle.checklist && vehicle.checklist.checklistItems ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                {vehicle.checklist && vehicle.checklist.checklistItems ? 'Available' : 'Not Available'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )

  // Helper function to render a section
  const renderSection = (title, vehicles, modalState, setModalState, sectionType) => {
    const isLoading = loading[sectionType]
    const hasError = error[sectionType]
    
    return (
      <div className="w-full mb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {/* Section Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${
                sectionType === 'pending' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                sectionType === 'approved' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                'bg-gradient-to-br from-red-500 to-red-600'
              }`}>
                {sectionType === 'pending' && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {sectionType === 'approved' && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {sectionType === 'rejected' && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              
              {/* Section Title and Info */}
              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                  <p className={`text-xs font-medium ${
                    sectionType === 'pending' ? 'text-orange-600' :
                    sectionType === 'approved' ? 'text-green-600' :
                    'text-red-600'
                  }`}>
                    {sectionType === 'pending' ? 'Awaiting approval' :
                     sectionType === 'approved' ? 'Successfully approved' :
                     'Rejected vehicles'}
                  </p>
                </div>
                
                {/* Item Count Badge */}
                <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  sectionType === 'pending' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                  sectionType === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                  'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {vehicles.length} {vehicles.length === 1 ? 'item' : 'items'}
                </div>
              </div>
            </div>
            
            {vehicles.length > 4 && (
              <motion.button
                className="px-4 py-2 bg-white/90 backdrop-blur-sm border border-orange-200/50 rounded-lg text-gray-700 text-sm font-semibold hover:bg-white hover:shadow-md transition-all shadow-sm hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalState(true)}
              >
                View All ({vehicles.length})
              </motion.button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-64 bg-white/5 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="text-center py-8">
              <div className="text-red-400 mb-2">Failed to load {sectionType} vehicles</div>
              <button 
                onClick={() => fetchSectionData(sectionType, selectedPlant)}
                className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 hover:bg-red-500/30"
              >
                Retry
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {!isLoading && !hasError && (
            <>
              {vehicles.length === 0 ? (
                <div className="w-full">
                  {renderEmptyStateCard(title, sectionType)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {vehicles.slice(0, 4).map((vehicle, index) => 
                  renderCard(vehicle, index, sectionType)
              )}
            </div>
              )}
            </>
          )}

          {/* View All Modal */}
          <AnimatePresence>
            {modalState && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute inset-0 bg-black/60 backdrop-blur-md"
                  onClick={() => setModalState(false)}
                />
                <motion.div
                  className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-[95vw] w-full max-h-[90vh] overflow-hidden border border-orange-200/30 shadow-2xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  {/* Enhanced Texture Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-transparent to-green-50/40 opacity-60"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/20 via-transparent to-purple-50/20 opacity-30"></div>
                  
                  {/* Modal Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Enhanced Modal Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                          sectionType === 'pending' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                          sectionType === 'approved' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                          'bg-gradient-to-br from-red-500 to-red-600'
                        }`}>
                          {sectionType === 'pending' && (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {sectionType === 'approved' && (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {sectionType === 'rejected' && (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900">{title} - All Vehicles</h3>
                          <p className={`text-sm font-medium ${
                            sectionType === 'pending' ? 'text-orange-600' :
                            sectionType === 'approved' ? 'text-green-600' :
                            'text-red-600'
                          }`}>
                            {vehicles.filter(vehicle => 
                              vehicle.custrecord_vehicle_number?.toLowerCase().includes(searchTerm.toLowerCase())
                            ).length} of {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} found
                          </p>
                        </div>
                      </div>
                    <button
                        onClick={() => {
                          setModalState(false)
                          setSearchTerm('') // Clear search when modal closes
                        }}
                        className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-orange-200/30 hover:bg-white hover:shadow-lg transition-all shadow-sm"
                      >
                        <XCircle className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>

                    {/* Enhanced Search Box */}
                    <div className="mb-8">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      <input
                        type="text"
                          placeholder="Search by vehicle number..."
                          value={searchTerm}
                          className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-orange-200/30 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                          onChange={(e) => {
                            setSearchTerm(e.target.value)
                          }}
                        />
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                    </div>
                  </div>

                    {/* Enhanced Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 overflow-y-auto max-h-[65vh] pr-2">
                      {vehicles
                        .filter(vehicle => 
                          vehicle.custrecord_vehicle_number?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((vehicle, index) => 
                      renderCard(vehicle, index, sectionType)
                    )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Helper function to render empty state card
  const renderEmptyStateCard = (title, sectionType) => {
    const getEmptyStateData = () => {
      switch (sectionType) {
        case 'pending':
          return {
            icon: <Clock className="w-6 h-6" />,
            message: "All caught up!",
            subtitle: "No pending approvals at the moment",
            color: "orange",
            gradient: "from-orange-50/40 via-transparent to-orange-50/20"
          }
        case 'approved':
          return {
            icon: <CheckCircle className="w-6 h-6" />,
            message: "No approved items",
            subtitle: "Approved items will appear here",
            color: "green",
            gradient: "from-green-50/40 via-transparent to-green-50/20"
          }
        case 'rejected':
          return {
            icon: <XCircle className="w-6 h-6" />,
            message: "No rejected items",
            subtitle: "Rejected items will appear here",
            color: "red",
            gradient: "from-red-50/40 via-transparent to-red-50/20"
          }
        default:
          return {
            icon: <FileText className="w-6 h-6" />,
            message: "No items",
            subtitle: "Items will appear here",
            color: "gray",
            gradient: "from-gray-50/40 via-transparent to-gray-50/20"
          }
      }
    }

    const emptyData = getEmptyStateData()
    const colorClasses = {
      orange: "bg-orange-500/20 text-orange-600 border border-orange-200/30",
      green: "bg-green-500/20 text-green-600 border border-green-200/30", 
      red: "bg-red-500/20 text-red-600 border border-red-200/30",
      gray: "bg-gray-500/20 text-gray-600 border border-gray-200/30"
    }

    return (
      <motion.div
        className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 cursor-pointer overflow-hidden border shadow-lg hover:shadow-xl w-full"
        style={{ 
          borderColor: sectionType === 'pending' ? 'rgba(251, 146, 60, 0.3)' :
                      sectionType === 'approved' ? 'rgba(34, 197, 94, 0.3)' :
                      sectionType === 'rejected' ? 'rgba(239, 68, 68, 0.3)' :
                      'rgba(156, 163, 175, 0.3)'
        }}
        whileHover={{ scale: 1.01, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Enhanced Texture Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${emptyData.gradient} opacity-60`}></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/10 via-transparent to-purple-50/10 opacity-30"></div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          {/* Enhanced Icon */}
          <div className={`p-4 rounded-xl ${colorClasses[emptyData.color]} shadow-sm mb-6`}>
            <div className="flex items-center justify-center">
              {emptyData.icon}
            </div>
          </div>
          
          {/* Enhanced Message */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">{emptyData.message}</h3>
            <p className="text-gray-600 text-sm">{emptyData.subtitle}</p>
          </div>
          
          {/* Subtle Animation */}
          <motion.div 
            className="mt-6 w-16 h-1 rounded-full bg-gradient-to-r from-orange-400 to-green-400"
            animate={{ 
              scaleX: [0.8, 1, 0.8],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getDocumentStatus = (endDate) => {
    if (!endDate) return 'pending'
    const today = new Date()
    const end = new Date(endDate)
    if (end < today) return 'expired'
    if (end < new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) return 'expiring'
    return 'valid'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid': return 'text-emerald-400'
      case 'expired': return 'text-red-400'
      case 'expiring': return 'text-yellow-400'
      case 'pending': return 'text-amber-400'
      default: return 'text-slate-400'
    }
  }

  // Driver Approval API Function
  const callDriverApprovalAPI = async (driverId, action, reviewMessage) => {
    try {
      console.log(`Calling driver approval API for driver: ${driverId}, action: ${action}`)
      
      const requestBody = {
        approved_by_hq: action, // "approved" or "rejected"
        approvalMeta: {
          reviewer: "hq.admin",
          reviewedAt: new Date().toISOString(),
          reviewMessage: reviewMessage || ""
        }
      }
      
      const response = await fetch(`http://localhost:5000/vms/driver-master/approval/${driverId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Driver approval API response:', data)
      
      return { success: true, data }
    } catch (error) {
      console.error('Driver approval API error:', error)
      return { success: false, error: error.message }
    }
  }

  // Vehicle Approval API Function
  const callVehicleApprovalAPI = async (vehicleId, action, reviewMessage) => {
    try {
      console.log(`Calling vehicle approval API for vehicle: ${vehicleId}, action: ${action}`)
      
      const requestBody = {
        approved_by_hq: action, // "approved" or "rejected"
        approvalMeta: {
          reviewer: "hq.admin",
          reviewedAt: new Date().toISOString(),
          reviewMessage: reviewMessage || ""
        }
      }
      
      const response = await fetch(`http://localhost:5000/vms/vehicle-master/approval/${vehicleId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Vehicle approval API response:', data)
      
      return { success: true, data }
    } catch (error) {
      console.error('Vehicle approval API error:', error)
      return { success: false, error: error.message }
    }
  }

  // Custom confirmation modal component
  const ConfirmationModal = ({ isOpen, onConfirm, onCancel, title, message, action }) => {
    if (!isOpen) return null

    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onCancel}
        />
        <motion.div
          className="relative bg-slate-900/95 rounded-3xl p-6 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-300 mb-6">{message}</p>
            
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-4 py-2 font-medium rounded-xl transition-colors ${
                  action === 'approved' 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {action === 'approved' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Update local state with API response data
  const updateLocalDriverStatusWithResponse = (vehicleId, apiResponse) => {
    console.log(`Updating local state with API response: Vehicle ${vehicleId}`)
    
    if (!apiResponse.driver) {
      console.error('No driver data in API response')
      return
    }
    
    const updatedDriver = apiResponse.driver
    
    // Update in all arrays where the vehicle might exist
    const updateArray = (vehicles, setVehicles) => {
      setVehicles(prev => prev.map(vehicle => {
        if (vehicle._id === vehicleId || vehicle.custrecord_vehicle_number === vehicleId) {
          return {
            ...vehicle,
            assignedDriver: vehicle.assignedDriver ? {
              ...vehicle.assignedDriver,
              ...updatedDriver // Use complete API response data
            } : updatedDriver
          }
        }
        return vehicle
      }))
    }
    
    // Update all three arrays
    updateArray(pendingVehicles, setPendingVehicles)
    updateArray(approvedVehicles, setApprovedVehicles)
    updateArray(rejectedVehicles, setRejectedVehicles)
    
    console.log('Local state updated with API response data')
  }

  // Update local state immediately after driver approval
  const updateLocalDriverStatus = (vehicleId, driverId, newStatus) => {
    console.log(`Updating local state: Vehicle ${vehicleId}, Driver ${driverId}, Status ${newStatus}`)
    
    // Update in all arrays where the vehicle might exist
    const updateArray = (vehicles, setVehicles) => {
      setVehicles(prev => prev.map(vehicle => {
        if (vehicle._id === vehicleId || vehicle.custrecord_vehicle_number === vehicleId) {
          return {
            ...vehicle,
            assignedDriver: vehicle.assignedDriver ? {
              ...vehicle.assignedDriver,
              approved_by_hq: newStatus
            } : null
          }
        }
        return vehicle
      }))
    }
    
    // Update all three arrays
    updateArray(pendingVehicles, setPendingVehicles)
    updateArray(approvedVehicles, setApprovedVehicles)
    updateArray(rejectedVehicles, setRejectedVehicles)
    
    console.log('Local state updated successfully')
  }

  // Handle confirmation modal actions
  const handleConfirmationConfirm = async () => {
    if (!confirmationData) return
    
    const { vehicleId, section, action, driverName } = confirmationData
    
    // Find the vehicle
    const vehicle = [...pendingVehicles, ...approvedVehicles, ...rejectedVehicles]
      .find(v => v._id === vehicleId || v.custrecord_vehicle_number === vehicleId)
    
    if (!vehicle || !vehicle.assignedDriver) return
    
    // Close confirmation modal
    setShowConfirmationModal(false)
    setConfirmationData(null)
    
    // Call API based on section
    let result
    if (section === 'driver') {
      result = await callDriverApprovalAPI(
        vehicle.assignedDriver._id, 
        action, 
        reviewMessage
      )
    } else if (section === 'vehicle') {
      result = await callVehicleApprovalAPI(
        vehicleId, 
        action, 
        reviewMessage
      )
    }
    
    if (result.success) {
      // Update local state with API response data
      if (section === 'driver') {
        updateLocalDriverStatusWithResponse(vehicleId, result.data)
        updateDriverApprovalStatus(vehicle.assignedDriver._id, action)
        showToast(`Driver ${driverName} ${action} successfully!`, 'success')
      } else if (section === 'vehicle') {
        updateLocalVehicleStatusWithResponse(vehicleId, result.data)
        showToast(`Vehicle ${confirmationData.vehicleName} ${action} successfully!`, 'success')
      }
      
      // Clear modal first
      setActiveSection(null)
      setActiveVehicle(null)
      setReviewMessage('')
    } else {
      // Show error toast
      const sectionName = section === 'driver' ? 'driver' : 'vehicle'
      showToast(`Failed to ${action} ${sectionName}: ${result.error}`, 'error')
    }
  }

  const handleConfirmationCancel = () => {
    setShowConfirmationModal(false)
    setConfirmationData(null)
  }

  // Enhanced handleApprovalAction with custom confirmation
  const handleApprovalAction = async (vehicleId, section, action) => {
    // Find the vehicle
    const vehicle = [...pendingVehicles, ...approvedVehicles, ...rejectedVehicles]
      .find(v => v._id === vehicleId || v.custrecord_vehicle_number === vehicleId)
    
    if (!vehicle) {
      console.error('Vehicle not found for approval action')
      return
    }

    // Handle driver approval/rejection
    if (section === 'driver' && vehicle.assignedDriver) {
      // Show custom confirmation modal
      setConfirmationData({
        vehicleId,
        section,
        action,
        driverName: vehicle.assignedDriver.custrecord_driver_name
      })
      setShowConfirmationModal(true)
      return
    }

    // Handle vehicle approval/rejection
    if (section === 'vehicle') {
      // Check if vehicle approval is allowed
      if (!isVehicleApprovalAllowed(vehicle)) {
        const message = !vehicle.assignedDriver 
          ? 'No driver assigned - cannot approve vehicle'
          : vehicle.assignedDriver.approved_by_hq === 'pending'
            ? 'Driver must be approved first'
            : 'Driver must be approved first'
        
        showToast(message, 'error')
        return
      }
      
      // Show custom confirmation modal for vehicle
      setConfirmationData({
        vehicleId,
        section,
        action,
        vehicleName: vehicle.custrecord_vehicle_number
      })
      setShowConfirmationModal(true)
      return
    }
  }

  // Force refresh data after driver approval
  const forceRefreshData = async () => {
    console.log('Force refreshing all data...')
    
    // Clear existing data first
    setPendingVehicles([])
    setApprovedVehicles([])
    setRejectedVehicles([])
    
    // Force fresh API calls
    try {
      await Promise.all([
        fetchSectionData('pending', selectedPlant),
        fetchSectionData('approved', selectedPlant),
        fetchSectionData('rejected', selectedPlant)
      ])
      console.log('Data refresh completed')
    } catch (error) {
      console.error('Error during force refresh:', error)
    }
  }

  // Update local state with vehicle API response data
  const updateLocalVehicleStatusWithResponse = (vehicleId, apiResponse) => {
    console.log(`Updating local vehicle state with API response: Vehicle ${vehicleId}`)
    
    if (!apiResponse.vehicle) {
      console.error('No vehicle data in API response')
      return
    }
    
    const updatedVehicle = apiResponse.vehicle
    
    // Find the vehicle in current arrays
    const findVehicle = (vehicles) => {
      return vehicles.find(v => v._id === vehicleId || v.custrecord_vehicle_number === vehicleId)
    }
    
    // Remove vehicle from all arrays first
    const removeFromArray = (vehicles, setVehicles) => {
      setVehicles(prev => prev.filter(vehicle => 
        vehicle._id !== vehicleId && vehicle.custrecord_vehicle_number !== vehicleId
      ))
    }
    
    // Remove from all arrays
    removeFromArray(pendingVehicles, setPendingVehicles)
    removeFromArray(approvedVehicles, setApprovedVehicles)
    removeFromArray(rejectedVehicles, setRejectedVehicles)
    
    // Add to correct array based on new status
    const newStatus = updatedVehicle.approved_by_hq
    console.log(`Moving vehicle to ${newStatus} section`)
    
    switch (newStatus) {
      case 'approved':
        setApprovedVehicles(prev => [...prev, updatedVehicle])
        break
      case 'rejected':
        setRejectedVehicles(prev => [...prev, updatedVehicle])
        break
      default:
        setPendingVehicles(prev => [...prev, updatedVehicle])
        break
    }
    
    console.log('Local vehicle state updated and moved to correct section')
  }

  // Helper function to get vehicle approval warning message
  const getVehicleApprovalWarning = (vehicle) => {
    if (!vehicle.assignedDriver) {
      return "Driver must be assigned before vehicle can be approved."
    }
    
    if (vehicle.assignedDriver.approved_by_hq === 'rejected') {
      return `Vehicle Approval Blocked\nDriver must be approved before vehicle can be approved. Current driver status: rejected`
    }
    
    if (vehicle.assignedDriver.approved_by_hq === 'pending') {
      return `Vehicle Approval Blocked\nDriver must be approved before vehicle can be approved. Current driver status: pending`
    }
    
    return null // No warning when driver is approved
  }

  // Helper function to get vehicle approval button state
  const getVehicleApprovalButtonState = (vehicle) => {
    const isAllowed = isVehicleApprovalAllowed(vehicle)
    return {
      disabled: !isAllowed,
      message: isAllowed ? 'Approve Vehicle Details' : 'Vehicle approval blocked'
    }
  }

  return (
    <div className="min-h-screen">
      {/* PENDING Section - Main Focus */}
      <div className="mb-12">
        {renderSection('PENDING', pendingVehicles, showPendingModal, setShowPendingModal, 'pending')}
      </div>

      {/* APPROVED Section - Separate Container */}
      <div className="mb-12">
        {renderSection('APPROVED', approvedVehicles, showApprovedModal, setShowApprovedModal, 'approved')}
      </div>

      {/* REJECTED Section - Separate Container */}
      <div className="mb-12">
        {renderSection('REJECTED', rejectedVehicles, showRejectedModal, setShowRejectedModal, 'rejected')}
      </div>

      {/* Vehicle Details Modal */}
        <AnimatePresence>
          {activeSection === 'vehicle' && activeVehicle && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => {
                  setActiveSection(null)
                  setActiveVehicle(null)
                }}
              />
              <motion.div
                className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide border border-orange-200/30 shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Enhanced Multi-Layer Texture Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-green-50/50 opacity-70"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/30 via-transparent to-purple-50/30 opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-yellow-50/20 via-transparent to-pink-50/20 opacity-30"></div>
                
                {/* Subtle Animated Gradient Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-green-400 to-blue-400 opacity-60 animate-pulse"></div>
                
                {/* Glass Effect Border */}
                <div className="absolute inset-0 rounded-3xl border border-orange-200/40 shadow-inner"></div>
                
                {/* Modal Content */}
                <div className="relative z-10">
                {/* Find the vehicle data */}
                {(() => {
                  const vehicle = [...pendingVehicles, ...approvedVehicles, ...rejectedVehicles]
                    .find(v => v._id === activeVehicle || v.custrecord_vehicle_number === activeVehicle)
                  
                  if (!vehicle) return <div className="text-white">Vehicle not found</div>

                  return (
                    <div>
                      {/* Enhanced Header with Texture */}
                      <div className="flex items-center justify-between mb-8 pb-6 border-b border-orange-200/30 relative">
                        {/* Header Background Texture */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-50/30 via-transparent to-green-50/30 rounded-t-3xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                        
                        <div className="relative z-10 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 flex items-center justify-center shadow-lg border border-blue-200/30 backdrop-blur-sm">
                            <Truck className="w-8 h-8 text-blue-700" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Vehicle Details</h3>
                            <p className="text-gray-600 text-lg font-medium">{vehicle.custrecord_vehicle_number}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveSection(null)
                            setActiveVehicle(null)
                          }}
                          className="relative z-10 p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-orange-200/40 hover:bg-white hover:shadow-lg transition-all shadow-sm hover:scale-105"
                        >
                          <XCircle className="w-6 h-6 text-gray-600" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="space-y-6">
                        {/* Vehicle Approval Warning */}
                        {(() => {
                          const warningMessage = getVehicleApprovalWarning(vehicle)
                          return warningMessage ? (
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                              {/* Warning Background Texture */}
                              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 via-transparent to-red-100/20"></div>
                              <div className="relative z-10 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shadow-sm">
                                  <AlertCircle className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                  <h4 className="text-orange-700 font-semibold">Vehicle Approval Blocked</h4>
                                  <p className="text-orange-600 text-sm mt-2 whitespace-pre-line">
                                    {warningMessage}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null
                        })()}
                        {/* Basic Vehicle Information */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/20 shadow-sm relative overflow-hidden">
                          {/* Section Background Texture */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                            <Car className="w-6 h-6 text-blue-600" />
                            Basic Vehicle Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="text-gray-600 text-sm font-medium">Vehicle Number</label>
                              <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_vehicle_number}</p>
                            </div>
                            <div>
                              <label className="text-gray-600 text-sm font-medium">Current Plant</label>
                              <p className="text-gray-900 font-semibold mt-1">{vehicle.currentPlant}</p>
                            </div>
                            <div>
                              <label className="text-gray-600 text-sm font-medium">Vehicle Type</label>
                              <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_vehicle_type_ag}</p>
                            </div>
                            <div>
                              <label className="text-gray-600 text-sm font-medium">Age of Vehicle</label>
                              <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_age_of_vehicle}</p>
                            </div>
                          </div>
                        </div>

                        {/* Technical Details */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/20 shadow-sm relative overflow-hidden">
                          {/* Section Background Texture */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-transparent to-pink-50/20"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                            <DocumentIcon className="w-6 h-6 text-purple-600" />
                            Technical Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="text-gray-600 text-sm font-medium">Engine Number</label>
                              <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_engine_number_ag}</p>
                            </div>
                            <div>
                              <label className="text-gray-600 text-sm font-medium">Chassis Number</label>
                              <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_chassis_number}</p>
                            </div>
                          </div>
                        </div>

                        {/* Documentation */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/20 shadow-sm relative overflow-hidden">
                          {/* Section Background Texture */}
                          <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 via-transparent to-teal-50/20"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                            <FileText className="w-6 h-6 text-green-600" />
                            Documentation
                          </h4>
                          <div className="space-y-4">
                            {/* RC Document */}
                            <div className="bg-white/60 backdrop-blur-sm border border-orange-200/20 rounded-xl p-5 shadow-sm">
                              <h5 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                RC Document
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">RC Number</label>
                                  <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_rc_no}</p>
                                </div>
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">Start Date</label>
                                  <p className="text-gray-900 font-semibold mt-1">{formatDate(vehicle.custrecord_rc_start_date)}</p>
                                </div>
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">End Date</label>
                                  <p className="text-gray-900 font-semibold mt-1">{formatDate(vehicle.custrecord_rc_end_date)}</p>
                                </div>
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">Status</label>
                                  <p className="text-gray-900 font-semibold mt-1">{getDocumentStatus(vehicle.custrecord_rc_end_date)}</p>
                                </div>
                              </div>
                                                              {renderAttachments(vehicle.custrecord_rc_doc_attach, 'RC Document')}
                            </div>

                            {/* Insurance */}
                            <div className="bg-white/60 backdrop-blur-sm border border-orange-200/20 rounded-xl p-5 shadow-sm">
                              <h5 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Insurance
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">Company</label>
                                  <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_insurance_company_name_ag}</p>
                                </div>
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">Policy Number</label>
                                  <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_insurance_number_ag}</p>
                                </div>
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">Start Date</label>
                                  <p className="text-gray-900 font-semibold mt-1">{formatDate(vehicle.custrecord_insurance_start_date_ag)}</p>
                                </div>
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">End Date</label>
                                  <p className="text-gray-900 font-semibold mt-1">{formatDate(vehicle.custrecord_insurance_end_date_ag)}</p>
                                </div>
                              </div>
                                                              {renderAttachments(vehicle.custrecord_insurance_attachment_ag, 'Insurance')}
                            </div>

                            {/* Permit */}
                            <div className="bg-white/60 backdrop-blur-sm border border-orange-200/20 rounded-xl p-5 shadow-sm">
                              <h5 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Permit
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">Permit Number</label>
                                  <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_permit_number_ag}</p>
                                </div>
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">Start Date</label>
                                  <p className="text-gray-900 font-semibold mt-1">{formatDate(vehicle.custrecord_permit_start_date)}</p>
                                </div>
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">End Date</label>
                                  <p className="text-gray-900 font-semibold mt-1">{formatDate(vehicle.custrecord_permit_end_date)}</p>
                                </div>
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">Status</label>
                                  <p className="text-gray-900 font-semibold mt-1">{getDocumentStatus(vehicle.custrecord_permit_end_date)}</p>
                                </div>
                              </div>
                                                              {renderAttachments(vehicle.custrecord_permit_attachment_ag, 'Permit')}
                            </div>

                            {/* PUC */}
                            <div className="bg-white/60 backdrop-blur-sm border border-orange-200/20 rounded-xl p-5 shadow-sm">
                              <h5 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                PUC
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">PUC Number</label>
                                  <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_puc_number}</p>
                                </div>
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">Start Date</label>
                                  <p className="text-gray-900 font-semibold mt-1">{formatDate(vehicle.custrecord_puc_start_date_ag)}</p>
                                </div>
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">End Date</label>
                                  <p className="text-gray-900 font-semibold mt-1">{formatDate(vehicle.custrecord_puc_end_date_ag)}</p>
                                </div>
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">Status</label>
                                  <p className="text-gray-900 font-semibold mt-1">{getDocumentStatus(vehicle.custrecord_puc_end_date_ag)}</p>
                                </div>
                              </div>
                                                              {renderAttachments(vehicle.custrecord_puc_attachment_ag, 'PUC')}
                            </div>

                            {/* Fitness Certificate */}
                            <div className="bg-white/60 backdrop-blur-sm border border-orange-200/20 rounded-xl p-5 shadow-sm">
                              <h5 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Fitness Certificate
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">Valid Until</label>
                                  <p className="text-gray-900 font-semibold mt-1">{formatDate(vehicle.custrecord_tms_vehicle_fit_cert_vld_upto)}</p>
                                </div>
                                <div>
                                  <label className="text-gray-600 text-sm font-medium">Status</label>
                                  <p className="text-gray-900 font-semibold mt-1">{getDocumentStatus(vehicle.custrecord_tms_vehicle_fit_cert_vld_upto)}</p>
                                </div>
                              </div>
                                                              {renderAttachments(vehicle.custrecord_tms_vehicle_fit_cert_attach, 'Fitness Certificate')}
                            </div>
                          </div>
                        </div>

                        {/* Vendor & Owner Information */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/20 shadow-sm relative overflow-hidden">
                          {/* Section Background Texture */}
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-purple-50/20"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                            <User className="w-6 h-6 text-indigo-600" />
                            Vendor & Owner Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="text-gray-600 text-sm font-medium">Vendor Name</label>
                              <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_vendor_name_ag?.name || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-gray-600 text-sm font-medium">Owner Name</label>
                              <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_owner_name_ag}</p>
                            </div>
                            <div>
                              <label className="text-gray-600 text-sm font-medium">Owner Number</label>
                              <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_owner_no_ag}</p>
                            </div>
                            <div>
                              <label className="text-gray-600 text-sm font-medium">Created By</label>
                              <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_create_by}</p>
                            </div>
                            <div>
                              <label className="text-gray-600 text-sm font-medium">GPS Available</label>
                              <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_vehicle_master_gps_available ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review Message and Action Buttons */}
                      <div className="mt-6 pt-6 border-t border-orange-200/30 relative">
                        {/* Section Background Texture */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/10 via-transparent to-yellow-50/10 rounded-b-3xl"></div>
                        <div className="relative z-10 space-y-4">
                          {/* Review Message */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Review Message</label>
                            <textarea
                              value={reviewMessage}
                              onChange={(e) => setReviewMessage(e.target.value)}
                              placeholder="Add your review message here..."
                              className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-orange-200/40 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none shadow-sm hover:shadow-md transition-shadow"
                              rows={3}
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            {(() => {
                              const vehicleButtonState = getVehicleApprovalButtonState(vehicle)
                              return (
                                <>
                                  <motion.button
                                    onClick={() => handleApprovalAction(vehicle._id, 'vehicle', 'approved')}
                                    disabled={vehicleButtonState.disabled}
                                    className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden ${
                                      vehicleButtonState.disabled
                                        ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                                    }`}
                                    whileHover={!vehicleButtonState.disabled ? { scale: 1.02 } : {}}
                                    whileTap={!vehicleButtonState.disabled ? { scale: 0.98 } : {}}
                                  >
                                    {/* Button Background Texture */}
                                    {!vehicleButtonState.disabled && (
                                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-transparent to-green-600/20"></div>
                                    )}
                                    <div className="relative z-10 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    {vehicleButtonState.message}
                                    </div>
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleApprovalAction(vehicle._id, 'vehicle', 'rejected')}
                                    disabled={vehicleButtonState.disabled}
                                    className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden ${
                                      vehicleButtonState.disabled
                                        ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl'
                                    }`}
                                    whileHover={!vehicleButtonState.disabled ? { scale: 1.02 } : {}}
                                    whileTap={!vehicleButtonState.disabled ? { scale: 0.98 } : {}}
                                  >
                                    {/* Button Background Texture */}
                                    {!vehicleButtonState.disabled && (
                                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-transparent to-red-600/20"></div>
                                    )}
                                    <div className="relative z-10 flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    Reject Vehicle Details
                                    </div>
                                  </motion.button>
                                </>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Driver Details Modal */}
        <AnimatePresence>
          {activeSection === 'driver' && activeVehicle && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => {
                  setActiveSection(null)
                  setActiveVehicle(null)
                }}
              />
              <motion.div
                className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide border border-orange-200/30 shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Enhanced Multi-Layer Texture Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-green-50/50 opacity-70"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/30 via-transparent to-purple-50/30 opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-yellow-50/20 via-transparent to-pink-50/20 opacity-30"></div>
                
                {/* Subtle Animated Gradient Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-green-400 to-blue-400 opacity-60 animate-pulse"></div>
                
                {/* Glass Effect Border */}
                <div className="absolute inset-0 rounded-3xl border border-orange-200/40 shadow-inner"></div>
                
                {/* Find the vehicle data */}
                {(() => {
                  const vehicle = [...pendingVehicles, ...approvedVehicles, ...rejectedVehicles]
                    .find(v => v._id === activeVehicle || v.custrecord_vehicle_number === activeVehicle)
                  
                  if (!vehicle) return <div className="text-gray-900">Vehicle not found</div>

                  return (
                    <div>
                      {/* Enhanced Header with Texture */}
                      <div className="flex items-center justify-between mb-8 pb-6 border-b border-orange-200/30 relative">
                        {/* Header Background Texture */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-50/30 via-transparent to-green-50/30 rounded-t-3xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                        
                        <div className="relative z-10 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/30 to-green-600/20 flex items-center justify-center shadow-lg border border-green-200/30 backdrop-blur-sm">
                            <User className="w-8 h-8 text-green-700" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Driver Details</h3>
                            <p className="text-gray-600 text-lg font-medium">{vehicle.custrecord_vehicle_number}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveSection(null)
                            setActiveVehicle(null)
                          }}
                          className="relative z-10 p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-orange-200/40 hover:bg-white hover:shadow-lg transition-all shadow-sm hover:scale-105"
                        >
                          <XCircle className="w-6 h-6 text-gray-600" />
                        </button>
                      </div>

                      {/* Content */}
                      {vehicle.assignedDriver ? (
                        <div className="space-y-6">
                          {/* Basic Driver Information */}
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/20 shadow-sm relative overflow-hidden">
                            {/* Section Background Texture */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 via-transparent to-blue-50/20"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
                            
                            <div className="relative z-10">
                              <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                                <User className="w-6 h-6 text-green-600" />
                              Basic Driver Information
                            </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="text-gray-600 text-sm font-medium">Driver Name</label>
                                  <p className="text-gray-900 font-semibold mt-1">{vehicle.assignedDriver.custrecord_driver_name}</p>
                              </div>
                              <div>
                                  <label className="text-gray-600 text-sm font-medium">Mobile Number</label>
                                  <p className="text-gray-900 font-semibold mt-1">{vehicle.assignedDriver.custrecord_driver_mobile_no}</p>
                              </div>
                              <div>
                                  <label className="text-gray-600 text-sm font-medium">Created By</label>
                                  <p className="text-gray-900 font-semibold mt-1">{vehicle.assignedDriver.custrecord_create_by_driver_master}</p>
                              </div>
                              <div>
                                  <label className="text-gray-600 text-sm font-medium">LCA Test Status</label>
                                  <p className="text-gray-900 font-semibold mt-1 capitalize">{vehicle.assignedDriver.custrecord_driving_lca_test}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* License Information */}
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/20 shadow-sm relative overflow-hidden">
                            {/* Section Background Texture */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
                            
                            <div className="relative z-10">
                              <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-blue-600" />
                              License Information
                            </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="text-gray-600 text-sm font-medium">License Number</label>
                                  <p className="text-gray-900 font-semibold mt-1">{vehicle.assignedDriver.custrecord_driving_license_no}</p>
                              </div>
                              <div>
                                  <label className="text-gray-600 text-sm font-medium">License Category</label>
                                  <p className="text-gray-900 font-semibold mt-1">{vehicle.assignedDriver.custrecord_license_category_ag}</p>
                              </div>
                              <div>
                                  <label className="text-gray-600 text-sm font-medium">License Start Date</label>
                                  <p className="text-gray-900 font-semibold mt-1">{formatDate(vehicle.assignedDriver.custrecord_driving_license_s_date)}</p>
                              </div>
                              <div>
                                  <label className="text-gray-600 text-sm font-medium">License End Date</label>
                                  <p className="text-gray-900 font-semibold mt-1">{formatDate(vehicle.assignedDriver.custrecord_driver_license_e_date)}</p>
                              </div>
                            </div>
                            
                            {/* License Attachment */}
                            {renderAttachments(
                              vehicle.assignedDriver.custrecord_driving_license_attachment?.map(url => ({
                                url,
                                fileName: 'Driving License',
                                mimeType: 'image/png'
                              })), 
                              'Driving License'
                            )}
                            </div>
                          </div>

                          {/* Vehicle Assignment */}
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/20 shadow-sm relative overflow-hidden">
                            {/* Section Background Texture */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-yellow-50/20"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
                            
                            <div className="relative z-10">
                              <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                                <Truck className="w-6 h-6 text-orange-600" />
                              Vehicle Assignment
                            </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="text-gray-600 text-sm font-medium">Assigned Vehicle</label>
                                  <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_vehicle_number}</p>
                              </div>
                              <div>
                                  <label className="text-gray-600 text-sm font-medium">Vehicle Type</label>
                                  <p className="text-gray-900 font-semibold mt-1">{vehicle.custrecord_vehicle_type_ag}</p>
                              </div>
                              <div>
                                  <label className="text-gray-600 text-sm font-medium">Current Plant</label>
                                  <p className="text-gray-900 font-semibold mt-1">{vehicle.currentPlant}</p>
                              </div>
                              <div>
                                  <label className="text-gray-600 text-sm font-medium">Approval Status</label>
                                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm mt-1 ${
                                  vehicle.assignedDriver.approved_by_hq === 'approved' 
                                      ? 'bg-green-50 text-green-700 border border-green-200' 
                                    : vehicle.assignedDriver.approved_by_hq === 'rejected'
                                      ? 'bg-red-50 text-red-700 border border-red-200'
                                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                }`}>
                                  {vehicle.assignedDriver.approved_by_hq || 'pending'}
                                </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 relative">
                          {/* Empty State Background Texture */}
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-transparent to-blue-50/30 rounded-xl"></div>
                          <div className="relative z-10">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6 shadow-lg border border-gray-200">
                              <User className="w-10 h-10 text-gray-500" />
                          </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-3">No Driver Assigned</h4>
                            <p className="text-gray-600 text-lg">This vehicle currently has no driver assigned to it.</p>
                          </div>
                        </div>
                      )}

                      {/* Review Message and Action Buttons */}
                      <div className="mt-6 pt-6 border-t border-orange-200/30 relative">
                        {/* Section Background Texture */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/10 via-transparent to-yellow-50/10 rounded-b-3xl"></div>
                        <div className="relative z-10 space-y-4">
                          {/* Review Message */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Review Message</label>
                            <textarea
                              value={reviewMessage}
                              onChange={(e) => setReviewMessage(e.target.value)}
                              placeholder="Add your review message here..."
                              className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-orange-200/40 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none shadow-sm hover:shadow-md transition-shadow"
                              rows={3}
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => handleApprovalAction(vehicle._id, 'driver', 'approved')}
                              className="flex-1 px-6 py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {/* Button Background Texture */}
                              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-transparent to-green-600/20"></div>
                              <div className="relative z-10 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5" />
                              Approve Driver Details
                              </div>
                            </motion.button>
                            <motion.button
                              onClick={() => handleApprovalAction(vehicle._id, 'driver', 'rejected')}
                              className="flex-1 px-6 py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {/* Button Background Texture */}
                              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-transparent to-red-600/20"></div>
                              <div className="relative z-10 flex items-center gap-2">
                              <XCircle className="w-5 h-5" />
                              Reject Driver Details
                              </div>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Checklist Modal */}
        <AnimatePresence>
          {activeSection === 'checklist' && activeVehicle && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => {
                  setActiveSection(null)
                  setActiveVehicle(null)
                }}
              />
              <motion.div
                className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide border border-orange-200/30 shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Enhanced Multi-Layer Texture Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-green-50/50 opacity-70"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/30 via-transparent to-purple-50/30 opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-yellow-50/20 via-transparent to-pink-50/20 opacity-30"></div>
                
                {/* Subtle Animated Gradient Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-green-400 to-blue-400 opacity-60 animate-pulse"></div>
                
                {/* Glass Effect Border */}
                <div className="absolute inset-0 rounded-3xl border border-orange-200/40 shadow-inner"></div>
                
                {/* Modal Content */}
                <div className="relative z-10">
                {/* Find the vehicle data */}
                {(() => {
                  const vehicle = [...pendingVehicles, ...approvedVehicles, ...rejectedVehicles]
                    .find(v => v._id === activeVehicle || v.custrecord_vehicle_number === activeVehicle)
                  
                  if (!vehicle) return <div className="text-white">Vehicle not found</div>

                  return (
                    <div>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-lime-500/20 flex items-center justify-center">
                            <CheckSquare className="w-6 h-6 text-lime-400" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">Checklist Details</h3>
                            <p className="text-gray-600 text-base">{vehicle.custrecord_vehicle_number}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveSection(null)
                            setActiveVehicle(null)
                          }}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <XCircle className="w-6 h-6 text-gray-600" />
                        </button>
                      </div>

                      {/* Content */}
                      {vehicle.checklist && vehicle.checklist.checklistItems ? (
                        <div className="space-y-6">
                          {/* Checklist Header */}
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/20 shadow-sm relative overflow-hidden">
                            {/* Section Background Texture */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-transparent to-pink-50/20"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
                            
                            <div className="relative z-10">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <ClipboardCheck className="w-5 h-5 text-purple-600" />
                              Checklist Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-gray-600 text-sm">Checklist Name</label>
                                <p className="text-gray-900 font-medium">{vehicle.checklist.name}</p>
                              </div>
                              <div>
                                <label className="text-gray-600 text-sm">Filled By</label>
                                <p className="text-gray-900 font-medium">{vehicle.checklist.filledBy}</p>
                              </div>
                              <div>
                                <label className="text-gray-600 text-sm">Filled At</label>
                                <p className="text-gray-900 font-medium">{formatDate(vehicle.checklist.filledAt)}</p>
                              </div>
                              <div>
                                <label className="text-gray-600 text-sm">Date</label>
                                <p className="text-gray-900 font-medium">{formatDate(vehicle.checklist.date)}</p>
                              </div>
                              </div>
                            </div>
                          </div>

                          {/* Checklist Items */}
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/20 shadow-sm relative overflow-hidden">
                            {/* Section Background Texture */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 via-transparent to-blue-50/20"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
                            
                            <div className="relative z-10">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <CheckSquare className="w-5 h-5 text-green-600" />
                              Checklist Items
                            </h4>
                            <div className="space-y-4">
                              {vehicle.checklist.checklistItems.map((item, index) => (
                                <div key={index} className="border border-white/10 rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <h5 className="text-gray-900 font-medium flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-700 text-xs font-bold">
                                        {index + 1}
                                      </span>
                                      {item.question}
                                    </h5>
                                    <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${
                                      item.answer === 'Yes' ? 'bg-green-50 text-green-700 border border-green-200' :
                                      item.answer === 'No' ? 'bg-red-50 text-red-700 border border-red-200' :
                                      'bg-gray-50 text-gray-700 border border-gray-200'
                                    }`}>
                                      {item.answer || 'Not answered'}
                                    </div>
                                  </div>
                                  {item.comment && (
                                    <div className="mt-3 p-3 bg-white/5 rounded-lg">
                                      <label className="text-gray-600 text-sm">Comment</label>
                                      <p className="text-gray-900 text-sm mt-1">{item.comment}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            </div>
                          </div>

                          {/* Vehicle Information */}
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/20 shadow-sm relative overflow-hidden">
                            {/* Section Background Texture */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-indigo-50/20"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
                            
                            <div className="relative z-10">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <Truck className="w-5 h-5 text-blue-600" />
                              Vehicle Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-gray-600 text-sm">Vehicle Number</label>
                                <p className="text-gray-900 font-medium">{vehicle.custrecord_vehicle_number}</p>
                              </div>
                              <div>
                                <label className="text-gray-600 text-sm">Vehicle Type</label>
                                <p className="text-gray-900 font-medium">{vehicle.custrecord_vehicle_type_ag}</p>
                              </div>
                              <div>
                                <label className="text-gray-600 text-sm">Current Plant</label>
                                <p className="text-gray-900 font-medium">{vehicle.currentPlant}</p>
                              </div>
                              <div>
                                <label className="text-gray-600 text-sm">Checklist Status</label>
                                <p className="text-gray-900 font-medium">Completed</p>
                              </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center mx-auto mb-4">
                            <CheckSquare className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">No Checklist Done</h4>
                          <p className="text-gray-600">This vehicle has no checklist completed yet.</p>
                        </div>
                      )}


                    </div>
                  )
                })()}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmationModal}
          onConfirm={handleConfirmationConfirm}
          onCancel={handleConfirmationCancel}
          title={`${confirmationData?.action === 'approved' ? 'Approve' : 'Reject'} ${confirmationData?.section === 'driver' ? 'Driver' : 'Vehicle'}`}
          message={`Are you sure you want to ${confirmationData?.action} ${confirmationData?.section === 'driver' ? 'driver' : 'vehicle'} "${confirmationData?.driverName || confirmationData?.vehicleName}"?`}
          action={confirmationData?.action}
        />

        {/* Toast Notifications */}
        <AnimatePresence>
          {toast.show && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={hideToast}
            />
          )}
        </AnimatePresence>
    </div>
  )
}

export default ApprovalCard 

