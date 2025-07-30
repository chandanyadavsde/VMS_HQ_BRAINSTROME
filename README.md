# Wind Energy Process Card

An interactive, animated React component showcasing a wind energy project management interface with smooth animations and intuitive user interactions.

## ✨ Features

- **Interactive Main Card**: Click to expand and view detailed stage information
- **Smooth Animations**: Powered by Framer Motion for fluid transitions
- **Progress Visualization**: Animated progress rings and bars
- **Stage Management**: Start, pause, and complete individual stages
- **Wind Energy Theme**: Custom turbine icon and wind particle effects
- **Responsive Design**: Beautiful glass morphism effects with Tailwind CSS

## 🎨 Design Highlights

### Main Card
- **Wind turbine silhouette** with rotating animation
- **Progress ring** showing overall completion percentage
- **4 stage indicators** with color-coded status
- **Floating wind particles** for atmospheric effect
- **Glass morphism** background with backdrop blur

### Detailed View
- **Individual stage cards** with progress bars
- **Interactive controls** for each stage
- **Date tracking** and duration calculations
- **Smooth transitions** between states

### Color Scheme
- 🟢 **Green**: Completed stages
- 🟡 **Yellow**: In-progress stages  
- 🔴 **Red**: Error states
- ⚪ **Gray**: Not started stages

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## 🛠️ Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and animations
- **Framer Motion** - Advanced animations
- **Lucide React** - Icons
- **Vite** - Build tool and dev server

## 🎯 Usage

### Main Card Interactions
- **Hover**: Card lifts with enhanced shadow
- **Click**: Expands to show detailed stage view
- **Turbine icon**: Rotates when expanded

### Stage Management
- **Start**: Begin a new stage (Play button)
- **Pause**: Pause an in-progress stage (Pause button)
- **Complete**: Mark a stage as finished (Check button)
- **Restart**: Reset a completed stage (Rotate button)

### Visual Feedback
- **Progress bars**: Animate to show completion percentage
- **Status indicators**: Pulse when active
- **Wind particles**: Float across the card background
- **Smooth transitions**: All state changes are animated

## 🎨 Customization

### Colors
Modify the color scheme in `tailwind.config.js`:
```javascript
colors: {
  wind: { /* wind energy blues */ },
  energy: { /* status colors */ }
}
```

### Animations
Customize animations in `tailwind.config.js`:
```javascript
animation: {
  'turbine-spin': 'turbine-spin 2s linear infinite',
  'wind-flow': 'wind-flow 4s ease-in-out infinite',
}
```

### Stages
Update the stages array in `WindEnergyCard.tsx`:
```typescript
const stages: ProcessStage[] = [
  {
    id: 1,
    name: 'Your Stage',
    description: 'Stage description',
    status: 'not-started',
    progress: 0,
    icon: <YourIcon />
  }
]
```

## 📱 Responsive Design

The card is fully responsive and works on:
- Desktop (800px expanded width)
- Tablet (adaptive sizing)
- Mobile (stacked layout)

## 🎭 Animation Details

- **Spring animations** for natural movement
- **Staggered transitions** for sequential effects
- **Micro-interactions** for enhanced UX
- **Performance optimized** with GPU acceleration

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── WindEnergyCard.tsx    # Main card component
│   ├── StageCard.tsx         # Individual stage cards
│   └── TurbineIcon.tsx       # Custom turbine icon
├── App.tsx                   # Main app component
└── main.tsx                  # Entry point
```

### Key Components

#### WindEnergyCard
- Main interactive card with expand/collapse
- Progress ring visualization
- Stage status management
- Wind particle effects

#### StageCard
- Individual stage information
- Progress bar with animations
- Action buttons (start/pause/complete)
- Date and duration tracking

#### TurbineIcon
- Custom SVG wind turbine
- Rotating animation
- Wind flow indicators

## 🎯 Future Enhancements

- **Real-time updates** with WebSocket integration
- **Data persistence** with local storage or API
- **Multiple projects** management
- **Advanced analytics** and reporting
- **Export functionality** for reports
- **Dark/Light theme** toggle

## 📄 License

This project is open source and available under the MIT License. 