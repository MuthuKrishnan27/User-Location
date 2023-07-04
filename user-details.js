
  // Function to retrieve user's location information
  function getUserInfo(ip) {
    return fetch(
      /*`https://ipinfo.io/${ip}/geo`*/ `https://ipinfo.io/${ip}/json?token=f90d12c74cbc74`
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("Unable to retrieve user information:", error);
        throw error;
      });
  }

  // Write details of postal in the top of page
  function toplocationData(data){
    const loc = data.loc;
    const [lat, lon] = loc.split(",");
    let topbox = document.getElementsByClassName('top-box')[0].children;
    console.log(topbox)
    topbox[0].innerHTML = `<b>Lat : </b>${lat}`;
    topbox[1].innerHTML = `<b>City : </b>${data.city}`;
    topbox[2].innerHTML = `<b>Organisation : </b>${data.org}`;
    topbox[3].innerHTML = `<b>Long : </b>${lon}`;
    topbox[4].innerHTML = `<b>Region : </b>${data.region}`;
    topbox[5].innerHTML = `<b>Hostname : </b>${document.domain}`
}

  // Function to display the user's location on Google Maps
  function showLocationOnMap(lat, lon) {
    const mapDiv = document.getElementById("map");
    const mapUrl = `https://maps.google.com/maps?q=${lat},${lon}&output=embed`;
    mapDiv.innerHTML = `<iframe src="${mapUrl}" width="700" height="300" frameborder="0" style="border:0"></iframe>`;
  }

  // Write details of postal in the bottom of page
  function bottomlocationData(data,timezone){
    let bottombox = document.getElementsByClassName('bottom-box')[0].children;
    console.log(bottombox)
    bottombox[0].innerHTML=`<b>Time Zone : </b>${data.timezone}`
    let Date = getCurrentTime(timezone);
    bottombox[1].innerHTML=`<b>Date and Time : </b>${Date}`;
    bottombox[2].innerHTML=`<b>Pincode : </b>${data.postal}`;
  }

  // Function to get the current time for the user's timezone
  function getCurrentTime(timezone) {
    const date = new Date().toLocaleString("en-US", { timeZone: timezone });
    return date;
  }

  // Function to retrieve post offices based on pincode and display them
  function getPostOffices(pincode) {
    return fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then((response) => response.json())
      .then((data) => data[0].PostOffice)
      .catch((error) => {
        console.error("Unable to retrieve post offices:", error);
        throw error;
      });
  }

  // Function to filter the post offices by name and branch office
  function filterPostOffices(searchTerm) {
    const postOffices = document.getElementsByClassName('inner');
  
    Array.from(postOffices).forEach((postOffice) => {
        
      const name = postOffice
        .getElementsByClassName("name")[0]
        .textContent.toLowerCase();
      const branch = postOffice
        .getElementsByClassName("branch")[0]
        .textContent.toLowerCase();
      if (
        name.includes(searchTerm.toLowerCase()) ||
        branch.includes(searchTerm.toLowerCase())
      ) {
        postOffice.style.display = "block";
      } else {
        postOffice.style.display = "none";
      }
    });
  }

  // Get user's information on page load
  window.addEventListener("load", () => {
    const ipaddress = JSON.parse(localStorage.getItem('ip'));
    document.getElementById("ip-address").textContent = ipaddress;
    console.log(ipaddress);
    getUserInfo(ipaddress)
      .then((response) => {
        console.log(response);
        const { loc, timezone, postal } = response;
        const [lat, lon] = loc.split(",");
        toplocationData(response);
        showLocationOnMap(lat, lon);
        bottomlocationData(response,timezone);
        return getPostOffices(postal);
      })
      .then((postOffices) => {
        const postOfficesList = document.getElementById("post-offices");
        postOfficesList.innerHTML = "";
    
        let countMessage = [];
          // Display number of pincode Message  
        let bottombox = document.getElementsByClassName('bottom-box')[0].children;

        postOffices.forEach((postOffice) => {
           if(!countMessage.includes(postOffice.pincode)){
            countMessage.push(postOffice.pincode);
           }
            const inner = document.createElement("div");
            inner.className = "inner";
            inner.innerHTML = `<div class="name"><b>Name: </b>${postOffice.Name}</div>
                <div class="branch"><b>Branch Type: </b>${postOffice.BranchType}</div>
                <div><b>Delivery Status: </b>${postOffice.DeliveryStatus}</div>
                <div><b>District: </b>${postOffice.District}</div>
                <div><b>Division: </b>${postOffice.Division}</div>`;

          postOfficesList.appendChild(inner); 
        });

        bottombox[3].innerHTML=`<b>Message : </b>Number of pincode's found : ${countMessage.length}`;

        // Filter box functionality
        document
          .getElementById("search")
          .addEventListener("input", (event) => {
            filterPostOffices(event.target.value);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

