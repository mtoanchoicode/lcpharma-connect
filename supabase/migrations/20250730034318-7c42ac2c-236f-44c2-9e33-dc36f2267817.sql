-- Add more sample products
INSERT INTO products (id, name, name_vi, description, description_vi, price, image, category, category_vi, in_stock, requires_prescription) VALUES
('5', 'Aspirin 100mg', 'Aspirin 100mg', 'Blood thinner for heart health', 'Thuốc chống đông máu bảo vệ tim mạch', 85000, 'https://images.unsplash.com/photo-1550572017-cb0be8b24d55?w=400', 'Cardiovascular', 'Tim mạch', true, false),
('6', 'Metformin 500mg', 'Metformin 500mg', 'Diabetes medication for blood sugar control', 'Thuốc điều trị tiểu đường kiểm soát đường huyết', 45000, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400', 'Diabetes', 'Tiểu đường', true, true),
('7', 'Cetirizine 10mg', 'Cetirizine 10mg', 'Antihistamine for allergies', 'Thuốc chống dị ứng', 32000, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 'Allergy', 'Dị ứng', true, false),
('8', 'Ibuprofen 400mg', 'Ibuprofen 400mg', 'Anti-inflammatory pain reliever', 'Thuốc giảm đau chống viêm', 38000, 'https://images.unsplash.com/photo-1550572017-cb0be8b24d55?w=400', 'Pain Relief', 'Thuốc giảm đau', true, false),
('9', 'Omeprazole 20mg', 'Omeprazole 20mg', 'Proton pump inhibitor for acid reflux', 'Thuốc điều trị trào ngược dạ dày', 65000, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400', 'Gastroenterology', 'Tiêu hóa', true, true),
('10', 'Losartan 50mg', 'Losartan 50mg', 'Blood pressure medication', 'Thuốc điều trị huyết áp cao', 78000, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 'Cardiovascular', 'Tim mạch', true, true),
('11', 'Calcium + Vitamin D3', 'Canxi + Vitamin D3', 'Bone health supplement', 'Thực phẩm bổ sung tốt cho xương', 125000, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', 'Supplements', 'Thực phẩm bổ sung', true, false),
('12', 'Probiotics Complex', 'Men vi sinh tổng hợp', 'Digestive health supplement', 'Thực phẩm bổ sung hỗ trợ tiêu hóa', 285000, 'https://images.unsplash.com/photo-1550572017-cb0be8b24d55?w=400', 'Supplements', 'Thực phẩm bổ sung', true, false),
('13', 'Cough Syrup', 'Siro ho', 'Expectorant cough syrup', 'Siro ho long đờm', 42000, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400', 'Respiratory', 'Hô hấp', true, false),
('14', 'Eye Drops', 'Thuốc nhỏ mắt', 'Lubricating eye drops', 'Thuốc nhỏ mắt dưỡng ẩm', 55000, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 'Ophthalmology', 'Nhãn khoa', true, false),
('15', 'Multivitamin', 'Vitamin tổng hợp', 'Complete daily vitamin supplement', 'Vitamin tổng hợp hàng ngày', 195000, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', 'Vitamins', 'Vitamin', true, false);

-- Add product availability data
INSERT INTO product_branch_availability (product_id, branch_id, quantity) VALUES
('5', 'branch1', 50), ('5', 'branch2', 30),
('6', 'branch1', 25), ('6', 'branch2', 40),
('7', 'branch1', 80), ('7', 'branch2', 60),
('8', 'branch1', 45), ('8', 'branch2', 35),
('9', 'branch1', 20), ('9', 'branch2', 15),
('10', 'branch1', 30), ('10', 'branch2', 25),
('11', 'branch1', 55), ('11', 'branch2', 45),
('12', 'branch1', 40), ('12', 'branch2', 30),
('13', 'branch1', 70), ('13', 'branch2', 50),
('14', 'branch1', 60), ('14', 'branch2', 40),
('15', 'branch1', 85), ('15', 'branch2', 75);