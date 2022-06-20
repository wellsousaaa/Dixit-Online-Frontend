const images = Array.from({ length: 176 }).map((_, i) => ({
  number: i + 1,
  url: `https://firebasestorage.googleapis.com/v0/b/dixit-3ac0f.appspot.com/o/img${
    i + 1
  }.png?alt=media`,
}));

export function getImage(numbers) {
  const toMap = numbers;
  let result = [];
  toMap.forEach((number) => {
    result.push(images[number - 1]);
  });
  return result;
}

//fix
