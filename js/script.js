document.addEventListener("DOMContentLoaded", () => {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfNh-5-KsXB2u0KzRAfnKNFFJ-Qol5oRD3lwZsDIq10i3vAO8G-PNucQH_k6Z43wsdQ6YxipeDcfgS/pub?gid=0&single=true&output=csv";
  
    Papa.parse(sheetURL, {
      download: true,
      header: true,
      complete: function(results) {
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
          `;
          container.appendChild(card);
        });
      }
    });
  });
  