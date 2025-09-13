import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, MoreHorizontal, Plus, Car, User, Phone, MapPin, Building2, Calendar, UserCheck, Eye, FileText, AlertCircle, RefreshCw } from 'lucide-react'
import VehicleDetailsPopup from './VehicleDetailsPopup'
import ContactManagementModal from './ContactManagementModal'
import DriverManagementModal from './DriverManagementModal'
import DriverDetailsModal from './DriverDetailsModal'
import DriverFormModal from './Driver/DriverForm/DriverFormModal'
import VehicleFormModal from './Vehicle/VehicleForm/VehicleFormModal'
import LoadingSkeleton from './LoadingSkeleton'
import SearchResult from './SearchResult'
import PaginationControls from './PaginationControls'
import ImageModal from './ImageModal'
import VehicleService from '../../services/VehicleService'
import DriverService from '../../services/DriverService'

const MastersTable = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('vehicle') // 'vehicle' or 'driver'
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showDriverFormModal, setShowDriverFormModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [selectedVehicleForAction, setSelectedVehicleForAction] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImageData, setSelectedImageData] = useState(null)

  // API State
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchResult, setSearchResult] = useState(null)
  const [driverSearchResult, setDriverSearchResult] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalVehicles: 0,
    totalDrivers: 0,
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

  const fetchDrivers = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔍 MastersTable: Fetching drivers for page:', page)
      const response = await DriverService.getAllDrivers({ page, limit: 20 })
      console.log('📥 MastersTable: Received response:', response)
      setDrivers(response.drivers || [])
      setPagination(prev => ({
        ...prev,
        ...response.pagination,
        totalDrivers: response.pagination?.totalDrivers || 0
      }))
      console.log('✅ MastersTable: State updated with', response.drivers?.length || 0, 'drivers')
    } catch (err) {
      setError(err.message)
      console.error('❌ MastersTable: Error fetching drivers:', err)
      // Don't set drivers to empty array - keep existing data
      // setDrivers([]) // Removed this line to prevent clearing existing data
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

  const searchDriver = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setDriverSearchResult(null)
      return
    }

    try {
      setSearchLoading(true)
      setError(null)
      console.log('🔍 MastersTable: Searching for driver:', searchTerm.trim())
      const response = await DriverService.searchDriver(searchTerm.trim())
      console.log('📥 MastersTable: Driver search response received:', response)
      setDriverSearchResult(response)
    } catch (err) {
      console.error('❌ MastersTable: Driver search error:', err)
      setError(`Driver search failed: ${err.message}`)
      setDriverSearchResult(null)
    } finally {
      setSearchLoading(false)
    }
  }


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      if (viewMode === 'vehicle') {
        fetchVehicles(newPage)
      } else {
        fetchDrivers(newPage)
      }
    }
  }

  const createVehicle = async (vehicleData) => {
    try {
      console.log('🚗 MastersTable: Creating vehicle:', vehicleData)
      const response = await VehicleService.createVehicle(vehicleData)
      console.log('✅ MastersTable: Vehicle created successfully:', response)
      
      // Refresh the vehicle list
      await fetchVehicles()
      
      // Close the modal
      setShowVehicleModal(false)
      
      return response
    } catch (err) {
      console.error('❌ MastersTable: Error creating vehicle:', err)
      setError(err.message)
      throw err
    }
  }

  const createDriver = async (driverData) => {
    try {
      console.log('👤 MastersTable: Creating driver:', driverData)
      const response = await DriverService.createDriver(driverData)
      console.log('✅ MastersTable: Driver created successfully:', response)
      
      // Add the new driver to the existing list (optimistic update)
      if (response && response._id) {
        const newDriver = {
          ...response,
          // Transform API response to match our UI format
          name: response.custrecord_driver_name,
          contact: {
            phone: response.custrecord_driver_mobile_no
          },
          identification: {
            licenseNumber: response.custrecord_driving_license_no,
            licenseType: response.custrecord_license_category_ag,
            licenseStart: response.custrecord_driving_license_s_date,
            licenseExpiry: response.custrecord_driver_license_e_date,
            licenseTestStatus: response.custrecord_driving_lca_test || 'passed'
          },
          documents: response.custrecord_driving_license_attachment?.map(url => ({
            id: Date.now().toString(),
            fileName: url.split('/').pop(),
            url: url,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'Uploaded'
          })) || [],
          // Add missing properties that the UI expects
          assignedVehicles: response.assignedVehicle ? [response.assignedVehicle] : [],
          assignedVehicle: response.assignedVehicle || null
        }
        
        // Add to the beginning of the drivers list
        setDrivers(prev => [newDriver, ...prev])
        
        // Update pagination count
        setPagination(prev => ({
          ...prev,
          totalDrivers: (prev.totalDrivers || 0) + 1
        }))
        
        console.log('✅ MastersTable: Driver added to list successfully')
      }
      
      // Close the modal
      setShowDriverFormModal(false)
      
      return response
    } catch (err) {
      console.error('❌ MastersTable: Error creating driver:', err)
      // Don't set global error, let the form handle it
      throw err
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResult(null)
    setDriverSearchResult(null)
    setError(null)
  }

  // Clear driver data when switching to vehicle mode to prevent interference
  const clearDriverData = () => {
    setDrivers([])
    setDriverSearchResult(null)
  }

  // Effects
  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    console.log('🔄 View mode changed to:', viewMode)
    if (viewMode === 'driver') {
      console.log('🚀 Fetching drivers...')
      // Only fetch if we don't have drivers already
      if (drivers.length === 0) {
        fetchDrivers()
      } else {
        console.log('✅ Drivers already loaded, skipping fetch')
      }
    } else if (viewMode === 'vehicle') {
      // Clear driver data to prevent interference
      clearDriverData()
      // Ensure we have vehicle data when switching back to vehicle mode
      if (vehicles.length === 0) {
        console.log('🚀 Refreshing vehicle data...')
        fetchVehicles()
      }
    }
  }, [viewMode])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        if (viewMode === 'vehicle') {
          searchVehicle(searchQuery)
        } else {
          // Skip API call for driver search - use local filtering only
          // searchDriver(searchQuery) // Disabled API call
          console.log('🔍 Driver search using local filtering only')
        }
      } else {
        setSearchResult(null)
        setDriverSearchResult(null)
      }
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchQuery, viewMode])




  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.contact.phone.includes(searchQuery) ||
    driver.identification.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (driver.assignedVehicles && driver.assignedVehicles.length > 0 && driver.assignedVehicles[0].vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    driver.createdAt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle)
  }

  const handleDriverClick = (driver) => {
    console.log('🔄 Driver clicked (raw):', driver)
    console.log('🔄 Driver data structure:', {
      name: driver.name,
      contact: driver.contact,
      identification: driver.identification,
      assignedVehicles: driver.assignedVehicles || [],
      documents: driver.documents
    })
    setSelectedDriver(driver)
  }

  const handleDriverUpdate = (updatedDriverData) => {
    console.log('🔄 Updating driver in list:', updatedDriverData)
    
    // Transform the API response to match our UI format
    const updatedDriver = {
      id: updatedDriverData._id,
      name: updatedDriverData.custrecord_driver_name || 'N/A',
      contact: {
        phone: updatedDriverData.custrecord_driver_mobile_no || 'N/A',
        email: updatedDriverData.custrecord_driver_email || 'N/A',
        address: updatedDriverData.custrecord_driver_address || 'N/A'
      },
      identification: {
        licenseNumber: updatedDriverData.custrecord_driving_license_no || 'N/A',
        licenseType: updatedDriverData.custrecord_license_category_ag || 'N/A',
        licenseExpiry: updatedDriverData.custrecord_driver_license_e_date || 'N/A',
        licenseStart: updatedDriverData.custrecord_driving_license_s_date || 'N/A',
        aadharNumber: updatedDriverData.custrecord_driver_aadhar || 'N/A',
        panNumber: updatedDriverData.custrecord_driver_pan || 'N/A'
      },
      documents: updatedDriverData.custrecord_driving_license_attachment?.map((url, index) => ({
        id: `license_${index}`,
        type: 'Driving License',
        url: url,
        status: 'Valid'
      })) || [],
      status: updatedDriverData.approved_by_hq === 'approved' ? 'Active' : 'Pending',
      assignedVehicles: [],
      createdAt: updatedDriverData.createdAt || 'N/A',
      updatedAt: updatedDriverData.updatedAt || 'N/A',
      rawData: updatedDriverData
    }
    
    // Update the driver in the drivers list
    setDrivers(prev => prev.map(driver => 
      driver.id === updatedDriver.id ? updatedDriver : driver
    ))
    
    // Update the selected driver if it's the same one
    setSelectedDriver(updatedDriver)
    
    console.log('✅ Driver updated in list successfully')
  }

  const handleContactAction = (vehicle) => {
    setSelectedVehicleForAction(vehicle)
    setShowContactModal(true)
  }

  const handleDriverAction = (vehicle) => {
    setSelectedVehicleForAction(vehicle)
    setShowDriverModal(true)
  }

  const handleImageClick = (driver) => {
    console.log('🖼️ Image clicked for driver:', driver)
    console.log('🖼️ Driver documents:', driver.documents)
    console.log('🖼️ Raw data attachments:', driver.rawData?.custrecord_driving_license_attachment)
    
    // Get the first attachment URL
    const imageUrl = driver.documents && driver.documents.length > 0 
      ? driver.documents[0].url 
      : driver.rawData?.custrecord_driving_license_attachment?.[0]
    
    if (imageUrl) {
      setSelectedImageData({
        imageUrl,
        driverName: driver.name,
        licenseNumber: driver.identification?.licenseNumber || 'N/A'
      })
      setShowImageModal(true)
    } else {
      // Show placeholder modal for no image
      setSelectedImageData({
        imageUrl: null,
        driverName: driver.name,
        licenseNumber: driver.identification?.licenseNumber || 'N/A'
      })
      setShowImageModal(true)
    }
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
        {/* Header Section - Ultra Compressed */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800">Master Page</h1>
            <p className="text-slate-600 text-xs">Manage vehicles, drivers, and their relationships</p>
          </div>
          <motion.button
            onClick={() => {
              if (viewMode === 'vehicle') {
                setShowVehicleModal(true)
              } else {
                setShowDriverFormModal(true)
              }
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 font-medium text-xs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-3.5 h-3.5" />
            {viewMode === 'vehicle' ? '+ Vehicle' : '+ Driver'}
          </motion.button>
        </div>

        {/* Search and Filter Bar - Ultra Compact */}
        <div className="bg-slate-50 rounded-lg p-1.5 mb-2">
          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="flex-1 relative">
              {searchLoading ? (
                <RefreshCw className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-500 w-3.5 h-3.5 animate-spin" />
              ) : (
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              )}
              <input
                type="text"
                placeholder={viewMode === 'vehicle' ? "Search by vehicle number..." : "Search by driver name, license number..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-xs"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <AlertCircle className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* View Mode Toggle Icons - Compact */}
            <div className="flex items-center gap-0.5 bg-white rounded-md border border-slate-200 p-0.5">
              <button
                onClick={() => setViewMode('vehicle')}
                className={`flex items-center gap-1 px-2 py-1 rounded-sm transition-all text-xs font-medium ${
                  viewMode === 'vehicle'
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Car className="w-3 h-3" />
                Vehicle
              </button>
              <button
                onClick={() => {
                  console.log('🔄 Switching to driver view mode')
                  setViewMode('driver')
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-sm transition-all text-xs font-medium ${
                  viewMode === 'driver'
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-3 h-3" />
                Driver
              </button>
            </div>

            {/* Filter and Group Buttons - Only show in Vehicle mode - Ultra Compact */}
            {viewMode === 'vehicle' && (
              <div className="flex items-center gap-1">
                <button className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-orange-50 border border-slate-200 rounded-md text-slate-700 transition-colors text-xs font-medium">
                  <Filter className="w-3 h-3" />
                  Filter
                </button>
                <button className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-orange-50 border border-slate-200 rounded-md text-slate-700 transition-colors text-xs font-medium">
                  Group
                </button>
                <button className="p-1 bg-white hover:bg-orange-50 border border-slate-200 rounded-md text-slate-700 transition-colors">
                  <MoreHorizontal className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

                {/* Search Result Display - Only for Vehicle Mode */}
                <AnimatePresence>
                  {searchResult && viewMode === 'vehicle' && (
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

        {/* Top Pagination - Ultra Compact */}
        {!loading && !error && !searchResult && (viewMode === 'vehicle' ? vehicles.length > 0 : drivers.length > 0) && (
          <div className="mb-1">
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={viewMode === 'vehicle' ? pagination.totalVehicles : pagination.totalDrivers}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              position="top"
              compact={true}
            />
          </div>
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
              <div className="grid grid-cols-12 gap-2 items-center">
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
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <FileText className="w-3.5 h-3.5" />
                    License
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <Calendar className="w-3.5 h-3.5" />
                    Start
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <Calendar className="w-3.5 h-3.5" />
                    Expiry
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                    <Car className="w-3.5 h-3.5" />
                    Vehicle
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
          <div className="space-y-1 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
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
              filteredDrivers.map((driver, index) => {
                console.log('🔍 Driver data for table:', driver)
                console.log('📅 License start:', driver.identification?.licenseStart)
                console.log('📅 License expiry:', driver.identification?.licenseExpiry)
                return (
                <motion.div
                  key={driver.id}
                  className="bg-white rounded-lg p-1.5 shadow-sm hover:shadow-md border border-slate-100 hover:border-orange-200 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="grid grid-cols-12 gap-2 items-center">
                    {/* Name */}
                    <div className="col-span-2">
                      <button
                        onClick={() => handleDriverClick(driver)}
                        className="flex items-center gap-2 text-left w-full group-hover:bg-orange-50 p-1 rounded-lg transition-colors"
                      >
                        <div className="w-6 h-6 rounded-lg bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition-colors">
                          <User className="w-3 h-3 text-orange-600" />
                        </div>
                        <div className="font-semibold text-slate-800 text-xs">{driver.name}</div>
                      </button>
                    </div>

                    {/* Contact */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-green-100 flex items-center justify-center">
                          <Phone className="w-2.5 h-2.5 text-green-600" />
                        </div>
                        <div className="font-medium text-slate-800 text-xs">{driver.contact.phone}</div>
                      </div>
                    </div>

                    {/* License */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center">
                          <FileText className="w-2.5 h-2.5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800 text-xs">{driver.identification.licenseNumber}</div>
                        </div>
                      </div>
                    </div>

                    {/* License Start Date */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-800 text-xs">
                            {driver.identification?.licenseStart || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expire Date */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-800 text-xs">
                            {driver.identification?.licenseExpiry || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Attached */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1">
                        <Car className="w-3 h-3 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-800 text-xs">
                            {driver.assignedVehicles && driver.assignedVehicles.length > 0 ? driver.assignedVehicles[0].vehicleNumber : 'No Vehicle'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Created */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-700 text-xs font-medium">{driver.createdAt}</span>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => handleImageClick(driver)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        title="View License Document"
                      >
                        <Eye className="w-3 h-3 text-slate-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
                );
              })
            )}
          </div>

                     {/* Footer Info */}
           <div className="bg-slate-50 rounded-lg p-3 text-center">
             <p className="text-slate-600 text-xs">
               {viewMode === 'vehicle' ? (
                 <>
                   {searchResult ? '1 search result found' : vehicles.length > 0 ? 
                     `${pagination.totalVehicles} total vehicles` : 'No records found'} • 
                   <span className="ml-1 text-orange-600 font-medium">Click vehicle for details</span> • 
                   <span className="ml-1 text-blue-600 font-medium">Click driver to manage</span>
                 </>
               ) : (
                 <>
                   {searchQuery.trim() ? `${filteredDrivers.length} drivers found` : drivers.length > 0 ? 
                     `${pagination.totalDrivers} total drivers` : 'No records found'} • 
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
               totalItems={viewMode === 'vehicle' ? pagination.totalVehicles : pagination.totalDrivers}
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
              onDriverUpdate={handleDriverUpdate}
            />
          )}
        </AnimatePresence>

        {/* Vehicle Form Modal */}
        <AnimatePresence>
          {showVehicleModal && (
            <VehicleFormModal
              isOpen={showVehicleModal}
              onClose={() => setShowVehicleModal(false)}
              onCreateVehicle={createVehicle}
            />
          )}
        </AnimatePresence>

        {/* Driver Form Modal */}
        <AnimatePresence>
          {showDriverFormModal && (
            <DriverFormModal
              isOpen={showDriverFormModal}
              onClose={() => setShowDriverFormModal(false)}
              onCreateDriver={createDriver}
              currentTheme="teal"
            />
          )}
        </AnimatePresence>

        {/* Image Modal */}
        <AnimatePresence>
          {showImageModal && selectedImageData && (
            <ImageModal
              isOpen={showImageModal}
              onClose={() => {
                setShowImageModal(false)
                setSelectedImageData(null)
              }}
              imageUrl={selectedImageData.imageUrl}
              driverName={selectedImageData.driverName}
              licenseNumber={selectedImageData.licenseNumber}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

export default MastersTable
