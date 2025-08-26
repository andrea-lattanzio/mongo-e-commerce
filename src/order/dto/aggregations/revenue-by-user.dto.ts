import { Type } from 'class-transformer';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class RevenueByUserResponseDto {
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  totalRevenue: number;
}
