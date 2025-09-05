import baseApiService from './BaseApiService'

class VehicleService {
  constructor() {
    this.baseURL = '/vms' // Use relative path, baseApiService will handle the full URL
  }

  /**
   * Get all vehicles with pagination
   * @param {Object} params - Query parameters
   * @param {string} params.status - Vehicle status filter
   * @param {number} params.page - Page number (1-based)
   * @param {number} params.limit - Items per page
   * @param {boolean} params.includeDriver - Include driver information
   * @returns {Promise<Object>} API response with vehicles and pagination
   */
  async getAllVehicles(params = {}) {
    const defaultParams = {
      status: 'all',
      page: 1,
      limit: 20,
      includeDriver: true
    }

    const queryParams = { ...defaultParams, ...params }
    const queryString = new URLSearchParams(queryParams).toString()
    
    try {
      console.log('🚀 Fetching vehicles from API...')
      const response = await baseApiService.get(`/vms/vehicle/plant/all?${queryString}`)
      console.log('📥 API Response received:', response)
      return this.transformVehicleResponse(response)
    } catch (error) {
      console.error('❌ Error fetching vehicles:', error)
      // Return mock data if API fails
      return this.getMockData()
    }
  }

  /**
   * Search for a specific vehicle by vehicle number
   * @param {string} vehicleNumber - Vehicle number to search
   * @returns {Promise<Object>} Single vehicle data
   */
  async searchVehicle(vehicleNumber) {
    try {
      console.log('🔍 Searching for vehicle:', vehicleNumber)
      const response = await baseApiService.get(`/vms/vehicle/${vehicleNumber}/with-driver`)
      console.log('📥 Search response:', response)
      
      // Check if response is valid
      if (!response || !response.custrecord_vehicle_number) {
        throw new Error('Vehicle not found')
      }
      
      return this.transformSingleVehicleResponse(response)
    } catch (error) {
      console.error('❌ Error searching vehicle:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Transform API response for vehicle list
   * @param {Object} response - Raw API response
   * @returns {Object} Transformed response
   */
  transformVehicleResponse(response) {
    console.log('🔄 Transforming vehicle response:', response)
    
    if (!response) {
      return {
        vehicles: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalVehicles: 0,
          limit: 20,
          hasNext: false,
          hasPrev: false
        }
      }
    }

    // Handle the actual API response structure - vehicles array is directly in response
    const vehicles = response.vehicles || response.data || []
    const pagination = response.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalVehicles: vehicles.length || 0,
      limit: 20,
      hasNext: false,
      hasPrev: false
    }

    console.log('📊 Found vehicles:', vehicles.length)
    console.log('📊 Pagination:', pagination)

    return {
      vehicles: vehicles.map(vehicle => this.transformVehicleData(vehicle)),
      pagination: pagination
    }
  }

  /**
   * Transform single vehicle API response
   * @param {Object} response - Raw API response
   * @returns {Object} Transformed vehicle data
   */
  transformSingleVehicleResponse(response) {
    console.log('🔍 Transforming single vehicle response:', response)
    
    if (!response) {
      return null
    }

    // The search API returns the vehicle object directly
    const vehicleData = response
    const transformedVehicle = this.transformVehicleData(vehicleData)

    return {
      vehicle: transformedVehicle,
      isSearchResult: true
    }
  }

  /**
   * Transform individual vehicle data to match our table structure
   * @param {Object} vehicleData - Raw vehicle data from API
   * @returns {Object} Transformed vehicle data
   */
  transformVehicleData(vehicleData) {
    console.log('🔄 Transforming vehicle data:', vehicleData)
    
    const transformed = {
      id: vehicleData._id,
      vehicleNumber: vehicleData.custrecord_vehicle_number || 'N/A',
      driverName: vehicleData.assignedDriver?.custrecord_driver_name || 'No Driver Assigned',
      mobileNumber: vehicleData.assignedDriver?.custrecord_driver_mobile_no || 'N/A',
      status: 'available', // Static for now as per requirements
      currentPlant: vehicleData.currentPlant || 'N/A',
      vendorName: vehicleData.custrecord_vendor_name_ag?.name || 'N/A',
      arrivedAtPlant: this.formatChecklistDate(vehicleData.checklist?.date),
      createdBy: vehicleData.custrecord_create_by || 'N/A',
      contactPersons: vehicleData.contactPersons || [],
      
      // Additional data for modals
      rawData: vehicleData,
      hasDriver: !!vehicleData.assignedDriver,
      hasChecklist: !!vehicleData.checklist,
      hasContacts: vehicleData.contactPersons && vehicleData.contactPersons.length > 0
    }
    
    console.log('✅ Transformed vehicle:', transformed)
    return transformed
  }

  /**
   * Format checklist date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date or "Not Available"
   */
  formatChecklistDate(dateString) {
    if (!dateString) return 'Not Available'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Not Available'
      }
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      console.log('Date formatting error:', error, 'for date:', dateString)
      return 'Not Available'
    }
  }


  /**
   * Get mock data when API is not available
   * @returns {Object} Mock vehicle data
   */
  getMockData() {
    console.log('🔄 Using mock data as fallback...')
    
    // Create mock data that matches the real API structure
    const mockApiResponse = {
      vehicles: [
        {
          _id: 'mock-1',
          custrecord_vehicle_number: 'MH12XX1001',
          custrecord_vehicle_name_ag: 'Mock Vehicle 1',
          currentPlant: 'pune',
          assignedDriver: {
            _id: 'driver-1',
            custrecord_driver_name: 'John Doe',
            custrecord_driver_mobile_no: '9876543210'
          },
          custrecord_vendor_name_ag: {
            name: 'ABC Transport'
          },
          checklist: {
            date: '2024-01-15T00:00:00.000Z'
          },
          custrecord_create_by: 'Admin User',
          contactPersons: [
            { name: 'Rajesh Kumar', phone: '9876543210' }
          ]
        },
        {
          _id: 'mock-2',
          custrecord_vehicle_number: 'MH12XX1002',
          custrecord_vehicle_name_ag: 'Mock Vehicle 2',
          currentPlant: 'solapur',
          assignedDriver: {
            _id: 'driver-2',
            custrecord_driver_name: 'Jane Smith',
            custrecord_driver_mobile_no: '9876543211'
          },
          custrecord_vendor_name_ag: {
            name: 'XYZ Logistics'
          },
          checklist: {
            date: '2024-01-20T00:00:00.000Z'
          },
          custrecord_create_by: 'Manager',
          contactPersons: [
            { name: 'Priya Sharma', phone: '9876543211' }
          ]
        },
        {
          _id: 'mock-3',
          custrecord_vehicle_number: 'MH12XX1003',
          custrecord_vehicle_name_ag: 'Mock Vehicle 3',
          currentPlant: 'surat',
          assignedDriver: null, // No driver assigned
          custrecord_vendor_name_ag: {
            name: 'DEF Services'
          },
          checklist: null, // No checklist
          custrecord_create_by: 'Supervisor',
          contactPersons: []
        }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalVehicles: 3,
        limit: 20,
        hasNext: false,
        hasPrev: false
      }
    }

    // Transform the mock data using the same method as real API
    return this.transformVehicleResponse(mockApiResponse)
  }

  /**
   * Handle API errors with user-friendly messages
   * @param {Error} error - API error
   * @returns {Error} Formatted error
   */
  handleError(error) {
    console.error('VehicleService Error:', error)
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return new Error('Unable to connect to server. Please check if the API server is running on localhost:5000')
    }
    
    if (error.message.includes('404') || error.message.includes('Vehicle not found')) {
      return new Error('Vehicle not found. Please check the vehicle number and try again.')
    }
    
    if (error.message.includes('500')) {
      return new Error('Server error. Please try again later.')
    }
    
    if (error.message.includes('timeout')) {
      return new Error('Request timeout. Please try again.')
    }
    
    return new Error(error.message || 'An unexpected error occurred.')
  }
}

export default new VehicleService()