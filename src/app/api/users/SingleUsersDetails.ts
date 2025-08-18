export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;

}

export const singleUser: User[] = [
  {
    id: 1,
    username: 'john.doe',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    avatar: '/images/profile/user-1.jpg',
    
  },
  {
    id: 2,
    username: 'jane.smith',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    status: 'inactive',
    avatar: '/images/profile/user-2.jpg',
    
  },
  {
    id: 3,
    username: 'michael.scott',
    name: 'Michael Scott',
    email: 'michael.scott@dundermifflin.com',
    role: 'Regional Manager',
    status: 'active',
    avatar: '/images/profile/user-3.jpg',
    
  },
  {
    id: 4,
    username: 'alice.johnson',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    role: 'Editor',
    status: 'inactive',
    avatar: '/images/profile/user-4.jpg',
   
  },

  {
    id: 5,
    username: 'david.green',
    name: 'David Green',
    email: 'david.green@example.com',
    role: 'Manager',
    status: 'active',
    avatar: '/images/profile/user-5.jpg',
  
  },
];
