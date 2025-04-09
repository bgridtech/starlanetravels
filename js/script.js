document.addEventListener("DOMContentLoaded", () => {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfNh-5-KsXB2u0KzRAfnKNFFJ-Qol5oRD3lwZsDIq10i3vAO8G-PNucQH_k6Z43wsdQ6YxipeDcfgS/pub?gid=0&single=true&output=csv";

    Papa.parse(sheetURL, {
        download: true,
        header: true,
        complete: function (results) {
            const data = results.data;
            const container = document.getElementById("job-listings");

            data.forEach(job => {
                if (!job.Position) return; // skip empty rows
                const card = document.createElement("div");
                card.className = "job-card";
                card.innerHTML = `
                    <h3>${job.Position}</h3>
                    <p><strong>Location:</strong> ${job.Location}</p>
                    <p><strong>Type:</strong> ${job.Type}</p>
                    <p>${job.Description}</p>
                    <button class="apply-btn" data-position="${job.Position}" data-location="${job.Location}" data-type="${job.Type}">Apply Now</button>
                `;
                container.appendChild(card);
            });

            // Add event listeners to "Apply Now" buttons
            const applyButtons = document.querySelectorAll(".apply-btn");
            applyButtons.forEach(button => {
                button.addEventListener("click", (e) => {
                    const position = e.target.getAttribute("data-position");
                    const location = e.target.getAttribute("data-location");
                    const type = e.target.getAttribute("data-type");

                    // Populate the form with job details
                    document.getElementById("job-title").value = position;
                    document.getElementById("job-location").value = location;
                    document.getElementById("job-type").value = type;

                    // Show the form
                    document.getElementById("apply-form-container").style.display = "block";
                });
            });
        }
    });

    const seasonalSheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS2pf4zEEyMTGzny1jxnuDl8Oar364tuO1K4n4kj4vZRzOpfWzY0um_1TZG6Wo2__Onbh3a0CSY30GD/pub?output=csv";

    Papa.parse(seasonalSheetURL, {
      download: true,
      header: true,
      complete: function (results) {
        const data = results.data;
        const container = document.getElementById("seasonal-cards");
    
        if (!container) {
          console.error("Container #seasonal-cards not found!");
          return;
        }
    
        if (!data || !data.length) {
          container.innerHTML = "<p>No seasonal packages found.</p>";
          return;
        }
    
        data.forEach(pkg => {
          if (!pkg["Package Name"]) return;
    
          const card = document.createElement("div");
          card.className = "seasonal-card";
          card.innerHTML = `
            <img src="${pkg["Image URL"]}" alt="${pkg["Package Name"]}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px;">
            <h3>${pkg["Package Name"]}</h3>
            <p>${pkg["Best Season"]}</p>
            <p>${pkg["Description"]}</p>
            <p class="price">Price: ${pkg["Price"]}</p>
        
            <a href="https://wa.me/919961936593?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20the%20${encodeURIComponent(pkg["Package Name"])}%20seasonal%20package." target="_blank">Know More</a>
          `;
          container.appendChild(card);
        });
      }
    });
    
    emailjs.init("Jl306RdMW69w5gK_-"); // Initialize EmailJS with your user ID

    const form = document.getElementById("application-form");
    const successMessage = document.getElementById("success-popup");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = {
            job_title: form["job-title"].value,
            job_location: form["job-location"].value,
            job_type: form["job-type"].value,
            name: form["name"].value,
            address: form["address"].value,
            aadhar: form["aadhar"].value,
            license: form["license"].value,
            contact: form["contact"].value,
        };

        emailjs.send("service_v6hpqeo", "template_57lbj0o", formData)
            .then(() => {
                successMessage.style.display = "flex"; // Show success popup
                form.reset(); // Reset the form fields
            })
            .catch(error => {
                alert("Failed to send application. Please try again.");
                console.error("EmailJS error:", error);
            });
    });

    // Close form functionality
    document.getElementById("close-form").addEventListener("click", () => {
        document.getElementById("apply-form-container").style.display = "none";
    });

    // Close popup functionality
    const closePopup = document.getElementById("close-popup");
    if (closePopup) {
        closePopup.addEventListener("click", () => {
            successMessage.style.display = "none"; // Hide success popup
        });
    }
});