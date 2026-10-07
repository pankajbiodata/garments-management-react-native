# Garments Management System

A React Native mobile application for managing garment business operations.

The **Garments Management System** provides a mobile ERP-style interface for managing employees, customers, vendors, inventory, sales, purchases, users, and business reports.

The mobile application communicates with an **ASP.NET Core Web API (.NET 8)** backend using REST APIs and JWT Bearer authentication.

## Repository

[GarmentsReactNative on GitHub](https://github.com/pankajbiodata/GarmentsReactNative?utm_source=chatgpt.com)

---

# Features

### Authentication & Security

* JWT-based authentication
* Persistent login using AsyncStorage
* Automatic JWT Bearer token injection
* Session expiration handling
* Role-based access control
* Admin, Manager, Staff and Viewer roles
* Protected API endpoints

### Business Management

* Employee Management
* Customer Management
* Vendor Management
* Inventory Management
* Sales Management
* Purchase Management
* User Management
* Reports

### Mobile Application

* React Native Android application
* React Navigation
* Native stack navigation
* Grid-based dashboard
* Native Picker controls
* MaterialCommunityIcons
* Form validation
* API error handling
* Session management

---

# Technology Stack

## Mobile Application

| Technology                | Version / Purpose                |
| ------------------------- | -------------------------------- |
| React Native              | 0.87.1                           |
| React                     | 19.2.3                           |
| Node.js                   | >= 22.11.0                       |
| React Navigation          | 7.x                              |
| AsyncStorage              | 3.1.1                            |
| React Native Picker       | 2.11.4                           |
| React Native Grid View    | 0.4.1                            |
| React Native Vector Icons | 10.3.0                           |
| Safe Area Context         | 5.10.1                           |
| React Native Screens      | 4.28.0                           |
| JavaScript / TypeScript   | Application/native configuration |

The versions above are based on the current repository `package.json`.

## Backend

The mobile application is designed to communicate with:

* ASP.NET Core Web API
* .NET 8
* C#
* Dapper
* MySQL
* JWT Bearer Authentication
* BCrypt password hashing
* Swagger / OpenAPI

## Development Connectivity

* Android Emulator
* Physical Android device
* IIS
* ASP.NET Core Hosting Bundle
* ngrok

---

# Architecture

```text
┌─────────────────────────────────────┐
│       React Native Mobile App       │
│                                     │
│  Login / Dashboard / Business UI    │
│                                     │
│  Employee                          │
│  Customer                          │
│  Vendor                            │
│  Inventory                         │
│  Sales                             │
│  Purchase                          │
│  Users                             │
│  Reports                           │
└────────────────┬────────────────────┘
                 │
                 │ HTTPS REST API
                 │ JWT Bearer Token
                 ▼
┌─────────────────────────────────────┐
│       ASP.NET Core Web API          │
│              .NET 8                 │
│                                     │
│ Controllers                         │
│ Repositories                        │
│ JWT Authentication                  │
│ Role Authorization                  │
└────────────────┬────────────────────┘
                 │
                 │ Dapper
                 ▼
┌─────────────────────────────────────┐
│              MySQL                  │
│                                     │
│           garmentsdb                │
└─────────────────────────────────────┘
```

---

# Repository Structure

The current repository contains the React Native application and its native Android/iOS projects.

```text
GarmentsReactNative/
│
├── android/
├── ios/
│
├── screens/
│   ├── DashboardScreen.js
│   ├── LoginScreen.js
│   ├── FirstAdminScreen.js
│   │
│   ├── EmployeeScreen.js
│   ├── EditEmployee.js
│   │
│   ├── CustomerScreen.js
│   ├── EditCustomer.js
│   │
│   ├── VendorScreen.js
│   ├── EditVendor.js
│   │
│   ├── InventoryScreen.js
│   ├── EditInventory.js
│   │
│   ├── SalesScreen.js
│   ├── EditSales.js
│   │
│   ├── PurchaseScreen.js
│   ├── EditPurchase.js
│   │
│   └── UserManagementScreen.js
│
├── reports/
│
├── services/
│   └── api.js
│
├── AuthContext.js
├── App.tsx
├── index.js
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── jest.config.js
│
├── __tests__/
├── Gemfile
├── .eslintrc.js
├── .prettierrc.js
└── README.md
```

The repository currently contains `screens`, `services`, `reports`, `AuthContext.js`, `App.tsx`, Android/iOS projects, and the React Native configuration files.

---

# Prerequisites

Before installing the application, install:

* Node.js 22.11 or later
* npm
* Java/JDK compatible with React Native 0.87.1
* Android Studio
* Android SDK
* Android SDK Platform Tools
* Android Emulator or physical Android device

For the official React Native environment setup:

[React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment?utm_source=chatgpt.com)

Verify Node:

```powershell
node --version
```

Verify npm:

```powershell
npm --version
```

---

# Clone the Repository

```powershell
git clone https://github.com/pankajbiodata/GarmentsReactNative.git
```

Enter the project:

```powershell
cd GarmentsReactNative
```

---

# Install Dependencies

Install all React Native dependencies:

```powershell
npm install
```

The project currently requires Node.js:

```text
>= 22.11.0
```

as specified by `package.json`.

---

# React Native Dependencies

The application currently uses:

```text
@react-native-async-storage/async-storage
@react-native-picker/picker
@react-native/new-app-screen
@react-navigation/native
@react-navigation/native-stack
fetch-polyfill
react
react-native
react-native-grid-view
react-native-safe-area-context
react-native-screens
react-native-vector-icons
```

The project also includes the standard React Native development dependencies for Babel, Metro, Jest, ESLint, TypeScript and the React Native CLI.

---

# Configure the Backend API

The API base URL is configured in:

```text
services/api.js
```

The current repository configuration uses:

```javascript
const API_URL =
  'https://3b36-49-205-47-35.ngrok-free.app/api';
```

The current `api.js` retrieves the JWT from AsyncStorage and adds:

```text
Authorization: Bearer <JWT>
```

to API requests. It also handles HTTP 401 and 403 responses.

## Important

The ngrok URL is temporary.

When a new ngrok tunnel is created, update:

```text
services/api.js
```

with the new URL.

For example:

```javascript
const API_URL =
  'https://YOUR-NGROK-URL.ngrok-free.app/api';
```

Do not include `/Inventory`, `/Customer`, `/Vendor`, etc. in the base URL.

---

# API Service

All application screens should use the centralized API service:

```text
services/api.js
```

Available methods:

```javascript
apiGet()
apiPost()
apiPut()
apiDelete()
```

Example:

```javascript
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
} from '../services/api';
```

### GET

```javascript
const data = await apiGet(
  '/Inventory/GetInventoryReport',
);
```

### POST

```javascript
await apiPost(
  '/Inventory/AddItem',
  payload,
);
```

### PUT

```javascript
await apiPut(
  '/Inventory/UpdateItem/1',
  payload,
);
```

### DELETE

```javascript
await apiDelete(
  '/Inventory/DeleteItem/1',
);
```

The centralized service automatically adds the stored JWT token to requests.

---

# Authentication

Authentication is managed by:

```text
AuthContext.js
```

The login process is:

```text
Login Screen
     │
     │ Username + Password
     ▼
POST /api/Auth/login
     │
     ▼
ASP.NET Core API
     │
     ├── Validate user
     ├── Verify password
     └── Generate JWT
     │
     ▼
React Native
     │
     ├── Store JWT
     └── Store user information
     │
     ▼
Dashboard
```

The JWT is subsequently used for protected API requests.

---

# User Roles

The application supports:

```text
Admin
Manager
Staff
Viewer
```

## General Permissions

| Module          | Admin |    Manager    |     Staff     | Viewer |
| --------------- | :---: | :-----------: | :-----------: | :----: |
| Employee        |  Full |     Manage    |       -       |    -   |
| Inventory       |  Full | Add/Edit/View |      View     |    -   |
| Sales           |  Full |      Full     | Add/Edit/View |  View  |
| Purchase        |  Full | Add/Edit/View |       -       |    -   |
| Customer        |  Full | Add/Edit/View | Add/Edit/View |    -   |
| Vendor          |  Full | Add/Edit/View |       -       |    -   |
| Reports         |  Yes  |      Yes      |      Yes      |   Yes  |
| User Management |  Yes  |       -       |       -       |    -   |

The backend API should always enforce these permissions using ASP.NET Core `[Authorize]` policies/roles. UI-level hiding of modules is not considered a security boundary.

---

# Business Modules

## Employee Management

Provides employee management functionality including:

* Employee listing
* Add employee
* Edit employee
* Delete employee
* Attendance
* Attendance reset
* Employee attendance reporting

---

# Customer Management

Provides:

* Customer listing
* Add customer
* Edit customer
* Delete customer
* Customer transaction information

---

# Vendor Management

Provides:

* Vendor listing
* Add vendor
* Edit vendor
* Delete vendor
* Vendor transaction information

---

# Inventory Management

Provides:

* Inventory listing
* Add inventory item
* Edit inventory item
* Delete inventory item
* Quantity management
* Unit price management
* Inventory reporting

---

# Sales Management

Provides:

* Sales order listing
* Add sales order
* Edit sales order
* Delete sales order
* Customer selection
* Order date
* Order amount

---

# Purchase Management

Provides:

* Purchase order listing
* Add purchase order
* Edit purchase order
* Delete purchase order
* Vendor selection
* Purchase date
* Purchase amount
* Purchase reporting

---

# Reports

The repository contains a dedicated:

```text
reports/
```

directory for reporting-related functionality.

Reports can be integrated with the API to provide business-level information such as:

* Inventory reports
* Sales reports
* Purchase reports
* Employee information
* Customer information
* Vendor information

---

# User Management

Administrators can manage application users.

Supported roles:

```text
Admin
Manager
Staff
Viewer
```

Typical user management operations include:

* View users
* Create user
* Assign role
* Activate/deactivate users

---

# Backend API

The React Native application communicates with an external ASP.NET Core Web API.

Recommended backend structure:

```text
GarmentsAPI/
│
├── Controllers/
│   ├── AuthController.cs
│   ├── EmployeeController.cs
│   ├── CustomerController.cs
│   ├── VendorController.cs
│   ├── InventoryController.cs
│   ├── SalesController.cs
│   └── PurchaseController.cs
│
├── Repositories/
│   ├── UserRepository.cs
│   ├── EmployeeRepository.cs
│   ├── CustomerRepository.cs
│   ├── VendorRepository.cs
│   ├── InventoryRepository.cs
│   ├── SalesRepository.cs
│   └── PurchaseRepository.cs
│
├── Models/
│   ├── User.cs
│   ├── Employee.cs
│   ├── Customer.cs
│   ├── Vendor.cs
│   ├── InventoryItem.cs
│   ├── SalesOrder.cs
│   └── PurchaseOrder.cs
│
├── Program.cs
├── appsettings.json
└── GarmentsAPI.csproj
```

The backend is maintained separately from this React Native repository.

---

# MySQL Database

The backend uses MySQL.

Database:

```text
garmentsdb
```

Example connection string:

```json
{
  "ConnectionStrings": {
    "GarmentDB": "Server=localhost;Port=3306;Database=garmentsdb;Uid=dev;Pwd=YOUR_PASSWORD;"
  }
}
```

For production, database credentials should not be committed to source control.

---

# JWT Configuration

The ASP.NET Core backend uses JWT Bearer authentication.

Typical configuration:

```json
{
  "Jwt": {
    "Key": "YOUR_SECURE_JWT_KEY",
    "Issuer": "GarmentsAPI",
    "Audience": "GarmentsMobileApp",
    "ExpiryMinutes": 480
  }
}
```

The JWT contains information such as:

```text
User ID
Username
Role
```

The role is used by ASP.NET Core authorization.

---

# First Administrator

On a new installation, the first administrator can be created through the backend's first-admin setup endpoint.

Example:

```http
POST /api/Auth/create-first-admin
```

Request:

```json
{
  "username": "admin",
  "password": "Admin@123",
  "role": "Admin"
}
```

Once the first user exists, subsequent users should be created through authenticated administrator functionality.

---

# Start Metro

From the project root:

```powershell
npm start
```

or:

```powershell
npx react-native start
```

---

# Run Android

Open another terminal from the project root:

```powershell
npm run android
```

or:

```powershell
npx react-native run-android
```

The repository's `package.json` defines:

```text
npm start
npm run android
npm run ios
npm run lint
npm test
```

as the primary scripts.

---

# Physical Android Device

Connect the Android device using USB.

Check the connection:

```powershell
adb devices
```

Example:

```text
List of devices attached
XXXXXXXX    device
```

Then:

```powershell
npm run android
```

---

# Android Emulator

Start an Android Virtual Device from Android Studio.

Verify:

```powershell
adb devices
```

Then:

```powershell
npm run android
```

---

# ngrok Configuration

If the backend is running locally and the Android device needs to access it, expose the API using ngrok.

Example:

```powershell
ngrok http 5000
```

Use the HTTPS address generated by ngrok:

```text
https://xxxxxxxx.ngrok-free.app
```

Then configure:

```text
services/api.js
```

as:

```javascript
const API_URL =
  'https://xxxxxxxx.ngrok-free.app/api';
```

Restart Metro after changing the API URL:

```powershell
npx react-native start --reset-cache
```

---

# Release APK

To generate an Android release APK:

```powershell
cd android
.\gradlew assembleRelease
```

The APK is normally generated at:

```text
android/app/build/outputs/apk/release/app-release.apk
```

For a clean release build:

```powershell
cd android
.\gradlew clean
.\gradlew assembleRelease
```

---

# Clean Android Build

If the Android build fails after dependency or native changes:

```powershell
cd android
.\gradlew clean
cd ..
```

Then:

```powershell
npx react-native start --reset-cache
```

Finally:

```powershell
npm run android
```

---

# iOS

The repository also contains an `ios/` project.

Install dependencies:

```powershell
npm install
```

On macOS, install CocoaPods dependencies:

```bash
bundle install
bundle exec pod install
```

Then:

```bash
npm run ios
```

> iOS development requires macOS and Xcode.

---

# Testing

Run Jest:

```powershell
npm test
```

Run lint:

```powershell
npm run lint
```

The repository includes a:

```text
__tests__/
```

directory and Jest configuration.

---

# Development Workflow

A typical development environment consists of:

### 1. MySQL

Start MySQL and ensure:

```text
garmentsdb
```

is available.

### 2. ASP.NET Core API

Start the backend:

```powershell
dotnet run
```

### 3. ngrok

Expose the API:

```powershell
ngrok http <API_PORT>
```

### 4. React Native Metro

```powershell
npm start
```

### 5. Android

```powershell
npm run android
```

---

# Troubleshooting

## Metro Cache

If changes are not appearing:

```powershell
npx react-native start --reset-cache
```

---

## Android Build Failure

Try:

```powershell
cd android
.\gradlew clean
cd ..
npm install
npm run android
```

---

## API Connection Failure

Check:

1. ASP.NET Core API is running.
2. ngrok is running.
3. The ngrok URL is current.
4. `services/api.js` contains the correct API URL.
5. The Android device has Internet access.
6. The API endpoint works from Swagger/browser.

---

## 401 Unauthorized

A `401` generally means the JWT is missing, expired or invalid.

Log out and log in again.

The centralized API service automatically removes the stored token/user information when it receives HTTP 401.

---

## 403 Forbidden

A `403` means the user is authenticated but does not have permission to perform the requested operation.

For example:

```text
Staff → Delete Inventory
```

should be rejected by the backend if inventory deletion is restricted to Admin.

The API service also converts HTTP 403 into a permission error for the application.

---

# Security

Do not commit the following to GitHub:

* Production database passwords
* Production JWT signing keys
* Private API credentials
* Production certificates
* Private ngrok credentials

For development, use configuration files or environment-specific settings.

For production:

* Use HTTPS.
* Use a strong JWT signing key.
* Use secure database credentials.
* Restrict database permissions.
* Use a permanent API hostname instead of a temporary ngrok URL.
* Keep authorization enforcement on the server.
* Use a production Android signing key.

---

# Git Commands

Check status:

```powershell
git status
```

Add changes:

```powershell
git add .
```

Commit:

```powershell
git commit -m "Update README"
```

Push:

```powershell
git push origin main
```

---

# Current Repository Status

The GitHub repository is public and currently has a `main` branch. GitHub currently reports 7 commits and the repository description as **"React Native app for Garments ERP."**

---

# Roadmap

Potential future modules include:

* Work Assignment Management
* Production Management
* Worker payment tracking
* Garment production workflow
* Purchase-to-inventory integration
* Sales-to-inventory integration
* Dashboard analytics
* Advanced reports
* Export to Excel/PDF
* Notifications
* Barcode/QR scanning
* Production tracking
* Attendance and payroll integration

---

# License

Add the appropriate license if this project is intended for public distribution.

---

# Author

**Pankaj Kumar**

Garments Management System
React Native + ASP.NET Core + MySQL
