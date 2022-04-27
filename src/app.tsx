import React, { useCallback, useEffect, useState } from "react";
import { GameOverComponent } from "./game-over-component";
import { SquareComponent } from "./square-component";

function App() {
    const [broadData, setBroadData] = useState([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [newSquare, setNewSquare] = useState(0);

    const excludeIndex: number[] = [];
    let isAddNewIndex = true; // 是否添加新的方块
    const size = Math.sqrt(broadData.length);

    const generateRandomIndex = (rangeValue: number, excludeValue: number[]): number => {
        const randomIndex = Math.floor(Math.random() * rangeValue);

        // 不匹配数组中不包含随机数
        if (!excludeValue.includes(randomIndex)) {
            return randomIndex;
        }

        return generateRandomIndex(rangeValue, excludeValue);
    };

    // 更新broadData
    useEffect(() => {
        // 生成种子方块的index
        const seedIndex = generateRandomIndex(broadData.length, excludeIndex);

        broadData[seedIndex] = 1;
        excludeIndex.push(seedIndex);

        const newIndex = generateRandomIndex(broadData.length, excludeIndex);
        if (newIndex === undefined) {
            // TODO:gameover
            setIsGameOver(true);
        }
        broadData[newIndex] = 1;
        excludeIndex.push(newIndex);
        setBroadData(broadData.slice());

        // 棋盘获取焦点
        const broad = document.querySelector(".background-grid") as HTMLDivElement;
        broad?.focus();
    }, []);

    // 垂直移动
    const verticalMove = (code: number) => {
        const lastBroadData = [...broadData];
        isAddNewIndex = true;
        // 清空保存已有方块的位置
        excludeIndex.length = 0;

        let isStartFromHead = true;
        if (code === 38) {
            isStartFromHead = true;
        } else {
            isStartFromHead = false;
        }

        for (let i = 0; i < size; i++) {
            let colunmData = [];
            for (let j = 0; j < size; j++) {
                // 得到每一列的数据
                colunmData.push(broadData[size * j + i]);
            }

            let haveValueData: number[] = [];
            colunmData.forEach((item, index) => {
                if (item !== 0) {
                    haveValueData.push(item);
                    // 取出不为0的值后，剩下的全为O
                    colunmData[index] = 0;
                }
            });

            if (haveValueData.length > 1) {
                if (code === 38) {
                    // 往上相加
                    haveValueData = calcAdd(haveValueData);
                } else {
                    // 往下相加
                    haveValueData = calcAdd(haveValueData.reverse());
                    haveValueData.reverse();
                }
            }
            // 移动位置后的列数据
            colunmData = fillRowData(colunmData, haveValueData, isStartFromHead);

            //const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            // 将更改后的数据放入新得board数组中
            colunmData.forEach((item: number, index: number) => {
                broadData[size * index + i] = item;
                // 保存更改位置后，值不为0的index
                if (item !== 0) {
                    excludeIndex.push(size * index + i);
                }
            });
        }

        if (compareArrays(lastBroadData, broadData)) {
            isAddNewIndex = false;

            // 位置已满，且无可移动的值
            if (!broadData.includes(0)) {
                setIsGameOver(true);
                console.log(isGameOver);
            }
            return;
        }

        //animationArr = valueGetBiggerArr(lastBroadData, broadData);
        // 新增方块
        /* const newIndex = generateRandomIndex(broadData.length, excludeIndex);
        if (newIndex === undefined) {
          // TODO:gameover
        }
        broadData[newIndex] = 1;
        excludeIndex.push(newIndex); */
        //animationArr.push(newIndex);
        setBroadData(broadData.slice());
    };

    // 水平移动
    const horizontalMove = (code: number) => {
        const lastBroadData = [...broadData];
        // 清空保存已有方块的位置
        excludeIndex.length = 0;
        isAddNewIndex = true;

        let isStartFromHead = true;
        if (code === 37) {
            isStartFromHead = true;
        } else {
            isStartFromHead = false;
        }

        for (let i = 0; i < size; i++) {
            // 获取每一行
            let rowData = broadData.slice(i * size, (i + 1) * size);

            // 将每行中不为0的值保存在数组中
            let haveValueData: number[] = [];
            rowData.forEach((item, index) => {
                if (item !== 0) {
                    haveValueData.push(item);
                    // 取出不为0的值后，剩下的全为O
                    rowData[index] = 0;
                }
            });

            if (haveValueData.length > 1) {
                if (code === 37) {
                    // 往左相加
                    // 得到相加后的数组
                    haveValueData = calcAdd(haveValueData);
                } else {
                    // 往右相加
                    // 倒序
                    haveValueData = calcAdd(haveValueData.reverse());
                    haveValueData.reverse();
                }
            }

            // 移动位置后的行数据
            rowData = fillRowData(rowData, haveValueData, isStartFromHead);

            // 将更改后的数据放入新得board数组中
            rowData.forEach((item, index) => {
                broadData[i * size + index] = item;
                // 保存更改位置后，值不为0的index
                if (item !== 0) {
                    excludeIndex.push(i * size + index);
                }
            });
        }

        if (compareArrays(lastBroadData, broadData)) {
            isAddNewIndex = false;
            // 位置已满，且无可移动的值
            if (!broadData.includes(0)) {
                setIsGameOver(true);
                console.log(isGameOver);
            }
            return;
        }

        // 新增方块
        /* const newIndex = generateRandomIndex(broadData.length, excludeIndex);
        if (newIndex === undefined) {
          // TODO:gameover
        }
        // animationArr = valueGetBiggerArr(lastBroadData, broadData);
    
        broadData[newIndex] = 1;
        excludeIndex.push(newIndex); */
        //animationArr.push(newIndex);
        setBroadData(broadData.slice());
    };

    // 加法计算
    const calcAdd = (arr: number[]) => {
        const newArr = [];
        while (arr.length >= 1) {
            if (arr.length === 1) {
                newArr.push(arr[0]);
                break;
            }
            // 截取两位
            const calcData = arr.slice(0, 2);

            if (calcData[0] === calcData[1]) {
                newArr.push(calcData[0] + calcData[1]);
                arr.splice(0, 2);
            } else {
                newArr.push(calcData[0]);
                arr.splice(0, 1);
            }
        }
        return newArr;
    };

    // 行数据填充
    const fillRowData = (oldRow: number[], dataArr: number[], isStartFromHead: boolean) => {
        // 从头部开始填充
        if (isStartFromHead) {
            dataArr.forEach((item, index) => {
                oldRow[index] = item;
            });
            return oldRow;
        }

        dataArr.reverse().forEach((item, index) => {
            oldRow[oldRow.length - 1 - index] = item;
        });
        return oldRow;
    };

    // 判断两个数组是否一致
    const compareArrays = (arr1: number[], arr2: number[]) => {
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

    // 键盘按键弹起事件
    const doKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.repeat) {
            return;
        }
        switch (e.keyCode) {
            case 37:
                horizontalMove(e.keyCode);
                break;
            case 38:
                verticalMove(e.keyCode);
                break;
            case 39:
                horizontalMove(e.keyCode);
                break;
            case 40:
                verticalMove(e.keyCode);
                break;
            default:
                break;
        }
    }, []);
    const doKeyUp = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.repeat) {
            return;
        }

        // 新增方块
        if (isAddNewIndex) {
            const newIndex = generateRandomIndex(broadData.length, excludeIndex);
            if (newIndex === undefined) {
                // TODO:gameover
                setIsGameOver(true);
                console.log(isGameOver);
                return;
            }
            // 当size>4时，添加的 方块随机值为1或者2
            if (size >= 4) {
                broadData[newIndex] = Math.floor(Math.random() * 2 + 1);
            } else {
                broadData[newIndex] = 1;
            }

            excludeIndex.push(newIndex);
            // 标记
            setNewSquare(newIndex);
        }

        setBroadData(broadData.slice());
    }, []);

    const doTryAgain = useCallback(() => {
        // 重置棋盘
        broadData.forEach((item, index) => {
            broadData[index] = 0;
        });
        excludeIndex.length = 0;
        setIsGameOver(false);

        // 生成种子方块的index
        const seedIndex = generateRandomIndex(broadData.length, excludeIndex);

        broadData[seedIndex] = 1;
        excludeIndex.push(seedIndex);

        const newIndex = generateRandomIndex(broadData.length, excludeIndex);
        if (newIndex === undefined) {
            // TODO:gameover
            setIsGameOver(true);
        }
        broadData[newIndex] = 1;
        excludeIndex.push(newIndex);
        setBroadData(broadData.slice());

        // 棋盘获取焦点
        const broad = document.querySelector(".background-grid") as HTMLDivElement;
        broad.focus();
    }, []);


    const rows = [];
    // 生成棋盘
    for (let i = 0; i < broadData.length; i += size) {
        let columns = [];
        for (let j = 0; j < size; j++) {
            const column = (
                <div className="grid-cell" key={i + j}>
                    {broadData[i + j] > 0
                        && <SquareComponent value={broadData[i + j]} newSquare={newSquare === i + j ? true : false} />
                    }
                </div>
            );
            columns.push(column);
        }

        const row = (
            <div className="grid-row" key={i}>
                {columns}
            </div>
        );
        rows.push(row);
    }

    return (
        <React.Fragment>
            <div
                className="background-grid"
                onKeyUp={doKeyUp}
                onKeyDown={doKeyDown}
                tabIndex={0}
            >
                {rows}
            </div>
            {isGameOver && <GameOverComponent tryAgain={doTryAgain} />}
        </React.Fragment>
    );
}
export default App;