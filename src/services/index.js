/**
 * VMS API Services Export
 * Central hub for all API services
 */

import BaseApiService from './BaseApiService.js'
import VehicleService from './VehicleService.js'

// Export individual services
export { default as BaseApiService } from './BaseApiService.js'
export { default as VehicleService } from './VehicleService.js'

// Export combined API service object
export const apiService = {
  base: BaseApiService,
  vehicles: VehicleService,
  
  // Future services will be added here:
  // drivers: DriverService,
  // plants: PlantService,
  // dashboard: DashboardService,
  // auth: AuthService,
  // notifications: NotificationService,
}

// Development utilities
if (import.meta.env.MODE === 'development') {
  // Expose to window for debugging
  window.apiService = apiService
  
  console.log('🛠️ API Services initialized:', {
    base: '✅ BaseApiService',
    vehicles: '✅ VehicleService',
    // Add more as they're implemented
  })
}

export default apiService
