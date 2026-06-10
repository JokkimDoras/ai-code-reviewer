import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('ai')
@UseGuards(AuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('review')
  reviewCode(@Body() body: { code: string; filename: string; reviewType: string; projectId: string }) {
    return this.aiService.reviewCode(body.code, body.filename, body.reviewType, body.projectId);
  }

  @Post('chat')
  chatWithCode(@Body() body: { code: string; question: string; history: { role: string; content: string }[] }) {
    return this.aiService.chatWithCode(body.code, body.question, body.history);
  }
}