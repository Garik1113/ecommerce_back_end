export const asyncForEach = async(array: any[], callBack: any ) => {
    for (let index = 0; index < array.length; index++) {
        await callBack(array[index])
    }
}