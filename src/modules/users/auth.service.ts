import { AppDataSource } from '../../config/database';
import { User } from './user.entity';
import { IUser } from '../../common/interfaces';
import { hashPassword, comparePassword, signToken } from '../../common/utils';
import { Role } from '../../common/enums';
import { AppError } from '../../common/utils/app-error';

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
  private userRepository = AppDataSource.getRepository(User);

  async register(dto: RegisterDto): Promise<{ user: Partial<IUser>; token: string }> {
    const exists = await this.userRepository.findOne({ where: { email: dto.email } });
    if (exists) throw new AppError('Email already in use.', 400);

    const { name, email, role, password } = dto;
    const hashed = await hashPassword(password);
    
    const user = this.userRepository.create({
      name,
      email,
      role: role || Role.Attendee,
      password: hashed,
    });

    await this.userRepository.save(user);

    const token = signToken({ id: user.id, role: user.role });
    const { password: _pw, ...safeUser } = user;

    return { user: safeUser, token };
  }

  async login(dto: LoginDto): Promise<{ user: Partial<IUser>; token: string }> {
    const user = await this.userRepository.findOne({ 
      where: { email: dto.email },
      select: ['id', 'name', 'email', 'password', 'role', 'createdAt', 'updatedAt']
    });
    
    if (!user) throw new AppError('Invalid credentials.', 401);

    const isMatch = await comparePassword(dto.password, user.password);
    if (!isMatch) throw new AppError('Invalid credentials.', 401);

    const token = signToken({ id: user.id, role: user.role });
    const { password: _pw, ...safeUser } = user;

    return { user: safeUser, token };
  }
}

export const authService = new AuthService();