-- Create admin user
INSERT INTO users (username, email, password, role, isActive, createdAt, updatedAt) 
VALUES ('admin', 'admin@clinicms.com', '$2b$10$rQZ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'ADMIN', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW(); 