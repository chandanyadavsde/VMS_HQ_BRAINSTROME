# Frontend Implementation Details - Vehicle + Driver Form

## 📋 **EXACT IMPLEMENTATION FOR BACKEND TEAM**

### **🔧 What We're Sending to Backend**

#### **API Endpoint:** `POST /vms/vehicle-with-driver`
#### **Content-Type:** `multipart/form-data`

---

## **📤 REQUEST STRUCTURE**

### **1. Vehicle Fields (Top-level)**
```javascript
FormData.append('custrecord_vehicle_number', 'TEST-001')
FormData.append('custrecord_vehicle_type_ag', 'ODC')
FormData.append('custrecord_vehicle_name_ag', 'Test Vehicle')
FormData.append('currentPlant', 'pune')
FormData.append('custrecord_owner_name_ag', 'Test Owner')
FormData.append('custrecord_owner_no_ag', '9876543210')
FormData.append('custrecord_chassis_number', 'CHASSIS123456')
FormData.append('custrecord_engine_number_ag', 'ENGINE123456')
FormData.append('custrecord_age_of_vehicle', '3')
FormData.append('custrecord_vehicle_master_gps_available', 'true')
FormData.append('custrecord_rc_no', 'RC123456789')
FormData.append('custrecord_rc_start_date', '2022-01-01')
FormData.append('custrecord_rc_end_date', '2032-01-01')
FormData.append('custrecord_insurance_company_name_ag', 'Test Insurance Co')
FormData.append('custrecord_insurance_number_ag', 'INS123456789')
FormData.append('custrecord_insurance_start_date_ag', '2024-01-01')
FormData.append('custrecord_insurance_end_date_ag', '2025-01-01')
FormData.append('custrecord_permit_number_ag', 'PERMIT123456')
FormData.append('custrecord_permit_start_date', '2024-01-01')
FormData.append('custrecord_permit_end_date', '2025-01-01')
FormData.append('custrecord_puc_number', 'PUC123456789')
FormData.append('custrecord_puc_start_date_ag', '2024-01-01')
FormData.append('custrecord_puc_end_date_ag', '2025-01-01')
FormData.append('custrecord_tms_vehicle_fit_cert_vld_upto', '2025-01-01')
FormData.append('custrecord_create_by', 'admin')
FormData.append('approved_by_hq', 'pending')
```

### **2. Driver Fields (Flat format with 'driver.' prefix)**
```javascript
FormData.append('driver[custrecord_driver_name]', 'Test Driver')
FormData.append('driver[custrecord_driving_license_no]', 'DL123456789')
FormData.append('driver[custrecord_driver_mobile_no]', '9876543210')
FormData.append('driver[custrecord_driving_license_s_date]', '2020-01-01')
FormData.append('driver[custrecord_driver_license_e_date]', '2030-01-01')
FormData.append('driver[custrecord_license_category_ag]', 'Light Motor Vehicle')
FormData.append('driver[custrecord_create_by_driver_master]', 'admin')
FormData.append('driver[custrecord_driving_lca_test]', 'PASSED')
FormData.append('driver[fcm_token]', '')
```

### **3. File Uploads**
```javascript
// Driver License Image (ARRAY OF FILES - like vehicle documents)
FormData.append('custrecord_driving_license_attachment', FileObject1)
FormData.append('custrecord_driving_license_attachment', FileObject2)

// Driver Photo (SINGLE FILE)  
FormData.append('driver_photo', FileObject)

// Vehicle Documents (MULTIPLE FILES - Arrays)
FormData.append('custrecord_rc_doc_attach', FileObject1)
FormData.append('custrecord_rc_doc_attach', FileObject2)
FormData.append('custrecord_insurance_attachment_ag', FileObject1)
FormData.append('custrecord_permit_attachment_ag', FileObject1)
FormData.append('custrecord_puc_attachment_ag', FileObject1)
FormData.append('custrecord_tms_vehicle_fit_cert_attach', FileObject1)
```

---

## **🔍 EXACT CODE IMPLEMENTATION**

