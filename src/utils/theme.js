// Theme configuration
export const themes = {
  blue: {
    name: 'Blue Theme',
    background: 'from-slate-900 via-blue-900 to-slate-900',
    cardGradient: 'from-cyan-900 via-blue-900 to-indigo-900',
    cardBackground: 'linear-gradient(135deg, #0c4a6e 0%, #1e40af 50%, #3730a3 100%)',
    logoGradient: 'from-cyan-400 to-blue-500',
    accentText: 'text-cyan-200',
    accentColor: 'text-cyan-400',
    accentBg: 'bg-cyan-500/20',
    successColor: 'text-emerald-400',
    limeColor: 'text-lime-400',
    tealColor: 'text-teal-400',
    tealText: 'text-teal-200',
    tealBg: 'bg-teal-500/20',
  },
  teal: {
    name: 'Skeiron Teal',
    background: 'from-slate-900 via-teal-900 to-slate-900',
    cardGradient: 'from-teal-900 via-teal-800 to-teal-900',
    cardBackground: 'linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #115e59 100%)',
    logoGradient: 'from-teal-400 to-teal-500',
    accentText: 'text-teal-200',
    accentColor: 'text-teal-400',
    accentBg: 'bg-teal-500/20',
    successColor: 'text-lime-400',
    limeColor: 'text-lime-400',
    tealColor: 'text-teal-400',
    tealText: 'text-teal-200',
    tealBg: 'bg-teal-500/20',
  }
}

// Get current theme
export const getCurrentTheme = () => {
  return localStorage.getItem('theme') || 'teal'
}

// Set theme
export const setTheme = (theme) => {
  localStorage.setItem('theme', theme)
  return themes[theme]
}

// Get theme colors
export const getThemeColors = (theme = null) => {
  const currentTheme = theme || getCurrentTheme()
  return themes[currentTheme]
} 