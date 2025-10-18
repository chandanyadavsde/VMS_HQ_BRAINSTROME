# Driver License Image Upload - Frontend Implementation Documentation

## 📋 Overview
This document describes how the frontend handles driver license image uploads in the Vehicle + Driver combined form. The implementation follows the API contract for the `/vms/vehicle-with-driver` endpoint.

## 🔧 Frontend Implementation Details

### 1. Form Data Structure
```javascript
// Form state structure
const [formData, setFormData] = useState({
  vehicle: {
    // ... vehicle fields
  },
  driver: {
    name: '',
    contact: { phone: '' },
    identification: {
      licenseNumber: '',
      licenseType: 'Light Motor Vehicle',
      licenseStartDate: '',
      licenseExpiry: '',
      licenseTestStatus: 'passed'
    },
    custrecord_driving_license_attachment: null, // Single file (not array)
    documents: []
  }
})
```

### 2. File Input Element
```jsx
<input
  key={formData.driver.custrecord_driving_license_attachment ? 'file-selected' : 'file-empty'}
  type="file"
  accept="image/*,.pdf"
  onChange={(e) => handleFileInput(e, 'driver', 'custrecord_driving_license_attachment')}
  className="hidden"
/>
```

**Key Points:**
- `accept="image/*,.pdf"` - Accepts images and PDFs
- `key` attribute forces re-render when file changes
- No `multiple` attribute (single file only)
- Hidden input with custom label for styling

### 3. File Upload Handler
```javascript
const handleFileInput = (e, section, field) => {
  if (e.target.files && e.target.files[0]) {
    handleFileUpload(section, field, e.target.files[0])
  }
}

const handleFileUpload = (section, field, file) => {
  if (section === 'driver' && field === 'custrecord_driving_license_attachment') {
    // For driver license, store as single file
    handleInputChange(section, field, file)
  } else {
    // For vehicle files, add to array (multiple files)
    const existingFiles = Array.isArray(formData[section][field]) ? formData[section][field] : []
    const newFiles = [...existingFiles, file]
    handleInputChange(section, field, newFiles)
  }
}
```

**Key Points:**
- Takes only the first file from FileList (`e.target.files[0]`)
- Stores as single file object (not array)
- Replaces existing file on new upload

### 4. State Update Handler
```javascript
const handleInputChange = (section, field, value) => {
  if (field.includes('.')) {
    // Handle nested fields like 'contact.phone'
    const [parent, child] = field.split('.')
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [child]: value
        }
      }
    }))
  } else {
    // Handle direct fields like 'custrecord_driving_license_attachment'
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }
}
```

**Key Points:**
- Direct field assignment for `custrecord_driving_license_attachment`
- No array wrapping for driver license
- Updates React state to trigger re-render

### 5. File Display Logic
```jsx
{/* Uploaded License File */}
{formData.driver.custrecord_driving_license_attachment && (
  <div className="mt-2">
    <div className="flex items-center justify-between bg-slate-50 p-2 rounded border text-sm">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-orange-500" />
        <span className="text-slate-700">
          {formData.driver.custrecord_driving_license_attachment.name || 'License Document'}
        </span>
      </div>
      <button
        type="button"
        onClick={() => handleFileRemove('driver', 'custrecord_driving_license_attachment', 0)}
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
)}
```

**Key Points:**
- Shows file name from `file.name` property
- Displays only when file exists (truthy check)
- Remove button clears the file

### 6. File Remove Handler
```javascript
const handleFileRemove = (section, field, fileIndex) => {
  if (section === 'driver' && field === 'custrecord_driving_license_attachment') {
    // For driver license, clear the file (single file only)
    handleInputChange(section, field, null)
  } else {
    // For vehicle files, remove from array
    const existingFiles = Array.isArray(formData[section][field]) ? formData[section][field] : []
    const newFiles = existingFiles.filter((_, index) => index !== fileIndex)
    handleInputChange(section, field, newFiles)
  }
}
```

**Key Points:**
- Sets `custrecord_driving_license_attachment` to `null`
- Different from vehicle files (arrays)

