import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, User, Phone, Plus, Trash2, Edit, Car, UserCheck } from 'lucide-react'

const DriverManagementModal = ({ vehicle, onClose }) => {
  const [drivers, setDrivers] = useState([
    { 
      id: 1, 
      name: vehicle?.driverName || 'John Doe', 
      phone: vehicle?.mobileNumber || '+91-9876543210', 
      license: 'DL123456789', 
      status: 'Active',
      assignedDate: '2024-01-15'
    }
  ])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', license: '', status: 'Active' })

  const handleAddDriver = () => {
    if (newDriver.name && newDriver.phone && newDriver.license) {
      setDrivers([...drivers, { ...newDriver, id: Date.now(), assignedDate: new Date().toISOString().split('T')[0] }])
      setNewDriver({ name: '', phone: '', license: '', status: 'Active' })
      setShowAddForm(false)
    }
  }

  const handleRemoveDriver = (id) => {
    setDrivers(drivers.filter(driver => driver.id !== id))
  }

  const handleAssignDriver = (driverId) => {
    // Logic to assign driver to vehicle
    console.log(`Assigning driver ${driverId} to vehicle ${vehicle.vehicleNumber}`)
  }

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

      {/* Modal Content */}
      <motion.div
        className="relative bg-white rounded-lg p-6 max-w-2xl w-full border border-slate-200 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Driver Management</h2>
            <p className="text-slate-600 text-sm">Manage drivers for {vehicle.vehicleNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Current Drivers */}
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Current Drivers</h3>
          {drivers.map((driver) => (
            <div key={driver.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{driver.name}</div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      {driver.phone}
                    </div>
                    <div className="text-xs text-slate-500">License: {driver.license}</div>
                    <div className="text-xs text-slate-500">Assigned: {driver.assignedDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    driver.status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {driver.status}
                  </span>
                  <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button 
                    onClick={() => handleRemoveDriver(driver.id)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Driver */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 p-4 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-700">Add New Driver</span>
          </button>
        ) : (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-3">Add New Driver</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Driver Name"
                value={newDriver.name}
                onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newDriver.phone}
                onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="License Number"
                value={newDriver.license}
                onChange={(e) => setNewDriver({ ...newDriver, license: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <select
                value={newDriver.status}
                onChange={(e) => setNewDriver({ ...newDriver, status: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddDriver}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                >
                  Add Driver
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-slate-600 text-sm">
              {drivers.length} driver{drivers.length !== 1 ? 's' : ''} assigned
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DriverManagementModal
