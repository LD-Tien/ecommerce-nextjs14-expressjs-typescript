'use client' // Error components must be Client Components

import { Button, Result } from 'antd'
import { useRouter } from 'next/navigation'
import { startTransition, useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <Result
            status='error'
            title='Đã xảy ra lỗi vui lòng thử lại sau'
            extra={
                <Button
                    type='primary'
                    key='refresh'
                    onClick={() => {
                        router.refresh()
                        startTransition(() => reset())
                    }}
                >
                    Thử lại
                </Button>
            }
        />
    )
}
