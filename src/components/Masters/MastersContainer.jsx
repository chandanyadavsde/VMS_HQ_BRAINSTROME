import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Users, Link, Plus, Search, Filter, Building2, Activity } from 'lucide-react'
import { getThemeColors } from '../../utils/theme.js'
import { BaseModal } from '../common'
import useMasters from './hooks/useMasters.js'
import MastersHeader from './MastersHeader.jsx'
import MastersTabs from './MastersTabs.jsx'
import VehicleGrid from './Vehicle/VehicleGrid.jsx'
import DriverGrid from './Driver/DriverGrid.jsx'
import VehicleFormModal from './Vehicle/VehicleForm/VehicleFormModal.jsx'
import DriverFormModal from './Driver/DriverForm/DriverFormModal.jsx'
import AssignmentModal from './Assignment/AssignmentModal.jsx'
import UnifiedFormModal from './Unified/UnifiedFormModal.jsx'

const MastersContainer = ({ currentTheme = 'teal' }) => {
  const themeColors = getThemeColors(currentTheme)
  
  // Custom hook for masters data and operations
  const {
    vehicles,
    drivers,
    assignments,
    loading,
    error,
    createVehicle,
    createDriver,
    assignDriver,
    updateVehicle,
    updateDriver,
    deleteVehicle,
    deleteDriver,
    fetchVehicles,
    fetchDrivers,
    fetchAssignments
  } = useMasters()

  // UI State
  const [activeTab, setActiveTab] = useState('vehicles')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlant, setSelectedPlant] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [showUnifiedModal, setShowUnifiedModal] = useState(false)
  
  // Form State
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [editingDriver, setEditingDriver] = useState(null)
  const [selectedVehicleForAssignment, setSelectedVehicleForAssignment] = useState(null)

  // Fetch data on component mount
  useEffect(() => {
    fetchVehicles()
    fetchDrivers()
    fetchAssignments()
  }, [])

  // Filtered data based on search and filters
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesSearch = searchQuery === '' || 
        vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.plant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.drivers.some(driver => 
          driver.driverName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      
      const matchesPlant = selectedPlant === 'all' || vehicle.plant === selectedPlant
      const matchesStatus = selectedStatus === 'all' || vehicle.status === selectedStatus
      
      return matchesSearch && matchesPlant && matchesStatus
    })
  }, [vehicles, searchQuery, selectedPlant, selectedStatus])

  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => {
      const matchesSearch = searchQuery === '' || 
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.contact.phone.includes(searchQuery) ||
        driver.identification.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = selectedStatus === 'all' || driver.status === selectedStatus
      
      return matchesSearch && matchesStatus
    })
  }, [drivers, searchQuery, selectedStatus])

  // Event Handlers
  const handleAddNew = (type) => {
    setShowAddModal(false)
    switch (type) {
      case 'vehicle':
        setShowVehicleModal(true)
        break
      case 'driver':
        setShowDriverModal(true)
        break
      case 'both':
        setShowUnifiedModal(true)
        break
      default:
        break
    }
  }

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle)
    setShowVehicleModal(true)
  }

  const handleEditDriver = (driver) => {
    setEditingDriver(driver)
    setShowDriverModal(true)
  }

  const handleAssignDriver = (vehicle) => {
    setSelectedVehicleForAssignment(vehicle)
    setShowAssignmentModal(true)
  }

  const handleCloseModals = () => {
    setShowVehicleModal(false)
    setShowDriverModal(false)
    setShowAssignmentModal(false)
    setShowUnifiedModal(false)
    setEditingVehicle(null)
    setEditingDriver(null)
    setSelectedVehicleForAssignment(null)
  }

  // Get unique plants for filter
  const availablePlants = useMemo(() => {
    const plants = [...new Set(vehicles.map(v => v.plant))]
    return ['all', ...plants]
  }, [vehicles])

  // Get unique statuses for filter
  const availableStatuses = useMemo(() => {
    const statuses = [...new Set([
      ...vehicles.map(v => v.status),
      ...drivers.map(d => d.status)
    ])]
    return ['all', ...statuses]
  }, [vehicles, drivers])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 text-lg">Loading Masters...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-red-200/50 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              fetchVehicles()
              fetchDrivers()
              fetchAssignments()
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MastersHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPlant={selectedPlant}
        onPlantChange={setSelectedPlant}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        availablePlants={availablePlants}
        availableStatuses={availableStatuses}
        onAddNew={() => setShowAddModal(true)}
        currentTheme={currentTheme}
      />

      {/* Tabs */}
      <MastersTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        vehicleCount={filteredVehicles.length}
        driverCount={filteredDrivers.length}
        currentTheme={currentTheme}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'vehicles' && (
            <motion.div
              key="vehicles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VehicleGrid
                vehicles={filteredVehicles}
                onEditVehicle={handleEditVehicle}
                onDeleteVehicle={deleteVehicle}
                onAssignDriver={handleAssignDriver}
                currentTheme={currentTheme}
              />
            </motion.div>
          )}

          {activeTab === 'drivers' && (
            <motion.div
              key="drivers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DriverGrid
                drivers={filteredDrivers}
                onEditDriver={handleEditDriver}
                onDeleteDriver={deleteDriver}
                currentTheme={currentTheme}
              />
            </motion.div>
          )}

          {activeTab === 'assignments' && (
            <motion.div
              key="assignments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Link className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Assignment Management</h3>
                <p className={`text-lg mb-8 ${themeColors.accentText}`}>
                  Manage vehicle-driver assignments and relationships
                </p>
                <p className="text-white/60">Coming Soon...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add New Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-2xl w-full border border-orange-200/30 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Add New Master</h3>
                <p className="text-gray-600">Choose what you want to create</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Vehicle Only */}
                <motion.button
                  onClick={() => handleAddNew('vehicle')}
                  className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Car className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Vehicle Only</h4>
                  <p className="text-sm text-orange-100">Create a new vehicle</p>
                </motion.button>

                {/* Driver Only */}
                <motion.button
                  onClick={() => handleAddNew('driver')}
                  className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Driver Only</h4>
                  <p className="text-sm text-emerald-100">Create a new driver</p>
                </motion.button>

                {/* Vehicle + Driver */}
                <motion.button
                  onClick={() => handleAddNew('both')}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Link className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Vehicle + Driver</h4>
                  <p className="text-sm text-blue-100">Create both with assignment</p>
                </motion.button>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vehicle Form Modal */}
      <VehicleFormModal
        isOpen={showVehicleModal}
        onClose={handleCloseModals}
        vehicle={editingVehicle}
        onCreateVehicle={createVehicle}
        onUpdateVehicle={updateVehicle}
        currentTheme={currentTheme}
      />

      {/* Driver Form Modal */}
      <DriverFormModal
        isOpen={showDriverModal}
        onClose={handleCloseModals}
        driver={editingDriver}
        onCreateDriver={createDriver}
        onUpdateDriver={updateDriver}
        currentTheme={currentTheme}
      />

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={handleCloseModals}
        vehicle={selectedVehicleForAssignment}
        drivers={drivers}
        onAssignDriver={assignDriver}
        currentTheme={currentTheme}
      />

      {/* Unified Form Modal */}
      <UnifiedFormModal
        isOpen={showUnifiedModal}
        onClose={handleCloseModals}
        onCreateVehicle={createVehicle}
        onCreateDriver={createDriver}
        currentTheme={currentTheme}
      />
    </div>
  )
}

export default MastersContainer
