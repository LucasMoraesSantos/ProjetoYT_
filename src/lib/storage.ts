import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadUserFile(userId: string, category: 'videos' | 'thumbnails' | 'exports', file: File) {
  const path = `users/${userId}/${category}/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, path);
  const result = await uploadBytes(fileRef, file);
  const downloadUrl = await getDownloadURL(result.ref);
  return { path, downloadUrl };
}
