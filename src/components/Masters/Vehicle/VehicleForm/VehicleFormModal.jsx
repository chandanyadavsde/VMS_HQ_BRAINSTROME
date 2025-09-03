import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Car, Save, ArrowLeft, ArrowRight } from 'lucide-react'
import { BaseModal } from '../../../common'
import VehicleBasicInfo from './VehicleBasicInfo.jsx'
import VehicleTechnical from './VehicleTechnical.jsx'
import VehicleDocuments from './VehicleDocuments.jsx'
import VehicleAssignment from './VehicleAssignment.jsx'

const VehicleFormModal = ({
  isOpen,
  onClose,
  vehicle = null,
  onCreateVehicle,
  onUpdateVehicle,
  currentTheme = 'teal'
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    plant: '',
    status: 'Active',
    type: 'Truck',
    specifications: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      engineNumber: '',
      chassisNumber: ''
    },
    documents: [],
    drivers: [],
    otherPersonnel: []
  })

  const totalSteps = 4
  const isEditing = !!vehicle

  // Initialize form data when vehicle is provided
  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle)
    } else {
      // Reset form for new vehicle
      setFormData({
        vehicleNumber: '',
        plant: '',
        status: 'Active',
        type: 'Truck',
        specifications: {
          make: '',
          model: '',
          year: new Date().getFullYear(),
          color: '',
          engineNumber: '',
          chassisNumber: ''
        },
        documents: [],
        drivers: [],
        otherPersonnel: []
      })
    }
    setCurrentStep(1)
  }, [vehicle, isOpen])

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await onUpdateVehicle(vehicle.id, formData)
      } else {
        await onCreateVehicle(formData)
      }
      onClose()
    } catch (error) {
      console.error('Error saving vehicle:', error)
    }
  }

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <VehicleBasicInfo
            formData={formData}
            setFormData={updateFormData}
            currentTheme={currentTheme}
          />
        )
      case 2:
        return (
          <VehicleTechnical
            formData={formData}
            setFormData={updateFormData}
            currentTheme={currentTheme}
          />
        )
      case 3:
        return (
          <VehicleDocuments
            formData={formData}
            setFormData={updateFormData}
            currentTheme={currentTheme}
          />
        )
      case 4:
        return (
          <VehicleAssignment
            formData={formData}
            setFormData={updateFormData}
            currentTheme={currentTheme}
          />
        )
      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Basic Information'
      case 2:
        return 'Technical Specifications'
      case 3:
        return 'Documents'
      case 4:
        return 'Assignments'
      default:
        return 'Vehicle Form'
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.vehicleNumber && formData.plant && formData.type
      case 2:
        return formData.specifications.make && formData.specifications.model
      case 3:
        return true // Documents are optional
      case 4:
        return true // Assignments are optional
      default:
        return false
    }
  }

  if (!isOpen) return null

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isEditing ? 'Edit' : 'Create'} Vehicle - ${getStepTitle()}`}
      maxWidth="max-w-4xl"
      height="h-[90vh]"
    >
      <div className="flex flex-col h-full">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step <= currentStep
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
              {step < 4 && (
                <div
                  className={`w-12 h-0.5 mx-2 transition-all ${
                    step < currentStep ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <motion.button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            whileHover={currentStep > 1 ? { scale: 1.02 } : {}}
            whileTap={currentStep > 1 ? { scale: 0.98 } : {}}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </motion.button>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>

            {currentStep < totalSteps ? (
              <motion.button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all ${
                  isStepValid()
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={isStepValid() ? { scale: 1.02 } : {}}
                whileTap={isStepValid() ? { scale: 0.98 } : {}}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all ${
                  isStepValid()
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={isStepValid() ? { scale: 1.02 } : {}}
                whileTap={isStepValid() ? { scale: 0.98 } : {}}
              >
                <Save className="w-4 h-4" />
                {isEditing ? 'Update Vehicle' : 'Create Vehicle'}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  )
}

export default VehicleFormModal
