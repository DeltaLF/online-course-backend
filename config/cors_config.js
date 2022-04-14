const whiteList = [
  "https://velvety-kulfi-650427.netlify.app",
  "http://localhost:3000",
];

module.exports = corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    if (whiteList.indexOf(origin) !== -1) {
      // only allow origin in white list
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
