<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Data Migration: Insert sample data for all tables
 */
final class Version20251124000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Insert sample data for users, projects, tasks, comments, and attachments';
    }

    public function up(Schema $schema): void
    {
        // Check if data already exists to avoid duplicates
        $this->addSql("DO $$
        BEGIN
            -- Insert sample users if they don't exist
            IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'john_doe') THEN
                INSERT INTO users (username, email, password, created_at) VALUES
                ('john_doe', 'john@example.com', '\$2y\$13\$hashed_password_1', CURRENT_TIMESTAMP),
                ('jane_smith', 'jane@example.com', '\$2y\$13\$hashed_password_2', CURRENT_TIMESTAMP);
            END IF;

            -- Insert sample projects if they don't exist
            IF NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Website Redesign') THEN
                INSERT INTO projects (name, description, status, owner_id, start_date, created_at) VALUES
                ('Website Redesign', 'Complete redesign of company website', 'active', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                ('Mobile App Development', 'Build iOS and Android apps', 'active', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                ('Database Migration', 'Migrate from MySQL to PostgreSQL', 'active', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            END IF;

            -- Insert sample tasks if they don't exist
            IF NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Task 1 for John') THEN
                INSERT INTO tasks (title, description, status, assigned_to, project_id, created_at) VALUES
                ('Task 1 for John', 'First task', 'pending', 1, 1, CURRENT_TIMESTAMP),
                ('Task 2 for John', 'Second task', 'completed', 1, 2, CURRENT_TIMESTAMP),
                ('Task 1 for Jane', 'Jane task', 'pending', 2, 1, CURRENT_TIMESTAMP);
            END IF;

            -- Insert sample comments if they don't exist
            IF NOT EXISTS (SELECT 1 FROM comments WHERE content = 'Started working on the homepage design') THEN
                INSERT INTO comments (task_id, author_id, content, created_at) VALUES
                (1, 1, 'Started working on the homepage design', CURRENT_TIMESTAMP),
                (1, 2, 'Looking good! Can we add more animations?', CURRENT_TIMESTAMP),
                (2, 2, 'API integration is complete', CURRENT_TIMESTAMP),
                (3, 1, 'Database schema is ready for review', CURRENT_TIMESTAMP);
            END IF;

            -- Insert sample attachments if they don't exist
            IF NOT EXISTS (SELECT 1 FROM attachments WHERE filename = 'homepage-mockup.png') THEN
                INSERT INTO attachments (task_id, uploaded_by, filename, file_path, mime_type, file_size, uploaded_at) VALUES
                (1, 1, 'homepage-mockup.png', '/uploads/homepage-mockup.png', 'image/png', 245678, CURRENT_TIMESTAMP),
                (1, 1, 'design-specs.pdf', '/uploads/design-specs.pdf', 'application/pdf', 1024000, CURRENT_TIMESTAMP),
                (2, 2, 'api-documentation.pdf', '/uploads/api-documentation.pdf', 'application/pdf', 512000, CURRENT_TIMESTAMP);
            END IF;
        END $$;");
    }

    public function down(Schema $schema): void
    {
        // Remove all sample data
        $this->addSql("DELETE FROM attachments WHERE filename IN ('homepage-mockup.png', 'design-specs.pdf', 'api-documentation.pdf')");
        $this->addSql("DELETE FROM comments WHERE content IN ('Started working on the homepage design', 'Looking good! Can we add more animations?', 'API integration is complete', 'Database schema is ready for review')");
        $this->addSql("DELETE FROM tasks WHERE title IN ('Task 1 for John', 'Task 2 for John', 'Task 1 for Jane')");
        $this->addSql("DELETE FROM projects WHERE name IN ('Website Redesign', 'Mobile App Development', 'Database Migration')");
        $this->addSql("DELETE FROM users WHERE username IN ('john_doe', 'jane_smith')");
    }
}
