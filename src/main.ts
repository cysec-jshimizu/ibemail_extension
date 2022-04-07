import { showIbeResult } from "./email";
import { inbox } from "./inbox";
import { resolve } from "./dns";

function main() {
  resolve("jshimizu.dev", "TXT");

  let url: URL = new URL(document.URL);
  let params: URLSearchParams = url.searchParams;
  if (url.origin + url.pathname === "https://mail.google.com/mail/u/0/") {
    if (url.hash === "#inbox") {
      inbox();
    } else if (params.get("permmsgid") && params.get("ik") && params.get("view")) {
      showIbeResult();
    }
  }
}

main();
