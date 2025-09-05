import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, User, Phone, Plus, Trash2, Edit } from 'lucide-react'

const ContactManagementModal = ({ vehicle, onClose }) => {
  // Debug: Log the vehicle data
  console.log('🔍 ContactManagementModal - Vehicle data:', vehicle)
  console.log('🔍 ContactManagementModal - ContactPersons:', vehicle?.contactPersons)
  
  // Initialize contacts from vehicle data or empty array
  const [contacts, setContacts] = useState(() => {
    if (!vehicle?.contactPersons || !Array.isArray(vehicle.contactPersons)) {
      console.log('📝 No contactPersons found, using empty array')
      return []
    }
    
    console.log('📝 Found contactPersons:', vehicle.contactPersons)
    
    // Transform API data to our component format
    return vehicle.contactPersons.map(contact => ({
      id: contact._id || contact.id || Date.now() + Math.random(),
      name: contact.name || 'Unknown',
      phone: contact.phone || 'N/A',
      role: contact.role || 'Contact',
      addedDate: contact.addedDate,
      _id: contact._id
    }))
  })
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [newContact, setNewContact] = useState({ name: '', phone: '', role: '' })

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, { ...newContact, id: Date.now() }])
      setNewContact({ name: '', phone: '', role: '' })
      setShowAddForm(false)
    }
  }

  const handleRemoveContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id))
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      return 'Unknown'
    }
  }

  if (!vehicle) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        className="relative bg-white rounded-lg p-6 max-w-2xl w-full border border-slate-200 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Contact Management</h2>
            <p className="text-slate-600 text-sm">Manage contacts for {vehicle.vehicleNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Current Contacts */}
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Current Contacts</h3>
          {contacts.length === 0 ? (
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 text-center">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">No contacts configured</p>
              <p className="text-slate-500 text-sm">Add contacts to manage emergency and backup contacts for this vehicle</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{contact.name}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{contact.role}</span>
                        {contact.addedDate && (
                          <>
                            <span>•</span>
                            <span>Added: {formatDate(contact.addedDate)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button 
                      onClick={() => handleRemoveContact(contact.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add New Contact */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 p-4 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-700">Add New Contact</span>
          </button>
        ) : (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-3">Add New Contact</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Contact Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="Role (e.g., Emergency Contact)"
                value={newContact.role}
                onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddContact}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
                >
                  Add Contact
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">
                {contacts.length} contact{contacts.length !== 1 ? 's' : ''} configured
              </p>
              {vehicle?.contactPersons && (
                <p className="text-slate-500 text-xs">
                  Vehicle: {vehicle.vehicleNumber} • Data from API
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ContactManagementModal
