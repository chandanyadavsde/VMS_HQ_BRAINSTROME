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
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  
  // API-driven state
  const [pendingVehicles, setPendingVehicles] = useState([])
  const [approvedVehicles, setApprovedVehicles] = useState([])
  const [rejectedVehicles, setRejectedVehicles] = useState([])
  const [loading, setLoading] = useState({ pending: false, approved: false, rejected: false })
  const [error, setError] = useState({ pending: false, approved: false, rejected: false })
  
  const themeColors = getThemeColors(currentTheme)
  const isLightTheme = currentTheme === 'blue'

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
        <div className="mt-3 p-3 bg-white/5 rounded-lg">
          <p className="text-gray-400 text-sm">No attachments available</p>
        </div>
      )
    }

    return (
      <div className="mt-3">
        <label className="text-teal-300 text-sm">Attachments</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
          {attachments.map((doc, index) => {
            const isImage = doc.mimeType?.startsWith('image/')
            const isPDF = doc.mimeType === 'application/pdf'
            
            return (
              <div key={index} className="border border-white/10 rounded-lg p-3 bg-white/5">
                {isImage ? (
                  <div className="space-y-2">
                    <img 
                      src={doc.url} 
                      alt={doc.fileName}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(doc.url, '_blank')}
                    />
                    <p className="text-white text-xs truncate">{doc.fileName}</p>
                  </div>
                ) : isPDF ? (
                  <div className="space-y-2">
                    <div className="w-full h-32 bg-red-500/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-500/30 transition-colors"
                         onClick={() => window.open(doc.url, '_blank')}>
                      <div className="text-center">
                        <FileText className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-red-400 text-xs">PDF Document</p>
                      </div>
                    </div>
                    <p className="text-white text-xs truncate">{doc.fileName}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-full h-32 bg-gray-500/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-500/30 transition-colors"
                         onClick={() => window.open(doc.url, '_blank')}>
                      <div className="text-center">
                        <DocumentIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-xs">Document</p>
                      </div>
                    </div>
                    <p className="text-white text-xs truncate">{doc.fileName}</p>
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
      className={`relative bg-gradient-to-br ${themeColors.cardGradient} rounded-3xl p-6 cursor-pointer overflow-hidden`}
      style={{ 
        background: themeColors.cardBackground
      }}
      whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-cyan-400/30 rounded-full blur-sm"
            style={{
              left: `${20 + (i * 20)}%`,
              top: `${30 + (i * 15)}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">{vehicle.custrecord_vehicle_number}</h3>
            <p className={`text-sm ${themeColors.accentText}`}>{vehicle.custrecord_vehicle_type_ag} • {vehicle.currentPlant}</p>
          </div>
          
          {/* Status Badge */}
          <div className={`${getStatusBgColor(vehicle.approved_by_hq || sectionType)} text-white text-xs px-2 py-1 rounded-full`}>
            {vehicle.approved_by_hq || sectionType}
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="3"
                fill="none"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke="url(#approvalGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * 0.25}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 28 * 0.25 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="approvalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-white">25%</div>
              <div className="text-xs text-teal-200">Complete</div>
            </div>
          </div>
        </div>

        {/* Sub-Cards Grid */}
        <div className="grid grid-cols-1 gap-3 flex-1">
          {/* Vehicle Details Sub-Card */}
          <motion.div
            className="relative p-3 rounded-xl bg-white/10 border border-white/10 cursor-pointer"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
            }}
            onClick={() => {
              setActiveVehicle(vehicle._id || `${sectionType}-${index}`)
              setActiveSection('vehicle')
            }}
          >
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-teal-500/20">
                <div className="text-teal-400">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">Vehicle Details</h4>
                <p className="text-teal-200 text-xs">{vehicle.custrecord_vehicle_number}</p>
              </div>
              <div className="text-xs text-teal-200">Available</div>
            </div>
          </motion.div>

          {/* Driver Details Sub-Card */}
          <motion.div
            className={`relative p-3 rounded-xl border border-white/10 cursor-pointer ${
              vehicle.assignedDriver ? 'bg-white/10' : 'bg-gray-500/20'
            }`}
            whileHover={vehicle.assignedDriver ? { 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
            } : {}}
            onClick={() => {
              if (vehicle.assignedDriver) {
                setActiveVehicle(vehicle._id || `${sectionType}-${index}`)
                setActiveSection('driver')
              }
            }}
          >
            <div className="flex items-center gap-2">
              {(() => {
                const driverColors = getDriverIconColor(vehicle)
                return (
                  <>
                    <div className={`p-2 rounded-full ${driverColors.background}`}>
                      <div className={driverColors.icon}>
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm">Driver Details</h4>
                      <p className="text-teal-200 text-xs">
                        {vehicle.assignedDriver ? vehicle.assignedDriver.custrecord_driver_name : 'No Driver Available'}
                      </p>
                    </div>
                    <div className={`text-xs ${driverColors.icon}`}>
                      {getDriverStatusText(vehicle)}
                    </div>
                  </>
                )
              })()}
            </div>
          </motion.div>

          {/* Checklist Sub-Card */}
          <motion.div
            className={`relative p-3 rounded-xl border border-white/10 cursor-pointer ${
              vehicle.checklist && vehicle.checklist.checklistItems ? 'bg-white/10' : 'bg-gray-500/20'
            }`}
            whileHover={vehicle.checklist && vehicle.checklist.checklistItems ? { 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
            } : {}}
            onClick={() => {
              if (vehicle.checklist && vehicle.checklist.checklistItems) {
                setActiveVehicle(vehicle._id || `${sectionType}-${index}`)
                setActiveSection('checklist')
              }
            }}
          >
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${
                vehicle.checklist && vehicle.checklist.checklistItems ? 'bg-lime-500/20' : 'bg-gray-500/20'
              }`}>
                <div className={vehicle.checklist && vehicle.checklist.checklistItems ? 'text-lime-400' : 'text-gray-400'}>
                  <CheckSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">Checklist</h4>
                <p className="text-teal-200 text-xs">
                  {vehicle.checklist && vehicle.checklist.checklistItems ? 'Checklist Completed' : 'No Checklist Done'}
                </p>
              </div>
              <div className={`text-xs ${vehicle.checklist && vehicle.checklist.checklistItems ? 'text-lime-200' : 'text-gray-400'}`}>
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
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                sectionType === 'pending' ? 'bg-yellow-500/20 text-yellow-200' :
                sectionType === 'approved' ? 'bg-green-500/20 text-green-200' :
                'bg-red-500/20 text-red-200'
              }`}>
                {vehicles.length} items
              </div>
            </div>
            
            {vehicles.length > 4 && (
              <motion.button
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalState(true)}
              >
                View All
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.length === 0 ? (
                renderEmptyStateCard(title, sectionType)
              ) : (
                vehicles.slice(0, 4).map((vehicle, index) => 
                  renderCard(vehicle, index, sectionType)
                )
              )}
            </div>
          )}

          {/* View All Modal */}
          <AnimatePresence>
            {modalState && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setModalState(false)}
                />
                <motion.div
                  className="relative bg-slate-900/95 rounded-3xl p-6 max-w-7xl w-full max-h-[95vh] overflow-hidden"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">{title} - All Vehicles</h3>
                    <button
                      onClick={() => setModalState(false)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <XCircle className="w-6 h-6 text-white" />
                    </button>
                  </div>

                  {/* Search Box */}
                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search vehicles..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <FileText className="w-5 h-5 text-white/50" />
                      </div>
                    </div>
                  </div>

                  {/* All Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto max-h-[60vh]">
                    {vehicles.map((vehicle, index) => 
                      renderCard(vehicle, index, sectionType)
                    )}
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
            icon: <Clock className="w-8 h-8" />,
            message: "All caught up!",
            subtitle: "No pending approvals at the moment",
            color: "orange"
          }
        case 'approved':
          return {
            icon: <CheckCircle className="w-8 h-8" />,
            message: "No approved items",
            subtitle: "Approved items will appear here",
            color: "emerald"
          }
        case 'rejected':
          return {
            icon: <XCircle className="w-8 h-8" />,
            message: "No rejected items",
            subtitle: "Rejected items will appear here",
            color: "red"
          }
        default:
          return {
            icon: <FileText className="w-8 h-8" />,
            message: "No items",
            subtitle: "Items will appear here",
            color: "gray"
          }
      }
    }

    const emptyData = getEmptyStateData()
    const colorClasses = {
      orange: "bg-orange-500/20 text-orange-400",
      emerald: "bg-emerald-500/20 text-emerald-400", 
      red: "bg-red-500/20 text-red-400",
      gray: "bg-gray-500/20 text-gray-400"
    }

    return (
      <motion.div
        className={`relative bg-gradient-to-br ${themeColors.cardGradient} rounded-3xl p-8 cursor-pointer overflow-hidden`}
        style={{ 
          background: themeColors.cardBackground
        }}
        whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-cyan-400/30 rounded-full blur-sm"
              style={{
                left: `${20 + (i * 20)}%`,
                top: `${30 + (i * 15)}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          {/* Icon */}
          <div className={`p-4 rounded-full ${colorClasses[emptyData.color]} mb-6`}>
            <div className={colorClasses[emptyData.color].split(' ')[1]}>
              {emptyData.icon}
            </div>
          </div>
          
          {/* Message */}
          <h3 className="text-2xl font-bold text-white mb-3">{emptyData.message}</h3>
          <p className="text-teal-200 text-base">{emptyData.subtitle}</p>
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
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => {
                  setActiveSection(null)
                  setActiveVehicle(null)
                }}
              />
              <motion.div
                className="relative bg-slate-900/95 rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
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
                          <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                            <Truck className="w-6 h-6 text-teal-400" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">Vehicle Details</h3>
                            <p className="text-teal-400 text-base">{vehicle.custrecord_vehicle_number}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveSection(null)
                            setActiveVehicle(null)
                          }}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <XCircle className="w-6 h-6 text-white" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="space-y-6">
                        {/* Vehicle Approval Warning */}
                        {(() => {
                          const warningMessage = getVehicleApprovalWarning(vehicle)
                          return warningMessage ? (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                              <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-400" />
                                <div>
                                  <h4 className="text-yellow-400 font-medium">Vehicle Approval Blocked</h4>
                                  <p className="text-yellow-300 text-sm mt-1 whitespace-pre-line">
                                    {warningMessage}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null
                        })()}
                        {/* Basic Vehicle Information */}
                        <div className="bg-white/5 rounded-xl p-4">
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Car className="w-5 h-5 text-teal-400" />
                            Basic Vehicle Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-teal-300 text-sm">Vehicle Number</label>
                              <p className="text-white font-medium">{vehicle.custrecord_vehicle_number}</p>
                            </div>
                            <div>
                              <label className="text-teal-300 text-sm">Current Plant</label>
                              <p className="text-white font-medium">{vehicle.currentPlant}</p>
                            </div>
                            <div>
                              <label className="text-teal-300 text-sm">Vehicle Type</label>
                              <p className="text-white font-medium">{vehicle.custrecord_vehicle_type_ag}</p>
                            </div>
                            <div>
                              <label className="text-teal-300 text-sm">Age of Vehicle</label>
                              <p className="text-white font-medium">{vehicle.custrecord_age_of_vehicle}</p>
                            </div>
                          </div>
                        </div>

                        {/* Technical Details */}
                        <div className="bg-white/5 rounded-xl p-4">
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <DocumentIcon className="w-5 h-5 text-teal-400" />
                            Technical Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-teal-300 text-sm">Engine Number</label>
                              <p className="text-white font-medium">{vehicle.custrecord_engine_number_ag}</p>
                            </div>
                            <div>
                              <label className="text-teal-300 text-sm">Chassis Number</label>
                              <p className="text-white font-medium">{vehicle.custrecord_chassis_number}</p>
                            </div>
                          </div>
                        </div>

                        {/* Documentation */}
                        <div className="bg-white/5 rounded-xl p-4">
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-teal-400" />
                            Documentation
                          </h4>
                          <div className="space-y-4">
                            {/* RC Document */}
                            <div className="border border-white/10 rounded-lg p-4">
                              <h5 className="text-white font-medium mb-3">RC Document</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-teal-300 text-sm">RC Number</label>
                                  <p className="text-white font-medium">{vehicle.custrecord_rc_no}</p>
                                </div>
                                <div>
                                  <label className="text-teal-300 text-sm">Start Date</label>
                                  <p className="text-white font-medium">{formatDate(vehicle.custrecord_rc_start_date)}</p>
                                </div>
                                <div>
                                  <label className="text-teal-300 text-sm">End Date</label>
                                  <p className="text-white font-medium">{formatDate(vehicle.custrecord_rc_end_date)}</p>
                                </div>
                                <div>
                                  <label className="text-teal-300 text-sm">Status</label>
                                  <p className="text-white font-medium">{getDocumentStatus(vehicle.custrecord_rc_end_date)}</p>
                                </div>
                              </div>
                                                              {renderAttachments(vehicle.custrecord_rc_doc_attach, 'RC Document')}
                            </div>

                            {/* Insurance */}
                            <div className="border border-white/10 rounded-lg p-4">
                              <h5 className="text-white font-medium mb-3">Insurance</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-teal-300 text-sm">Company</label>
                                  <p className="text-white font-medium">{vehicle.custrecord_insurance_company_name_ag}</p>
                                </div>
                                <div>
                                  <label className="text-teal-300 text-sm">Policy Number</label>
                                  <p className="text-white font-medium">{vehicle.custrecord_insurance_number_ag}</p>
                                </div>
                                <div>
                                  <label className="text-teal-300 text-sm">Start Date</label>
                                  <p className="text-white font-medium">{formatDate(vehicle.custrecord_insurance_start_date_ag)}</p>
                                </div>
                                <div>
                                  <label className="text-teal-300 text-sm">End Date</label>
                                  <p className="text-white font-medium">{formatDate(vehicle.custrecord_insurance_end_date_ag)}</p>
                                </div>
                              </div>
                                                              {renderAttachments(vehicle.custrecord_insurance_attachment_ag, 'Insurance')}
                            </div>

                            {/* Permit */}
                            <div className="border border-white/10 rounded-lg p-4">
                              <h5 className="text-white font-medium mb-3">Permit</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-teal-300 text-sm">Permit Number</label>
                                  <p className="text-white font-medium">{vehicle.custrecord_permit_number_ag}</p>
                                </div>
                                <div>
                                  <label className="text-teal-300 text-sm">Start Date</label>
                                  <p className="text-white font-medium">{formatDate(vehicle.custrecord_permit_start_date)}</p>
                                </div>
                                <div>
                                  <label className="text-teal-300 text-sm">End Date</label>
                                  <p className="text-white font-medium">{formatDate(vehicle.custrecord_permit_end_date)}</p>
                                </div>
                                <div>
                                  <label className="text-teal-300 text-sm">Status</label>
                                  <p className="text-white font-medium">{getDocumentStatus(vehicle.custrecord_permit_end_date)}</p>
                                </div>
                              </div>
                                                              {renderAttachments(vehicle.custrecord_permit_attachment_ag, 'Permit')}
                            </div>

                            {/* PUC */}
                            <div className="border border-white/10 rounded-lg p-4">
                              <h5 className="text-white font-medium mb-3">PUC</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-teal-300 text-sm">PUC Number</label>
                                  <p className="text-white font-medium">{vehicle.custrecord_puc_number}</p>
                                </div>
                                <div>
                                  <label className="text-teal-300 text-sm">Start Date</label>
                                  <p className="text-white font-medium">{formatDate(vehicle.custrecord_puc_start_date_ag)}</p>
                                </div>
                                <div>
                                  <label className="text-teal-300 text-sm">End Date</label>
                                  <p className="text-white font-medium">{formatDate(vehicle.custrecord_puc_end_date_ag)}</p>
                                </div>
                                <div>
                                  <label className="text-teal-300 text-sm">Status</label>
                                  <p className="text-white font-medium">{getDocumentStatus(vehicle.custrecord_puc_end_date_ag)}</p>
                                </div>
                              </div>
                                                              {renderAttachments(vehicle.custrecord_puc_attachment_ag, 'PUC')}
                            </div>

                            {/* Fitness Certificate */}
                            <div className="border border-white/10 rounded-lg p-4">
                              <h5 className="text-white font-medium mb-3">Fitness Certificate</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-teal-300 text-sm">Valid Until</label>
                                  <p className="text-white font-medium">{formatDate(vehicle.custrecord_tms_vehicle_fit_cert_vld_upto)}</p>
                                </div>
                                <div>
                                  <label className="text-teal-300 text-sm">Status</label>
                                  <p className="text-white font-medium">{getDocumentStatus(vehicle.custrecord_tms_vehicle_fit_cert_vld_upto)}</p>
                                </div>
                              </div>
                                                              {renderAttachments(vehicle.custrecord_tms_vehicle_fit_cert_attach, 'Fitness Certificate')}
                            </div>
                          </div>
                        </div>

                        {/* Vendor & Owner Information */}
                        <div className="bg-white/5 rounded-xl p-4">
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-teal-400" />
                            Vendor & Owner Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-teal-300 text-sm">Vendor Name</label>
                              <p className="text-white font-medium">{vehicle.custrecord_vendor_name_ag?.name || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-teal-300 text-sm">Owner Name</label>
                              <p className="text-white font-medium">{vehicle.custrecord_owner_name_ag}</p>
                            </div>
                            <div>
                              <label className="text-teal-300 text-sm">Owner Number</label>
                              <p className="text-white font-medium">{vehicle.custrecord_owner_no_ag}</p>
                            </div>
                            <div>
                              <label className="text-teal-300 text-sm">Created By</label>
                              <p className="text-white font-medium">{vehicle.custrecord_create_by}</p>
                            </div>
                            <div>
                              <label className="text-teal-300 text-sm">GPS Available</label>
                              <p className="text-white font-medium">{vehicle.custrecord_vehicle_master_gps_available ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review Message and Action Buttons */}
                      <div className="mt-6 pt-4 border-t border-white/20">
                        <div className="space-y-4">
                          {/* Review Message */}
                          <div>
                            <label className="block text-white text-sm font-medium mb-2">Review Message</label>
                            <textarea
                              value={reviewMessage}
                              onChange={(e) => setReviewMessage(e.target.value)}
                              placeholder="Add your review message here..."
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
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
                                    className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                                      vehicleButtonState.disabled
                                        ? 'bg-gray-500 cursor-not-allowed opacity-50'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                    whileHover={!vehicleButtonState.disabled ? { scale: 1.02 } : {}}
                                    whileTap={!vehicleButtonState.disabled ? { scale: 0.98 } : {}}
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                    {vehicleButtonState.message}
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleApprovalAction(vehicle._id, 'vehicle', 'rejected')}
                                    disabled={vehicleButtonState.disabled}
                                    className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                                      vehicleButtonState.disabled
                                        ? 'bg-gray-500 cursor-not-allowed opacity-50'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                    whileHover={!vehicleButtonState.disabled ? { scale: 1.02 } : {}}
                                    whileTap={!vehicleButtonState.disabled ? { scale: 0.98 } : {}}
                                  >
                                    <XCircle className="w-5 h-5" />
                                    Reject Vehicle Details
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
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => {
                  setActiveSection(null)
                  setActiveVehicle(null)
                }}
              />
              <motion.div
                className="relative bg-slate-900/95 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
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
                            <User className="w-6 h-6 text-lime-400" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">Driver Details</h3>
                            <p className="text-lime-400 text-base">{vehicle.custrecord_vehicle_number}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveSection(null)
                            setActiveVehicle(null)
                          }}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <XCircle className="w-6 h-6 text-white" />
                        </button>
                      </div>

                      {/* Content */}
                      {vehicle.assignedDriver ? (
                        <div className="space-y-6">
                          {/* Basic Driver Information */}
                          <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <User className="w-5 h-5 text-lime-400" />
                              Basic Driver Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-lime-300 text-sm">Driver Name</label>
                                <p className="text-white font-medium">{vehicle.assignedDriver.custrecord_driver_name}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">Mobile Number</label>
                                <p className="text-white font-medium">{vehicle.assignedDriver.custrecord_driver_mobile_no}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">Created By</label>
                                <p className="text-white font-medium">{vehicle.assignedDriver.custrecord_create_by_driver_master}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">LCA Test Status</label>
                                <p className="text-white font-medium capitalize">{vehicle.assignedDriver.custrecord_driving_lca_test}</p>
                              </div>
                            </div>
                          </div>

                          {/* License Information */}
                          <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <FileText className="w-5 h-5 text-lime-400" />
                              License Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-lime-300 text-sm">License Number</label>
                                <p className="text-white font-medium">{vehicle.assignedDriver.custrecord_driving_license_no}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">License Category</label>
                                <p className="text-white font-medium">{vehicle.assignedDriver.custrecord_license_category_ag}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">License Start Date</label>
                                <p className="text-white font-medium">{formatDate(vehicle.assignedDriver.custrecord_driving_license_s_date)}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">License End Date</label>
                                <p className="text-white font-medium">{formatDate(vehicle.assignedDriver.custrecord_driver_license_e_date)}</p>
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

                          {/* Vehicle Assignment */}
                          <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <Truck className="w-5 h-5 text-lime-400" />
                              Vehicle Assignment
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-lime-300 text-sm">Assigned Vehicle</label>
                                <p className="text-white font-medium">{vehicle.custrecord_vehicle_number}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">Vehicle Type</label>
                                <p className="text-white font-medium">{vehicle.custrecord_vehicle_type_ag}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">Current Plant</label>
                                <p className="text-white font-medium">{vehicle.currentPlant}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">Approval Status</label>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  vehicle.assignedDriver.approved_by_hq === 'approved' 
                                    ? 'bg-green-500/20 text-green-200' 
                                    : vehicle.assignedDriver.approved_by_hq === 'rejected'
                                    ? 'bg-red-500/20 text-red-200'
                                    : 'bg-yellow-500/20 text-yellow-200'
                                }`}>
                                  {vehicle.assignedDriver.approved_by_hq || 'pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-xl font-semibold text-white mb-2">No Driver Assigned</h4>
                          <p className="text-gray-400">This vehicle currently has no driver assigned to it.</p>
                        </div>
                      )}

                      {/* Review Message and Action Buttons */}
                      <div className="mt-6 pt-4 border-t border-white/20">
                        <div className="space-y-4">
                          {/* Review Message */}
                          <div>
                            <label className="block text-white text-sm font-medium mb-2">Review Message</label>
                            <textarea
                              value={reviewMessage}
                              onChange={(e) => setReviewMessage(e.target.value)}
                              placeholder="Add your review message here..."
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-lime-500 resize-none"
                              rows={3}
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => handleApprovalAction(vehicle._id, 'driver', 'approved')}
                              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <CheckCircle className="w-5 h-5" />
                              Approve Driver Details
                            </motion.button>
                            <motion.button
                              onClick={() => handleApprovalAction(vehicle._id, 'driver', 'rejected')}
                              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <XCircle className="w-5 h-5" />
                              Reject Driver Details
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
                className="relative bg-slate-900/95 rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
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
                            <h3 className="text-2xl font-bold text-white">Checklist Details</h3>
                            <p className="text-lime-400 text-base">{vehicle.custrecord_vehicle_number}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveSection(null)
                            setActiveVehicle(null)
                          }}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <XCircle className="w-6 h-6 text-white" />
                        </button>
                      </div>

                      {/* Content */}
                      {vehicle.checklist && vehicle.checklist.checklistItems ? (
                        <div className="space-y-6">
                          {/* Checklist Header */}
                          <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <ClipboardCheck className="w-5 h-5 text-lime-400" />
                              Checklist Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-lime-300 text-sm">Checklist Name</label>
                                <p className="text-white font-medium">{vehicle.checklist.name}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">Filled By</label>
                                <p className="text-white font-medium">{vehicle.checklist.filledBy}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">Filled At</label>
                                <p className="text-white font-medium">{formatDate(vehicle.checklist.filledAt)}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">Date</label>
                                <p className="text-white font-medium">{formatDate(vehicle.checklist.date)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Checklist Items */}
                          <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <CheckSquare className="w-5 h-5 text-lime-400" />
                              Checklist Items
                            </h4>
                            <div className="space-y-4">
                              {vehicle.checklist.checklistItems.map((item, index) => (
                                <div key={index} className="border border-white/10 rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <h5 className="text-white font-medium flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-400 text-xs font-bold">
                                        {index + 1}
                                      </span>
                                      {item.question}
                                    </h5>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      item.answer === 'Yes' ? 'bg-green-500/20 text-green-200' :
                                      item.answer === 'No' ? 'bg-red-500/20 text-red-200' :
                                      'bg-gray-500/20 text-gray-200'
                                    }`}>
                                      {item.answer || 'Not answered'}
                                    </div>
                                  </div>
                                  {item.comment && (
                                    <div className="mt-3 p-3 bg-white/5 rounded-lg">
                                      <label className="text-lime-300 text-sm">Comment</label>
                                      <p className="text-white text-sm mt-1">{item.comment}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Vehicle Information */}
                          <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <Truck className="w-5 h-5 text-lime-400" />
                              Vehicle Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-lime-300 text-sm">Vehicle Number</label>
                                <p className="text-white font-medium">{vehicle.custrecord_vehicle_number}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">Vehicle Type</label>
                                <p className="text-white font-medium">{vehicle.custrecord_vehicle_type_ag}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">Current Plant</label>
                                <p className="text-white font-medium">{vehicle.currentPlant}</p>
                              </div>
                              <div>
                                <label className="text-lime-300 text-sm">Checklist Status</label>
                                <p className="text-white font-medium">Completed</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center mx-auto mb-4">
                            <CheckSquare className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-xl font-semibold text-white mb-2">No Checklist Done</h4>
                          <p className="text-gray-400">This vehicle has no checklist completed yet.</p>
                        </div>
                      )}


                    </div>
                  )
                })()}
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

