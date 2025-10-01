import { UserService, UserRepository, User } from '../src/services/UserService';

describe('UserService', () => {
  const users: User[] = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' }
  ];

  const createRepository = (): UserRepository => ({
    async findById(id: string) {
      return users.find((user) => user.id === id) ?? null;
    },
    async list() {
      return users;
    }
  });

  it('returns a user when id exists', async () => {
    const service = new UserService(createRepository());

    await expect(service.getUserById('1')).resolves.toEqual(users[0]);
  });

  it('throws an error when id is empty', async () => {
    const service = new UserService(createRepository());

    await expect(service.getUserById('')).rejects.toThrow('User id is required');
  });

  it('throws an error when user is not found', async () => {
    const service = new UserService(createRepository());

    await expect(service.getUserById('3')).rejects.toThrow('User not found');
  });

  it('lists all users', async () => {
    const service = new UserService(createRepository());

    await expect(service.getUsers()).resolves.toEqual(users);
  });
});
