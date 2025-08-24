# 🔐 Authentication Flow Documentation

## 📋 Current Status

✅ **Frontend: COMPLETELY BUILT AND READY**
❌ **Backend: NEEDS IMPLEMENTATION**

## 🚀 What's Already Working

### **1. User Interface**
- Organization signup form (`/auth/organization/signup`)
- Organization login form (`/auth/organization/login`)
- Employee signup form (`/auth/employee/signup`)
- Employee login form (`/auth/employee/login`)
- Choose account type page (`/auth/choose-signup`, `/auth/choose-login`)

### **2. Authentication Logic**
- Form validation and error handling
- Loading states and user feedback
- JWT token storage in localStorage
- User data persistence
- Automatic redirect to `/dashboard` after successful auth

### **3. Navigation Flow**
- Users can choose between Organization (HR) and Employee
- Seamless switching between signup and login forms
- Proper routing and protected routes

## 🎯 What Needs Backend Implementation

### **API Endpoints Required:**

#### **Organization Authentication:**
```
POST /api/auth/organization/signup
Content-Type: application/json
Body: { company_name, hremail, password }

Response: { access_token, user: { id, company_name, hremail, role } }
```

```
POST /api/auth/organization/login
Content-Type: application/x-www-form-urlencoded
Body: hremail=...&password=...

Response: { access_token, user: { id, company_name, hremail, role } }
```

#### **Employee Authentication:**
```
POST /api/auth/employee/signup
Content-Type: application/json
Body: { company_id, employee_email, password, name, dob, phone_number, joining_date }

Response: { access_token, user: { id, company_id, employee_email, name, role } }
```

```
POST /api/auth/employee/login
Content-Type: application/x-www-form-urlencoded
Body: company_id=...&employee_email=...&password=...

Response: { access_token, user: { id, company_id, employee_email, name, role } }
```

## 🔧 Technical Requirements

### **Backend Stack:**
- FastAPI
- Neon PostgreSQL
- SQLAlchemy ORM
- JWT authentication
- bcrypt password hashing

### **Database Schema:**
```sql
-- Organizations table
CREATE TABLE organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(150) NOT NULL,
    hremail VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Employees table
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    employee_email VARCHAR(150) NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    dob DATE,
    phone_number VARCHAR(20),
    joining_date DATE DEFAULT CURRENT_DATE,
    role VARCHAR(20) DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing the Frontend

### **Option 1: Use Mock Data (Recommended for now)**
1. Import `mockApiResponses` from `src/config/mockApi.ts`
2. Replace fetch calls with mock responses
3. Test complete authentication flow
4. Users will be redirected to `/dashboard`

### **Option 2: Wait for Backend**
1. Build the backend APIs
2. Test with real database
3. Frontend will work immediately

## 🎉 Expected Behavior

Once backend is implemented:

1. **Organization Signup:**
   - User fills form → API call → Success → Redirect to `/dashboard`

2. **Organization Login:**
   - User fills form → API call → Success → Redirect to `/dashboard`

3. **Employee Signup:**
   - User fills form → API call → Success → Redirect to `/dashboard`

4. **Employee Login:**
   - User fills form → API call → Success → Redirect to `/dashboard`

## 🚨 Current Error Handling

- Shows "Backend API not available yet" when APIs are missing
- Proper error messages for validation failures
- Loading states during API calls
- Graceful fallbacks for network issues

## 📱 Mobile Responsiveness

- All forms are mobile-optimized
- Responsive design with TailwindCSS
- Touch-friendly input fields
- Proper viewport handling

---

**Status: Frontend 100% Complete, Backend 0% Complete**
**Next Step: Implement the 4 API endpoints in FastAPI + Neon**
