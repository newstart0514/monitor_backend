class UserInfo {
  id: number;

  username: string;

  name: string;

  email: string;

  avatar: string;

  role: string;

  create_time: number;

  update_time: number;
}

export class LoginUserVo {
  userInfo: UserInfo;

  accessToken: string;

  refreshToken: string;
}
