import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Package, Eye, Edit, Trash2, Filter, MoreHorizontal, RefreshCw, ChevronDown, ChevronRight, ExternalLink, FileText, MapPin, Building2, Truck, AlertCircle, X, Calendar } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <div className="max-w-7xl mx-auto p-2">
            {/* Compact Creative KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              {/* Total PRE-LRs Card */}
              <motion.div 
                className="relative bg-gradient-to-br from-white via-slate-50 to-white rounded-lg shadow-md border border-slate-200/50 p-3 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 overflow-hidden group"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-1">Total PRE-LRs</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      {preLrs.length}
                    </p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                    <FileText className="w-5 h-5 text-slate-700 group-hover:text-slate-900 transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="relative flex items-center text-xs text-slate-600 font-medium mt-2 pt-2 border-t border-slate-200/50">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-1.5 shadow-sm"></div>
                  <span>All loaded</span>
                </div>
              </motion.div>

              {/* Active LRs Card */}
              <motion.div 
                className="relative bg-gradient-to-br from-white via-blue-50/30 to-white rounded-lg shadow-md border border-blue-200/50 p-3 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 overflow-hidden group"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-1">Active LRs</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                      {preLrs.reduce((total, preLr) => total + preLr.lrCount, 0)}
                    </p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                    <Package className="w-5 h-5 text-blue-700 group-hover:text-blue-900 transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="relative flex items-center text-xs text-slate-600 font-medium mt-2 pt-2 border-t border-blue-200/50">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full mr-1.5 shadow-sm"></div>
                  <span>In progress</span>
                </div>
              </motion.div>

              {/* Completed LRs Card */}
              <motion.div 
                className="relative bg-gradient-to-br from-white via-green-50/30 to-white rounded-lg shadow-md border border-green-200/50 p-3 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 overflow-hidden group"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-1">Completed</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                      {preLrs.filter(preLr => preLr.status === 'completed').length}
                    </p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                    <Eye className="w-5 h-5 text-green-700 group-hover:text-green-900 transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="relative flex items-center text-xs text-slate-600 font-medium mt-2 pt-2 border-t border-green-200/50">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-1.5 shadow-sm"></div>
                  <span>Successfully processed</span>
                </div>
              </motion.div>

              {/* Pending Actions Card */}
              <motion.div 
                className="relative bg-gradient-to-br from-white via-amber-50/30 to-white rounded-lg shadow-md border border-amber-200/50 p-3 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 overflow-hidden group"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-1">Pending</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
                      {preLrs.filter(preLr => preLr.status === 'pending' || preLr.status === 'processing').length}
                    </p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                    <AlertCircle className="w-5 h-5 text-amber-700 group-hover:text-amber-900 transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="relative flex items-center text-xs text-slate-600 font-medium mt-2 pt-2 border-t border-amber-200/50">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mr-1.5 shadow-sm"></div>
                  <span>Requires attention</span>
                </div>
              </motion.div>
            </div>

        {/* Ultra-Compact Header Section with Inline Search */}
        <div className="mb-2">
          <div className="bg-white rounded-lg shadow-md border border-orange-100 p-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-sm font-bold text-slate-800">PRE-LR Management</h1>
                {preLrs.length > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {preLrs.length} PRE-LRs
                  </span>
                )}
              </div>
              
              {/* Search Bar and Refresh Button */}
              <div className="flex items-center gap-2">
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <Search className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search PRE-LR by number, consignee, consignor, WTG number, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-80 bg-white border border-orange-200 rounded-md pl-8 pr-8 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200"
                  />
                  {searchQuery && (
                    <motion.button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                </div>
                
                {/* Refresh Button */}
                <motion.button
                  onClick={fetchPreLrs}
                  className="p-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-all duration-200"
                  title="Refresh"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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

        {/* Ultra-Compact PRE-LR Table */}
        <div className="bg-white rounded-lg shadow-md border border-orange-100 overflow-hidden">
          {loading ? (
            <div className="p-4 text-center">
              <div className="inline-flex items-center gap-2 text-orange-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-xs font-medium">Loading PRE-LRs...</span>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <div className="text-red-600">
                <AlertCircle className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs font-medium">Failed to load data</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[75vh] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">PRE-LR DETAILS</th>
                    <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">CONSIGNOR</th>
                    <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">LR COUNT</th>
                    <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">WTG NUMBER</th>
                    <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">CONTENT</th>
                    <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">FROM LOCATION</th>
                    <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">DISTRICT</th>
                    <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">SITE</th>
                    <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">STATE</th>
                    <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">STATUS</th>
                    <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">CREATED DATE</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-orange-100">
                  {filteredPreLrs.map((preLr, index) => (
                    <React.Fragment key={preLr.id}>
                      {/* Ultra-Compact Main PRE-LR Row */}
                      <motion.tr 
                        className={`hover:bg-orange-50 transition-all duration-200 group ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                        }`}
                        whileHover={{ scale: 1.001 }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1, delay: index * 0.01 }}
                      >
                        <td className="px-2 py-1.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <motion.button
                              onClick={() => toggleRowExpansion(preLr.id)}
                              className="p-0.5 hover:bg-orange-100 rounded transition-all duration-200"
                              title={expandedRows.has(preLr.id) ? "Click to collapse LRs" : "Click to expand LRs"}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {expandedRows.has(preLr.id) ? (
                                <ChevronDown className="w-3 h-3 text-orange-600" />
                              ) : (
                                <ChevronRight className="w-3 h-3 text-orange-600" />
                              )}
                            </motion.button>
                            <div className="p-1 bg-orange-100 rounded">
                              <FileText className="w-3 h-3 text-orange-600" />
                            </div>
                            <motion.button
                              onClick={() => handlePreLrClick(preLr)}
                              className="font-semibold text-slate-800 text-xs hover:text-orange-600 hover:underline transition-colors"
                              title="Click to view PRE-LR details"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {preLr.id}
                            </motion.button>
                          </div>
                        </td>
                        <td className="px-3 py-1.5 whitespace-nowrap">
                          <div className="font-medium text-slate-600 text-xs group-hover:text-slate-700">{preLr.consignor}</div>
                        </td>
                        <td className="px-3 py-1.5 whitespace-nowrap">
                          <div className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                            {preLr.lrCount} LRs
                          </div>
                        </td>
                        <td className="px-3 py-1.5 whitespace-nowrap">
                          <div className="font-normal text-slate-600 text-xs group-hover:text-slate-700">{preLr.wtgNumber}</div>
                        </td>
                        <td className="px-3 py-1.5 whitespace-nowrap">
                          <div className="font-normal text-slate-600 text-xs group-hover:text-slate-700 max-w-xs truncate" title={preLr.content}>
                            {preLr.content}
                          </div>
                        </td>
                        <td className="px-3 py-1.5 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="font-normal text-slate-600 text-xs group-hover:text-slate-700">{preLr.fromLocation}</span>
                          </div>
                        </td>
                        <td className="px-3 py-1.5 whitespace-nowrap">
                          <div className="font-normal text-slate-600 text-xs group-hover:text-slate-700">{preLr.district}</div>
                        </td>
                        <td className="px-3 py-1.5 whitespace-nowrap">
                          <div className="font-normal text-slate-600 text-xs group-hover:text-slate-700">{preLr.site}</div>
                        </td>
                        <td className="px-3 py-1.5 whitespace-nowrap">
                          <div className="font-normal text-slate-600 text-xs group-hover:text-slate-700">{preLr.state}</div>
                        </td>
                        <td className="px-3 py-1.5 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(preLr.status)}`}>
                            {preLr.status.charAt(0).toUpperCase() + preLr.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 whitespace-nowrap">
                          <div className="font-normal text-slate-600 text-xs group-hover:text-slate-700">{preLr.createdDate}</div>
                        </td>
                      </motion.tr>

                      {/* Ultra-Compact Expanded Associated LRs Row */}
                      {expandedRows.has(preLr.id) && (
                        <tr className="bg-orange-50">
                          <td colSpan={10} className="px-2 py-2">
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="text-slate-600 font-semibold text-xs uppercase tracking-wide flex items-center gap-1.5">
                                  <Package className="w-3.5 h-3.5" />
                                  Associated LRs ({preLr.associatedLrs.length})
                                </h4>
                                <div className="font-medium text-slate-600 text-xs">
                                  Click any LR to view details
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
                                {preLr.associatedLrs.map((lr) => (
                                  <motion.div
                                    key={lr.id}
                                    className="bg-white border border-orange-200 rounded-md p-2 hover:shadow-sm hover:border-orange-300 transition-all duration-200 cursor-pointer group"
                                    onClick={() => handleLrClick(lr)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.1 }}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <h5 className="font-semibold text-slate-800 text-xs group-hover:text-orange-600">{lr.lrName}</h5>
                                      <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${getLrStatusColor(lr.status)}`}>
                                        {lr.status.charAt(0).toUpperCase() + lr.status.slice(1)}
                                      </span>
                                    </div>
                                    <div className="space-y-0.5 text-xs">
                                      <div className="flex items-center gap-1 text-slate-700">
                                        <Truck className="w-3 h-3 text-slate-400" />
                                        <span className="font-medium">{lr.vehicleNo || 'N/A'}</span>
                                      </div>
                                      <div className="flex items-center gap-1 text-slate-700">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        <span className="font-medium">{lr.lrDate || 'N/A'}</span>
                                      </div>
                                      <div className="pt-0.5 border-t border-slate-200">
                                        <div className="font-medium text-slate-600 text-xs">
                                          Click to view details →
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
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

        {/* Enhanced PRE-LR Details Modal */}
        <AnimatePresence>
          {showPreLrModal && selectedPreLr && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Premium Header */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">PRE-LR Details</h3>
                        <p className="text-slate-600 text-sm mt-1">{selectedPreLr.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${getStatusColor(selectedPreLr.status)}`}>
                        {selectedPreLr.status.charAt(0).toUpperCase() + selectedPreLr.status.slice(1)}
                      </span>
                      <div className="flex items-center gap-2">
                        <motion.button
                          className="px-3 py-1.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-lg hover:bg-orange-200 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Export PDF
                        </motion.button>
                        <motion.button
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Print
                        </motion.button>
                        <motion.button
                          onClick={handleCloseModal}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats Cards */}
                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <motion.div 
                      className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Package className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-medium">Total LRs</p>
                          <p className="text-lg font-bold text-slate-800">{selectedPreLr.lrCount}</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-medium">Created</p>
                          <p className="text-sm font-bold text-slate-800">{selectedPreLr.createdDate}</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-medium">Location</p>
                          <p className="text-sm font-bold text-slate-800">{selectedPreLr.district}</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-medium">Progress</p>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${selectedPreLr.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-slate-800">{selectedPreLr.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-6">
                  {/* Basic Information Cards */}
                  <div className="space-y-6">
                    <h4 className="text-slate-600 font-semibold text-xs uppercase tracking-wide flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">PRE-LR ID</label>
                        <p className="font-semibold text-slate-800 text-sm mt-1">{selectedPreLr.id}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Consignee</label>
                        <p className="font-medium text-slate-800 text-sm mt-1">{selectedPreLr.consignee}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Consignor</label>
                        <p className="font-medium text-slate-800 text-sm mt-1">{selectedPreLr.consignor}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">WTG Number</label>
                        <p className="font-medium text-slate-800 text-sm mt-1">{selectedPreLr.wtgNumber}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Content</label>
                        <p className="font-medium text-slate-800 text-sm mt-1">{selectedPreLr.content}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">From Location</label>
                        <p className="font-medium text-slate-800 text-sm mt-1">{selectedPreLr.fromLocation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="space-y-6">
                    <h4 className="text-slate-600 font-semibold text-xs uppercase tracking-wide flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">District</label>
                        <p className="font-medium text-slate-800 text-sm mt-1">{selectedPreLr.district}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Site</label>
                        <p className="font-medium text-slate-800 text-sm mt-1">{selectedPreLr.site}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">State</label>
                        <p className="font-medium text-slate-800 text-sm mt-1">{selectedPreLr.state}</p>
                      </div>
                    </div>
                  </div>

                  {/* PRE-LR Lines Table */}
                  <div className="space-y-6">
                    <h4 className="text-slate-600 font-semibold text-xs uppercase tracking-wide flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      PRE-LR Lines ({selectedPreLr.preLrLines.length})
                    </h4>
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                            <tr>
                              <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">Line ID</th>
                              <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">Sub Content</th>
                              <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">Qty</th>
                              <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">Vehicle Type</th>
                              <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">Category</th>
                              <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">LR Created</th>
                              <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">Remaining</th>
                              <th className="px-3 py-2 text-left text-slate-600 font-semibold text-xs uppercase tracking-wide">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {selectedPreLr.preLrLines.map((line, index) => (
                              <motion.tr 
                                key={line.id} 
                                className="hover:bg-slate-50 transition-colors"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                              >
                                <td className="px-3 py-2 font-semibold text-slate-800 text-xs">{line.lineId}</td>
                                <td className="px-3 py-2 font-medium text-slate-800 text-xs">{line.subContent}</td>
                                <td className="px-3 py-2 font-medium text-slate-800 text-xs">{line.totalQuantity}</td>
                                <td className="px-3 py-2 font-medium text-slate-800 text-xs">{line.vehicleType}</td>
                                <td className="px-3 py-2 font-medium text-slate-800 text-xs">{line.vehicleCategory}</td>
                                <td className="px-3 py-2 font-medium text-slate-800 text-xs">{line.lrCreatedQty}</td>
                                <td className="px-3 py-2 font-medium text-slate-800 text-xs">{line.lrRemainingQty}</td>
                                <td className="px-3 py-2">
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLineStatusColor(line.lineStatus)}`}>
                                    {line.lineStatus.charAt(0).toUpperCase() + line.lineStatus.slice(1)}
                                  </span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Associated LRs */}
                  <div className="space-y-6">
                    <h4 className="text-slate-600 font-semibold text-xs uppercase tracking-wide flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Associated LRs ({selectedPreLr.associatedLrs.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedPreLr.associatedLrs.map((lr, index) => (
                        <motion.div
                          key={lr.id}
                          className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer hover:shadow-lg hover:border-orange-300 transition-all duration-200 group"
                          onClick={() => handleLrClick(lr)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                                <FileText className="w-4 h-4 text-orange-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-sm group-hover:text-orange-600 transition-colors">
                                  {lr.id}
                                </p>
                                <p className="text-xs text-slate-500">Click to view details</p>
                              </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600 font-medium">Status:</span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLrStatusColor(lr.status)}`}>
                                {lr.status.charAt(0).toUpperCase() + lr.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600 font-medium">Ready:</span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                lr.ready 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {lr.ready ? 'Ready' : 'Processing'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced LR Details Modal */}
        <AnimatePresence>
          {showLrModal && selectedLr && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Premium Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                        <Truck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">LR Details</h3>
                        <p className="text-slate-600 text-sm mt-1">{selectedLr.lrName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${getLrStatusColor(selectedLr.status)}`}>
                        {selectedLr.status.charAt(0).toUpperCase() + selectedLr.status.slice(1)}
                      </span>
                      <div className="flex items-center gap-2">
                        <motion.button
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Export PDF
                        </motion.button>
                        <motion.button
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Print
                        </motion.button>
                        <motion.button
                          onClick={handleCloseModal}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats Cards */}
                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <motion.div 
                      className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Truck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-medium">Vehicle</p>
                          <p className="text-sm font-bold text-slate-800">{selectedLr.vehicleNo}</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-medium">LR Date</p>
                          <p className="text-sm font-bold text-slate-800">{selectedLr.lrDate}</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-medium">Assignment</p>
                          <p className="text-sm font-bold text-slate-800 capitalize">{selectedLr.assignmentStatus}</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-medium">Ready Status</p>
                          <p className={`text-sm font-bold ${selectedLr.ready ? 'text-green-800' : 'text-amber-800'}`}>
                            {selectedLr.ready ? 'Ready' : 'Processing'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-6">
                    {/* Basic LR Information Cards */}
                    <div className="space-y-6">
                      <h4 className="text-slate-600 font-semibold text-xs uppercase tracking-wide flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Basic LR Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">LR Number</label>
                          <p className="font-semibold text-slate-800 text-sm mt-1">{selectedLr.lrName}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">LR Date</label>
                          <p className="font-medium text-slate-800 text-sm mt-1">{selectedLr.lrDate}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Status</label>
                          <div className="mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLrStatusColor(selectedLr.status)}`}>
                              {selectedLr.status.charAt(0).toUpperCase() + selectedLr.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Vehicle Number</label>
                          <p className="font-medium text-slate-800 text-sm mt-1">{selectedLr.vehicleNo}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Vehicle Type</label>
                          <p className="font-medium text-slate-800 text-sm mt-1">{selectedLr.vehicleType}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Assignment Status</label>
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
                    </div>

                    {/* Vehicle Information */}
                    <div className="space-y-6">
                      <h4 className="text-slate-600 font-semibold text-xs uppercase tracking-wide flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Vehicle Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Request Date</label>
                          <p className="font-medium text-slate-800 text-sm mt-1">{selectedLr.vehicleReqDate}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Report Date</label>
                          <p className="font-medium text-slate-800 text-sm mt-1">{selectedLr.vehicleRepDate}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Departure Date</label>
                          <p className="font-medium text-slate-800 text-sm mt-1">{selectedLr.vehicleDepDate}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Release Date</label>
                          <p className="font-medium text-slate-800 text-sm mt-1">{selectedLr.vehicleRelDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Assignment Information */}
                    <div className="space-y-6">
                      <h4 className="text-slate-600 font-semibold text-xs uppercase tracking-wide flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Assignment Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Driver Status</label>
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
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Punchlist Status</label>
                          <div className="mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLrStatusColor(selectedLr.punchlistStatus)}`}>
                              {selectedLr.punchlistStatus.charAt(0).toUpperCase() + selectedLr.punchlistStatus.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <label className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Punchlist Type</label>
                        <p className="font-medium text-slate-800 text-sm mt-1">{selectedLr.punchlistType}</p>
                      </div>
                    </div>

                    {/* Ready Status */}
                    <div className="space-y-6">
                      <h4 className="text-slate-600 font-semibold text-xs uppercase tracking-wide flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Ready Status
                      </h4>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Status</p>
                            <p className="text-slate-800 font-medium text-sm mt-1">
                              {selectedLr.ready ? 'Ready for Processing' : 'Currently Processing'}
                            </p>
                          </div>
                          <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                            selectedLr.ready 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {selectedLr.ready ? 'Ready' : 'Processing'}
                          </span>
                        </div>
                      </div>
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
