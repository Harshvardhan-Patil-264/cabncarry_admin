const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3005;

// Database Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass', // Your MySQL password
    database: 'cabncarry'
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'cabncarry_admin_secret',
    resave: false,
    saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM admin WHERE username = ? AND password = ?';
    
    connection.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).send('Server error');
        if (results.length > 0) {
            req.session.admin = results[0];
            res.redirect('/dashboard');
        } else {
            res.redirect('/?error=invalid');
        }
    });
});

// Dashboard Route
app.get('/dashboard', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Get All Admins Route
app.get('/get-admins', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const query = 'SELECT id, username, name FROM admin';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Add Admin Route
app.post('/add-admin', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { username, name, password } = req.body;
    
    const query = 'INSERT INTO admin (username, name, password) VALUES (?, ?, ?)';
    connection.query(query, [username, name, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Username already exists' 
                });
            }
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        res.json({ success: true });
    });
});

app.delete('/delete-admin/:id', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const adminId = req.params.id;
    
    // Prevent deleting the current logged-in admin or the super admin
    if (adminId == req.session.admin.id || adminId == 1) {
        return res.status(400).json({ 
            success: false, 
            message: 'Cannot delete this admin' 
        });
    }
    
    // Delete the admin
    const deleteAdminQuery = 'DELETE FROM admin WHERE id = ?';
    connection.query(deleteAdminQuery, [adminId], (err, result) => {
        if (err) {
            console.error('Delete admin error:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error: ' + err.message 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin not found' 
            });
        }
        
        res.json({ success: true });
    });
});

// Dashboard Data
app.get('/dashboard-data', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const queries = {
        totalIncome: `
            SELECT COALESCE(SUM(totalprice), 0) as total 
            FROM userride 
            WHERE status IN ('complete', 'accept', 'ongoing')
        `,
        todayIncome: `
            SELECT COALESCE(SUM(totalprice), 0) as today 
            FROM userride 
            WHERE DATE(bookeddaytime) = CURDATE() 
            AND status IN ('complete', 'accept', 'ongoing')
        `,
        totalDrivers: 'SELECT COUNT(*) as count FROM drivers',
        totalRides: 'SELECT COUNT(*) as count FROM userride',
        pendingApplications: 'SELECT COUNT(*) as count FROM driver_applications WHERE status = "pending"',
        activeRides: 'SELECT COUNT(*) as count FROM userride WHERE status IN ("accept", "ongoing")',
        totalUsers: 'SELECT COUNT(*) as count FROM users',
        totalBranches: 'SELECT COUNT(*) as count FROM branches'
    };

    Promise.all(Object.values(queries).map(query => 
        new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) {
                    console.error('Query error:', err);
                    reject(err);
                    return;
                }
                resolve(results[0]);
            });
        })
    ))
    .then(results => {
        const response = {
            totalIncome: parseFloat(results[0].total) || 0,
            todayIncome: parseFloat(results[1].today) || 0,
            totalDrivers: parseInt(results[2].count) || 0,
            totalRides: parseInt(results[3].count) || 0,
            pendingApplications: parseInt(results[4].count) || 0,
            activeRides: parseInt(results[5].count) || 0,
            totalUsers: parseInt(results[6].count) || 0,
            totalBranches: parseInt(results[7].count) || 0
        };

        console.log('Dashboard data:', response); // For debugging
        res.json(response);
    })
    .catch(err => {
        console.error('Error fetching dashboard data:', err);
        res.status(500).json({ 
            error: 'Database error',
            details: err.message 
        });
    });
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Branch Management Routes
app.get('/get-branches', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // First, let's check if the branches table exists and has data
    connection.query('SELECT COUNT(*) as count FROM branches', (err, results) => {
        if (err) {
            console.error('Error checking branches table:', err);
            return res.status(500).json({ 
                error: 'Database error',
                details: 'Error checking branches table: ' + err.message 
            });
        }
        
        console.log('Total branches found:', results[0].count);
        
        // Now fetch the detailed branch data with the correct column name
        const query = `
            SELECT 
                b.id,
                b.name,
                b.location,
                b.contact,
                b.admin_id,
                a.name as admin_name,
                CAST(COALESCE(SUM(ur.totalprice), 0) AS DECIMAL(10,2)) as total_income,
                COUNT(DISTINCT ur.rideid) as total_rides
            FROM branches b 
            LEFT JOIN admin a ON b.admin_id = a.id
            LEFT JOIN userride ur ON ur.branch_id = b.id 
            GROUP BY b.id, b.name, b.location, b.contact, b.admin_id, a.name
            ORDER BY b.name
        `;
        
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching branches:', err);
                return res.status(500).json({ 
                    error: 'Database error',
                    details: err.message,
                    sqlState: err.sqlState,
                    sqlMessage: err.sqlMessage
                });
            }
            
            console.log('Successfully fetched branches:', results.length);
            res.json(results);
        });
    });
});

