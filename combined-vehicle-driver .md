# Combined Vehicle-Driver API - Frontend Implementation Guide

## 🚀 Overview
This API allows creating both a vehicle and driver in a single request, with the driver automatically assigned to the vehicle. This eliminates the need for separate API calls and ensures data consistency.

## 📡 API Endpoint
```
POST /vms/vehicle-with-driver
Content-Type: multipart/form-data
```

## 🔧 Implementation

### 1. Basic Request Structure

#### Vehicle Data (Top Level)
```javascript
const vehicleData = {
  custrecord_vehicle_number: "GJ12XX5555",        // Required, unique
  custrecord_vehicle_name_ag: "Test Vehicle",     // Optional
  custrecord_vehicle_type_ag: "ODC",              // Required: "ODC" or "Lattice Tower"
  custrecord_age_of_vehicle: "2",                 // Optional
  custrecord_owner_name_ag: "Owner Name",         // Optional
  custrecord_owner_no_ag: "9876543210",          // Optional
  custrecord_chassis_number: "CHASSIS123",       // Optional
  custrecord_engine_number_ag: "ENGINE123",      // Optional
  custrecord_rc_no: "RC123456",                  // Optional
  custrecord_rc_start_date: "2022-01-01",        // Optional (YYYY-MM-DD)
  custrecord_rc_end_date: "2032-01-01",          // Optional (YYYY-MM-DD)
  custrecord_insurance_company_name_ag: "Insurance Co", // Optional
  custrecord_insurance_number_ag: "INS123456",   // Optional
  custrecord_insurance_start_date_ag: "2024-01-01", // Optional
  custrecord_insurance_end_date_ag: "2025-01-01",   // Optional
  custrecord_permit_number_ag: "PERMIT123",      // Optional
  custrecord_permit_start_date: "2024-01-01",    // Optional
  custrecord_permit_end_date: "2025-01-01",      // Optional
  custrecord_puc_number: "PUC123456",            // Optional
  custrecord_puc_start_date_ag: "2024-01-01",    // Optional
  custrecord_puc_end_date_ag: "2025-01-01",      // Optional
  custrecord_tms_vehicle_fit_cert_vld_upto: "2025-01-01", // Optional
  custrecord_vehicle_master_gps_available: true, // Optional (boolean)
  currentPlant: "pune",                          // Optional: "pune", "solapur", "surat", "daman", "free"
  custrecord_create_by: "user_id",               // Optional
  fcm_token: "firebase_token",                   // Optional
  contactPersons: [                              // Optional array
    {
      name: "Emergency Contact",
      phone: "9876543211"
    }
  ]
};
```

#### Driver Data (Nested in 'driver' object)
```javascript
const driverData = {
  custrecord_driver_name: "Driver Name",         // Required
  custrecord_driving_license_no: "DL123456789",  // Required, unique
  custrecord_driving_license_s_date: "2020-01-01", // Required (YYYY-MM-DD)
  custrecord_driver_license_e_date: "2030-01-01", // Required (YYYY-MM-DD)
  custrecord_license_category_ag: "Heavy Goods Vehicle", // Optional: "Light Motor Vehicle", "Medium Passenger Vehicle", "Medium Goods Vehicle", "Heavy Passenger Vehicle", "Heavy Goods Vehicle"
  custrecord_driver_mobile_no: "9876543210",     // Required, unique
  custrecord_create_by_driver_master: "user_id", // Optional
  custrecord_driving_lca_test: "PASSED",         // Optional
  fcm_token: "firebase_token"                    // Optional
};
```

### 2. File Uploads

#### Vehicle Files
- `custrecord_rc_doc_attach` - RC documents (images/PDFs)
- `custrecord_puc_attachment_ag` - PUC documents (images/PDFs)
- `custrecord_permit_attachment_ag` - Permit documents (images/PDFs)
- `custrecord_insurance_attachment_ag` - Insurance documents (images/PDFs)
- `custrecord_tms_vehicle_fit_cert_attach` - Fitness certificate documents (images/PDFs)

#### Driver Files
- `driver_license_attachment` - Driver license document (image/PDF)
- `driver_photo` - Driver photo (image)

## 💻 Frontend Implementation Examples

### React/JavaScript Implementation

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/vms';

