<?php

namespace App\Repository;

use App\Entity\Task;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Task>
 */
class TaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Task::class);
    }

    /**
     * Find tasks by status
     *
     * @param string $status
     * @return Task[]
     */
    public function findByStatus(string $status): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.status = :status')
            ->setParameter('status', $status)
            ->orderBy('t.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find tasks by user ID
     *
     * @param int $userId
     * @return Task[]
     */
    public function findByUserId(int $userId): array
    {
        return $this->createQueryBuilder('t')
            ->join('t.user', 'u')
            ->andWhere('u.userId = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('t.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find tasks by user ID and status
     *
     * @param int $userId
     * @param string $status
     * @return Task[]
     */
    public function findByUserIdAndStatus(int $userId, string $status): array
    {
        return $this->createQueryBuilder('t')
            ->join('t.user', 'u')
            ->andWhere('u.userId = :userId')
            ->andWhere('t.status = :status')
            ->setParameter('userId', $userId)
            ->setParameter('status', $status)
            ->orderBy('t.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
