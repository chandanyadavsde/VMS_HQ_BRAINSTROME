import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Package, Eye, Edit, Trash2, Filter, MoreHorizontal, RefreshCw, ChevronDown, ChevronRight, ExternalLink, FileText, MapPin, Building2, Truck, AlertCircle } from 'lucide-react'
import PreLrService from '../../services/PreLrService.js'

const OrdersTable = ({ currentTheme }) => {
  const [preLrs, setPreLrs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [selectedPreLr, setSelectedPreLr] = useState(null)
  const [selectedLr, setSelectedLr] = useState(null)
  const [showPreLrModal, setShowPreLrModal] = useState(false)
  const [showLrModal, setShowLrModal] = useState(false)

  useEffect(() => {
    fetchPreLrs()
  }, [])

  const fetchPreLrs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await PreLrService.getPreLrs()
      
      if (response.success && response.data) {
        const transformedData = PreLrService.transformPreLrData(response.data)
        setPreLrs(transformedData)
      } else {
        throw new Error('Failed to fetch PRE-LR data')
      }
    } catch (error) {
      console.error('Error fetching PRE-LRs:', error)
      setError('Failed to load PRE-LR data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePreLrClick = (preLr) => {
    setSelectedPreLr(preLr)
    setShowPreLrModal(true)
  }

  const handleLrClick = (lr) => {
    setSelectedLr(lr)
    setShowLrModal(true)
  }

  const handleCloseModal = () => {
    setShowPreLrModal(false)
    setShowLrModal(false)
    setSelectedPreLr(null)
    setSelectedLr(null)
  }

  const toggleRowExpansion = (preLrId) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(preLrId)) {
      newExpandedRows.delete(preLrId)
    } else {
      newExpandedRows.add(preLrId)
    }
    setExpandedRows(newExpandedRows)
  }

  const getStatusColor = (status) => {
    return PreLrService.getStatusColor(status)
  }

  const getLrStatusColor = (status) => {
    return PreLrService.getLrStatusColor(status)
  }

  const getLineStatusColor = (status) => {
    return PreLrService.getLineStatusColor(status)
  }

  const filteredPreLrs = preLrs.filter(preLr =>
    preLr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    preLr.consignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    preLr.consignor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    preLr.wtgNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    preLr.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate metrics for the dashboard
  const totalPreLrs = preLrs.length
  const totalLrs = preLrs.reduce((sum, preLr) => sum + preLr.lrCount, 0)
  const activePreLrs = preLrs.filter(preLr => preLr.status === 'active').length
  const completedPreLrs = preLrs.filter(preLr => preLr.status === 'completed').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Header Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  PRE-LR Management
                </h1>
                <p className="text-slate-600 mt-2 text-lg">
                  Comprehensive Pre-Load Request Management System
                </p>
              </div>
              <motion.button
                onClick={() => {
                  // TODO: Add new PRE-LR functionality
                  console.log('Add new PRE-LR')
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold text-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                New PRE-LR
              </motion.button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <motion.div 
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total PRE-LRs</p>
                    <p className="text-3xl font-bold">{totalPreLrs}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-200" />
                </div>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total LRs</p>
                    <p className="text-3xl font-bold">{totalLrs}</p>
                  </div>
                  <FileText className="w-8 h-8 text-green-200" />
                </div>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">Active</p>
                    <p className="text-3xl font-bold">{activePreLrs}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-amber-200" />
                </div>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold">{completedPreLrs}</p>
                  </div>
                  <Truck className="w-8 h-8 text-purple-200" />
                </div>
              </motion.div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Search className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search PRE-LR by number, consignee, consignor, WTG number, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/80 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 shadow-sm"
                  />
                </div>
                <motion.button
                  onClick={fetchPreLrs}
                  className="p-3 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Refresh Data"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{error}</span>
              <button
                onClick={fetchPreLrs}
                className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Modern Card-Based PRE-LR Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
              <div className="inline-flex items-center gap-3 text-slate-600">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="text-lg font-medium">Loading PRE-LR data...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
              <div className="text-slate-600">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <p className="text-lg font-medium">Failed to load data</p>
                <p className="text-sm text-slate-500 mt-2">Please try again later</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRE-LR DETAILS</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONSIGNEE</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONSIGNOR</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LR COUNT</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WTG NUMBER</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONTENT</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FROM LOCATION</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISTRICT</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SITE</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATE</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED DATE</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPreLrs.map((preLr) => (
                    <React.Fragment key={preLr.id}>
                      {/* Main PRE-LR Row */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleRowExpansion(preLr.id)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title={expandedRows.has(preLr.id) ? "Click to collapse LRs" : "Click to expand LRs"}
                            >
                              {expandedRows.has(preLr.id) ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            <FileText className="w-4 h-4 text-orange-500" />
                            <div>
                              <button
                                onClick={() => handlePreLrClick(preLr)}
                                className="text-sm font-medium text-gray-900 hover:text-orange-600 hover:underline transition-colors"
                                title="Click to view PRE-LR details"
                              >
                                {preLr.id}
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{preLr.consignee}</div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{preLr.consignor}</div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{preLr.lrCount} LRs</div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{preLr.wtgNumber}</div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{preLr.content}</div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-900">{preLr.fromLocation}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{preLr.district}</div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{preLr.site}</div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{preLr.state}</div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(preLr.status)}`}>
                            {preLr.status.charAt(0).toUpperCase() + preLr.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{preLr.createdDate}</div>
                        </td>
                      </tr>

                      {/* Expanded Associated LRs Row */}
                      {expandedRows.has(preLr.id) && (
                        <tr className="bg-gray-50">
                          <td colSpan={11} className="px-3 py-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  Associated LRs ({preLr.associatedLrs.length})
                                </h4>
                                <span className="text-xs text-gray-500">
                                  Progress: {preLr.progress}% of target
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {preLr.associatedLrs.map((lr) => (
                                  <div
                                    key={lr.id}
                                    className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handleLrClick(lr)}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-orange-500" />
                                        <button
                                          className="text-sm font-medium text-gray-900 hover:text-orange-600 hover:underline transition-colors"
                                          title="Click to view LR details"
                                        >
                                          {lr.id}
                                        </button>
                                      </div>
                                      <ExternalLink className="w-3 h-3 text-gray-400" />
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-xs text-gray-500">
                                        Status: <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getLrStatusColor(lr.status)}`}>
                                          {lr.status.charAt(0).toUpperCase() + lr.status.slice(1)}
                                        </span>
                                      </div>
                                      <div className="flex justify-end">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                                          lr.ready 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                          {lr.ready ? 'Ready' : 'Processing'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PRE-LR Details Modal */}
        <AnimatePresence>
          {showPreLrModal && selectedPreLr && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">PRE-LR Details</h3>
                    <button
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-4 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">PRE-LR ID</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedPreLr.id}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedPreLr.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPreLr.status)}`}>
                          {selectedPreLr.status.charAt(0).toUpperCase() + selectedPreLr.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Consignee</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedPreLr.consignee}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Consignor</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedPreLr.consignor}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">WTG Number</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedPreLr.wtgNumber}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Content</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedPreLr.content}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">From Location</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedPreLr.fromLocation}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedPreLr.createdDate}</p>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Location Details</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">District</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedPreLr.district}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Site</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedPreLr.site}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">State</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedPreLr.state}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Information */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Progress Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">LR Count</span>
                        <span className="text-sm font-medium text-gray-900">{selectedPreLr.lrCount} LRs</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium text-gray-900">{selectedPreLr.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedPreLr.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PRE-LR Lines Table */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      PRE-LR Lines ({selectedPreLr.preLrLines.length})
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider">Line ID</th>
                            <th className="px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider">Sub Content</th>
                            <th className="px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                            <th className="px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                            <th className="px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider">LR Created</th>
                            <th className="px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                            <th className="px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedPreLr.preLrLines.map((line) => (
                            <tr key={line.id} className="hover:bg-gray-50">
                              <td className="px-2 py-1 text-sm text-gray-900">{line.lineId}</td>
                              <td className="px-2 py-1 text-sm text-gray-900">{line.subContent}</td>
                              <td className="px-2 py-1 text-sm text-gray-900">{line.totalQuantity}</td>
                              <td className="px-2 py-1 text-sm text-gray-900">{line.vehicleType}</td>
                              <td className="px-2 py-1 text-sm text-gray-900">{line.vehicleCategory}</td>
                              <td className="px-2 py-1 text-sm text-gray-900">{line.lrCreatedQty}</td>
                              <td className="px-2 py-1 text-sm text-gray-900">{line.lrRemainingQty}</td>
                              <td className="px-2 py-1">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLineStatusColor(line.lineStatus)}`}>
                                  {line.lineStatus.charAt(0).toUpperCase() + line.lineStatus.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Associated LRs */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Associated LRs ({selectedPreLr.associatedLrs.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedPreLr.associatedLrs.map((lr) => (
                        <div
                          key={lr.id}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleLrClick(lr)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-orange-500" />
                              <button
                                className="text-sm font-medium text-gray-900 hover:text-orange-600 hover:underline transition-colors"
                                title="Click to view LR details"
                              >
                                {lr.id}
                              </button>
                            </div>
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">
                              Status: <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getLrStatusColor(lr.status)}`}>
                                {lr.status.charAt(0).toUpperCase() + lr.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex justify-end">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${
                                lr.ready 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {lr.ready ? 'Ready' : 'Processing'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LR Details Modal */}
        <AnimatePresence>
          {showLrModal && selectedLr && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">LR Details</h3>
                    <button
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-4 space-y-6">
                  {/* Basic LR Information */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">LR Number</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedLr.lrName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">LR Date</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedLr.lrDate}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLrStatusColor(selectedLr.status)}`}>
                          {selectedLr.status.charAt(0).toUpperCase() + selectedLr.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedLr.vehicleNo}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedLr.vehicleType}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedLr.assignmentStatus === 'assigned' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedLr.assignmentStatus.charAt(0).toUpperCase() + selectedLr.assignmentStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Vehicle Information</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedLr.vehicleReqDate}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Report Date</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedLr.vehicleRepDate}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Departure Date</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedLr.vehicleDepDate}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Release Date</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedLr.vehicleRelDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Assignment Information */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Assignment Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Status</label>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedLr.driverStatus === 'assigned' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedLr.driverStatus.charAt(0).toUpperCase() + selectedLr.driverStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Punchlist Status</label>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLrStatusColor(selectedLr.punchlistStatus)}`}>
                            {selectedLr.punchlistStatus.charAt(0).toUpperCase() + selectedLr.punchlistStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Punchlist Type</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedLr.punchlistType}</p>
                    </div>
                  </div>

                  {/* Ready Status */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Ready Status</span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        selectedLr.ready 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {selectedLr.ready ? 'Ready' : 'Processing'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default OrdersTable
