class User {
  id: number;

  username: string;

  name: string;
  
  email: string;

  avatar: string;

  phone: string;

  student_id: string;

  from: string;

  guardian_name: string;
  
  guardian_phone: string;
  
  is_frozen: boolean;
  
  role: string;
}

export class UserListVo {
  users: User[];

  total: number;
}