document.addEventListener("DOMContentLoaded", () => {
  // Defining Variables
  const rows = 5;
  const seatsPerSide = 4;
  const aisleColumn = seatsPerSide;

  // Clickables
  const container = document.querySelector(".container");
  const seatsGrid = container.querySelector(".seats");
  const dateDiv = container.querySelector(".date");
  const datePrevBtn = container.querySelector(".date-prev");
  const dateNextBtn = container.querySelector(".date-next");
  const closeBtn = container.querySelector(".closeBtn");
  const actionBtn = container.querySelector(".actionBtn");

  // Buttons For Data
  const availableSeatsBtn = document.getElementById("availableSeatsBtn");
  const occupantsBtn = document.getElementById("occupantsBtn");
  const infoOutput = document.getElementById("infoOutput");

  // Date
  let currentDate = new Date(2025, 5, 14);

  // Block Off
  let blockOffMode = true;

  // Blocking
  const blockedSeats = new Set(["S3", "S15"]);

  // Demo Seats
  const reservedSeats = new Set(["S5", "S12", "S20", "S33"]);

  // Demo Names
  const reserverNames = {
    S5: "Hanz",
    S12: "Gabriel",
    S20: "Antonio",
    S33: "Gutierrez",
  };

  // Demo Info
  let selectedSeatId = null;
  let seatAdded = false;
  let seatNumber = 1;
  let seatElements = new Map();

  // Gets Key
  function getStorageKey(date) {
    return "addedSeat_" + date.toISOString().slice(0, 10);
  }

  // Add/Remove: addedSeat_xxxx-xx-xx
  function setAddedSeatForDate(date, seatId) {
    if (seatId) {
      localStorage.setItem(getStorageKey(date), seatId);
    } else {
      localStorage.removeItem(getStorageKey(date));
    }
  }

  // Retrieval: addedSeat_xxxx-xx-xx
  function getAddedSeatForDate(date) {
    return localStorage.getItem(getStorageKey(date));
  }

  // Add/Remove: occupant_addedSeat_xxxx-xx-xx_Sxx
  function setOccupantName(date, seatId, name) {
    if (name) {
      localStorage.setItem(`occupant_${getStorageKey(date)}_${seatId}`, name);
    } else {
      localStorage.removeItem(`occupant_${getStorageKey(date)}_${seatId}`);
    }
  }

  //Retrival: occupant_addedSeat_xxxx-xx-xx_Sxx
  function getOccupantName(date, seatId) {
    return localStorage.getItem(`occupant_${getStorageKey(date)}_${seatId}`);
  }

  // Date Display
  function formatDate(date) {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function updateDateDisplay() {
    dateDiv.textContent = formatDate(currentDate);
  }

  // Reset Seat And Grid
  function resetSeatSelection() {
    selectedSeatId = null;
    seatAdded = false;
    actionBtn.textContent = "Add";
    actionBtn.setAttribute("aria-label", "Add Selected Seat");
    actionBtn.disabled = true;

    seatsGrid.innerHTML = "";
    seatElements.clear();
    seatNumber = 1;

    buildSeatsGrid();
  }

  // Build Seats Grid
  function buildSeatsGrid() {
    const addedSeatId = getAddedSeatForDate(currentDate);

    // Seat Seat Seat Seat || Aisle || Seat Seat Seat Seat
    for (let row = 1; row <= rows; row++) {
      for (let col = 0; col < seatsPerSide * 2 + 1; col++) {
        if (col === aisleColumn) {
          const aisleDiv = document.createElement("div");
          aisleDiv.className = "aisle";
          seatsGrid.appendChild(aisleDiv);
        } else {
          const seatId = `S${seatNumber}`;

          // Creates Seats
          const seatDiv = document.createElement("div");
          seatDiv.className = "seat";
          seatDiv.setAttribute("role", "button");
          seatDiv.setAttribute("tabindex", "0");
          seatDiv.setAttribute("aria-pressed", "false");
          seatDiv.setAttribute("aria-label", `Seat ${seatId}`);
          seatDiv.textContent = seatNumber;

          // Blocked or Reserved
          const isReserved = reservedSeats.has(seatId);
          const isblocked = blockOffMode && blockedSeats.has(seatId);

          // Priority: Blocked > Reserved (Black Over Red)
          if (isblocked) {
            seatDiv.classList.add("blocked");
            seatDiv.setAttribute("aria-label", `Seat ${seatId}, blocked`);
            seatDiv.style.cursor = "not-allowed";
          } else if (isReserved) {
            seatDiv.classList.add("reserved");
            seatDiv.setAttribute("aria-label", `Seat ${seatId}, reserved`);
            seatDiv.style.cursor = "pointer";
            seatDiv.title = `Reserved by ${reserverNames[seatId] || "Unknown"}`;
            seatDiv.addEventListener("click", () => {
              alert(`Seat ${seatId} is reserved by ${reserverNames[seatId] || "Unknown"}.`);
            });
            seatDiv.addEventListener("keydown", (e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                alert(`Seat ${seatId} is reserved by ${reserverNames[seatId] || "Unknown"}.`);
              }
            });
          } else {
  
            // Check if this seat is added for current date
            if (addedSeatId === seatId) {
              seatDiv.classList.add("added");
              seatDiv.setAttribute("aria-label", `Seat ${seatId}, added`);
              seatDiv.style.cursor = "default";
              seatAdded = true;
              selectedSeatId = seatId;
              // Add Button -> Remove Button
              actionBtn.textContent = "Remove";
              actionBtn.setAttribute("aria-label", "Remove Selected Seat");
              actionBtn.disabled = false;
              seatDiv.setAttribute("aria-pressed", "true");

              // Show Name
              const occupantName = getOccupantName(currentDate, seatId);
              if (occupantName) {
                seatDiv.title = `Reserved by ${occupantName}`;
              }
            } else {
              seatDiv.addEventListener("click", () => {
                if (!seatAdded) {
                  selectSeat(seatId, seatDiv);
                }
              });
              seatDiv.addEventListener("keydown", (e) => {
                if ((e.key === " " || e.key === "Enter") && !seatAdded) {
                  e.preventDefault();
                  selectSeat(seatId, seatDiv);
                }
              });
            }
          }

          seatsGrid.appendChild(seatDiv);
          seatElements.set(seatId, seatDiv);
          seatNumber++;
        }
      }
    }

    // Disable Other Seats
    if (addedSeatId) {
      seatElements.forEach((el, id) => {
        if (
          id !== addedSeatId &&
          !reservedSeats.has(id) &&
          !(blockOffMode && blockedSeats.has(id))
        ) {
          el.style.pointerEvents = "none";
          el.style.cursor = "default";
        }
      });
    }
  }

  // Seat Logic
  function selectSeat(seatId, seatElement) {
    // Stop Selection
    if (selectedSeatId === seatId) {
      seatElement.classList.remove("selected");
      seatElement.setAttribute("aria-pressed", "false");
      selectedSeatId = null;
      actionBtn.disabled = true;
      actionBtn.textContent = "Add";
      actionBtn.setAttribute("aria-label", "Add Selected Seat");
      return;
    }
    // Deselection
    if (selectedSeatId !== null) {
      const prevSelected = seatElements.get(selectedSeatId);
      if (prevSelected) {
        prevSelected.classList.remove("selected");
        prevSelected.setAttribute("aria-pressed", "false");
      }
    }

    // Highlights Selected
    seatElement.classList.add("selected");
    seatElement.setAttribute("aria-pressed", "true");
    selectedSeatId = seatId;

    // Enables Add Button
    actionBtn.disabled = false;
    actionBtn.textContent = "Add";
    actionBtn.setAttribute("aria-label", "Add Selected Seat");
  }

  // Add/Remove Logic
  actionBtn.addEventListener("click", () => {
    if (!selectedSeatId) {
      alert("Please select a seat first.");
      return;
    }

    if (actionBtn.textContent === "Add") {
      // Reserving Prompt
      const occupantName = prompt("Enter Your Name For Reservation:");
      if (!occupantName || occupantName.trim() === "") {
        alert("Name Is Required.");
        return;
      }
      // Adding Reservation
      const seatDiv = seatElements.get(selectedSeatId);
      if (seatDiv) {
        seatDiv.classList.add("added");
        seatDiv.setAttribute("aria-label", `Seat ${selectedSeatId}, added`);
        seatDiv.style.cursor = "default";
        seatDiv.title = `Reserved by ${occupantName}`;
      }

      // Adding Details
      setAddedSeatForDate(currentDate, selectedSeatId);
      setOccupantName(currentDate, selectedSeatId, occupantName);

      // One Seat Per Day
      seatElements.forEach((el, id) => {
        if (
          id !== selectedSeatId &&
          !reservedSeats.has(id) &&
          !(blockOffMode && blockedSeats.has(id))
        ) {
          el.style.pointerEvents = "none";
          el.style.cursor = "default";
        }
      });

      // Add -> Remove
      seatAdded = true;
      actionBtn.textContent = "Remove";
      actionBtn.setAttribute("aria-label", "Remove Selected Seat");
      actionBtn.disabled = false;
    } else {
      const seatDiv = seatElements.get(selectedSeatId);
      // Removing
      if (seatDiv) {
        seatDiv.classList.remove("added", "selected");
        seatDiv.setAttribute("aria-label", `Seat ${selectedSeatId}`);
        seatDiv.style.cursor = "pointer";
        seatDiv.title = "";
      }

      // Removing Details
      setAddedSeatForDate(currentDate, null);
      setOccupantName(currentDate, selectedSeatId, null);

      // Re-enable Seats
      seatElements.forEach((el, id) => {
        if (
          !reservedSeats.has(id) &&
          !(blockOffMode && blockedSeats.has(id))
        ) {
          el.style.pointerEvents = "";
          el.style.cursor = "pointer";
        }
      });

      selectedSeatId = null;
      seatAdded = false;
      actionBtn.textContent = "Add";
      actionBtn.setAttribute("aria-label", "Add Selected Seat");
      actionBtn.disabled = true;
    }
  });

  // Date Navigation
  datePrevBtn.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDateDisplay();
    resetSeatSelection();
    infoOutput.textContent = "";
  });

  dateNextBtn.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDateDisplay();
    resetSeatSelection();
    infoOutput.textContent = "";
  });

  // Close Button
  closeBtn.addEventListener("click", () => {
    alert("Close");
  });

  // Data
  function getAvailableSeatsCount() {
    let count = 0;
    seatElements.forEach((el, seatId) => {
      const isReserved = reservedSeats.has(seatId);
      const isblocked = blockOffMode && blockedSeats.has(seatId);
      const isAdded = getAddedSeatForDate(currentDate) === seatId;
      if (!isReserved && !isblocked && !isAdded) {
        count++;
      }
    });
    return count;
  }

  // Reserved + Added Seats
  function getOccupants() {
    const occupants = [];

    // Reserved Seats
    reservedSeats.forEach((seatId) => {
      occupants.push({ seatId, name: reserverNames[seatId] || "Unknown" });
    });

    // Added + List
    const addedSeatId = getAddedSeatForDate(currentDate);
    if (addedSeatId) {
      const occupantName = getOccupantName(currentDate, addedSeatId) || "Unknown";
      occupants.push({ seatId: addedSeatId, name: occupantName });
    }

    return occupants;
  }

  // Data: Available Seats
  availableSeatsBtn.addEventListener("click", () => {
    const count = getAvailableSeatsCount();
    infoOutput.textContent = `Available seats for ${formatDate(currentDate)}: ${count}`;
  });

  // Data: Occupants
  occupantsBtn.addEventListener("click", () => {
    const occupants = getOccupants();
    if (occupants.length === 0) {
      infoOutput.textContent = `No Occupants For ${formatDate(currentDate)}.`;
    } else {
      const list = occupants
        .map((o) => `Seat ${o.seatId}: ${o.name}`)
        .join("\n");
      infoOutput.textContent = `Occupants For ${formatDate(currentDate)}:\n${list}`;
    }
  });

  // Initialize
  updateDateDisplay();
  buildSeatsGrid();
});
