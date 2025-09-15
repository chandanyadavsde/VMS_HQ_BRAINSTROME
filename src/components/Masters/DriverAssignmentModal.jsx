import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, User, Search, Car, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import DriverService from '../../services/DriverService'

const DriverAssignmentModal = ({ vehicle, onClose, onDriverAssigned }) => {
  const [assignmentMode, setAssignmentMode] = useState('existing') // 'existing' only
  const [availableDrivers, setAvailableDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDriver, setSelectedDriver] = useState(null)

  // Fetch available drivers when modal opens
  useEffect(() => {
    fetchAvailableDrivers()
  }, [])

  const fetchAvailableDrivers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await DriverService.getAllDrivers()
      // Filter out drivers that might already be assigned to other vehicles
      const unassignedDrivers = response.drivers || []
      setAvailableDrivers(unassignedDrivers)
    } catch (err) {
      setError('Failed to load available drivers')
      console.error('Error fetching drivers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignDriver = async (driver) => {
    setLoading(true)
    setError('')
    try {
      console.log('🔗 Assigning driver to vehicle:', { driver, vehicle })
      
      // Use the license-based assignment method that matches your API format
      const response = await DriverService.assignDriverToVehicleWithLicenseBody(
        vehicle.vehicleNumber || vehicle.custrecord_vehicle_number, 
        driver.identification?.licenseNumber
      )
      
      console.log('✅ Driver assignment successful:', response)
      
      setSuccess(true)
      setSelectedDriver(driver)
      
      // Notify parent component with the API response
      if (onDriverAssigned) {
        onDriverAssigned(vehicle, driver, response)
      }
      
      // Auto-close after success
      setTimeout(() => {
        onClose()
      }, 2000)
      
    } catch (err) {
      console.error('❌ Driver assignment failed:', err)
      setError(err.message || 'Failed to assign driver')
    } finally {
      setLoading(false)
    }
  }


  const filteredDrivers = availableDrivers.filter(driver =>
    driver.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.contact?.phone?.includes(searchQuery) ||
    driver.identification?.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!vehicle) return null

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

      <motion.div
        className="relative bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Car className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Assign Driver</h2>
              <p className="text-slate-600 text-sm">Vehicle: <span className="font-medium">{vehicle.vehicleNumber}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Success State */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Driver Assigned Successfully!</h3>
                <p className="text-green-700">
                  <strong>{selectedDriver?.name}</strong> has been assigned to vehicle <strong>{vehicle.vehicleNumber}</strong>
                </p>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">This modal will close automatically...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Assignment Failed</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Current Status */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <div>
              <h3 className="font-semibold text-amber-800">No Driver Assigned</h3>
              <p className="text-amber-700 text-sm">This vehicle currently has no assigned driver. Select a driver below to assign.</p>
            </div>
          </div>
        </div>

        {/* Driver Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Select Driver to Assign</h3>

          {/* Enhanced Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="🔍 Search by driver name, phone number, or license number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-lg placeholder-slate-400"
            />
            {searchQuery && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500">
                {filteredDrivers.length} found
              </div>
            )}
          </div>

          {/* Driver List */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-slate-600">Loading drivers...</span>
            </div>
          ) : filteredDrivers.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              {filteredDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-colors hover:shadow-sm"
                  onClick={() => handleAssignDriver(driver)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        {/* Driver Name - Most Prominent */}
                        <div className="text-lg font-bold text-slate-800 mb-1">
                          {driver.name || 'Unknown Driver'}
                        </div>
                        
                        {/* Driver Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
                          <div className="flex items-center gap-1 text-slate-600">
                            <span className="font-medium">Phone:</span>
                            <span>{driver.contact?.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <span className="font-medium">License:</span>
                            <span className="font-mono">{driver.identification?.licenseNumber || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <span className="font-medium">Category:</span>
                            <span>{driver.identification?.licenseCategory || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <span className="font-medium">Status:</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              driver.approvalStatus === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : driver.approvalStatus === 'pending'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {driver.approvalStatus || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Assign Button */}
                    <div className="flex flex-col items-end gap-2">
                      <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md">
                        Assign Driver
                      </button>
                      {driver.assignedVehicle && (
                        <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          Currently assigned to {driver.assignedVehicle.vehicleNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600">No drivers found</p>
              <p className="text-slate-500 text-sm">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DriverAssignmentModal
