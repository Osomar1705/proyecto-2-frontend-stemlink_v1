import type { MentorProfileResponse } from '../../types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { MentorAvatar } from './MentorAvatar'
import { ArrowRight, Award, ExternalLink, Sparkles } from 'lucide-react'
import { getMentorPhoto } from '../../utils/mentorProfileAssets'

interface Props {
  mentor: MentorProfileResponse
  onOpenProfile: () => void
}

export function MentorCard({ mentor, onOpenProfile }: Props) {
  const skills = mentor.skills ?? []
  const mentorPhoto = getMentorPhoto(mentor.id)

  return (
    <Card
      onClick={onOpenProfile}
      className="group flex h-full flex-col overflow-hidden border-border/70 p-0"
    >
      <div className="surface-tint border-b border-border/70 px-5 pb-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <MentorAvatar name={mentor.name} src={mentorPhoto} size="md" />

          <div className="inline-flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-muted ring-1 ring-border/60 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
            <Sparkles size={12} className="text-accent-500" aria-hidden />
            STEM
          </div>
        </div>

        <div className="mt-4">
          <h3 className="line-clamp-2 text-base font-bold tracking-tight text-text">
            {mentor.name}
          </h3>
          <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted">
            {mentor.bio || 'Mentor especializado en áreas STEM listo para acompañarte en tu siguiente objetivo.'}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 py-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="panel-shell rounded-2xl px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Skills</p>
            <p className="mt-1 text-lg font-bold text-text">{skills.length}</p>
          </div>
          <div className="panel-shell min-w-0 overflow-hidden rounded-2xl px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Perfil</p>
            <p className="mt-1 flex min-w-0 items-center gap-1 text-[11px] font-semibold leading-4 text-text sm:text-xs">
              <Award size={13} className="shrink-0 text-primary-600" aria-hidden />
              <span className="min-w-0 truncate">Verificado</span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {skills.slice(0, 3).map(skill => (
            <Badge key={skill.id} label={skill.name} />
          ))}
          {skills.length > 3 && <Badge label={`+${skills.length - 3}`} color="neutral" />}
          {!skills.length && <Badge label="STEM" color="neutral" />}
        </div>

        <div className="mt-auto space-y-3 border-t border-border/60 pt-5">
          {mentor.linkedinUrl ? (
            <a
              href={mentor.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 transition-all duration-300 ease-in-out hover:text-primary-700 hover:underline"
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
