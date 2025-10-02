export type UserRole = 'admin' | 'student';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

const users: User[] = [
  { id: '1', name: 'Dra. Ana Souza', email: 'ana.souza@example.com', role: 'admin' },
  { id: '2', name: 'Dr. Bruno Lima', email: 'bruno.lima@example.com', role: 'student' },
];

export class UserService {
  list(): User[] {
    return users;
  }
}

export const userService = new UserService();
