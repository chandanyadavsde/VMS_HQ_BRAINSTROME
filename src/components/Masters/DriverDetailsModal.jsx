import React from 'react'
import { motion } from 'framer-motion'
import { X, User, Phone, FileText, Calendar, Car, UserCheck, Edit, Trash2, Settings, Eye, MapPin, Building2 } from 'lucide-react'

const DriverDetailsModal = ({ driver, onClose }) => {
  if (!driver) return null

  const isLicenseExpired = new Date(driver.licenseExpireDate) < new Date()
  const isLicenseExpiringSoon = new Date(driver.licenseExpireDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

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
                    {driver.contact}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Number:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {driver.licenseNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Expiry:</span>
                  <span className={`font-medium flex items-center gap-1 ${
                    isLicenseExpired ? 'text-red-600' : isLicenseExpiringSoon ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    <Calendar className="w-4 h-4" />
                    {driver.licenseExpireDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Created By:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <UserCheck className="w-4 h-4" />
                    {driver.createdBy}
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle Assignment */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-orange-600" />
                Vehicle Assignment
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Assigned Vehicle:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    {driver.vehicleAttached}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Assignment Status:</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Assignment Date:</span>
                  <span className="text-slate-800 font-medium">2024-01-15</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-6">
            {/* Driver Photo */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-600" />
                Driver Photo
              </h3>
              <div className="flex items-center justify-center p-8 bg-white rounded-lg border border-slate-200">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="w-12 h-12 text-slate-400" />
                  </div>
                  <p className="text-slate-600 text-sm">Driver Photo</p>
                  <button className="mt-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors text-sm font-medium">
                    View Full Image
                  </button>
                </div>
              </div>
            </div>

            {/* License Documents */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                License Documents
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-800">Driving License</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    isLicenseExpired ? 'text-red-600' : isLicenseExpiringSoon ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {isLicenseExpired ? 'Expired' : isLicenseExpiringSoon ? 'Expires Soon' : 'Valid'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-800">Medical Certificate</span>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Valid</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-800">Background Check</span>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Cleared</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-slate-800 text-sm">Driver assigned to vehicle</p>
                    <p className="text-slate-500 text-xs">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-slate-800 text-sm">License verification completed</p>
                    <p className="text-slate-500 text-xs">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-slate-800 text-sm">Medical certificate renewed</p>
                    <p className="text-slate-500 text-xs">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors font-medium">
              <Edit className="w-4 h-4" />
              Edit Driver
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors font-medium">
              <Car className="w-4 h-4" />
              Change Vehicle
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-medium">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DriverDetailsModal
