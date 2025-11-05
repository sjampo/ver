import config from "./verconfig.json" with {type: "json"}

const documentInitVers = document.querySelectorAll("ver")

// const verAddedEvent = new CustomEvent("verAdded", {
    
// })

class VerMain {
    loadText(fileName, callback) {
        fetch(config.root + "/" + fileName).then(content => content.text().then(text => {
            callback(text)
        }))
    }
    
    loadTextRecursive(fileName, parent, forNext) {
        fetch(config.root + "/" + fileName).then(content => content.text().then(text => {
            parent.innerHTML = '<div class="vercontainer"></div>'
            const container = parent.querySelector(".vercontainer")
            container.innerHTML = text
            container.querySelectorAll("ver").forEach(childVer => this.wake(childVer, forNext))
        }))
    }
    
    bindToClick(ver, callback) {
        ver.addEventListener("click", callback)
    }

    summon(attributes, parent) {
        const ver = document.createElement("ver")
        Object.entries(attributes).forEach(([k, v]) => {
            ver.setAttribute(k, v)
        })
        if (parent) {
            parent.appendChild(ver)
        }
        return ver
    }

    wake(ver, fromLast) {
        const originalDisplay = ver.style.display
        ver.style.display = "hidden"

        let thisVer = {
            type: null,
            val: null,
        }
        let forNext = {
            ver: ver
        }

        const attrNames = ver.getAttributeNames()
        attrNames.forEach(att => {
            if (att == "type" || att == "val") {
                thisVer[att] = ver.getAttribute(att)
            } else {
                forNext[att] = ver.getAttribute(att)
            }
        })

        switch (thisVer.type) {
            case "insert":
                this.loadTextRecursive(thisVer.val, ver, forNext)
                break
                
            case "get":
                if (fromLast) {
                    let val = fromLast[thisVer.val]
                    val ? ver.innerHTML = val : console.warn("Missing attribute: \"" + thisVer.val + "\"\nParent:", fromLast.ver, "\nChild:", ver)
                } else {
                    console.warn("First generation ver cannot have type \"get\".\nCulprit:", ver)
                }
                break
        }

        ver.style.display = originalDisplay
    }
}

const verMaster = new VerMain()

// document.addEventListener("verAdded")

documentInitVers.forEach(verMaster.wake.bind(verMaster))

export default verMaster
