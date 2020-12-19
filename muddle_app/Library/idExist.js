const idExist = (array, id) => {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element.id === id) return true;
  }
  return false;
};

export default idExist;
