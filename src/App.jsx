import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import AlternativeWindCard from './components/AlternativeWindCard.jsx'
import ApprovalCard from './components/ApprovalCard.jsx'
import { getCurrentTheme, setTheme, getThemeColors } from './utils/theme.js'

// Header Component
const Header = ({ isScrolled, currentTheme, onThemeToggle }) => {
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
    <div className={`${isScrolled ? 'fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20' : 'relative'} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo Section - Left Side */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              {/* Logo Icon */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${themeColors.logoGradient} flex items-center justify-center transition-all duration-300 ${
                isScrolled ? 'w-8 h-8' : 'w-10 h-10'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              {/* Logo Text */}
              <div className={`transition-all duration-300 ${
                isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}>
                <h1 className="text-xl font-bold text-white">Wind Energy</h1>
                <p className={`text-xs ${themeColors.accentText}`}>Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Center */}
          <div className={`flex space-x-1 ${!isScrolled ? 'bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20' : ''}`}>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => navigate(section.path)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  getCurrentSection() === section.id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>

          {/* Profile Section - Right Side */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <div className={`relative transition-all duration-300 ${
              isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>
              <button 
                onClick={onThemeToggle}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                title={`Switch to ${currentTheme === 'teal' ? 'Blue' : 'Teal'} Theme`}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </button>
            </div>

            {/* Notifications */}
            <div className={`relative transition-all duration-300 ${
              isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>
              <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${themeColors.logoGradient} flex items-center justify-center`}>
                <span className="text-white text-sm font-semibold">U</span>
              </div>
              
              {/* User Info */}
              <div className={`transition-all duration-300 ${
                isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}>
                <p className="text-white text-sm font-medium">User Admin</p>
                <p className={`text-xs ${themeColors.accentText}`}>Administrator</p>
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
    <div className="flex justify-center mb-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 max-w-4xl w-full">
        <div className="flex items-center space-x-3 px-4 py-2">
          {/* Search Icon */}
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search projects, stages, or activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm"
          />
          
          {/* Search Actions */}
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs hover:from-cyan-600 hover:to-blue-600 transition-all">
              Search
            </button>
          </div>
        </div>

        {/* Plant Filter and Stats Row */}
        <div className="pt-3 border-t border-white/20">
          <div className="flex items-center justify-between">
            {/* Plant Filter - Left Side */}
            <div className="flex flex-wrap gap-1">
              {plants.map((plant) => (
                <button
                  key={plant.id}
                  onClick={() => setSelectedPlant(plant.id)}
                  className={`px-2 py-1 rounded-md font-medium text-xs transition-all ${
                    selectedPlant === plant.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {plant.name}
                </button>
              ))}
            </div>

            {/* Approval Stats - Right Side */}
            {activeSection === 'approvals' && (
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className={`text-lg font-bold ${themeColors.limeColor}`}>15</div>
                  <div className={`text-xs ${themeColors.accentText}`}>Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-400">8</div>
                  <div className={`text-xs ${themeColors.accentText}`}>Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-400">3</div>
                  <div className={`text-xs ${themeColors.accentText}`}>Overdue</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${themeColors.tealColor}`}>67%</div>
                  <div className={`text-xs ${themeColors.accentText}`}>Progress</div>
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

  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'teal' ? 'blue' : 'teal'
    setCurrentTheme(newTheme)
    setTheme(newTheme)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors.background}`}>
      <Header isScrolled={isScrolled} currentTheme={currentTheme} onThemeToggle={handleThemeToggle} />
      
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