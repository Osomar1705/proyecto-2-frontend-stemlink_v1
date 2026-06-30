import type { MentorProfileResponse } from '../../types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { MentorAvatar } from './MentorAvatar'
import { ArrowRight, Award, ExternalLink, Sparkles } from 'lucide-react'

interface Props {
  mentor: MentorProfileResponse
  onOpenProfile: () => void
}

export function MentorCard({ mentor, onOpenProfile }: Props) {
  const skills = mentor.skills ?? []

  return (
    <Card
      onClick={onOpenProfile}
      className="group flex h-full flex-col overflow-hidden border-border/80 p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative border-b border-border bg-surface-alt/70 px-6 pb-5 pt-6">
        <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-primary-100/70 blur-2xl" />

        <div className="relative flex items-start justify-between gap-3">
          <MentorAvatar name={mentor.name} size="md" />

          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-muted">
            <Sparkles size={12} className="text-accent-500" aria-hidden />
            STEM
          </div>
        </div>

        <div className="relative mt-4">
          <h3 className="line-clamp-2 text-base font-bold tracking-tight text-text">
            {mentor.name}
          </h3>
          <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted">
            {mentor.bio || 'Mentor especializado en áreas STEM listo para acompañarte en tu siguiente objetivo.'}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 py-5">
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-surface-alt px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Skills</p>
            <p className="mt-1 text-lg font-bold text-text">{skills.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface-alt px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Perfil</p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-text">
              <Award size={14} className="text-primary-600" aria-hidden />
              Verificado
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {skills.slice(0, 3).map(skill => (
            <Badge key={skill.id} label={skill.name} />
          ))}
          {skills.length > 3 && <Badge label={`+${skills.length - 3}`} color="neutral" />}
          {!skills.length && <Badge label="STEM" color="neutral" />}
        </div>

        <div className="mt-auto space-y-3">
          {mentor.linkedinUrl ? (
            <a
              href={mentor.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 transition-colors hover:text-primary-700 hover:underline"
            >
              <ExternalLink size={12} aria-hidden />
              Ver LinkedIn
            </a>
          ) : (
            <p className="text-xs text-muted">Sin enlace externo publicado</p>
          )}

          <Button
            className="w-full"
            onClick={e => {
              e.stopPropagation()
              onOpenProfile()
            }}
          >
            Ver Perfil
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </Card>
  )
}
