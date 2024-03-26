// Convert a UTC DateTime to ISO Local DateTime
const toISOLocalDateTime = (utcDateTime) => {
    localDateTime = new Date(utcDateTime - utcDateTime.getTimezoneOffset() * 60000);
    return localDateTime.toISOString().slice(0,-8);
}

// Clear all current Address Match Elements
const removeAddressMatches = (elementID) => {
    const addressDetails = document.querySelector(`#${elementID}`);
    let childNodes = addressDetails.querySelectorAll("div");

    for(let lastNode = childNodes.length - 1; lastNode > 0; lastNode--) {
        let childNode = childNodes[lastNode];
        addressDetails.removeChild(childNode);
    }

}

// This function fetches a list of addresses that match addressPart.
// When the list of addresses return, create a <div> with an address, give it an 
// id value and add an event listener for click events.
const matchAddresses = (addressPart, elementID) => {
    // Fetch matches for addressPart from the address endpoint using the fetch API
    fetch(`/address/${addressPart}`).then((response) => {
        // Throw an error if the response returns status outside range 200-299
        if(!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return response.json();
    }).then((json) => {
        // Get the list of addresses
        const addresses = json.addresses;

        // For each address returned, create a <div> element with the address data
        // and append it to the element identified by elementID
        let addressCount = 0;
        addresses.forEach(element => {
            addressCount++;
            let div = document.createElement("div");
            div.id = elementID + 'addressMatch' + addressCount;
            div.append(element.address);
            div.addEventListener("click", () => {
                alert(`lat: ${element.lat}, lon: ${element.lon}`)
                const addressDetails = document.querySelector(`#${elementID}`);
                console.log(div.parentElement.firstElementChild.lastElementChild.value);
                div.parentElement.firstElementChild.lastElementChild.value = element.address;
                removeAddressMatches(elementID);
            });
            const addressDetails = document.getElementById(elementID);
            addressDetails.appendChild(div);
        });
    }).catch((error) => {
        console.log(`index.html: ${error}`);
    });
}

// An async funtion to initialize the page.
const initPage = async () => {
    const dateControl = document.getElementById("departureDateTime");
    dateControl.value = toISOLocalDateTime(new Date());
    console.log(dateControl.value);

    /**
     * Create an event listener for departure address that processes user input.
     */
    const departureAddress = document.getElementById("departureAddress1");
    departureAddress.addEventListener("input", () => {
        const addressPart = departureAddress.value;
        console.log(addressPart);
        if(addressPart.length % 3 != 0) return;

        removeAddressMatches("departureDetails");

        matchAddresses(addressPart, "departureDetails");

    });

    /**
     * Create an event listener for destination address that processes user input.
     */
    const destinationAddress = document.getElementById("destinationAddress1");
    destinationAddress.addEventListener("input", () => {
        const addressPart = destinationAddress.value;
        console.log(addressPart);
        if(addressPart.length % 3 != 0) return;

        removeAddressMatches("destinationDetails");

        matchAddresses(addressPart, "destinationDetails");
    });

}

// Initialize the entire User Interface.
const initUI = () => {
    initPage();

}

// Add a listener to initialize the app when the DOM Content is fully loaded.
document.addEventListener('DOMContentLoaded', initUI, false);