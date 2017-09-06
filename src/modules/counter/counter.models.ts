export interface CounterState {
    count: number
}

export interface IncrementPayload {
    count: number
}

export interface IncrementIntervalPayload {
    interval: number,
    increment: number
}