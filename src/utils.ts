export namespace Utils {
    // 判断两个数组是否一致
    export const compareArrays = (arr1: number[], arr2: number[]) => {
        let isSame = true;
        if (arr1.length !== arr2.length) {
            isSame = false;
            return isSame;
        }
        arr1.forEach((item, index) => {
            if (arr2[index] !== item) {
                isSame = false;
            }
        });
        return isSame;
    };

    // 产生随机数
    export const generateRandomIndex = (rangeValue: number, excludeValue: number[]): number => {
        const randomIndex = Math.floor(Math.random() * rangeValue);

        if (excludeValue.length >= rangeValue) {
            return Number.NaN;
        }

        // 不匹配数组中不包含随机数
        if (!excludeValue.includes(randomIndex)) {
            return randomIndex;
        }

        return generateRandomIndex(rangeValue, excludeValue);
    };
}

