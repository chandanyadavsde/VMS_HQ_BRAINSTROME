import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wind, Zap, Settings, CheckCircle, Play, Pause, RotateCcw, TrendingUp, Activity } from 'lucide-react'

const ModernWindCard = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedStage, setSelectedStage] = useState(null)
  const [stages, setStages] = useState([
    {
      id: 1,
      name: 'Site Planning',
      description: 'Analyze wind patterns and determine optimal turbine placement',
      status: 'completed',
      progress: 100,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-30'),
      icon: <Wind className="w-5 h-5" />,
      efficiency: 95,
      powerGenerated: 0
    },
    {
      id: 2,
      name: 'Installation',
      description: 'Install wind turbines and connect to power grid',
      status: 'in-progress',
      progress: 65,
      startDate: new Date('2024-02-01'),
      icon: <Settings className="w-5 h-5" />,
      efficiency: 78,
      powerGenerated: 32.5
    },
    {
      id: 3,
      name: 'Testing',
      description: 'Test turbine performance and power generation',
      status: 'not-started',
      progress: 0,
      icon: <Zap className="w-5 h-5" />,
      efficiency: 0,
      powerGenerated: 0
    },
    {
      id: 4,
      name: 'Operation',
      description: 'Monitor and maintain wind farm operations',
      status: 'not-started',
      progress: 0,
      icon: <CheckCircle className="w-5 h-5" />,
      efficiency: 0,
      powerGenerated: 0
    }
  ])

  const overallProgress = stages.reduce((acc, stage) => acc + stage.progress, 0) / stages.length
  const totalPowerGenerated = stages.reduce((acc, stage) => acc + (stage.powerGenerated || 0), 0)
  const averageEfficiency = stages.reduce((acc, stage) => acc + (stage.efficiency || 0), 0) / stages.length

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500'
      case 'in-progress': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-gray-400'
    }
  }

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 border-green-500/30'
      case 'in-progress': return 'bg-yellow-500/10 border-yellow-500/30'
      case 'error': return 'bg-red-500/10 border-red-500/30'
      default: return 'bg-gray-500/10 border-gray-500/30'
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
              efficiency: Math.floor(Math.random() * 30) + 60,
              powerGenerated: Math.floor(Math.random() * 40) + 20
            }
          case 'pause':
            return { ...stage, status: 'not-started' }
          case 'complete':
            return { 
              ...stage, 
              status: 'completed', 
              progress: 100, 
              endDate: new Date(),
              efficiency: 95,
              powerGenerated: 50
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
      {/* Modern Design - Timeline Layout */}
      <motion.div
        className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 cursor-pointer overflow-hidden shadow-2xl"
        style={{ 
          width: isExpanded ? '1000px' : '600px', 
          height: isExpanded ? '800px' : '500px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 30px 60px rgba(0,0,0,0.1)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, #06b6d4 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Wind Farm Gamma</h2>
              <p className="text-gray-600 dark:text-gray-300">Advanced Energy Management System</p>
            </div>
            
            {/* Key Metrics */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</div>
                <div className="text-xs text-gray-500">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalPowerGenerated.toFixed(1)} MW</div>
                <div className="text-xs text-gray-500">Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(averageEfficiency)}%</div>
                <div className="text-xs text-gray-500">Efficiency</div>
              </div>
            </div>
          </div>

          {/* Timeline Layout */}
          <div className="flex-1">
            {!isExpanded ? (
              // Compact Timeline View
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500" />
                
                {stages.map((stage, index) => (
                  <motion.div
                    key={stage.id}
                    className="relative flex items-center mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-6 w-4 h-4 rounded-full border-2 ${getStatusBgColor(stage.status)} ${getStatusColor(stage.status)} flex items-center justify-center`}>
                      {stage.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                      {stage.status === 'in-progress' && <Activity className="w-3 h-3" />}
                    </div>
                    
                    {/* Stage Card */}
                    <motion.div
                      className={`ml-12 flex-1 p-4 rounded-2xl ${getStatusBgColor(stage.status)} border cursor-pointer`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedStage(stage.id)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getStatusBgColor(stage.status)}`}>
                            <div className={getStatusColor(stage.status)}>
                              {stage.icon}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{stage.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{stage.description}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{stage.progress}%</div>
                          {stage.powerGenerated && stage.powerGenerated > 0 && (
                            <div className="text-sm text-green-600">{stage.powerGenerated} MW</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Expanded Detailed View
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Process Timeline</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsExpanded(false)
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-6">
                    {stages.map((stage, index) => (
                      <motion.div
                        key={stage.id}
                        className={`p-6 rounded-3xl ${getStatusBgColor(stage.status)} border`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${getStatusBgColor(stage.status)}`}>
                              <div className={getStatusColor(stage.status)}>
                                {stage.icon}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{stage.name}</h4>
                              <p className="text-gray-600 dark:text-gray-300">{stage.description}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stage.progress}%</div>
                            {stage.efficiency && stage.efficiency > 0 && (
                              <div className="text-sm text-green-600">Efficiency: {stage.efficiency}%</div>
                            )}
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${stage.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
                            <div className="text-sm text-gray-500">Progress</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{stage.progress}%</div>
                          </div>
                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
                            <div className="text-sm text-gray-500">Power Generated</div>
                            <div className="text-lg font-bold text-green-600">{stage.powerGenerated || 0} MW</div>
                          </div>
                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
                            <div className="text-sm text-gray-500">Efficiency</div>
                            <div className="text-lg font-bold text-purple-600">{stage.efficiency || 0}%</div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          {stage.status === 'not-started' && (
                            <motion.button
                              onClick={() => handleStageAction(stage.id, 'start')}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Play className="w-4 h-4 inline mr-2" />
                              Start
                            </motion.button>
                          )}
                          
                          {stage.status === 'in-progress' && (
                            <>
                              <motion.button
                                onClick={() => handleStageAction(stage.id, 'pause')}
                                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Pause className="w-4 h-4 inline mr-2" />
                                Pause
                              </motion.button>
                              <motion.button
                                onClick={() => handleStageAction(stage.id, 'complete')}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
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
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ModernWindCard 