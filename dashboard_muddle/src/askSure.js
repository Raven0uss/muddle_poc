const askSure = (message, callback) => {
  if (window.confirm(message)) {
    callback();
  } else {
    // Do nothing!
    // console.log("Thing was not saved to the database.");
  }
};

export default askSure;
