# PRE-LR API Analysis & Implementation Guide

## 📊 API Endpoint Analysis

### **Endpoint:** `http://localhost:5000/vms/ns-prelr/local`
- **Method:** GET
- **Response:** JSON with success flag, data array, and pagination info
- **Status:** ✅ Working (200 OK)

## 🔍 Data Structure Analysis

### **Main Response Format:**
```json
{
  "success": true,
  "data": [array of PRE-LR objects],
  "pagination": {
    "currentPage": 1,
    "totalPages": 6,
    "totalRecords": 102,
    "hasNext": true,
    "hasPrev": false,
    "Open": 102,
    "Close": 0
  }
}
```

### **PRE-LR Object Structure:**
```json
{
  "_id": "68c2a8acad2025376ed82989",
  "internalId": "21276",
  "preLrNumber": "DOMWBS242500001163",
  "consignee": "LC00222 SUZLON ENERGY LIMITED",
  "consignor": "LC00009 SEMBCORP GREEN INFRA PRIVATE LIMITED",
  "content": "S144-140 HLT NACELLE",
  "wtgNumber": "ADITYA BIRLA SHIV-20",
  "fromLocation": "DAMAN",
  "site": "SHIV",
  "stateDetail": "27-Maharashtra",
  "stateHeader": "Rajasthan",
  "status": "Open",
  "createdAt": "2025-09-11T10:48:17.874Z",
  "stateTracking": {
    "totalLrs": 6,
    "completedLrs": 0,
    "pendingLrs": 6,
    "totalQuantity": 12,
    "lrCreatedQuantity": 11,
    "remainingQuantity": 1,
    "allLrsAssigned": false,
    "allLrsPunchlistComplete": false,
    "allLrsReady": false
  },
  "lrs": [array of associated LRs],
  "preLrLines": [array of line items]
}
```

### **Associated LR Structure:**
```json
{
  "_id": "68c405d1c2195dedd0e7dfb4",
  "prelrHeaderLink": "21276",
  "vehicleNo": "GJ01KT9267",
  "vehicleType": "VMT HYDRAULIC 8 LINE AXLE",
  "lrName": "208277",
  "lrDate": "23/09/2024",
  "status": "Delivered",
  "vehicle": {
    "assignmentStatus": "unassigned"
  },
  "driver": {
    "driverStatus": "unassigned"
  },
  "punchlist": {
    "punchlistType": "general",
    "status": "pending"
  }
}
```

### **PRE-LR Line Items Structure:**
```json
{
  "prelrLineItnernalId": "35835",
  "prelrHeaderLink": "21276",
  "subContent": "S144-140 HLT NACELLE",
  "totalQuantity": "1",
  "vehicleType": "16 Wheeler Low Bed Trailer",
  "vehicleCategory": "Specialized",
  "lrCreatedQty": "1",
  "lrRemainingQty": "0",
  "lineStatus": "pending"
}
```

## 🎯 Implementation Requirements

### **1. Table Display Requirements:**
- **PRE-LR Number** (preLrNumber)
- **Consignee** (consignee)
- **Consignor** (consignor)
- **LR Count** (stateTracking.totalLrs) with progress bar
- **WTG Number** (wtgNumber)
- **Content** (content)
- **From Location** (fromLocation)
- **Site** (site)
- **State** (stateHeader)
- **Status** (status mapped to UI status)
- **Created Date** (createdAt formatted)

### **2. Expandable Rows:**
- **Associated LRs** displayed in grid format when expanded
- **LR Details**: LR Number, Status, Vehicle, Driver Assignment, Punchlist Status
- **Progress Tracking**: Show completion percentage and remaining items

### **3. PRE-LR Details Modal:**
- **Basic Information**: All PRE-LR fields
- **PRE-LR Lines Table**: Tabular format showing:
  - Line ID, Sub Content, Quantity, Vehicle Type, Category
  - LR Created Qty, Remaining Qty, Status
- **Associated LRs**: Grid view with detailed information
- **Progress Summary**: Visual progress indicators

### **4. Click Actions:**
- **PRE-LR Number Click**: Open detailed modal with all information
- **LR Click**: Open LR-specific details modal
- **Expand/Collapse**: Toggle associated LRs display

## 🔄 Data Mapping Strategy

### **Status Mapping:**
```javascript
const statusMap = {
  'Open': 'active',
  'Close': 'completed',
  'Delivered': 'completed',
  'pending': 'processing'
}
```

### **Progress Calculation:**
```javascript
const calculateProgress = (stateTracking) => {
  return Math.round((stateTracking.lrCreatedQuantity / stateTracking.totalQuantity) * 100)
}
```

### **Date Formatting:**
```javascript
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB')
}
```

## 📋 Implementation Checklist

### **Phase 1: Basic Table**
- [ ] Create API service for PRE-LR endpoints
- [ ] Map API data to table structure
- [ ] Implement basic table display
- [ ] Add search and filtering

### **Phase 2: Expandable Rows**
- [ ] Implement expand/collapse functionality
- [ ] Display associated LRs in grid format
- [ ] Add progress indicators
- [ ] Implement status badges

### **Phase 3: Detailed Modals**
- [ ] Create PRE-LR details modal
- [ ] Implement PRE-LR lines table
- [ ] Add LR details modal
- [ ] Implement click handlers

### **Phase 4: Enhanced Features**
- [ ] Add pagination support
- [ ] Implement real-time updates
- [ ] Add export functionality
- [ ] Optimize performance

## 🎨 UI/UX Considerations

### **Table Design:**
- **Ultra-compact** design matching existing theme
- **Orange color scheme** for consistency
- **Professional enterprise** look and feel
- **Responsive grid** for different screen sizes

### **Modal Design:**
- **Comprehensive information** display
- **Tabular format** for PRE-LR lines
- **Visual progress** indicators
- **Easy navigation** between sections

### **Interactive Elements:**
- **Smooth animations** for expand/collapse
- **Hover effects** for better UX
- **Clear visual feedback** for actions
- **Intuitive navigation** patterns

## 🚀 Next Steps

1. **Create API Service** for PRE-LR data fetching
2. **Update OrdersTable** component with real API integration
3. **Implement data mapping** from API to UI structure
4. **Add detailed modals** for PRE-LR and LR information
5. **Test and optimize** the complete implementation

---

*This analysis provides a comprehensive foundation for implementing the PRE-LR management system with real API data integration.*
