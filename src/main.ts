import { showIbeResult } from "./email";
import { inbox } from "./inbox";
import { resolve } from "./dns";

function main() {
  resolve("__ibemailkey.jshimizu.dev", "TXT");

  if (document.URL.match(/https:\/\/mail\.google\.com\/mail\/u\/0\/[\w]*#inbox[\w]*?/)) {
    inbox();
  } else if (document.URL.match(/https:\/\/mail\.google\.com\/mail\/u\/0\/\?ik=.+/)) {
    showIbeResult();
  }
}

main();
