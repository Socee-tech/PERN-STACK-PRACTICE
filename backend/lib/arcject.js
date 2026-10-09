import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import dotenv from "dotenv";

dotenv.config();

// init arcjet with your API key and configure the characteristics and rules for your application. The characteristics are used to identify the traffic, and the rules are used to determine how to handle the traffic.
export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // shield protects your endpoints from malicious traffic, such as bots, scrapers, and other automated attacks. It uses a combination of rate limiting, IP reputation, and behavioral analysis to identify and block malicious requests.
    // shield protects your app from common attacks, such as SQL injection, cross-site scripting (XSS), and other web application attacks. It uses a combination of signature-based detection, anomaly detection, and behavioral analysis to identify and block malicious requests.
    shield({ mode: "LIVE" }),
    // detectBot detects and blocks known bots from accessing your application.
    // block bots except for search engine crawlers, such as Googlebot, Bingbot, and Yahoo! Slurp. It uses a combination of IP reputation, user-agent analysis, and behavioral analysis to identify and block known bots.
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
      //   see the full list of categories here: https://arcjet.com/bot-list
    }),
    // there are many algorithms for rate limiting, such as token bucket, leaky bucket, fixed window, sliding window, and more. Each algorithm has its own advantages and disadvantages, and the choice of algorithm depends on the specific use case and requirements of the application.
    // Rate limiting is a technique used to control the amount of incoming traffic to your application. It helps prevent abuse, such as denial-of-service (DoS) attacks, and ensures that your application remains available to legitimate users.
    tokenBucket({
      mode: "LIVE",
      refillRate: 30,
      interval: 5,
      capacity: 20,
    }),
  ],
});
