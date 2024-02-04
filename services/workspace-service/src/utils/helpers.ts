export const generateDbKey = (pk: string, sk?: string) => {
    return {
        PK: `USER#${pk}`,
        SK: `WORKSPACE#${sk || ""}`,
    }
}