import baseApiService from './BaseApiService'

class DriverService {
  constructor() {
    this.baseURL = '/vms' // Use relative path, baseApiService will handle the full URL
  }

  /**
   * Get all drivers with pagination
   * @param {Object} params - Query parameters
   * @param {string} params.status - Driver status filter
   * @param {number} params.page - Page number (1-based)
   * @param {number} params.limit - Items per page
   * @param {boolean} params.includeVehicle - Include assigned vehicle information
   * @returns {Promise<Object>} API response with drivers and pagination
   */
  async getAllDrivers(params = {}) {
    const defaultParams = {
      status: 'all',
      page: 1,
      limit: 20,
      includeVehicle: true
    }

    const queryParams = { ...defaultParams, ...params }
    const queryString = new URLSearchParams(queryParams).toString()
    
    try {
      console.log('🚀 Fetching drivers from API...')
      const response = await baseApiService.get(`/vms/driver-master/with-vehicles?${queryString}`)
      console.log('📥 API Response received:', response)
      return this.transformDriverResponse(response)
    } catch (error) {
      console.error('❌ Error fetching drivers:', error)
      // Don't return mock data - let the error propagate to prevent interference
      throw this.handleError(error)
    }
  }

  /**
   * Search for a specific driver by name or license number
   * @param {string} searchTerm - Driver name or license number to search
   * @returns {Promise<Object>} Single driver data
   */
  async searchDriver(searchTerm) {
    try {
      console.log('🔍 Searching for driver:', searchTerm)
      const response = await baseApiService.get(`/vms/driver-master/search/${searchTerm}`)
      console.log('📥 Search response:', response)
      
      // Check if response is valid
      if (!response || !response.custrecord_driver_name) {
        throw new Error('Driver not found')
      }
      
      return this.transformSingleDriverResponse(response)
    } catch (error) {
      console.error('❌ Error searching driver:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Create a new driver
   * @param {Object} driverData - Driver data to create
   * @returns {Promise<Object>} Created driver data
   */
  async createDriver(driverData) {
    try {
      console.log('🚀 Creating driver with data:', driverData)
      
      // Transform the data to match API format
      const formData = this.transformDriverDataForAPI(driverData)
      
      // Use fetch directly for FormData to avoid double wrapping
      const response = await fetch(`${baseApiService.baseURL}/vms/driver-master`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.text()
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorJson = JSON.parse(errorData)
          errorMessage = errorJson.error || errorMessage
        } catch (parseError) {
          // Use the text error if JSON parsing fails
        }
        
        throw new Error(errorMessage)
      }
      
      const responseData = await response.json()
      console.log('📥 Driver creation response:', responseData)
      
      return responseData
    } catch (error) {
      console.error('❌ Error creating driver:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Transform driver data for API format
   * @param {Object} driverData - Driver data from form
   * @returns {FormData} API-formatted data as FormData for multipart upload
   */
  transformDriverDataForAPI(driverData) {
    const formData = new FormData()
    
    // Add ONLY the required fields as per API specification
    formData.append('custrecord_driver_name', driverData.name || '')
    formData.append('custrecord_driving_license_no', driverData.identification?.licenseNumber || '')
    formData.append('custrecord_driver_mobile_no', driverData.contact?.phone || '')
    formData.append('custrecord_driving_license_s_date', driverData.identification?.licenseStartDate || '')
    formData.append('custrecord_driver_license_e_date', driverData.identification?.licenseExpiry || '') // ADDED: Missing field
    formData.append('custrecord_license_category_ag', 'Light Motor Vehicle')
    formData.append('custrecord_create_by_driver_master', 'admin') // Fixed value as per your requirement
    // REMOVED: custrecord_driving_lca_test (not needed)
    
    // Add file attachments
    if (driverData.documents && driverData.documents.length > 0) {
      driverData.documents.forEach((doc, index) => {
        if (doc.file) {
          formData.append('custrecord_driving_license_attachment', doc.file)
        }
      })
    }
    
    // Debug: Log what we're sending
    console.log('📤 Driver API Payload:')
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }
    
    return formData
  }

  /**
   * Transform API response for driver list
   * @param {Object} response - Raw API response
   * @returns {Object} Transformed response
   */
  transformDriverResponse(response) {
    console.log('🔄 Transforming driver response:', response)
    
    if (!response) {
      return {
        drivers: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalDrivers: 0,
          limit: 20,
          hasNext: false,
          hasPrev: false
        }
      }
    }

    // Handle the actual API response structure
    const drivers = response.drivers || response.data || []
    const totalCount = response.length || drivers.length || 0
    const limit = 20
    const totalPages = Math.ceil(totalCount / limit)
    const currentPage = 1 // Default to page 1 for now

    const pagination = {
      currentPage: currentPage,
      totalPages: totalPages,
      totalDrivers: totalCount,
      limit: limit,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    }

    console.log('📊 Found drivers:', drivers.length)
    console.log('📊 Pagination:', pagination)

    return {
      drivers: drivers.map(driver => this.transformDriverData(driver)),
      pagination: pagination
    }
  }

  /**
   * Transform single driver API response
   * @param {Object} response - Raw API response
   * @returns {Object} Transformed driver data
   */
  transformSingleDriverResponse(response) {
    console.log('🔍 Transforming single driver response:', response)
    
    if (!response) {
      return null
    }

    // The search API returns the driver object directly
    const driverData = response
    const transformedDriver = this.transformDriverData(driverData)

    return {
      driver: transformedDriver,
      isSearchResult: true
    }
  }

  /**
   * Transform individual driver data to match our component structure
   * @param {Object} driverData - Raw driver data from API
   * @returns {Object} Transformed driver data
   */
  transformDriverData(driverData) {
    console.log('🔄 Transforming driver data:', driverData)
    console.log('📅 License start date raw:', driverData.custrecord_driving_license_s_date)
    console.log('📅 License expiry date raw:', driverData.custrecord_driver_license_e_date)
    
    const transformed = {
      id: driverData._id,
      name: driverData.custrecord_driver_name || 'N/A',
      contact: {
        phone: driverData.custrecord_driver_mobile_no || 'N/A',
        email: driverData.custrecord_driver_email || 'N/A',
        address: driverData.custrecord_driver_address || 'N/A'
      },
      identification: {
        licenseNumber: driverData.custrecord_driving_license_no || 'N/A',
        licenseType: driverData.custrecord_license_category_ag || 'N/A',
        licenseExpiry: this.formatDate(driverData.custrecord_driver_license_e_date),
        licenseStart: this.formatDate(driverData.custrecord_driving_license_s_date),
        aadharNumber: driverData.custrecord_driver_aadhar || 'N/A',
        panNumber: driverData.custrecord_driver_pan || 'N/A'
      },
      documents: this.transformDocuments(driverData),
      status: this.getDriverStatus(driverData),
      assignedVehicles: this.transformAssignedVehicles(driverData.assignedVehicle),
      createdAt: this.formatDate(driverData.createdAt),
      updatedAt: this.formatDate(driverData.updatedAt),
      
      // Additional data for modals
      rawData: driverData,
      hasVehicle: !!driverData.assignedVehicle,
      hasDocuments: driverData.custrecord_driving_license_attachment && driverData.custrecord_driving_license_attachment.length > 0,
      approvalStatus: driverData.approved_by_hq || 'pending'
    }
    
    console.log('✅ Transformed driver:', transformed)
    return transformed
  }

  /**
   * Transform assigned vehicle data
   * @param {Object} assignedVehicle - Assigned vehicle data from API
   * @returns {Array} Array of assigned vehicles
   */
  transformAssignedVehicles(assignedVehicle) {
    if (!assignedVehicle) {
      return []
    }

    return [{
      vehicleId: assignedVehicle._id,
      vehicleNumber: assignedVehicle.custrecord_vehicle_number || 'N/A',
      vehicleName: assignedVehicle.custrecord_vehicle_name_ag || 'N/A',
      type: 'Primary', // Default type
      status: this.getVehicleStatus(assignedVehicle),
      assignedDate: this.formatDate(assignedVehicle.createdAt),
      plant: assignedVehicle.currentPlant || 'N/A',
      vehicleType: assignedVehicle.custrecord_vehicle_type_ag || 'N/A'
    }]
  }

  /**
   * Transform documents array
   * @param {Object} driverData - Raw driver data
   * @returns {Array} Array of document objects
   */
  transformDocuments(driverData) {
    const documents = []
    
    // License attachment
    if (driverData.custrecord_driving_license_attachment && driverData.custrecord_driving_license_attachment.length > 0) {
      driverData.custrecord_driving_license_attachment.forEach((url, index) => {
        documents.push({
          id: `license_${index}`,
          type: 'Driving License',
          url: url,
          expiryDate: this.formatDate(driverData.custrecord_driver_license_e_date),
          status: this.getDocumentStatus(driverData.custrecord_driver_license_e_date)
        })
      })
    }

    return documents
  }

  /**
   * Get driver status based on approval and license expiry
   * @param {Object} driverData - Raw driver data
   * @returns {string} Driver status
   */
  getDriverStatus(driverData) {
    if (driverData.approved_by_hq === 'approved') {
      const licenseExpiry = new Date(driverData.custrecord_driver_license_e_date)
      const today = new Date()
      
      if (licenseExpiry < today) {
        return 'Expired'
      } else if (licenseExpiry < new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) {
        return 'Expiring Soon'
      } else {
        return 'Active'
      }
    } else if (driverData.approved_by_hq === 'pending') {
      return 'Pending'
    } else {
      return 'Inactive'
    }
  }

  /**
   * Get vehicle status
   * @param {Object} vehicleData - Vehicle data
   * @returns {string} Vehicle status
   */
  getVehicleStatus(vehicleData) {
    if (vehicleData.approved_by_hq === 'approved') {
      return 'Active'
    } else if (vehicleData.approved_by_hq === 'pending') {
      return 'Pending'
    } else {
      return 'Inactive'
    }
  }

  /**
   * Get document status based on expiry date
   * @param {string} expiryDate - Document expiry date
   * @returns {string} Document status
   */
  getDocumentStatus(expiryDate) {
    if (!expiryDate) return 'Unknown'
    
    const expiry = new Date(expiryDate)
    const today = new Date()
    
    if (expiry < today) {
      return 'Expired'
    } else if (expiry < new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) {
      return 'Expiring Soon'
    } else {
      return 'Valid'
    }
  }

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date or "Not Available"
   */
  formatDate(dateString) {
    console.log('📅 formatDate called with:', dateString)
    if (!dateString) {
      console.log('📅 No date string provided')
      return 'Not Available'
    }
    
    try {
      const date = new Date(dateString)
      console.log('📅 Parsed date:', date)
      if (isNaN(date.getTime())) {
        console.log('📅 Invalid date, returning raw string:', dateString)
        return dateString // Return raw string if date parsing fails
      }
      const formatted = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      console.log('📅 Formatted date:', formatted)
      return formatted
    } catch (error) {
      console.log('📅 Date formatting error:', error, 'for date:', dateString)
      return dateString // Return raw string if formatting fails
    }
  }

  /**
   * Get mock data when API is not available
   * @returns {Object} Mock driver data
   */
  getMockData() {
    console.log('🔄 Using mock data as fallback...')
    
    // Create mock data that matches the real API structure
    const mockApiResponse = {
      length: 3,
      drivers: [
        {
          _id: 'mock-driver-1',
          custrecord_driver_name: 'John Doe',
          custrecord_driving_license_no: 'DL123456789',
          custrecord_driver_mobile_no: '9876543210',
          custrecord_license_category_ag: 'Heavy Vehicle',
          custrecord_driver_license_e_date: '2025-12-31T00:00:00.000Z',
          custrecord_driving_license_s_date: '2020-01-01T00:00:00.000Z',
          custrecord_driving_license_attachment: ['https://example.com/license1.jpg'],
          approved_by_hq: 'approved',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z',
          assignedVehicle: {
            _id: 'mock-vehicle-1',
            custrecord_vehicle_number: 'MH12XX1001',
            custrecord_vehicle_name_ag: 'Tata Ace',
            currentPlant: 'pune',
            custrecord_vehicle_type_ag: 'ODC',
            approved_by_hq: 'approved'
          }
        },
        {
          _id: 'mock-driver-2',
          custrecord_driver_name: 'Jane Smith',
          custrecord_driving_license_no: 'DL987654321',
          custrecord_driver_mobile_no: '9876543211',
          custrecord_license_category_ag: 'Medium Vehicle',
          custrecord_driver_license_e_date: '2024-08-15T00:00:00.000Z',
          custrecord_driving_license_s_date: '2019-01-01T00:00:00.000Z',
          custrecord_driving_license_attachment: ['https://example.com/license2.jpg'],
          approved_by_hq: 'pending',
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-20T00:00:00.000Z',
          assignedVehicle: {
            _id: 'mock-vehicle-2',
            custrecord_vehicle_number: 'MH12XX1002',
            custrecord_vehicle_name_ag: 'Mahindra Bolero',
            currentPlant: 'solapur',
            custrecord_vehicle_type_ag: 'Lattice Tower',
            approved_by_hq: 'pending'
          }
        },
        {
          _id: 'mock-driver-3',
          custrecord_driver_name: 'Mike Wilson',
          custrecord_driving_license_no: 'DL456789123',
          custrecord_driver_mobile_no: '9876543212',
          custrecord_license_category_ag: 'Light Vehicle',
          custrecord_driver_license_e_date: '2026-03-20T00:00:00.000Z',
          custrecord_driving_license_s_date: '2021-01-01T00:00:00.000Z',
          custrecord_driving_license_attachment: ['https://example.com/license3.jpg'],
          approved_by_hq: 'approved',
          createdAt: '2024-01-03T00:00:00.000Z',
          updatedAt: '2024-01-25T00:00:00.000Z',
          assignedVehicle: null // No vehicle assigned
        }
      ]
    }

    // Transform the mock data using the same method as real API
    return this.transformDriverResponse(mockApiResponse)
  }



  /**
   * Handle API errors with user-friendly messages
   * @param {Error} error - API error
   * @returns {Error} Formatted error
   */
  handleError(error) {
    console.error('DriverService Error:', error)
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return new Error('Unable to connect to server. Please check if the API server is running on localhost:5000')
    }
    
    if (error.message.includes('404') || error.message.includes('Driver not found')) {
      return new Error('Driver not found. Please check the search term and try again.')
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

export default new DriverService()
