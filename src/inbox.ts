import { mailParser } from "./email";

function getGmId(): string {
  // returns gmID which exsits in script tag
  let gmId: string = "";
  const scripts = document.querySelectorAll<HTMLInputElement>("script");
  scripts.forEach((ele) => {
    if (ele.hasAttribute("nonce") && ele.innerHTML.startsWith("\n_GM_setData")) {
      let script: string = ele.innerHTML;
      let obj: GmSetdata = JSON.parse(script.substring(script.indexOf("(") + 1, script.lastIndexOf(")")));

      Object.keys(obj).forEach((a) => {
        if (Array.isArray(obj[a])) {
          gmId = obj[a][2];
        }
      })
    }
  });

  return gmId;
}

function getThreadList(): EmailThread[] {
  let threadList: EmailThread[] = [];
  if (document.querySelectorAll("table") !== null) {
    let tbody = document.querySelectorAll<HTMLInputElement>("tbody");
    tbody.forEach((ele) => {
      let span = ele.querySelectorAll<HTMLInputElement>("span");
      span.forEach((ele2) => {
        if (ele2.hasAttribute("data-thread-id")) {
          let threadId: string = ele2.getAttribute("data-thread-id")!;
          let thraedEle: HTMLElement = ele2.parentElement!.parentElement!.parentElement!;
          if (threadList.filter((temp) => temp.id === threadId).length === 0) {
            threadList.push({ id: threadId, ele: thraedEle });
          }
        }
      });
    });
  }
  return threadList;
}

function getEmail(url: string): Promise<string> {
  return fetch(url)
    .then((res) => {
      if (res.status !== 200) {
        console.warn(res.status);
      }
      return res.text();
    })
    .then((text) => {
      return new DOMParser().parseFromString(text, "text/html");
    })
    .then((html) => {
      let rawEmail: string = "";
      try {
        rawEmail = html.getElementById("raw_message_text")!.innerHTML;
      } catch (e) {
        // console.error(e);
      }
      return rawEmail;
    });
}

function inbox() {
  // show ibe result at #inbox
  function isLoaded() {
    let threadList: EmailThread[] = getThreadList();
    let gmId: string = getGmId();
    for (let thread of threadList) {
      let mailUrl = `https://mail.google.com/mail/u/0/?ik=${gmId}&view=om&permmsgid=msg-${thread.id.substr(8)}`;
      getEmail(mailUrl)
        .then((raw: string): EmailHeader => {
          let parsedHeader: EmailHeader;
          if (raw === "") {
            // fetch again after 3 seconds
            setTimeout(() => {
              getEmail(mailUrl).then((raw) => {
                if (raw === "") {
                  // console.log(thread.id);
                  // thread.ele.style.backgroundColor = "yellow";
                  throw new Error(`failed to get source of email(${mailUrl})`);
                } else {
                  parsedHeader = mailParser(raw);
                }
              });
            }, 3000);
          }
          parsedHeader = mailParser(raw);
          return parsedHeader;
        })
        .then((parsed: EmailHeader) => {
          if (parsed["IBE-Verify"]) {
            if (parsed["IBE-Verify"].length === 1 && parsed["IBE-Verify"][0] === "ok") {
              thread.ele.style.backgroundColor = "green";
            } else {
              console.warn("failed to verify");
              thread.ele.style.backgroundColor = "red";
            }
          }
          if (parsed["Ibemail-Decrypted"]) {
            if (parsed["Ibemail-Decrypted"][0] === "true") {
              // console.log("dec ok");
            } else {
              // console.log("dec failed");
            }
          }
        })
        .catch((e: Error) => console.error(e));
    }
  }
  // not good implement
  setTimeout(isLoaded, 2000);
}

export { inbox };
