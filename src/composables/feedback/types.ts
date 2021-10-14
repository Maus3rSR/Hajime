type Schema = Record<string, string>
type Feedback = FeedbackClassic | FeedbackBug
enum FeedbackType { CLASSIC, BUG }

const baseSchema: Schema = { email: 'email' }

interface FeedbackBase {
    email?: string,
    os?: string,
    version?: string,
    screen: string
}

interface FeedbackClassic extends FeedbackBase {
    message: string
}

interface FeedbackBug extends FeedbackBase {
    description: string,
    reproduce: string,
    expected: string
}

abstract class FeedbackForm<T extends Feedback> {
    schema?: Schema
    feedback?: T

    abstract getMessage(): string
}

class FeedbackFormClassic extends FeedbackForm<FeedbackClassic> {
    fields: Array<string> = []

    constructor() {
        super()
        
        this.schema = {
            ...baseSchema,
            message: 'required'
        }
    }

    getMessage(): string { return '' }
}

class FeedbackFormBug extends FeedbackForm<FeedbackBug> {
    constructor() {
        super()
        this.schema = {
            ...baseSchema,
            description: 'required',
            reproduce: 'required',
            expected: 'required'
        }
    }

    getMessage(): string { return '' }
}

export type { Schema, Feedback, FeedbackForm }
export { FeedbackType, FeedbackFormClassic, FeedbackFormBug }