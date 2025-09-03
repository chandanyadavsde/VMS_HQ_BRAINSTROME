/**
 * Driver Basic Info Form Section
 * Driver creation form - personal and license details
 */

import React from 'react'
import { motion } from 'framer-motion'
import { User, Phone, CreditCard, Calendar, Award, AlertCircle } from 'lucide-react'

const DriverBasicInfo = ({ formData, setFormData, errors = {} }) => {
  const updateDriverData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      driver: {
        ...prev.driver,
        [field]: value
      }
    }))
  }

  const licenseCategories = [
    { value: 'Light Motor Vehicle', label: 'Light Motor Vehicle (LMV)', description: 'Cars, jeeps, light trucks' },
    { value: 'Medium Passenger Vehicle', label: 'Medium Passenger Vehicle (MPV)', description: 'Buses up to 32 seats' },
    { value: 'Medium Goods Vehicle', label: 'Medium Goods Vehicle (MGV)', description: 'Trucks 3.5-7.5 tons' },
    { value: 'Heavy Passenger Vehicle', label: 'Heavy Passenger Vehicle (HPV)', description: 'Large buses' },
    { value: 'Heavy Goods Vehicle', label: 'Heavy Goods Vehicle (HGV)', description: 'Heavy trucks, trailers' }
  ]

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
  }

  const validateLicenseNumber = (license) => {
    // Indian driving license format: 2 letters + 13 digits
    const regex = /^[A-Z]{2}[0-9]{13}$/
    return regex.test(license)
  }

  const validatePhone = (phone) => {
    // Indian phone number validation
    const regex = /^[\+]?[0-9]{10,15}$/
    return regex.test(phone.replace(/\s/g, ''))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Driver Information
        </h3>
        <p className="text-gray-600">
          Enter driver personal details and license information
        </p>
      </div>

      {/* Personal Information Section */}
      <div className="space-y-6">
        <div className="border-l-4 border-indigo-500 pl-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Personal Information
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Driver Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <User className="w-4 h-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              placeholder="Enter driver's full name"
              value={formData.driver.custrecord_driver_name || ''}
              onChange={(e) => updateDriverData('custrecord_driver_name', e.target.value)}
              className={`w-full px-4 py-4 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all ${
                errors.custrecord_driver_name ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.custrecord_driver_name && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.custrecord_driver_name}
              </p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Phone className="w-4 h-4 inline mr-2" />
              Mobile Number *
            </label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={formData.driver.custrecord_driver_mobile_no || ''}
              onChange={(e) => updateDriverData('custrecord_driver_mobile_no', e.target.value)}
              className={`w-full px-4 py-4 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all ${
                errors.custrecord_driver_mobile_no ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.custrecord_driver_mobile_no && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.custrecord_driver_mobile_no}
              </p>
            )}
            {formData.driver.custrecord_driver_mobile_no && !validatePhone(formData.driver.custrecord_driver_mobile_no) && (
              <p className="mt-2 text-sm text-orange-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Please enter a valid phone number
              </p>
            )}
          </div>

          {/* LCA Test (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              LCA Test Result
            </label>
            <input
              type="text"
              placeholder="LCA test details (optional)"
              value={formData.driver.custrecord_driving_lca_test || ''}
              onChange={(e) => updateDriverData('custrecord_driving_lca_test', e.target.value)}
              className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />
            <p className="mt-2 text-xs text-gray-500">
              Learning and Competency Assessment details
            </p>
          </div>
        </div>
      </div>

      {/* License Information Section */}
      <div className="space-y-6">
        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Driving License Details
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* License Number */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <CreditCard className="w-4 h-4 inline mr-2" />
              Driving License Number *
            </label>
            <input
              type="text"
              placeholder="e.g., MH1234567890123"
              value={formData.driver.custrecord_driving_license_no || ''}
              onChange={(e) => updateDriverData('custrecord_driving_license_no', e.target.value.toUpperCase())}
              className={`w-full px-4 py-4 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-mono text-lg tracking-wider ${
                errors.custrecord_driving_license_no ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.custrecord_driving_license_no && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.custrecord_driving_license_no}
              </p>
            )}
            {formData.driver.custrecord_driving_license_no && !validateLicenseNumber(formData.driver.custrecord_driving_license_no) && (
              <p className="mt-2 text-sm text-orange-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Format: 2 letters + 13 digits (e.g., MH1234567890123)
              </p>
            )}
          </div>

          {/* License Start Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              License Issue Date *
            </label>
            <input
              type="date"
              value={formatDate(formData.driver.custrecord_driving_license_s_date)}
              onChange={(e) => updateDriverData('custrecord_driving_license_s_date', e.target.value)}
              className={`w-full px-4 py-4 bg-white border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all ${
                errors.custrecord_driving_license_s_date ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.custrecord_driving_license_s_date && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.custrecord_driving_license_s_date}
              </p>
            )}
          </div>

          {/* License End Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              License Expiry Date *
            </label>
            <input
              type="date"
              value={formatDate(formData.driver.custrecord_driver_license_e_date)}
              onChange={(e) => updateDriverData('custrecord_driver_license_e_date', e.target.value)}
              className={`w-full px-4 py-4 bg-white border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all ${
                errors.custrecord_driver_license_e_date ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.custrecord_driver_license_e_date && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.custrecord_driver_license_e_date}
              </p>
            )}
            {/* License Expiry Warning */}
            {formData.driver.custrecord_driver_license_e_date && new Date(formData.driver.custrecord_driver_license_e_date) < new Date() && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                License has expired!
              </p>
            )}
            {formData.driver.custrecord_driver_license_e_date && new Date(formData.driver.custrecord_driver_license_e_date) > new Date() && new Date(formData.driver.custrecord_driver_license_e_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
              <p className="mt-2 text-sm text-orange-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                License expires within 30 days
              </p>
            )}
          </div>

          {/* License Category */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Award className="w-4 h-4 inline mr-2" />
              License Category *
            </label>
            <select
              value={formData.driver.custrecord_license_category_ag || ''}
              onChange={(e) => updateDriverData('custrecord_license_category_ag', e.target.value)}
              className={`w-full px-4 py-4 bg-white border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all ${
                errors.custrecord_license_category_ag ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            >
              <option value="">Select License Category</option>
              {licenseCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.custrecord_license_category_ag && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.custrecord_license_category_ag}
              </p>
            )}
            
            {/* Show category description */}
            {formData.driver.custrecord_license_category_ag && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>{licenseCategories.find(cat => cat.value === formData.driver.custrecord_license_category_ag)?.label}:</strong>
                  {' '}
                  {licenseCategories.find(cat => cat.value === formData.driver.custrecord_license_category_ag)?.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Required Fields Info */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <h5 className="font-semibold text-indigo-900 mb-1">Required Information</h5>
              <p className="text-sm text-indigo-700">
                Name, mobile number, license number, dates, and category are mandatory.
              </p>
            </div>
          </div>
        </div>

        {/* Document Upload Next */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <div>
              <h5 className="font-semibold text-green-900 mb-1">Next Step</h5>
              <p className="text-sm text-green-700">
                Upload license document and driver photo in the next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DriverBasicInfo
