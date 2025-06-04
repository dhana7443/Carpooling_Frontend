export interface JwtPayload {
    role_name: 'driver' | 'rider';
    user_id: string;
    // add more fields if your JWT contains more
  }
  