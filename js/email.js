function mailParser(email) {
    /**
     * @param {string} email - source of email
     * @returns {[{string: [string]}]} headerList - [{headertag: [content]}]
    */

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
    /**
     * insert decrypt and verify results
     * @param {Element} table - email description table
     * @param {string} tag - ibe header tag
     * @param {string} value - ibe result
     */
    let tr = document.createElement("tr");
    table.appendChild(tr);

    let th = document.createElement("th");
    th.innerHTML = `${tag}:`;
    tr.appendChild(th);

    let td = document.createElement("td");
    td.innerHTML = value;
    tr.appendChild(td);
}


function showIbeResult() {
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
