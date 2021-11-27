function mailParser(email) {
    let headerStr = email.substr(0, email.indexOf("\n\n"));
    let headerList = {};
    let revHeader = headerStr.split("\n").reverse();

    revHeader.forEach((line, index) => {
        if (line[0] === " ") {
            revHeader[index + 1] += line.trim();
        } else {
            colon = line.indexOf(":");
            let tag = line.substr(0, colon);
            let content = line.substr(colon + 2);
            if (headerList[tag]) {
                headerList[tag].push(content);
            } else {
                headerList[tag] = [content];
            }
        }
    });

    return headerList;
}


function insertTable(table, tag, value) {
    let tr = document.createElement("tr");
    table.appendChild(tr);

    let th = document.createElement("th");
    th.innerHTML = tag + ":";
    tr.appendChild(th);

    let td = document.createElement("td");
    td.innerHTML = value;
    tr.appendChild(td);
}

function getThreadIdList() {
    let threadIdList = [];
    if (document.querySelectorAll("table") !== null) {
        tbody = document.querySelectorAll("tbody");
        for (let ele of tbody) {
            let span = ele.querySelectorAll("span");
            for (let ele2 of span) {
                if (ele2.hasAttribute("data-thread-id")) {
                    let threadId = ele2.getAttribute("data-thread-id");
                    if (threadIdList.indexOf(threadId) === -1) {
                        threadIdList.push(threadId);
                    }
                }
            }
        }
    }
    return threadIdList;
}

function inbox() {
    function isLoaded() {
        let threadIdList = getThreadIdList();
        console.log(threadIdList);
    }
    // not good implement
    setTimeout(isLoaded, 1000);
}


function origMsg() {
    // insert decrypt and verify results
    let rawEmail = document.getElementById("raw_message_text").innerHTML;
    let parsed = mailParser(rawEmail);

    const table = document.querySelector(".top-area table tbody");
    const ibeDecrypted = "Ibemail-Decrypted"
    const ibeVerify = "IBE-Verify"

    if (parsed[ibeDecrypted] && parsed[ibeDecrypted].length === 1) {
        insertTable(table, ibeDecrypted, parsed[ibeDecrypted][0]);
    }
    if (parsed[ibeVerify] && parsed[ibeVerify].length === 1) {
        insertTable(table, ibeVerify, parsed[ibeVerify][0]);
    }
}

function main() {
    if (document.URL.match(/https:\/\/mail\.google\.com\/mail\/u\/0\/#inbox.*/)) {
        // inbox
        inbox();
    } else if (document.URL.match(/https:\/\/mail\.google\.com\/mail\/u\/0\/\?ik=.+/)) {
        // view mail source
        origMsg();
    }
}

main();

// https://mail.google.com/mail/u/0/?ik={GM_ID}&view=om&permmsgid=msg-f%3A{\d}
// span data-threadid="#thread-f:{\d}" ここでthreadIDを取得
