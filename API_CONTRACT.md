# 🚛 Skeiron VMS V2 - Complete API Contract

## 📋 **Base Configuration**

### **Server Details**
- **Base URL**: `http://localhost:5000`
- **API Prefix**: `/vms`
- **Content-Type**: `application/json`
- **Body Parser**: Global JSON parsing enabled
- **CORS**: Enabled for all origins
- **File Upload**: Supported via `multer` middleware

### **Authentication**
- **Driver Master Routes**: Some routes require `userOnly` middleware
- **Plant Operations**: Some routes require `userOnly` middleware

---

## 🚛 **VEHICLE MANAGEMENT APIs**

### **1. Vehicle CRUD Operations**

#### **Create Vehicle**
```http
POST /vms/vehicle
Content-Type: multipart/form-data (for file uploads)
```

**Request Body:**
```json
{
  "custrecord_vehicle_number": "MH-12-AB-1234",
  "custrecord_vehicle_name_ag": "Blade Transport Vehicle",
  "custrecord_vehicle_type_ag": "ODC|Lattice Tower",
  "currentPlant": "pune|solapur|surat|free",
  "custrecord_age_of_vehicle": "5 years",
  "custrecord_owner_name_ag": "Vehicle Owner Name",
  "custrecord_owner_no_ag": "+91-9876543210",
  "custrecord_chassis_number": "CHASSIS123456",
  "custrecord_engine_number_ag": "ENGINE123456",
  "custrecord_rc_no": "RC123456789",
  "custrecord_rc_start_date": "2020-01-01",
  "custrecord_rc_end_date": "2030-01-01",
  "custrecord_insurance_company_name_ag": "Insurance Company",
  "custrecord_insurance_number_ag": "INS123456",
  "custrecord_insurance_start_date_ag": "2024-01-01",
  "custrecord_insurance_end_date_ag": "2025-01-01",
  "custrecord_permit_number_ag": "PERMIT123456",
  "custrecord_permit_start_date": "2024-01-01",
  "custrecord_permit_end_date": "2025-01-01",
  "custrecord_puc_number": "PUC123456",
  "custrecord_puc_start_date_ag": "2024-01-01",
  "custrecord_puc_end_date_ag": "2025-01-01",
  "custrecord_tms_vehicle_fit_cert_vld_upto": "2025-01-01",
  "custrecord_vehicle_master_gps_available": true,
  "custrecord_vendor_name_ag": "{\"id\":\"vendor1\",\"name\":\"Vendor Name\",\"isInactive\":false}",
  "custrecord_create_by": "admin",
  "fcm_token": "firebase_token_here",
  "contactPersons": [
    {
      "name": "Contact Person Name",
      "phone": "+91-9876543210"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Vehicle created successfully",
  "vehicle": {
    "_id": "vehicle_id",
    "custrecord_vehicle_number": "MH-12-AB-1234",
    "custrecord_vehicle_name_ag": "Blade Transport Vehicle",
    "contactPersons": [...]
  }
}
```

#### **Get Vehicle by Number**
```http
GET /vms/vehicle/number/{vehicleNumber}?includeDriver=true
```

**Response:**
```json
{
  "_id": "vehicle_id",
  "custrecord_vehicle_number": "MH-12-AB-1234",
  "custrecord_vehicle_name_ag": "Blade Transport Vehicle",
  "assignedDriver": {...},
  "contactPersons": [...]
}
```

#### **Update Vehicle**
```http
PATCH /vms/vehicle/{vehicleNumber}
Content-Type: multipart/form-data
```

**Request Body:** Same as create vehicle (partial updates supported)

#### **Approve Vehicle by HQ**
```http
PATCH /vms/vehicle/approval/{vehicleNumber}
```

**Request Body:**
```json
{
  "approved_by_hq": "approved|pending|rejected",
  "approvalMeta": {
    "reviewer": "HQ Reviewer Name",
    "reviewMessage": "Approval comments"
  }
}
```

---

### **2. Vehicle Checklist Management**

#### **Get Checklist Template**
```http
GET /vms/vehicle/{vehicleNumber}/checklist
```

#### **Update Checklist**
```http
PATCH /vms/vehicle/{vehicleNumber}/checklist
```

**Request Body:**
```json
{
  "checklist": {
    "engine_check": true,
    "brake_check": false,
    "light_check": true
  }
}
```

#### **Confirm Checklist**
```http
POST /vms/vehicle/{vehicleNumber}/confirm-checklist
```

---

### **3. Driver Assignment & Management**

#### **Assign Driver to Vehicle**
```http
POST /vms/vehicle/{vehicleNumber}/assign-driver
```

