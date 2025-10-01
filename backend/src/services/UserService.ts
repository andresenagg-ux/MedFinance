export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  list(): Promise<User[]>;
}

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getUserById(id: string): Promise<User> {
    if (!id) {
      throw new Error('User id is required');
    }

    const user = await this.repository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getUsers(): Promise<User[]> {
    return this.repository.list();
  }
}
