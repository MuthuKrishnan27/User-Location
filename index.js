let ipAddress;
      function getUserIP() {
        return fetch("https://api.ipify.org?format=json")
          .then((response) => {
            console.log(response);
            return response.json();
          })
          .then((data) => {
            console.log(data);
            return data.ip;
          })
          .catch((error) => {
            console.error("Unable to retrieve IP address:", error);
            throw error;
          });
      }
      getUserIP()
        .then((ip) => {
          ipAddress = ip;
          document.getElementById("ip-ad").textContent = ip;
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      document.getElementById("btn-getdata").addEventListener("click", () => {
        localStorage.setItem("ip", JSON.stringify(ipAddress));
        window.location.pathname = "/user-details.html"
      });