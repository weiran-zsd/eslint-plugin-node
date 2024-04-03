declare global {
    interface ArrayConstructor {
        // https://github.com/microsoft/TypeScript/issues/17002
        isArray(arg: ReadonlyArray<unknown> | unknown): arg is ReadonlyArray<unknown>
    }
}

export {}
