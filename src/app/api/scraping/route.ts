import { NextResponse } from 'next/server';

const MOCK_DATA = [
  {
    id: '1',
    systemId: 'CR-001',
    contentType: 'Casino Review',
    sourceUrl: 'https://example.com/casino/review1',
    status: 'Published',
    lastModified: '2024-07-01 10:00:00',
    lastChangedBy: 'Admin',
    lastChangedAt: '2024-07-01 10:05:00',
    content: 'Detailed review of Casino A, highlighting its features and bonuses.',
  },
  {
    id: '2',
    systemId: 'GR-001',
    contentType: 'Game Review',
    sourceUrl: 'https://example.com/game/slot1',
    status: 'Draft',
    lastModified: 'N/A',
    lastChangedBy: 'User A',
    lastChangedAt: '2024-07-02 11:30:00',
    content: 'Review of Slot Game X, focusing on gameplay and graphics.',
  },
  {
    id: '3',
    systemId: 'B-001',
    contentType: 'Bonus',
    sourceUrl: 'https://example.com/bonus/welcome',
    status: 'Under Review',
    lastModified: '2024-07-03 14:15:00',
    lastChangedBy: 'System',
    lastChangedAt: '2024-07-03 14:15:00',
    content: 'Welcome bonus details: 100% match up to $200.',
  },
  {
    id: '4',
    systemId: 'CR-002',
    contentType: 'Casino Review',
    sourceUrl: 'https://example.com/casino/review2',
    status: 'Archived',
    lastModified: '2024-07-04 09:00:00',
    lastChangedBy: 'Admin',
    lastChangedAt: '2024-07-04 09:05:00',
    content: 'Review of Casino B, focusing on payment methods and customer support.',
  },
  {
    id: '5',
    systemId: 'GR-002',
    contentType: 'Game Review',
    sourceUrl: 'https://example.com/game/poker',
    status: 'Published',
    lastModified: '2024-07-05 16:00:00',
    lastChangedBy: 'User B',
    lastChangedAt: '2024-07-05 16:10:00',
    content: 'In-depth analysis of Poker Game Y, including strategy tips.',
  },
];

export async function GET() {
  return NextResponse.json(MOCK_DATA);
}

export async function POST(request: Request) {
  const body = await request.json();
  // In a real application, you would save this to a database
  // console.log('Received data:', body);
  return NextResponse.json({ message: 'Data received', data: body });
}