app.post('/add-branch', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { name, location, contact, admin } = req.body;
    
    // Validate required fields
    if (!name || !location || !contact) {
        return res.status(400).json({
            success: false,
            message: 'Name, location, and contact are required fields'
        });
    }

    // Validate contact format
    const contactRegex = /^[+]?[6-9][0-9]{9}$|^\+91[6-9][0-9]{9}$|^NA-[0-9]+$/;
    if (!contactRegex.test(contact)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid contact format. Must be a valid Indian phone number (e.g., 9876543210) or NA-{number} (e.g., NA-1)'
        });
    }
    
    // First check if branch name already exists
    const checkQuery = 'SELECT id FROM branches WHERE name = ?';
    connection.query(checkQuery, [name], (err, results) => {
        if (err) {
            console.error('Error checking branch name:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error while checking branch name',
                details: err.message
            });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Branch name already exists' 
            });
        }
        
        // If admin is provided, verify it exists
        if (admin) {
            connection.query('SELECT id FROM admin WHERE id = ?', [admin], (err, results) => {
                if (err || results.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Selected admin does not exist'
                    });
                }
                insertBranch();
            });
        } else {
            insertBranch();
        }

        function insertBranch() {
            // Insert new branch
            const insertQuery = 'INSERT INTO branches (name, location, contact, admin_id) VALUES (?, ?, ?, ?)';
            connection.query(insertQuery, [name, location, contact, admin || null], (err, result) => {
                if (err) {
                    console.error('Error adding branch:', err);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Database error while adding branch',
                        details: err.message 
                    });
                }
                
                res.json({ 
                    success: true,
                    branchId: result.insertId,
                    message: 'Branch added successfully'
                });
            });
        }
    });
});

app.delete('/delete-branch/:id', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const branchId = req.params.id;
    
    // Check if branch has any rides
    const checkQuery = 'SELECT COUNT(*) as ride_count FROM userride WHERE branch_id = ?';
    
    connection.query(checkQuery, [branchId], (err, results) => {
        if (err) {
            console.error('Error checking branch rides:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error',
                details: err.message 
            });
        }
        
        if (results[0].ride_count > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot delete branch with existing rides' 
            });
        }
        
        // Delete the branch
        const deleteQuery = 'DELETE FROM branches WHERE id = ?';
        connection.query(deleteQuery, [branchId], (err, result) => {
            if (err) {
                console.error('Error deleting branch:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error',
                    details: err.message 
                });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Branch not found' 
                });
            }
            
            res.json({ success: true });
        });
    });
});

// Add a new route to update branch details
app.put('/update-branch/:id', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const branchId = req.params.id;
    const { name, location, contact, admin } = req.body;
    
    // Check if new name already exists for other branches
    const checkQuery = 'SELECT id FROM branches WHERE name = ? AND id != ?';
    connection.query(checkQuery, [name, branchId], (err, results) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Branch name already exists' 
            });
        }
        
        // Update branch
        const updateQuery = 'UPDATE branches SET name = ?, location = ?, contact = ?, admin_id = ? WHERE id = ?';
        connection.query(updateQuery, [name, location, contact, admin || null, branchId], (err, result) => {
            if (err) {
                console.error('Error updating branch:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error',
                    details: err.message 
                });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Branch not found' 
                });
            }
            
            res.json({ success: true });
        });
    });
});

// Driver Management Routes
app.get('/get-driver-applications', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const query = 'SELECT * FROM driver_applications WHERE status = "pending" ORDER BY created_at DESC';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching driver applications:', err);
            return res.status(500).json({ 
                error: 'Database error',
                message: err.message 
            });
        }
        res.json(results);
    });
});

