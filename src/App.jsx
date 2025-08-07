import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import AlternativeWindCard from './components/AlternativeWindCard.jsx'
import ApprovalCard from './components/ApprovalCard.jsx'
import LoginScreen from './components/LoginScreen.jsx'
import LegalModal from './components/LegalModal.jsx'
import { getCurrentTheme, setTheme, getThemeColors } from './utils/theme.js'

// Header Component
const Header = ({ isScrolled, currentTheme, user, onLogout }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlant, setSelectedPlant] = useState('all')
  const themeColors = getThemeColors(currentTheme)

  const sections = [
    { id: 'wbs', name: 'WBS', path: '/' },
    { id: 'approvals', name: 'Approvals', path: '/approvals' },
    { id: 'masters', name: 'Masters', path: '/masters' }
  ]

  const plants = [
    { id: 'all', name: 'All Plants' },
    { id: 'mumbai', name: 'Mumbai' },
    { id: 'delhi', name: 'Delhi' },
    { id: 'bangalore', name: 'Bangalore' },
    { id: 'chennai', name: 'Chennai' },
    { id: 'pune', name: 'Pune' }
  ]

  const getCurrentSection = () => {
    switch (location.pathname) {
      case '/': return 'wbs'
      case '/approvals': return 'approvals'
      case '/masters': return 'masters'
      default: return 'wbs'
    }
  }

  return (
    <div className={`${isScrolled ? 'fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' : 'relative bg-white/90 backdrop-blur-sm'} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-14' : 'h-16'
        }`}>
          {/* Logo Section - Left Side */}
          <div className="flex items-center flex-1">
            <div className="flex items-center space-x-2">
              {/* Logo Icon */}
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              {/* Logo Text */}
              <div className={`transition-all duration-300 ${
                isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">VMS</h1>
                <p className="text-xs text-gray-500">Vehicle Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Center */}
          <div className="flex items-center justify-center flex-1">
            <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-orange-200/50 shadow-md">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => navigate(section.path)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    getCurrentSection() === section.id
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Section - Right Side */}
          <div className="flex items-center justify-end flex-1 space-x-2">
            {/* Theme Toggle */}
            <button className="w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-105">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            {/* Notifications */}
            <button className="w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 relative">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.user || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="text-xs text-orange-600 font-medium">{user?.role} • {user?.plant}</p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button 
                onClick={onLogout}
                className="w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-red-50 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                title="Logout"
              >
                <svg className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

// Search Component
const SearchBar = ({ searchQuery, setSearchQuery, selectedPlant, setSelectedPlant, activeSection, currentTheme }) => {
  const themeColors = getThemeColors(currentTheme)
  
  const plants = [
    { id: 'all', name: 'All Plants' },
    { id: 'mumbai', name: 'Mumbai' },
    { id: 'delhi', name: 'Delhi' },
    { id: 'bangalore', name: 'Bangalore' },
    { id: 'chennai', name: 'Chennai' },
    { id: 'pune', name: 'Pune' }
  ]

  return (
    <div className="flex justify-center mb-4">
      <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 border border-orange-200/50 shadow-md max-w-4xl w-full">
        {/* Search Row */}
        <div className="flex items-center space-x-2 mb-3">
          {/* Search Icon */}
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search projects, stages, or activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 backdrop-blur-sm border border-orange-200/50 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Search Actions */}
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md hover:scale-105 transform">
              Search
            </button>
          </div>
        </div>

        {/* Plant Filter and Stats Row */}
        <div className="pt-2 border-t border-orange-200/30">
          <div className="flex items-center justify-between">
            {/* Plant Filter - Left Side */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-700">Plant:</span>
              <div className="flex items-center space-x-1">
                {plants.map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => setSelectedPlant(plant.id)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all duration-300 ${
                      selectedPlant === plant.id
                        ? 'text-orange-600 bg-orange-50 border border-orange-200'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {plant.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Approval Stats - Right Side */}
            {activeSection === 'approvals' && (
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <div className="text-sm font-bold text-orange-600">15</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-green-600">8</div>
                  <div className="text-xs text-gray-500">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-amber-600">3</div>
                  <div className="text-xs text-gray-500">Overdue</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-600">67%</div>
                  <div className="text-xs text-gray-500">Progress</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard Component (WBS)
const Dashboard = ({ currentTheme }) => {
  return (
    <div className="flex items-center justify-center">
      <AlternativeWindCard currentTheme={currentTheme} />
    </div>
  )
}

// Approvals Component
const Approvals = ({ currentTheme }) => {
  const [selectedPlant, setSelectedPlant] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        selectedPlant={selectedPlant} 
        setSelectedPlant={setSelectedPlant}
        activeSection="approvals"
        currentTheme={currentTheme}
      />
      <div className="flex items-center justify-center">
        <ApprovalCard selectedPlant={selectedPlant} currentTheme={currentTheme} />
      </div>
    </>
  )
}

// Masters Component
const Masters = ({ currentTheme }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const themeColors = getThemeColors(currentTheme)

  return (
    <>
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        selectedPlant="all" 
        setSelectedPlant={() => {}}
        activeSection="masters"
        currentTheme={currentTheme}
      />
      <div className="flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-4xl">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Master Data</h3>
            <p className={`text-lg mb-6 ${themeColors.accentText}`}>Manage core data, configurations, and system settings</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-semibold text-white mb-2">Project Templates</h4>
                <p className={`text-sm ${themeColors.accentText}`}>Configure project templates and standards</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-semibold text-white mb-2">User Management</h4>
                <p className={`text-sm ${themeColors.accentText}`}>Manage users, roles, and permissions</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-semibold text-white mb-2">System Settings</h4>
                <p className={`text-sm ${themeColors.accentText}`}>Configure system parameters and defaults</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Awesome Footer Component
const Footer = ({ openLegalModal }) => {
  return (
    <footer className="relative mt-16 bg-white/95 backdrop-blur-sm border-t border-orange-200/30 overflow-hidden">
      {/* Enhanced Multi-Layer Texture Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-green-50/30"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/20 via-transparent to-purple-50/20"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-yellow-50/10 via-transparent to-pink-50/10"></div>
      
      {/* Subtle Animated Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-green-400 to-blue-400 opacity-40 animate-pulse"></div>
      
      {/* Glass Effect Border */}
      <div className="absolute inset-0 border-t border-orange-200/40 shadow-inner"></div>
      
      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left Side - Made with Love */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-sm font-medium">Made with</span>
              <div className="relative">
                <svg className="w-5 h-5 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                {/* Heart Glow Effect */}
                <div className="absolute inset-0 bg-red-500 rounded-full blur-sm opacity-30 animate-ping"></div>
              </div>
              <span className="text-gray-600 text-sm font-medium">by</span>
            </div>
            
            {/* VMS Team Badge */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full shadow-lg border border-orange-200/30 backdrop-blur-sm">
              <span className="text-sm font-bold">VMS Team</span>
            </div>
          </div>
          
          {/* Center - Additional Info */}
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Vehicle Management System</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Powered by React</span>
            </div>
          </div>
          
          {/* Right Side - Version & Links */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-500">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
              </svg>
              <span>v2.1.0</span>
            </div>
            <div className="hidden lg:flex items-center space-x-3">
              <button className="text-gray-500 hover:text-orange-500 transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-orange-500 transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-orange-500 transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Border with Gradient */}
        <div className="mt-6 pt-6 border-t border-orange-200/20">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <span>© 2024 VMS Team. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <button 
                onClick={() => openLegalModal('privacy')}
                className="hidden sm:inline text-gray-400 hover:text-orange-600 transition-colors duration-200"
              >
                Privacy Policy
              </button>
              <span className="hidden sm:inline">•</span>
              <button 
                onClick={() => openLegalModal('terms')}
                className="hidden sm:inline text-gray-400 hover:text-orange-600 transition-colors duration-200"
              >
                Terms of Service
              </button>
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}

// Main App Component
const AppContent = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme())
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [legalModal, setLegalModal] = useState({ isOpen: false, type: null })
  const themeColors = getThemeColors(currentTheme)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check for existing login session
  useEffect(() => {
    const token = localStorage.getItem('vms_token')
    const storedUser = localStorage.getItem('vms_user')
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser({
          email: userData.email,
          user: userData.name,
          role: userData.role,
          plant: userData.plant,
          token: token,
          userData: userData
        })
        setIsLoggedIn(true)
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('vms_token')
        localStorage.removeItem('vms_user')
      }
    }
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
    // Clear stored data
    localStorage.removeItem('vms_token')
    localStorage.removeItem('vms_user')
  }

  const openLegalModal = (type) => {
    setLegalModal({ isOpen: true, type })
  }

  const closeLegalModal = () => {
    setLegalModal({ isOpen: false, type: null })
  }

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isScrolled={isScrolled} currentTheme={currentTheme} user={user} onLogout={handleLogout} />
      
      {/* Main Content with Conditional Top Spacing */}
      <div className={`${isScrolled ? 'pt-16' : 'pt-8'} p-4 flex-1`}>
        <Routes>
          <Route path="/" element={<Dashboard currentTheme={currentTheme} />} />
          <Route path="/approvals" element={<Approvals currentTheme={currentTheme} />} />
          <Route path="/masters" element={<Masters currentTheme={currentTheme} />} />
        </Routes>
      </div>
      
      {/* Awesome Footer */}
      <Footer openLegalModal={openLegalModal} />

      {/* Legal Modal */}
      <LegalModal 
        isOpen={legalModal.isOpen}
        onClose={closeLegalModal}
        type={legalModal.type}
      />
    </div>
  )
}

// Root App Component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App 