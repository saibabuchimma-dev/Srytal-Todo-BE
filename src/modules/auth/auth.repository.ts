import { UserModel } from './auth.model';

export class AuthRepository {
  async findByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  async create(data: {
    fullName: string;
    email: string;
    password: string;
  }) {
    return UserModel.create(data);
  }
}