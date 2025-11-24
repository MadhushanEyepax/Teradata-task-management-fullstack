<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Project;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class ProjectProcessor implements ProcessorInterface
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
        if (!$data instanceof Project) {
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        // For updates (PUT/PATCH), preserve existing created_at if not provided
        if ($operation instanceof \ApiPlatform\Metadata\Put || $operation instanceof \ApiPlatform\Metadata\Patch) {
            // Get the project ID from the URI
            $projectId = $uriVariables['id'] ?? null;

            if ($projectId && $data->getCreatedAt() === null) {
                // Fetch the existing created_at from database
                $connection = $this->entityManager->getConnection();
                $sql = 'SELECT created_at FROM projects WHERE id = :id';
                $stmt = $connection->prepare($sql);
                $result = $stmt->executeQuery(['id' => $projectId]);
                $existingCreatedAt = $result->fetchOne();

                // Set the existing created_at to the new data object
                if ($existingCreatedAt) {
                    $data->setCreatedAt(new \DateTime($existingCreatedAt));
                }
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