const createVehicleWithDriver = async (vehicleData, driverData, files = {}) => {
  try {
    const formData = new FormData();
    
    // Add vehicle fields
    Object.keys(vehicleData).forEach(key => {
      if (vehicleData[key] !== null && vehicleData[key] !== undefined) {
        formData.append(key, vehicleData[key]);
      }
    });
    
    // Add driver fields with 'driver.' prefix
    Object.keys(driverData).forEach(key => {
      if (driverData[key] !== null && driverData[key] !== undefined) {
        formData.append(`driver[${key}]`, driverData[key]);
      }
    });
    
    // Add vehicle files
    if (files.vehicleFiles) {
      files.vehicleFiles.forEach(fileGroup => {
        fileGroup.files.forEach(file => {
          formData.append(fileGroup.fieldName, file);
        });
      });
    }
    
    // Add driver files
    if (files.driverLicense) {
      formData.append('driver_license_attachment', files.driverLicense);
    }
    
    if (files.driverPhoto) {
      formData.append('driver_photo', files.driverPhoto);
    }
    
    const response = await axios.post(`${API_BASE_URL}/vehicle-with-driver`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating vehicle with driver:', error);
    throw error;
  }
};

// Usage example
const handleSubmit = async (formData) => {
  try {
    const vehicleData = {
      custrecord_vehicle_number: formData.vehicleNumber,
      custrecord_vehicle_name_ag: formData.vehicleName,
      custrecord_vehicle_type_ag: formData.vehicleType,
      currentPlant: formData.plant,
      custrecord_create_by: formData.userId,
      // ... other vehicle fields
    };
    
    const driverData = {
      custrecord_driver_name: formData.driverName,
      custrecord_driving_license_no: formData.licenseNumber,
      custrecord_driver_mobile_no: formData.mobileNumber,
      custrecord_driving_license_s_date: formData.licenseStartDate,
      custrecord_driver_license_e_date: formData.licenseEndDate,
      custrecord_license_category_ag: formData.licenseCategory,
      // ... other driver fields
    };
    
    const files = {
      vehicleFiles: [
        { fieldName: 'custrecord_rc_doc_attach', files: formData.rcFiles },
        { fieldName: 'custrecord_insurance_attachment_ag', files: formData.insuranceFiles },
        // ... other vehicle files
      ],
      driverLicense: formData.driverLicenseFile,
      driverPhoto: formData.driverPhotoFile
    };
    
    const result = await createVehicleWithDriver(vehicleData, driverData, files);
    
    console.log('Success:', result);
    // Handle success - show success message, redirect, etc.
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    // Handle error - show error message to user
  }
};
```

### Flutter/Dart Implementation

```dart
import 'package:http/http.dart' as http;
import 'dart:io';
import 'dart:convert';

class VehicleDriverService {
  static const String baseUrl = 'http://localhost:5000/vms';
  
  static Future<Map<String, dynamic>> createVehicleWithDriver({
    required Map<String, dynamic> vehicleData,
    required Map<String, dynamic> driverData,
    Map<String, File>? files,
  }) async {
    var request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/vehicle-with-driver'),
    );

    // Add vehicle fields
    vehicleData.forEach((key, value) {
      if (value != null) {
        request.fields[key] = value.toString();
      }
    });

    // Add driver fields with 'driver.' prefix
    driverData.forEach((key, value) {
      if (value != null) {
        request.fields['driver[$key]'] = value.toString();
      }
    });

    // Add files
    if (files != null) {
      files.forEach((fieldName, file) {
        request.files.add(
          http.MultipartFile.fromPath(fieldName, file.path),
        );
      });
    }

    try {
      var response = await request.send();
      var responseBody = await response.stream.bytesToString();
      
      if (response.statusCode == 201) {
        return json.decode(responseBody);
      } else {
        var errorData = json.decode(responseBody);
        throw Exception(errorData['details'] ?? errorData['error']);
      }
    } catch (e) {
      throw Exception('Failed to create vehicle with driver: $e');
    }
  }
}

// Usage example
class VehicleDriverForm extends StatefulWidget {
  @override
  _VehicleDriverFormState createState() => _VehicleDriverFormState();
}

class _VehicleDriverFormState extends State<VehicleDriverForm> {
  final _formKey = GlobalKey<FormState>();
  
