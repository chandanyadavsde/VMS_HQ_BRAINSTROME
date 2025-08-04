import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, User, CheckSquare, FileText, MapPin, Clock, AlertCircle, CheckCircle, XCircle, Truck, UserCheck, ClipboardCheck, Calendar, Image, FileText as DocumentIcon } from 'lucide-react'
import { getThemeColors } from '../utils/theme.js'

const ApprovalCard = ({ selectedPlant = 'all', currentTheme = 'teal' }) => {
  const [activeSection, setActiveSection] = useState(null)
  const [activeVehicle, setActiveVehicle] = useState(null)
  const [reviewMessage, setReviewMessage] = useState('')
  const [showPendingModal, setShowPendingModal] = useState(false)
  const [showApprovedModal, setShowApprovedModal] = useState(false)
  const [showRejectedModal, setShowRejectedModal] = useState(false)
  const themeColors = getThemeColors(currentTheme)
  const isLightTheme = currentTheme === 'blue'
  
  // Real data structure
  const [approvals, setApprovals] = useState([
    {
      _id: "686b93e4f22cee76e3080bce",
      custrecord_vehicle_number: "MH12AB1241",
      currentPlant: "pune",
      custrecord_vehicle_type_ag: "Lattice Tower",
      custrecord_age_of_vehicle: "5 Years",
      custrecord_owner_name_ag: "Ramesh Patil",
      custrecord_owner_no_ag: "+91‑9876543210",
      custrecord_chassis_number: "CH‑123456",
      custrecord_engine_number_ag: "EN‑987654",
      custrecord_rc_no: "RC‑778899",
      custrecord_rc_start_date: "2023-03-01T00:00:00.000Z",
      custrecord_insurance_company_name_ag: "ICICI Lombard",
      custrecord_insurance_number_ag: "INS‑552233",
      custrecord_insurance_start_date_ag: "2024-02-01T00:00:00.000Z",
      custrecord_insurance_end_date_ag: "2029-02-14T00:00:00.000Z",
      custrecord_permit_start_date: "2025-06-01T00:00:00.000Z",
      custrecord_permit_end_date: "2025-12-01T00:00:00.000Z",
      custrecord_puc_number: "PUC‑112233",
      custrecord_puc_start_date_ag: "2025-06-01T00:00:00.000Z",
      custrecord_puc_end_date_ag: "2025-12-01T00:00:00.000Z",
      custrecord_tms_vehicle_fit_cert_vld_upto: "2027-05-31T00:00:00.000Z",
      custrecord_vehicle_master_gps_available: true,
      custrecord_vendor_name_ag: {
        id: "VEN001",
        name: "ABC Logistics",
        isInactive: false
      },
      custrecord_create_by: "shekhar.deshmukh",
      custrecord_rc_doc_attach: [
        {
          url: "https://vms-media-handle.s3.ap-south-1.amazonaws.com/vehicle_attachments/1751880676218-Email Template-1.png",
          fileName: "Email Template-1.png",
          mimeType: "image/png",
          uploadedAt: "2025-07-07T09:31:16.539Z"
        }
      ],
      custrecord_insurance_attachment_ag: [
        {
          url: "https://vms-media-handle.s3.ap-south-1.amazonaws.com/vehicle_attachments/1751880676219-Email Template-1.png",
          fileName: "Email Template-1.png",
          mimeType: "image/png",
          uploadedAt: "2025-07-07T09:31:16.527Z"
        }
      ],
      custrecord_permit_attachment_ag: [
        {
          url: "https://vms-media-handle.s3.ap-south-1.amazonaws.com/vehicle_attachments/1751880676219-Email Template-1.png",
          fileName: "Email Template-1.png",
          mimeType: "image/png",
          uploadedAt: "2025-07-07T09:31:16.852Z"
        }
      ],
      custrecord_puc_attachment_ag: [
        {
          url: "https://vms-media-handle.s3.ap-south-1.amazonaws.com/vehicle_attachments/1751880676219-Email Template-1.png",
          fileName: "Email Template-1.png",
          mimeType: "image/png",
          uploadedAt: "2025-07-07T09:31:16.428Z"
        }
      ],
      custrecord_tms_vehicle_fit_cert_attach: [
        {
          url: "https://vms-media-handle.s3.ap-south-1.amazonaws.com/vehicle_attachments/1751880676219-Email Template-1.png",
          fileName: "Email Template-1.png",
          mimeType: "image/png",
          uploadedAt: "2025-07-07T09:31:16.485Z"
        }
      ],
      assignedDriver: null, // No driver assigned
      checklist: {
        checklistItems: [
          {
            question: "Safety equipment check",
            answer: "",
            comment: "sadcasdc"
          },
          {
            question: "Overall condition check",
            answer: "",
            comment: "sadascdsad"
          }
        ],
        date: "2025-07-23T10:20:33.388068",
        filledAt: "2025-07-23T04:52:46.821Z",
        filledBy: "api",
        name: "Lattice Tower Form"
      },
      approved_by_hq: "pending"
    },
    {
      _id: "686b93e4f22cee76e3080bcf",
      custrecord_vehicle_number: "DL01CD5678",
      currentPlant: "delhi",
      custrecord_vehicle_type_ag: "Mahindra Bolero",
      custrecord_age_of_vehicle: "3 Years",
      custrecord_owner_name_ag: "Amit Singh",
      custrecord_owner_no_ag: "+91‑8765432109",
      custrecord_chassis_number: "CH‑654321",
      custrecord_engine_number_ag: "EN‑123456",
      custrecord_rc_no: "RC‑112233",
      custrecord_rc_start_date: "2022-01-01T00:00:00.000Z",
      custrecord_insurance_company_name_ag: "HDFC Ergo",
      custrecord_insurance_number_ag: "INS‑998877",
      custrecord_insurance_start_date_ag: "2023-01-01T00:00:00.000Z",
      custrecord_insurance_end_date_ag: "2028-01-01T00:00:00.000Z",
      custrecord_permit_start_date: "2024-01-01T00:00:00.000Z",
      custrecord_permit_end_date: "2024-12-31T00:00:00.000Z",
      custrecord_puc_number: "PUC‑445566",
      custrecord_puc_start_date_ag: "2024-01-01T00:00:00.000Z",
      custrecord_puc_end_date_ag: "2024-12-31T00:00:00.000Z",
      custrecord_tms_vehicle_fit_cert_vld_upto: "2026-12-31T00:00:00.000Z",
      custrecord_vehicle_master_gps_available: false,
      custrecord_vendor_name_ag: {
        id: "VEN002",
        name: "XYZ Transport",
        isInactive: false
      },
      custrecord_create_by: "admin.user",
      custrecord_rc_doc_attach: [],
      custrecord_insurance_attachment_ag: [],
      custrecord_permit_attachment_ag: [],
      custrecord_puc_attachment_ag: [],
      custrecord_tms_vehicle_fit_cert_attach: [],
      assignedDriver: null, // No driver assigned
      checklist: null, // No checklist done
      approved_by_hq: "pending"
    },
    {
      _id: "686b93e4f22cee76e3080bd0",
      custrecord_vehicle_number: "KA02EF9012",
      currentPlant: "bangalore",
      custrecord_vehicle_type_ag: "Tata 407",
      custrecord_age_of_vehicle: "4 Years",
      custrecord_owner_name_ag: "Kumar Patel",
      custrecord_owner_no_ag: "+91‑7654321098",
      custrecord_chassis_number: "CH‑789012",
      custrecord_engine_number_ag: "EN‑345678",
      custrecord_rc_no: "RC‑334455",
      custrecord_rc_start_date: "2021-06-01T00:00:00.000Z",
      custrecord_insurance_company_name_ag: "Bajaj Allianz",
      custrecord_insurance_number_ag: "INS‑776655",
      custrecord_insurance_start_date_ag: "2024-03-01T00:00:00.000Z",
      custrecord_insurance_end_date_ag: "2029-03-01T00:00:00.000Z",
      custrecord_permit_start_date: "2024-06-01T00:00:00.000Z",
      custrecord_permit_end_date: "2024-12-31T00:00:00.000Z",
      custrecord_puc_number: "PUC‑778899",
      custrecord_puc_start_date_ag: "2024-06-01T00:00:00.000Z",
      custrecord_puc_end_date_ag: "2024-12-31T00:00:00.000Z",
      custrecord_tms_vehicle_fit_cert_vld_upto: "2026-06-30T00:00:00.000Z",
      custrecord_vehicle_master_gps_available: true,
      custrecord_vendor_name_ag: {
        id: "VEN003",
        name: "DEF Logistics",
        isInactive: false
      },
      custrecord_create_by: "manager.user",
      custrecord_rc_doc_attach: [],
      custrecord_insurance_attachment_ag: [],
      custrecord_permit_attachment_ag: [],
      custrecord_puc_attachment_ag: [],
      custrecord_tms_vehicle_fit_cert_attach: [],
      assignedDriver: {
        name: "Rajesh Kumar",
        license: "DL-1122334455",
        contact: "+91 6543210987",
        expiry: "2025-12-31"
      },
      checklist: {
        checklistItems: [
          {
            question: "Safety equipment check",
            answer: "Yes",
            comment: "All equipment present"
          },
          {
            question: "Overall condition check",
            answer: "Yes",
            comment: "Good condition"
          }
        ],
        date: "2025-07-23T10:20:33.388068",
        filledAt: "2025-07-23T04:52:46.821Z",
        filledBy: "api",
        name: "Tata 407 Form"
      },
      approved_by_hq: "pending"
    },
    {
      _id: "686b93e4f22cee76e3080bd1",
      custrecord_vehicle_number: "TN03GH3456",
      currentPlant: "chennai",
      custrecord_vehicle_type_ag: "Eicher Pro",
      custrecord_age_of_vehicle: "2 Years",
      custrecord_owner_name_ag: "Lakshmi Narayanan",
      custrecord_owner_no_ag: "+91‑6543210987",
      custrecord_chassis_number: "CH‑456789",
      custrecord_engine_number_ag: "EN‑567890",
      custrecord_rc_no: "RC‑556677",
      custrecord_rc_start_date: "2023-01-01T00:00:00.000Z",
      custrecord_insurance_company_name_ag: "United India Insurance",
      custrecord_insurance_number_ag: "INS‑443322",
      custrecord_insurance_start_date_ag: "2024-01-01T00:00:00.000Z",
      custrecord_insurance_end_date_ag: "2029-01-01T00:00:00.000Z",
      custrecord_permit_start_date: "2024-06-01T00:00:00.000Z",
      custrecord_permit_end_date: "2024-12-31T00:00:00.000Z",
      custrecord_puc_number: "PUC‑889900",
      custrecord_puc_start_date_ag: "2024-06-01T00:00:00.000Z",
      custrecord_puc_end_date_ag: "2024-12-31T00:00:00.000Z",
      custrecord_tms_vehicle_fit_cert_vld_upto: "2027-01-31T00:00:00.000Z",
      custrecord_vehicle_master_gps_available: true,
      custrecord_vendor_name_ag: {
        id: "VEN004",
        name: "GHI Transport",
        isInactive: false
      },
      custrecord_create_by: "supervisor.user",
      custrecord_rc_doc_attach: [],
      custrecord_insurance_attachment_ag: [],
      custrecord_permit_attachment_ag: [],
      custrecord_puc_attachment_ag: [],
      custrecord_tms_vehicle_fit_cert_attach: [],
      assignedDriver: {
        name: "Arun Kumar",
        license: "DL-2233445566",
        contact: "+91 5432109876",
        expiry: "2025-08-15"
      },
      checklist: {
        checklistItems: [
          {
            question: "Safety equipment check",
            answer: "Yes",
            comment: "Complete"
          },
          {
            question: "Overall condition check",
            answer: "Yes",
            comment: "Excellent"
          }
        ],
        date: "2025-07-23T10:20:33.388068",
        filledAt: "2025-07-23T04:52:46.821Z",
        filledBy: "api",
        name: "Eicher Pro Form"
      },
      approved_by_hq: "pending"
    },
    {
      _id: "686b93e4f22cee76e3080bd2",
      custrecord_vehicle_number: "MH04IJ7890",
      currentPlant: "mumbai",
      custrecord_vehicle_type_ag: "Force Traveller",
      custrecord_age_of_vehicle: "1 Year",
      custrecord_owner_name_ag: "Priya Desai",
      custrecord_owner_no_ag: "+91‑5432109876",
      custrecord_chassis_number: "CH‑234567",
      custrecord_engine_number_ag: "EN‑678901",
      custrecord_rc_no: "RC‑778899",
      custrecord_rc_start_date: "2024-01-01T00:00:00.000Z",
      custrecord_insurance_company_name_ag: "National Insurance",
      custrecord_insurance_number_ag: "INS‑221100",
      custrecord_insurance_start_date_ag: "2024-02-01T00:00:00.000Z",
      custrecord_insurance_end_date_ag: "2029-02-01T00:00:00.000Z",
      custrecord_permit_start_date: "2024-06-01T00:00:00.000Z",
      custrecord_permit_end_date: "2024-12-31T00:00:00.000Z",
      custrecord_puc_number: "PUC‑990011",
      custrecord_puc_start_date_ag: "2024-06-01T00:00:00.000Z",
      custrecord_puc_end_date_ag: "2024-12-31T00:00:00.000Z",
      custrecord_tms_vehicle_fit_cert_vld_upto: "2028-02-29T00:00:00.000Z",
      custrecord_vehicle_master_gps_available: false,
      custrecord_vendor_name_ag: {
        id: "VEN005",
        name: "JKL Logistics",
        isInactive: false
      },
      custrecord_create_by: "admin.user",
      custrecord_rc_doc_attach: [],
      custrecord_insurance_attachment_ag: [],
      custrecord_permit_attachment_ag: [],
      custrecord_puc_attachment_ag: [],
      custrecord_tms_vehicle_fit_cert_attach: [],
      assignedDriver: null,
      checklist: null,
      approved_by_hq: "pending"
    },
    {
      _id: "686b93e4f22cee76e3080bd3",
      custrecord_vehicle_number: "DL05KL1234",
      currentPlant: "delhi",
      custrecord_vehicle_type_ag: "Ashok Leyland Dost",
      custrecord_age_of_vehicle: "3 Years",
      custrecord_owner_name_ag: "Suresh Verma",
      custrecord_owner_no_ag: "+91‑4321098765",
      custrecord_chassis_number: "CH‑345678",
      custrecord_engine_number_ag: "EN‑789012",
      custrecord_rc_no: "RC‑889900",
      custrecord_rc_start_date: "2022-03-01T00:00:00.000Z",
      custrecord_insurance_company_name_ag: "HDFC Ergo",
      custrecord_insurance_number_ag: "INS‑110099",
      custrecord_insurance_start_date_ag: "2024-03-01T00:00:00.000Z",
      custrecord_insurance_end_date_ag: "2029-03-01T00:00:00.000Z",
      custrecord_permit_start_date: "2024-06-01T00:00:00.000Z",
      custrecord_permit_end_date: "2024-12-31T00:00:00.000Z",
      custrecord_puc_number: "PUC‑001122",
      custrecord_puc_start_date_ag: "2024-06-01T00:00:00.000Z",
      custrecord_puc_end_date_ag: "2024-12-31T00:00:00.000Z",
      custrecord_tms_vehicle_fit_cert_vld_upto: "2027-03-31T00:00:00.000Z",
      custrecord_vehicle_master_gps_available: true,
      custrecord_vendor_name_ag: {
        id: "VEN006",
        name: "MNO Transport",
        isInactive: false
      },
      custrecord_create_by: "manager.user",
      custrecord_rc_doc_attach: [],
      custrecord_insurance_attachment_ag: [],
      custrecord_permit_attachment_ag: [],
      custrecord_puc_attachment_ag: [],
      custrecord_tms_vehicle_fit_cert_attach: [],
      assignedDriver: {
        name: "Vikram Singh",
        license: "DL-3344556677",
        contact: "+91 3210987654",
        expiry: "2025-10-20"
      },
      checklist: {
        checklistItems: [
          {
            question: "Safety equipment check",
            answer: "Yes",
            comment: "All present"
          },
          {
            question: "Overall condition check",
            answer: "Yes",
            comment: "Good"
          }
        ],
        date: "2025-07-23T10:20:33.388068",
        filledAt: "2025-07-23T04:52:46.821Z",
        filledBy: "api",
        name: "Ashok Leyland Dost Form"
      },
      approved_by_hq: "pending"
    }
  ])

  // Helper function to get status background color
  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-400'
      case 'pending':
        return 'bg-orange-500/20 text-orange-400'
      case 'rejected':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  // Filter approvals based on selected plant and status
  const filteredApprovals = approvals.filter(approval => 
    selectedPlant === 'all' || approval.currentPlant?.toLowerCase() === selectedPlant?.toLowerCase()
  )

  // Separate approvals by status
  const pendingApprovals = filteredApprovals.filter(approval => approval.approved_by_hq?.toLowerCase() === 'pending')
  const approvedApprovals = filteredApprovals.filter(approval => approval.approved_by_hq?.toLowerCase() === 'approved')
  const rejectedApprovals = filteredApprovals.filter(approval => approval.approved_by_hq?.toLowerCase() === 'rejected')

  // Helper function to render a single card
  const renderCard = (approval, index, sectionType) => (
    <motion.div key={approval._id || `${sectionType}-${index}`}
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
            <h3 className="text-lg font-bold text-white">{approval.custrecord_vehicle_number || `Vehicle ${index + 1}`}</h3>
            <p className={`text-sm ${themeColors.accentText}`}>{approval.custrecord_vehicle_type_ag || 'Vehicle Type'} • {approval.currentPlant || 'Plant'}</p>
          </div>
          
          {/* Status Badge */}
          <div className={`${getStatusBgColor(approval.approved_by_hq || sectionType)} text-white text-xs px-2 py-1 rounded-full`}>
            {approval.approved_by_hq || sectionType}
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
              setActiveVehicle(approval._id || `${sectionType}-${index}`)
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
                <p className="text-teal-200 text-xs">{approval.custrecord_vehicle_number || `Vehicle ${index + 1}`}</p>
              </div>
              <div className="text-xs text-teal-200">Available</div>
            </div>
          </motion.div>

          {/* Driver Details Sub-Card */}
          <motion.div
            className={`relative p-3 rounded-xl border border-white/10 cursor-pointer ${
              approval.assignedDriver ? 'bg-white/10' : 'bg-gray-500/20'
            }`}
            whileHover={approval.assignedDriver ? { 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
            } : {}}
            onClick={() => {
              if (approval.assignedDriver) {
                setActiveVehicle(approval._id || `${sectionType}-${index}`)
                setActiveSection('driver')
              }
            }}
          >
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${
                approval.assignedDriver ? 'bg-lime-500/20' : 'bg-gray-500/20'
              }`}>
                <div className={approval.assignedDriver ? 'text-lime-400' : 'text-gray-400'}>
                  <User className="w-4 h-4" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">Driver Details</h4>
                <p className="text-teal-200 text-xs">
                  {approval.assignedDriver ? approval.assignedDriver.name : 'No Driver Available'}
                </p>
              </div>
              <div className={`text-xs ${approval.assignedDriver ? 'text-lime-200' : 'text-gray-400'}`}>
                {approval.assignedDriver ? 'Available' : 'Not Available'}
              </div>
            </div>
          </motion.div>

          {/* Checklist Sub-Card */}
          <motion.div
            className={`relative p-3 rounded-xl border border-white/10 cursor-pointer ${
              approval.checklist ? 'bg-white/10' : 'bg-gray-500/20'
            }`}
            whileHover={approval.checklist ? { 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
            } : {}}
            onClick={() => {
              if (approval.checklist) {
                setActiveVehicle(approval._id || `${sectionType}-${index}`)
                setActiveSection('checklist')
              }
            }}
          >
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${
                approval.checklist ? 'bg-lime-500/20' : 'bg-gray-500/20'
              }`}>
                <div className={approval.checklist ? 'text-lime-400' : 'text-gray-400'}>
                  <CheckSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">Checklist</h4>
                <p className="text-teal-200 text-xs">
                  {approval.checklist ? 'Checklist Completed' : 'No Checklist Done'}
                </p>
              </div>
              <div className={`text-xs ${approval.checklist ? 'text-lime-200' : 'text-gray-400'}`}>
                {approval.checklist ? 'Available' : 'Not Available'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )

  // Helper function to render section
  const renderSection = (title, approvals, modalState, setModalState, sectionType) => (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <div className={`px-3 py-1 ${getStatusBgColor(sectionType)} text-sm font-medium rounded-full`}>
            {approvals.length} items
          </div>
        </div>
        {approvals.length > 4 && (
          <button 
            onClick={() => setModalState(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
          >
            View All
          </button>
        )}
      </div>

      {/* Cards Grid - Show only first 4 cards OR empty state */}
      {approvals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
          {approvals.slice(0, 4).map((approval, index) => renderCard(approval, index, sectionType))}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4">
          {sectionType === 'approved' || sectionType === 'rejected' ? (
            // Full width card for approved/rejected empty states
            <div className="w-full">
              {renderEmptyStateCard(title, sectionType)}
            </div>
          ) : (
            // Grid layout for pending empty state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderEmptyStateCard(title, sectionType)}
            </div>
          )}
        </div>
      )}

      {/* View All Modal */}
      {modalState && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setModalState(false)}
        >
          <motion.div
            className="bg-slate-900/95 border border-white/20 rounded-3xl p-6 max-w-7xl w-full max-h-[95vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">All {title} Approvals</h3>
                  <p className="text-orange-400 text-base">{approvals.length} items</p>
                </div>
              </div>
              <button
                onClick={() => setModalState(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Box */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search approvals..."
                  className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Modal Content - Grid of all cards */}
            <div className="overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {approvals.map((approval, index) => (
                  <motion.div
                    key={index}
                    onClick={() => {
                      setActiveVehicle(approval._id || `${sectionType}-${index}`)
                      setActiveSection('vehicle')
                      setModalState(false)
                    }}
                  >
                    {renderCard(approval, index, sectionType)}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )

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

  const handleApprovalAction = (approvalId, section, action) => {
    setApprovals(prev => prev.map(approval => {
      if (approval._id === approvalId) {
        return { ...approval, approved_by_hq: action }
      }
      return approval
    }))
    setActiveSection(null)
    setActiveVehicle(null)
    setReviewMessage('')
  }

  return (
    <div className="w-full">
      {/* PENDING Section - Main Focus */}
      <div className="mb-12">
        {renderSection('PENDING', pendingApprovals, showPendingModal, setShowPendingModal, 'pending')}
      </div>

      {/* APPROVED Section - Separate Container */}
      <div className="mb-12">
        {renderSection('APPROVED', approvedApprovals, showApprovedModal, setShowApprovedModal, 'approved')}
      </div>

      {/* REJECTED Section - Separate Container */}
      <div className="mb-12">
        {renderSection('REJECTED', rejectedApprovals, showRejectedModal, setShowRejectedModal, 'rejected')}
      </div>

      {/* Modal - Outside the card structure */}
      <AnimatePresence>
        {activeVehicle && activeSection && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-slate-900/95 border border-white/20 rounded-3xl p-6 max-w-5xl w-full h-[85vh] flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {(() => {
                const currentApproval = approvals.find(a => a._id === activeVehicle)
                if (!currentApproval) return null
                
                const getSectionData = () => {
                  switch (activeSection) {
                    case 'vehicle':
                      return {
                        title: 'Vehicle Details',
                        icon: <Truck className="w-8 h-8" />,
                        data: currentApproval
                      }
                    case 'driver':
                      return {
                        title: 'Driver Details',
                        icon: <UserCheck className="w-8 h-8" />,
                        data: currentApproval
                      }
                    case 'checklist':
                      return {
                        title: 'Safety Checklist',
                        icon: <ClipboardCheck className="w-8 h-8" />,
                        data: currentApproval
                      }
                    default:
                      return null
                  }
                }
                
                const sectionData = getSectionData()
                if (!sectionData) return null
                
                return (
                  <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 flex-shrink-0">
                      <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-teal-500/20">
                          <div className="text-teal-400">
                            {sectionData.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">{sectionData.title}</h3>
                          <p className="text-teal-200 text-base">{currentApproval.custrecord_vehicle_number} • {currentApproval.custrecord_vehicle_type_ag}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveSection(null)
                          setActiveVehicle(null)
                          setReviewMessage('')
                        }}
                        className="text-white/70 hover:text-white transition-colors text-xl p-2 hover:bg-white/10 rounded-full"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
                      {activeSection === 'vehicle' && (
                        <div className="space-y-4">
                          {/* Basic Vehicle Information */}
                          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                            <h4 className="text-white font-bold text-lg mb-3">Basic Vehicle Information</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-teal-200 text-xs font-medium mb-1">Vehicle Number</p>
                                <p className="text-white font-semibold text-sm">{currentApproval.custrecord_vehicle_number}</p>
                              </div>
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-teal-200 text-xs font-medium mb-1">Current Plant</p>
                                <p className="text-white font-semibold text-sm">{currentApproval.currentPlant}</p>
                              </div>
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-teal-200 text-xs font-medium mb-1">Vehicle Type</p>
                                <p className="text-white font-semibold text-sm">{currentApproval.custrecord_vehicle_type_ag}</p>
                              </div>
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-teal-200 text-xs font-medium mb-1">Age of Vehicle</p>
                                <p className="text-white font-semibold text-sm">{currentApproval.custrecord_age_of_vehicle}</p>
                              </div>
                            </div>
                          </div>

                          {/* Technical Details */}
                          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                            <h4 className="text-white font-bold text-lg mb-3">Technical Details</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-teal-200 text-xs font-medium mb-1">Engine Number</p>
                                <p className="text-white font-semibold text-sm">{currentApproval.custrecord_engine_number_ag}</p>
                              </div>
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-teal-200 text-xs font-medium mb-1">Chassis Number</p>
                                <p className="text-white font-semibold text-sm">{currentApproval.custrecord_chassis_number}</p>
                              </div>
                            </div>
                          </div>

                          {/* Documentation */}
                          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                            <h4 className="text-white font-bold text-lg mb-3">Documentation</h4>
                            <div className="space-y-3">
                              {/* RC Document */}
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-white font-semibold text-base">RC Document</h5>
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(getDocumentStatus(currentApproval.custrecord_rc_start_date))} ${getStatusColor(getDocumentStatus(currentApproval.custrecord_rc_start_date))}`}>
                                    {getDocumentStatus(currentApproval.custrecord_rc_start_date)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-cyan-200 text-xs">RC Number</p>
                                    <p className="text-white font-semibold text-sm">{currentApproval.custrecord_rc_no}</p>
                                  </div>
                                  <div>
                                    <p className="text-cyan-200 text-xs">Start Date</p>
                                    <p className="text-white font-semibold text-sm">{formatDate(currentApproval.custrecord_rc_start_date)}</p>
                                  </div>
                                </div>
                                {currentApproval.custrecord_rc_doc_attach && currentApproval.custrecord_rc_doc_attach.length > 0 && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <Image className="w-4 h-4 text-cyan-400" />
                                    <button 
                                      onClick={() => window.open(currentApproval.custrecord_rc_doc_attach[0].url, '_blank')}
                                      className="text-cyan-200 text-xs hover:text-cyan-400 underline"
                                    >
                                      {currentApproval.custrecord_rc_doc_attach[0].fileName}
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Insurance */}
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-white font-semibold text-base">Insurance</h5>
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(getDocumentStatus(currentApproval.custrecord_insurance_end_date_ag))} ${getStatusColor(getDocumentStatus(currentApproval.custrecord_insurance_end_date_ag))}`}>
                                    {getDocumentStatus(currentApproval.custrecord_insurance_end_date_ag)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <div>
                                    <p className="text-cyan-200 text-xs">Company</p>
                                    <p className="text-white font-semibold text-sm">{currentApproval.custrecord_insurance_company_name_ag}</p>
                                  </div>
                                  <div>
                                    <p className="text-cyan-200 text-xs">Policy Number</p>
                                    <p className="text-white font-semibold text-sm">{currentApproval.custrecord_insurance_number_ag}</p>
                                  </div>
                                  <div>
                                    <p className="text-cyan-200 text-xs">Start Date</p>
                                    <p className="text-white font-semibold text-sm">{formatDate(currentApproval.custrecord_insurance_start_date_ag)}</p>
                                  </div>
                                  <div>
                                    <p className="text-cyan-200 text-xs">End Date</p>
                                    <p className="text-white font-semibold text-sm">{formatDate(currentApproval.custrecord_insurance_end_date_ag)}</p>
                                  </div>
                                </div>
                                {currentApproval.custrecord_insurance_attachment_ag && currentApproval.custrecord_insurance_attachment_ag.length > 0 && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <Image className="w-4 h-4 text-cyan-400" />
                                    <button 
                                      onClick={() => window.open(currentApproval.custrecord_insurance_attachment_ag[0].url, '_blank')}
                                      className="text-cyan-200 text-xs hover:text-cyan-400 underline"
                                    >
                                      {currentApproval.custrecord_insurance_attachment_ag[0].fileName}
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Permit */}
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-white font-semibold text-base">Permit</h5>
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(getDocumentStatus(currentApproval.custrecord_permit_end_date))} ${getStatusColor(getDocumentStatus(currentApproval.custrecord_permit_end_date))}`}>
                                    {getDocumentStatus(currentApproval.custrecord_permit_end_date)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-cyan-200 text-xs">Start Date</p>
                                    <p className="text-white font-semibold text-sm">{formatDate(currentApproval.custrecord_permit_start_date)}</p>
                                  </div>
                                  <div>
                                    <p className="text-cyan-200 text-xs">End Date</p>
                                    <p className="text-white font-semibold text-sm">{formatDate(currentApproval.custrecord_permit_end_date)}</p>
                                  </div>
                                </div>
                                {currentApproval.custrecord_permit_attachment_ag && currentApproval.custrecord_permit_attachment_ag.length > 0 && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <Image className="w-4 h-4 text-cyan-400" />
                                    <button 
                                      onClick={() => window.open(currentApproval.custrecord_permit_attachment_ag[0].url, '_blank')}
                                      className="text-cyan-200 text-xs hover:text-cyan-400 underline"
                                    >
                                      {currentApproval.custrecord_permit_attachment_ag[0].fileName}
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* PUC */}
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-white font-semibold text-base">PUC</h5>
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(getDocumentStatus(currentApproval.custrecord_puc_end_date_ag))} ${getStatusColor(getDocumentStatus(currentApproval.custrecord_puc_end_date_ag))}`}>
                                    {getDocumentStatus(currentApproval.custrecord_puc_end_date_ag)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                  <div>
                                    <p className="text-cyan-200 text-xs">PUC Number</p>
                                    <p className="text-white font-semibold text-sm">{currentApproval.custrecord_puc_number}</p>
                                  </div>
                                  <div>
                                    <p className="text-cyan-200 text-xs">Start Date</p>
                                    <p className="text-white font-semibold text-sm">{formatDate(currentApproval.custrecord_puc_start_date_ag)}</p>
                                  </div>
                                  <div>
                                    <p className="text-cyan-200 text-xs">End Date</p>
                                    <p className="text-white font-semibold text-sm">{formatDate(currentApproval.custrecord_puc_end_date_ag)}</p>
                                  </div>
                                </div>
                                {currentApproval.custrecord_puc_attachment_ag && currentApproval.custrecord_puc_attachment_ag.length > 0 && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <Image className="w-4 h-4 text-cyan-400" />
                                    <button 
                                      onClick={() => window.open(currentApproval.custrecord_puc_attachment_ag[0].url, '_blank')}
                                      className="text-cyan-200 text-xs hover:text-cyan-400 underline"
                                    >
                                      {currentApproval.custrecord_puc_attachment_ag[0].fileName}
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Fitness Certificate */}
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-white font-semibold text-base">Fitness Certificate</h5>
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(getDocumentStatus(currentApproval.custrecord_tms_vehicle_fit_cert_vld_upto))} ${getStatusColor(getDocumentStatus(currentApproval.custrecord_tms_vehicle_fit_cert_vld_upto))}`}>
                                    {getDocumentStatus(currentApproval.custrecord_tms_vehicle_fit_cert_vld_upto)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                  <div>
                                    <p className="text-cyan-200 text-xs">Valid Until</p>
                                    <p className="text-white font-semibold text-sm">{formatDate(currentApproval.custrecord_tms_vehicle_fit_cert_vld_upto)}</p>
                                  </div>
                                </div>
                                {currentApproval.custrecord_tms_vehicle_fit_cert_attach && currentApproval.custrecord_tms_vehicle_fit_cert_attach.length > 0 && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <Image className="w-4 h-4 text-cyan-400" />
                                    <button 
                                      onClick={() => window.open(currentApproval.custrecord_tms_vehicle_fit_cert_attach[0].url, '_blank')}
                                      className="text-cyan-200 text-xs hover:text-cyan-400 underline"
                                    >
                                      {currentApproval.custrecord_tms_vehicle_fit_cert_attach[0].fileName}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Vendor & Owner Information */}
                          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                            <h4 className="text-white font-bold text-lg mb-3">Vendor & Owner Information</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-cyan-200 text-xs font-medium mb-1">Vendor Name</p>
                                <p className="text-white font-semibold text-sm">{currentApproval.custrecord_vendor_name_ag.name}</p>
                              </div>
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-cyan-200 text-xs font-medium mb-1">Owner Name</p>
                                <p className="text-white font-semibold text-sm">{currentApproval.custrecord_owner_name_ag}</p>
                              </div>
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-cyan-200 text-xs font-medium mb-1">Owner Number</p>
                                <p className="text-white font-semibold text-sm">{currentApproval.custrecord_owner_no_ag}</p>
                              </div>
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-cyan-200 text-xs font-medium mb-1">Created By</p>
                                <p className="text-white font-semibold text-sm">{currentApproval.custrecord_create_by}</p>
                              </div>
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-cyan-200 text-xs font-medium mb-1">GPS Available</p>
                                <p className="text-white font-semibold text-sm">{currentApproval.custrecord_vehicle_master_gps_available ? 'Yes' : 'No'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Review Message Box - Now part of scrollable content */}
                          <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                            <label className="block text-cyan-200 text-xs font-medium mb-1">Review Message</label>
                            <textarea
                              value={reviewMessage}
                              onChange={(e) => setReviewMessage(e.target.value)}
                              placeholder="Enter your review message here..."
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                              rows={2}
                              maxLength={500}
                            />
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-cyan-200 text-xs">
                                {reviewMessage.length}/500 characters
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons - Now part of scrollable content */}
                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => handleApprovalAction(currentApproval._id, activeSection, 'approved')}
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-6 rounded-xl font-bold text-base hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <CheckCircle className="w-5 h-5 inline mr-2" />
                              Approve {sectionData.title}
                            </motion.button>
                            <motion.button
                              onClick={() => handleApprovalAction(currentApproval._id, activeSection, 'rejected')}
                              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl font-bold text-base hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <XCircle className="w-5 h-5 inline mr-2" />
                              Reject {sectionData.title}
                            </motion.button>
                          </div>
                        </div>
                      )}

                      {activeSection === 'driver' && (
                        <div className="space-y-4">
                          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                            <div className="text-center py-8">
                              <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                              <h4 className="text-white font-bold text-lg mb-2">No Driver Assigned</h4>
                              <p className="text-cyan-200 text-base">No driver has been assigned to this vehicle yet.</p>
                            </div>
                          </div>

                          {/* Review Message Box - Now part of scrollable content */}
                          <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                            <label className="block text-cyan-200 text-xs font-medium mb-1">Review Message</label>
                            <textarea
                              value={reviewMessage}
                              onChange={(e) => setReviewMessage(e.target.value)}
                              placeholder="Enter your review message here..."
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                              rows={2}
                              maxLength={500}
                            />
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-cyan-200 text-xs">
                                {reviewMessage.length}/500 characters
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons - Now part of scrollable content */}
                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => handleApprovalAction(currentApproval._id, activeSection, 'approved')}
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-6 rounded-xl font-bold text-base hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <CheckCircle className="w-5 h-5 inline mr-2" />
                              Approve {sectionData.title}
                            </motion.button>
                            <motion.button
                              onClick={() => handleApprovalAction(currentApproval._id, activeSection, 'rejected')}
                              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl font-bold text-base hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <XCircle className="w-5 h-5 inline mr-2" />
                              Reject {sectionData.title}
                            </motion.button>
                          </div>
                        </div>
                      )}

                      {activeSection === 'checklist' && currentApproval.checklist && (
                        <div className="space-y-4">
                          {/* Checklist Info */}
                          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-white font-bold text-lg">Checklist Information</h4>
                              <div className="text-cyan-200 text-sm">
                                {currentApproval.checklist.checklistItems.length} Items
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-cyan-200 text-xs">Checklist Name</p>
                                <p className="text-white font-semibold text-sm">{currentApproval.checklist.name}</p>
                              </div>
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-cyan-200 text-xs">Filled By</p>
                                <p className="text-white font-semibold text-sm">{currentApproval.checklist.filledBy}</p>
                              </div>
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-cyan-200 text-xs">Filled At</p>
                                <p className="text-white font-semibold text-sm">{formatDate(currentApproval.checklist.filledAt)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Checklist Items */}
                          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                            <h4 className="text-white font-bold text-lg mb-4">Checklist Items</h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                              {currentApproval.checklist.checklistItems.map((item, index) => (
                                <div key={index} className="p-3 bg-white/5 rounded-xl border border-white/10">
                                  <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-cyan-400 text-xs font-bold">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="text-white font-semibold text-sm mb-2">{item.question}</h5>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <p className="text-cyan-200 text-xs">Answer</p>
                                          <p className="text-white font-medium text-xs">{item.answer || 'Not answered'}</p>
                                        </div>
                                        <div>
                                          <p className="text-cyan-200 text-xs">Comment</p>
                                          <p className="text-white font-medium text-xs">{item.comment || 'No comment'}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Review Message Box - Now part of scrollable content */}
                          <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                            <label className="block text-cyan-200 text-xs font-medium mb-1">Review Message</label>
                            <textarea
                              value={reviewMessage}
                              onChange={(e) => setReviewMessage(e.target.value)}
                              placeholder="Enter your review message here..."
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                              rows={2}
                              maxLength={500}
                            />
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-cyan-200 text-xs">
                                {reviewMessage.length}/500 characters
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons - Now part of scrollable content */}
                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => handleApprovalAction(currentApproval._id, activeSection, 'approved')}
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-6 rounded-xl font-bold text-base hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <CheckCircle className="w-5 h-5 inline mr-2" />
                              Approve {sectionData.title}
                            </motion.button>
                            <motion.button
                              onClick={() => handleApprovalAction(currentApproval._id, activeSection, 'rejected')}
                              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl font-bold text-base hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <XCircle className="w-5 h-5 inline mr-2" />
                              Reject {sectionData.title}
                            </motion.button>
                          </div>
                        </div>
                      )}

                      {activeSection === 'checklist' && !currentApproval.checklist && (
                        <div className="space-y-4">
                          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                            <div className="text-center py-8">
                              <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                              <h4 className="text-white font-bold text-lg mb-2">No Checklist Done</h4>
                              <p className="text-cyan-200 text-base">No checklist has been completed for this vehicle yet.</p>
                            </div>
                          </div>

                          {/* Review Message Box - Now part of scrollable content */}
                          <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                            <label className="block text-cyan-200 text-xs font-medium mb-1">Review Message</label>
                            <textarea
                              value={reviewMessage}
                              onChange={(e) => setReviewMessage(e.target.value)}
                              placeholder="Enter your review message here..."
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                              rows={2}
                              maxLength={500}
                            />
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-cyan-200 text-xs">
                                {reviewMessage.length}/500 characters
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons - Now part of scrollable content */}
                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => handleApprovalAction(currentApproval._id, activeSection, 'approved')}
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-6 rounded-xl font-bold text-base hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <CheckCircle className="w-5 h-5 inline mr-2" />
                              Approve {sectionData.title}
                            </motion.button>
                            <motion.button
                              onClick={() => handleApprovalAction(currentApproval._id, activeSection, 'rejected')}
                              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl font-bold text-base hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <XCircle className="w-5 h-5 inline mr-2" />
                              Reject {sectionData.title}
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ApprovalCard 