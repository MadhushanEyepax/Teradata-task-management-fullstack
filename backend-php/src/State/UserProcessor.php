<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class UserProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private EntityManagerInterface $entityManager
    )
    {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof User) {
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        // For updates (PUT/PATCH), preserve existing password if not provided
        if ($operation instanceof \ApiPlatform\Metadata\Put || $operation instanceof \ApiPlatform\Metadata\Patch) {
            // Get the user ID from the URI (e.g., /api/users/1 -> id = 1)
            $userId = $uriVariables['id'] ?? null;

            if ($userId && (empty($data->getPassword()) || $data->getPassword() === null)) {
                // Fetch the existing user from database (using a separate connection to avoid conflicts)
                $connection = $this->entityManager->getConnection();
                $sql = 'SELECT password FROM users WHERE user_id = :id';
                $stmt = $connection->prepare($sql);
                $result = $stmt->executeQuery(['id' => $userId]);
                $existingPassword = $result->fetchOne();

                // Set the existing password to the new data object
                if ($existingPassword) {
                    $data->setPassword($existingPassword);
                }
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
