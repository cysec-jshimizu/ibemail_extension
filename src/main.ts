import { showIbeResult } from "./email";
import { inbox } from "./inbox";

function main() {
  if (document.URL.match(/https:\/\/mail\.google\.com\/mail\/u\/0\/.*#inbox.*/)) {
    inbox();
  } else if (document.URL.match(/https:\/\/mail\.google\.com\/mail\/u\/0\/\?ik=.+/)) {
    showIbeResult();
  }
}

main();
