/**
 * Vehicle Service for VMS Application
 * Handles all vehicle-related API operations
 */

import BaseApiService from './BaseApiService.js'
import { API_ENDPOINTS, QUERY_BUILDERS } from '../config/api.js'

class VehicleService {
  constructor() {
    this.api = BaseApiService
  }

  /**
   * Get vehicle list with filters and pagination
   */
  async getVehicleList(plant, options = {}) {
    const {
      status = 'pending',
      page = 1,
      limit = 16,
      includeDriver = true,
      sortBy = null,
      sortOrder = null
    } = options

    try {
      // Handle In Transit status (global, not plant-specific)
      if (status === 'in-transit') {
        return await this.getInTransitVehicles({ page, limit, sortBy, sortOrder })
      }

      // Handle regular plant-based statuses
      const endpoint = API_ENDPOINTS.VEHICLE.LIST(plant)
      const params = QUERY_BUILDERS.vehicleList({
        status, page, limit, includeDriver, sortBy, sortOrder
      })

      console.log(`🚗 Fetching ${status} vehicles for plant: ${plant} (page ${page})`)
      
      const response = await this.api.get(endpoint, params)
      
      console.log(`✅ Retrieved ${response.vehicles?.length || 0} vehicles`)
      return response

    } catch (error) {
      console.error(`❌ Failed to fetch vehicle list:`, error)
      throw new Error(`Failed to load vehicles: ${error.message}`)
    }
  }

  /**
   * Get In Transit vehicles (global scope with pagination)
   */
  async getInTransitVehicles(options = {}) {
    const {
      page = 1,
      limit = 16,
      sortBy = null,
      sortOrder = null
    } = options

    try {
      const endpoint = API_ENDPOINTS.VEHICLE.IN_TRANSIT()
      
      console.log(`🚛 Fetching In Transit vehicles (API endpoint: ${endpoint})`)
      console.log(`🔗 Full URL: ${this.api.baseURL}${endpoint}`)
      
      // Your API doesn't expect pagination parameters, so call without them
      const response = await this.api.get(endpoint)
      
      console.log(`📥 Raw API response:`, response)
      
      // Handle the actual API response format: { message, vehicles }
      const allVehicles = response.vehicles || []
      
      // Implement client-side pagination
      const totalVehicles = allVehicles.length
      const totalPages = Math.ceil(totalVehicles / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedVehicles = allVehicles.slice(startIndex, endIndex)
      
      // Transform the response to match our expected format
      const transformedResponse = {
        vehicles: paginatedVehicles,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalVehicles: totalVehicles,
          limit: limit,
          hasNext: endIndex < totalVehicles,
          hasPrev: page > 1
        },
        meta: {
          message: response.message || '',
          clientSidePagination: true
        }
      }
      
      console.log(`✅ Retrieved ${transformedResponse.vehicles.length} In Transit vehicles`)
      return transformedResponse

    } catch (error) {
      console.error(`❌ Failed to fetch In Transit vehicles:`, error)
      throw new Error(`Failed to load In Transit vehicles: ${error.message}`)
    }
  }

  /**
   * Search vehicle by number
   */
  async searchVehicle(vehicleNumber) {
    if (!vehicleNumber || vehicleNumber.length < 3) {
      throw new Error('Vehicle number must be at least 3 characters')
    }

    try {
      const endpoint = API_ENDPOINTS.VEHICLE.SEARCH(vehicleNumber.trim())
      
      console.log(`🔍 Searching for vehicle: ${vehicleNumber}`)
      
      const response = await this.api.get(endpoint)
      
      console.log(`✅ Vehicle found: ${response.custrecord_vehicle_number}`)
      return response

    } catch (error) {
      console.error(`❌ Vehicle search failed:`, error)
      
      if (error.message.includes('404')) {
        throw new Error('Vehicle not found')
      }
      
      throw new Error(`Search failed: ${error.message}`)
    }
  }

  /**
   * Get vehicle details
   */
  async getVehicleDetails(vehicleId) {
    try {
      const endpoint = API_ENDPOINTS.VEHICLE.DETAILS(vehicleId)
      
      console.log(`📄 Fetching vehicle details: ${vehicleId}`)
      
      const response = await this.api.get(endpoint)
      
      console.log(`✅ Vehicle details retrieved`)
      return response

    } catch (error) {
      console.error(`❌ Failed to fetch vehicle details:`, error)
      throw new Error(`Failed to load vehicle details: ${error.message}`)
    }
  }

