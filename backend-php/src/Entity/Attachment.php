<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use App\Repository\AttachmentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AttachmentRepository::class)]
#[ORM\Table(name: 'attachments')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Delete()
    ],
    normalizationContext: ['groups' => ['attachment:read']],
    denormalizationContext: ['groups' => ['attachment:write']],
    paginationEnabled: true,
    paginationItemsPerPage: 50
)]
class Attachment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    #[Groups(['attachment:read', 'task:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Assert\NotBlank(message: 'Filename is required')]
    #[Groups(['attachment:read', 'attachment:write', 'task:read'])]
    private ?string $filename = null;

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Assert\NotBlank(message: 'File path is required')]
    #[Groups(['attachment:read', 'attachment:write'])]
    private ?string $filePath = null;

    #[ORM\Column(type: Types::STRING, length: 100)]
    #[Groups(['attachment:read', 'attachment:write', 'task:read'])]
    private ?string $mimeType = null;

    #[ORM\Column(type: Types::INTEGER)]
    #[Groups(['attachment:read', 'attachment:write', 'task:read'])]
    private ?int $fileSize = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['attachment:read'])]
    private ?\DateTimeInterface $uploadedAt = null;

    #[ORM\ManyToOne(targetEntity: Task::class, inversedBy: 'attachments')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull(message: 'Task is required')]
    #[Groups(['attachment:read', 'attachment:write'])]
    private ?Task $task = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'uploaded_by', referencedColumnName: 'user_id', nullable: false)]
    #[Assert\NotNull(message: 'Uploader is required')]
    #[Groups(['attachment:read', 'attachment:write', 'task:read'])]
    private ?User $uploadedBy = null;

    #[ORM\PrePersist]
    public function setUploadedAtValue(): void
    {
        $this->uploadedAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(string $filename): static
    {
        $this->filename = $filename;
        return $this;
    }

    public function getFilePath(): ?string
    {
        return $this->filePath;
    }

    public function setFilePath(string $filePath): static
    {
        $this->filePath = $filePath;
        return $this;
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(string $mimeType): static
    {
        $this->mimeType = $mimeType;
        return $this;
    }

    public function getFileSize(): ?int
    {
        return $this->fileSize;
    }

    public function setFileSize(int $fileSize): static
    {
        $this->fileSize = $fileSize;
        return $this;
    }

    public function getUploadedAt(): ?\DateTimeInterface
    {
        return $this->uploadedAt;
    }

    public function setUploadedAt(\DateTimeInterface $uploadedAt): static
    {
        $this->uploadedAt = $uploadedAt;
        return $this;
    }

    public function getTask(): ?Task
    {
        return $this->task;
    }

    public function setTask(?Task $task): static
    {
        $this->task = $task;
        return $this;
    }

    public function getUploadedBy(): ?User
    {
        return $this->uploadedBy;
    }

    public function setUploadedBy(?User $uploadedBy): static
    {
        $this->uploadedBy = $uploadedBy;
        return $this;
    }
}
