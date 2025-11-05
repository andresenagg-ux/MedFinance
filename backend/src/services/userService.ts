import type { DocumentData, Firestore } from 'firebase-admin/firestore';
import { getFirestore, isFirebaseConfigured } from '../config/firebase';
import { logger } from '../config/logger';

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

const fallbackUsers: User[] = [
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
  private readonly firestore: Firestore | null;

  constructor(
    options: {
      firestore?: Firestore | null;
    } = {}
  ) {
    if (options.firestore) {
      this.firestore = options.firestore;
    } else if (isFirebaseConfigured()) {
      try {
        this.firestore = getFirestore();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown Firebase initialization error';
        logger.warn('Failed to initialize Firebase. Falling back to static users.', { message });
        this.firestore = null;
      }
    } else {
      this.firestore = null;
    }

    if (!this.firestore) {
      logger.info('Using in-memory user list. Configure Firebase to enable persistent storage.');
    }
  }

  async list(): Promise<User[]> {
    if (!this.firestore) {
      return fallbackUsers;
    }

    const snapshot = await this.firestore.collection('users').get();

    return snapshot.docs
      .map((doc) => this.mapUser(doc.id, doc.data()))
      .filter((user): user is User => Boolean(user));
  }

  async findById(id: string): Promise<User | undefined> {
    if (!this.firestore) {
      return fallbackUsers.find((user) => user.id === id);
    }

    const doc = await this.firestore.collection('users').doc(id).get();

    if (!doc.exists) {
      return undefined;
    }

    return this.mapUser(doc.id, doc.data());
  }

  private mapUser(id: string, data: DocumentData | undefined): User | undefined {
    if (!data) {
      logger.warn('Skipping user document without data', { id });
      return undefined;
    }

    const { name, email, role, permissions } = data as Partial<User>;

    if (typeof name !== 'string' || name.trim() === '') {
      logger.warn('Skipping user without a valid name', { id });
      return undefined;
    }

    if (typeof email !== 'string' || email.trim() === '') {
      logger.warn('Skipping user without a valid email', { id });
      return undefined;
    }

    if (role !== 'admin' && role !== 'student') {
      logger.warn('Skipping user with unsupported role', { id, role });
      return undefined;
    }

    const validPermissions: UserPermission[] = Array.isArray(permissions)
      ? (permissions as unknown[])
          .filter((permission): permission is UserPermission =>
            typeof permission === 'string' &&
            ['manage_videos', 'manage_courses', 'manage_users', 'view_courses'].includes(permission)
          )
      : [];

    return {
      id,
      name: name.trim(),
      email: email.trim(),
      role,
      permissions: validPermissions,
    };
  }
}

export const userService = new UserService();
