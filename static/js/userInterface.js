// Convert a UTC DateTime to ISO Local DateTime
const toISOLocalDateTime = (utcDateTime) => {
    localDateTime = new Date(utcDateTime - utcDateTime.getTimezoneOffset() * 60000);
    return localDateTime.toISOString().slice(0,-8);
}

// Clear all current Address Match Elements in the given Address Section
const removeAddressMatches = (elementID) => {
    const addressMatchList = document.querySelector(`#${elementID}`);
    let childNodes = addressMatchList.querySelectorAll("div");

        // Remove all Address Matches from the given Address Section
        let childNode = addressMatchList.lastElementChild;
        while(childNode) {
            addressMatchList.removeChild(childNode);
            childNode = addressMatchList.lastElementChild;
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
        // and append it to the element identified by elementID.
        addresses.forEach(element => {

            // Create a div to hold an address match
            let div = document.createElement("div");
            div.append(element.address);

            // Add a click event listener to the div holding the current address match
            div.addEventListener("click", () => {

                // Traverse elements from the selected addressMatch to assign the value
                // of the selected match to the address input field element.
                const addressMatch = document.querySelector(`#${elementID}`);
                const addressDetails = addressMatch.parentElement;
                const addressInput = addressDetails.firstElementChild;
                const addressInputField = addressInput.lastElementChild;
                addressInputField.value = element.address;

                // Get the hidden latitude and longitude input fields on the html form.
                // Assign the values for element.lat and element.lon to latitude 
                // and longitude, respectively.
                const addressLocation = addressDetails.lastElementChild;
                const latitude = addressLocation.firstElementChild;
                latitude.value = element.lat;
                const longitude = addressLocation.lastElementChild;
                longitude.value = element.lon;

                console.log(`lat: ${latitude.value}, lon: ${longitude.value}`);

                // Remove all addressMatches after the user selects one.
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
    const dateControl = document.getElementById("departure_date");
    dateControl.value = toISOLocalDateTime(new Date());
    console.log(dateControl.value);

    /**
     * Create an event listener for departure address that processes user input.
     */
    const departureAddress = document.getElementById("departureAddress");
    departureAddress.addEventListener("input", () => {
        const addressPart = departureAddress.value;
        console.log(addressPart);
        if(addressPart.length % 3 != 0) return;

        removeAddressMatches("departureAddressMatches");

        matchAddresses(addressPart, "departureAddressMatches");

    });

    /**
     * Create an event listener for destination address that processes user input.
     */
    const destinationAddress = document.getElementById("destinationAddress");
    destinationAddress.addEventListener("input", () => {
        const addressPart = destinationAddress.value;
        console.log(addressPart);
        if(addressPart.length % 3 != 0) return;

        removeAddressMatches("destinationAddressMatches");

        matchAddresses(addressPart, "destinationAddressMatches");
    });

    /**
     * Create an event listener for the email checkbox that controls whether the
     * email address text box is enabled or disabled.
     */
    const emailCheckBox = document.getElementById("emailCheckBox");
    emailCheckBox.addEventListener("click", () => {

        const emailTextBox = document.getElementById("email_address");

        // If emailCheckBox is checked enable emailTextBox.
        if(emailCheckBox.checked) emailTextBox.disabled = false;
        // emailTextBox should be disabled if emailCheckBox is unchecked.
        else emailTextBox.disabled = true;
    });

    /**
     * Create an event listener for the sms checkbox that controls whether the
     * mobile number text box and mobile provider combo box are enabled or disabled.
     */
    const smsCheckBox = document.getElementById("smsCheckBox");
    smsCheckBox.addEventListener("click", () => {

        const smsTextBox = document.getElementById("mobile_number");
        const smsComboBox = document.getElementById("mobile_provider");

        // If smsCheckBox is checked enable smsTextBox and smsComboBox.
        if(smsCheckBox.checked) {
            smsTextBox.disabled = false;
            smsComboBox.disabled = false;
        }
        // smsTextBox and smsComboBox should be disabled if smsCheckBox is unchecked.
        else{
            smsTextBox.disabled = true;
            smsComboBox.disabled = true;
        } 
    });

    /**
     * Create an event listener for the discord checkbox that controls whether the
     * discord user id text box is enabled or disabled.
     */
    const discordCheckbox = document.getElementById("discordCheckbox");
    discordCheckbox.addEventListener("click", () => {

        const discordTextBox = document.getElementById("user_id_discord");

        // If discordCheckbox is checked enable discordTextBox.
        if(discordCheckbox.checked) discordTextBox.disabled = false;
        // discordTextBox should be disabled if discordCheckbox is unchecked.
        else discordTextBox.disabled = true;
    });

    /**
     * Create an event listener for the slack checkbox that controls whether the
     * slack user id text box is enabled or disabled.
     */
    const slackCheckBox = document.getElementById("slackCheckBox");
    slackCheckBox.addEventListener("click", () => {

        const slackTextBox = document.getElementById("user_id_slack");

        // If slackCheckBox is checked enable slackTextBox.
        if(slackCheckBox.checked) slackTextBox.disabled = false;
        // slackTextBox should be disabled if slackCheckBox is unchecked.
        else slackTextBox.disabled = true;
    });
}

// Initialize the entire User Interface.
const initUI = () => {
    initPage();

}

// Add a listener to initialize the app when the DOM Content is fully loaded.
document.addEventListener('DOMContentLoaded', initUI, false);