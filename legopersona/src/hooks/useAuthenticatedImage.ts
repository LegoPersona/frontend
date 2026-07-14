import { useEffect, useState } from 'react'
import api from '@/services/api'

interface UseAuthenticatedImageResult {
  imageUrl: string | null
  isLoading: boolean
  errorStatus: number | null
}

const isAxiosStatus = (error: unknown): number | null => {
  const status = (error as { response?: { status?: number } })?.response?.status
  return typeof status === 'number' ? status : null
}

export const useAuthenticatedImage = (
  imagePath: string | null,
): UseAuthenticatedImageResult => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorStatus, setErrorStatus] = useState<number | null>(null)

  useEffect(() => {
    if (!imagePath) {
      setImageUrl(null)
      setErrorStatus(null)
      setIsLoading(false)
      return
    }

    let isActive = true
    let objectUrl: string | null = null

    setIsLoading(true)
    setErrorStatus(null)

    void api
      .get<Blob>(imagePath, { responseType: 'blob' })
      .then((response) => {
        if (!isActive) {
          return
        }

        objectUrl = URL.createObjectURL(response.data)
        setImageUrl(objectUrl)
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return
        }

        setImageUrl(null)
        setErrorStatus(isAxiosStatus(error))
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [imagePath])

  return {
    imageUrl,
    isLoading,
    errorStatus,
  }
}
