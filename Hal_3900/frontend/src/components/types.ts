export interface Theme {
    primary: string,
    secondary: string,
    primaryGradient: string[],
    secondaryGradient: string[]
}

export interface BotResponse {
    data?: {
        response: string,
        intent: string,
        options: any[]
    },
    error: false,
    msg?: string,
    type: 'message'|'error'
}