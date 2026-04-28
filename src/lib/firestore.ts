import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { Channel } from '../types';

export async function listChannels(userId: string): Promise<Channel[]> {
  const q = query(collection(db, 'channels'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Channel, 'id'>) }));
}

export async function createChannel(userId: string, payload: Omit<Channel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  return addDoc(collection(db, 'channels'), {
    ...payload,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateChannel(channelId: string, patch: Partial<Channel>) {
  await updateDoc(doc(db, 'channels', channelId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteChannel(channelId: string) {
  await deleteDoc(doc(db, 'channels', channelId));
}
