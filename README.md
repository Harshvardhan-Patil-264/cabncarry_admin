# CabNCarry - Transportation Management System

![CabNCarry Logo](public/images/favicon.svg)

CabNCarry is a comprehensive transportation management system that provides ride-hailing and goods delivery services. The platform connects users with drivers and manages transportation logistics efficiently through a modern web interface.

## 🌟 Features

### For Users
- Book rides and track deliveries in real-time
- Multiple vehicle options (Mini, Sedan, SUV, Van, Auto Rickshaw, Mini Truck)
- Secure payment processing
- Rate and review drivers
- View ride history

### For Drivers
- Easy application process
- Real-time ride requests
- Route optimization
- Earnings tracking
- Profile management

### For Admins
- Comprehensive dashboard with analytics
- Driver application management
- User management
- Branch management
- Real-time monitoring of rides
- Revenue tracking
- Branch-wise performance analysis

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/cabncarry-admin.git
cd cabncarry-admin
```

### 2. Set Up the Database
```bash
# Log into MySQL
mysql -u root -p

# Create the database
CREATE DATABASE cabncarry;

# Import the database schema
mysql -u root -p cabncarry < Dump20250327.sql
```

### 3. Configure the Application
```bash
# Open server.js and update the database configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'cabncarry'
});
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Start the Server
```bash
node server.js
```

The application will be available at `http://localhost:3005`

## 📁 Project Structure

```
cabncarry-admin/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── views/
│   ├── dashboard.html
│   ├── home.html
│   ├── login.html
│   └── driver-application.html
├── server.js
├── package.json
└── README.md
```

## 🔐 Default Admin Credentials
- Username: admin
- Password: admin123

## 💻 Technology Stack

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript
  - Font Awesome
  - Google Fonts
  - AOS (Animate on Scroll)

- **Backend:**
  - Node.js
  - Express.js
  - MySQL

- **Security:**
  - Session-based authentication
  - Password hashing
  - Input validation

## 🌐 API Endpoints

### Authentication
- `POST /login` - Admin login
- `GET /logout` - Admin logout

### Admin Management
- `GET /get-admins` - List all admins
- `POST /add-admin` - Add new admin
- `DELETE /delete-admin/:id` - Delete admin

### Branch Management
- `GET /get-branches` - List all branches
- `POST /add-branch` - Add new branch
- `PUT /update-branch/:id` - Update branch
- `DELETE /delete-branch/:id` - Delete branch

### Driver Management
- `GET /get-drivers` - List all drivers
- `GET /get-driver-applications` - List driver applications
- `POST /handle-driver-application/:id` - Process driver application
- `DELETE /delete-driver/:id` - Delete driver

## 📱 Mobile App Integration

The system includes integration points for mobile applications:
- RESTful API endpoints
- Real-time tracking capabilities
- Push notification support
- Mobile-responsive design

## 🔒 Security Features

- Session-based authentication
- SQL injection prevention
- XSS protection
- Input validation
- Secure password storage
- Rate limiting
- CORS protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- AOS library for scroll animations
- Express.js community
- MySQL community

## 📞 Support

For support, email support@cabncarry.com or join our Slack channel. 