  // Form controllers
  final vehicleNumberController = TextEditingController();
  final driverNameController = TextEditingController();
  final licenseNumberController = TextEditingController();
  // ... other controllers
  
  File? driverLicenseFile;
  File? driverPhotoFile;
  
  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    
    try {
      final vehicleData = {
        'custrecord_vehicle_number': vehicleNumberController.text,
        'custrecord_vehicle_name_ag': vehicleNameController.text,
        'custrecord_vehicle_type_ag': selectedVehicleType,
        'currentPlant': selectedPlant,
        // ... other vehicle fields
      };
      
      final driverData = {
        'custrecord_driver_name': driverNameController.text,
        'custrecord_driving_license_no': licenseNumberController.text,
        'custrecord_driver_mobile_no': mobileNumberController.text,
        'custrecord_driving_license_s_date': licenseStartDate,
        'custrecord_driver_license_e_date': licenseEndDate,
        'custrecord_license_category_ag': selectedLicenseCategory,
        // ... other driver fields
      };
      
      final files = <String, File>{};
      if (driverLicenseFile != null) {
        files['driver_license_attachment'] = driverLicenseFile!;
      }
      if (driverPhotoFile != null) {
        files['driver_photo'] = driverPhotoFile!;
      }
      
      final result = await VehicleDriverService.createVehicleWithDriver(
        vehicleData: vehicleData,
        driverData: driverData,
        files: files,
      );
      
      // Handle success
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Vehicle and driver created successfully!')),
      );
      
    } catch (e) {
      // Handle error
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          // Vehicle form fields
          TextFormField(
            controller: vehicleNumberController,
            decoration: InputDecoration(labelText: 'Vehicle Number'),
            validator: (value) => value?.isEmpty == true ? 'Required' : null,
          ),
          // ... other vehicle fields
          
          // Driver form fields
          TextFormField(
            controller: driverNameController,
            decoration: InputDecoration(labelText: 'Driver Name'),
            validator: (value) => value?.isEmpty == true ? 'Required' : null,
          ),
          // ... other driver fields
          
          // File upload buttons
          ElevatedButton(
            onPressed: () => _pickDriverLicense(),
            child: Text('Upload Driver License'),
          ),
          ElevatedButton(
            onPressed: () => _pickDriverPhoto(),
            child: Text('Upload Driver Photo'),
          ),
          
          // Submit button
          ElevatedButton(
            onPressed: _submitForm,
            child: Text('Create Vehicle & Driver'),
          ),
        ],
      ),
    );
  }
}
```

### HTML/JavaScript Implementation

```html
<!DOCTYPE html>
<html>
<head>
    <title>Create Vehicle with Driver</title>
</head>
<body>
    <form id="vehicleDriverForm" enctype="multipart/form-data">
        <h2>Vehicle Information</h2>
        <input type="text" name="custrecord_vehicle_number" placeholder="Vehicle Number" required>
        <input type="text" name="custrecord_vehicle_name_ag" placeholder="Vehicle Name">
        <select name="custrecord_vehicle_type_ag" required>
            <option value="">Select Vehicle Type</option>
            <option value="ODC">ODC</option>
            <option value="Lattice Tower">Lattice Tower</option>
        </select>
        <select name="currentPlant">
            <option value="free">Free</option>
            <option value="pune">Pune</option>
            <option value="solapur">Solapur</option>
            <option value="surat">Surat</option>
            <option value="daman">Daman</option>
        </select>
        
        <h2>Driver Information</h2>
        <input type="text" name="driver[custrecord_driver_name]" placeholder="Driver Name" required>
        <input type="text" name="driver[custrecord_driving_license_no]" placeholder="License Number" required>
        <input type="text" name="driver[custrecord_driver_mobile_no]" placeholder="Mobile Number" required>
        <input type="date" name="driver[custrecord_driving_license_s_date]" required>
        <input type="date" name="driver[custrecord_driver_license_e_date]" required>
        <select name="driver[custrecord_license_category_ag]">
            <option value="Light Motor Vehicle">Light Motor Vehicle</option>
            <option value="Medium Passenger Vehicle">Medium Passenger Vehicle</option>
            <option value="Medium Goods Vehicle">Medium Goods Vehicle</option>
            <option value="Heavy Passenger Vehicle">Heavy Passenger Vehicle</option>
            <option value="Heavy Goods Vehicle">Heavy Goods Vehicle</option>
        </select>
        
        <h2>File Uploads</h2>
        <input type="file" name="driver_license_attachment" accept="image/*,application/pdf">
        <input type="file" name="driver_photo" accept="image/*">
        <input type="file" name="custrecord_rc_doc_attach" multiple accept="image/*,application/pdf">
        
        <button type="submit">Create Vehicle & Driver</button>
    </form>

    <script>
        document.getElementById('vehicleDriverForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            
            try {
                const response = await fetch('/vms/vehicle-with-driver', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('Success:', result);
                    alert('Vehicle and driver created successfully!');
                } else {
                    const error = await response.json();
                    alert('Error: ' + (error.details || error.error));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Network error occurred');
            }
        });
    </script>
