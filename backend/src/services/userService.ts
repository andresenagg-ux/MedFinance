export type UserRole = 'admin' | 'student';

export type UserPermission =
  | 'manage_videos'
  | 'manage_courses'
  | 'manage_users'
  | 'view_courses';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: UserPermission[];
};

const users: User[] = [
  {
    id: '1',
    name: 'Dra. Ana Souza',
    email: 'ana.souza@example.com',
    role: 'admin',
    permissions: ['manage_videos', 'manage_courses', 'manage_users', 'view_courses'],
  },
  {
    id: '2',
    name: 'Dr. Bruno Lima',
    email: 'bruno.lima@example.com',
    role: 'student',
    permissions: ['view_courses'],
  },
];

export class UserService {
  list(): User[] {
    return users;
  }

  findById(id: string): User | undefined {
    return users.find((user) => user.id === id);
  }
}

export const userService = new UserService();
