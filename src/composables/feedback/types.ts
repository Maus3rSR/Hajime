type Schema = Record<string, string>
type Feedback = FeedbackClassic | FeedbackBug
enum FeedbackType { CLASSIC, BUG }

/**
 * @todo Migrate to lib
 */
interface Jsonable {
    toJson(): string
}

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

const baseSchema: Schema = { email: 'email' }

abstract class FeedbackForm<T extends Feedback> implements Jsonable {
    schema: Schema
    feedback?: T

    get values(): Record<string, string | undefined> {
        return {
            email: this.feedback?.email,
            version: this.feedback?.version,
            os: this.feedback?.os,
            screen: this.feedback?.screen,
            message: this.getMessage()
        }
    }

    constructor() {
        this.schema = baseSchema
    }

    abstract getMessage(): string

    toJson() {
        return JSON.stringify(this.values)
    }
}

class FeedbackFormClassic extends FeedbackForm<FeedbackClassic> {
    fields: Array<string> = []

    constructor() {
        super()
        
        this.schema = {
            ...this.schema,
            message: 'required'
        }
    }

    getMessage(): string { return this.feedback?.message || '' }
}

class FeedbackFormBug extends FeedbackForm<FeedbackBug> {
    constructor() {
        super()

        this.schema = {
            ...this.schema,
            description: 'required',
            reproduce: 'required',
            expected: 'required'
        }
    }

    getMessage(): string { return 'to implement' }
}

export type { Schema, Feedback, FeedbackForm }
export { FeedbackType, FeedbackFormClassic, FeedbackFormBug }