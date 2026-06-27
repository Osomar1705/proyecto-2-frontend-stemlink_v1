import type { ApiError } from '../types'

export function parseApiError(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Error inesperado'

  const err = error as { response?: { data?: ApiError; status?: number } }

  if (!err.response) return 'Error de conexión. Verifica tu internet.'

  const { data, status } = err.response

  if (data?.fields) {
    return Object.values(data.fields).join('. ')
  }

  if (data?.message) return data.message

  switch (status) {
    case 400: return 'Datos inválidos. Revisa el formulario.'
    case 401: return 'Sesión expirada. Inicia sesión nuevamente.'
    case 403: return 'No tienes permiso para realizar esta acción.'
    case 404: return 'El recurso solicitado no fue encontrado.'
    case 409: return 'Ya existe un conflicto con los datos ingresados.'
    case 500: return 'Error interno del servidor. Intenta más tarde.'
    default:  return 'Ocurrió un error inesperado.'
  }
}
