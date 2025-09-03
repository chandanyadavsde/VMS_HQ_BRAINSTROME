/**
 * Master Modal Component
 * Unified modal for vehicle and driver creation with multiple flows
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Car, 
  User, 
  Link, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  Upload,
  FileText,
  Calendar,
  Phone,
  MapPin
} from 'lucide-react'

// Import form sections
import VehicleBasicInfo from './FormSections/VehicleBasicInfo.jsx'
import VehicleDocuments from './FormSections/VehicleDocuments.jsx'
import DriverBasicInfo from './FormSections/DriverBasicInfo.jsx'

const MasterModal = ({ isOpen, onClose, initialFlow = 'choose' }) => {
  const [currentFlow, setCurrentFlow] = useState(initialFlow) // 'choose', 'unified', 'vehicle', 'driver'
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    vehicle: {},
    driver: {}
  })

  // Flow configurations
  const flowConfigs = {
    unified: {
      title: 'Add Vehicle + Driver',
      icon: <Link className="w-6 h-6" />,
      color: 'purple',
      steps: [
        { id: 1, title: 'Vehicle Info', description: 'Basic vehicle details' },
        { id: 2, title: 'Vehicle Docs', description: 'Upload documents' },
        { id: 3, title: 'Driver Info', description: 'Driver details' },
        { id: 4, title: 'Driver Docs', description: 'License & photo' },
        { id: 5, title: 'Assignment', description: 'Plant & assignment' },
        { id: 6, title: 'Review', description: 'Confirm & submit' }
      ]
    },
    vehicle: {
      title: 'Add Vehicle',
      icon: <Car className="w-6 h-6" />,
      color: 'blue',
      steps: [
        { id: 1, title: 'Basic Info', description: 'Vehicle details' },
        { id: 2, title: 'Technical', description: 'Specifications' },
        { id: 3, title: 'Documents', description: 'Upload files' },
        { id: 4, title: 'Assignment', description: 'Plant & driver' },
        { id: 5, title: 'Review', description: 'Confirm & submit' }
      ]
    },
    driver: {
      title: 'Add Driver',
      icon: <User className="w-6 h-6" />,
      color: 'indigo',
      steps: [
        { id: 1, title: 'Personal Info', description: 'Driver details' },
        { id: 2, title: 'License', description: 'License information' },
        { id: 3, title: 'Documents', description: 'Upload files' },
        { id: 4, title: 'Review', description: 'Confirm & submit' }
      ]
    }
  }

  const currentConfig = flowConfigs[currentFlow]

  const handleFlowSelect = (flow) => {
    setCurrentFlow(flow)
    setCurrentStep(1)
  }

  const nextStep = () => {
    if (currentStep < currentConfig?.steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setCurrentFlow('choose')
    setCurrentStep(1)
    setFormData({ vehicle: {}, driver: {} })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
              
              {/* Flow Selection Screen */}
              {currentFlow === 'choose' && (
                <FlowSelection onFlowSelect={handleFlowSelect} onClose={handleClose} />
              )}

              {/* Form Flows */}
              {currentFlow !== 'choose' && (
                <>
                  {/* Header */}
                  <FormHeader 
                    config={currentConfig}
                    currentStep={currentStep}
                    onClose={handleClose}
                    onBack={() => setCurrentFlow('choose')}
                  />

                  {/* Progress Bar */}
                  <ProgressBar 
                    steps={currentConfig.steps}
                    currentStep={currentStep}
                    color={currentConfig.color}
                  />

                  {/* Form Content */}
                  <div className="p-8 max-h-[60vh] overflow-y-auto">
                    <FormContent 
                      flow={currentFlow}
                      step={currentStep}
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </div>

                  {/* Footer */}
                  <FormFooter 
                    currentStep={currentStep}
                    totalSteps={currentConfig.steps.length}
                    onPrev={prevStep}
                    onNext={nextStep}
                    onSubmit={() => console.log('Submit:', formData)}
                    color={currentConfig.color}
                  />
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Flow Selection Component
const FlowSelection = ({ onFlowSelect, onClose }) => {
  const flows = [
    {
      id: 'unified',
      title: 'Vehicle + Driver',
      description: 'Create vehicle and assign a new driver in one flow',
      icon: <Link className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      features: ['Complete workflow', 'Automatic assignment', 'One-click creation']
    },
    {
      id: 'vehicle',
      title: 'Vehicle Only',
      description: 'Add a new vehicle and optionally assign existing driver',
      icon: <Car className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      features: ['Vehicle details', 'Document upload', 'Optional assignment']
    },
    {
      id: 'driver',
      title: 'Driver Only',
      description: 'Add a new driver to the system',
      icon: <User className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      features: ['Driver profile', 'License details', 'Document upload']
    }
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Creation Flow
          </h2>
          <p className="text-gray-600">
            Select how you want to create your master data
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {/* Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {flows.map((flow) => (
          <motion.div
            key={flow.id}
            className={`${flow.bgColor} ${flow.borderColor} border-2 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all`}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFlowSelect(flow.id)}
          >
            {/* Icon */}
            <div className={`w-16 h-16 bg-gradient-to-r ${flow.color} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto`}>
              {flow.icon}
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {flow.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {flow.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                {flow.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="mt-6">
                <div className={`bg-gradient-to-r ${flow.color} text-white px-4 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2 hover:shadow-md transition-all`}>
                  Start
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Form Header Component
const FormHeader = ({ config, currentStep, onClose, onBack }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        
        <div className={`w-12 h-12 bg-gradient-to-r ${
          config.color === 'purple' ? 'from-purple-500 to-pink-600' :
          config.color === 'blue' ? 'from-blue-500 to-cyan-600' :
          'from-indigo-500 to-purple-600'
        } rounded-xl flex items-center justify-center text-white`}>
          {config.icon}
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {config.title}
          </h2>
          <p className="text-sm text-gray-600">
            Step {currentStep}: {config.steps[currentStep - 1]?.title}
          </p>
        </div>
      </div>
      
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  )
}

// Progress Bar Component
const ProgressBar = ({ steps, currentStep, color }) => {
  const progressPercentage = (currentStep / steps.length) * 100

  return (
    <div className="px-6 py-4 bg-gray-50">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step.id <= currentStep
                ? color === 'purple' ? 'bg-purple-500 text-white' :
                  color === 'blue' ? 'bg-blue-500 text-white' :
                  'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step.id <= currentStep ? <Check className="w-4 h-4" /> : step.id}
            </div>
            <span className="text-xs text-gray-600 mt-1 hidden sm:block">
              {step.title}
            </span>
          </div>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-600' :
            color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
            'bg-gradient-to-r from-indigo-500 to-purple-600'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}

// Form Content Component
const FormContent = ({ flow, step, formData, setFormData }) => {
  // Dynamic form content based on flow and step
  if (flow === 'unified') {
    switch (step) {
      case 1:
        return <VehicleBasicInfo formData={formData} setFormData={setFormData} />
      case 2:
        return <VehicleDocuments formData={formData} setFormData={setFormData} />
      case 3:
        return <DriverBasicInfo formData={formData} setFormData={setFormData} />
      case 4:
        return <DriverDocuments formData={formData} setFormData={setFormData} />
      case 5:
        return <AssignmentAndPlant formData={formData} setFormData={setFormData} />
      case 6:
        return <ReviewAndSubmit formData={formData} setFormData={setFormData} />
      default:
        return <PlaceholderContent flow={flow} step={step} />
    }
  }
  
  if (flow === 'vehicle') {
    switch (step) {
      case 1:
        return <VehicleBasicInfo formData={formData} setFormData={setFormData} />
      case 2:
        return <VehicleTechnical formData={formData} setFormData={setFormData} />
      case 3:
        return <VehicleDocuments formData={formData} setFormData={setFormData} />
      case 4:
        return <VehicleAssignment formData={formData} setFormData={setFormData} />
      case 5:
        return <ReviewAndSubmit formData={formData} setFormData={setFormData} />
      default:
        return <PlaceholderContent flow={flow} step={step} />
    }
  }
  
  if (flow === 'driver') {
    switch (step) {
      case 1:
        return <DriverBasicInfo formData={formData} setFormData={setFormData} />
      case 2:
        return <DriverLicense formData={formData} setFormData={setFormData} />
      case 3:
        return <DriverDocuments formData={formData} setFormData={setFormData} />
      case 4:
        return <ReviewAndSubmit formData={formData} setFormData={setFormData} />
      default:
        return <PlaceholderContent flow={flow} step={step} />
    }
  }

  return <PlaceholderContent flow={flow} step={step} />
}

// Placeholder components for sections not yet implemented
const PlaceholderContent = ({ flow, step }) => (
  <div className="space-y-6">
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {flow} - Step {step}
      </h3>
      <p className="text-gray-600">
        This form section will be implemented next.
      </p>
    </div>
  </div>
)

const DriverDocuments = ({ formData, setFormData }) => <PlaceholderContent flow="driver" step="documents" />
const VehicleTechnical = ({ formData, setFormData }) => <PlaceholderContent flow="vehicle" step="technical" />
const VehicleAssignment = ({ formData, setFormData }) => <PlaceholderContent flow="vehicle" step="assignment" />
const DriverLicense = ({ formData, setFormData }) => <PlaceholderContent flow="driver" step="license" />
const AssignmentAndPlant = ({ formData, setFormData }) => <PlaceholderContent flow="unified" step="assignment" />
const ReviewAndSubmit = ({ formData, setFormData }) => <PlaceholderContent flow="any" step="review" />

// Form Footer Component
const FormFooter = ({ currentStep, totalSteps, onPrev, onNext, onSubmit, color }) => {
  const isLastStep = currentStep === totalSteps

  return (
    <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
      <button
        onClick={onPrev}
        disabled={currentStep === 1}
        className="px-6 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="text-sm text-gray-500">
        Step {currentStep} of {totalSteps}
      </div>
      
      {isLastStep ? (
        <button
          onClick={onSubmit}
          className={`px-8 py-3 text-white font-medium rounded-xl transition-all flex items-center gap-2 ${
            color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg' :
            color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-lg' :
            'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg'
          }`}
        >
          <Check className="w-4 h-4" />
          Create & Submit
        </button>
      ) : (
        <button
          onClick={onNext}
          className={`px-6 py-3 text-white font-medium rounded-xl transition-all flex items-center gap-2 ${
            color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg' :
            color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-lg' :
            'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg'
          }`}
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default MasterModal
