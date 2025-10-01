import axios from 'axios';

type UserProfile = 'STUDENT' | 'RECENT_GRAD' | 'SPECIALIST';

type ProfileResponse = {
  userId: string;
  profile: UserProfile;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
});

export async function saveUserProfile(userId: string, profile: UserProfile) {
  const { data } = await api.post<ProfileResponse>('/users/profile', {
    userId,
    profile,
  });

  return data;
}

export async function fetchUserProfile(userId: string) {
  try {
    const { data } = await api.get<ProfileResponse>(`/users/profile/${userId}`);
    return data;
  } catch (error: unknown) {
    return null;
  }
}
