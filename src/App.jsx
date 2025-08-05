import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import AlternativeWindCard from './components/AlternativeWindCard.jsx'
import ApprovalCard from './components/ApprovalCard.jsx'
import { getCurrentTheme, setTheme, getThemeColors } from './utils/theme.js'

// Header Component
const Header = ({ isScrolled, currentTheme }) => {
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              
              {/* User Info */}
              <div className={`transition-all duration-300 ${
                isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}>
                <p className="text-gray-900 text-sm font-semibold">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
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

// Main App Component
const AppContent = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme())
  const themeColors = getThemeColors(currentTheme)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isScrolled={isScrolled} currentTheme={currentTheme} />
      
      {/* Main Content with Conditional Top Spacing */}
      <div className={`${isScrolled ? 'pt-16' : 'pt-8'} p-4`}>
        <Routes>
          <Route path="/" element={<Dashboard currentTheme={currentTheme} />} />
          <Route path="/approvals" element={<Approvals currentTheme={currentTheme} />} />
          <Route path="/masters" element={<Masters currentTheme={currentTheme} />} />
        </Routes>
      </div>
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