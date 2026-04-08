import { FaTimes } from "react-icons/fa";
import "./MemberSelector.css";

const roomOptions = [1, 2, 3, 4, 5, 6];
const passengerOptions = [0, 1, 2, 3, 4];
const childAgeOptions = ["2 years", "3 years", "4 years", "5 years", "6 years"];

function MemberSelector({ roomGroups, setRoomGroups }) {
  const updateRoomCount = (nextCount) => {
    const normalizedCount = Number(nextCount);

    setRoomGroups((prevRooms) => {
      if (normalizedCount > prevRooms.length) {
        const extraRooms = Array.from(
          { length: normalizedCount - prevRooms.length },
          () => ({
            adults: 2,
            children: 0,
            childAges: [],
          }),
        );

        return [...prevRooms, ...extraRooms];
      }

      return prevRooms.slice(0, normalizedCount);
    });
  };

  const updateRoom = (index, field, value) => {
    setRoomGroups((prevRooms) =>
      prevRooms.map((room, roomIndex) => {
        if (roomIndex !== index) {
          return room;
        }

        if (field === "children") {
          const nextChildren = Number(value);
          return {
            ...room,
            children: nextChildren,
            childAges: Array.from(
              { length: nextChildren },
              (_, childIndex) =>
                room.childAges?.[childIndex] || childAgeOptions[0],
            ),
          };
        }

        return {
          ...room,
          [field]: Number(value),
        };
      }),
    );
  };

  const removeRoom = (index) => {
    setRoomGroups((prevRooms) =>
      prevRooms.filter((_, roomIndex) => roomIndex !== index),
    );
  };

  const updateChildAge = (roomIndex, childIndex, value) => {
    setRoomGroups((prevRooms) =>
      prevRooms.map((room, index) => {
        if (index !== roomIndex) {
          return room;
        }

        const nextChildAges = [...(room.childAges || [])];
        nextChildAges[childIndex] = value;

        return {
          ...room,
          childAges: nextChildAges,
        };
      }),
    );
  };

  return (
    <div className="member-selector-container">
      <div className="member-selector-header">
        <h3>Select Rooms & Passengers</h3>
      </div>

      <div className="room-count-row">
        <span className="room-count-label">No. of Rooms</span>
        <select
          className="room-count-select"
          value={roomGroups.length}
          onChange={(event) => updateRoomCount(event.target.value)}
        >
          {roomOptions.map((option) => (
            <option key={option} value={option}>
              {option} Room{option > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="room-list">
        {roomGroups.map((room, roomIndex) => {
          const totalPassengers = room.adults + room.children;
          const isOverLimit = totalPassengers > 4;

          return (
            <div
              key={roomIndex}
              className={`room-passenger-card ${isOverLimit ? "warning" : ""}`}
            >
              <div className="room-passenger-card-header">
                <h4>Room {roomIndex + 1}</h4>

                {roomGroups.length > 1 && (
                  <button
                    type="button"
                    className="remove-room-btn"
                    onClick={() => removeRoom(roomIndex)}
                    aria-label={`Remove room ${roomIndex + 1}`}
                    title="Remove room"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <div className="room-pickers">
                <label>
                  Adults
                  <select
                    value={room.adults}
                    onChange={(event) =>
                      updateRoom(roomIndex, "adults", event.target.value)
                    }
                  >
                    {passengerOptions.map((option) => (
                      <option key={option} value={option}>
                        {option} Adult{option !== 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Children
                  <select
                    value={room.children}
                    onChange={(event) =>
                      updateRoom(roomIndex, "children", event.target.value)
                    }
                  >
                    {passengerOptions.map((option) => (
                      <option key={option} value={option}>
                        {option} Children
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {room.children > 0 && (
                <div className="child-ages-list">
                  {Array.from({ length: room.children }).map(
                    (_, childIndex) => (
                      <div key={childIndex} className="child-age-row">
                        <span>Child {childIndex + 1}</span>
                        <select
                          value={
                            room.childAges?.[childIndex] || childAgeOptions[0]
                          }
                          onChange={(event) =>
                            updateChildAge(
                              roomIndex,
                              childIndex,
                              event.target.value,
                            )
                          }
                        >
                          {childAgeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <span className="child-age-unit">years</span>
                      </div>
                    ),
                  )}
                </div>
              )}

              {isOverLimit && (
                <div className="passenger-warning">
                  Please note that a maximum of four passengers are permitted
                  per hotel room. Kindly review and update the package based on
                  the revised passenger list.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MemberSelector;
