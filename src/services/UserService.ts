import prisma from '../lib/prisma';

export interface CreateUserInput {
  name: string;
  email: string;
  role: string;
}

class UserService {
  async createUser(data: CreateUserInput) {
    return prisma.user.create({
      data,
    });
  }

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
}

export default new UserService();
