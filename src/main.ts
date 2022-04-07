import { showIbeResult } from "./email";
import { inbox, inMail } from "./inbox";
import { resolve } from "./dns";

function hashInbox(url: string) {
  let u = new URL(url);
  if (u.hash === "#inbox") {
    // まだ色をつけていないなら
    // inbox();
    // なにかフラグを立てておく
  } else if (u.hash.match(/#inbox\/[\w]+/)) {
    inMail();
  }
}

function main() {
  resolve("jshimizu.dev", "TXT");

  let url: URL = new URL(document.URL);
  let params: URLSearchParams = url.searchParams;
  if (url.origin + url.pathname === "https://mail.google.com/mail/u/0/") {
    // URLが変更されたらevent
    addEventListener("hashchange", function(event: HashChangeEvent) {
      hashInbox(event.newURL);
    });

    // url 初期値での動作
    if (url.hash === "#inbox") {
      inbox();
    } else if (url.hash.match(/#inbox\/[\w]+/)) {
      inMail()
    } else if (params.get("permmsgid") && params.get("ik") && params.get("view")) {
      showIbeResult();
    }
  }
}

main();
