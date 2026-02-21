import mysql.connector
import bcrypt

# Database connection details
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',
    'database': 'dxassist'
}

# Test user details
test_email = 'test@dxassist.com'
test_password = 'Test@123'
test_name = 'Test User'
test_mobile = '9876543210'

try:
    # Connect to database
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    print("✅ Connected to database")
    
    # Generate hashed password
    salt = bcrypt.gensalt(10)
    hashed_password = bcrypt.hashpw(test_password.encode('utf-8'), salt).decode('utf-8')
    print(f"✅ Password hashed")
    
    # Check if user already exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (test_email,))
    existing_user = cursor.fetchone()
    
    if existing_user:
        print(f"⚠️  User already exists with ID: {existing_user[0]}")
        print(f"📧 Email: {test_email}")
        print(f"🔑 Password: {test_password}")
    else:
        # Insert test user
        cursor.execute(
            "INSERT INTO users (name, email, mobile, password) VALUES (%s, %s, %s, %s)",
            (test_name, test_email, test_mobile, hashed_password)
        )
        conn.commit()
        print(f"✅ Test user created successfully!")
        print(f"📧 Email: {test_email}")
        print(f"🔑 Password: {test_password}")
        print(f"👤 Name: {test_name}")
    
    cursor.close()
    conn.close()
    print("\n✅ Database connection closed")

except Exception as e:
    print(f"❌ Error: {e}")
