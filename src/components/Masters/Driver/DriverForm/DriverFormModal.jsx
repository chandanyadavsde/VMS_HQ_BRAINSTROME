import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Save, ArrowLeft, ArrowRight } from 'lucide-react'
import { BaseModal } from '../../../common'
import DriverBasicInfo from './DriverBasicInfo.jsx'
import DriverLicense from './DriverLicense.jsx'
import DriverDocuments from './DriverDocuments.jsx'

const DriverFormModal = ({
  isOpen,
  onClose,
  driver = null,
  onCreateDriver,
  onUpdateDriver,
  currentTheme = 'teal'
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    contact: {
      phone: '',
      email: '',
      address: ''
    },
    identification: {
      licenseNumber: '',
      licenseType: 'Heavy Vehicle',
      licenseExpiry: '',
      aadharNumber: '',
      panNumber: ''
    },
    documents: [],
    status: 'Active',
    assignedVehicles: []
  })

  const totalSteps = 3
  const isEditing = !!driver

  // Initialize form data when driver is provided
  useEffect(() => {
    if (driver) {
      setFormData(driver)
    } else {
      // Reset form for new driver
      setFormData({
        name: '',
        contact: {
          phone: '',
          email: '',
          address: ''
        },
        identification: {
          licenseNumber: '',
          licenseType: 'Heavy Vehicle',
          licenseExpiry: '',
          aadharNumber: '',
          panNumber: ''
        },
        documents: [],
        status: 'Active',
        assignedVehicles: []
      })
    }
    setCurrentStep(1)
  }, [driver, isOpen])

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
        await onUpdateDriver(driver.id, formData)
      } else {
        await onCreateDriver(formData)
      }
      onClose()
    } catch (error) {
      console.error('Error saving driver:', error)
    }
  }

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DriverBasicInfo
            formData={formData}
            setFormData={updateFormData}
            currentTheme={currentTheme}
          />
        )
      case 2:
        return (
          <DriverLicense
            formData={formData}
            setFormData={updateFormData}
            currentTheme={currentTheme}
          />
        )
      case 3:
        return (
          <DriverDocuments
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
        return 'License & Identification'
      case 3:
        return 'Documents'
      default:
        return 'Driver Form'
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.contact.phone && formData.contact.email
      case 2:
        return formData.identification.licenseNumber && formData.identification.licenseExpiry
      case 3:
        return true // Documents are optional
      default:
        return false
    }
  }

  if (!isOpen) return null

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isEditing ? 'Edit' : 'Create'} Driver - ${getStepTitle()}`}
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
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step <= currentStep
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-12 h-0.5 mx-2 transition-all ${
                    step < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
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
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <motion.button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              currentStep === 1
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-white'
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
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
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
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
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
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
                whileHover={isStepValid() ? { scale: 1.02 } : {}}
                whileTap={isStepValid() ? { scale: 0.98 } : {}}
              >
                <Save className="w-4 h-4" />
                {isEditing ? 'Update Driver' : 'Create Driver'}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  )
}

export default DriverFormModal
