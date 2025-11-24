<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Add comprehensive sample data to all tables
 */
final class Version20251124074300 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add comprehensive sample data for users, projects, tasks, comments, and attachments';
    }

    public function up(Schema $schema): void
    {
        // Add more users (password is 'password123' hashed with bcrypt)
        $this->addSql("INSERT INTO users (username, email, password, created_at) VALUES 
            ('alice_wonder', 'alice@example.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', CURRENT_TIMESTAMP),
            ('bob_builder', 'bob@example.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', CURRENT_TIMESTAMP),
            ('charlie_dev', 'charlie@example.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', CURRENT_TIMESTAMP),
            ('diana_manager', 'diana@example.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', CURRENT_TIMESTAMP),
            ('eve_tester', 'eve@example.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', CURRENT_TIMESTAMP)
            ON CONFLICT (username) DO NOTHING");

        // Add more projects
        $this->addSql("INSERT INTO projects (name, description, status, owner_id, start_date, end_date, created_at) 
            SELECT 'E-commerce Platform', 'Building a modern e-commerce platform with React and Symfony', 'active', 
                   u.user_id, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '180 days', CURRENT_TIMESTAMP
            FROM users u WHERE u.username = 'admin' LIMIT 1");

        $this->addSql("INSERT INTO projects (name, description, status, owner_id, start_date, end_date, created_at) 
            SELECT 'Mobile App Development', 'Cross-platform mobile application for task management', 'active',
                   u.user_id, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '120 days', CURRENT_TIMESTAMP
            FROM users u WHERE u.username = 'diana_manager' LIMIT 1");

        $this->addSql("INSERT INTO projects (name, description, status, owner_id, start_date, end_date, created_at) 
            SELECT 'API Refactoring', 'Refactoring legacy API to modern RESTful standards', 'on_hold',
                   u.user_id, CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '90 days', CURRENT_TIMESTAMP
            FROM users u WHERE u.username = 'admin' LIMIT 1");

        // Add more tasks
        $this->addSql("INSERT INTO tasks (title, description, status, assigned_to, project_id, created_at) 
            SELECT 'Design Database Schema', 'Create comprehensive database schema for the e-commerce platform', 'completed',
                   u.user_id, p.id, CURRENT_TIMESTAMP
            FROM users u, projects p WHERE u.username = 'alice_wonder' AND p.name = 'E-commerce Platform' LIMIT 1");

        $this->addSql("INSERT INTO tasks (title, description, status, assigned_to, project_id, created_at) 
            SELECT 'Implement User Authentication', 'Build JWT-based authentication system with refresh tokens', 'in_progress',
                   u.user_id, p.id, CURRENT_TIMESTAMP
            FROM users u, projects p WHERE u.username = 'bob_builder' AND p.name = 'E-commerce Platform' LIMIT 1");

        $this->addSql("INSERT INTO tasks (title, description, status, assigned_to, project_id, created_at) 
            SELECT 'Create Product Catalog API', 'RESTful API endpoints for product management', 'pending',
                   u.user_id, p.id, CURRENT_TIMESTAMP
            FROM users u, projects p WHERE u.username = 'charlie_dev' AND p.name = 'E-commerce Platform' LIMIT 1");

        $this->addSql("INSERT INTO tasks (title, description, status, assigned_to, project_id, created_at) 
            SELECT 'Setup Payment Gateway', 'Integrate Stripe payment processing', 'pending',
                   u.user_id, p.id, CURRENT_TIMESTAMP
            FROM users u, projects p WHERE u.username = 'alice_wonder' AND p.name = 'E-commerce Platform' LIMIT 1");

        $this->addSql("INSERT INTO tasks (title, description, status, assigned_to, project_id, created_at) 
            SELECT 'Design Mobile UI/UX', 'Create mockups and prototypes for mobile application', 'in_progress',
                   u.user_id, p.id, CURRENT_TIMESTAMP
            FROM users u, projects p WHERE u.username = 'eve_tester' AND p.name = 'Mobile App Development' LIMIT 1");

        $this->addSql("INSERT INTO tasks (title, description, status, assigned_to, project_id, created_at) 
            SELECT 'Implement Push Notifications', 'Setup Firebase Cloud Messaging for push notifications', 'pending',
                   u.user_id, p.id, CURRENT_TIMESTAMP
            FROM users u, projects p WHERE u.username = 'bob_builder' AND p.name = 'Mobile App Development' LIMIT 1");

        // Add comments
        $this->addSql("INSERT INTO comments (content, author_id, task_id, created_at) 
            SELECT 'Great progress on the database schema! The normalization looks solid.', u.user_id, t.id, CURRENT_TIMESTAMP - INTERVAL '5 days'
            FROM users u, tasks t WHERE u.username = 'diana_manager' AND t.title = 'Design Database Schema' LIMIT 1");

        $this->addSql("INSERT INTO comments (content, author_id, task_id, created_at) 
            SELECT 'Should we consider using OAuth2 instead of plain JWT?', u.user_id, t.id, CURRENT_TIMESTAMP - INTERVAL '2 days'
            FROM users u, tasks t WHERE u.username = 'charlie_dev' AND t.title = 'Implement User Authentication' LIMIT 1");

        $this->addSql("INSERT INTO comments (content, author_id, task_id, created_at) 
            SELECT 'Working on implementing refresh token rotation for better security.', u.user_id, t.id, CURRENT_TIMESTAMP - INTERVAL '1 day'
            FROM users u, tasks t WHERE u.username = 'bob_builder' AND t.title = 'Implement User Authentication' LIMIT 1");

        $this->addSql("INSERT INTO comments (content, author_id, task_id, created_at) 
            SELECT 'Please ensure proper pagination is implemented for the product catalog.', u.user_id, t.id, CURRENT_TIMESTAMP - INTERVAL '3 hours'
            FROM users u, tasks t WHERE u.username = 'admin' AND t.title = 'Create Product Catalog API' LIMIT 1");

        $this->addSql("INSERT INTO comments (content, author_id, task_id, created_at) 
            SELECT 'The mockups look amazing! Love the color scheme.', u.user_id, t.id, CURRENT_TIMESTAMP - INTERVAL '1 hour'
            FROM users u, tasks t WHERE u.username = 'alice_wonder' AND t.title = 'Design Mobile UI/UX' LIMIT 1");

        // Add attachments
        $this->addSql("INSERT INTO attachments (filename, file_path, file_size, mime_type, task_id, uploaded_by, uploaded_at) 
            SELECT 'database-schema.pdf', '/uploads/attachments/database-schema.pdf', 245678, 'application/pdf',
                   t.id, u.user_id, CURRENT_TIMESTAMP - INTERVAL '20 days'
            FROM users u, tasks t WHERE u.username = 'alice_wonder' AND t.title = 'Design Database Schema' LIMIT 1");

        $this->addSql("INSERT INTO attachments (filename, file_path, file_size, mime_type, task_id, uploaded_by, uploaded_at) 
            SELECT 'authentication-flow.png', '/uploads/attachments/authentication-flow.png', 123456, 'image/png',
                   t.id, u.user_id, CURRENT_TIMESTAMP - INTERVAL '2 days'
            FROM users u, tasks t WHERE u.username = 'bob_builder' AND t.title = 'Implement User Authentication' LIMIT 1");

        $this->addSql("INSERT INTO attachments (filename, file_path, file_size, mime_type, task_id, uploaded_by, uploaded_at) 
            SELECT 'api-documentation.docx', '/uploads/attachments/api-documentation.docx', 567890, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                   t.id, u.user_id, CURRENT_TIMESTAMP - INTERVAL '1 day'
            FROM users u, tasks t WHERE u.username = 'charlie_dev' AND t.title = 'Create Product Catalog API' LIMIT 1");

        $this->addSql("INSERT INTO attachments (filename, file_path, file_size, mime_type, task_id, uploaded_by, uploaded_at) 
            SELECT 'mobile-mockups.fig', '/uploads/attachments/mobile-mockups.fig', 1234567, 'application/octet-stream',
                   t.id, u.user_id, CURRENT_TIMESTAMP - INTERVAL '1 hour'
            FROM users u, tasks t WHERE u.username = 'eve_tester' AND t.title = 'Design Mobile UI/UX' LIMIT 1");
    }

    public function down(Schema $schema): void
    {
        // Remove sample data in reverse order due to foreign key constraints
        $this->addSql("DELETE FROM attachments WHERE filename IN ('database-schema.pdf', 'authentication-flow.png', 'api-documentation.docx', 'mobile-mockups.fig')");
        $this->addSql("DELETE FROM comments WHERE content LIKE '%Great progress on the database schema%' OR content LIKE '%Should we consider using OAuth2%' OR content LIKE '%Working on implementing refresh token%' OR content LIKE '%Please ensure proper pagination%' OR content LIKE '%The mockups look amazing%'");
        $this->addSql("DELETE FROM tasks WHERE title IN ('Design Database Schema', 'Implement User Authentication', 'Create Product Catalog API', 'Setup Payment Gateway', 'Design Mobile UI/UX', 'Implement Push Notifications')");
        $this->addSql("DELETE FROM projects WHERE name IN ('E-commerce Platform', 'Mobile App Development', 'API Refactoring')");
        $this->addSql("DELETE FROM users WHERE username IN ('alice_wonder', 'bob_builder', 'charlie_dev', 'diana_manager', 'eve_tester')");
    }
}
