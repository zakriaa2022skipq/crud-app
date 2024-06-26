const winston = require("winston");
const { json, prettyPrint, combine, timestamp } = winston.format;

winston.loggers.add("AuthLogger", {
  level: "info",
  format: combine(json(), timestamp(), prettyPrint()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "auth.log" }),
  ],
  defaultMeta: { service: "AuthService" },
});
