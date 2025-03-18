
import { ProductScreenshot, ProductVideo, ProductTechnology } from '@/types/product';

export function formatScreenshots(screenshots: ProductScreenshot[]) {
  return screenshots.map(screenshot => ({
    title: screenshot.title || undefined,
    image_url: screenshot.image_url,
    description: screenshot.description || undefined,
  }));
}

export function formatVideos(videos: ProductVideo[]) {
  return videos.map(video => ({
    title: video.title || undefined,
    video_url: video.video_url,
  }));
}

export function formatTechnologies(technologies: ProductTechnology[]) {
  return technologies.map(tech => tech.technology_name);
}
