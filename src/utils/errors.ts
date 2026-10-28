import axios from "axios"
import type { ApiError } from "../types/api"

export function getErrorMessage(error: unknown): string
{
    if (axios.isAxiosError<ApiError>(error))
    {
        const message = error.response?.data?.error?.message
        if (message)
            return message

        if (!error.response)
            return "אין חיבור לשרת, נסו שוב בעוד רגע"
    }
    return "משהו השתבש, נסו שוב"
}
