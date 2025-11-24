<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\UserRepository;
use App\State\UserTasksProvider;
use App\State\UserProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: 'users')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(
            validationContext: ['groups' => ['Default', 'user:create']],
            denormalizationContext: ['groups' => ['user:write', 'user:create']]
        ),
        new Put(),
        new Delete(),
        new Get(
            uriTemplate: '/users/{id}/tasks',
            normalizationContext: ['groups' => ['user:read', 'task:read']],
            provider: UserTasksProvider::class
        )
    ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']],
    processor: UserProcessor::class,
    paginationEnabled: true,
    paginationItemsPerPage: 10
)]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    #[Groups(['user:read'])]
    private ?int $user_id = null;

    #[ORM\Column(type: Types::STRING, length: 100, unique: true)]
    #[Assert\NotBlank(message: 'Username is required')]
    #[Assert\Length(
        max: 100,
        maxMessage: 'Username cannot be longer than {{ limit }} characters'
    )]
    #[Groups(['user:read', 'user:write', 'task:read'])]
    private ?string $username = null;

    #[ORM\Column(type: Types::STRING, length: 255, unique: true)]
    #[Assert\NotBlank(message: 'Email is required')]
    #[Assert\Email(message: 'The email {{ value }} is not a valid email')]
    #[Groups(['user:read', 'user:write'])]
    private ?string $email = null;

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Assert\NotBlank(message: 'Password is required', groups: ['user:create'])]
    #[Groups(['user:create'])]
    private ?string $password = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['user:read'])]
    private ?\DateTimeInterface $created_at = null;

    #[ORM\OneToMany(targetEntity: Task::class, mappedBy: 'assignedTo', orphanRemoval: true)]
    #[Groups(['user:read'])]
    private Collection $assignedTasks;

    #[ORM\OneToMany(targetEntity: Project::class, mappedBy: 'owner', orphanRemoval: true)]
    #[Groups(['user:read'])]
    private Collection $ownedProjects;

    public function __construct()
    {
        $this->assignedTasks = new ArrayCollection();
        $this->ownedProjects = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->created_at = new \DateTime();
    }

    public function getUserId(): ?int
    {
        return $this->user_id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    /**
     * @return Collection<int, Task>
     */
    public function getAssignedTasks(): Collection
    {
        return $this->assignedTasks;
    }

    public function addAssignedTask(Task $task): static
    {
        if (!$this->assignedTasks->contains($task)) {
            $this->assignedTasks->add($task);
            $task->setAssignedTo($this);
        }
        return $this;
    }

    public function removeAssignedTask(Task $task): static
    {
        if ($this->assignedTasks->removeElement($task)) {
            if ($task->getAssignedTo() === $this) {
                $task->setAssignedTo(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, Project>
     */
    public function getOwnedProjects(): Collection
    {
        return $this->ownedProjects;
    }

    public function addOwnedProject(Project $project): static
    {
        if (!$this->ownedProjects->contains($project)) {
            $this->ownedProjects->add($project);
            $project->setOwner($this);
        }
        return $this;
    }

    public function removeOwnedProject(Project $project): static
    {
        if ($this->ownedProjects->removeElement($project)) {
            if ($project->getOwner() === $this) {
                $project->setOwner(null);
            }
        }
        return $this;
    }
}
