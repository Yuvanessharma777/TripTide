
const destinations = [
  { id: 1, name: "Goa", country: "India", category: "Beach", budget: "Mid-range", cost: 2500, emoji: "🏝️", art: "beach", description: "Sunny beaches, colourful streets and sunset views." },
  { id: 2, name: "Ooty", country: "Tamil Nadu, India", category: "Mountain", budget: "Budget", cost: 1800, emoji: "⛰️", art: "mountain", description: "Misty hills, tea gardens and peaceful mornings." },
  { id: 3, name: "Manali", country: "Himachal Pradesh, India", category: "Mountain", budget: "Mid-range", cost: 3000, emoji: "🏔️", art: "mountain", description: "Mountain adventures, cool air and scenic valleys." },
  { id: 4, name: "Jaipur", country: "Rajasthan, India", category: "City", budget: "Budget", cost: 1700, emoji: "🏰", art: "city", description: "Historic forts, pink buildings and local markets." },
  { id: 5, name: "Munnar", country: "Kerala, India", category: "Nature", budget: "Budget", cost: 2000, emoji: "🌿", art: "nature", description: "Rolling tea plantations and green landscapes." },
  { id: 6, name: "Bali", country: "Indonesia", category: "Beach", budget: "Premium", cost: 6500, emoji: "🌴", art: "beach", description: "Tropical beaches, temples and island sunsets." },
  { id: 7, name: "Paris", country: "France", category: "City", budget: "Premium", cost: 12000, emoji: "🗼", art: "city", description: "Art, charming cafés and iconic architecture." },
  { id: 8, name: "Kodaikanal", country: "Tamil Nadu, India", category: "Nature", budget: "Budget", cost: 1800, emoji: "🌲", art: "nature", description: "Forest trails, lake views and cool weather." },
  { id: 9, name: "Dubai", country: "United Arab Emirates", category: "City", budget: "Premium", cost: 9000, emoji: "🌆", art: "city", description: "Modern landmarks, shopping and desert experiences." },
  { id: 10, name: "Andaman", country: "India", category: "Beach", budget: "Mid-range", cost: 4000, emoji: "🐠", art: "beach", description: "Clear waters, island life and marine adventures." },
  { id: 11, name: "Coorg", country: "Karnataka, India", category: "Nature", budget: "Mid-range", cost: 2300, emoji: "☕", art: "nature", description: "Coffee estates, waterfalls and forest stays." },
  { id: 12, name: "Singapore", country: "Singapore", category: "City", budget: "Premium", cost: 8500, emoji: "🌃", art: "city", description: "Garden attractions, food and a vibrant skyline." }
];

const $ = (id) => document.getElementById(id);

const grid = $("destinationGrid");
const searchInput = $("searchInput");
const categoryFilter = $("categoryFilter");
const budgetFilter = $("budgetFilter");

let currentTrip = null;
let toastTimer;

