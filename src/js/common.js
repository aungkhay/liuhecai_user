export const orderZodiac = (currentId) => {
    const result = [];

    // currentId down to 1
    for (let i = currentId; i >= 1; i--) {
        result.push(i);
    }

    // 12 down to currentId + 1
    for (let i = 12; i > currentId; i--) {
        result.push(i);
    }

    return result;
}