</body>
</html>
```

## 📋 Response Format

### Success Response (201 Created)
```json
{
  "message": "Vehicle and driver created successfully",
  "vehicle": {
    "_id": "ObjectId",
    "custrecord_vehicle_number": "GJ12XX5555",
    "custrecord_vehicle_name_ag": "Test Vehicle",
    "currentPlant": "pune",
    "assignedDriver": {
      "_id": "ObjectId",
      "custrecord_driver_name": "Driver Name",
      "custrecord_driving_license_no": "DL123456789",
      "custrecord_driver_mobile_no": "9876543210",
      "approved_by_hq": "pending"
    },
    "driverConfirmed": true,
    "checklistConfirmed": false,
    "approved_by_hq": "pending",
    "contactPersons": [
      {
        "name": "Emergency Contact",
        "phone": "9876543211",
        "addedDate": "2025-09-21T12:20:40.468Z",
        "_id": "ObjectId"
      }
    ]
    // ... other vehicle fields
  },
  "driver": {
    "_id": "ObjectId",
    "custrecord_driver_name": "Driver Name",
    "custrecord_driving_license_no": "DL123456789",
    "custrecord_driver_mobile_no": "9876543210",
    "approved_by_hq": "pending"
    // ... other driver fields
  },
  "assignment": {
    "driverAssigned": true,
    "driverConfirmed": true,
    "vehicleNumber": "GJ12XX5555",
    "driverName": "Driver Name"
  }
}
```

### Error Response (400/409/500)
```json
{
  "error": "Error message",
  "details": "Detailed error description"
}
```

## ⚠️ Important Notes

### Required Fields
- **Vehicle**: `custrecord_vehicle_number`, `custrecord_vehicle_type_ag`
- **Driver**: `custrecord_driver_name`, `custrecord_driving_license_no`, `custrecord_driver_mobile_no`, `custrecord_driving_license_s_date`, `custrecord_driver_license_e_date`

### Unique Constraints
- Vehicle number must be unique
- Driver license number must be unique
- Driver mobile number must be unique

### File Constraints
- Supported formats: Images (PNG, JPG, JPEG, WebP), PDFs
- Maximum file size: 50MB per file

### Key Benefits
1. **Single API Call** - Reduces network requests from 2 to 1
2. **Atomic Operations** - Both created together or neither
3. **Automatic Assignment** - Driver immediately assigned to vehicle
4. **Auto-Confirmation** - Driver confirmed automatically
5. **Better UX** - Faster form submission and processing

## 🧪 Testing

### Test Data Example
```javascript
const testData = {
  custrecord_vehicle_number: "TEST-001",
  custrecord_vehicle_name_ag: "Test Vehicle",
  custrecord_vehicle_type_ag: "ODC",
  currentPlant: "pune",
  custrecord_create_by: "test_user",
  driver: {
    custrecord_driver_name: "Test Driver",
    custrecord_driving_license_no: "DL123456789",
    custrecord_driver_mobile_no: "9876543210",
    custrecord_driving_license_s_date: "2020-01-01",
    custrecord_driver_license_e_date: "2030-01-01"
  }
};
```

## 🆘 Support

For any questions or issues with this API, please contact the backend development team.

---

**API Endpoint**: `POST /vms/vehicle-with-driver`  
**Content-Type**: `multipart/form-data`  
**Server**: `http://localhost:5000`