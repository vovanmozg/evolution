export default {
  WIDTH: 100,
  HEIGHT: 50,
  getRandom: (arr) => {
    return arr[Math.floor((Math.random() * arr.length))];
  }
};
