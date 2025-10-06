import { randomUUID } from 'crypto';
import type { User } from './userService';

type CreateVideoInput = {
  title: string;
  description?: string;
  url: string;
  uploadedBy: User['id'];
};

export type Video = CreateVideoInput & {
  id: string;
  uploadedAt: string;
};

class VideoService {
  private videos: Video[] = [];

  list(): Video[] {
    return this.videos;
  }

  create(input: CreateVideoInput): Video {
    const video: Video = {
      id: randomUUID(),
      title: input.title,
      description: input.description,
      url: input.url,
      uploadedBy: input.uploadedBy,
      uploadedAt: new Date().toISOString(),
    };

    this.videos = [video, ...this.videos];

    return video;
  }

  clear(): void {
    this.videos = [];
  }
}

export const videoService = new VideoService();
