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
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
              <Car className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">{vehicle.vehicleNumber}</h2>
              <p className="text-lg text-slate-600">{vehicle.rawData?.custrecord_vehicle_name_ag || 'Vehicle'}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  vehicle.rawData?.custrecord_vehicle_type_ag === 'ODC' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {vehicle.rawData?.custrecord_vehicle_type_ag || 'N/A'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  approvalStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                  approvalStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                  approvalStatus.color === 'red' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <approvalStatus.icon className="w-4 h-4 inline mr-1" />
                  {approvalStatus.text}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-800">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {vehicle.currentPlant}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-orange-50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Driver Information */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                Driver Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="text-sm text-slate-600">License Number</label>
                  <p className="font-semibold text-slate-800">{vehicle.rawData?.assignedDriver?.custrecord_driving_license_no || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">License Category</label>
                  <p className="font-semibold text-slate-800">{vehicle.rawData?.assignedDriver?.custrecord_license_category_ag || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-600">Driver Status</label>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      driverApprovalStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                      driverApprovalStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                      driverApprovalStatus.color === 'red' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      <driverApprovalStatus.icon className="w-4 h-4 inline mr-1" />
                      {driverApprovalStatus.text}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      vehicle.rawData?.driverConfirmed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {vehicle.rawData?.driverConfirmed ? 'Confirmed' : 'Pending Confirmation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Specifications */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-600" />
                Vehicle Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600">Age</label>
                  <p className="font-semibold text-slate-800">{vehicle.rawData?.custrecord_age_of_vehicle || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Chassis Number</label>
                  <p className="font-semibold text-slate-800">{vehicle.rawData?.custrecord_chassis_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Engine Number</label>
                  <p className="font-semibold text-slate-800">{vehicle.rawData?.custrecord_engine_number_ag || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">GPS Available</label>
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    {vehicle.rawData?.custrecord_vehicle_master_gps_available ? (
                      <><CheckCircle className="w-4 h-4 text-green-600" /> Yes</>
                    ) : (
                      <><AlertTriangle className="w-4 h-4 text-orange-600" /> No</>
                    )}
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
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Legal Documents
              </h3>
              
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

            {/* Document Attachments Gallery */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-600" />
                Document Attachments
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* RC Documents */}
                {vehicle.rawData?.custrecord_rc_doc_attach?.map((doc, index) => (
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

                {/* Insurance Documents */}
                {vehicle.rawData?.custrecord_insurance_attachment_ag?.map((doc, index) => (
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

                {/* Permit Documents */}
                {vehicle.rawData?.custrecord_permit_attachment_ag?.map((doc, index) => (
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

                {/* PUC Documents */}
                {vehicle.rawData?.custrecord_puc_attachment_ag?.map((doc, index) => (
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

                {/* Fitness Documents */}
                {vehicle.rawData?.custrecord_tms_vehicle_fit_cert_attach?.map((doc, index) => (
                  <div key={`fitness-${index}`} className="group cursor-pointer" onClick={() => setSelectedImage(doc)}>
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
              </div>
            </div>
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