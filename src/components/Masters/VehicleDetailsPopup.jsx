import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, Car, User, Phone, MapPin, Building2, Calendar, FileText, Settings, 
  Edit, Trash2, UserPlus, UserCheck, Shield, Clock, CheckCircle, 
  AlertTriangle, ExternalLink, Image as ImageIcon, Download, Eye
} from 'lucide-react'

const VehicleDetailsPopup = ({ vehicle, onClose }) => {
  const [activeTab, setActiveTab] = useState('rc')
  const [selectedImage, setSelectedImage] = useState(null)

  if (!vehicle) return null

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
        {/* ENHANCED Header Section - Vehicle Focused */}
        <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Car className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-1">{vehicle.vehicleNumber}</h2>
              <p className="text-xl text-orange-100 mb-3">{vehicle.rawData?.custrecord_vehicle_name_ag || 'Vehicle'}</p>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                  vehicle.rawData?.custrecord_vehicle_type_ag === 'ODC' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-purple-500 text-white'
                }`}>
                  {vehicle.rawData?.custrecord_vehicle_type_ag || 'N/A'}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                  approvalStatus.color === 'green' ? 'bg-green-500 text-white' :
                  approvalStatus.color === 'orange' ? 'bg-amber-500 text-white' :
                  approvalStatus.color === 'red' ? 'bg-red-500 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  <approvalStatus.icon className="w-4 h-4 inline mr-1" />
                  {approvalStatus.text}
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm text-white shadow-sm">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {vehicle.currentPlant}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Modify Button - Header Style */}
            <button
              onClick={() => console.log('Modify vehicle:', vehicle.vehicleNumber)}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-bold text-sm"
            >
              <Edit className="w-4 h-4" />
              Modify Vehicle
            </button>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - VEHICLE FOCUSED */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* PRIMARY: Vehicle Specifications - ENHANCED */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200 shadow-md">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                Vehicle Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <label className="text-sm text-slate-600 font-medium">Vehicle Age</label>
                  <p className="text-lg font-bold text-slate-800 mt-1">{vehicle.rawData?.custrecord_age_of_vehicle || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <label className="text-sm text-slate-600 font-medium">Chassis Number</label>
                  <p className="text-lg font-bold text-slate-800 mt-1 font-mono">{vehicle.rawData?.custrecord_chassis_number || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <label className="text-sm text-slate-600 font-medium">Engine Number</label>
                  <p className="text-lg font-bold text-slate-800 mt-1 font-mono">{vehicle.rawData?.custrecord_engine_number_ag || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <label className="text-sm text-slate-600 font-medium">GPS Tracking</label>
                  <p className="text-lg font-bold text-slate-800 mt-1 flex items-center gap-2">
                    {vehicle.rawData?.custrecord_vehicle_master_gps_available ? (
                      <><CheckCircle className="w-5 h-5 text-green-600" /> Available</>
                    ) : (
                      <><AlertTriangle className="w-5 h-5 text-orange-600" /> Not Available</>
                    )}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <label className="text-sm text-slate-600 font-medium">Current Status</label>
                  <p className="text-lg font-bold text-slate-800 mt-1 flex items-center gap-2">
                    {vehicle.rawData?.inTrip ? (
                      <><Car className="w-5 h-5 text-blue-600" /> In Trip</>
                    ) : (
                      <><MapPin className="w-5 h-5 text-green-600" /> Available</>
                    )}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <label className="text-sm text-slate-600 font-medium">Current Plant</label>
                  <p className="text-lg font-bold text-slate-800 mt-1 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    {vehicle.currentPlant}
                  </p>
                </div>
              </div>
            </div>

            {/* Ownership & Vendor */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-600" />
                Ownership & Vendor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600">Owner Name</label>
                  <p className="font-semibold text-slate-800">{vehicle.rawData?.custrecord_owner_name_ag || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Owner Contact</label>
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {vehicle.rawData?.custrecord_owner_no_ag || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Vendor</label>
                  <p className="font-semibold text-slate-800">{vehicle.vendorName}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Vendor Status</label>
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    {vehicle.rawData?.custrecord_vendor_name_ag?.isInactive ? (
                      <><AlertTriangle className="w-4 h-4 text-red-600" /> Inactive</>
                    ) : (
                      <><CheckCircle className="w-4 h-4 text-green-600" /> Active</>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Documents Tabs */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Legal Documents
                </h3>
                <button
                  onClick={() => console.log('Modify legal documents for vehicle:', vehicle.vehicleNumber)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm hover:shadow-md transition-all duration-300 font-medium text-xs"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Modify
                </button>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-slate-200 rounded-lg p-1">
                {[
                  { id: 'rc', label: 'RC Document', icon: FileText },
                  { id: 'insurance', label: 'Insurance', icon: Shield },
                  { id: 'permit', label: 'Permit', icon: Calendar },
                  { id: 'puc', label: 'PUC', icon: CheckCircle }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {activeTab === 'rc' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-600">RC Number</label>
                      <p className="font-semibold text-slate-800">{vehicle.rawData?.custrecord_rc_no || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Start Date</label>
                      <p className="font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_rc_start_date)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">End Date</label>
                      <p className="font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_rc_end_date)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Status</label>
                      <p className="font-semibold text-slate-800">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          getDocumentStatus(vehicle.rawData?.custrecord_rc_end_date).color === 'green' ? 'bg-green-100 text-green-800' :
                          getDocumentStatus(vehicle.rawData?.custrecord_rc_end_date).color === 'orange' ? 'bg-orange-100 text-orange-800' :
                          getDocumentStatus(vehicle.rawData?.custrecord_rc_end_date).color === 'red' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
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
                      <label className="text-sm text-slate-600">End Date</label>
                      <p className="font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_insurance_end_date_ag)}</p>
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
                      <label className="text-sm text-slate-600">End Date</label>
                      <p className="font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_permit_end_date)}</p>
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
                      <label className="text-sm text-slate-600">End Date</label>
                      <p className="font-semibold text-slate-800">{formatDate(vehicle.rawData?.custrecord_puc_end_date_ag)}</p>
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
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-600" />
                Document Attachments - {activeTab === 'rc' ? 'RC Document' : activeTab === 'insurance' ? 'Insurance' : activeTab === 'permit' ? 'Permit' : 'PUC'}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Show only images for the active tab */}
                {activeTab === 'rc' && vehicle.rawData?.custrecord_rc_doc_attach?.map((doc, index) => (
                  <div key={index} className="group cursor-pointer" onClick={() => setSelectedImage(doc)}>
                    <div className="aspect-square bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                      <img 
                        src={doc.url} 
                        alt={doc.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1 truncate">{doc.fileName}</p>
                  </div>
                ))}

                {activeTab === 'insurance' && vehicle.rawData?.custrecord_insurance_attachment_ag?.map((doc, index) => (
                  <div key={`insurance-${index}`} className="group cursor-pointer" onClick={() => setSelectedImage(doc)}>
                    <div className="aspect-square bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                      <img 
                        src={doc.url} 
                        alt={doc.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1 truncate">{doc.fileName}</p>
                  </div>
                ))}

                {activeTab === 'permit' && vehicle.rawData?.custrecord_permit_attachment_ag?.map((doc, index) => (
                  <div key={`permit-${index}`} className="group cursor-pointer" onClick={() => setSelectedImage(doc)}>
                    <div className="aspect-square bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                      <img 
                        src={doc.url} 
                        alt={doc.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1 truncate">{doc.fileName}</p>
                  </div>
                ))}

                {activeTab === 'puc' && vehicle.rawData?.custrecord_puc_attachment_ag?.map((doc, index) => (
                  <div key={`puc-${index}`} className="group cursor-pointer" onClick={() => setSelectedImage(doc)}>
                    <div className="aspect-square bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                      <img 
                        src={doc.url} 
                        alt={doc.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1 truncate">{doc.fileName}</p>
                  </div>
                ))}

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

            {/* Driver Assignment - MOVED BELOW LEGAL DOCUMENTS */}
            {vehicle.rawData?.assignedDriver && (
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Assigned Driver
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-slate-600">Driver Name</label>
                    <p className="font-semibold text-slate-800">{vehicle.driverName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Mobile Number</label>
                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {vehicle.mobileNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">License Category</label>
                    <p className="font-semibold text-slate-800">{vehicle.rawData?.assignedDriver?.custrecord_license_category_ag || 'N/A'}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    driverApprovalStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                    driverApprovalStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                    driverApprovalStatus.color === 'red' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    <driverApprovalStatus.icon className="w-4 h-4 inline mr-1" />
                    {driverApprovalStatus.text}
                  </span>
                  <button
                    onClick={() => console.log('View driver details:', vehicle.rawData?.assignedDriver)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm hover:shadow-md transition-all duration-300 font-medium text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </button>
                </div>
              </div>
            )}

            {/* No Driver Assigned State */}
            {!vehicle.rawData?.assignedDriver && (
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-600" />
                  Driver Assignment
                </h3>
                <div className="text-center py-4">
                  <User className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No driver assigned</p>
                  <p className="text-slate-500 text-sm mb-4">This vehicle is available for driver assignment</p>
                  <button
                    onClick={() => console.log('Assign driver to vehicle:', vehicle.vehicleNumber)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm mx-auto"
                  >
                    <UserPlus className="w-4 h-4" />
                    Assign Driver
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Contact Persons */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-600" />
                Contact Persons
              </h3>
              
              {vehicle.contactPersons && vehicle.contactPersons.length > 0 ? (
                <div className="space-y-3">
                  {vehicle.contactPersons.map((contact, index) => (
                    <div key={contact._id || index} className="bg-white rounded-lg p-4 border border-slate-200">
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
                        <div className="flex items-center gap-1">
                          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
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
              
              <button className="w-full mt-4 flex items-center justify-center gap-2 p-3 bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded-lg transition-colors">
                <UserPlus className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-700">Add Contact</span>
              </button>
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