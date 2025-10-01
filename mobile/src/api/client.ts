import axios from 'axios';

type Profile = 'STUDENT' | 'RECENT_GRAD' | 'SPECIALIST';

type ProfileResponse = {
  userId: string;
  profile: Profile;
};

export async function saveUserProfile(baseUrl: string, userId: string, profile: Profile) {
  const api = axios.create({ baseURL: baseUrl });
  const { data } = await api.post<ProfileResponse>('/users/profile', {
    userId,
    profile,
  });
  return data;
}

export async function fetchUserProfile(baseUrl: string, userId: string) {
  const api = axios.create({ baseURL: baseUrl });
  try {
    const { data } = await api.get<ProfileResponse>(`/users/profile/${userId}`);
    return data;
  } catch (error) {
    return null;
  }
}
