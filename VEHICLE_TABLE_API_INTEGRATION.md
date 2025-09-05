# Vehicle Table API Integration Guide

## 🚀 **API Endpoints**

### **1. Get All Vehicles (with pagination)**
```
GET http://localhost:5000/vms/vehicle/plant/all?status=all&page=1&limit=20&includeDriver=true
```

**Parameters:**
- `status`: "all" (for now)
- `page`: Current page number (1-based)
- `limit`: Items per page (20)
- `includeDriver`: true (to get driver information)

### **2. Search Single Vehicle**
```
GET http://localhost:5000/vms/vehicle/{vehicleNumber}/with-driver
```

**Parameters:**
- `vehicleNumber`: Vehicle number to search (e.g., "MH12XX1023")

## 📊 **Data Mapping for Vehicle Table**

| **Table Column** | **API Field** | **Data Type** | **Sample Value** | **Notes** |
|------------------|---------------|---------------|------------------|-----------|
| **Vehicle** | `custrecord_vehicle_number` | String | "MH13AB0080" | Primary identifier |
| **Driver** | `assignedDriver.custrecord_driver_name` | String | "Komal ladka" | From nested driver object |
| **Mobile** | `assignedDriver.custrecord_driver_mobile_no` | String | "1111111165" | Driver's mobile number |
| **Status** | `"available"` | String | "available" | **STATIC FOR NOW** - Will be changed later |
| **Plant** | `currentPlant` | String | "free" | Current plant location |
| **Vendor** | `custrecord_vendor_name_ag.name` | String | "ABC Logistics" | From nested vendor object |
| **Arrived** | `checklist.date` | Date | "2025-08-14T00:31:17.408729" | Checklist completion date |
| **Created** | `custrecord_create_by` | String | "shekhar.deshmukh" | Creator username |
| **Other** | `contactPersons` | Array | `[{name: "Raj", phone: "9876543210"}]` | Array of contact persons |

## 🔍 **Search Implementation**

### **Search Strategy:**
- **Primary Search**: Use vehicle number to call single vehicle endpoint
- **Fallback**: If no results, search within current page data
- **Search Field**: Only `custrecord_vehicle_number` for now

### **Search Flow:**
1. User types vehicle number in search box
2. Call `GET /vms/vehicle/{vehicleNumber}/with-driver`
3. If found, display single result
4. If not found, show "No vehicle found" message

## 📄 **Pagination**

### **Pagination Details:**
- **Items per page**: 20
- **Pagination info from API**:
  ```json
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalVehicles": 32,
    "limit": 50,
    "hasNext": false,
    "hasPrev": false
  }
  ```

### **Pagination Controls:**
- Previous/Next buttons
- Page number display
- Total items count

## 🚨 **Data Handling Rules**

### **1. Driver Assignment:**
- **Has Driver**: Show driver name and mobile
- **No Driver**: Show "No Driver Assigned"

### **2. Contact Persons:**
- **Has Contacts**: Show all contacts in "Other" column
- **No Contacts**: Show "No contacts"

### **3. Checklist Date:**
- **Has Checklist**: Use `checklist.date`
- **No Checklist**: Show "Not Available"

### **4. Status Field:**
- **Current**: All vehicles show "available"
- **Future**: Will implement dynamic status logic

## 🔧 **Implementation Notes**

### **API Response Structure:**
```json
{
  "data": [/* array of vehicles */],
  "length": 32,
  "pagination": {/* pagination info */}
}
```

### **Error Handling:**
- Network errors
- Empty responses
- Invalid vehicle numbers
- Missing driver data

### **Loading States:**
- Initial load
- Page changes
- Search operations
- Refresh data

## 🎯 **Next Steps**

1. **Replace mock data** with API calls
2. **Implement pagination** controls
3. **Add search functionality** for vehicle numbers
4. **Handle loading states** and errors
5. **Test with real API** data
6. **Implement status logic** (future enhancement)

## 📝 **Status Field - Future Enhancement**

**Current**: Static "available" for all vehicles
**Future**: Dynamic status based on:
- `approved_by_hq` field
- `checklistConfirmed` status
- `driverConfirmed` status
- `inTrip` status
- Document expiry dates

---

**Note**: This integration will replace the current mock data implementation while maintaining the same UI/UX design and functionality.
