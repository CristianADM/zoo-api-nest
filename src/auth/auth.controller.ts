import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ROL } from 'src/common/enums/rol.enum';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
