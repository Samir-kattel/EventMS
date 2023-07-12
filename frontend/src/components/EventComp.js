import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [attendees, setAttendees] = useState();
  const [events, setEvents] = useState([]);
  const [fetchImage, setFetchImage] = useState([]);

  useEffect(() => {
    axios.get("/events").then((res) => {
      setEvents(res.data);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const newEvent = {
      title,
      date,
      time,
      location,
      description,
      attendees,
    };

    axios.post("http://localhost:5000/events", newEvent).then((res) => {
      console.log(res);
      alert("successfully created")
      // setEvents([...events, res.data]);
      // setTitle('');
      // setDate('');
      // setTime('');
      // setLocation('');
      // setDescription('');
      // setAttendees([]);
    });
  }

  function handleDelete(eventId) {
    axios.delete(`/events/${eventId}`).then(() => {
      setEvents(events.filter((event) => event._id !== eventId));
    });
  }

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  function getImage() {
    fetch("http://localhost:5000/get-image", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFetchImage(data.data);
      });
  }

  useEffect(() => {
    getImage();
  }, []);

  return (
    <div>
      <h1>Event Management System</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="text"
          placeholder="Attendees (comma separated)"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
        />
        <button type="submit">Create Event</button>
      </form>

      <h2>Upcoming Events</h2>
      <ul>
        {fetchImage.map((data) => {
          return (
            <img
              width={100}
              height={100}
              src={data.image}
              alt="Morning Sunrise view of Everest"
            />
          );
        })}
      </ul>
      <button onClick={logOut} className="btn btn-primary">
        Log Out
      </button>
    </div>
  );
}

export default App;
