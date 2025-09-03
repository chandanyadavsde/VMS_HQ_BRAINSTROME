import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, MoreHorizontal, Plus, Car, User, Phone, MapPin, Building2, Calendar, UserCheck } from 'lucide-react'
import VehicleDetailsPopup from './VehicleDetailsPopup'
import CreateOptionsModal from './CreateOptionsModal'
import ContactManagementModal from './ContactManagementModal'
import DriverManagementModal from './DriverManagementModal'

const MastersTable = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [selectedVehicleForAction, setSelectedVehicleForAction] = useState(null)


  // Mock data for demonstration
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

  const filteredVehicles = mockVehicles.filter(vehicle =>
    vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.mobileNumber.includes(searchQuery) ||
    vehicle.currentPlant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.arrivedAtPlant.includes(searchQuery) ||
    vehicle.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle)
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
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Master Page</h1>
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
        <div className="bg-slate-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Search Box */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search vehicles, drivers, plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
              />
            </div>

            {/* Filter and Group Buttons */}
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
          </div>
        </div>

        {/* Modern Card-Based Table */}
        <div className="space-y-2">
          {/* Header Row - Sticky */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-slate-100">
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
                <div className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Actions</div>
              </div>
            </div>
          </div>

          {/* Data Rows - Card Style */}
          <div className="space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            {filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md border border-slate-100 hover:border-orange-200 transition-all duration-300 group"
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
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                        <User className="w-3 h-3 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 text-xs">{vehicle.driverName}</div>
                        <div className="text-xs text-slate-500">Driver</div>
                      </div>
                    </div>
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
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleContactAction(vehicle)}
                        className="p-1.5 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                        title="Manage Contacts"
                      >
                        <User className="w-3 h-3 text-purple-600" />
                      </button>
                      <button
                        onClick={() => handleDriverAction(vehicle)}
                        className="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                        title="Manage Driver"
                      >
                        <User className="w-3 h-3 text-blue-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <p className="text-slate-600 text-xs">
              {filteredVehicles.length > 0 ? `${filteredVehicles.length} records found` : 'No records found'} • 
              <span className="ml-1 text-orange-600 font-medium">Click on vehicle to view details</span>
            </p>
          </div>
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
      </div>
    </div>
  )
}

export default MastersTable
