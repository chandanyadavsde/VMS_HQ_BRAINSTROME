/**
 * Vehicle Basic Info Form Section
 * Step 1 for vehicle creation - basic vehicle details
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Car, User, Building, Hash } from 'lucide-react'

const VehicleBasicInfo = ({ formData, setFormData, errors = {} }) => {
  const updateVehicleData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        [field]: value
      }
    }))
  }

  const vehicleTypes = [
    { value: 'ODC', label: 'ODC (Over Dimensional Cargo)' },
    { value: 'Lattice Tower', label: 'Lattice Tower' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Vehicle Information
        </h3>
        <p className="text-gray-600">
          Enter the basic details of your vehicle
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Number */}
        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Hash className="w-4 h-4 inline mr-2" />
            Vehicle Number *
          </label>
          <input
            type="text"
            placeholder="e.g., MH12AB1234"
            value={formData.vehicle.custrecord_vehicle_number || ''}
            onChange={(e) => updateVehicleData('custrecord_vehicle_number', e.target.value.toUpperCase())}
            className={`w-full px-4 py-4 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono text-lg tracking-wider ${
              errors.custrecord_vehicle_number ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          />
          {errors.custrecord_vehicle_number && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
              {errors.custrecord_vehicle_number}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Format: State(2) + District(2) + Series(1-2) + Number(4)
          </p>
        </div>

        {/* Vehicle Type */}
        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Car className="w-4 h-4 inline mr-2" />
            Vehicle Type *
          </label>
          <select
            value={formData.vehicle.custrecord_vehicle_type_ag || ''}
            onChange={(e) => updateVehicleData('custrecord_vehicle_type_ag', e.target.value)}
            className={`w-full px-4 py-4 bg-white border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
              errors.custrecord_vehicle_type_ag ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          >
            <option value="">Select Vehicle Type</option>
            {vehicleTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.custrecord_vehicle_type_ag && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
              {errors.custrecord_vehicle_type_ag}
            </p>
          )}
        </div>

        {/* Vehicle Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Vehicle Name / Model
          </label>
          <input
            type="text"
            placeholder="e.g., Tata 407, Mahindra Bolero"
            value={formData.vehicle.custrecord_vehicle_name_ag || ''}
            onChange={(e) => updateVehicleData('custrecord_vehicle_name_ag', e.target.value)}
            className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
          <p className="mt-2 text-xs text-gray-500">
            Optional: Brand and model of the vehicle
          </p>
        </div>

        {/* Owner Information Section */}
        <div className="md:col-span-2">
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              Owner Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Owner Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Owner Name
                </label>
                <input
                  type="text"
                  placeholder="Owner's full name"
                  value={formData.vehicle.custrecord_owner_name_ag || ''}
                  onChange={(e) => updateVehicleData('custrecord_owner_name_ag', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Owner Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Owner Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.vehicle.custrecord_owner_no_ag || ''}
                  onChange={(e) => updateVehicleData('custrecord_owner_no_ag', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details Section */}
        <div className="md:col-span-2">
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-gray-600" />
              Technical Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chassis Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Chassis Number
                </label>
                <input
                  type="text"
                  placeholder="Vehicle chassis number"
                  value={formData.vehicle.custrecord_chassis_number || ''}
                  onChange={(e) => updateVehicleData('custrecord_chassis_number', e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono"
                />
              </div>

              {/* Engine Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Engine Number
                </label>
                <input
                  type="text"
                  placeholder="Vehicle engine number"
                  value={formData.vehicle.custrecord_engine_number_ag || ''}
                  onChange={(e) => updateVehicleData('custrecord_engine_number_ag', e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono"
                />
              </div>

              {/* Vehicle Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Vehicle Age
                </label>
                <input
                  type="text"
                  placeholder="e.g., 5 years"
                  value={formData.vehicle.custrecord_age_of_vehicle || ''}
                  onChange={(e) => updateVehicleData('custrecord_age_of_vehicle', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
              </div>

              {/* GPS Available */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  GPS Availability
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gps"
                      value="true"
                      checked={formData.vehicle.custrecord_vehicle_master_gps_available === true}
                      onChange={(e) => updateVehicleData('custrecord_vehicle_master_gps_available', true)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">GPS Available</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gps"
                      value="false"
                      checked={formData.vehicle.custrecord_vehicle_master_gps_available === false}
                      onChange={(e) => updateVehicleData('custrecord_vehicle_master_gps_available', false)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No GPS</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <h5 className="font-semibold text-blue-900 mb-1">Required Information</h5>
            <p className="text-sm text-blue-700">
              Vehicle Number and Vehicle Type are mandatory fields. All other information can be added later.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default VehicleBasicInfo
