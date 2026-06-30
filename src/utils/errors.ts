import type { ApiError } from '../types'

export interface ApiErrorInfo {
  message: string
  status?: number
  retryable: boolean
}

export function parseApiError(error: unknown): string {
  return getApiErrorInfo(error).message
}

export function getApiErrorInfo(error: unknown): ApiErrorInfo {
  if (!error || typeof error !== 'object') {
    return { message: 'Error inesperado', retryable: false }
  }

  const err = error as {
    code?: string
    message?: string
    response?: { data?: ApiError; status?: number }
  }

  if (!err.response) {
    if (err.code === 'ECONNABORTED') {
      return { message: 'La solicitud tardó demasiado. Intenta nuevamente.', retryable: true }
    }

    if (err.message?.toLowerCase().includes('network')) {
      return { message: 'No se pudo conectar con el servidor. Verifica tu red.', retryable: true }
    }

    return { message: 'Error de conexión. Verifica tu internet.', retryable: true }
  }

  const { data, status } = err.response

  if (data?.fields) {
    return { message: Object.values(data.fields).join('. '), status, retryable: false }
  }

  if (data?.message) {
    return { message: data.message, status, retryable: status !== undefined && status >= 500 }
  }

  switch (status) {
    case 400: return { message: 'Datos inválidos. Revisa el formulario.', status, retryable: false }
    case 401: return { message: 'Sesión expirada. Inicia sesión nuevamente.', status, retryable: false }
    case 403: return { message: 'No tienes permiso para realizar esta acción.', status, retryable: false }
    case 404: return { message: 'El recurso solicitado no fue encontrado.', status, retryable: false }
    case 408: return { message: 'La solicitud expiró. Intenta nuevamente.', status, retryable: true }
    case 409: return { message: 'Ya existe un conflicto con los datos ingresados.', status, retryable: false }
    case 429: return { message: 'Hay demasiadas solicitudes en este momento. Intenta en unos segundos.', status, retryable: true }
    case 500: return { message: 'Error interno del servidor. Intenta más tarde.', status, retryable: true }
    case 502:
    case 503:
    case 504:
      return { message: 'El servicio está temporalmente no disponible. Intenta nuevamente.', status, retryable: true }
    default:
      return { message: 'Ocurrió un error inesperado.', status, retryable: true }
  }
}
