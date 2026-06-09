import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.projectsService.findAll(req.user.id);
  }

  @Post()
  create(@Request() req: any, @Body() body: { name: string; description: string }) {
    return this.projectsService.create(req.user.id, body.name, body.description);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.delete(id, req.user.id);
  }
  @Get(':id/reviews')
getReviews(@Param('id') id: string) {
  return this.projectsService.getReviews(id);
}
}