import { UserModel } from './user.model';
import { IUser } from '../../common/interfaces';
import { hashPassword, comparePassword, signToken } from '../../common/utils';
import { Role } from '../../common/enums';

interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

interface LoginDto {
  email: string;
  password: string;
}

export class AuthService {
  async register(dto: RegisterDto): Promise<{ user: Partial<IUser>; token: string }> {
    const exists = await UserModel.findOne({ email: dto.email });
    if (exists) throw new Error('Email already in use.');

    const hashed = await hashPassword(dto.password);
    const user = await UserModel.create({ ...dto, password: hashed });

    const token = signToken({ _id: user._id, role: user.role });
    const { password: _pw, ...safeUser } = user.toObject();

    return { user: safeUser, token };
  }

  async login(dto: LoginDto): Promise<{ user: Partial<IUser>; token: string }> {
    const user = await UserModel.findOne({ email: dto.email }).select('+password');
    if (!user) throw new Error('Invalid credentials.');

    const isMatch = await comparePassword(dto.password, user.password);
    if (!isMatch) throw new Error('Invalid credentials.');

    const token = signToken({ _id: user._id, role: user.role });
    const { password: _pw, ...safeUser } = user.toObject();

    return { user: safeUser, token };
  }
}

export const authService = new AuthService();