  /**
   * Approve vehicle
   */
  async approveVehicle(vehicleId, approvalData = {}) {
    try {
      const endpoint = API_ENDPOINTS.VEHICLE.APPROVAL(vehicleId)
      
      const payload = {
        action: 'approve',
        timestamp: new Date().toISOString(),
        ...approvalData
      }
      
      console.log(`✅ Approving vehicle: ${vehicleId}`)
      
      const response = await this.api.post(endpoint, payload)
      
      // Clear related cache
      this.api.clearCache('vehicle')
      
      console.log(`🎉 Vehicle approved successfully`)
      return response

    } catch (error) {
      console.error(`❌ Vehicle approval failed:`, error)
      throw new Error(`Approval failed: ${error.message}`)
    }
  }

  /**
   * Reject vehicle
   */
  async rejectVehicle(vehicleId, rejectionData = {}) {
    try {
      const endpoint = API_ENDPOINTS.VEHICLE.APPROVAL(vehicleId)
      
      const payload = {
        action: 'reject',
        timestamp: new Date().toISOString(),
        ...rejectionData
      }
      
      console.log(`❌ Rejecting vehicle: ${vehicleId}`)
      
      const response = await this.api.post(endpoint, payload)
      
      // Clear related cache
      this.api.clearCache('vehicle')
      
      console.log(`🚫 Vehicle rejected successfully`)
      return response

    } catch (error) {
      console.error(`❌ Vehicle rejection failed:`, error)
      throw new Error(`Rejection failed: ${error.message}`)
    }
  }

  /**
   * Get vehicle counts by status for a plant
   */
  async getVehicleCounts(plant) {
    try {
      const counts = { pending: 0, approved: 0, rejected: 0, 'in-transit': 0 }
      
      // Fetch count for each status (limit=1 for efficiency)
      const promises = Object.keys(counts).map(async (status) => {
        try {
          console.log(`📊 Fetching count for status: ${status}`)
          
          const response = await this.getVehicleList(plant, { 
            status, 
            page: 1, 
            limit: 1 
          })
          
          const count = response.pagination?.totalVehicles || 
                       response.totalCount || 
                       response.vehicles?.length || 0
          
          console.log(`📊 Count for ${status}: ${count}`)
          
          return { status, count }
        } catch (error) {
          console.error(`Failed to get ${status} count:`, error)
          return { status, count: 0 }
        }
      })
      
      const results = await Promise.all(promises)
      
      // Build counts object
      results.forEach(({ status, count }) => {
        counts[status] = count
      })
      
      console.log(`📊 Vehicle counts for ${plant}:`, counts)
      return counts

    } catch (error) {
      console.error(`❌ Failed to fetch vehicle counts:`, error)
      throw new Error(`Failed to load vehicle counts: ${error.message}`)
    }
  }

  /**
   * Batch operations (future enhancement)
   */
  async batchApprove(vehicleIds, approvalData = {}) {
    try {
      const promises = vehicleIds.map(id => this.approveVehicle(id, approvalData))
      const results = await Promise.all(promises)
      
      console.log(`🎉 Batch approved ${vehicleIds.length} vehicles`)
      return results

    } catch (error) {
      console.error(`❌ Batch approval failed:`, error)
      throw new Error(`Batch approval failed: ${error.message}`)
    }
  }

  /**
   * Complete trip - Mark vehicle as free
   */
  async completeTrip(vehicleNumber) {
    if (!vehicleNumber) {
      throw new Error('Vehicle number is required')
    }

    try {
      const endpoint = API_ENDPOINTS.VEHICLE.COMPLETE_TRIP(vehicleNumber)
      
      const payload = {
        currentPlant: "free"
      }
      
      console.log(`🎯 Completing trip for vehicle: ${vehicleNumber}`)
      console.log(`🔗 API endpoint: ${this.api.baseURL}${endpoint}`)
      console.log(`📦 Payload:`, payload)
      
      const response = await this.api.patch(endpoint, payload)
      
      // Clear vehicle cache to refresh data
      this.api.clearCache('vehicle')
      
      console.log(`✅ Trip completed successfully for ${vehicleNumber}`)
      return response

    } catch (error) {
      console.error(`❌ Trip completion failed for ${vehicleNumber}:`, error)
      throw new Error(`Failed to complete trip: ${error.message}`)
    }
  }

  /**
   * Clear vehicle cache
   */
  clearCache() {
    this.api.clearCache('vehicle')
    console.log('🧹 Vehicle cache cleared')
  }
}

// Create singleton instance
const vehicleService = new VehicleService()

export default vehicleService
