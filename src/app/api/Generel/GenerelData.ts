export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;

  profileImage: string;
  
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const userData: UserData = {
  id: 1,
  name: "Mathew Anderson",
  email: "info@modernize.com",
  phone: "+91 12345 65478",
  address: "814 Howard Street, 120065, India",
  profileImage: "/images/profile/user-1.jpg",
  currentPassword: "MathewAnderson",
  newPassword: "MathewAnderson",
  confirmPassword: "MathewAnderson",
};