app.get('/get-drivers', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const query = `
        SELECT 
            id,
            name,
            mail,
            phone,
            license_number,
            vehicle_number,
            vehicle_type,
            COALESCE(rating, 0.00) as rating,
            availability_status,
            created_at
        FROM drivers 
        ORDER BY name
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching drivers:', err);
            return res.status(500).json({ 
                error: 'Database error',
                message: err.message 
            });
        }
        
        // Ensure rating is a number
        const drivers = results.map(driver => ({
            ...driver,
            rating: parseFloat(driver.rating) || 0.00
        }));
        
        res.json(drivers);
    });
});

app.post('/handle-driver-application/:id', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const applicationId = req.params.id;
    const { action, notes } = req.body;

    if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid action' 
        });
    }

    connection.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Transaction error' 
            });
        }

        // First get the application details
        connection.query('SELECT * FROM driver_applications WHERE id = ?', [applicationId], (err, applications) => {
            if (err) {
                return connection.rollback(() => {
                    res.status(500).json({ 
                        success: false, 
                        message: 'Error fetching application' 
                    });
                });
            }

            if (!applications || applications.length === 0) {
                return connection.rollback(() => {
                    res.status(404).json({ 
                        success: false, 
                        message: 'Application not found' 
                    });
                });
            }

            const application = applications[0];

            if (action === 'approve') {
                // Insert into drivers table
                const driverData = {
                    name: application.name,
                    mail: application.mail,
                    phone: application.phone,
                    license_number: application.license_number,
                    vehicle_number: application.vehicle_number,
                    vehicle_type: application.vehicle_type,
                    address: application.address,
                    rating: 0.00,
                    availability_status: 'avl'
                };

                connection.query('INSERT INTO drivers SET ?', driverData, (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            res.status(500).json({ 
                                success: false, 
                                message: 'Error creating driver account' 
                            });
                        });
                    }

                    updateApplicationStatus();
                });
            } else {
                updateApplicationStatus();
            }

            function updateApplicationStatus() {
                const updateQuery = `
                    UPDATE driver_applications 
                    SET status = ?, reviewed_at = NOW(), review_notes = ? 
                    WHERE id = ?
                `;
                const status = action === 'approve' ? 'approved' : 'rejected';

                connection.query(updateQuery, [status, notes || null, applicationId], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            res.status(500).json({ 
                                success: false, 
                                message: 'Error updating application status' 
                            });
                        });
                    }

                    connection.commit(err => {
                        if (err) {
                            return connection.rollback(() => {
                                res.status(500).json({ 
                                    success: false, 
                                    message: 'Error committing transaction' 
                                });
                            });
                        }

                        res.json({ 
                            success: true, 
                            message: `Application ${action}ed successfully` 
                        });
                    });
                });
            }
        });
    });
});

app.delete('/delete-driver/:id', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const driverId = req.params.id;

    // Check if driver has any ongoing rides
    connection.query(
        'SELECT COUNT(*) as ride_count FROM userride WHERE driverid = ? AND status IN ("accept", "ongoing")',
        [driverId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error checking driver rides' 
                });
            }

            if (results[0].ride_count > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Cannot delete driver with ongoing rides' 
                });
            }

            // Delete the driver
            connection.query('DELETE FROM drivers WHERE id = ?', [driverId], (err, result) => {
                if (err) {
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error deleting driver' 
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ 
                        success: false, 
                        message: 'Driver not found' 
                    });
                }

                res.json({ success: true });
            });
        }
    );
});

// Driver Application Routes
app.get('/driver-apply', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'driver-application.html'));
});

app.post('/submit-driver-application', (req, res) => {
    const {
        name,
        mail,
        phone,
        license_number,
        vehicle_number,
        vehicle_type,
        address
    } = req.body;

    // Validate required fields
    if (!name || !mail || !phone || !license_number || !vehicle_number || !vehicle_type || !address) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Phone number must be 10 digits'
        });
    }

    // Check for existing applications or approved drivers
    const checkQuery = `
        SELECT 
            CASE 
                WHEN EXISTS (SELECT 1 FROM driver_applications WHERE mail = ? OR phone = ? OR license_number = ? OR vehicle_number = ?) THEN 'application'
                WHEN EXISTS (SELECT 1 FROM drivers WHERE mail = ? OR phone = ? OR license_number = ? OR vehicle_number = ?) THEN 'driver'
                ELSE NULL 
            END as existing_record
    `;

    connection.query(checkQuery, [
        mail, phone, license_number, vehicle_number,
        mail, phone, license_number, vehicle_number
    ], (err, results) => {
        if (err) {
            console.error('Error checking existing records:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        const existingRecord = results[0].existing_record;
        if (existingRecord === 'application') {
            return res.status(400).json({
                success: false,
                message: 'An application with this email, phone, license number, or vehicle number already exists'
            });
        } else if (existingRecord === 'driver') {
            return res.status(400).json({
                success: false,
                message: 'A driver account with this email, phone, license number, or vehicle number already exists'
            });
        }

        // Insert new application
        const applicationData = {
            name,
            mail,
            phone,
            license_number,
            vehicle_number,
            vehicle_type,
            address,
            status: 'pending',
            created_at: new Date()
        };

        connection.query('INSERT INTO driver_applications SET ?', applicationData, (err, result) => {
            if (err) {
                console.error('Error submitting application:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error submitting application'
                });
            }

            res.json({
                success: true,
                message: 'Application submitted successfully'
            });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Test Database Connection
    connection.connect(err => {
        if (err) {
            console.error('Database connection failed:', err);
        } else {
            console.log('Connected to database successfully');
        }
    });
});