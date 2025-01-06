document.getElementById("fetchApiButton").addEventListener("click", (event) => {
  event.preventDefault();
  fetchData();
});

document.getElementById("ajaxButton").addEventListener("click", (event) => {
  event.preventDefault();
  fetchDataWithAjax();
});

const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // خادم وسيط لتجاوز CORS
const apiUrl = "https://leaks.zamanalwsl.net/1.5m.php";

function fetchData() {
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const fathername = document.getElementById("fathername").value;
  const birthplace = document.getElementById("birthplace").value;

  const params = new URLSearchParams({
    firstname: firstname,
    lastname: lastname,
    fathername: fathername,
    birthplace: birthplace,
  });

  const headers = {
    "User-Agent": navigator.userAgent,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"',
    "upgrade-insecure-requests": "1",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "navigate",
    "sec-fetch-user": "?1",
    "sec-fetch-dest": "document",
    Referer: apiUrl,
    "accept-language": "ar-IQ,ar;q=0.9,en-US;q=0.8,en;q=0.7",
  };

  fetch(`${proxyUrl}${apiUrl}?${params.toString()}`, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const rows = doc.querySelectorAll("#example tbody tr");

      if (!rows || rows.length === 0) {
        console.error("HTML Response:", html);
        document.getElementById("responseBox").innerText =
          "لا توجد بيانات لهذا الشخص، تحقق من المدخلات.";
        return;
      }

      const data = Array.from(rows).map((row) => {
        return Array.from(row.querySelectorAll("td")).map((cell) =>
          cell.textContent.trim()
        );
      });

      const result = data
        .map((entry) => entry.join(" | "))
        .join("\n-------------------------\n");
      document.getElementById("responseBox").innerText = result;
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("responseBox").innerText = `خطأ في التحميل: ${error}`;
    });
}

function fetchDataWithAjax() {
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const fathername = document.getElementById("fathername").value;
  const birthplace = document.getElementById("birthplace").value;

  const params = `firstname=${firstname}&lastname=${lastname}&fathername=${fathername}&birthplace=${birthplace}`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${proxyUrl}${apiUrl}?${params}`, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xhr.responseText, "text/html");
      const rows = doc.querySelectorAll("#example tbody tr");

      if (!rows || rows.length === 0) {
        console.error("HTML Response:", xhr.responseText);
        document.getElementById("responseBox").innerText =
          "لا توجد بيانات لهذا الشخص، تحقق من المدخلات.";
        return;
      }

      const data = Array.from(rows).map((row) => {
        return Array.from(row.querySelectorAll("td")).map((cell) =>
          cell.textContent.trim()
        );
      });

      const result = data
        .map((entry) => entry.join(" | "))
        .join("\n-------------------------\n");
      document.getElementById("responseBox").innerText = result;
    } else {
      document.getElementById("responseBox").innerText = "حدث خطأ أثناء التحميل.";
    }
  };

  xhr.onerror = function () {
    document.getElementById("responseBox").innerText = "خطأ في الاتصال.";
  };

  xhr.send();
}
