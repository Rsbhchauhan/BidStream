INSERT INTO users (id, username, email, password_hash) VALUES ('550e8400-e29b-41d4-a716-446655440000', 'seller1', 'seller@test.com', 'password');

INSERT INTO auction_items (title, description, image_url, starting_price, current_highest_bid, start_time, end_time, status, seller_id) 
VALUES ('Vintage Rolex Daytona', 'A beautiful vintage Rolex Daytona from 1980 in mint condition.', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80', 5000.0, 5000.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1' MINUTE, 'ACTIVE', '550e8400-e29b-41d4-a716-446655440000');
