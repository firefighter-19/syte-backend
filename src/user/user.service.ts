import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userName: string): Promise<UserEntity> {
    const createUser = this.userRepository.create({
      name: userName,
    });
    return await this.userRepository.save(createUser);
  }
  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.catalog', 'catalog')
      .getMany();
  }
}
