function resolve(domain: string, type: string) {
  let ibeDomain: string = "__ibemailkey." + domain;
  let url: string = `https://dns.google.com/resolve?name=${ibeDomain}&type=${type}`;
  let iberecord: { [key: string]: string } = {};

  fetch(url)
    .then(res => res.json())
    .then(data => {
      for (const ans of data["Answer"]) {
        for (let d of ans["data"].split(" ")) {
          let splitted = d.replace(";", "").split("=");
          iberecord[splitted[0]] = splitted[1];
        }
      }
      let keys: string[] = Object.keys(iberecord);
      if (keys.includes("ver") && keys.includes("date") && keys.includes("key")) {
        console.log(`${domain} supports IBE.`);
        // alert(`${domain} supports IBE.`)
      }
    })
}

export { resolve }
