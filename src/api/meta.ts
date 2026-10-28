import { api } from "./client"
import type { Meta, Quote } from "../types/api"

export const getMeta = async () => {
    const res = await api.get<Meta>("/meta")
    return res.data
}

export const getTodayQuote = async () => {
    const res = await api.get<Quote>("/quotes/today")
    return res.data
}
