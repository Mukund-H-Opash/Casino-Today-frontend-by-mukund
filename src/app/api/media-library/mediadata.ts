export interface Media {
  id: number;
  type: 'image' | 'video' | 'pdf';
  url: string;
  name: string;
  category: string;
  uploadedAt: string;
}

export const mediaData: Media[] = [
  {
    id: 1,
    type: 'image',
    url: '/images/products/s1.jpg',
    name: 's1.jpg',
    category: 'Casino Logos',
    uploadedAt: '2023-01-15T10:00:00Z',
  },
  {
    id: 2,
    type: 'image',
    url: '/images/products/s2.jpg',
    name: 's2.jpg',
    category: 'Game Screenshots',
    uploadedAt: '2023-01-16T11:30:00Z',
  },
  {
    id: 3,
    type: 'image',
    url: '/images/products/s3.jpg',
    name: 's3.jpg',
    category: 'Casino Logos',
    uploadedAt: '2023-01-17T14:00:00Z',
  },
  {
    id: 4,
    type: 'video',
    url: '/videos/game-trailer.mp4',
    name: 'game-trailer.mp4',
    category: 'Game Screenshots',
    uploadedAt: '2023-01-18T16:45:00Z',
  },
  {
    id: 5,
    type: 'image',
    url: '/images/products/s4.jpg',
    name: 's4.jpg',
    category: 'Casino Logos',
    uploadedAt: '2023-01-19T09:20:00Z',
  },
  {
    id: 6,
    type: 'image',
    url: '/images/products/s5.jpg',
    name: 's5.jpg',
    category: 'Game Screenshots',
    uploadedAt: '2023-01-20T13:00:00Z',
  },
  {
    id: 7,
    type: 'pdf',
    url: '/pdf/terms-and-conditions.pdf',
    name: 'terms-and-conditions.pdf',
    category: 'Documents',
    uploadedAt: '2023-01-21T18:00:00Z',
  },
  {
    id: 8,
    type: 'image',
    url: '/images/products/s6.jpg',
    name: 's6.jpg',
    category: 'Promotions',
    uploadedAt: '2023-01-22T12:10:00Z',
  },
];
