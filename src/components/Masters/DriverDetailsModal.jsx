import React from 'react'
import { motion } from 'framer-motion'
import { X, User, Phone, FileText, Calendar, Car, UserCheck, Edit, Eye } from 'lucide-react'

const DriverDetailsModal = ({ driver, onClose }) => {
  if (!driver) return null

  const isLicenseExpired = new Date(driver.identification?.licenseExpiry) < new Date()
  const isLicenseExpiringSoon = new Date(driver.identification?.licenseExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  return (
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

      {/* Modal Content */}
      <motion.div
        className="relative bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl"
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
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{driver.name}</h2>
              <p className="text-slate-600">Driver Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* License Status Badge */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            isLicenseExpired 
              ? 'bg-red-100 text-red-800'
              : isLicenseExpiringSoon
              ? 'bg-orange-100 text-orange-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {isLicenseExpired ? 'License Expired' : isLicenseExpiringSoon ? 'License Expiring Soon' : 'License Valid'}
          </span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            {/* Driver Information */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                Driver Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Full Name:</span>
                  <span className="text-slate-800 font-medium">{driver.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Contact Number:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {driver.contact?.phone || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Number:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {driver.identification?.licenseNumber || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Type:</span>
                  <span className="text-slate-800 font-medium">
                    {driver.identification?.licenseType || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Start Date:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {driver.identification?.licenseStart || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Expiry:</span>
                  <span className={`font-medium flex items-center gap-1 ${
                    isLicenseExpired ? 'text-red-600' : isLicenseExpiringSoon ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    <Calendar className="w-4 h-4" />
                    {driver.identification?.licenseExpiry || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Test Status:</span>
                  <span className={`font-medium ${
                    driver.rawData?.custrecord_driving_lca_test === 'passed' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {driver.rawData?.custrecord_driving_lca_test || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Created By:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <UserCheck className="w-4 h-4" />
                    {driver.rawData?.custrecord_create_by_driver_master || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - License Document and Vehicle Assignment */}
          <div className="space-y-6">
            {/* License Photo */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-600" />
                License Document
              </h3>
              <div className="flex items-center justify-center p-8 bg-white rounded-lg border border-slate-200">
                {driver.rawData?.custrecord_driving_license_attachment && driver.rawData.custrecord_driving_license_attachment.length > 0 ? (
                  <div className="text-center">
                    <div className="w-32 h-24 mx-auto mb-4 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={driver.rawData.custrecord_driving_license_attachment[0]} 
                        alt="Driving License Document"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm">Driving License Document</p>
                    <button 
                      onClick={() => window.open(driver.rawData.custrecord_driving_license_attachment[0], '_blank')}
                      className="mt-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      View Full Image
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-slate-100 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-sm">No License Document Available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Assignment */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-orange-600" />
                Vehicle Assignment
              </h3>
              <div className="space-y-3">
                {driver.assignedVehicles && driver.assignedVehicles.length > 0 ? (
                  driver.assignedVehicles.map((vehicle, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600">Vehicle {index + 1}:</span>
                        <span className="text-slate-800 font-medium flex items-center gap-1">
                          <Car className="w-4 h-4" />
                          {vehicle.vehicleNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Vehicle Type:</span>
                        <span className="text-slate-800 font-medium">{vehicle.vehicleType || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Plant:</span>
                        <span className="text-slate-800 font-medium">{vehicle.plant || 'N/A'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <Car className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>No vehicles assigned</p>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex items-center justify-center mt-8 pt-6 border-t border-slate-200">
          <button className="flex items-center gap-2 px-6 py-3 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors font-medium">
            <Edit className="w-4 h-4" />
            Edit Driver
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DriverDetailsModal