**Request Body:**
```json
{
  "driverId": "driver_object_id"
}
```

#### **Change Vehicle Driver**
```http
PUT /vms/vehicle/{vehicleNumber}/change-driver
```

**Request Body:**
```json
{
  "newDriverId": "new_driver_object_id"
}
```

#### **Remove Driver from Vehicle**
```http
DELETE /vms/vehicle/{vehicleNumber}/remove-driver
```

#### **Get Vehicle with Driver**
```http
GET /vms/vehicle/{vehicleNumber}/with-driver
```

#### **Confirm Driver**
```http
POST /vms/vehicle/{vehicleNumber}/confirm-driver
```

---

### **4. Contact Person Management**

#### **Add Contact Person**
```http
POST /vms/vehicle/{vehicleNumber}/contact-person
```

**Request Body:**
```json
{
  "name": "Contact Person Name",
  "phone": "+91-9876543210"
}
```

#### **Remove Contact Person**
```http
DELETE /vms/vehicle/{vehicleNumber}/contact-person/{contactId}
```

#### **Get Vehicle with Contacts**
```http
GET /vms/vehicle/{vehicleNumber}/with-contacts
```

**Response:**
```json
{
  "vehicle": {
    "vehicleNumber": "MH-12-AB-1234",
    "vehicleName": "Blade Transport Vehicle",
    "vehicleType": "ODC",
    "currentPlant": "pune",
    "assignedDriver": {...},
    "contactPersons": [
      {
        "_id": "contact_id",
        "name": "Contact Person Name",
        "phone": "+91-9876543210",
        "addedDate": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### **5. Plant & Yard Management**

#### **Add Vehicle to Plant Yard**
```http
POST /vms/var/{plant}
Authorization: Required (userOnly middleware)
```

**Request Body:**
```json
{
  "vehicleNumber": "MH-12-AB-1234"
}
```

#### **List Plant Yard Vehicles**
```http
GET /vms/var/{plant}
Authorization: Required (userOnly middleware)
```

#### **Remove Vehicle from Plant**
```http
POST /vms/var/{plant}/remove-vehicle
```

**Request Body:**
```json
{
  "vehicleNumber": "MH-12-AB-1234"
}
```

#### **Get Vehicles by Plant and Status**
```http
GET /vms/vehicle/plant/{plant}?status=available&page=1&limit=10
```

#### **Get Plant Summary**
```http
GET /vms/vehicle/plant/{plant}/summary
```

#### **List Unassigned Vehicles**
```http
GET /vms/vehicle/unassigned?page=1&limit=10
```

---

### **6. Transit Management**

#### **Set Vehicle to In Transit**
```http
POST /vms/vehicle/{vehicleNumber}/set-in-transit
```

**Request Body:**
```json
{
  "destinationPlant": "pune|solapur|surat",
  "reason": "Plant transfer",
  "estimatedArrival": "2024-01-20T15:00:00.000Z"
}
```

#### **List In Transit Vehicles**
```http
GET /vms/vehicle/in-transit?page=1&limit=10
```

---

## 👨‍💼 **DRIVER MANAGEMENT APIs**

### **1. Driver CRUD Operations**

#### **Create Driver**
```http
POST /vms/driver-master
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "custrecord_driver_name": "Driver Name",
  "custrecord_driving_license_no": "DL123456789",
  "custrecord_driving_license_s_date": "2020-01-01",
  "custrecord_driver_license_e_date": "2030-01-01",
  "custrecord_license_category_ag": "Light Motor Vehicle|Medium Passenger Vehicle|Medium Goods Vehicle|Heavy Passenger Vehicle|Heavy Goods Vehicle",
  "custrecord_driver_mobile_no": "+91-9876543210",
  "custrecord_create_by_driver_master": "admin",
  "custrecord_driving_lca_test": "Passed",
  "fcm_token": "firebase_token_here",
  "approved_by_hq": "pending"
}
```

**Files:**
- `custrecord_driving_license_attachment`: License document
- `custrecord_driver_photo_ag`: Driver photo

#### **Get All Drivers**
```http
GET /vms/driver-master?page=1&limit=10&status=approved
```

#### **Get Driver by ID**
```http
GET /vms/driver-master/{driverId}
```

#### **Get Driver by License**
```http
POST /vms/driver-master/licence
```

**Request Body:**
```json
{
  "licenceNo": "DL123456789"
}
```

#### **Update Driver**
```http
PATCH /vms/driver-master/{driverId}
Content-Type: multipart/form-data
```

**Request Body:** Same as create driver (partial updates supported)

---

### **2. Driver Approval Management**

#### **Update Driver Status by HQ**
```http
PATCH /vms/driver-master/approval/{driverId}
```

**Request Body:**
```json
{
  "approved_by_hq": "approved|pending|rejected",
  "approvalMeta": {
    "reviewer": "HQ Reviewer Name",
    "reviewMessage": "Approval comments"
  }
}
```

#### **Get Pending Drivers for HQ**
```http
GET /vms/hq/driver-request
```

---

## 📊 **HQ DASHBOARD APIs**

### **1. Approval Management**

#### **Get Pending Approvals**
```http
GET /vms/hq-pending
```

#### **Get Approved Approvals**
```http
GET /vms/hq-approval
```

#### **Get Rejected Approvals**
```http
GET /vms/hq-rejected
```

#### **Get All Counts**
```http
GET /vms/hq-allcount
```

**Response:**
```json
{
  "pendingVehicles": 5,
  "approvedVehicles": 25,
  "rejectedVehicles": 2,
  "pendingDrivers": 8,
  "approvedDrivers": 45,
  "rejectedDrivers": 3
}
```

---

## 📋 **PRE-LR MANAGEMENT APIs**

### **1. Pre-LR Operations**

#### **Get Pre-LR List**
```http
GET /vms/preLr/{id}
```

#### **Get Pre-LR Count**
```http
GET /vms/preLrCount
```

#### **Sync Pre-LR Detail**
```http
GET /vms/sync-detial
```

---

## 🔔 **NOTIFICATION APIs**

### **1. Push Notifications**

#### **Send Notification**
```http
POST /vms/send-notification
```

**Request Body:**
```json
{
  "token": "fcm_token",
  "title": "Notification Title",
  "body": "Notification Body"
}
```

---

## 📝 **COMMON RESPONSE FORMATS**

### **Success Response**
```json
{
  "message": "Operation successful",
  "data": {...},
  "status": "success"
}
```

### **Error Response**
```json
{
  "error": "Error message",
  "status": "error",
  "code": 400
}
```

### **Validation Error Response**
```json
{
  "error": "Validation failed",
  "details": {
    "field": "Error message"
  }
}
```

---

## 🔧 **STATUS CODES**

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (Duplicate) |
| 500 | Internal Server Error |

---

## 📋 **ENUM VALUES**

### **Vehicle Types**
- `ODC` - Over Dimensional Cargo
- `Lattice Tower` - Lattice Tower Transport

### **Plants**
- `pune` - Pune Plant
- `solapur` - Solapur Plant
- `surat` - Surat Plant
- `free` - Not assigned to any plant

### **License Categories**
- `Light Motor Vehicle`
- `Medium Passenger Vehicle`
- `Medium Goods Vehicle`
- `Heavy Passenger Vehicle`
- `Heavy Goods Vehicle`

### **Approval Status**
- `approved` - Approved by HQ
- `pending` - Pending approval
- `rejected` - Rejected by HQ

---

## 🚀 **USAGE EXAMPLES**

### **Complete Vehicle Creation with Contacts**
```bash
curl -X POST http://localhost:5000/vms/vehicle \
  -H "Content-Type: application/json" \
  -d '{
    "custrecord_vehicle_number": "MH-12-TEST-001",
    "custrecord_vehicle_name_ag": "Test Vehicle",
    "custrecord_vehicle_type_ag": "ODC",
    "currentPlant": "free",
    "contactPersons": [
      {
        "name": "Vehicle Owner",
        "phone": "+91-9876543210"
      }
    ]
  }'
```

### **Add Contact Person to Existing Vehicle**
```bash
curl -X POST http://localhost:5000/vms/vehicle/MH-12-AB-1234/contact-person \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emergency Contact",
    "phone": "+91-9876543211"
  }'
```

### **Assign Driver to Vehicle**
```bash
curl -X POST http://localhost:5000/vms/vehicle/MH-12-AB-1234/assign-driver \
  -H "Content-Type: application/json" \
  -d '{
    "driverId": "64f1a2b3c4d5e6f7g8h9i0j1"
  }'
```

---

## 📚 **NOTES**

1. **File Uploads**: Use `multipart/form-data` for routes with file uploads
2. **Authentication**: Some routes require authentication middleware
3. **Pagination**: List endpoints support `page` and `limit` query parameters
4. **Real-time Logs**: Available at `http://localhost:5000/realtime-logs`
5. **Socket.IO**: Real-time updates available via WebSocket connection
6. **CORS**: Enabled for all origins for development
7. **Body Parser**: Global JSON parsing enabled, no need for route-specific parsing

---

*This API contract covers all vehicle and driver management operations in the Skeiron VMS V2 system.*
