function getGmId() {
    /**
     * returns gmID which exsits in script tag
     * @returns {string} gmId
     */
    let gmId = "";
    let scr = document.querySelectorAll("script");
    for (let ele of scr) {
        if (ele.hasAttribute("nonce") && ele.innerHTML.startsWith("\n_GM_setData")) {
            let script = ele.innerHTML
            let obj = JSON.parse(script.substring(script.indexOf("(") + 1, script.lastIndexOf(")")));
            gmId = obj[Object.keys(obj)[0]][2];
        }
    }

    return gmId;
}


function getThreadIdList() {
    /**
     * @returns {[string]} thraedIdList - #thread-f:1234567890
     */
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

function getEmail(url) {
    /**
     * Returns raw email string which gotten from url
     * @param {string} url - url ofsource of email
     * @returns {Promise} headerList - raw email string
    */

    return fetch(url)
        .then(res => {
            if (res.status !== 200) {
                console.warn(res.status);
            }
            return res.text();
        })
        .then(text => {
            return new DOMParser().parseFromString(text, "text/html");
        })
        .then(
            html => {
                let rawEmail = "";
                try {
                    rawEmail = html.getElementById("raw_message_text").innerHTML;
                } catch (e) {
                    console.error(e);
                }
                return rawEmail
            }
        )

}


function inbox() {
    // show ibe result at #inbox
    function isLoaded() {
        let threadIdList = getThreadIdList();
        let gmId = getGmId();
        for (let threadId of threadIdList) {
            let mailUrl = `https://mail.google.com/mail/u/0/?ik=${gmId}&view=om&permmsgid=msg-${threadId.substr(8)}`;
            getEmail(mailUrl)
                .then(raw => {
                    if (raw === "") {
                        throw "failed to get source of email"
                    }
                    return mailParser(raw);
                })
                .then(parsed => {
                    console.log(parsed["From"][0]);
                    if (parsed["IBE-Verify"]) {
                        // console.log(parsed["IBE-Verify"][0] === "ok");
                        console.log(threadId);
                    }
                })
                .catch(e => console.log(e));
        }
    }
    // not good implement
    setTimeout(isLoaded, 2000);
}

