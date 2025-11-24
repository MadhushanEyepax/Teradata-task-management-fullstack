<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Project;
use Doctrine\ORM\EntityManagerInterface;

class ProjectTasksProvider implements ProviderInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $projectId = $uriVariables['id'] ?? null;

        if (!$projectId) {
            return null;
        }

        $project = $this->entityManager
            ->getRepository(Project::class)
            ->find($projectId);

        if (!$project) {
            return null;
        }

        // Return the tasks collection for this project
        return $project->getTasks()->toArray();
    }
}
