import type { JdInsights, ResumeContent } from '@/types/resume';

export type TailorModelOutput = {
  tailoredResume: ResumeContent;
  changeSummary: string[];
  jdInsights: JdInsights;
  jdTitle?: string;
  company?: string;
};

export type ResumeTailorProviderInput = {
  locale: string;
  resume: ResumeContent;
  jdText: string;
  userInstructions?: string;
  repairContext?: {
    validationError: string;
    previousOutput: TailorModelOutput;
  };
};

export interface ResumeTailorProvider {
  tailor(input: ResumeTailorProviderInput): Promise<TailorModelOutput>;
}

const tailorSystemPrompt =
  'You tailor a resume to a job description. Return JSON only. Do not add, remove, rename, or reorder experience.items, experience.items[*].projects, projects.items, societies.items, or awards.items; their id lists and order must exactly match the input resume. Bullet lists are plain strings: you may add, remove, reorder, or rewrite only experience.items[*].achievements, experience.items[*].projects[*].description, projects.items[*].description, and societies.items[*].achievements when it improves JD fit. You may rewrite editable text such as positions, project titles, skill labels, and skill items, but do not change companies, dates, URLs, schools, awards, or other factual anchors. You may add skill groups only with ids starting with ai-. Keep the output in the requested locale.';

const bulletListSchema = {
  type: 'array',
  items: { type: 'string' },
} as const;

const nullableStringSchema = {
  anyOf: [{ type: 'string' }, { type: 'null' }],
} as const;

const projectSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'id',
    'title',
    'repoUrl',
    'repoName',
    'technologies',
    'description',
    'projectUrl',
    'siteName',
    'imageUrl',
    'period',
  ],
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    repoUrl: nullableStringSchema,
    repoName: nullableStringSchema,
    technologies: { type: 'array', items: { type: 'string' } },
    description: bulletListSchema,
    projectUrl: nullableStringSchema,
    siteName: nullableStringSchema,
    imageUrl: nullableStringSchema,
    period: nullableStringSchema,
  },
} as const;

const resumeSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'ui',
    'pdf',
    'header',
    'education',
    'experience',
    'societies',
    'projects',
    'awards',
    'skills',
  ],
  properties: {
    ui: {
      type: 'object',
      additionalProperties: false,
      required: ['home', 'websiteLabel'],
      properties: {
        home: { type: 'string' },
        websiteLabel: { type: 'string' },
      },
    },
    pdf: {
      type: 'object',
      additionalProperties: false,
      required: ['fileNameBase', 'localizedSuffix'],
      properties: {
        fileNameBase: { type: 'string' },
        localizedSuffix: { type: 'string' },
      },
    },
    header: {
      type: 'object',
      additionalProperties: false,
      required: [
        'name',
        'email',
        'emailHref',
        'githubUrl',
        'githubLabel',
        'linkedinUrl',
        'linkedinLabel',
      ],
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        emailHref: { type: 'string' },
        githubUrl: { type: 'string' },
        githubLabel: { type: 'string' },
        linkedinUrl: { type: 'string' },
        linkedinLabel: { type: 'string' },
      },
    },
    education: {
      type: 'object',
      additionalProperties: false,
      required: ['id', 'title', 'university', 'degree', 'period', 'relevantCourses', 'courses'],
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        university: { type: 'string' },
        degree: { type: 'string' },
        period: { type: 'string' },
        relevantCourses: { type: 'string' },
        courses: { type: 'string' },
      },
    },
    experience: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'projectsLabel', 'items'],
      properties: {
        title: { type: 'string' },
        projectsLabel: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['id', 'company', 'position', 'period', 'achievements', 'projects'],
            properties: {
              id: { type: 'string' },
              company: { type: 'string' },
              position: { type: 'string' },
              period: { type: 'string' },
              achievements: bulletListSchema,
              projects: { type: 'array', items: projectSchema },
            },
          },
        },
      },
    },
    societies: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'items'],
      properties: {
        title: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: [
              'id',
              'organization',
              'position',
              'achievements',
              'period',
              'repoUrl',
              'repoDescription',
              'societyWebsiteUrl',
              'societyWebsiteDescription',
            ],
            properties: {
              id: { type: 'string' },
              organization: { type: 'string' },
              position: { type: 'string' },
              achievements: bulletListSchema,
              period: { type: 'string' },
              repoUrl: { type: 'string' },
              repoDescription: { type: 'string' },
              societyWebsiteUrl: { type: 'string' },
              societyWebsiteDescription: { type: 'string' },
            },
          },
        },
      },
    },
    projects: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'items'],
      properties: {
        title: { type: 'string' },
        items: { type: 'array', items: projectSchema },
      },
    },
    awards: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'items'],
      properties: {
        title: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['id', 'place', 'award', 'period', 'link'],
            properties: {
              id: { type: 'string' },
              place: { type: 'string' },
              award: { type: 'string' },
              period: { type: 'string' },
              link: { type: 'string' },
            },
          },
        },
      },
    },
    skills: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'groups'],
      properties: {
        title: { type: 'string' },
        groups: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['id', 'label', 'items'],
            properties: {
              id: { type: 'string' },
              label: { type: 'string' },
              items: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
  },
} as const;

const tailorOutputSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['tailoredResume', 'changeSummary', 'jdInsights', 'jdTitle', 'company'],
  properties: {
    tailoredResume: resumeSchema,
    changeSummary: { type: 'array', items: { type: 'string' } },
    jdInsights: {
      type: 'object',
      additionalProperties: false,
      required: ['roleKeywords', 'requiredSkills', 'matchNotes', 'gapNotes'],
      properties: {
        roleKeywords: { type: 'array', items: { type: 'string' } },
        requiredSkills: { type: 'array', items: { type: 'string' } },
        matchNotes: { type: 'array', items: { type: 'string' } },
        gapNotes: { type: 'array', items: { type: 'string' } },
      },
    },
    jdTitle: nullableStringSchema,
    company: nullableStringSchema,
  },
} as const;

function extractOutputText(response: { output_text?: string; output?: unknown }) {
  if (typeof response.output_text === 'string') {
    return response.output_text;
  }

  if (Array.isArray(response.output)) {
    for (const item of response.output) {
      if (
        item &&
        typeof item === 'object' &&
        'content' in item &&
        Array.isArray((item as { content: unknown }).content)
      ) {
        for (const content of (item as { content: Array<Record<string, unknown>> }).content) {
          if (typeof content.text === 'string') {
            return content.text;
          }
        }
      }
    }
  }

  throw new Error('OpenAI response did not include output text');
}

export class OpenAIResumeTailorProvider implements ResumeTailorProvider {
  async tailor({
    locale,
    resume,
    jdText,
    userInstructions,
    repairContext,
  }: ResumeTailorProviderInput) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        input: [
          {
            role: 'system',
            content: tailorSystemPrompt,
          },
          {
            role: 'user',
            content: JSON.stringify({
              locale,
              jdText,
              userInstructions: userInstructions ?? '',
              resume,
              ...(repairContext
                ? {
                    repairInstruction:
                      'The previous output failed local validation. Return a corrected full JSON response using the same schema. Fix only the validation issue while preserving the tailored wording where possible.',
                    validationError: repairContext.validationError,
                    previousOutput: repairContext.previousOutput,
                  }
                : {}),
            }),
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'tailored_resume_output',
            strict: true,
            schema: tailorOutputSchema,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
    }

    const responseBody = await response.json();
    return JSON.parse(extractOutputText(responseBody)) as TailorModelOutput;
  }
}

export function getResumeTailorProvider(): ResumeTailorProvider {
  return new OpenAIResumeTailorProvider();
}
