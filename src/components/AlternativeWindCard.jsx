import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wind, Zap, Settings, CheckCircle, Play, Pause, RotateCcw, MapPin, Gauge, Leaf } from 'lucide-react'

const AlternativeWindCard = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeStage, setActiveStage] = useState(null)
  const [stages, setStages] = useState([
    {
      id: 1,
      name: 'Site Planning',
      description: 'Analyze wind patterns and determine optimal turbine placement',
      status: 'completed',
      progress: 100,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-30'),
      icon: <MapPin className="w-6 h-6" />,
      energyOutput: 0,
      windSpeed: 12
    },
    {
      id: 2,
      name: 'Installation',
      description: 'Install wind turbines and connect to power grid',
      status: 'in-progress',
      progress: 65,
      startDate: new Date('2024-02-01'),
      icon: <Settings className="w-6 h-6" />,
      energyOutput: 45,
      windSpeed: 15
    },
    {
      id: 3,
      name: 'Testing',
      description: 'Test turbine performance and power generation',
      status: 'not-started',
      progress: 0,
      icon: <Gauge className="w-6 h-6" />,
      energyOutput: 0,
      windSpeed: 0
    },
    {
      id: 4,
      name: 'Operation',
      description: 'Monitor and maintain wind farm operations',
      status: 'not-started',
      progress: 0,
      icon: <Leaf className="w-6 h-6" />,
      energyOutput: 0,
      windSpeed: 0
    }
  ])

  const overallProgress = stages.reduce((acc, stage) => acc + stage.progress, 0) / stages.length
  const totalEnergyOutput = stages.reduce((acc, stage) => acc + (stage.energyOutput || 0), 0)

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-emerald-400'
      case 'in-progress': return 'text-amber-400'
      case 'error': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20'
      case 'in-progress': return 'bg-amber-500/20'
      case 'error': return 'bg-red-500/20'
      default: return 'bg-slate-500/20'
    }
  }

  const handleStageAction = (stageId, action) => {
    setStages(prev => prev.map(stage => {
      if (stage.id === stageId) {
        switch (action) {
          case 'start':
            return { 
              ...stage, 
              status: 'in-progress', 
              startDate: new Date(),
              energyOutput: Math.floor(Math.random() * 50) + 20,
              windSpeed: Math.floor(Math.random() * 10) + 8
            }
          case 'pause':
            return { ...stage, status: 'not-started' }
          case 'complete':
            return { 
              ...stage, 
              status: 'completed', 
              progress: 100, 
              endDate: new Date(),
              energyOutput: 100,
              windSpeed: 18
            }
          default:
            return stage
        }
      }
      return stage
    }))
  }

  return (
    <div className="relative">
      {/* Alternative Design - Hexagonal Layout */}
      <motion.div
        className="relative bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 rounded-3xl p-8 cursor-pointer overflow-hidden"
        style={{ 
          width: isExpanded ? '900px' : '500px', 
          height: isExpanded ? '800px' : '550px',
          background: 'linear-gradient(135deg, #0c4a6e 0%, #1e40af 50%, #3730a3 100%)'
        }}
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Energy Orbs */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-cyan-400/30 rounded-full blur-sm"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i * 10)}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
          
          {/* Wind Flow Lines */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`wind-${i}`}
              className="absolute h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
              style={{
                left: `${10 + (i * 20)}%`,
                top: `${20 + (i * 15)}%`,
                width: '60px',
              }}
              animate={{
                x: [0, 100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header with Energy Stats */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Wind Farm Beta</h2>
              <p className="text-cyan-200 text-sm">Coastal Plains • 50MW Capacity</p>
            </div>
            
            {/* Energy Output Display */}
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400">{totalEnergyOutput} MW</div>
              <div className="text-xs text-cyan-200">Current Output</div>
            </div>
          </div>

          {/* Central Progress Display */}
          <div className="flex justify-center mb-6 flex-shrink-0">
            <div className="relative">
              {/* Outer Ring - Overall Progress */}
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                  fill="none"
                />
                <motion.circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="url(#energyGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 48}`}
                  strokeDashoffset={`${2 * Math.PI * 48 * (1 - overallProgress / 100)}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - overallProgress / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Inner Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-white">{Math.round(overallProgress)}%</div>
                <div className="text-xs text-cyan-200">Complete</div>
              </div>
            </div>
          </div>

          {/* Hexagonal Stage Layout */}
          <div className="flex justify-center flex-1 min-h-0">
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {stages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  className={`relative p-3 rounded-xl ${getStatusBgColor(stage.status)} border border-white/10 cursor-pointer`}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveStage(activeStage === stage.id ? null : stage.id)
                  }}
                  animate={{
                    scale: stage.status === 'in-progress' ? [1, 1.02, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: stage.status === 'in-progress' ? Infinity : 0,
                  }}
                >
                  {/* Stage Icon */}
                  <div className="flex justify-center mb-2">
                    <div className={`p-2 rounded-full ${getStatusBgColor(stage.status)}`}>
                      <div className={getStatusColor(stage.status)}>
                        {stage.icon}
                      </div>
                    </div>
                  </div>
                  
                  {/* Stage Info */}
                  <div className="text-center">
                    <h4 className="text-white font-semibold text-xs mb-1">{stage.name}</h4>
                    <div className="text-xs text-cyan-200">{stage.progress}%</div>
                  </div>
                  
                  {/* Energy Output */}
                  {stage.energyOutput && stage.energyOutput > 0 && (
                    <div className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs px-1 py-0.5 rounded-full text-[10px]">
                      {stage.energyOutput}MW
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stage Detail Modal */}
          <AnimatePresence>
            {activeStage && (
              <motion.div
                className="absolute inset-0 bg-black/70 backdrop-blur-md rounded-3xl p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {(() => {
                  const stage = stages.find(s => s.id === activeStage)
                  if (!stage) return null
                  
                  return (
                    <div className="h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-2xl ${getStatusBgColor(stage.status)}`}>
                            <div className={getStatusColor(stage.status)}>
                              {stage.icon}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{stage.name}</h3>
                            <p className="text-cyan-200 text-sm">{stage.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveStage(null)
                          }}
                          className="text-white/70 hover:text-white transition-colors text-xl p-2 hover:bg-white/10 rounded-full"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {/* Progress Section */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-cyan-200 text-sm">Progress</span>
                            <span className="text-white font-semibold">{stage.progress}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-3">
                            <motion.div
                              className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${stage.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                              <span className="text-cyan-200 text-sm">Energy Output</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{stage.energyOutput || 0} MW</div>
                            <div className="text-xs text-cyan-200">Current Generation</div>
                          </div>
                          
                          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                              <span className="text-cyan-200 text-sm">Wind Speed</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{stage.windSpeed || 0} m/s</div>
                            <div className="text-xs text-cyan-200">Optimal Range: 8-15 m/s</div>
                          </div>
                        </div>

                        {/* Stage-Specific Information */}
                        <div className="mb-6">
                          <h4 className="text-white font-semibold mb-3">Stage Details</h4>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                            {stage.id === 1 && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  <span className="text-white text-sm">Wind Analysis Complete</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  <span className="text-white text-sm">Site Survey Finished</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  <span className="text-white text-sm">Environmental Assessment Done</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  <span className="text-white text-sm">Permits Approved</span>
                                </div>
                              </div>
                            )}
                            
                            {stage.id === 2 && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                  <span className="text-white text-sm">Foundation Work (65%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                  <span className="text-white text-sm">Tower Assembly (40%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span className="text-white text-sm">Turbine Installation (Pending)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span className="text-white text-sm">Grid Connection (Pending)</span>
                                </div>
                              </div>
                            )}
                            
                            {stage.id === 3 && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span className="text-white text-sm">Performance Testing</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span className="text-white text-sm">Safety Checks</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span className="text-white text-sm">Power Output Verification</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span className="text-white text-sm">System Integration</span>
                                </div>
                              </div>
                            )}
                            
                            {stage.id === 4 && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span className="text-white text-sm">24/7 Monitoring</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span className="text-white text-sm">Predictive Maintenance</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span className="text-white text-sm">Performance Optimization</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span className="text-white text-sm">Energy Distribution</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          {stage.status === 'not-started' && (
                            <motion.button
                              onClick={() => handleStageAction(stage.id, 'start')}
                              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Play className="w-4 h-4 inline mr-2" />
                              Start Stage
                            </motion.button>
                          )}
                          
                          {stage.status === 'in-progress' && (
                            <>
                              <motion.button
                                onClick={() => handleStageAction(stage.id, 'pause')}
                                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Pause className="w-4 h-4 inline mr-2" />
                                Pause
                              </motion.button>
                              <motion.button
                                onClick={() => handleStageAction(stage.id, 'complete')}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <CheckCircle className="w-4 h-4 inline mr-2" />
                                Complete
                              </motion.button>
                            </>
                          )}
                          
                          {stage.status === 'completed' && (
                            <motion.button
                              onClick={() => handleStageAction(stage.id, 'start')}
                              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <RotateCcw className="w-4 h-4 inline mr-2" />
                              Restart
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default AlternativeWindCard 