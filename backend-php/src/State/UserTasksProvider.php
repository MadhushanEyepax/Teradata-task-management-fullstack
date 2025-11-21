<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserTasksProvider implements ProviderInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $userId = $uriVariables['id'] ?? null;

        if (!$userId) {
            return null;
        }

        // Fetch the user with their tasks
        $user = $this->entityManager
            ->getRepository(User::class)
            ->find($userId);

        return $user;
    }
}
