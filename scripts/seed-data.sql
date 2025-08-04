-- Seed data for the budget travel app

-- Insert sample routes
INSERT INTO routes (from_location, to_location, transport_mode, provider, price, duration_minutes, departure_time, arrival_time, co2_emissions) VALUES
-- New York to Boston routes
('New York', 'Boston', 'train', 'Amtrak', 45.00, 225, '08:30:00', '12:15:00', 22.0),
('New York', 'Boston', 'bus', 'Greyhound', 25.00, 270, '09:00:00', '13:30:00', 18.0),
('New York', 'Boston', 'flight', 'JetBlue', 120.00, 90, '10:15:00', '11:45:00', 85.0),
('New York', 'Boston', 'car', 'Rental Car', 35.00, 255, '08:00:00', '12:15:00', 45.0),

-- Boston to New York routes
('Boston', 'New York', 'train', 'Amtrak', 48.00, 230, '14:30:00', '18:20:00', 22.0),
('Boston', 'New York', 'bus', 'Greyhound', 28.00, 275, '15:00:00', '19:35:00', 18.0),
('Boston', 'New York', 'flight', 'Delta', 135.00, 95, '16:15:00', '17:50:00', 85.0),

-- New York to Philadelphia routes
('New York', 'Philadelphia', 'train', 'Amtrak', 35.00, 90, '09:00:00', '10:30:00', 15.0),
('New York', 'Philadelphia', 'bus', 'Megabus', 15.00, 120, '10:00:00', '12:00:00', 12.0),
('New York', 'Philadelphia', 'car', 'Rental Car', 25.00, 105, '09:00:00', '10:45:00', 28.0),

-- Philadelphia to Washington DC routes
('Philadelphia', 'Washington DC', 'train', 'Amtrak', 42.00, 105, '11:00:00', '12:45:00', 18.0),
('Philadelphia', 'Washington DC', 'bus', 'Greyhound', 22.00, 150, '12:00:00', '14:30:00', 15.0),
('Philadelphia', 'Washington DC', 'car', 'Rental Car', 30.00, 135, '11:30:00', '13:45:00', 32.0),

-- Los Angeles to San Francisco routes
('Los Angeles', 'San Francisco', 'flight', 'Southwest', 89.00, 75, '07:00:00', '08:15:00', 95.0),
('Los Angeles', 'San Francisco', 'bus', 'Greyhound', 35.00, 480, '08:00:00', '16:00:00', 45.0),
('Los Angeles', 'San Francisco', 'car', 'Rental Car', 55.00, 360, '08:00:00', '14:00:00', 85.0),

-- Chicago to Detroit routes
('Chicago', 'Detroit', 'train', 'Amtrak', 38.00, 330, '08:00:00', '13:30:00', 35.0),
('Chicago', 'Detroit', 'bus', 'Greyhound', 28.00, 300, '09:00:00', '14:00:00', 28.0),
('Chicago', 'Detroit', 'flight', 'American', 145.00, 85, '10:30:00', '11:55:00', 78.0),
('Chicago', 'Detroit', 'car', 'Rental Car', 42.00, 285, '09:00:00', '13:45:00', 65.0);
