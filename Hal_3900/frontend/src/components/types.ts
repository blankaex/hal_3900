export interface Theme {
    primary: string,
    secondary: string,
    primaryGradient: string[],
    secondaryGradient: string[]
}

export interface BotResponse {
    text?: string,
    error: false,
    type: 'message'|'error'
}