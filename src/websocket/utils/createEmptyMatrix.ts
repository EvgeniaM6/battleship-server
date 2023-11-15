export const createEmptyMatrix = <T>(elem: T): T[][] => {
  const shipsMatrix: T[][] = [];

  for (let index = 0; index < 10; index++) {
    shipsMatrix.push([]);
  }

  shipsMatrix.map((matrixRow: T[]) => {
    for (let index = 0; index < 10; index++) {
      matrixRow.push(elem);
    }
  });

  return shipsMatrix;
};
