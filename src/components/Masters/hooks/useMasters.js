import { useState, useEffect, useCallback } from 'react'
import { apiService } from '../../../services/index.js'

const useMasters = () => {
  // State
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Mock data for development
  const mockVehicles = [
    {
      id: 'VH001',
      vehicleNumber: 'MH01AB1234',
      plant: 'Mumbai North',
      status: 'Active',
      type: 'Truck',
      specifications: {
        make: 'Tata',
        model: 'Ace',
        year: 2023,
        color: 'White',
        engineNumber: 'ENG001',
        chassisNumber: 'CHS001'
      },
      drivers: [
        {
          driverId: 'D001',
          driverName: 'John Doe',
          type: 'Primary',
          status: 'Active',
          assignedDate: '2024-01-15'
        },
        {
          driverId: 'D002',
          driverName: 'Jane Smith',
          type: 'Backup',
          status: 'Active',
          assignedDate: '2024-01-20'
        }
      ],
      otherPersonnel: [
        {
          personId: 'P001',
          personName: 'Mike Wilson',
          role: 'Mechanic',
          status: 'Active',
          assignedDate: '2024-01-10'
        }
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 'VH002',
      vehicleNumber: 'MH02CD5678',
      plant: 'Mumbai South',
      status: 'Maintenance',
      type: 'Van',
      specifications: {
        make: 'Mahindra',
        model: 'Bolero',
        year: 2022,
        color: 'Blue',
        engineNumber: 'ENG002',
        chassisNumber: 'CHS002'
      },
      drivers: [
        {
          driverId: 'D003',
          driverName: 'Bob Johnson',
          type: 'Primary',
          status: 'Active',
          assignedDate: '2024-01-05'
        }
      ],
      otherPersonnel: [],
      createdAt: '2024-01-02',
      updatedAt: '2024-01-10'
    }
  ]

  const mockDrivers = [
    {
      id: 'D001',
      name: 'John Doe',
      contact: {
        phone: '+91 98765 43210',
        email: 'john.doe@example.com',
        address: 'Mumbai, Maharashtra'
      },
      identification: {
        licenseNumber: 'DL123456789',
        licenseType: 'Heavy Vehicle',
        licenseExpiry: '2025-12-31',
        aadharNumber: '1234 5678 9012',
        panNumber: 'ABCDE1234F'
      },
      documents: [
        {
          id: 'DOC001',
          type: 'License',
          url: '/documents/license.pdf',
          expiryDate: '2025-12-31',
          status: 'Valid'
        }
      ],
      status: 'Active',
      assignedVehicles: [
        {
          vehicleId: 'VH001',
          vehicleNumber: 'MH01AB1234',
          type: 'Primary',
          status: 'Active',
          assignedDate: '2024-01-15'
        }
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 'D002',
      name: 'Jane Smith',
      contact: {
        phone: '+91 98765 43211',
        email: 'jane.smith@example.com',
        address: 'Mumbai, Maharashtra'
      },
      identification: {
        licenseNumber: 'DL123456790',
        licenseType: 'Heavy Vehicle',
        licenseExpiry: '2026-06-30',
        aadharNumber: '1234 5678 9013',
        panNumber: 'ABCDE1235F'
      },
      documents: [
        {
          id: 'DOC002',
          type: 'License',
          url: '/documents/license2.pdf',
          expiryDate: '2026-06-30',
          status: 'Valid'
        }
      ],
      status: 'Active',
      assignedVehicles: [
        {
          vehicleId: 'VH001',
          vehicleNumber: 'MH01AB1234',
          type: 'Backup',
          status: 'Active',
          assignedDate: '2024-01-20'
        }
      ],
      createdAt: '2024-01-02',
      updatedAt: '2024-01-20'
    }
  ]

  // API Functions
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, use mock data
      // In production, this would be: const response = await apiService.get('/vehicles')
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      setVehicles(mockVehicles)
    } catch (err) {
      setError('Failed to fetch vehicles')
      console.error('Error fetching vehicles:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, use mock data
      // In production, this would be: const response = await apiService.get('/drivers')
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      setDrivers(mockDrivers)
    } catch (err) {
      setError('Failed to fetch drivers')
      console.error('Error fetching drivers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, use mock data
      // In production, this would be: const response = await apiService.get('/assignments')
      await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay
      setAssignments([]) // Will be populated from vehicle-driver relationships
    } catch (err) {
      setError('Failed to fetch assignments')
      console.error('Error fetching assignments:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createVehicle = useCallback(async (vehicleData) => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, use mock data
      // In production, this would be: const response = await apiService.post('/vehicles', vehicleData)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      const newVehicle = {
        id: `VH${String(vehicles.length + 1).padStart(3, '0')}`,
        ...vehicleData,
        drivers: [],
        otherPersonnel: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      
      setVehicles(prev => [...prev, newVehicle])
      return newVehicle
    } catch (err) {
      setError('Failed to create vehicle')
      console.error('Error creating vehicle:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [vehicles.length])

  const createDriver = useCallback(async (driverData) => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, use mock data
      // In production, this would be: const response = await apiService.post('/drivers', driverData)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      const newDriver = {
        id: `D${String(drivers.length + 1).padStart(3, '0')}`,
        ...driverData,
        assignedVehicles: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      
      setDrivers(prev => [...prev, newDriver])
      return newDriver
    } catch (err) {
      setError('Failed to create driver')
      console.error('Error creating driver:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [drivers.length])

  const updateVehicle = useCallback(async (vehicleId, vehicleData) => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, use mock data
      // In production, this would be: const response = await apiService.put(`/vehicles/${vehicleId}`, vehicleData)
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API delay
      
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, ...vehicleData, updatedAt: new Date().toISOString().split('T')[0] }
          : vehicle
      ))
    } catch (err) {
      setError('Failed to update vehicle')
      console.error('Error updating vehicle:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateDriver = useCallback(async (driverId, driverData) => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, use mock data
      // In production, this would be: const response = await apiService.put(`/drivers/${driverId}`, driverData)
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API delay
      
      setDrivers(prev => prev.map(driver => 
        driver.id === driverId 
          ? { ...driver, ...driverData, updatedAt: new Date().toISOString().split('T')[0] }
          : driver
      ))
    } catch (err) {
      setError('Failed to update driver')
      console.error('Error updating driver:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteVehicle = useCallback(async (vehicleId) => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, use mock data
      // In production, this would be: const response = await apiService.delete(`/vehicles/${vehicleId}`)
      await new Promise(resolve => setTimeout(resolve, 600)) // Simulate API delay
      
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId))
    } catch (err) {
      setError('Failed to delete vehicle')
      console.error('Error deleting vehicle:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteDriver = useCallback(async (driverId) => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, use mock data
      // In production, this would be: const response = await apiService.delete(`/drivers/${driverId}`)
      await new Promise(resolve => setTimeout(resolve, 600)) // Simulate API delay
      
      setDrivers(prev => prev.filter(driver => driver.id !== driverId))
    } catch (err) {
      setError('Failed to delete driver')
      console.error('Error deleting driver:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const assignDriver = useCallback(async (vehicleId, driverId, assignmentData) => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, use mock data
      // In production, this would be: const response = await apiService.post(`/vehicles/${vehicleId}/drivers`, { driverId, ...assignmentData })
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API delay
      
      const driver = drivers.find(d => d.id === driverId)
      const vehicle = vehicles.find(v => v.id === vehicleId)
      
      if (driver && vehicle) {
        // Update vehicle with new driver assignment
        setVehicles(prev => prev.map(v => 
          v.id === vehicleId 
            ? {
                ...v,
                drivers: [...v.drivers, {
                  driverId: driver.id,
                  driverName: driver.name,
                  ...assignmentData,
                  assignedDate: new Date().toISOString().split('T')[0]
                }]
              }
            : v
        ))
        
        // Update driver with new vehicle assignment
        setDrivers(prev => prev.map(d => 
          d.id === driverId 
            ? {
                ...d,
                assignedVehicles: [...d.assignedVehicles, {
                  vehicleId: vehicle.id,
                  vehicleNumber: vehicle.vehicleNumber,
                  ...assignmentData,
                  assignedDate: new Date().toISOString().split('T')[0]
                }]
              }
            : d
        ))
      }
    } catch (err) {
      setError('Failed to assign driver')
      console.error('Error assigning driver:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [drivers, vehicles])

  return {
    // Data
    vehicles,
    drivers,
    assignments,
    
    // State
    loading,
    error,
    
    // Actions
    fetchVehicles,
    fetchDrivers,
    fetchAssignments,
    createVehicle,
    createDriver,
    updateVehicle,
    updateDriver,
    deleteVehicle,
    deleteDriver,
    assignDriver
  }
}

export default useMasters
