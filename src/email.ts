function mailParser(email: string): EmailHeader {
  let headerStr: string = email.substring(0, email.indexOf("\n\n"));
  let headerList: EmailHeader = {};
  let revHeader: string[] = headerStr.split("\n").reverse();

  revHeader.forEach((line, index) => {
    if (line[0] === " ") {
      revHeader[index + 1] += line.trim();
    } else {
      let colon: number = line.indexOf(":");
      let tag: string = line.substring(0, colon);
      let content: string = line.substring(colon + 2);
      if (headerList[tag]) {
        headerList[tag].push(content);
      } else {
        headerList[tag] = [content];
      }
    }
  });

  return headerList;
}

// add row in email source page
function insertTable(table: Element, tag: string, value: string) {
  let tr: HTMLTableRowElement = document.createElement("tr");
  table.appendChild(tr);

  let th: HTMLTableCellElement = document.createElement("th");
  th.innerHTML = `${tag}:`;
  tr.appendChild(th);

  let td: HTMLTableCellElement = document.createElement("td");
  td.innerHTML = value;
  tr.appendChild(td);
}

function showIbeResult() {
  let rawEmail: string = document.getElementById("raw_message_text")!.innerHTML;
  let parsed: EmailHeader = mailParser(rawEmail);

  const table = document.querySelector<HTMLInputElement>(".top-area table tbody");
  if (!table) {
    console.warn("no table");
  }
  const ibeDecrypted: string = "Ibemail-Decrypted";
  const ibeVerify: string = "IBE-Verify";

  if (parsed[ibeDecrypted] && parsed[ibeDecrypted].length === 1) {
    insertTable(table!, ibeDecrypted, parsed[ibeDecrypted][0]);
  }
  if (parsed[ibeVerify] && parsed[ibeVerify].length === 1) {
    insertTable(table!, ibeVerify, parsed[ibeVerify][0]);
  }
}

export { mailParser, showIbeResult };
