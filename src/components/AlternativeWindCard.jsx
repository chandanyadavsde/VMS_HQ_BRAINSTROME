import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wind, Zap, Battery, TrendingUp, ChevronRight, X, Clock, CheckCircle, AlertCircle, Play, Pause, RotateCcw } from 'lucide-react'
import { getThemeColors } from '../utils/theme.js'

const AlternativeWindCard = ({ currentTheme = 'teal' }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeStage, setActiveStage] = useState(null)
  const themeColors = getThemeColors(currentTheme)

  const stages = [
    {
      id: 1,
      name: 'Site Assessment',
      status: 'completed',
      progress: 100,
      duration: '2 weeks',
      description: 'Comprehensive analysis of wind patterns, terrain, and environmental factors',
      details: {
        windSpeed: '8.5 m/s average',
        terrainType: 'Coastal Plains',
        environmentalImpact: 'Low',
        feasibilityScore: '92%'
      }
    },
    {
      id: 2,
      name: 'Design & Planning',
      status: 'in-progress',
      progress: 65,
      duration: '3 weeks',
      description: 'Engineering design, turbine selection, and project planning',
      details: {
        turbineType: 'GE 2.5-120',
        capacity: '2.5 MW per turbine',
        totalTurbines: '12 units',
        estimatedOutput: '30 MW'
      }
    },
    {
      id: 3,
      name: 'Construction',
      status: 'not-started',
      progress: 0,
      duration: '8 weeks',
      description: 'Foundation work, tower erection, and turbine installation',
      details: {
        foundationType: 'Concrete Pile',
        towerHeight: '120 meters',
        constructionPhase: 'Foundation',
        completionDate: 'Q3 2024'
      }
    },
    {
      id: 4,
      name: 'Commissioning',
      status: 'not-started',
      progress: 0,
      duration: '2 weeks',
      description: 'Testing, grid connection, and operational readiness',
      details: {
        gridConnection: '33 kV',
        testingPhase: 'Pre-commissioning',
        safetyChecks: 'Pending',
        operationalDate: 'Q4 2024'
      }
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400'
      case 'in-progress':
        return 'text-amber-400'
      case 'not-started':
        return 'text-slate-400'
      default:
        return 'text-cyan-400'
    }
  }

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20'
      case 'in-progress':
        return 'bg-amber-500/20'
      case 'not-started':
        return 'bg-slate-500/20'
      default:
        return 'bg-cyan-500/20'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'in-progress':
        return <Clock className="w-4 h-4" />
      case 'not-started':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Alternative Design - Hexagonal Layout */}
      <motion.div
        className={`relative bg-gradient-to-br ${themeColors.cardGradient} rounded-3xl p-8 cursor-pointer overflow-hidden`}
        style={{ 
          width: isExpanded ? '900px' : '500px', 
          height: isExpanded ? '800px' : '550px',
          background: themeColors.cardBackground
        }}
        layout
        whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Wind className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Wind Energy Project</h2>
                <p className={`text-sm ${themeColors.accentText}`}>Coastal Plains Wind Farm</p>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="text-right">
              <div className="text-3xl font-bold text-white">41%</div>
              <div className={`text-sm ${themeColors.accentText}`}>Overall Progress</div>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                  fill="none"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#windGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * 0.59}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * 0.59 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="windGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Inner Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-white">41%</div>
                <div className={`text-xs ${themeColors.accentText}`}>Complete</div>
              </div>
            </div>
          </div>

          {/* Stages Grid */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {stages.map((stage) => (
              <motion.div
                key={stage.id}
                className={`relative p-4 rounded-xl border border-white/10 cursor-pointer transition-all ${
                  activeStage === stage.id ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveStage(activeStage === stage.id ? null : stage.id)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${getStatusBgColor(stage.status)}`}>
                      <div className={getStatusColor(stage.status)}>
                        {getStatusIcon(stage.status)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{stage.name}</h3>
                      <p className={`text-xs ${themeColors.accentText}`}>{stage.duration}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-white/50 transition-transform ${
                    activeStage === stage.id ? 'rotate-90' : ''
                  }`} />
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs ${themeColors.accentText}`}>Progress</span>
                    <span className="text-white text-xs font-medium">{stage.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Stage Description */}
                <p className={`text-xs ${themeColors.accentText} truncate`}>
                  {stage.description}
                </p>

                {/* Expanded Details */}
                <AnimatePresence>
                  {activeStage === stage.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="space-y-2">
                        {Object.entries(stage.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className={`text-xs ${themeColors.accentText} capitalize`}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-white text-xs font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2 mt-4">
                        {stage.status === 'not-started' && (
                          <button className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all">
                            <Play className="w-3 h-3 inline mr-1" />
                            Start
                          </button>
                        )}
                        {stage.status === 'in-progress' && (
                          <>
                            <button className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all">
                              <Pause className="w-3 h-3 inline mr-1" />
                              Pause
                            </button>
                            <button className="px-3 py-1 bg-gradient-to-r from-slate-500 to-gray-500 text-white text-xs rounded-lg hover:from-slate-600 hover:to-gray-600 transition-all">
                              <RotateCcw className="w-3 h-3 inline mr-1" />
                              Reset
                            </button>
                          </>
                        )}
                        {stage.status === 'completed' && (
                          <button className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            View Report
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Close Button */}
          {isExpanded && (
            <motion.button
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(false)
                setActiveStage(null)
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default AlternativeWindCard 