### **1. Frontend Form State Structure**
```javascript
const [formData, setFormData] = useState({
  vehicle: {
    custrecord_vehicle_number: '',
    custrecord_vehicle_type_ag: '',
    custrecord_vehicle_name_ag: '',
    currentPlant: '',
    custrecord_owner_name_ag: '',
    custrecord_owner_no_ag: '',
    custrecord_chassis_number: '',
    custrecord_engine_number_ag: '',
    custrecord_age_of_vehicle: '',
    custrecord_vehicle_master_gps_available: false,
    custrecord_rc_no: '',
    custrecord_rc_start_date: '',
    custrecord_rc_end_date: '',
    custrecord_rc_doc_attach: [], // Array for multiple files
    custrecord_insurance_company_name_ag: '',
    custrecord_insurance_number_ag: '',
    custrecord_insurance_start_date_ag: '',
    custrecord_insurance_end_date_ag: '',
    custrecord_insurance_attachment_ag: [], // Array for multiple files
    custrecord_permit_number_ag: '',
    custrecord_permit_start_date: '',
    custrecord_permit_end_date: '',
    custrecord_permit_attachment_ag: [], // Array for multiple files
    custrecord_puc_number: '',
    custrecord_puc_start_date_ag: '',
    custrecord_puc_end_date_ag: '',
    custrecord_puc_attachment_ag: [], // Array for multiple files
    custrecord_tms_vehicle_fit_cert_vld_upto: '',
    custrecord_vehicle_fit_cert_attachment_ag: [], // Array for multiple files
    custrecord_create_by: 'admin',
    approved_by_hq: 'pending'
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
    custrecord_driving_license_attachment: [], // ARRAY OF FILES (like vehicle documents)
    driver_photo: null, // SINGLE FILE (not array)
    documents: []
  }
})
```

### **2. File Upload Handler**
```javascript
const handleFileUpload = (section, field, file) => {
  if (section === 'driver' && field === 'driver_photo') {
    // For driver photo, store as single file
    handleInputChange(section, field, file)
  } else {
    // For all other files (vehicle files and driver license), add to array (multiple files)
    const existingFiles = Array.isArray(formData[section][field]) ? formData[section][field] : []
    const newFiles = [...existingFiles, file]
    handleInputChange(section, field, newFiles)
  }
}
```

### **3. API Service Implementation**
```javascript
// VehicleDriverService.js
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
  
  // Add driver files (driver license as array, driver photo as single file)
  if (files.driverLicense && Array.isArray(files.driverLicense)) {
    files.driverLicense.forEach(file => {
      formData.append('custrecord_driving_license_attachment', file)
    })
  }
  
  if (files.driverPhoto) {
    formData.append('driver_photo', files.driverPhoto)
  }
  
  const response = await baseApiService.post('/vms/vehicle-with-driver', formData, {
    timeout: 30000
  })
  
  return response
}
```

