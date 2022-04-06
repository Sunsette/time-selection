import "./App.css";
import { useState, useEffect } from "react";
import { getDeliveryDates, getDeliveryTimes } from "./api";

function App() {
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem("selectedDate");
    const initialValue = JSON.parse(saved);
    return initialValue || null;
  });
  const [selectedTime, setSelectedTime] = useState(() => {
    const saved = localStorage.getItem("selectedTime");
    const initialValue = JSON.parse(saved);
    return initialValue || null;
  });
  const [inHomeAvailable, setinHomeAvailable] = useState(() => {
    const saved = localStorage.getItem("inHomeAvailable");
    const initialValue = JSON.parse(saved);
    return initialValue || false;
  });
  const [timeObj, setTimeObj] = useState(null);

  useEffect(() => {
    let mounted = true;

    if (hasConfirmed) return;

    getDeliveryDates().then((deliveryDates) => {
      if (mounted) {
        setDates(deliveryDates);
      }
    });
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!selectedDate) return;

    getDeliveryTimes(selectedDate).then((deliveryTimes) => {
      if (mounted) {
        setTimes(deliveryTimes);
      }
    });
    return () => (mounted = false);
  }, [selectedDate]);

  useEffect(() => {
    const timeObj = times.find((time) => time.deliveryTimeId === selectedTime);
    setTimeObj(timeObj);
  }, [selectedTime, times]);

  useEffect(() => {
    localStorage.setItem("selectedDate", JSON.stringify(selectedDate));
    localStorage.setItem("selectedTime", JSON.stringify(selectedTime));
    localStorage.setItem("inHomeAvailable", JSON.stringify(inHomeAvailable));
  }, [selectedDate, selectedTime, inHomeAvailable]);


  return (
    <div className="container">
      {hasConfirmed ? (
        <div className="row">
          <h1>Time has been confimed!</h1>
          <h5>Date: {selectedDate}</h5>
          <h5>
            From: {timeObj.startTime}, To: {timeObj.stopTime}
          </h5>
          <h5>
            {timeObj.inHomeAvailable
              ? "Home delivery selected"
              : "No Home delivery"}
          </h5>
          <button
            className="btn btn-primary"
            onClick={() => setHasConfirmed(!hasConfirmed)}
          >
            Change time
          </button>
        </div>
      ) : (
        <div className="row">
          <h1>Please Select Date</h1>
          <label>
            <input
              className="form-check-input me-1"
              type="checkbox"
              name="homedelivery"
              value=""
              checked={inHomeAvailable}
              aria-label="..."
              onChange={() => setinHomeAvailable(!inHomeAvailable)}
            ></input>
            Show Only Home Deliveries
          </label>
          <div className="col py-2">
            <ul className="list-group">
              {dates.map((date, index) => (
                <li className="list-group-item" key={`date${index}`}>
                  <label>
                    <input
                      className="form-check-input me-1"
                      type="radio"
                      name="date"
                      value={date}
                      checked={selectedDate === date}
                      aria-label="..."
                      onChange={() => setSelectedDate(date)}
                    ></input>
                    {date}
                  </label>
                  {selectedDate === date ? (
                    <div>
                      <h3>Please Select Time</h3>
                      <ul className="list-group">
                        {times
                          .filter((time) =>
                            !inHomeAvailable ? true : time.inHomeAvailable
                          )
                          .sort((a, b) => {
                            if (a.startTime < b.stopTime) {
                              return -1;
                            }
                            if (a.startTime > b.stopTime) {
                              return 1;
                            }
                            return 0;
                          })
                          .map((time, i) => (
                            <li className="list-group-item" key={`time${i}`}>
                              <label>
                                <input
                                  className="form-check-input me-1"
                                  type="radio"
                                  name="time"
                                  value={time.deliveryTimeId}
                                  aria-label="..."
                                  checked={selectedTime === time.deliveryTimeId}
                                  onChange={() =>
                                    setSelectedTime(time.deliveryTimeId)
                                  }
                                ></input>
                                From: {time.startTime}, To: {time.stopTime}
                                {time.inHomeAvailable ? (
                                  <i className="fa-solid fa-house"></i>
                                ) : null}
                              </label>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
          <div className="row">
            <div className="col">
              <button
                className="btn btn-primary"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setHasConfirmed(!hasConfirmed)}
              >
                Confirm time
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
