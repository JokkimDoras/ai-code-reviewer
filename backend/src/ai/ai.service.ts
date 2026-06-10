import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AiService {
  private readonly apiUrl = 'http://127.0.0.1:1234/v1/chat/completions';
  private readonly model = 'qwen2.5-coder-0.5b-instruct';

  constructor(private supabaseService: SupabaseService) {}

  async reviewCode(code: string, filename: string, reviewType: string = 'general', projectId: string) {
    const prompts: Record<string, string> = {
      general: 'You are an expert code reviewer. Review the following code and provide: 1) A brief summary, 2) Issues found with severity (high/medium/low), 3) Recommendations for improvement. Be concise and structured. /no_think',
      security: 'You are a security expert. Review the following code for security vulnerabilities. Identify: 1) Security issues with severity, 2) Potential attack vectors, 3) Security recommendations. /no_think',
      performance: 'You are a performance expert. Review the following code for performance issues. Identify: 1) Performance bottlenecks, 2) Memory issues, 3) Optimization recommendations. /no_think',
    };

    const systemPrompt = prompts[reviewType] || prompts.general;

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `File: ${filename}\n\n\`\`\`\n${code}\n\`\`\`` },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
      signal: AbortSignal.timeout(600000),
    });

    const data = await response.json();
    const content_text = (data.choices[0].message.content || '') as string;
    const reasoning_text = (data.choices[0].message.reasoning_content || '') as string;
    const cleaned_content = content_text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    const content = cleaned_content.length > 100 ? cleaned_content : reasoning_text;

    const supabase = this.supabaseService.getClient();
    await supabase.from('reviews').insert({
      summary: content,
      issues: [],
      recommendations: [],
      severity: reviewType,
      review_type: reviewType,
      project_id: projectId,
    });
    const { data: saved, error: saveError } = await supabase.from('reviews').insert({
        summary: content,
        issues: [],
        recommendations: [],
        severity: reviewType,
        review_type: reviewType,
        project_id: projectId,
      }).select().single();
      
      console.log('Save result:', saved, 'Error:', saveError);

    return { review: content, reviewType, filename };
  }

  async chatWithCode(code: string, question: string, history: { role: string; content: string }[]) {
    const messages = [
      { role: 'system', content: 'You are a helpful code assistant. Be concise and helpful. /no_think' },
      { role: 'user', content: `Here is the code context:\n\`\`\`\n${code}\n\`\`\`` },
      ...history,
      { role: 'user', content: question },
    ];

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.5,
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    const content_text = (data.choices[0].message.content || '') as string;
    const reasoning_text = (data.choices[0].message.reasoning_content || '') as string;
    const cleaned_content = content_text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    const content = cleaned_content.length > 100 ? cleaned_content : reasoning_text;

    return { response: content };
  }
}