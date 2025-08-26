import { IsDateString } from 'class-validator';
import { IsBefore } from 'src/common/decorators/validators/is-before.validator';

export class RevenueByDayDto {
  @IsDateString()
  @IsBefore('endDate')
  startDate: string;
  @IsDateString()
  endDate: string;
}

export class RevenueByDayResponseDto {
  date: string;
  totalRevenue: number;
}