function money(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function renderDestinations() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const budget = budgetFilter.value;

  const filtered = destinations.filter((place) => {
    const matchesSearch =
      `${place.name} ${place.country} ${place.category}`
        .toLowerCase().includes(query);

    const matchesCategory =
      category === "All" || place.category === category;

    const matchesBudget =
      budget === "All" || place.budget === budget;

    return matchesSearch && matchesCategory && matchesBudget;
  });

  $("resultCount").textContent = `${filtered.length} places`;
  $("emptyState").classList.toggle("hidden", filtered.length !== 0);

  grid.innerHTML = filtered.map((place) => `
    <article class="destination-card">
      <div class="destination-art art-${place.art}">
        <span class="art-emoji" aria-hidden="true">${place.emoji}</span>
      </div>
      <div class="card-content">
        <div class="card-top">
          <h3>${place.name}</h3>
          <span class="tag">${place.category}</span>
        </div>
        <p>${place.description}</p>
        <div class="card-bottom">
          <strong>
            ${money(place.cost)}
            <small>estimated per day</small>
          </strong>
          <button type="button" data-plan="${place.id}">
            Plan trip →
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function populateDestinationSelect() {
  $("tripDestination").innerHTML = destinations.map((place) => `
    <option value="${place.id}">${place.name}, ${place.country}</option>
  `).join("");
}

function getSelectedDestination() {
  return destinations.find(
    (place) => place.id === Number($("tripDestination").value)
  );
}

function makeActivitySuggestions(place, style, day) {
  const suggestions = {
    Beach: {
      Relaxed: [
        "Enjoy a slow breakfast and explore the local area.",
        "Spend time by the beach and watch the sunset.",
        "Visit a local café and enjoy a relaxed evening."
      ],
      Adventure: [
        "Explore the coastline and try a beach activity.",
        "Discover a nearby viewpoint or outdoor adventure.",
        "Enjoy a new outdoor experience and explore local food."
      ],
      "Culture & Food": [
        "Explore local markets and try regional dishes.",
        "Visit a cultural attraction and discover local cuisine.",
        "Take a food walk and browse local shops."
      ],
      "Family Friendly": [
        "Explore a family-friendly beach or public attraction.",
        "Enjoy a relaxed outing and a family meal.",
        "Visit a local attraction suitable for the whole family."
      ]
    },
    Mountain: {
      Relaxed: [
        "Enjoy a scenic drive and a peaceful morning.",
        "Visit a viewpoint and relax with a warm drink.",
        "Explore a nearby garden or scenic spot."
      ],
      Adventure: [
        "Explore a walking trail suited to your experience.",
        "Discover mountain viewpoints and nature paths.",
        "Plan an outdoor adventure and enjoy the scenery."
      ],
      "Culture & Food": [
        "Visit local shops and taste regional food.",
        "Explore a cultural landmark and a local café.",
        "Discover local crafts and regional cuisine."
      ],
      "Family Friendly": [
        "Visit a scenic garden or accessible viewpoint.",
        "Enjoy a picnic and a gentle nature walk.",
        "Explore a family-friendly local attraction."
      ]
    },
    City: {
      Relaxed: [
        "Explore the neighbourhood and a welcoming café.",
        "Visit a public garden and enjoy a relaxed afternoon.",
        "Browse local shops and enjoy dinner."
      ],
      Adventure: [
        "Explore a new neighbourhood on foot.",
        "Discover a landmark and try a new activity.",
        "Visit an interesting attraction and explore the city."
      ],
      "Culture & Food": [
        "Visit a museum or historic landmark.",
        "Explore a local market and try regional dishes.",
        "Discover local architecture and enjoy a food walk."
      ],
      "Family Friendly": [
        "Visit a family-friendly attraction.",
        "Explore a park and enjoy a casual meal.",
        "Choose a museum, garden or other family outing."
      ]
    },
    Nature: {
      Relaxed: [
        "Enjoy the landscape and a slow morning.",
        "Explore a garden or peaceful natural viewpoint.",
        "Take photos and relax in a scenic spot."
      ],
      Adventure: [
        "Explore a suitable nature trail.",
        "Visit a waterfall or scenic outdoor location.",
        "Discover a new trail and enjoy the outdoors."
      ],
      "Culture & Food": [
        "Visit a nearby village or local market.",
        "Taste regional food and learn about local traditions.",
        "Explore local crafts and scenic surroundings."
      ],
      "Family Friendly": [
        "Enjoy a gentle nature walk.",
        "Visit an accessible outdoor attraction.",
        "Plan a picnic and a relaxed sightseeing outing."
      ]
    }
  };

  const categorySuggestions = suggestions[place.category];
  const options = categorySuggestions[style] || categorySuggestions.Relaxed;

  return options[(day - 1) % options.length];
}

function renderItinerary(trip) {
  const place = destinations.find((item) => item.id === trip.destinationId);
  if (!place) return;

  $("itineraryTitle").textContent = trip.name;
  $("itinerarySummary").textContent =
    `${place.name}, ${place.country} · ${trip.days} days · ${trip.style}`;

  $("totalBudget").textContent = money(trip.dailyBudget * trip.days);
  $("shownDailyBudget").textContent = money(trip.dailyBudget);
  $("shownDays").textContent =
    `${trip.days} ${trip.days === 1 ? "day" : "days"}`;

  const start = new Date(`${trip.startDate}T12:00:00`);

  $("itineraryDays").innerHTML = Array.from(
    { length: trip.days },
    (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      const dateLabel = date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
      });

      const dayNumber = index + 1;
      const activity = makeActivitySuggestions(
        place,
        trip.style,
        dayNumber
      );

      return `
        <article class="day-card">
          <strong>Day ${dayNumber} · ${dateLabel}</strong>
          <p>${activity}</p>
        </article>
      `;
    }
  ).join("");

  $("itinerary").classList.remove("hidden");
  $("saveTripButton").textContent = "♡ Save trip";
}

function getSavedTrips() {
  try {
    const stored = JSON.parse(localStorage.getItem("triptideTrips") || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveCurrentTrip() {
  if (!currentTrip) {
    showToast("Create a trip first!");
    return;
  }

  const trips = getSavedTrips();

  // Avoid saving the same trip repeatedly.
  if (trips.some((trip) => trip.id === currentTrip.id)) {
    showToast("This trip is already saved.");
    return;
  }

  trips.unshift(currentTrip);

  try {
    localStorage.setItem("triptideTrips", JSON.stringify(trips));
    renderSavedTrips();
    $("saveTripButton").textContent = "✓ Saved";
    showToast("Your trip has been saved!");
  } catch {
    showToast("Could not save trip. Check browser storage settings.");
  }
}

function renderSavedTrips() {
  const trips = getSavedTrips();
  const container = $("savedTrips");

  $("savedEmpty").classList.toggle("hidden", trips.length > 0);

  container.innerHTML = trips.map((trip) => {
    const place = destinations.find(
      (item) => item.id === trip.destinationId
    );

    if (!place) return "";

    return `
      <article class="saved-card">
        <span class="tag">${place.emoji} ${place.name}</span>
        <h3>${trip.name}</h3>
        <p>${trip.days} days · ${trip.style}<br>
        Starting ${trip.startDate}<br>
        Estimated budget: ${money(trip.dailyBudget * trip.days)}</p>
        <div class="saved-actions">
          <button type="button" data-open-trip="${trip.id}">View plan</button>
          <button type="button" data-delete-trip="${trip.id}">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

function createTrip(event) {
  event.preventDefault();

  const name = $("tripName").value.trim();
  const destination = getSelectedDestination();
  const startDate = $("startDate").value;
  const days = Number($("tripDays").value);
  const dailyBudget = Number($("dailyBudget").value);
  const style = $("travelStyle").value;

  if (!name || !destination || !startDate) {
    $("formMessage").textContent = "Please complete all required fields.";
    return;
  }

  if (!Number.isInteger(days) || days < 1 || days > 60) {
    $("formMessage").textContent = "Choose between 1 and 60 days.";
    return;
  }

  if (!Number.isFinite(dailyBudget) || dailyBudget < 0) {
    $("formMessage").textContent = "Enter a valid daily budget.";
    return;
  }

  // Interpret the date as a local calendar date, not UTC.
  const selectedDate = new Date(`${startDate}T12:00:00`);
  if (Number.isNaN(selectedDate.getTime())) {
    $("formMessage").textContent = "Please select a valid start date.";
    return;
  }

  currentTrip = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    destinationId: destination.id,
    startDate,
    days,
    dailyBudget,
    style
  };

  renderItinerary(currentTrip);
  $("formMessage").textContent = "Your itinerary is ready!";
  $("saveTripButton").textContent = "♡ Save trip";
  showToast("Itinerary created successfully!");

  $("itinerary").scrollIntoView({ behavior: "smooth", block: "start" });
}

// Destination filters
searchInput.addEventListener("input", renderDestinations);
categoryFilter.addEventListener("change", renderDestinations);
budgetFilter.addEventListener("change", renderDestinations);

// Click a destination to start planning it.
grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-plan]");
  if (!button) return;

  $("tripDestination").value = button.dataset.plan;
  $("planner").scrollIntoView({ behavior: "smooth" });
  $("tripName").focus();
});

// Create and save itineraries
$("tripForm").addEventListener("submit", createTrip);
$("saveTripButton").addEventListener("click", saveCurrentTrip);

// View or delete a saved trip.
$("savedTrips").addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-trip]");
  const deleteButton = event.target.closest("[data-delete-trip]");

  if (openButton) {
    const trip = getSavedTrips().find(
      (item) => item.id === openButton.dataset.openTrip
    );

    if (!trip) {
      showToast("Saved trip not found.");
      return;
    }

    currentTrip = trip;
    renderItinerary(trip);
    $("planner").scrollIntoView({ behavior: "smooth" });
  }

  if (deleteButton) {
    const tripId = deleteButton.dataset.deleteTrip;
    const updated = getSavedTrips().filter((trip) => trip.id !== tripId);

    try {
      localStorage.setItem("triptideTrips", JSON.stringify(updated));
      renderSavedTrips();
      showToast("Saved trip deleted.");
    } catch {
      showToast("Could not update saved trips.");
    }
  }
});

// Set the default date to today using local time.
const today = new Date();
const localToday = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

$("startDate").value = localToday;
$("startDate").min = localToday;

// Initial page setup
populateDestinationSelect();
renderDestinations();
renderSavedTrips();
