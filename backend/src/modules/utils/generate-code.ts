const generateCheckSum = (num: number) => {
  let initialNum = num;
  initialNum = Math.floor(Math.abs(initialNum));
  let checkSum = 0;
  while (initialNum > 0) {
    checkSum += initialNum % 10;
    initialNum = Math.floor(initialNum / 10);
  }
  return checkSum;
};

const generateDeliveryCode = (): number => {
  return Math.floor(1000 + Math.random() * 9000);
};

const generateCode = () => {
  const code = generateDeliveryCode();
  const checkSum = generateCheckSum(code);
  return `${code}${checkSum}`;
};

export default generateCode;
