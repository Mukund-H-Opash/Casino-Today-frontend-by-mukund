
export interface Log {
  id: number;
  username: string;
  action: string;
  date: string;
}

export const AccesslogData: Log[] = [
  {
    id: 1,
    username: 'john.doe',
    action: 'Login',
    date: '2025-07-08',
  },
  {
    id: 2,
    username: 'john.doe',
    action: 'Data Change',
    date: '2025-07-07',
  },
  {
    id: 3,
    username: 'jane.smith',
    action: 'Login',
    date: '2025-07-07',
  },
  {
    id: 4,
    username: 'michael.scott',
    action: 'System Update',
    date: '2025-07-08',
  },

  {
    id: 5,
    username: 'alice.johnson',
    action: 'Login',
    date: '2025-07-06',
  },
  {
    id: 6,
    username: 'john.doe',
    action: 'Logout',
    date: '2025-07-08',
  },
];