-- ========================================
-- Table: User
-- ========================================
CREATE TABLE [User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(191) NOT NULL,
    [email] NVARCHAR(191) NOT NULL,
    [password] NVARCHAR(191) NOT NULL,
    [profileImage] NVARCHAR(191) NULL,
    [role] NVARCHAR(191) NOT NULL DEFAULT 'user',
    [createdAt] DATETIME2(3) NOT NULL DEFAULT SYSDATETIME(),
    [updatedAt] DATETIME2(3) NOT NULL,

    CONSTRAINT [PK_User] PRIMARY KEY ([id]),
    CONSTRAINT [User_email_key] UNIQUE ([email])
);

-- ========================================
-- Table: Post
-- ========================================
CREATE TABLE [Post] (
    [id] INT NOT NULL IDENTITY(1,1),
    [authorId] INT NOT NULL,
    [content] NVARCHAR(191) NOT NULL,
    [imageUrl] NVARCHAR(191) NULL,
    [createdAt] DATETIME2(3) NOT NULL DEFAULT SYSDATETIME(),
    [updatedAt] DATETIME2(3) NOT NULL,

    CONSTRAINT [PK_Post] PRIMARY KEY ([id])
);

CREATE INDEX [Post_authorId_createdAt_idx] ON [Post] ([authorId], [createdAt]);
CREATE INDEX [Post_createdAt_idx] ON [Post] ([createdAt]);

-- ========================================
-- Table: Comment
-- ========================================
CREATE TABLE [Comment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [postId] INT NOT NULL,
    [authorId] INT NOT NULL,
    [text] NVARCHAR(191) NOT NULL,
    [createdAt] DATETIME2(3) NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT [PK_Comment] PRIMARY KEY ([id])
);

CREATE INDEX [Comment_postId_createdAt_idx] ON [Comment] ([postId], [createdAt]);

-- ========================================
-- Table: ChatMessage
-- ========================================
CREATE TABLE [ChatMessage] (
    [id] INT NOT NULL IDENTITY(1,1),
    [postId] INT NOT NULL,
    [senderId] INT NOT NULL,
    [message] NVARCHAR(191) NOT NULL,
    [createdAt] DATETIME2(3) NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT [PK_ChatMessage] PRIMARY KEY ([id])
);

CREATE INDEX [ChatMessage_postId_createdAt_idx] ON [ChatMessage] ([postId], [createdAt]);

-- ========================================
-- Foreign Keys
-- ========================================
ALTER TABLE [Post]
ADD CONSTRAINT [Post_authorId_fkey]
FOREIGN KEY ([authorId]) REFERENCES [User]([id])
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE [Comment]
ADD CONSTRAINT [Comment_postId_fkey]
FOREIGN KEY ([postId]) REFERENCES [Post]([id])
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE [Comment]
ADD CONSTRAINT [Comment_authorId_fkey]
FOREIGN KEY ([authorId]) REFERENCES [User]([id])
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE [ChatMessage]
ADD CONSTRAINT [ChatMessage_postId_fkey]
FOREIGN KEY ([postId]) REFERENCES [Post]([id])
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE [ChatMessage]
ADD CONSTRAINT [ChatMessage_senderId_fkey]
FOREIGN KEY ([senderId]) REFERENCES [User]([id])
ON DELETE CASCADE
ON UPDATE CASCADE;
