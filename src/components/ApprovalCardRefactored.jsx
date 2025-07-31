import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Car, User, CheckSquare, FileText, MapPin, Clock, AlertCircle, CheckCircle, XCircle, Truck, UserCheck, ClipboardCheck, Calendar, Image, FileText as DocumentIcon } from 'lucide-react'
import { BaseCard, BaseModal, StatusBadge, ProgressBar, ActionButton } from './common'
import { formatDate, getDocumentStatus, getStatusColor, getStatusBgColor } from '../utils/common'

const ApprovalCardRefactored = ({ selectedPlant = 'all' }) => {
  const [activeSection, setActiveSection] = useState(null)
  const [activeVehicle, setActiveVehicle] = useState(null)
  const [reviewMessage, setReviewMessage] = useState('')
  
  // Real data structure (same as before)
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
      assignedDriver: null,
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
    // ... more approval data (simplified for brevity)
  ])

  const filteredApprovals = selectedPlant === 'all'
    ? approvals
    : approvals.filter(approval => approval.currentPlant.toLowerCase() === selectedPlant)

  const handleApprovalAction = (approvalId, section, action) => {
    console.log(`Action: ${action} for ${section} in approval ${approvalId}`)
    // Handle approval logic here
    setActiveVehicle(null)
    setActiveSection(null)
    setReviewMessage('')
  }

  const getSectionData = () => {
    if (!activeVehicle || !activeSection) return null
    
    const currentApproval = approvals.find(a => a._id === activeVehicle)
    if (!currentApproval) return null

    switch (activeSection) {
      case 'vehicle':
        return {
          title: 'Vehicle Details',
          icon: Car,
          data: currentApproval
        }
      case 'driver':
        return {
          title: 'Driver Details',
          icon: User,
          data: currentApproval.assignedDriver
        }
      case 'checklist':
        return {
          title: 'Checklist',
          icon: CheckSquare,
          data: currentApproval.checklist
        }
      default:
        return null
    }
  }

  return (
    <>
      {/* Approval Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredApprovals.map((approval) => (
          <BaseCard
            key={approval._id}
            onClick={() => setActiveVehicle(approval._id)}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{approval.custrecord_vehicle_number}</h3>
                  <p className="text-cyan-200 text-sm">{approval.custrecord_vehicle_type_ag}</p>
                </div>
              </div>
              <StatusBadge 
                status={approval.approved_by_hq} 
                text={approval.approved_by_hq} 
                size="sm"
              />
            </div>

            {/* Progress Section */}
            <div className="mb-4">
              <ProgressBar 
                progress={75} 
                showLabel={true}
                labelPosition="top"
              />
            </div>

            {/* Sub-cards */}
            <div className="grid grid-cols-3 gap-2">
              {/* Vehicle Details */}
              <motion.div
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  activeSection === 'vehicle' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveVehicle(approval._id)
                  setActiveSection('vehicle')
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-center">
                  <Car className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <p className="text-white text-xs font-medium">Vehicle</p>
                </div>
              </motion.div>

              {/* Driver Details */}
              <motion.div
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  activeSection === 'driver' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
                } ${!approval.assignedDriver ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (approval.assignedDriver) {
                    setActiveVehicle(approval._id)
                    setActiveSection('driver')
                  }
                }}
                whileHover={approval.assignedDriver ? { scale: 1.05 } : {}}
                whileTap={approval.assignedDriver ? { scale: 0.95 } : {}}
              >
                <div className="text-center">
                  <User className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <p className="text-white text-xs font-medium">
                    {approval.assignedDriver ? 'Driver' : 'No Driver'}
                  </p>
                </div>
              </motion.div>

              {/* Checklist */}
              <motion.div
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  activeSection === 'checklist' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
                } ${!approval.checklist ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (approval.checklist) {
                    setActiveVehicle(approval._id)
                    setActiveSection('checklist')
                  }
                }}
                whileHover={approval.checklist ? { scale: 1.05 } : {}}
                whileTap={approval.checklist ? { scale: 0.95 } : {}}
              >
                <div className="text-center">
                  <CheckSquare className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <p className="text-white text-xs font-medium">
                    {approval.checklist ? 'Checklist' : 'No Checklist'}
                  </p>
                </div>
              </motion.div>
            </div>
          </BaseCard>
        ))}
      </div>

      {/* Detail Modal using BaseModal */}
      <BaseModal
        isOpen={!!activeVehicle && !!activeSection}
        onClose={() => {
          setActiveVehicle(null)
          setActiveSection(null)
          setReviewMessage('')
        }}
        title={getSectionData()?.title}
      >
        {(() => {
          const sectionData = getSectionData()
          if (!sectionData) return null

          return (
            <div className="space-y-4">
              {/* Content based on section */}
              {activeSection === 'vehicle' && (
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                    <h4 className="text-white font-bold text-lg mb-3">Basic Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-cyan-200 text-sm">Vehicle Number</p>
                        <p className="text-white font-medium">{sectionData.data.custrecord_vehicle_number}</p>
                      </div>
                      <div>
                        <p className="text-cyan-200 text-sm">Vehicle Type</p>
                        <p className="text-white font-medium">{sectionData.data.custrecord_vehicle_type_ag}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'driver' && (
                sectionData.data ? (
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                      <h4 className="text-white font-bold text-lg mb-3">Driver Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-cyan-200 text-sm">Name</p>
                          <p className="text-white font-medium">{sectionData.data.name}</p>
                        </div>
                        <div>
                          <p className="text-cyan-200 text-sm">License</p>
                          <p className="text-white font-medium">{sectionData.data.license}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                    <div className="text-center py-8">
                      <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="text-white font-bold text-lg mb-2">No Driver Assigned</h4>
                      <p className="text-cyan-200 text-base">No driver has been assigned to this vehicle yet.</p>
                    </div>
                  </div>
                )
              )}

              {activeSection === 'checklist' && (
                sectionData.data ? (
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                      <h4 className="text-white font-bold text-lg mb-3">Checklist Information</h4>
                      <div className="space-y-3">
                        {sectionData.data.checklistItems.map((item, index) => (
                          <div key={index} className="bg-white/5 rounded-lg p-3">
                            <p className="text-white font-medium">{item.question}</p>
                            <p className="text-cyan-200 text-sm">{item.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                    <div className="text-center py-8">
                      <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="text-white font-bold text-lg mb-2">No Checklist Done</h4>
                      <p className="text-cyan-200 text-base">No checklist has been completed for this vehicle yet.</p>
                    </div>
                  </div>
                )
              )}

              {/* Review Message Box */}
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
                  <span className="text-cyan-200 text-xs">{reviewMessage.length}/500 characters</span>
                </div>
              </div>

              {/* Action Buttons using ActionButton component */}
              <div className="flex gap-3">
                <ActionButton
                  onClick={() => handleApprovalAction(activeVehicle, activeSection, 'approved')}
                  variant="success"
                  icon={CheckCircle}
                  className="flex-1"
                >
                  Approve {sectionData.title}
                </ActionButton>
                <ActionButton
                  onClick={() => handleApprovalAction(activeVehicle, activeSection, 'rejected')}
                  variant="danger"
                  icon={XCircle}
                  className="flex-1"
                >
                  Reject {sectionData.title}
                </ActionButton>
              </div>
            </div>
          )
        })()}
      </BaseModal>
    </>
  )
}

export default ApprovalCardRefactored 