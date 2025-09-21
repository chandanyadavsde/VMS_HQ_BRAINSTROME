import baseApiService from './BaseApiService.js'

class PreLrService {
  constructor() {
    this.baseEndpoint = '/vms/ns-prelr'
  }

  /**
   * Get all PRE-LR data from local endpoint
   * @returns {Promise<Object>} API response with PRE-LR data
   */
  async getPreLrs() {
    try {
      const response = await baseApiService.get(`${this.baseEndpoint}/local?limit=1000`)
      return response
    } catch (error) {
      console.error('Error fetching PRE-LRs:', error)
      throw error
    }
  }

  /**
   * Get specific PRE-LR by ID
   * @param {string} preLrId - PRE-LR ID
   * @returns {Promise<Object>} PRE-LR details
   */
  async getPreLrById(preLrId) {
    try {
      const response = await baseApiService.get(`${this.baseEndpoint}/${preLrId}`)
      return response
    } catch (error) {
      console.error('Error fetching PRE-LR details:', error)
      throw error
    }
  }

  /**
   * Transform API data to UI-friendly format
   * @param {Array} apiData - Raw API data array
   * @returns {Array} Transformed data for UI
   */
  transformPreLrData(apiData) {
    return apiData.map(preLr => ({
      id: preLr.preLrNumber,
      internalId: preLr.internalId,
      name: preLr.consignee,
      consignee: preLr.consignee,
      consignor: preLr.consignor,
      lrCount: (preLr.lrs || []).length,
      wtgNumber: preLr.wtgNumber,
      content: preLr.content,
      fromLocation: preLr.fromLocation,
      district: preLr.site, // Map site to district
      site: preLr.site,
      state: preLr.stateHeader,
      status: this.mapStatus(preLr.status),
      createdDate: this.formatDate(preLr.createdAt),
      progress: this.calculateProgress(preLr.stateTracking),
      rawData: preLr, // Keep original data for detailed views
      associatedLrs: this.transformLrData(preLr.lrs || []),
      preLrLines: this.transformPreLrLines(preLr.preLrLines || [])
    }))
  }

  /**
   * Transform LR data for UI display
   * @param {Array} lrs - Raw LR data array
   * @returns {Array} Transformed LR data
   */
  transformLrData(lrs) {
    return lrs.map(lr => ({
      id: lr.lrName,
      lrName: lr.lrName,
      lrDate: lr.lrDate,
      status: this.mapLrStatus(lr.status),
      vehicleNo: lr.vehicleNo,
      vehicleType: lr.vehicleType,
      vehicleReqDate: lr.vehicleReqDate,
      vehicleRepDate: lr.vehicleRepDate,
      vehicleDepDate: lr.vehicleDepDate,
      vehicleRelDate: lr.vehicleRelDate,
      assignmentStatus: lr.vehicle?.assignmentStatus || 'unassigned',
      driverStatus: lr.driver?.driverStatus || 'unassigned',
      punchlistStatus: lr.punchlist?.status || 'pending',
      punchlistType: lr.punchlist?.punchlistType || 'general',
      ready: lr.status === 'Delivered' && lr.vehicle?.assignmentStatus === 'assigned',
      rawData: lr
    }))
  }

  /**
   * Transform PRE-LR lines data for table display
   * @param {Array} lines - Raw PRE-LR lines data
   * @returns {Array} Transformed lines data
   */
  transformPreLrLines(lines) {
    return lines.map(line => ({
      id: line.prelrLineItnernalId,
      lineId: line.prelrLineItnernalId,
      subContent: line.subContent,
      totalQuantity: line.totalQuantity,
      vehicleType: line.vehicleType,
      vehicleCategory: line.vehicleCategory,
      customerRate: line.customerRate,
      newCustomerRate: line.newCustomerRate,
      lrCreatedQty: line.lrCreatedQty,
      lrRemainingQty: line.lrRemainingQty,
      lineConsigner: line.lineConsigner,
      lineRemarks: line.lineRemarks,
      shortClose: line.shortClose,
      lineStatus: this.mapLineStatus(line.lineStatus),
      rawData: line
    }))
  }

  /**
   * Map API status to UI status
   * @param {string} apiStatus - Status from API
   * @returns {string} UI-friendly status
   */
  mapStatus(apiStatus) {
    const statusMap = {
      'Open': 'active',
      'Close': 'completed',
      'Processing': 'processing',
      'Pending': 'pending'
    }
    return statusMap[apiStatus] || 'pending'
  }

  /**
   * Map LR status to UI status
   * @param {string} lrStatus - LR status from API
   * @returns {string} UI-friendly status
   */
  mapLrStatus(lrStatus) {
    const statusMap = {
      'Delivered': 'completed',
      'In Transit': 'processing',
      'Pending': 'pending',
      'Cancelled': 'cancelled'
    }
    return statusMap[lrStatus] || 'pending'
  }

  /**
   * Map line status to UI status
   * @param {string} lineStatus - Line status from API
   * @returns {string} UI-friendly status
   */
  mapLineStatus(lineStatus) {
    const statusMap = {
      'pending': 'pending',
      'completed': 'completed',
      'processing': 'processing',
      'cancelled': 'cancelled'
    }
    return statusMap[lineStatus] || 'pending'
  }

  /**
   * Calculate progress percentage
   * @param {Object} stateTracking - State tracking object
   * @returns {number} Progress percentage
   */
  calculateProgress(stateTracking) {
    if (!stateTracking || !stateTracking.totalQuantity || stateTracking.totalQuantity === 0) {
      return 0
    }
    return Math.round((stateTracking.lrCreatedQuantity / stateTracking.totalQuantity) * 100)
  }

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    try {
      return new Date(dateString).toLocaleDateString('en-GB')
    } catch (error) {
      return dateString
    }
  }

  /**
   * Get status color class for UI
   * @param {string} status - Status string
   * @returns {string} Tailwind CSS class
   */
  getStatusColor(status) {
    const colorMap = {
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  /**
   * Get LR status color class for UI
   * @param {string} status - LR status string
   * @returns {string} Tailwind CSS class
   */
  getLrStatusColor(status) {
    return this.getStatusColor(status)
  }

  /**
   * Get line status color class for UI
   * @param {string} status - Line status string
   * @returns {string} Tailwind CSS class
   */
  getLineStatusColor(status) {
    return this.getStatusColor(status)
  }
}

export default new PreLrService()