### 7. API Service Integration
```javascript
// VehicleDriverService.js
transformFormData(formData) {
  const files = {
    vehicleFiles: [
      // ... vehicle file arrays
    ],
    driverLicense: formData.driver.custrecord_driving_license_attachment || null
  }
  return { vehicleData, driverData, files }
}

async createVehicleWithDriver(vehicleData, driverData, files = {}) {
  const formData = new FormData()
  
  // Add vehicle fields
  Object.keys(vehicleData).forEach(key => {
    if (vehicleData[key] !== null && vehicleData[key] !== undefined) {
      formData.append(key, vehicleData[key])
    }
  })
  
  // Add driver fields with 'driver.' prefix
  Object.keys(driverData).forEach(key => {
    if (driverData[key] !== null && driverData[key] !== undefined) {
      formData.append(`driver[${key}]`, driverData[key])
    }
  })
  
  // Add vehicle files (arrays)
  if (files.vehicleFiles) {
    files.vehicleFiles.forEach(fileGroup => {
      if (Array.isArray(fileGroup.files)) {
        fileGroup.files.forEach(file => {
          formData.append(fileGroup.fieldName, file)
        })
      }
    })
  }
  
  // Add driver files (single file)
  if (files.driverLicense) {
    formData.append('custrecord_driving_license_attachment', files.driverLicense)
  }
  
  const response = await baseApiService.post('/vms/vehicle-with-driver', formData, {
    timeout: 30000
  })
  
  return response
}
```

**Key Points:**
- Driver license sent as single file: `formData.append('custrecord_driving_license_attachment', files.driverLicense)`
- No array wrapping for driver license
- Content-Type header removed (browser sets automatically)

## 📤 What We Send to Backend

### FormData Structure
```
FormData {
  // Vehicle fields
  custrecord_vehicle_number: "TEST-001",
  custrecord_vehicle_type_ag: "ODC",
  // ... other vehicle fields
  
  // Driver fields (with 'driver.' prefix)
  "driver[custrecord_driver_name]": "Test Driver",
  "driver[custrecord_driving_license_no]": "DL123456789",
  "driver[custrecord_driver_mobile_no]": "9876543210",
  // ... other driver fields
  
  // Vehicle files (arrays)
  custrecord_rc_doc_attach: File,
  custrecord_insurance_attachment_ag: File,
  // ... other vehicle files
  
  // Driver files (single file)
  custrecord_driving_license_attachment: File
}
```

### File Object Properties
```javascript
File {
  name: "license.pdf",
  size: 12345,
  type: "application/pdf",
  lastModified: 1640995200000,
  // ... other File properties
}
```

## 🔍 Debugging Information

### Console Logs We See
```javascript
// When file is selected
🔍 handleFileInput called: { section: 'driver', field: 'custrecord_driving_license_attachment', files: FileList }
📁 File selected: File { name: 'license.pdf', size: 12345, type: 'application/pdf' }
📤 handleFileUpload called: { section: 'driver', field: 'custrecord_driving_license_attachment', file: File }
🚗 Storing driver license as single file: File { name: 'license.pdf', size: 12345, type: 'application/pdf' }
🔄 handleInputChange called: { section: 'driver', field: 'custrecord_driving_license_attachment', value: File }
💾 Setting form data: { section: 'driver', field: 'custrecord_driving_license_attachment', value: File }

// When form is submitted
📝 Submitting combined vehicle + driver data: { vehicleData: {...}, driverData: {...}, files: {...} }
📁 FormData contents:
  custrecord_vehicle_number: TEST-001
  driver[custrecord_driver_name]: Test Driver
  custrecord_driving_license_attachment: File(license.pdf, 12345 bytes, application/pdf)
```

### Network Request Details
```
POST /vms/vehicle-with-driver
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

FormData:
- custrecord_vehicle_number: "TEST-001"
- driver[custrecord_driver_name]: "Test Driver"
- custrecord_driving_license_attachment: [File object]
```

## ❓ Questions for Backend Team

1. **File Field Name**: Are we using the correct field name `custrecord_driving_license_attachment`?

2. **File Format**: Should we send the file as a single File object or wrap it in an array?

3. **Content-Type**: Should we set any specific Content-Type headers for the file upload?

4. **File Validation**: What file size limits and format restrictions should we implement?

5. **Error Handling**: What specific error messages should we expect for file upload failures?

6. **Response Format**: How should the backend respond when files are successfully uploaded?

## 🧪 Test Cases

### Test Case 1: Single File Upload
- Select one driver license file
- Expected: File appears in UI, gets sent to backend

### Test Case 2: File Replacement
- Upload file A, then upload file B
- Expected: File A is replaced by file B

### Test Case 3: File Removal
- Upload file, then click remove
- Expected: File is removed from UI and form data

### Test Case 4: Form Submission
- Upload file and submit form
- Expected: File is included in API request

## 🔧 Current Issues

1. **File Not Appearing**: File selection works but doesn't show in UI
2. **File Not Uploading**: File appears in UI but doesn't reach backend
3. **Backend Error**: Backend receives file but fails to process it

## 📞 Contact Information

For any questions about this implementation, please contact the frontend development team.

---

**Last Updated**: January 2025  
**API Endpoint**: `POST /vms/vehicle-with-driver`  
**Content-Type**: `multipart/form-data`
