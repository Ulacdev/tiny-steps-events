datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Event {
  id         String  @id @default(cuid())
  name       String
  date       DateTime?
  createdAt  DateTime @default(now())
  attendees  Int      @default(0)
  status     String?
  type       String?
  archived   Boolean  @default(false)
}

model Participant {
  id        String @id @default(cuid())
  name      String
  email     String
  phone     String?
  eventId   String?
  status    String
  createdAt DateTime @default(now())
}

model User {
  id        String @id @default(cuid())
  name      String
  email     String @unique
  role      String
  status    String
  createdAt DateTime @default(now())
}

model FinancialRecord {
  id        String  @id @default(cuid())
  type      String
  eventName String
  amount    Float
  category  String
  status    String
  date      DateTime
}

model Archive {
  id        String @id @default(cuid())
  eventId   String
  archivedAt DateTime @default(now())
  // store snapshot data if needed (Json)
  data      Json?
}

model AuditTrail {
  id        String @id @default(cuid())
  action    String
  actor     String?
  detail    String?
  createdAt DateTime @default(now())
}

model Settings {
  id    String @id @default(cuid())
  key   String @unique
  value String
}