import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Dispatch, SetStateAction } from 'react';
import type { ResumeContent } from '@/types/resume';
import { EditorGroup, TextField } from './EditorPrimitives';
import { createSkillGroupId, csvToList, listToText, textToList } from './utils';

export function ResumeDraftEditor({
  resume,
  skillInputs,
  setSkillInputs,
  setResumeDraft,
}: {
  resume: ResumeContent;
  skillInputs: Record<string, string>;
  setSkillInputs: Dispatch<SetStateAction<Record<string, string>>>;
  setResumeDraft: (updater: (draft: ResumeContent) => void) => void;
}) {
  return (
    <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(320px,0.9fr)_minmax(380px,1.1fr)]">
      <div className="grid content-start gap-3">
        <EditorGroup title="Profile" meta="header + education">
          <TextField
            label="Header name"
            value={resume.header.name}
            onChange={value => setResumeDraft(draft => void (draft.header.name = value))}
          />
          <TextField
            label="Education degree"
            value={resume.education.degree}
            onChange={value => setResumeDraft(draft => void (draft.education.degree = value))}
          />
          <TextField
            label="Relevant courses"
            value={resume.education.courses}
            rows={3}
            onChange={value => setResumeDraft(draft => void (draft.education.courses = value))}
          />
        </EditorGroup>

        <EditorGroup title="Skills" meta={`${resume.skills.groups.length} groups`}>
          {resume.skills.groups.map(group => (
            <div
              key={group.id}
              className="grid gap-3 rounded-xl border border-[#e4ded2] bg-white p-3 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.16em] text-[#9b9489]">
                  {group.id.startsWith('ai-') ? 'AI group' : 'Resume group'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setResumeDraft(draft => {
                      draft.skills.groups = draft.skills.groups.filter(
                        item => item.id !== group.id
                      );
                    });
                    setSkillInputs(current => {
                      const next = { ...current };
                      delete next[group.id];
                      return next;
                    });
                  }}
                  className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                  aria-label={`Delete ${group.label}`}
                >
                  <TrashIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Delete
                </button>
              </div>
              <TextField
                label="Group name"
                value={group.label}
                onChange={value =>
                  setResumeDraft(draft => {
                    const target = draft.skills.groups.find(item => item.id === group.id);
                    if (target) target.label = value;
                  })
                }
              />
              <TextField
                label="Skills"
                value={skillInputs[group.id] ?? group.items.join(', ')}
                onChange={value => {
                  setSkillInputs(current => ({ ...current, [group.id]: value }));
                  setResumeDraft(draft => {
                    const target = draft.skills.groups.find(item => item.id === group.id);
                    if (target) target.items = csvToList(value);
                  });
                }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const id = createSkillGroupId(resume.skills.groups);
              setResumeDraft(draft => {
                draft.skills.groups.push({
                  id,
                  label: 'New skill group',
                  items: [],
                });
              });
              setSkillInputs(current => ({ ...current, [id]: '' }));
            }}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8c1b6] bg-white/70 text-sm font-semibold text-[#4f493f] transition hover:border-[#2f6f73] hover:text-[#2f6f73]"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            Add skill group
          </button>
        </EditorGroup>
      </div>

      <div className="grid content-start gap-3">
        {resume.experience.items.map(item => (
          <EditorGroup key={item.id} title={item.company} meta="experience">
            <TextField
              label="Position"
              value={item.position}
              onChange={value =>
                setResumeDraft(draft => {
                  const target = draft.experience.items.find(entry => entry.id === item.id);
                  if (target) target.position = value;
                })
              }
            />
            {item.achievements && (
              <TextField
                label="Achievements"
                value={listToText(item.achievements)}
                rows={4}
                onChange={value =>
                  setResumeDraft(draft => {
                    const target = draft.experience.items.find(entry => entry.id === item.id);
                    if (target) target.achievements = textToList(value);
                  })
                }
              />
            )}
            {item.projects?.map(project => (
              <TextField
                key={project.id}
                label={`${project.title}: bullets`}
                value={listToText(project.description)}
                rows={5}
                onChange={value =>
                  setResumeDraft(draft => {
                    const target = draft.experience.items
                      .find(entry => entry.id === item.id)
                      ?.projects?.find(entry => entry.id === project.id);
                    if (target) target.description = textToList(value);
                  })
                }
              />
            ))}
          </EditorGroup>
        ))}
        <EditorGroup title="Projects" meta={`${resume.projects.items.length} items`}>
          {resume.projects.items.map(project => (
            <TextField
              key={project.id}
              label={`${project.title}: bullets`}
              value={listToText(project.description)}
              rows={5}
              onChange={value =>
                setResumeDraft(draft => {
                  const target = draft.projects.items.find(entry => entry.id === project.id);
                  if (target) target.description = textToList(value);
                })
              }
            />
          ))}
        </EditorGroup>
        <EditorGroup title="Activities" meta={`${resume.societies.items.length} items`}>
          {resume.societies.items.map(item => (
            <TextField
              key={item.id}
              label={`${item.organization}: achievements`}
              value={listToText(item.achievements)}
              rows={4}
              onChange={value =>
                setResumeDraft(draft => {
                  const target = draft.societies.items.find(entry => entry.id === item.id);
                  if (target) target.achievements = textToList(value);
                })
              }
            />
          ))}
        </EditorGroup>
      </div>
    </div>
  );
}
