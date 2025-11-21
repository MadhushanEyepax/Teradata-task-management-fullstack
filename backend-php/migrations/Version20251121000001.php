<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration for adding Projects, Comments, and Attachments tables
 */
final class Version20251121000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add projects, comments, and attachments tables with relationships';
    }

    public function up(Schema $schema): void
    {
        // Update tasks table: rename user_id column to assigned_to and add project_id
        $this->addSql('ALTER TABLE tasks RENAME COLUMN user_id TO assigned_to');
        $this->addSql('ALTER TABLE tasks ADD COLUMN project_id INTEGER');

        // Create projects table
        $this->addSql('CREATE TABLE projects (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT DEFAULT NULL,
            status VARCHAR(20) NOT NULL DEFAULT \'active\',
            start_date TIMESTAMP DEFAULT NULL,
            end_date TIMESTAMP DEFAULT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            owner_id INTEGER NOT NULL,
            CONSTRAINT fk_projects_owner FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE
        )');

        // Create comments table
        $this->addSql('CREATE TABLE comments (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT NULL,
            task_id INTEGER NOT NULL,
            author_id INTEGER NOT NULL,
            CONSTRAINT fk_comments_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
            CONSTRAINT fk_comments_author FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
        )');

        // Create attachments table
        $this->addSql('CREATE TABLE attachments (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            file_path VARCHAR(255) NOT NULL,
            mime_type VARCHAR(100) DEFAULT NULL,
            file_size INTEGER DEFAULT NULL,
            uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            task_id INTEGER NOT NULL,
            uploaded_by INTEGER NOT NULL,
            CONSTRAINT fk_attachments_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
            CONSTRAINT fk_attachments_uploader FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE CASCADE
        )');

        // Add foreign key constraint for project_id in tasks table (after projects table is created)
        $this->addSql('ALTER TABLE tasks ADD CONSTRAINT fk_tasks_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE');

        // Create indexes for better performance
        $this->addSql('CREATE INDEX idx_projects_owner_id ON projects(owner_id)');
        $this->addSql('CREATE INDEX idx_tasks_project_id ON tasks(project_id)');
        $this->addSql('CREATE INDEX idx_comments_task_id ON comments(task_id)');
        $this->addSql('CREATE INDEX idx_comments_author_id ON comments(author_id)');
        $this->addSql('CREATE INDEX idx_attachments_task_id ON attachments(task_id)');
        $this->addSql('CREATE INDEX idx_attachments_uploaded_by ON attachments(uploaded_by)');
    }

    public function down(Schema $schema): void
    {
        // Drop tables in reverse order (respect foreign key constraints)
        $this->addSql('DROP TABLE IF EXISTS attachments');
        $this->addSql('DROP TABLE IF EXISTS comments');

        // Remove project_id foreign key and column from tasks
        $this->addSql('ALTER TABLE tasks DROP CONSTRAINT IF EXISTS fk_tasks_project');
        $this->addSql('ALTER TABLE tasks DROP COLUMN IF EXISTS project_id');

        // Drop projects table
        $this->addSql('DROP TABLE IF EXISTS projects');

        // Revert tasks table column rename
        $this->addSql('ALTER TABLE tasks RENAME COLUMN assigned_to TO user_id');
    }
}
