USE SalesAppDB;

-- 1. Users
INSERT INTO Users (Username, PasswordHash, Email, PhoneNumber, Address, Role, Status) VALUES
('jane_admin', '$2b$10$mXdUG7doXZ5d1Cf2OLwq3OvTjPWGCAmMxLlCP9v6OlY4dhyV8lvou', 'admin@example.com', '0987654321', '456 Admin Rd, NY', 'admin', 'active'),
('john_doe', '$2b$10$mXdUG7doXZ5d1Cf2OLwq3OvTjPWGCAmMxLlCP9v6OlY4dhyV8lvou', 'john@example.com', '1234567890', '123 Main St, NY', 'customer', 'active');

-- 2. Categories
INSERT INTO Category (CategoryName) VALUES
('Skincare'),
('Makeup'),
('Hair Care');

-- 3. Products
-- Sample products for Skincare (CategoryID = 1)
INSERT INTO Product (ProductName, BriefDescription, FullDescription, TechnicalSpecification, Price, ImageURL, CategoryID) VALUES
('Green Tea Cleanser', 'Gentle cleanser with green tea', 'Removes dirt and oil while soothing the skin with natural green tea extract.', '150ml tube, for oily and sensitive skin types', 13.50, 'https://example.com/images/greentea_cleanser.jpg', 1),
('Hyaluronic Acid Toner', 'Moisture-rich facial toner', 'Balances skin pH and preps for serums and moisturizers', '120ml bottle, alcohol-free formula', 18.00, 'https://example.com/images/hyaluronic_toner.jpg', 1);

-- Sample products for Makeup (CategoryID = 2)
INSERT INTO Product (ProductName, BriefDescription, FullDescription, TechnicalSpecification, Price, ImageURL, CategoryID) VALUES
('Mascara Volume Boost', 'Volumizing waterproof mascara', 'Lifts and thickens lashes without clumping', '10ml, waterproof, long-lasting', 14.75, 'https://example.com/images/mascara_boost.jpg', 2),
('Blush Coral Pink', 'Smooth powder blush', 'Adds natural glow with coral tones', '5g compact, includes mirror', 11.20, 'https://example.com/images/blush_coral.jpg', 2),
('Eyeshadow Palette - Nude', 'Neutral eyeshadow collection', '12 matte and shimmer shades for day-to-night looks', 'Palette with mirror and brush', 22.00, 'https://example.com/images/nude_palette.jpg', 2);

-- Sample products for Hair Care (CategoryID = 3)
INSERT INTO Product (ProductName, BriefDescription, FullDescription, TechnicalSpecification, Price, ImageURL, CategoryID) VALUES
('Coconut Repair Shampoo', 'Moisturizing shampoo with coconut oil', 'Repairs dry and damaged hair', '250ml bottle, sulfate-free', 10.99, 'https://example.com/images/coconut_shampoo.jpg', 3),
('Hair Mask Keratin Repair', 'Deep repair mask with keratin', 'Strengthens weak and brittle hair', '200ml tub, use once per week', 16.80, 'https://example.com/images/keratin_mask.jpg', 3),
('Dry Shampoo Spray', 'No-wash shampoo spray', 'Instantly refreshes hair without water', '150ml spray bottle, floral scent', 9.50, 'https://example.com/images/dry_shampoo.jpg', 3);

-- 4. Cart
INSERT INTO Cart (UserID, TotalPrice) VALUES
(1, 0); -- john_doe's cart

-- 5. CartItems
INSERT INTO CartItems (CartID, ProductID, Quantity, Price) VALUES
(1, 1, 2, 15.99),
(1, 3, 1, 20.00);

-- 6. Orders
INSERT INTO Orders (OrderStatus, OrderDate, UserID, CartID) VALUES
('paid', NOW(), 1, 1);

-- 7. OrderDetails
INSERT INTO OrderDetails (ProductID, OrderID, Price) VALUES
(1, 1, 15.99),
(3, 1, 20.00);

-- 8. Payment
INSERT INTO Payment (OrderID, Amount, PaymentDate, PaymentStatus) VALUES
(1, 51.98, NOW(), 'paid');

-- 9. Notification
INSERT INTO Notification (UserID, Message, SentAt, IsRead, CreatedAt) VALUES
(1, 'Your order has been paid successfully!', NOW(), FALSE, NOW()),
(1, 'Your products are being shipped.', NOW(), FALSE, NOW());

-- 10. ChatMessages
INSERT INTO ChatMessages (UserID, Messages, SentAt) VALUES
(1, 'Hi, I have a question about my order.', NOW()),
(2, 'Sure, how can I assist you?', NOW());

-- 11. StoreLocation
INSERT INTO StoreLocation (Latitude, Longitude, Address) VALUES
(40.712776, -74.005974, 'New York Main Store'),
(34.052235, -118.243683, 'Los Angeles Branch');
