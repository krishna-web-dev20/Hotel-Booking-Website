import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

const roomData = [
  {
    roomType: "Deluxe Room",
    description: "Comfortable room for a relaxing stay.",
    price: 3000,
    capacity: 2,
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
    facilities: ["WiFi", "Air Conditioning", "TV"],
  },
  {
    roomType: "Luxury Room",
    description: "Elegant interiors with extra comfort.",
    price: 5000,
    capacity: 3,
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    facilities: ["WiFi", "Air Conditioning", "TV", "Mini Bar"],
  },
  {
    roomType: "Premium Suite",
    description: "Spacious accommodation for a special stay.",
    price: 8000,
    capacity: 4,
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
    facilities: ["WiFi", "Air Conditioning", "TV", "Living Area"],
  },
];

function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [booking, setBooking] = useState({
    name: "",
    email: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
  });

  const [contact, setContact] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [currentPage, setCurrentPage] = useState("home");
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  function openBooking(room) {
    setSelectedRoom(room);

    setBooking({
      name: "",
      email: "",
      checkIn: "",
      checkOut: "",
      guests: "1",
    });
  }

  function closeBooking() {
    setSelectedRoom(null);
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();

    if (!selectedRoom) {
      alert("Please select a room.");
      return;
    }

    if (
      !booking.name.trim() ||
      !booking.email.trim() ||
      !booking.checkIn ||
      !booking.checkOut
    ) {
      alert("Please fill in all booking details.");
      return;
    }

    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);

    if (checkOutDate <= checkInDate) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    if (
      Number(booking.guests) < 1 ||
      Number(booking.guests) > selectedRoom.capacity
    ) {
      alert(
        `This room accommodates 1 to ${selectedRoom.capacity} guests.`
      );
      return;
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / millisecondsPerDay
    );
    const totalPrice = nights * selectedRoom.price;

    const bookingData = {
      guestName: booking.name.trim(),
      email: booking.email.trim(),
      roomNumber: selectedRoom.roomType,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: Number(booking.guests),
      totalPrice,
    };

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking.");
      }

      alert(
        `Booking successful!\n\n` +
          `Guest: ${bookingData.guestName}\n` +
          `Room: ${bookingData.roomNumber}\n` +
          `Nights: ${nights}\n` +
          `Total Price: ₹${totalPrice.toLocaleString("en-IN")}\n\n` +
          `Your Booking ID: ${data._id || "Saved successfully"}`
      );

      closeBooking();

      setBooking({
        name: "",
        email: "",
        checkIn: "",
        checkOut: "",
        guests: "1",
      });

      await fetchBookings();
    } catch (error) {
      alert(`Booking failed: ${error.message}`);
    }
  }

  async function fetchBookings() {
    setLoadingBookings(true);
    setBookingError("");

    try {
      const response = await fetch(`${API_URL}/bookings`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookings.");
      }

      if (!Array.isArray(data)) {
        throw new Error("The server did not return a booking list.");
      }

      setBookings(data);
    } catch (error) {
      setBookingError(
        `${error.message} Please check that your backend server is running.`
      );
    } finally {
      setLoadingBookings(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleUpdateStatus(id, newStatus) {
    setBookingMessage("");

    try {
      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking status.");
      }

      setBookings((previousBookings) =>
        previousBookings.map((item) =>
          item._id === id ? data : item
        )
      );

      setBookingMessage("Booking status updated successfully.");
    } catch (error) {
      setBookingMessage(`Update failed: ${error.message}`);
      await fetchBookings();
    }
  }

  async function handleDeleteBooking(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) {
      return;
    }

    setBookingMessage("");

    try {
      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete booking.");
      }

      setBookings((previousBookings) =>
        previousBookings.filter((item) => item._id !== id)
      );

      setBookingMessage("Booking deleted successfully.");
    } catch (error) {
      setBookingMessage(`Delete failed: ${error.message}`);
    }
  }

  function handleContactSubmit(event) {
    event.preventDefault();

    alert(
      "Thank you for contacting StayEase!\n" +
        "Contact messages are not saved yet."
    );

    setContact({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  }

  function formatDate(dateValue) {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN");
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <a
          href="#home"
          className="logo"
          onClick={() => setCurrentPage("home")}
        >
          Stay<span>Ease</span>
        </a>

        <div className="nav-links">
          <a
            href="#home"
            onClick={() => setCurrentPage("home")}
          >
            Home
          </a>

          <a
            href="#rooms"
            onClick={() => setCurrentPage("home")}
          >
            Rooms
          </a>

          <a
            href="#about"
            onClick={() => setCurrentPage("home")}
          >
            About
          </a>

          <a
            href="#contact"
            onClick={() => setCurrentPage("home")}
          >
            Contact
          </a>

          <button
            type="button"
            className="nav-manage-button"
            onClick={() => {
              setCurrentPage("manage");
              setBookingMessage("");
              fetchBookings();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Manage Bookings
          </button>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            setCurrentPage("home");
            window.setTimeout(() => openBooking(roomData[0]), 0);
          }}
        >
          Book Now
        </button>
      </nav>

      {/* Homepage */}
      {currentPage === "home" ? (
        <main>
          <section className="hero" id="home">
            <div className="hero-content">
              <p className="subtitle">WELCOME TO STAYEASE</p>

              <h1>
                Find Your Perfect
                <br />
                Place to Stay
              </h1>

              <p className="hero-text">
                Experience comfort, luxury, and unforgettable moments
                at our beautiful hotel.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  document
                    .getElementById("rooms")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Rooms
              </button>
            </div>
          </section>

          {/* Rooms */}
          <section className="rooms" id="rooms">
            <p className="subtitle">OUR ACCOMMODATION</p>
            <h2>Explore Our Rooms</h2>

            <p className="section-description">
              Choose the perfect room for your next comfortable stay.
            </p>

            <div className="room-container">
              {roomData.map((room) => (
                <article className="room-card" key={room.roomType}>
                  <img src={room.image} alt={room.roomType} />

                  <div className="room-info">
                    <h3>{room.roomType}</h3>
                    <p>{room.description}</p>

                    <h4>
                      ₹{room.price.toLocaleString("en-IN")} / night
                    </h4>

                    <p>Maximum {room.capacity} guests</p>

                    <p>
                      <strong>Facilities:</strong>{" "}
                      {room.facilities.join(", ")}
                    </p>

                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => openBooking(room)}
                    >
                      Book Room
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* About */}
          <section className="about" id="about">
            <p className="subtitle">ABOUT STAYEASE</p>
            <h2>Comfort Meets Hospitality</h2>

            <p className="section-description">
              At StayEase, we aim to make every stay relaxing,
              convenient, and memorable. Choose your room, book your
              stay, and let us take care of your comfort.
            </p>

            <div className="features">
              <div className="feature-card">
                <h3>Comfortable Rooms</h3>
                <p>Relax in thoughtfully designed accommodation.</p>
              </div>

              <div className="feature-card">
                <h3>Easy Booking</h3>
                <p>Book your preferred room in a few simple steps.</p>
              </div>

              <div className="feature-card">
                <h3>Quality Service</h3>
                <p>Enjoy a welcoming and comfortable experience.</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="contact" id="contact">
            <p className="subtitle">GET IN TOUCH</p>
            <h2>Contact Us</h2>

            <p className="section-description">
              Have a question? Send us a message.
            </p>

            <form
              className="contact-form"
              onSubmit={handleContactSubmit}
            >
              <label htmlFor="contact-name">Full Name</label>
              <input
                id="contact-name"
                type="text"
                placeholder="Enter your name"
                value={contact.name}
                onChange={(event) =>
                  setContact({
                    ...contact,
                    name: event.target.value,
                  })
                }
                required
              />

              <label htmlFor="contact-email">Email Address</label>
              <input
                id="contact-email"
                type="email"
                placeholder="Enter your email"
                value={contact.email}
                onChange={(event) =>
                  setContact({
                    ...contact,
                    email: event.target.value,
                  })
                }
                required
              />

              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                placeholder="How can we help?"
                value={contact.subject}
                onChange={(event) =>
                  setContact({
                    ...contact,
                    subject: event.target.value,
                  })
                }
                required
              />

              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                rows="5"
                placeholder="Write your message"
                value={contact.message}
                onChange={(event) =>
                  setContact({
                    ...contact,
                    message: event.target.value,
                  })
                }
                required
              />

              <button type="submit" className="primary-button">
                Send Message
              </button>
            </form>
          </section>
        </main>
      ) : (


        
        /* Manage Bookings */
        <main className="manage-bookings-page">
          <section className="manage-bookings">
            <p className="subtitle">STAYEASE ADMINISTRATION</p>
            <h1>Manage Bookings</h1>

            <p className="section-description">
              View reservations saved in MongoDB and manage their status.
            </p>

            <div className="manage-bookings-actions">
              <button
                type="button"
                className="primary-button"
                onClick={fetchBookings}
                disabled={loadingBookings}
              >
                {loadingBookings ? "Refreshing..." : "Refresh Bookings"}
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  setCurrentPage("home");
                  setBookingMessage("");
                }}
              >
                Back to Home
              </button>
            </div>

            {bookingError && (
              <p className="booking-error" role="alert">
                {bookingError}
              </p>
            )}

            {bookingMessage && (
              <p className="booking-message" role="status">
                {bookingMessage}
              </p>
            )}

            <p className="booking-count">
              Total bookings: <strong>{bookings.length}</strong>
            </p>

            {loadingBookings ? (
              <p>Loading bookings...</p>
            ) : bookingError ? null : bookings.length === 0 ? (
              <p>No bookings found in the database.</p>
            ) : (
              <div className="bookings-table-wrapper">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Guest Name</th>
                      <th>Email</th>
                      <th>Room</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Guests</th>
                      <th>Total Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
  {bookings.map((item) => (
    <tr key={item._id}>
      <td>{item.guestName}</td>
      <td>{item.email}</td>
      <td>{item.roomNumber}</td>
      <td>{formatDate(item.checkIn)}</td>
      <td>{formatDate(item.checkOut)}</td>
      <td>{item.guests}</td>
      <td>
        ₹{Number(item.totalPrice || 0).toLocaleString("en-IN")}
      </td>
      <td>
        <select
          aria-label={`Status for ${item.guestName}`}
          value={item.status || "Pending"}
          onChange={(event) =>
            handleUpdateStatus(item._id, event.target.value)
          }
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </td>
      <td>
        <button
          type="button"
          className="delete-booking-button"
          onClick={() => handleDeleteBooking(item._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

                </table>
              </div>
            )}
          </section>
        </main>
      )}

      {/* Footer */}
      <footer>
        <p>
          © {new Date().getFullYear()} StayEase. All rights reserved.
        </p>
      </footer>

      {/* Booking Modal */}
      {selectedRoom && (
        <div
          className="modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeBooking();
            }
          }}
        >
          <div
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
          >
            <button
              type="button"
              className="close-modal"
              onClick={closeBooking}
              aria-label="Close booking form"
            >
              ×
            </button>

            <h2 id="booking-modal-title">Book Your Stay</h2>

            <div className="selected-room">
              <h3>{selectedRoom.roomType}</h3>
              <p>
                ₹{selectedRoom.price.toLocaleString("en-IN")} per night
              </p>
              <p>Maximum {selectedRoom.capacity} guests</p>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <label htmlFor="booking-name">Full Name</label>
              <input
                id="booking-name"
                type="text"
                placeholder="Enter your full name"
                value={booking.name}
                onChange={(event) =>
                  setBooking({
                    ...booking,
                    name: event.target.value,
                  })
                }
                required
              />

              <label htmlFor="booking-email">Email Address</label>
              <input
                id="booking-email"
                type="email"
                placeholder="Enter your email"
                value={booking.email}
                onChange={(event) =>
                  setBooking({
                    ...booking,
                    email: event.target.value,
                  })
                }
                required
              />

              <div className="date-fields">
                <div>
                  <label htmlFor="check-in">Check-in Date</label>
                  <input
                    id="check-in"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={booking.checkIn}
                    onChange={(event) =>
                      setBooking({
                        ...booking,
                        checkIn: event.target.value,
                        checkOut:
                          booking.checkOut &&
                          event.target.value >= booking.checkOut
                            ? ""
                            : booking.checkOut,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label htmlFor="check-out">Check-out Date</label>
                  <input
                    id="check-out"
                    type="date"
                    min={
                      booking.checkIn
                        ? new Date(
                            new Date(booking.checkIn).getTime() +
                              24 * 60 * 60 * 1000
                          )
                            .toISOString()
                            .split("T")[0]
                        : new Date(Date.now() + 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split("T")[0]
                    }
                    value={booking.checkOut}
                    onChange={(event) =>
                      setBooking({
                        ...booking,
                        checkOut: event.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <label htmlFor="booking-guests">Number of Guests</label>
              <select
                id="booking-guests"
                value={booking.guests}
                onChange={(event) =>
                  setBooking({
                    ...booking,
                    guests: event.target.value,
                  })
                }
                required
              >
                {Array.from(
                  { length: selectedRoom.capacity },
                  (_, index) => index + 1
                ).map((number) => (
                  <option key={number} value={number}>
                    {number} {number === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>

              {booking.checkIn &&
                booking.checkOut &&
                new Date(booking.checkOut) >
                  new Date(booking.checkIn) && (
                  <div className="booking-price-summary">
                    <p>
                      Nights:{" "}
                      {Math.ceil(
                        (new Date(booking.checkOut) -
                          new Date(booking.checkIn)) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </p>

                    <p>
                      <strong>
                        Total: ₹
                        {(
                          Math.ceil(
                            (new Date(booking.checkOut) -
                              new Date(booking.checkIn)) /
                              (1000 * 60 * 60 * 24)
                          ) * selectedRoom.price
                        ).toLocaleString("en-IN")}
                      </strong>
                    </p>
                  </div>
                )}

              <button
                type="submit"
                className="primary-button submit-booking"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;