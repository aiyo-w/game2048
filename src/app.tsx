import React, { useCallback, useEffect, useState } from "react";
import { GameOverComponent } from "./game-over-component";
import { SquareComponent } from "./square-component";

enum Operate {
    Left = 'Left',
    Right = 'Right',
    Up = 'Up',
    Down = 'Down'
}

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

    // 移动方法
    const move = (operation: Operate) => {
        const lastBroadData = [...broadData];
        isAddNewIndex = true;
        // 清空保存已有方块的位置
        excludeIndex.length = 0;

        const datas = changeData(operation, broadData);
        datas.forEach((item, index) => {
            broadData[index] = item;
            if (item !== 0) {
                excludeIndex.push(index);
            }
        });

        if (compareArrays(lastBroadData, broadData)) {
            isAddNewIndex = false;
            // 位置已满，且无可移动的值
            if (!broadData.includes(0)) {

                let otherwise: Operate = operation;
                // 判断当前是什么操作
                if (operation === Operate.Down || operation === Operate.Up)
                    otherwise = Operate.Left;
                else
                    otherwise = Operate.Up;

                const changeDatas = changeData(otherwise, broadData);
                if (compareArrays(changeDatas, broadData))
                    setIsGameOver(true);
                else
                    setIsGameOver(false);
            }
            return;
        }

        setBroadData(broadData.slice());
    };

    // 数据变换
    const changeData = (operation: Operate, data: number[]): number[] => {
        const newData: number[] = [];
        let isStartFromHead = operation === Operate.Left || operation === Operate.Up
            ? true : false;

        for (let i = 0; i < size; i++) {

            // 得到每一行数据
            let rowData: number[] = [];
            if (operation === Operate.Up || operation === Operate.Down) {
                for (let j = 0; j < size; j++) {
                    // 得到每一列的数据
                    rowData.push(broadData[size * j + i]);
                }
            }
            else {
                rowData = data.slice(i * size, (i + 1) * size);
            }

            let haveValueData: number[] = [];
            rowData.forEach((item, index) => {
                if (item !== 0) {
                    haveValueData.push(item);
                    // 取出不为0的值后，剩下的全为O
                    rowData[index] = 0;
                }
            });

            if (haveValueData.length > 1) {
                if (operation === Operate.Left || operation === Operate.Up) {
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

            rowData = fillRowData(rowData, haveValueData, isStartFromHead);

            rowData.forEach((item: number, index: number) => {
                if (operation === Operate.Up || operation === Operate.Down)
                    newData[size * index + i] = item;
                else
                    newData[i * size + index] = item;
            });
        }

        return newData;
    }

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
        // TODO:值转换
        let operation: Operate = undefined as any;
        switch (e.keyCode) {
            case 37:
            case 65:
                operation = Operate.Left;
                break;
            case 38:
            case 87:
                operation = Operate.Up;
                break;
            case 39:
            case 68:
                operation = Operate.Right;
                break;
            case 40:
            case 83:
                operation = Operate.Down;
                break;
            default:
                break;
        }
        // TODO:调移动方法
        if (operation)
            move(operation);
    }, []);
    const doKeyUp = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.repeat) {
            return;
        }

        const keycodes: number[] = [37, 38, 39, 40, 65, 87, 68, 83];
        if (!keycodes.includes(e.keyCode)) return;

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