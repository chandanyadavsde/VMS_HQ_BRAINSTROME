import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, MoreHorizontal, Plus, Car, User, Phone, MapPin, Building2, Calendar, UserCheck, Eye, FileText, AlertCircle, RefreshCw } from 'lucide-react'
import VehicleDetailsPopup from './VehicleDetailsPopup'
import CreateOptionsModal from './CreateOptionsModal'
import ContactManagementModal from './ContactManagementModal'
import DriverManagementModal from './DriverManagementModal'
import DriverDetailsModal from './DriverDetailsModal'
import LoadingSkeleton from './LoadingSkeleton'
import SearchResult from './SearchResult'
import PaginationControls from './PaginationControls'
import VehicleService from '../../services/VehicleService'

const MastersTable = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('vehicle') // 'vehicle' or 'driver'
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [selectedVehicleForAction, setSelectedVehicleForAction] = useState(null)

  // API State
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchResult, setSearchResult] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalVehicles: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  })


  // API Functions
  const fetchVehicles = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 MastersTable: Fetching vehicles for page:', page)
      const response = await VehicleService.getAllVehicles({ page, limit: 20 })
      console.log('📥 MastersTable: Received response:', response)
      setVehicles(response.vehicles || [])
      setPagination(response.pagination || {})
      console.log('✅ MastersTable: State updated with', response.vehicles?.length || 0, 'vehicles')
    } catch (err) {
      setError(err.message)
      console.error('❌ MastersTable: Error fetching vehicles:', err)
    } finally {
      setLoading(false)
    }
  }

  const searchVehicle = async (vehicleNumber) => {
    if (!vehicleNumber.trim()) {
      setSearchResult(null)
      return
    }

    try {
      setSearchLoading(true)
      setError(null)
      console.log('🔍 MastersTable: Searching for vehicle:', vehicleNumber.trim())
      const response = await VehicleService.searchVehicle(vehicleNumber.trim())
      console.log('📥 MastersTable: Search response received:', response)
      setSearchResult(response)
    } catch (err) {
      console.error('❌ MastersTable: Search error:', err)
      setError(err.message)
      setSearchResult(null)
    } finally {
      setSearchLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchVehicles(newPage)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResult(null)
    setError(null)
  }

  // Effects
  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchVehicle(searchQuery)
      } else {
        setSearchResult(null)
      }
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Mock data for demonstration (will be removed after API integration)
  const mockVehicles = [
    {
      id: 1,
      vehicleNumber: 'MH-12-AB-1234',
      driverName: 'John Doe',
      mobileNumber: '+91-9876543210',
      otherContact: 'Rajesh Kumar',
      status: 'Active',
      currentPlant: 'Pune',
      vendorName: 'ABC Transport',
      arrivedAtPlant: '2024-01-15',
      createdBy: 'Admin User'
    },
    {
      id: 2,
      vehicleNumber: 'MH-12-CD-5678',
      driverName: 'Jane Smith',
      mobileNumber: '+91-9876543211',
      otherContact: 'Priya Sharma',
      status: 'Pending',
      currentPlant: 'Solapur',
      vendorName: 'XYZ Logistics',
      arrivedAtPlant: '2024-01-20',
      createdBy: 'Manager'
    },
    {
      id: 3,
      vehicleNumber: 'MH-12-EF-9012',
      driverName: 'Mike Wilson',
      mobileNumber: '+91-9876543212',
      otherContact: 'Amit Patel',
      status: 'Active',
      currentPlant: 'Surat',
      vendorName: 'DEF Services',
      arrivedAtPlant: '2024-01-25',
      createdBy: 'Supervisor'
    },
    {
      id: 4,
      vehicleNumber: 'MH-12-GH-3456',
      driverName: 'Sarah Johnson',
      mobileNumber: '+91-9876543213',
      otherContact: 'Suresh Singh',
      status: 'Inactive',
      currentPlant: 'Pune',
      vendorName: 'GHI Transport',
      arrivedAtPlant: '2024-01-30',
      createdBy: 'Admin User'
    },
    {
      id: 5,
      vehicleNumber: 'MH-12-IJ-7890',
      driverName: 'David Brown',
      mobileNumber: '+91-9876543214',
      otherContact: 'Neha Gupta',
      status: 'Active',
      currentPlant: 'Solapur',
      vendorName: 'JKL Logistics',
      arrivedAtPlant: '2024-02-01',
      createdBy: 'Manager'
    },
    {
      id: 6,
      vehicleNumber: 'MH-12-KL-2468',
      driverName: 'Emily Davis',
      mobileNumber: '+91-9876543215',
      otherContact: 'Vikram Mehta',
      status: 'Pending',
      currentPlant: 'Surat',
      vendorName: 'MNO Transport',
      arrivedAtPlant: '2024-02-05',
      createdBy: 'Supervisor'
    },
    {
      id: 7,
      vehicleNumber: 'MH-12-MN-1357',
      driverName: 'Robert Wilson',
      mobileNumber: '+91-9876543216',
      status: 'Active',
      currentPlant: 'Pune',
      vendorName: 'PQR Logistics',
      arrivedAtPlant: '2024-02-10',
      createdBy: 'Admin User'
    },
    {
      id: 8,
      vehicleNumber: 'MH-12-OP-9753',
      driverName: 'Lisa Anderson',
      mobileNumber: '+91-9876543217',
      status: 'Inactive',
      currentPlant: 'Solapur',
      vendorName: 'STU Services',
      arrivedAtPlant: '2024-02-15',
      createdBy: 'Manager'
    }
  ]

  // Mock data for drivers
  const mockDrivers = [
    {
      id: 1,
      name: 'John Doe',
      contact: '+91-9876543210',
      licenseNumber: 'DL123456789',
      licenseExpireDate: '2025-12-31',
      vehicleAttached: 'MH-12-AB-1234',
      createdBy: 'Admin User',
      imageUrl: '/images/drivers/john-doe.jpg'
    },
    {
      id: 2,
      name: 'Jane Smith',
      contact: '+91-9876543211',
      licenseNumber: 'DL987654321',
      licenseExpireDate: '2024-08-15',
      vehicleAttached: 'MH-12-CD-5678',
      createdBy: 'Manager',
      imageUrl: '/images/drivers/jane-smith.jpg'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      contact: '+91-9876543212',
      licenseNumber: 'DL456789123',
      licenseExpireDate: '2026-03-20',
      vehicleAttached: 'MH-12-EF-9012',
      createdBy: 'Supervisor',
      imageUrl: '/images/drivers/mike-wilson.jpg'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      contact: '+91-9876543213',
      licenseNumber: 'DL789123456',
      licenseExpireDate: '2024-11-10',
      vehicleAttached: 'MH-12-GH-3456',
      createdBy: 'Admin User',
      imageUrl: '/images/drivers/sarah-johnson.jpg'
    },
    {
      id: 5,
      name: 'David Brown',
      contact: '+91-9876543214',
      licenseNumber: 'DL321654987',
      licenseExpireDate: '2025-07-25',
      vehicleAttached: 'MH-12-IJ-7890',
      createdBy: 'Manager',
      imageUrl: '/images/drivers/david-brown.jpg'
    },
    {
      id: 6,
      name: 'Emily Davis',
      contact: '+91-9876543215',
      licenseNumber: 'DL654987321',
      licenseExpireDate: '2024-09-30',
      vehicleAttached: 'MH-12-KL-2468',
      createdBy: 'Supervisor',
      imageUrl: '/images/drivers/emily-davis.jpg'
    }
  ]

  const filteredVehicles = mockVehicles.filter(vehicle =>
    vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.mobileNumber.includes(searchQuery) ||
    vehicle.currentPlant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.arrivedAtPlant.includes(searchQuery) ||
    vehicle.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredDrivers = mockDrivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.contact.includes(searchQuery) ||
    driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.vehicleAttached.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle)
  }

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver)
  }

  const handleContactAction = (vehicle) => {
    setSelectedVehicleForAction(vehicle)
    setShowContactModal(true)
  }

  const handleDriverAction = (vehicle) => {
    setSelectedVehicleForAction(vehicle)
    setShowDriverModal(true)
  }



  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Compressed */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Master Page</h1>
            <p className="text-slate-600 text-xs">Manage vehicles, drivers, and their relationships</p>
          </div>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            Create
          </motion.button>
        </div>

                        {/* Search and Filter Bar */}
                <div className="bg-slate-50 rounded-lg p-2 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Search Box */}
                    <div className="flex-1 relative">
                      {searchLoading ? (
                        <RefreshCw className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      )}
                      <input
                        type="text"
                        placeholder={viewMode === 'vehicle' ? "Search by vehicle number..." : "Search drivers, license, vehicles..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                      />
                      {searchQuery && (
                        <button
                          onClick={clearSearch}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* View Mode Toggle Icons */}
                    <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 p-1">
                      <button
                        onClick={() => setViewMode('vehicle')}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all text-xs font-medium ${
                          viewMode === 'vehicle'
                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Car className="w-3.5 h-3.5" />
                        Vehicle
                      </button>
                      <button
                        onClick={() => setViewMode('driver')}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all text-xs font-medium ${
                          viewMode === 'driver'
                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        Driver
                      </button>
                    </div>

                    {/* Filter and Group Buttons - Only show in Vehicle mode */}
                    {viewMode === 'vehicle' && (
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 px-2.5 py-2 bg-white hover:bg-orange-50 border border-slate-200 rounded-lg text-slate-700 transition-colors text-xs font-medium">
                          <Filter className="w-3.5 h-3.5" />
                          Filter
                        </button>
                        <button className="flex items-center gap-1.5 px-2.5 py-2 bg-white hover:bg-orange-50 border border-slate-200 rounded-lg text-slate-700 transition-colors text-xs font-medium">
                          Group
                        </button>
                        <button className="p-2 bg-white hover:bg-orange-50 border border-slate-200 rounded-lg text-slate-700 transition-colors">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                                    </div>
                </div>

                {/* Search Result Display */}
                <AnimatePresence>
                  {searchResult && (
                    <SearchResult
                      result={searchResult}
                      onClose={clearSearch}
                      viewMode={viewMode}
                    />
                  )}
                </AnimatePresence>

                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <div>
                          <h3 className="text-sm font-semibold text-red-800">Error</h3>
                          <p className="text-sm text-red-600">{error}</p>
                        </div>
                        <button
                          onClick={() => setError(null)}
                          className="ml-auto p-1 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

        {/* Top Pagination - Extra Compact */}
        {!loading && !error && vehicles.length > 0 && (
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalVehicles}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            position="top"
            compact={true}
          />
        )}

        {/* Modern Card-Based Table - Compressed */}
        <div className="space-y-1">
          {/* Header Row - Sticky */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-sm border border-slate-100">
            {viewMode === 'vehicle' ? (
              // Vehicle Table Header
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <Car className="w-3.5 h-3.5" />
                    Vehicle
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <User className="w-3.5 h-3.5" />
                    Driver
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <Phone className="w-3.5 h-3.5" />
                    Mobile
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Status</div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <MapPin className="w-3.5 h-3.5" />
                    Plant
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <Building2 className="w-3.5 h-3.5" />
                    Vendor
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <Calendar className="w-3.5 h-3.5" />
                    Arrived
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <UserCheck className="w-3.5 h-3.5" />
                    Created
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Other</div>
                </div>
              </div>
            ) : (
              // Driver Table Header
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <User className="w-3.5 h-3.5" />
                    Name
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <Phone className="w-3.5 h-3.5" />
                    Contact
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <FileText className="w-3.5 h-3.5" />
                    License
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <Calendar className="w-3.5 h-3.5" />
                    Expire Date
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <Car className="w-3.5 h-3.5" />
                    Vehicle Attached
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <UserCheck className="w-3.5 h-3.5" />
                    Created
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <Eye className="w-3.5 h-3.5" />
                    Image
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Data Rows - Card Style */}
          <div className="space-y-1 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            {loading ? (
              <LoadingSkeleton viewMode={viewMode} />
            ) : viewMode === 'vehicle' ? (
              // Vehicle Data Rows
              vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                className="bg-white rounded-lg p-2 shadow-sm hover:shadow-md border border-slate-100 hover:border-orange-200 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="grid grid-cols-12 gap-3 items-center">
                  {/* Vehicle */}
                  <div className="col-span-2">
                    <button
                      onClick={() => handleVehicleClick(vehicle)}
                      className="flex items-center gap-2 text-left w-full group-hover:bg-orange-50 p-1.5 rounded-lg transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition-colors">
                        <Car className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-xs">{vehicle.vehicleNumber}</div>
                        <div className="text-xs text-slate-500">Vehicle ID</div>
                      </div>
                    </button>
                  </div>

                                     {/* Driver */}
                   <div className="col-span-2">
                     <button
                       onClick={() => handleDriverAction(vehicle)}
                       className="flex items-center gap-2 text-left w-full group-hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                     >
                       <div className="w-6 h-6 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                         <User className="w-3 h-3 text-blue-600" />
                       </div>
                       <div>
                         <div className="font-medium text-slate-800 text-xs">{vehicle.driverName}</div>
                         <div className="text-xs text-slate-500">Driver</div>
                       </div>
                     </button>
                   </div>

                                     {/* Mobile */}
                   <div className="col-span-2">
                     <div className="flex items-center gap-1.5">
                       <div className="w-5 h-5 rounded bg-green-100 flex items-center justify-center">
                         <Phone className="w-2.5 h-2.5 text-green-600" />
                       </div>
                       <div>
                         <div className="font-medium text-slate-800 text-xs">{vehicle.mobileNumber}</div>
                         <div className="text-xs text-slate-500">Contact</div>
                       </div>
                     </div>
                   </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>

                  {/* Plant */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-700 text-xs font-medium">{vehicle.currentPlant}</span>
                    </div>
                  </div>

                  {/* Vendor */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-700 text-xs font-medium">{vehicle.vendorName}</span>
                    </div>
                  </div>

                  {/* Arrived */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-700 text-xs font-medium">{vehicle.arrivedAtPlant}</span>
                    </div>
                  </div>

                  {/* Created */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-700 text-xs font-medium">{vehicle.createdBy}</span>
                    </div>
                  </div>

                                     {/* Actions */}
                   <div className="col-span-1 flex justify-center">
                     <button
                       onClick={() => handleContactAction(vehicle)}
                       className="p-1.5 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                       title="Manage Contacts"
                     >
                       <User className="w-3 h-3 text-purple-600" />
                     </button>
                   </div>
                </div>
              </motion.div>
              ))
            ) : (
              // Driver Data Rows
              filteredDrivers.map((driver, index) => (
                <motion.div
                  key={driver.id}
                  className="bg-white rounded-lg p-2 shadow-sm hover:shadow-md border border-slate-100 hover:border-orange-200 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* Name */}
                    <div className="col-span-2">
                      <button
                        onClick={() => handleDriverClick(driver)}
                        className="flex items-center gap-2 text-left w-full group-hover:bg-orange-50 p-1.5 rounded-lg transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition-colors">
                          <User className="w-3.5 h-3.5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-xs">{driver.name}</div>
                          <div className="text-xs text-slate-500">Driver</div>
                        </div>
                      </button>
                    </div>

                    {/* Contact */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded bg-green-100 flex items-center justify-center">
                          <Phone className="w-2.5 h-2.5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800 text-xs">{driver.contact}</div>
                          <div className="text-xs text-slate-500">Contact</div>
                        </div>
                      </div>
                    </div>

                    {/* License */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
                          <FileText className="w-2.5 h-2.5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800 text-xs">{driver.licenseNumber}</div>
                          <div className="text-xs text-slate-500">License</div>
                        </div>
                      </div>
                    </div>

                    {/* Expire Date */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-800 text-xs">{driver.licenseExpireDate}</div>
                          <div className="text-xs text-slate-500">Expires</div>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Attached */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1">
                        <Car className="w-3 h-3 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-800 text-xs">{driver.vehicleAttached}</div>
                          <div className="text-xs text-slate-500">Vehicle</div>
                        </div>
                      </div>
                    </div>

                    {/* Created */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-700 text-xs font-medium">{driver.createdBy}</span>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        title="View Driver Image"
                      >
                        <Eye className="w-3 h-3 text-slate-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

                     {/* Footer Info */}
           <div className="bg-slate-50 rounded-lg p-3 text-center">
             <p className="text-slate-600 text-xs">
               {viewMode === 'vehicle' ? (
                 <>
                   {searchResult ? '1 search result found' : vehicles.length > 0 ? `${pagination.totalVehicles} total vehicles` : 'No records found'} • 
                   <span className="ml-1 text-orange-600 font-medium">Click vehicle for details</span> • 
                   <span className="ml-1 text-blue-600 font-medium">Click driver to manage</span>
                 </>
               ) : (
                 <>
                   {drivers.length > 0 ? `${drivers.length} records found` : 'No records found'} • 
                   <span className="ml-1 text-orange-600 font-medium">Click driver name for details</span> • 
                   <span className="ml-1 text-slate-600 font-medium">Click eye icon to view image</span>
                 </>
               )}
             </p>
           </div>

           {/* Bottom Pagination Controls */}
           {!searchResult && !loading && (
             <PaginationControls
               currentPage={pagination.currentPage}
               totalPages={pagination.totalPages}
               totalItems={pagination.totalVehicles}
               itemsPerPage={pagination.limit}
               onPageChange={handlePageChange}
               hasNext={pagination.hasNext}
               hasPrev={pagination.hasPrev}
               position="bottom"
               compact={false}
             />
           )}
        </div>



        {/* Vehicle Details Popup */}
        <AnimatePresence>
          {selectedVehicle && (
            <VehicleDetailsPopup
              vehicle={selectedVehicle}
              onClose={() => setSelectedVehicle(null)}
            />
          )}
        </AnimatePresence>

        {/* Create Options Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateOptionsModal
              onClose={() => setShowCreateModal(false)}
              onSelectOption={(option) => {
                console.log(`Selected option: ${option}`)
                setShowCreateModal(false)
              }}
            />
          )}
        </AnimatePresence>

        {/* Contact Management Modal */}
        <AnimatePresence>
          {showContactModal && selectedVehicleForAction && (
            <ContactManagementModal
              vehicle={selectedVehicleForAction}
              onClose={() => {
                setShowContactModal(false)
                setSelectedVehicleForAction(null)
              }}
            />
          )}
        </AnimatePresence>

        {/* Driver Management Modal */}
        <AnimatePresence>
          {showDriverModal && selectedVehicleForAction && (
            <DriverManagementModal
              vehicle={selectedVehicleForAction}
              onClose={() => {
                setShowDriverModal(false)
                setSelectedVehicleForAction(null)
              }}
            />
          )}
        </AnimatePresence>

        {/* Driver Details Modal */}
        <AnimatePresence>
          {selectedDriver && (
            <DriverDetailsModal
              driver={selectedDriver}
              onClose={() => setSelectedDriver(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MastersTable
