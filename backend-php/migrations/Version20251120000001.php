<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251120000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create users and tasks tables';
    }

    public function up(Schema $schema): void
    {
        // Create users table
        $this->addSql('CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )');

        // Create tasks table with user_id foreign key
        $this->addSql('CREATE TABLE tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT DEFAULT NULL,
            status VARCHAR(20) NOT NULL DEFAULT \'pending\',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER NOT NULL,
            CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )');

        // Create index on user_id for better performance
        $this->addSql('CREATE INDEX idx_tasks_user_id ON tasks(user_id)');
    }

    public function down(Schema $schema): void
    {
        // Drop tasks table first (has foreign key)
        $this->addSql('DROP TABLE IF EXISTS tasks');

        // Drop users table
        $this->addSql('DROP TABLE IF EXISTS users');
    }
}
