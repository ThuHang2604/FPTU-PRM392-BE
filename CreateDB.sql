-- 0. Drop & Create Database
DROP DATABASE IF EXISTS SalesAppDB;
CREATE DATABASE SalesAppDB;
USE SalesAppDB;

-- 1. Users
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20),
    Address TEXT,
    Role ENUM('customer', 'admin') DEFAULT 'customer',
    Status ENUM('active', 'inactive') DEFAULT 'active'
);

-- 2. Category
CREATE TABLE Category (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL
);

-- 3. Product
CREATE TABLE Product (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(255) NOT NULL,
    BriefDescription TEXT,
    FullDescription TEXT,
    TechnicalSpecification TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    ImageURL TEXT,
    CategoryID INT,
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

-- 4. Cart
CREATE TABLE Cart (
    CartID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    TotalPrice DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 5. CartItems
CREATE TABLE CartItems (
    CartItemID INT AUTO_INCREMENT PRIMARY KEY,
    CartID INT,
    ProductID INT,
    Quantity INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (CartID) REFERENCES Cart(CartID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

-- 6. Orders
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    OrderStatus ENUM('unpaid', 'paid', 'cancelled') DEFAULT 'unpaid',
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UserID INT,
    CartID INT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (CartID) REFERENCES Cart(CartID)
);

-- 7. OrderDetails
CREATE TABLE OrderDetails (
    OrderDetailID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    OrderID INT,
    Price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

-- 8. Payment (Updated for VNPay)
CREATE TABLE Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT UNIQUE,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PaymentStatus ENUM('pending', 'paid', 'failed') DEFAULT 'pending',

    -- VNPay-specific fields
    TransactionRef VARCHAR(50), -- vnp_TxnRef
    BankCode VARCHAR(50),       -- vnp_BankCode
    PayDate DATETIME,           -- vnp_PayDate (formatted from YYYYMMDDHHmmss)
    ResponseCode VARCHAR(10),   -- vnp_ResponseCode
    RawVnPayData TEXT,          -- optional: store raw VNPay response

    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

-- 9. Notification
CREATE TABLE Notification (
    NotificationID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Message TEXT,
    SentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsRead BOOLEAN DEFAULT FALSE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 10. ChatMessages
CREATE TABLE ChatMessages (
    ChatMessageID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Messages TEXT,
    SentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 11. StoreLocation
CREATE TABLE StoreLocation (
    LocationID INT AUTO_INCREMENT PRIMARY KEY,
    Latitude DECIMAL(10, 6),
    Longitude DECIMAL(10, 6),
    Address TEXT
);
