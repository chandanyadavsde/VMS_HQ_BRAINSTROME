/**
 * Enterprise Dashboard Component
 * Comprehensive VMS dashboard with real-time analytics and modern design
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Truck, 
  Users, 
  AlertTriangle, 
  PieChart, 
  Activity,
  RefreshCw
} from 'lucide-react'
import DashboardService from '../services/DashboardService.js'

const Dashboard = ({ currentTheme }) => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await DashboardService.getDashboardData()
      setDashboardData(data)
      setLastRefresh(new Date())
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchDashboardData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-orange-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Loading Dashboard</h3>
          <p className="text-slate-600">Fetching real-time data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Dashboard Error</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  const { preLr, vehicles, drivers, metrics, alerts } = dashboardData

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Attractive Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-orange-600 to-slate-800 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {lastRefresh && `Last updated ${lastRefresh.toLocaleTimeString()}`}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 rounded-xl shadow-sm border border-slate-200 hover:border-orange-200 transition-all duration-200 hover:shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="PRE-LRs"
            value={preLr.total}
            icon={Package}
            color="blue"
          />
          <MetricCard
            title="Active LRs"
            value={preLr.byStatus?.active || 0}
            icon={Activity}
            color="green"
          />
          <MetricCard
            title="Vehicles"
            value={vehicles.total}
            icon={Truck}
            color="orange"
          />
          <MetricCard
            title="Drivers"
            value={drivers.total}
            icon={Users}
            color="purple"
          />
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatusCard
            title="Order Status"
            data={preLr.byStatus}
            icon={PieChart}
          />
          <ActivityCard
            title="Recent Activity"
            data={preLr.recentActivity}
            icon={Activity}
          />
        </div>

      </div>
    </div>
  )
}


// Attractive Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color }) => {
  const colorConfigs = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-500',
      accent: 'border-blue-200'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      icon: 'text-green-600',
      iconBg: 'bg-green-500',
      accent: 'border-green-200'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
      icon: 'text-orange-600',
      iconBg: 'bg-orange-500',
      accent: 'border-orange-200'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      icon: 'text-purple-600',
      iconBg: 'bg-purple-500',
      accent: 'border-purple-200'
    }
  }

  const config = colorConfigs[color]

  return (
    <motion.div
      className={`${config.bg} rounded-2xl p-6 border ${config.accent} hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className={`w-full h-full bg-gradient-to-br ${config.gradient} rounded-full transform translate-x-8 -translate-y-8`}></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/50 rounded-full h-1.5">
          <motion.div
            className={`h-1.5 rounded-full bg-gradient-to-r ${config.gradient}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((value / 100) * 100, 100)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// Attractive Status Card Component
const StatusCard = ({ title, data, icon: Icon }) => {
  const statuses = [
    { key: 'active', label: 'Active', color: 'bg-green-500', gradient: 'from-green-400 to-green-600' },
    { key: 'completed', label: 'Completed', color: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600' },
    { key: 'pending', label: 'Pending', color: 'bg-orange-500', gradient: 'from-orange-400 to-orange-600' }
  ]

  const total = Object.values(data).reduce((sum, count) => sum + count, 0)

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{total} total orders</p>
        </div>
      </div>
      <div className="space-y-4">
        {statuses.map(({ key, label, color, gradient }) => {
          const count = data[key] || 0
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0
          
          return (
            <motion.div 
              key={key} 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${color} shadow-sm`}></div>
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900">{count}</span>
                  <span className="text-xs text-slate-500 ml-1">({percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// Attractive Activity Card Component
const ActivityCard = ({ title, data, icon: Icon }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200">
          <Icon className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">Latest updates</p>
        </div>
      </div>
      <div className="space-y-3">
        {data.length > 0 ? (
          data.slice(0, 5).map((activity, index) => (
            <motion.div 
              key={index} 
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-orange-50/30 rounded-xl border border-slate-100 hover:border-orange-200 transition-all duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {activity.consignee} → {activity.toLocation}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">
                    {activity.lrCount} LRs
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activity.status === 'active' ? 'bg-green-100 text-green-700' :
                    activity.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-400">
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
              <Icon className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}



export default Dashboard
