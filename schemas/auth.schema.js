//make schema D:\Github_repo\debate-arena\prisma\schema.prisma has
// model User {
//     id        String     @id @default(cuid())
//     name      String
//     email     String     @unique
//     image     String?
//     role      String?    // e.g., 'user', 'admin', 'moderator'
//     arguments Argument[]
//     votes     Vote[]
//     participants Participant[]
//     authoredDebates Debate[] @relation("UserAuthoredDebates")
//     createdAt DateTime   @default(now())
//     updatedAt DateTime   @updatedAt
//   }
