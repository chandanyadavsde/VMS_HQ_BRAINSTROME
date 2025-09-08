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
      // Don't return mock data - let the error propagate to prevent interference
      throw this.handleError(error)
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
   * Create a new vehicle
   * @param {Object} vehicleData - Vehicle data to create
   * @returns {Promise<Object>} Created vehicle data
   */
  async createVehicle(vehicleData) {
    try {
      console.log('🚀 Creating vehicle with data:', vehicleData)
      
      // Transform form data to API format
      const apiData = this.transformFormDataToAPI(vehicleData)
      
      // Create FormData for multipart/form-data
      const formData = new FormData()
      
      // Add all text fields
      Object.keys(apiData).forEach(key => {
        if (apiData[key] !== null && apiData[key] !== undefined && apiData[key] !== '') {
          formData.append(key, apiData[key])
        }
      })
      
      // Add file uploads for document attachments (multiple files per field)
      const fileFields = [
        'custrecord_rc_doc_attach',
        'custrecord_insurance_attachment_ag',
        'custrecord_permit_attachment_ag',
        'custrecord_puc_attachment_ag',
        'custrecord_tms_vehicle_fit_cert_attach'
      ]
      
      fileFields.forEach(fieldName => {
        const files = vehicleData[fieldName]
        if (files && Array.isArray(files) && files.length > 0) {
          // Append each file with the same field name (for multiple files)
          files.forEach(file => {
            formData.append(fieldName, file)
          })
        }
      })
      
      console.log('📤 Sending API request to create vehicle...')
      
      // Debug FormData contents
      console.log('📋 FormData contents:')
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`)
        } else {
          console.log(`  ${key}: ${value}`)
        }
      }
      
      // Use fetch directly for FormData to avoid BaseApiService JSON handling
      const response = await fetch(`${baseApiService.baseURL}/vms/vehicle`, {
        method: 'POST',
        body: formData
        // Don't set Content-Type - let browser set it with boundary
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      
      console.log('✅ Vehicle created successfully:', responseData)
      return {
        success: true,
        message: 'Vehicle created successfully',
        vehicle: responseData
      }
      
    } catch (error) {
      console.error('❌ Error creating vehicle:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Transform form data to API format
   * @param {Object} formData - Form data from UI
   * @returns {Object} API-formatted data
   */
  transformFormDataToAPI(formData) {
    console.log('🔄 Transforming form data to API format:', formData)
    
    const apiData = {
      // REQUIRED API Fields
      custrecord_vehicle_number: formData.custrecord_vehicle_number,
      custrecord_vehicle_type_ag: formData.custrecord_vehicle_type_ag,
      custrecord_driving_license_no: formData.custrecord_driving_license_no,
      
      // Optional Basic Information
      custrecord_vehicle_name_ag: formData.custrecord_vehicle_name_ag || '',
      custrecord_age_of_vehicle: formData.custrecord_age_of_vehicle || '',
      custrecord_expire_date: formData.custrecord_expire_date || '',
      approved_by_hq: formData.approved_by_hq || 'pending',
      currentPlant: formData.currentPlant || '',
      
      // Technical Identifiers
      custrecord_engine_number_ag: formData.custrecord_engine_number_ag || '',
      custrecord_chassis_number: formData.custrecord_chassis_number || '',
      
      // Owner Information
      custrecord_owner_name_ag: formData.custrecord_owner_name_ag || '',
      custrecord_owner_no_ag: formData.custrecord_owner_no_ag || '',
      
      // RC (Registration Certificate)
      custrecord_rc_no: formData.custrecord_rc_no || '',
      custrecord_rc_start_date: formData.custrecord_rc_start_date || '',
      custrecord_rc_end_date: formData.custrecord_rc_end_date || '',
      
      // Insurance
      custrecord_insurance_company_name_ag: formData.custrecord_insurance_company_name_ag || '',
      custrecord_insurance_number_ag: formData.custrecord_insurance_number_ag || '',
      custrecord_insurance_start_date_ag: formData.custrecord_insurance_start_date_ag || '',
      custrecord_insurance_end_date_ag: formData.custrecord_insurance_end_date_ag || '',
      
      // Permit
      custrecord_permit_number_ag: formData.custrecord_permit_number_ag || '',
      custrecord_permit_start_date: formData.custrecord_permit_start_date || '',
      custrecord_permit_end_date: formData.custrecord_permit_end_date || '',
      
      // PUC
      custrecord_puc_number: formData.custrecord_puc_number || '',
      custrecord_puc_start_date_ag: formData.custrecord_puc_start_date_ag || '',
      custrecord_puc_end_date_ag: formData.custrecord_puc_end_date_ag || '',
      
      // Fitness Certificate
      custrecord_tms_vehicle_fit_cert_vld_upto: formData.custrecord_tms_vehicle_fit_cert_vld_upto || '',
      
      // Flags & Settings
      custrecord_vehicle_master_gps_available: formData.custrecord_vehicle_master_gps_available || false,
      
      // Audit Fields
      custrecord_create_by: formData.custrecord_create_by || 'admin',
      fcm_token: formData.fcm_token || '',
      
      // Vendor Information (JSON string as per API contract)
      custrecord_vendor_name_ag: JSON.stringify({
        id: 'VEN001',
        name: formData.custrecord_vendor_name_ag || 'Default Vendor',
        isInactive: false
      }),
      
    }
    
    console.log('✅ Transformed API data:', apiData)
    return apiData
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