import React from 'react'
import { motion } from 'framer-motion'
import { X, Car, User, Phone, MapPin, Building2, Calendar, FileText, Settings, Edit, Trash2, UserPlus, UserCheck } from 'lucide-react'

const VehicleDetailsPopup = ({ vehicle, onClose }) => {
  if (!vehicle) return null

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

      {/* Popup Content */}
      <motion.div
        className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-orange-200/30 shadow-2xl"
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
              <Car className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{vehicle.vehicleNumber}</h2>
              <p className="text-slate-600">Vehicle Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
            vehicle.status === 'Active' 
              ? 'bg-green-100 text-green-800 border-green-200'
              : vehicle.status === 'Pending'
              ? 'bg-orange-100 text-orange-800 border-orange-200'
              : 'bg-red-100 text-red-800 border-red-200'
          }`}>
            {vehicle.status}
          </span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            {/* Vehicle Information */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-orange-600" />
                Vehicle Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Vehicle Number:</span>
                  <span className="text-slate-800 font-medium">{vehicle.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Current Plant:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {vehicle.currentPlant}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Vendor:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {vehicle.vendorName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    vehicle.status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : vehicle.status === 'Pending'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Arrived at Plant:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {vehicle.arrivedAtPlant || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Created By:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <UserCheck className="w-4 h-4" />
                    {vehicle.createdBy || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Driver Information */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                Driver Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Driver Name:</span>
                  <span className="text-slate-800 font-medium">{vehicle.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Mobile Number:</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {vehicle.mobileNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Status:</span>
                  <span className="text-green-600 font-medium">Valid</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-6">
            {/* Documents */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Documents
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-800">Registration Certificate</span>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Valid</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-800">Insurance Certificate</span>
                  </div>
                  <span className="text-orange-600 text-sm font-medium">Expires Soon</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-800">PUC Certificate</span>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Valid</span>
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
                    <p className="text-slate-800 text-sm">Vehicle assigned to driver</p>
                    <p className="text-slate-500 text-xs">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-slate-800 text-sm">Maintenance completed</p>
                    <p className="text-slate-500 text-xs">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-slate-800 text-sm">Insurance renewed</p>
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
              Edit Vehicle
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors font-medium">
              <UserPlus className="w-4 h-4" />
              Assign Driver
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

export default VehicleDetailsPopup
