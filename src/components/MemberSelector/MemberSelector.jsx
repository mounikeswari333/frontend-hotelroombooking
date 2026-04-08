import { FaMinus, FaPlus } from "react-icons/fa";
import "./MemberSelector.css";

function MemberSelector({ members, setMembers }) {
  return (
    <div className="member-selector-container">
      <div className="member-group">
        <div>
          <p className="member-name">Adults</p>
          <p className="member-subtitle">Ages 13 or above</p>
        </div>
        <div className="counter">
          <button
            onClick={() =>
              setMembers({
                ...members,
                adults: Math.max(0, members.adults - 1),
              })
            }
          >
            <FaMinus />
          </button>
          <span>{members.adults}</span>
          <button
            onClick={() =>
              setMembers({ ...members, adults: members.adults + 1 })
            }
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <div className="member-group">
        <div>
          <p className="member-name">Children</p>
          <p className="member-subtitle">Ages 2–12</p>
        </div>
        <div className="counter">
          <button
            onClick={() =>
              setMembers({
                ...members,
                children: Math.max(0, members.children - 1),
              })
            }
          >
            <FaMinus />
          </button>
          <span>{members.children}</span>
          <button
            onClick={() =>
              setMembers({ ...members, children: members.children + 1 })
            }
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <div className="member-group">
        <div>
          <p className="member-name">Infants</p>
          <p className="member-subtitle">Under 2</p>
        </div>
        <div className="counter">
          <button
            onClick={() =>
              setMembers({
                ...members,
                infants: Math.max(0, members.infants - 1),
              })
            }
          >
            <FaMinus />
          </button>
          <span>{members.infants}</span>
          <button
            onClick={() =>
              setMembers({ ...members, infants: members.infants + 1 })
            }
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemberSelector;
