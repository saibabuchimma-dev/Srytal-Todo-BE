import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';
import { AuthRepository } from './auth.repository';
import { LoginDto } from './auth.types';

const repository = new AuthRepository();

export class AuthService {
  async login(data: LoginDto) {
    // Find user by email
    const user = await repository.findByEmail(data.email);

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Compare password
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // JWT Payload
    const payload = {
      id: user.id,
      email: user.email,
    };

    // JWT Secret
    const secret: Secret = env.JWT_SECRET;

    // JWT Options
    const options: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    };

    // Generate Token
    const token = jwt.sign(payload, secret, options);

    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }
}