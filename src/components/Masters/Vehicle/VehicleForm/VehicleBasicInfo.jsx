import React from 'react'
import { motion } from 'framer-motion'
import { Car, Building2, Activity, Tag } from 'lucide-react'
import { getThemeColors } from '../../../../utils/theme.js'

const VehicleBasicInfo = ({ formData, setFormData, currentTheme = 'teal' }) => {
  const themeColors = getThemeColors(currentTheme)

  const vehicleTypes = [
    'Truck',
    'Van',
    'Car',
    'Bus',
    'Motorcycle',
    'Trailer',
    'Other'
  ]

  const vehicleStatuses = [
    'Active',
    'Inactive',
    'Maintenance',
    'Retired'
  ]

  const plants = [
    'Mumbai North',
    'Mumbai South',
    'Delhi Central',
    'Delhi East',
    'Bangalore North',
    'Bangalore South',
    'Chennai Central',
    'Kolkata East',
    'Hyderabad North'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8 text-orange-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Basic Vehicle Information</h3>
        <p className="text-gray-600">Enter the essential details for the vehicle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Number */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <Tag className="w-4 h-4 text-orange-500" />
            Vehicle Number *
          </label>
          <input
            type="text"
            value={formData.vehicleNumber}
            onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
            placeholder="e.g., MH01AB1234"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            required
          />
        </div>

        {/* Vehicle Type */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <Car className="w-4 h-4 text-orange-500" />
            Vehicle Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none cursor-pointer"
            required
          >
            {vehicleTypes.map(type => (
              <option key={type} value={type} className="bg-white text-gray-900">
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Plant */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <Building2 className="w-4 h-4 text-orange-500" />
            Plant Location *
          </label>
          <select
            value={formData.plant}
            onChange={(e) => handleInputChange('plant', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none cursor-pointer"
            required
          >
            <option value="" className="bg-white text-gray-900">Select Plant</option>
            {plants.map(plant => (
              <option key={plant} value={plant} className="bg-white text-gray-900">
                {plant}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <Activity className="w-4 h-4 text-orange-500" />
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none cursor-pointer"
            required
          >
            {vehicleStatuses.map(status => (
              <option key={status} value={status} className="bg-white text-gray-900">
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-gray-600 text-sm">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Optional description or notes about the vehicle"
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-gray-600 text-sm">Purchase Date</label>
            <input
              type="date"
              value={formData.purchaseDate || ''}
              onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      {!formData.vehicleNumber && (
        <motion.div
          className="bg-red-100 border border-red-300 rounded-xl p-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-red-600 text-sm">Vehicle number is required</p>
        </motion.div>
      )}

      {!formData.plant && (
        <motion.div
          className="bg-red-100 border border-red-300 rounded-xl p-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-red-600 text-sm">Plant location is required</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default VehicleBasicInfo