### **4. Data Transformation**
```javascript
transformFormData(formData) {
  // Vehicle data mapping
  const vehicleData = {
    custrecord_vehicle_number: formData.vehicle.custrecord_vehicle_number,
    custrecord_vehicle_name_ag: formData.vehicle.custrecord_vehicle_name_ag,
    custrecord_vehicle_type_ag: formData.vehicle.custrecord_vehicle_type_ag,
    custrecord_age_of_vehicle: formData.vehicle.custrecord_age_of_vehicle,
    custrecord_owner_name_ag: formData.vehicle.custrecord_owner_name_ag,
    custrecord_owner_no_ag: formData.vehicle.custrecord_owner_no_ag,
    custrecord_chassis_number: formData.vehicle.custrecord_chassis_number,
    custrecord_engine_number_ag: formData.vehicle.custrecord_engine_number_ag,
    custrecord_rc_no: formData.vehicle.custrecord_rc_no,
    custrecord_rc_start_date: formData.vehicle.custrecord_rc_start_date,
    custrecord_rc_end_date: formData.vehicle.custrecord_rc_end_date,
    custrecord_insurance_company_name_ag: formData.vehicle.custrecord_insurance_company_name_ag,
    custrecord_insurance_number_ag: formData.vehicle.custrecord_insurance_number_ag,
    custrecord_insurance_start_date_ag: formData.vehicle.custrecord_insurance_start_date_ag,
    custrecord_insurance_end_date_ag: formData.vehicle.custrecord_insurance_end_date_ag,
    custrecord_permit_number_ag: formData.vehicle.custrecord_permit_number_ag,
    custrecord_permit_start_date: formData.vehicle.custrecord_permit_start_date,
    custrecord_permit_end_date: formData.vehicle.custrecord_permit_end_date,
    custrecord_puc_number: formData.vehicle.custrecord_puc_number,
    custrecord_puc_start_date_ag: formData.vehicle.custrecord_puc_start_date_ag,
    custrecord_puc_end_date_ag: formData.vehicle.custrecord_puc_end_date_ag,
    custrecord_tms_vehicle_fit_cert_vld_upto: formData.vehicle.custrecord_tms_vehicle_fit_cert_vld_upto,
    custrecord_vehicle_master_gps_available: formData.vehicle.custrecord_vehicle_master_gps_available,
    currentPlant: formData.vehicle.currentPlant,
    custrecord_create_by: formData.vehicle.custrecord_create_by || 'admin',
    fcm_token: formData.vehicle.fcm_token || '',
    contactPersons: formData.vehicle.contactPersons || []
  }

  // Driver data mapping
  const driverData = {
    custrecord_driver_name: formData.driver.name,
    custrecord_driving_license_no: formData.driver.identification.licenseNumber,
    custrecord_driving_license_s_date: formData.driver.identification.licenseStartDate,
    custrecord_driver_license_e_date: formData.driver.identification.licenseExpiry,
    custrecord_license_category_ag: formData.driver.identification.licenseType,
    custrecord_driver_mobile_no: formData.driver.contact.phone,
    custrecord_create_by_driver_master: formData.driver.custrecord_create_by_driver_master || 'admin',
    custrecord_driving_lca_test: formData.driver.identification.licenseTestStatus || 'PASSED',
    fcm_token: formData.driver.fcm_token || ''
  }

  // File data mapping
  const files = {
    vehicleFiles: [
      { fieldName: 'custrecord_rc_doc_attach', files: formData.vehicle.custrecord_rc_doc_attach || [] },
      { fieldName: 'custrecord_insurance_attachment_ag', files: formData.vehicle.custrecord_insurance_attachment_ag || [] },
      { fieldName: 'custrecord_permit_attachment_ag', files: formData.vehicle.custrecord_permit_attachment_ag || [] },
      { fieldName: 'custrecord_puc_attachment_ag', files: formData.vehicle.custrecord_puc_attachment_ag || [] },
      { fieldName: 'custrecord_tms_vehicle_fit_cert_attach', files: formData.vehicle.custrecord_vehicle_fit_cert_attachment_ag || [] }
    ],
    driverLicense: formData.driver.custrecord_driving_license_attachment || [],
    driverPhoto: formData.driver.driver_photo || null
  }

  return { vehicleData, driverData, files }
}
```

---

## **🔍 DEBUGGING INFORMATION**

### **Console Logs We See:**
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
  custrecord_driving_license_attachment: File(license.pdf, 12345 bytes, application/pdf)  // Multiple files with same field name
  driver_photo: File(photo.jpg, 54321 bytes, image/jpeg)
```

### **Network Request Details:**
```
POST /vms/vehicle-with-driver
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

FormData:
- custrecord_vehicle_number: "TEST-001"
- driver[custrecord_driver_name]: "Test Driver"
- custrecord_driving_license_attachment: [File object] (multiple files with same field name)
- driver_photo: [File object]
```

---

## **❓ QUESTIONS FOR BACKEND TEAM**

1. **Field Names:** Are we using the correct field names?
   - `custrecord_driving_license_attachment` for driver license file
   - `driver_photo` for driver photo file

2. **File Format:** Should driver files be sent as single files or arrays?

3. **Content-Type:** Are we setting the correct Content-Type headers?

4. **File Processing:** How should the backend process these files?

5. **Error Handling:** What specific error messages should we expect?

6. **Response Format:** How should the backend respond when files are successfully uploaded?

---

## **🧪 TEST CASES**

### **Test Case 1: Single File Upload**
- Select one driver license file
- Expected: File appears in UI, gets sent to backend

### **Test Case 2: File Replacement**
- Upload file A, then upload file B
- Expected: File A is replaced by file B

### **Test Case 3: File Removal**
- Upload file, then click remove
- Expected: File is removed from UI and form data

### **Test Case 4: Form Submission**
- Upload files and submit form
- Expected: Files are included in API request

---

**Last Updated:** January 2025  
**API Endpoint:** `POST /vms/vehicle-with-driver`  
**Content-Type:** `multipart/form-data`
