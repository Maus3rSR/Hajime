enum FeedbackType { CLASSIC, BUG }

type Schema = Record<string, string>

type Feedback = FeedbackClassic | FeedbackBug

type FeedbackResponseError = {
    email?: string,
    message?: string
}

type FeedbackResponse = {
    success: boolean,
    issue_url?: string,
    errors?: FeedbackResponseError
}

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
    expected: string,
    screenshot: File,
}

const baseSchema: Schema = { email: 'email' }

abstract class FeedbackForm<T extends Feedback> implements Jsonable {
    schema: Schema
    feedback?: T

    get values(): Record<string, string | File | undefined> {
        return {
            email: this.feedback?.email,
            version: this.feedback?.version,
            os: this.feedback?.os,
            screen: this.feedback?.screen,
            message: this.getMessage(),
        }
    }

    constructor() {
        this.schema = baseSchema
    }

    abstract getMessage(): string

    toFormData(): FormData {
        const formData = new FormData()

        for (const [key, value] of Object.entries(this.values))
            formData.append(key, value || '')

        return formData
    }

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
            expected: 'required',
            screenshot: 'image'
        }
    }

    get values(): Record<string, string | File | undefined> {
        return {
            ...super.values,
            screenshot: this.feedback?.screenshot
        }
    }

    getMessage(): string {
        return !this.feedback ? '' : `

### Describe the bug

${this.feedback.description}

### Steps to reproduce the behavior

${this.feedback.reproduce}

### Expected behavior

${this.feedback.expected}
        `
    }
}

export type { Schema, Feedback, FeedbackForm, FeedbackResponse }
export { FeedbackType, FeedbackFormClassic, FeedbackFormBug }